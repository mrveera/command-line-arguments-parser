const parserTest = require('./parserTest').runTests;
const parseLibTest = require('./parseLibTest').runTests;
const errorhandler = require('./errorhandlerTest').runTests;

let runTests = function() {
  parserTest();
  parseLibTest();
  errorhandler();
};

runTests();
