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

function merge(a, b) {
  return Object.assign({}, a, b);
}

module.exports = {
  isObject,
  isFunction,
  isArray,
  isString,
  isUndefined,
  head,
  merge,
}