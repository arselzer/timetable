/*
 *  Copyright © (c) 2014 Alexander Selzer <aselzer3@gmail.com>
 * Apache-2 License
 */

function rgb(r, g, b) {
  return "rgb(" + r + "," + g + "," + b + ")"
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

// wtf, firefox
localStorage_ = {}

localStorage_.getItem = function(key) {
  return this[key]
}

localStorage_.setItem = function(key, value) {
  this[key] = value
}

window.localStorage = localStorage_
