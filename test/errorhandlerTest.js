const assert = require('assert');

const ErrorEmitter = require('../src/errorHandler');
let test = {};
exports.test = test;

test['when emitting error event on ErrorEmitter it should exit the process'] = function() {
  let onExit = function() {
    assert.ok(true);
  };
  process.on('exit', onExit);
  ErrorEmitter.emit('error', {name: 'test',reason: 'testing'});
};

exports.runTests = function() {
  let testCases = Object.keys(test);
  for (let index = 0; index < testCases.length; index++) {
    console.log('====> running ' + testCases[index] + ' <=====');
    test[testCases[index]]();
  }
};
