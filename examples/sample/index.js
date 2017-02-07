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