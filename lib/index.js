"use strict"

var Platform = require('./platform');

function createPlatform() {
  var platform = new Platform();
  return platform;
}

module.exports = exports = createPlatform;