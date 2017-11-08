const parserTest = require('./parserTest').runTests;
const parseLibTest = require('./parseLibTest').runTests;

 runTests = function () {
  parserTest();
  parseLibTest();
}

runTests();
