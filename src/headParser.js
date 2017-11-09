const Parser = require('./parser');

let headArguments = function () {
  let args = process.argv.slice(2);
  let headParser = new Parser();
  headParser.setDefaultOption('n');
  headParser.addLegalOption('-n',isItNumber);
  headParser.addLegalOption('-c',isItNumber);
  headParser.addReplacer('--','-n10');
  headParser.addLegalVerbose('--help');
  headParser.enableCombinedFlags();
  headParser.setMaximumOptions(2);
  console.log(headParser.parse(args));
}

let isItNumber = function (value) {
  return (+value>0);
};
headArguments();
