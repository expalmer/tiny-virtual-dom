# Tiny Virtual Dom

Just a tiny virtual dom implementation.

# But Why ?

With the purpose of learning.

> Thanks for the awesome post by [deathmood](https://twitter.com/_deathmood) => [how to write your own virtual dom](https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060)


## Code Example

Using the browser version.

````javascript

const { h, patch } = tinyVirtualDom;

const $rootElement = document.getElementById('app');

var currentTree = h('ul', null,
    h('li', { style: { color: '#090' } }, 'One'),
    h('li', { style: { color: '#900' } }, 'Two'),
    h('li', { style: { color: '#009' } }, 'Three')
  );

// first time
patch($rootElement, currentTree);

// wait 2 secs
setTimeout(() => {
  let nextTree = h('ul', null,
    h('li', { style: { color: '#090' } }, 'One'),
    h('li', { style: { color: '#909' } }, 'Two')
  );
  patch($rootElement, nextTree, currentTree);
  currentTree = nextTree;
}, 2000);

// wait 4 secs
setTimeout(() => {
  let nextTree = h('ul', null,
    h('li', { style: { color: '#111' } }, 'Hello'),
    h('li', { style: { color: '#999' } }, 'Hi!')
  );
  patch($rootElement, nextTree, currentTree);
  currentTree = nextTree;
}, 4000);

`````


Using Babel JSX.

````jsx
/** @jsx h */

const { h, patch } = require('../../lib');

const $rootElement = document.getElementById('app');

var currentTree = (
  <ul>
    <li style={ { color: '#090' } }>One</li>
    <li style={ { color: '#900' } }>Two</li>
    <li style={ { color: '#009' } }>Three</li>
  </ul>
);

// first time
patch($rootElement, currentTree);

// wait 2 secs
setTimeout(() => {
  let nextTree = (
    <ul>
      <li style={ { color: '#090' } }>One</li>
      <li style={ { color: '#909' } }>Two</li>
    </ul>
  );
  patch($rootElement, nextTree, currentTree);
  currentTree = nextTree;
}, 2000);

// wait 4 secs
setTimeout(() => {
  let nextTree = (
    <ul>
      <li style={ { color: '#111' } }>Hello</li>
      <li style={ { color: '#999' } }>Hi!</li>
    </ul>
  );
  patch($rootElement, nextTree, currentTree);
  currentTree = nextTree;
}, 4000);

````

## See the examples:

- [Sample](examples/sample)
- [To Do List](examples/todo)


## Tests

```bash
yarn test
```



