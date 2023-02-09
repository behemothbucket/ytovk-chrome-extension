export const Config = {
	OAUTH_URL: "https://oauth.vk.com/authorize?client_id=51541412&scope=audio,offline&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token",
	OAUTH_TOKEN_PAGE_PATTERN: /oauth\.vk\.com\/blank\.html#access_token/,
	YOUTUBE_VIDEO_PAGE_PATTERN: /youtube.com\/watch/,
	VK_PLAYLIST_ALBUM_PATTERN: /(-?\d+)_(\d+)/,
};