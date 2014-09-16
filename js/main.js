/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 */


var totalWidth = 1000
var labelWidth = 32
var width = totalWidth - labelWidth
// height is dynamic, determined by CSS

var tt = $(".timetable")

$.getJSON("timetable.json", function(data) {

  /*
    Add time in minutes to periods
    Calculate length of period
  */
  var periods = data.periods.map(function(period) {
    var t1 = period.time[0],
        t2 = period.time[1]

    period.start = t1.split(":")[0] * 60 + parseInt(t1.split(":")[1])
    period.end = t2.split(":")[0] * 60 + parseInt(t2.split(":")[1])

    period.length = period.end - period.start

    return period
  })

  // Calculate time span of timetable
  var dayTime = periods[periods.length-1].end - periods[0].start

  // Calculate physical width of periods
  periods = periods.map(function(period) {
    period.width = width / (dayTime / period.length)
    return period
  })

  // Calculate distances to next periods (break)
  for (var i = 0; i < periods.length - 1; i++) {
    var period1 = periods[i],
        period2 = periods[i+1]

    period1.distanceToNext = width / (dayTime / (period2.start - period1.end))
  }

  /*
    weeks = weeks, days, classes per day
    periods = period definitions
    classes = class definitions
  */

  var weeks = data.weeks
  var classes = data.classes
  var weekDates = data.week_dates
  console.log(weeks)

  var currentWeek = getCurrentWeek(weeks, weekDates)//weeks[0] // TODO, make dynamic

  /* Create timetable header */

  var header = $("<div>")
    .addClass("header")

  periods.forEach(function(period) {
    header.append($("<div>")
      .text(period.name)
      .addClass("period")
      .css("width", period.width)
      .css("margin-right", period.distanceToNext))
  })

  tt.append(header)

  /* Render Timetable */

  for (var key in currentWeek.days) {
    var day = currentWeek.days[key]
    console.log(day)

    // row = one day
    var row = $("<div>")
      .addClass("day")

    // day name
    row.append($("<div>")
      .addClass("name")
      .text(key))

    /*
      Classes are transformed to Easy-to-render "sections"
      Sections are basically lessons.
    */
    var sections = []

    day.classes.forEach(function(cl) {
      var classType
      var fullPeriods = []

      classes.forEach(function(definedClass) {
        if (cl.name === definedClass.name)
          classType = definedClass
      })

      periods.forEach(function(period) {
        cl.periods.forEach(function(period2) {
          if (period.name === period2) {
            fullPeriods.push(period)
          }
        })
      })

      var sectionWidth = fullPeriods[fullPeriods.length-1].end - fullPeriods[0].start

      cl.class = classType
      cl.width = width / (dayTime / sectionWidth)
      cl.periods = fullPeriods
      cl.name = cl.name

      sections.push(cl)
    })

    // add spaces between classes
    for (var i = 0; i < day.classes.length - 1; i++) {
      var curClass = day.classes[i],
          nextClass = day.classes[i+1]
          console.log(curClass)

      curClass.timeToNext = (nextClass.periods[0].start - curClass.periods[curClass.periods.length-1].end)

      curClass.distanceToNext = width / (dayTime / curClass.timeToNext)
    }

    sections.forEach(function(section) {
      var sectionDiv = $("<div>")
        .css("width", section.width)
        .css("background-color", section.class.color)
        .addClass("section")

      if (section.class) {
        sectionDiv.addClass("class")
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
}).fail(function(err) {
  console.log(err)
})

function getCurrentWeek(weeks) {
  return weeks[0]
}
