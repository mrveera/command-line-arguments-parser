const parserTest = require('./parserTest').runTests;
const parseLibTest = require('./parseLibTest').runTests;

 let runTests = function () {
  parserTest();
  parseLibTest();
}

runTests();
