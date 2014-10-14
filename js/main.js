/*
 * Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 * Apache-2 License
 */

var tt = $(".timetable")

function onModeChange() {}

function setMode(mode) {
  // Make current mode button look selected
  $(".menu-bar .item").removeClass("current")
  $(".menu-bar .item[data-mode='" + mode + "']").addClass("current")

  storage.set("mode", mode)
  onModeChange();
}

function getMode() {
  return storage.get("mode") || null
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

$.getJSON("timetable.json", function(data) {
  onModeChange = function() {
    tt.remove()
    tt = $("<div class='timetable'>")
    $(".main").append(tt)

    render(getMode(), tt, JSON.parse(JSON.stringify(data))) // clone object
  }

  if (!getMode()) {
    if (isMobile.phone) {
      setMode("mobile")
    }
    else {
      setMode("default")
    }
  }
  else {
    setMode(getMode())
  }

}).fail(function(err) {
  console.log(err)
})

$(".menu-bar .item").on("click", function() {
  var mode = $(this).data("mode")

  setMode(mode)
})
