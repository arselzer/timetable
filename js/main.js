/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 */

var width = 800
var height = 540

var tt = $("#timetable")

$.getJSON("timetable.json", function(data) {

  var periods = {}
  Object.keys(data.periods).forEach(function(key) {
    var period = data.periods[key]

    var t1 = period.time[0]
        t2 = period.time[1]

    period.timeDifference = t2.split(":")[0] * 60 + parseInt(t2.split(":")[1])
        - t1.split(":")[0] * 60 + parseInt(t1.split(":")[1])

    period.width = (width - 32) / Object.keys(data.periods).length

    periods[key] = period
  })

  var weeks = data.weeks
  var classes = data.classes

  var columns = periods.length

  console.log(periods)
  console.log(data)

  var header = $("<div>")
    .addClass("header")

})
