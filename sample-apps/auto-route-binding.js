var express = require('express'),
  app = express(),
  http = require('http'),
  bodyParser = require('body-parser'),
  facet = require('facet-platform')();

// set up facet modules
facet
  .useModules({
    'gatekeeper': require('facet-gatekeeper'),
    'commerce': require('facet-commerce')
  })
  .setModuleOptions({dbServer: 'mongodb://localhost:27017'})
  .init(app);

app.use(bodyParser.json());
app.set('port', process.env.PORT || 9393);

// route handlers
// users/groups/auth
app.use( '/api/v1', facet.getModule('gatekeeper').bindRoutes( express.Router(), {
  routes: [{
    routeBase: '/users',
    resourceReference: 'Users'
  },
  {
    routeBase: '/groups',
    resourceReference: 'Groups'
  },
  {
    routeBase: '/auth',
    resourceReference: 'Auth'
  }]
}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
