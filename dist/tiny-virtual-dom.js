(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tinyVirtualDom = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function isObject(x) {
  return typeof x === "object" && x !== null;
}

function isFunction(x) {
  return typeof x === "function";
}

function isString(x) {
  return typeof x === "string";
}

function isUndefined(x) {
  return x === undefined;
}

const isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

function head(x) {
  return isString(x) ? x.charAt(0) : x[0];
}

module.exports = {
  isObject,
  isFunction,
  isArray,
  isString,
  isUndefined,
  head,
}
},{}],2:[function(require,module,exports){
const {
  isArray,
  isObject,
  isFunction,
  isString,
  isUndefined,
  head,
} = require('./helpers');

function h(type, props, ...children) {
  if (isFunction(type)) {
    return type(props);
  }
  if (isArray(head(children))) {
    children = head(children);
  }
  return { type, props: props || {}, children };
}

function createElement(node) {
  if (!isObject(node)) {
    return document.createTextNode(String(node));
  }
  const $el = document.createElement(node.type);
  applyProps($el, node.props);
  node.children.map(child => $el.appendChild(createElement(child)));
  return $el;
}

function patch($parent, newTree, oldTree, index = 0) {
  if (!oldTree) {
    $parent.appendChild(createElement(newTree));
  } if (!newTree) {
    removeChildren($parent, index);
  } else if (changed(newTree, oldTree)) {
    $parent.replaceChild(createElement(newTree), $parent.childNodes[index]);
  } else if (!isUndefined(newTree.type)) {
    applyProps($parent.childNodes[index], newTree.props, oldTree.props);
    patchNodes($parent, newTree, oldTree, index);
  }
}

function changed(a, b) {
  return (typeof a !== typeof b) || (isString(a) && a !== b) || (a.type !== b.type) ;
}

function patchNodes($parent, newTree, oldTree, index) {
  const len = Math.max(newTree.children.length, oldTree.children.length);
  let i = -1;
  while (++i < len) {
    patch(
      $parent.childNodes[index],
      newTree.children[i],
      oldTree.children[i],
      i
    );
  }
}

function removeChildren($parent, index) {
  let times = ($parent.childNodes.length || 0) - index;
  while (times-- > 0) {
    if ($parent.lastChild) {
      $parent.removeChild($parent.lastChild);
    }
  }
}

function applyProps($el, newProps, oldProps = {}) {
  const props = Object.assign({}, newProps, oldProps)
  Object.keys(props).map(name => {
    const newValue = newProps[name];
    const oldValue = oldProps[name]
    if (!newValue) {
      removeProp($el, name, newValue);
    } else if (newValue !== oldValue) {
      setProp($el, name, newValue);
    }
  });
}

function setProp($el, name, value) {
  if (name === 'className') {
    $el.setAttribute('class', value);
  } else {
    if (isObject(value)) {
      for (let x in value) {
        let xValue = value[x] || "";
        $el[name][x] = xValue;
      }
    } else {
      $el[name] = value;
    }
  }
}

function removeProp($el, name, value) {
  if (name === 'className') {
    $el.removeAttribute('class');
  } else {
    if (isObject(value)) {
      for (let x in value) {
        delete $el[name][x];
      }
    } else {
      delete $el[name];
    }
  }
}

module.exports = {
  h: h,
  patch: patch
};

},{"./helpers":1}]},{},[2])(2)
});