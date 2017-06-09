# fast-resolve

Resolve a maybe-promise object as synchrously as posibble.

## Docs

#### fastResolve(what, success, failure)

* `what` is a maybe-promise object.
* `success` is a function.
* `failure` is a function.
* return a maybe-promise object.

#### fastResolveAll(array, success, failure)

* `array` is a array of maybe-promise object.
* `success` is a function. 
* `failure` is a function.
* return a maybe-promise object.

## Usage

```js
const { fastResolve, fastResolveAll } = require('fast-resolve');

fastResolve(what, value => {
  // resolveed or non-promise
}, error => {
  // rejected
});

fastResolveAll(array, value => {
  // all resolved or all non-promise
}, error => {
  // any reject
});
```
