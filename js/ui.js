function renderTimetableScreen(tt, data, dimensions) {
  if (window.swipe)
    window.swipe.kill()

  tt.empty()
  tt.parent().attr("style", "") // height and so
  tt.parent().removeClass("timetable-mobile")
  tt.parent().addClass("timetable-large")
  $(".current-view").show()

  var location
  if (window.location.hash.length > 0)
    location = window.location.hash.slice(1)

  var t = new TimeTable(data)

  /*
  * Create timetable header
  */

  var header = $("<div>")
    .addClass("header")

  // console.log(t.periods)
  t.periods.forEach(function(period) {
    header.append($("<div>")
      .text(period.name)
      .addClass("period")
      .css("width", period.width)
      .css("margin-right", period.distanceToNext))
  })

  tt.append(header)

  var weeks
  if (location) {
    weeks = t.getRenderData(t.getWeek(location))
  }
  else {
    weeks = t.getRenderData(t.getCurrentWeek())
  }
  console.log("location:", location)
  console.log("weeks:", weeks)

  /*
  * Create rows (days) & periods (sections)
  */

  weeks.forEach(function(day) {
    // row = one day
    var row = $("<div>")
      .addClass("day")

    // day name
    row.append($("<div>")
      .addClass("name")
      .text(day.name))

    day.sections.forEach(function(section) {
      var color = /rgb\((.*)\)/.exec(section.class.color)
      var c = color[1].split(",").map(function(val) {
        return val.trim()
      })

      var sectionDiv = $("<div>")
        .css("width", section.width)
        .css("background-color", section.class.color)
        .css("color", getTextColorFromBackground({r: c[0], g: c[1], b: c[2]}))
        .addClass("section")

      if (section.class) {
        sectionDiv.addClass("class")
          .css("margin-right", section.distanceToNext)

        if (section.type !== "free") {
          sectionDiv.append($("<div>")
            .addClass("name")
            .text(section.name))

        sectionDiv.append($("<div>")
          .addClass("teacher")
          .text(section.class.teacher))

          sectionDiv.append($("<div>")
            .addClass("room")
            .text(section.room))
        }
        else {
          section.labels.forEach(function(label) {
            sectionDiv.append($("<div>")
              .addClass("label")
              .text(label))
          })
        }
      }

      row.append(sectionDiv)

      /* Interactions */

      var currentView = $(".current-view")

      // hover popup
      sectionDiv.on("mouseover", function() {
        if (section.popupOpen !== true) {
          var timeRangeString = section.periods[0].time[0] + " - " + section.periods[section.periods.length-1].time[1]
          var popup = $('<div class="popup">')
            .text(timeRangeString)
          sectionDiv.append(popup)

          currentView.text(section.name + " " + timeRangeString)
        }
      })

      sectionDiv.on("mouseout", function() {
        if (!section.popupOpen) {
          var popup = sectionDiv.find(".popup")
          popup.remove()
          currentView.text("")
        }
      })

      // click popup toggle
      sectionDiv.on("click", function() {
        if (!section.popupOpen) {
          var timeRangeString = section.periods[0].time[0] + " - " + section.periods[section.periods.length-1].time[1]
          section.popupOpen = true
          sectionDiv.find(".popup").remove() // clear the hover popup

          var popup = $('<div class="popup">')
            .text(timeRangeString)
          sectionDiv.append(popup)

          currentView.text(section.name + " " + timeRangeString)
        }
        else {
          section.popupOpen = false
          sectionDiv.find(".popup").remove()

          currentView.text("")
        }
      })
    })
    tt.append(row)
  })
}

function renderTimetablePhone(tt, data) {
  tt.empty()
  tt.parent().addClass("timetable-mobile")

  $(".current-view").hide()

  tt.parent().css("height", ($(window).height() - 70) + "px")

  var location
  if (window.location.hash.length > 0)
    location = window.location.hash.slice(1)

  var t = new TimeTable(data)

  var slider = $("<div class='slider'>")
  tt.append(slider)
  var view = $("<div class='swipe-wrap'>")
  slider.append(view)

  window.swipe = Swipe(slider[0]);

  /**
  * Hack:
  * https://github.com/thebird/Swipe/issues/121
  */

  setTimeout(function() {
    window.swipe.setup();
  }, 10);

  var week = t.getRenderData(t.getCurrentWeek())

  week.forEach(function(day, i) {
    var dayDiv = $("<div class='day'>")

    console.log(day)

    day.sections.forEach(function(section) {
      var color = /rgb\((.*)\)/.exec(section.class.color)
      var c = color[1].split(",").map(function(val) {
        return val.trim()
      })

      var sectionDiv = $("<div>")
        .css("height", section.width * 1.4)
        .css("width", "100%")
        .css("background-color", section.class.color)
        .css("color", getTextColorFromBackground({r: c[0], g: c[1], b: c[2]}))
        .addClass("section")

      if (section.class) {
        sectionDiv.addClass("class")
          .css("margin-bottom", section.distanceToNext)

        if (section.type !== "free") {
          sectionDiv.append($("<div>")
            .addClass("name")
            .text(section.name))

        sectionDiv.append($("<div>")
          .addClass("teacher")
          .text(section.class.teacher))

          sectionDiv.append($("<div>")
            .addClass("room")
            .text(section.room))
        }
        else {
          section.labels.forEach(function(label) {
            sectionDiv.append($("<div>")
              .addClass("label")
              .text(label))
          })
        }
      }

      dayDiv.append(sectionDiv)

    })

    view.append(dayDiv)
  })
}
