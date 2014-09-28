/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 * Apache-2 License
 */

var tt = $(".timetable")

$.getJSON("timetable.json", function(data) {
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
  // console.log(weeks)

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
}).fail(function(err) {
  console.log(err)
})
