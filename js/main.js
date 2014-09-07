/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 */

var width = 1000
var height = 540

var tt = $(".timetable")

$.getJSON("timetable.json", function(data) {

  // TODO check input format

  /* Add needed data to input */
  var periods = data.periods.map(function(period) {
    var t1 = period.time[0]
        t2 = period.time[1]

    period.start = t1.split(":")[0] * 60 + parseInt(t1.split(":")[1])
    period.end = t2.split(":")[0] * 60 + parseInt(t2.split(":")[1])

    period.length = period.end - period.start

    return period
  })

  var dayTime = periods[periods.length-1].end - periods[0].start

  periods = periods.map(function(period) {
    period.width = (1000 - 32) / (dayTime / period.length)
    return period
  })

  for (var i = 0; i < periods.length - 1; i++) {
    var thisPeriod = periods[i],
        nextPeriod = periods[i+1]

    thisPeriod.distanceToNext = (1000 - 32) / (dayTime / (nextPeriod.start - thisPeriod.end))
  }

  var weeks = data.weeks
  var classes = data.classes
  var periods = data.periods

  var columns = periods.length

  console.log(periods)
  console.log(dayTime)

  var header = $("<div>")
    .addClass("header")

  periods.forEach(function(period) {
    var period = $("<div>")
      .text(period.name)
      .addClass("period")
      .css("width", period.width)
      .css("margin-right", period.distanceToNext)
    header.append(period)
  })

  tt.append(header)

  var currentWeek = weeks[0] // TODO, make dynamic

  /* Render Timetable */

  for (var key in currentWeek.days) {
    var day = currentWeek.days[key]

    // row = one day
    var row = $("<div>")
      .addClass("day")

    // day name
    row.append($("<div>")
      .addClass("name")
      .text(key))

    var sections = []

    // append classes to row
    // spaces are not yet here
    day.classes.forEach(function(cl) {
      // class type of the class & periods

      // class type
      var classType
      var fullPeriods = []

      classes.forEach(function(c) {
        if (cl.name === c.name)
          classType = c
      })

      periods.forEach(function(period) {
        cl.periods.forEach(function(period2) {
          if (period.name === period2) {
            fullPeriods.push(period)
          }
        })
      })

      var width = fullPeriods[fullPeriods.length-1].end - fullPeriods[0].start

      cl.class = classType,
      cl.width = (1000 - 32) /
      (dayTime / width)
      cl.periods = fullPeriods

      sections.push(cl)
    })

    // add spaces between classes
    for (var i = 0; i < day.classes.length - 1; i++) {
      var curClass = day.classes[i],
          nextClass = day.classes[i+1]

      curClass.timeToNext = (nextClass.periods[0].start - curClass.periods[curClass.periods.length-1].end)

      curClass.distanceToNext = (1000 - 32) /
      (dayTime / curClass.timeToNext)
      console.log(curClass)
    }

    /* Classes are transformed to Easy-to-render "sections" */

    sections.forEach(function(section) {
      var sectionDiv = $("<div>")
        .css("width", section.width)
        .addClass("section")

      if (section.class) {
        sectionDiv.addClass("class")
          .css("background-color", section.class.color)
          .css("margin-right", section.distanceToNext)

        sectionDiv.append($("<div>")
          .addClass("name")
          .text(section.name))

        sectionDiv.append($("<div>")
          .addClass("teacher")
          .text(section.class.teacher))

        sectionDiv.append($("<div>")
          .addClass("room")
          .text(section.class.room))
      }

      row.append(sectionDiv)
    })

    tt.append(row)
  }

})
