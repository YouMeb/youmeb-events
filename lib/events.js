'use strict';

module.exports = EventEmitter ;

function EventEmitter() {
  this.events = {};
}

EventEmitter.prototype.emit = function (name, done) {
  var i, len, args;
  var handlers = this.events[name] || [];
  var clone = handlers.slice();

  i = 0;
  len = handlers.length;
  args = Array.prototype.slice.call(arguments, 1);
  done = typeof args[args.length - 1] === 'function' ? args.pop() : undefined;

  (function next(err) {
    if (err) {
      return done && done(err);
    }

    var handler = clone[i++];

    if (!handler) {
      done && done();
      return;
    }

    if (handler.once) {
      var index = handlers.indexOf(handler);
      handlers.splice(index, 1);
    }

    handler.apply(null, args.concat([next]));
  })();

  return this;
};

EventEmitter.prototype.addEventListener = EventEmitter.prototype.on = function (evt, handler) {
  var handlers;

  if (!(handlers = this.events[evt])) {
    handlers = this.events[evt] = [];
  }

  handlers.push(handler);

  return this;
};

EventEmitter.prototype.once = function (evt, handler) {
  handler.once = true;
  this.on(evt, handler);
};

EventEmitter.prototype.before = function (evt, target, handler) {
  var handlers, i;

  if (!(handlers = this.events[evt])) {
    handlers = this.events[evt] = [];
  }

  i = handlers.indexOf(target);

  if (i === -1) {
    handlers.push(handler);
    return this;
  }

  handlers.splice(i, 0, handler);

  return this;
};

EventEmitter.prototype.after = function (evt, target, handler) {
  var handlers, i;

  if (!(handlers = this.events[evt])) {
    handlers = this.events[evt] = [];
  }

  i = handlers.indexOf(target);

  if (i === -1) {
    handlers.push(handler);
    return this;
  }

  handlers.splice(i + 1, 0, handler);

  return this;
};

EventEmitter.prototype.beforeOnce = function (evt, target, handler) {
  handler.once = true;
  this.before(evt, target, handler);
};

EventEmitter.prototype.afterOnce = function (evt, target, handler) {
  handler.once = true;
  this.after(evt, target, handler);
};
