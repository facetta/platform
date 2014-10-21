<p align="center">
  <img src="https://raw.github.com/facet/gatekeeper/master/assets/facet.png" />
</p>
# Facet Platform

Provides extensible common utility classes for rapid JSON API development. Offers the following functionality:

* Abstration of middleware specific code for framework agnostic use.
* Hanlding of request/response lifecycle
* Built in CRUD functionality via find, findOne, create, update, delete functions for any resource you create
* Management of event bus (aka [Intercom](https://github.com/facet/intercom)) used for decoupled module communication.


## Examples

#### Creating a new resource API class

```js
var facet = require('facet-platform'),
  ApiCore = facet.ApiCore;

var TodosAPI = function ( options ){
  // define mongoose schema and bind events here
  // see other facet modules for examples:
  //   https://github.com/facet/gatekeeper
  //   https://github.com/facet/category
  //   https://github.com/facet/catalog
};

/**
 * Todos API inherits from API Core which enables CRUD functionality
 */
util.inherits(TodosAPI, ApiCore);

todosAPI = new TodosAPI(facet.moduleOptions);
```

#### Setting up an application using express 4

```js
var facet = require('facet-platform'),
  ApiCore = facet.ApiCore,
  app = require('express')();

// platform init
facet.init();

// auto route binding for CRUD routes:
// GET /todos
// GET /todos/:id
// POST /todos
// PUT /todos/:id
// DELETE /todos/:id
app.use( '/api/v1', todosAPI.bindRoutes( express.Router(), {
  route: {
    routeBase: '/todos',
    resourceReference: 'TodosAPI',
  }}));
  
http.createServer(app).listen(8888, function(){
  console.log('Express server listening on port 8888');
});
```


#### Using CRUD functions directly or in custom implementations

```js
var facet = require('facet-platform'),
  ApiCore = facet.ApiCore;

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
;
```

## Coming Soon...

* actual documentation and example apps
* multitenancy support w/ multiple apps per tenant
* error handling base class
* logging functionlality 
