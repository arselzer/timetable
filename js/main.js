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
  case "mobile":
    renderTimetablePhone(tt, data)
    break;

  case "default":
  default:
    renderTimetableScreen(tt, data)
    break;
  }
}

setMode("default")

$.getJSON("timetable.json", function(data) {
  if (isMobile.phone) {
    setMode("mobile")
  }

  render(getMode(), tt, data)

  window.onhashchange = function() {
    var hash = window.location.hash

    setMode(hash)
    render(getMode(), tt, data)
  }
}).fail(function(err) {
  console.log(err)
})
