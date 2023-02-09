var App = App || {};
App.Background = function(global, chrome) {
	this.chrome = chrome;
	this.extension = chrome.extension;
	this._start();
};

App.Background.prototype = {
	_downloadsList: {},
	_bufferingList: [],
	_start: function() {
		this.isFF = window.navigator.userAgent.indexOf("Firefox/") > 0;
		this._attachEvents();
	},
	_attachEvents: function() {
		this.chrome.runtime.onMessage.addListener(this._onMessageReceive.bind(this));
		this.chrome.downloads.onChanged.addListener(this._onDownloadsChanged.bind(this));
	},
	_onDownloadsChanged: function(info) {
		// if info.error defined - downloads canceled
		// if info.filename defined - downloads successfully started
		if (this._downloadsList[info.id]) {
			if (info.error || info.filename) {
				this.chrome.tabs.sendMessage(this._downloadsList[info.id].tabId, {
					action: "downloadsStarted",
					success: !info.error,
					data: this._downloadsList[info.id],
				}, function() {
					void chrome.runtime.lastError;
				});
				if (info.error) {
					delete this._downloadsList[info.id];
				}
			} else if (info.state.current == "complete") {
				this.chrome.tabs.sendMessage(this._downloadsList[info.id].tabId, {
					action: "downloadsCompleted",
					success: !info.error,
					data: this._downloadsList[info.id],
				}, function() {
					void chrome.runtime.lastError;
				});
				delete this._downloadsList[info.id];
			}
		}
	},
	_downloadFile: function(data, tab) {
		var url = data.url;
		var name = data.filename;
		var buffer_url = data.buffer_url;
		var playlist_id = data.playlist_id;

		if (buffer_url || !/^http.*\/index\.m3u8/.test(url)) {
			chrome.downloads.download({
				url: buffer_url || url,
				filename: name,
			}, function(d_id) {
				/*
					In Chrome this function is returned immediately after the chrome.downloads.download call,
					even if the download has not started yet and a dialog for selecting a folder has been opened.
					But in FF it is always called only after the download starts (or rejected => d_id = undefined), and chrome.downloads.onChanged don't fires when a download begins in FF.
				*/
				var u_id;
				if (d_id === undefined) {
					u_id = new Date().getTime();
				}
				this._downloadsList[d_id || u_id] = {
					url: url,
					name: name,
					tabId: tab.id,
				};
				if (this.isFF || d_id === undefined) {
					this._onDownloadsChanged({
						id: d_id || u_id,
						error: d_id === undefined,
						filename: name,
					});
				}
			}.bind(this));
		} else if (!this._bufferingList[url]) {
			var buff_item = this._bufferM3u(url, name, function onstart() {

			}.bind(this), function onprogress(perc) {
				this.chrome.tabs.sendMessage(tab.id, {
					action: "buffering",
					success: true,
					data: {
						url: url,
						name: name,
						perc: perc,
					},
				});
			}.bind(this), function onbuffer(buffer_object_url) {
				delete this._bufferingList[url];
				data.buffer_url = buffer_object_url;
				this._downloadFile(data, tab);
			}.bind(this), function onerror() {
				delete this._bufferingList[url];
				this.chrome.tabs.sendMessage(tab.id, {
					action: "buffering",
					success: false,
					data: {
						url: url,
						name: name,
					},
				});
			}.bind(this));
			buff_item && (this._bufferingList[url] = buff_item, this._bufferingList[url].playlist_id = playlist_id);
		}
	},
	_onMessageReceive: function(request, sender, sendresponse) {
		var action = request.action;
		var data = request.data || {};

		if (action === "download") {
			this._onDownloadRequest(data, sender.tab);
		} else if (action === "stop_buffering") {
			for (var key in this._bufferingList) {
				if (data === undefined || this._bufferingList[key].playlist_id == data.playlist_id) {
					this._bufferingList[key].stop();
					delete this._bufferingList[key];
				}
			}
		}
	},
	_onDownloadRequest: function(data, tab) {
		if (!data.url || !data.filename)
			return;

		this._downloadFile(data, tab);
	},
	_bufferM3u: function(m3u_url, filename, onstart, onprogress, onbuffer, onerror, load_data) {
		if (load_data === undefined) {
			load_data = {
				frags_data_arr: [],
				startPosition: -1,
				last_error: {},
			};
		}
		var _this = this;
		var frag_data = null;
		var frags_data_arr = load_data.frags_data_arr;
		var frags_count = 0;
		var remove8bytesheader = false;
		var media_error_count = 0;
		var last_error = load_data.last_error;
		if (Hls.isSupported()) {
			var audio = document.createElement("audio");
			var hls = new Hls({
				enableWorker: false,
				defaultAudioCodec: "mp3",
				startPosition: load_data.startPosition,
			});
			var idle_timeout = null;
			var clear = function() {
				hls.stopLoad();
				hls.destroy();
				frag_data = null;
				frags_data_arr = null;
				idle_timeout && clearTimeout(idle_timeout);
				idle_timeout = null;
			};

			hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
				frags_count = data.levels[0].details.fragments.length;
				var path = data.levels[0].details.url.match(/^http.*\//);
				var size = 0;
				if (path) {
					path = path[0];
					for (var i = 0; i < frags_count; i++) {
						if (!/^http/.test(data.levels[0].details.fragments[i].relurl)) {
							data.levels[0].details.fragments[i].relurl = path + data.levels[0].details.fragments[i].relurl;
						}
						size += data.levels[0].details.fragments[i].loaded;
					}
				}
				onstart && onstart();
			});
			hls.on(Hls.Events.BUFFER_CODECS, function(event, data) {
				// not sure why: not all audio players can play mp4 audio correct, but without first 8 header bytes all is ok
				remove8bytesheader = (data.audio && data.audio.container == "audio/mp4");
			});
			hls.on(Hls.Events.BUFFER_APPENDING, function(event, data) {
				frag_data = data.data;
			});
			hls.on(Hls.Events.FRAG_BUFFERED, function(event, data) {
				if (frag_data) {
					frags_data_arr.push(remove8bytesheader ? frag_data.slice(8, frag_data.length) : frag_data);
				}

				audio.currentTime = data.frag.start + data.frag.duration;

				var frags_saved = frags_data_arr.length;
				onprogress && onprogress(Math.round(frags_saved / frags_count * 100));

				// sometimes hls stops load music without any errors
				idle_timeout && clearTimeout(idle_timeout);
				idle_timeout = setTimeout(function() {
					hls_on_ERROR(null, last_error);
				}, 7000);

				if (frags_saved >= frags_count) {
					// full buffered

					var total_length = frags_data_arr.reduce(function(prev, cur) {
						return prev + cur.length;
					}, 0);
					var total_data = new Uint8Array(total_length);
					var offset = 0;
					frags_data_arr.forEach(function(element) {
						total_data.set(element, offset);
						offset += element.length;
					});

					clear();
					var blob;
					blob = new Blob([total_data], { type: "application/octet-stream" });
					onbuffer && onbuffer(window.URL.createObjectURL(blob));
				}
			});

			function hls_on_ERROR(event, data) {
				last_error = data;
				if (data.details == "bufferFullError" || data.details == "fragLoadError") {
					var load_data = {
						frags_data_arr: frags_data_arr.map(function(frag_arr) {
							return frag_arr.slice();
						}),
						startPosition: audio.currentTime,
						last_error: last_error,
					};
					clear();
					_this._bufferM3u(m3u_url, filename, onstart, onprogress, onbuffer, onerror, load_data);
					return;
				}
				if (data.type == Hls.ErrorTypes.MEDIA_ERROR && media_error_count < 2) {
					media_error_count++;
					if (media_error_count > 1) {
						hls.swapAudioCodec();
					}
					hls.recoverMediaError();
					return;
				}

				clear();
				onerror && onerror();
			}

			hls.on(Hls.Events.ERROR, hls_on_ERROR);

			hls.loadSource(m3u_url);
			hls.attachMedia(audio);
			return {
				stop: clear,
			};
		} else {
			onerror && onerror();
			return null;
		}
	},
};
new App.Background(window, chrome);
// add and hide special headers for file
chrome.webRequest.onBeforeSendHeaders.addListener(function(info) {
		if (/vk/.test(info.url) && /gl_audio\.php/.test(info.url)) {
			var headers = [];
			for (var i = 0; i < info.requestHeaders.length; i++) {
				if ((!/^X\-/.test(info.requestHeaders[i].name)) && (!/DNT/.test(info.requestHeaders[i].name)) && (!/Origin/.test(info.requestHeaders[i].name))) {
					headers.push(info.requestHeaders[i]);
				}
			}
			headers.push({ "name": "VKmusicAudio", "value": "584941" });
			return { requestHeaders: headers };
		}
	},
	{ urls: ["http://*/*", "https://*/*"] },
	["blocking", "requestHeaders"],
);