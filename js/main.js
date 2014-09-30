/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 * Apache-2 License
 */

var tt = $(".timetable")

function setMode(mode) {
  window.sessionStorage.setItem("mode", mode)
}

function getMode() {
  return window.sessionStorage.getItem("mode") || null
}

function render(mode, tt, data) {
  switch (mode) {
  case "phone":
    renderTimetablePhone(tt, data)
    break;

  case "default":
  default:
    renderTimetableScreen(tt, data)
    break;
  }
}

$.getJSON("timetable.json", function(data) {
  if (isMobile.phone) {
    setMode("phone")
  }
  setMode("phone")

  render(getMode(), tt, data)
}).fail(function(err) {
  console.log(err)
})
