const {
  isArray,
  isObject,
  isFunction,
  isString,
  isUndefined,
  head,
  merge,
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
  console.log('=>', $el, newProps, oldProps);
  const props = merge(newProps, oldProps);
  Object.keys(props).map(name => {
    const newValue = newProps[name];
    const oldValue = oldProps[name];
    if (isObject(newValue)) {
      applyProps($el[name], newValue, oldValue);
    } else {
      if (!newValue) {
        removeProp($el, name);
      } else if (newValue !== oldValue) {
        setProp($el, name, newValue);
      }
    }
  });
}

function setProp($el, name, value) {
  if (name === 'className') {
    $el.setAttribute('class', value);
  } else {
    $el[name] = value;
  }
}

function removeProp($el, name) {
  if (name === 'className') {
    $el.removeAttribute('class');
  } else {
    $el[name] = null;
    delete $el[name];
  }
}

module.exports = {
  h,
  patch,
};
