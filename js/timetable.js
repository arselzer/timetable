/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 * Apache-2 License
 */

/* TimeTable class, a timetable manager */

function TimeTable(input) {
  var totalWidth = 1000
  var labelWidth = 32
  this.width = totalWidth - labelWidth

  var self = this

  /*
    Add time in minutes to periods
    Calculate length of period
  */
  var periods = input.periods.map(function(period) {
    var t1 = period.time[0],
        t2 = period.time[1]

    period.start = t1.split(":")[0] * 60 + parseInt(t1.split(":")[1])
    period.end = t2.split(":")[0] * 60 + parseInt(t2.split(":")[1])
    period.length = period.end - period.start

    return period
  })

  // Calculate time span of timetable. assumes periods are ordered by time (should be)
  this.dayTime = periods[periods.length-1].end - periods[0].start

  // Calculate physical width of periods
  this.periods = periods.map(function(period) {
    period.width = self.width / (self.dayTime / period.length)
    return period
  })

  // Calculate distances to next periods (break)
  for (var i = 0; i < this.periods.length - 1; i++) {
    var period1 = this.periods[i],
        period2 = this.periods[i+1]

    period1.distanceToNext = this.width / (this.dayTime / (period2.start - period1.end))
  }

  this.weeks = input.weeks
  this.classes = input.classes
  this.weekDates = input.week_dates

  /*
    weeks = weeks, days, classes per day
    periods = period definitions
    classes = class definitions
  */

  var currentWeek = this.getCurrentWeek()

  if (!currentWeek)
    return console.log("fail!")

}

TimeTable.prototype = {
  getRenderData: function(week) {
    var days = []
    var self = this;
    for (var key in week.days) {
      var day = week.days[key]
      /*
        Classes are transformed to Easy-to-render "sections"
        Sections are basically lessons.
      */
      var sections = []

      day.classes.forEach(function(cl) {
        var classDefinition
        var fullPeriods = []

        self.classes.forEach(function(definedClass) {
          if (cl.name === definedClass.name)
            classDefinition = definedClass
        })

        self.periods.forEach(function(period) {
          cl.periods.forEach(function(period2) {
            if (period.name === period2) {
              fullPeriods.push(period)
            }
          })
        })

        var sectionWidth = fullPeriods[fullPeriods.length-1].end - fullPeriods[0].start

        cl.class = classDefinition
        cl.width = self.width / (self.dayTime / sectionWidth)
        cl.periods = fullPeriods
        cl.name = cl.name
        cl.type = cl.class.type
        if (!cl.room) {
          cl.room = cl.class.room
        }

        sections.push(cl)
      })

      // add spaces between classes
      for (var i = 0; i < day.classes.length - 1; i++) {
        var curClass = day.classes[i],
            nextClass = day.classes[i+1]

        curClass.timeToNext = (nextClass.periods[0].start - curClass.periods[curClass.periods.length-1].end)

        curClass.distanceToNext = this.width / (this.dayTime / curClass.timeToNext)
      }
      days.push({"name": key, "sections": sections})
    }
    return days
  },
  getCurrentWeek: function() {
    var currentDate = new Date()
    console.log(currentDate)

    var foundWeekName

    // Week A, Week B and so
    for (var key in this.weekDates) {
      var week = this.weekDates[key]

      var found = false

      // [month, day, year] pairs
      week.forEach(function(start) {
        var day = start[0]
        var month = start[1]
        var year = start[2]
        var weekStart = new Date(year, month - 1, day)

        var sevenDays = 7 * 24 * 60 * 60 * 1000

        var difference = currentDate - weekStart

        console.log(key, start, difference / (1000 * 60 * 60) / 24, difference)

        if ((difference < sevenDays) && (difference > 0)) {
          console.log(true)
          found = true
        }
      })

      if (found) {
        foundWeekName = key
      }
    }

    return this.getWeek(foundWeekName) || null
  },
  getWeek: function(name) {
    var found
    this.weeks.forEach(function(w) {
      if (w.name === name)
        found = w
    })

    return found
  }
}
