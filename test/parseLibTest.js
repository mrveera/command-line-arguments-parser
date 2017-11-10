const assert = require('assert');

const parserLib = require('../src/parserLib');
let test = {};
exports.test = test;

//========== isOption ================//

test['isOption should return true for valid options which starts with (-) '] = function() {
  let actual = parserLib.isOption('-n');
  assert.ok(actual);
};

test['isOption should return false for invalid options which is not starting with (-) '] = function() {
  let actual = parserLib.isOption('n');
  assert.ok(!actual);
};

//============= isLongName =================
test['isLongName should return true for valid LongName which starts with (--) '] = function() {
  let actual = parserLib.isLongName('--n');
  assert.ok(actual);
};

test['isLongName should return false for invalid  which is not starting with (--) '] = function() {
  let actual = parserLib.isLongName('n');
  assert.ok(!actual);
};

//===============  getNumberPartFromString ================

test['getNumberPartFromString should return number part of given string '] = function() {
  let actual = parserLib.getNumberPartFromString('n6663');
  let expected = 6663;
  assert.equal(actual, expected);
};

test['getNumberPartFromString should return false when there is no number part in given string '] = function() {
  let actual = parserLib.getNumberPartFromString('veera');
  assert.ok(!actual);
};

// ============== getTextPartFromString =============

test['getTextPartFromString should return false when there is no text part in given string '] = function() {
  let actual = parserLib.getTextPartFromString('123');
  assert.ok(!actual);
};

test['getTextPartFromString should return text part of given string '] = function() {
  let actual = parserLib.getTextPartFromString('n6663');
  let expected = ['n'];
  assert.deepEqual(actual, expected);
};

// ===== getNumberAndTextFromString =====

test['getNumberAndTextFromString should return object with number and text part '] = function() {
  let actual = parserLib.getNumberAndTextFromString('-n6663');
  let expected = {
    number: 6663,
    text: ['n']
  };
  assert.deepEqual(actual, expected);
};

//========= doesOptionContainValue ==========
test['doesOptionContainValue should return true if the option contains value its self'] = function() {
  let actual = parserLib.doesOptionContainValue('-n4');
  assert.ok(actual);
};

test['doesOptionContainValue should return false if the option not contains value its self'] = function() {
  let actual = parserLib.doesOptionContainValue('-n');
  assert.ok(!actual);
};

//======== doesItContainMultipleOptions =======
test['doesItContainMultipleOptions should return false if the given string not contaning more than one alphabet'] = function() {
  let actual = parserLib.doesItContainMultipleOptions('34567');
  assert.ok(!actual);
};

test['doesItContainMultipleOptions should return true if the given string contains more than one alphabet'] = function() {
  let actual = parserLib.doesItContainMultipleOptions('3456dfghjc');
  assert.ok(actual);
};

exports.runTests = function() {
  let testCases = Object.keys(test);
  for (let index = 0; index < testCases.length; index++) {
    console.log('====> running ' + testCases[index] + ' <=====');
    test[testCases[index]]();
  }
};
