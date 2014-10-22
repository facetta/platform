"use strict"

var Platform = require('./platform');
  // Core = require('facet-core').Core,
  // ApiCore = require('facet-core').ApiCore,
  // CoreSchema = require('facet-core').CoreSchema;

module.exports = exports = {
  init: function(express, options) {
    var platform = new Platform(options);
    platform.init(express);
    this.moduleOptions = platform.getModuleOptions();
    // this.Core = Core;
    // this.ApiCore = ApiCore;
    // this.CoreSchema = CoreSchema;
  }
};
