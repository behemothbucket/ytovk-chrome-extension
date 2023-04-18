import { changePopupAndCurrenLocation } from "../../scripts/location.js";

let buttonBack = document.querySelector(".button_back");
buttonBack.classList.toggle("loaded-state");

buttonBack.addEventListener("click", () => {
  changePopupAndCurrenLocation("form");
});
