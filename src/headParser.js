const Parser = require('./parser');

var headArguments = function () {
  var args = process.argv.slice(2);
  var headParser = new Parser();
  headParser.setDefaultOption('n');
  headParser.addLegalOption('-n',isItNumber);
  headParser.addLegalOption('-c',isItNumber);
  headParser.addReplaces('--','-n10');
  headParser.addLegalVerbose('--help');
  headParser.enableCombinedFlags();
  headParser.setMaximumOptions(2);
  console.log(headParser.parse(args));
}

var isItNumber = function (value) {
  return (+value>0);
};
headArguments();
