'use strict';

var EventEmitter = require('./lib/events');
var emitter = new EventEmitter();

function handler1(done) {
  console.log('test 1');
  done();
}

function handler2(done) {
  console.log('test 2');
  done();
}

function handler3(done) {
  console.log('test 3');
  done();
}

function handler4(done) {
  console.log('test 4');
  done();
}

emitter.on('test', handler1);
emitter.on('test', handler4);
emitter.afterOnce('test', handler1, handler2);
emitter.before('test', handler4, handler3);

// output:
//     
//     ---
//     test1
//     test2
//     test3
//     test4
//     ---
//     test1
//     test3
//     test4
//
console.log('---');
emitter.emit('test', function () {
  console.log('---');
  emitter.emit('test');
});
