const { assert, should } = require('chai');
const { h, patch } = require('../lib');

describe('h function', () => {
  it('h element', () => {
    const res = {
      type: 'p',
      props: {},
      children: [
        'Hi ',
        {
          type: 'span',
          props: {},
          children: ['Hello']
        }
      ]
    };
    const ele = h('p', null,
      'Hi ',
      h('span', null, 'Hello')
    );
    assert.deepEqual(res, ele);
  });

  it('h element deeply', () => {
    const res = {
      type: 'ul',
      props: {},
      children: [
        {
          type: 'li',
          props: {},
          children: [
            { type: 'span', props: {}, children: [ 'One' ] }
          ]
        },
        {
          type: 'li',
          props: {},
          children: [
            { type: 'span', props: {}, children: [ 'Two' ] }
          ]
        },
        {
          type: 'li',
          props: {},
          children: [
            { type: 'span', props: {}, children: [ 'Three' ] }
          ]
        }
      ]
    };
    const ele = h('ul', null,
      h('li', null,
        h('span', null, 'One')
      ),
      h('li', null,
        h('span', null, 'Two')
      ),
      h('li', null,
        h('span', null, 'Three')
      )
    );
    assert.deepEqual(res, ele);
  });

  it('children array', () => {
    const res = {
      type: 'p',
      props: {},
      children: [
        'Hello',
        'My',
        'Friend'
      ]
    };
    const ele = h('p', null, ['Hello', 'My', 'Friend']);
    assert.deepEqual(res, ele);
  });

  it('functional', () => {
    const res = {
      type: 'p',
      props: {},
      children: [
        'Hello',
        'My',
        'Friend'
      ]
    };
    const ele = function() {
      return h('p', null, ['Hello', 'My', 'Friend']);
    };
    assert.deepEqual(res, h(ele));
  });

  it('props', () => {
    const res = {
      type: 'p',
      props: { style: { background: '#000', color: '#fff'} },
      children: [
        'Hello',
      ]
    };
    const ele = () => {
      return h('p', { style: { background: '#000', color: '#fff'} }, 'Hello');
    };
    assert.deepEqual(res, h(ele));
  });
  
});
