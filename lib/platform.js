"use strict"

var _ = require('underscore'),
  env = process.env.NODE_ENV || 'development',
  http = require('http'),
  Intercom = require('facet-intercom'),
  ResponseHandler = require('facet-response-handler'),
  Core = require('facet-core').Core;


var Platform = function() {
  // registry for storing uninstantiated api module classes
  this.apiClasses = {};

  // registry for storing api module instances
  this.apiInstances = {};

  this.moduleOptions = {
    // currently used to disbale mongoose's index checking at startup
    environment: process.env.NODE_ENV || 'development',
    
    // instance of EventEmitter2 used for inter/intra module communication
    intercom: new Intercom(),

    // allow toggling api user access checking for CRUD funcs
    doAccessCheck: false,

    // defines the middleware function format to use for auto route binding
    middlewareType: 'connect'

    // supported values are basic & jwt, basic is default
    // apiAuthMethod: 'basic',
    
    // optional, used for jwt implementation
    // apiSecret: 'SOME_SECRET_STRING',
  };
};



Platform.prototype.setModuleOptions = function(options) {
  this.moduleOptions = _.extend(this.moduleOptions, options);

  // ensure a db key exists
  if( !this.moduleOptions.db ) {
    var mongoose = require('mongoose');
    mongoose.connect( options.dbServer, { server: { socketOptions: { keepAlive: 1 } } });
    mongoose.connection.on( 'error', console.error.bind( console, 'connection error:' ) );  
    this.moduleOptions.db = mongoose;
  }

  return this;
};


Platform.prototype.useModules = function(modules) {
  if(!modules) {
    throw new Error('An object containing module aliases and classes is required.');
  }

  for(var key in modules) {
    this._apiClasses[key] = modules[key];
  }

  return this;
}

Platform.prototype.getModuleOptions = function() {
  return this.moduleOptions;
};


Platform.prototype.init = function(express) {
  // instantiate registered modules
  for(var key in this._apiClasses) {
    var apiClass = this._apiClasses[key];
    this._apiInstances[key] = new apiClass(this.getModuleOptions());
  }

  // instantiate response listener
  var responseHandler = new ResponseHandler(this.moduleOptions);
  
  // run the core facetInit class to emit the nodeStack object
  // which contains the req, res and next for the current request
  var first = Object.keys(this._apiInstances)[0];
  express.use(first.facetInit());
};


Platform.prototype.getModule = function(module, instantiated) {
  if(instantiated === undefined) {
    instantiated = true;
  }

  return (instantiated) ? this._apiInstances[module] : this._apiClasses[module];
}

module.exports = exports = Platform;
