<p align="center">
  <img src="https://raw.github.com/facet/gatekeeper/master/assets/facet.png" />
</p>
# Facet Platform

Provides extensible common utility classes for rapid JSON API development. Offers the following functionality:

* Abstration of middleware specific code for framework agnostic use
* Handling of request/response lifecycle
* Built in CRUD functionality via find, findOne, create, update, delete functions for any resource you create
* Management of event bus (aka [Intercom](https://github.com/facet/intercom)) used for decoupled module communication

test

## Examples

#### Creating a new resource API class

See the [facet core module](https://github.com/facet/core) for details on creating API resources.

```js
var ApiCore = require('facet-core').ApiCore;

var TodosAPI = function(facet.moduleOptions) {
  // define mongoose schema and bind events here
  // see other facet modules for examples:
  //   https://github.com/facet/gatekeeper
  //   https://github.com/facet/category
  //   https://github.com/facet/catalog
};

/**
 * Todos API inherits from API Core which enables CRUD functionality.
 * The definition of new facet classes would be done in a different 
 * module which depends on facet-core
 */
util.inherits(TodosAPI, ApiCore);
```

#### Setting up a JSON API server using express 4

```js
var facet = require('facet-platform')(),
  app = require('express')();

// set up facet modules
facet
  .useModules({
    'todo': require('./path-to-todos')
  })
  .setModuleOptions({dbServer: 'mongodb://localhost:27017'})
  .init(app);

app.use(bodyParser.json());
app.set('port', process.env.PORT || 9393);

// auto route binding for CRUD routes:
// GET /todos
// GET /todos/:id
// POST /todos
// PUT /todos/:id
// DELETE /todos/:id
// Advanced route binding across different domains is
// possible as well. See The facet-commerce for an example.
app.use( '/api/v1', facet.getModule('todo').bindRoutes( express.Router(), {
  routeBase: '/todos'
}));
  
http.createServer(app).listen(8888, function(){
  console.log('Express server listening on port 8888');
});
```

Also checkout out the [sample app](https://github.com/facet/platform/blob/master/sample-apps/auto-route-binding.js).


#### Using CRUD functions directly or in custom implementations

```js
var facet = require('facet-platform');

// create a todo
var importantTodo = {
  author: 'Action Bronson',
  task: 'Kick back'
}

todosAPI.create(importantTodo)
  .then(function(data) {
    console.log('created task: ', data);
  },
  function(err) {
    console.log('booo: ', err);
  })
  .end();

// query.conditions, query.fields, and query.options 
// are regular mongoose queries
var findQuery = {
  conditions: {task: 'Kick back'},
  fields: '',
  options: {
    lean: true
  }
}

// TodosAPI.find() is a wrapper for mongoose's find(), same 
// with findOne(), create(), remove() and update()

TodosAPI.find(query, successCb, errorCb);

// or via promises

TodosAPI.find(query)
  .then(function(data) {
    console.log('success! ', data);
  },
  function(err) {
    console.log('booo: ', err);
  })
  .end();
```

## Coming Soon...

* actual documentation and example apps
* multitenancy support w/ multiple apps per tenant
* error handling base class
* logging functionlality 
