"use strict"

var _ = require('underscore'),
  env = process.env.NODE_ENV || 'development',
  http = require('http'),
  Intercom = require('facet-intercom'),
  ResponseHandler = require('facet-response-handler'),
  Core = require('facet-core').Core;


var Platform = function(options) {
  options = (options) ? options : {};

  this.defaultOptions = {
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

  if( !options.db ) {
    // connect to db
    var mongoose = require('mongoose');
    mongoose.connect( options.dbServer, { server: { socketOptions: { keepAlive: 1 } } });
    mongoose.connection.on( 'error', console.error.bind( console, 'connection error:' ) );  
    this.defaultOptions.db = mongoose;
  }

  this.moduleOptions = _.extend(this.defaultOptions, options);
};

Platform.prototype.init = function(express) {
  var responseHandler = new ResponseHandler(this.moduleOptions);
  var core = new Core(this.moduleOptions);
  express.use(core.facetInit());
};

Platform.prototype.getModuleOptions = function() {
  return this.moduleOptions;
};

module.exports = exports = Platform;
