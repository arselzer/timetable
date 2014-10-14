/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 * Apache-2 License
 */

function rgb(r, g, b, a) {
  return (a ? "rgba(" :"rgb(") + r + "," + g + "," + b + (a ? "," + a : "") + ")"
}

function getTextColorFromBackground(c) {
  function brightness(r, g, b) {
    // http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
    return (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255
  }

  // http://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
  if (brightness(c.r, c.g, c.b) > 0.5) {
    return rgb(34, 34, 34)
  }
  else {
    return rgb(222, 222, 222)
  }
}

/* sessionStorage -> localStorage -> local variables fallback */

var storage = {}

storage.getItem = function(key) {
  var res
  try {
    console.log("sessionStorage")
    res = window.sessionStorage.getItem(key)
  }
  catch (err) {
    try {
      console.log("localStorage")
      res = window.localStorage.getItem(key)
    }
    catch (err2) {
      console.log("fallback")
      res = this[key]
    }
  }
  return res
}
storage.get = storage.getItem

storage.setItem = function(key, value) {
  try {
    sessionStorage.setItem(key, value)
  }
  catch (err) {
    try {
      window.localStorage.setItem(key, value)
    }
    catch (err2) {
      this[key] = value
    }
  }
}
storage.set = storage.setItem

window.storage = storage
