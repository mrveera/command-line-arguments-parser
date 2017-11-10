const ErrorEmitter = require('./errorHandler');
const parserLib = require('./parserLib');
let Parser = function() {
  this.legalOptions = [];
  this.legalLongNames = [];
  this.replaces = {};
  this.parsedArguments = {
    arguments: [],
    LongNames: [],
    optionSetBy: 'default',
    flags: {},
  };
  this.combinedFlags = false;
  this.maximum = 1;
};
let methods = {};

methods.addReplacer = function(key, value) {
  this.replaces[key] = value;
};
methods.getReplacer = function(key) {
  let replacer = (this.replaces[key] != undefined) ? this.replaces[key] : key;
  return replacer;
};
methods.setDefaultOption = function(defaultOption) {
  this.getParsedArguments().defaultOption = defaultOption;
};

methods.addLegalOption = function(option, validationCallback) {
  this.legalOptions.push(option.substring(1));
  this[option.substring(1)] = validationCallback;
};
methods.addLegalLongName = function(LongName) {
  this.legalLongNames.push(LongName.substring(2));
};

methods.isLegalOption = function(option) {
  return parserLib.isOption(option) && this.legalOptions.includes(option.substring(1));
};

methods.isLegalLongName = function(LongName) {
  return parserLib.isLongName(LongName) && this.legalLongNames
  .includes(LongName.substring(2));
};

methods.validateOptionAndValue = function(emitter,option, value) {
  let err = {};
  if (!this.isLegalOption(option)) {
    err.name = 'option';
    err.reason = 'invalid option --' + option;
    emitter.emit('error', err);
  }else if (!this[option.substring(1)](value)) {
    err.name = 'value';
    err.reason = 'invalid value ' + value + 'for --' + option;
    emitter.emit('error', err);
  }
  return true;
};

methods.validateLongName = function(emitter,LongName) {
  let err = {};
  if (!this.isLegalLongName(LongName)) {
    err.name = 'LongName';
    err.reason = 'illegal LongName --' + LongName;
    emitter.emit('error', err);
  }
};

methods.setOptionAndValue = function(option, value) {
  this.validateOptionAndValue(ErrorEmitter,option, value);
  this.getParsedArguments().flags[option.substring(1)] = value;
  this.isMaximumOptionsReached(ErrorEmitter);
};

methods.isMaximumOptionsReached = function(emitter) {
  let optionsSet = Object.keys(this.getParsedArguments().flags);
  if (optionsSet.length > this.maximum)
    emitter.emit('error', {name: 'maximum options ',reason: 'maximum options reached  ' + optionsSet});
};
methods.parseArguments = function(option, remainingArray) {
  if (parserLib.isOption(option)) {
    this.parseOptions(option, remainingArray);
  }else {
    this.setOptionalArguments(option, remainingArray);
  }
  return true;
};

methods.parseOptions = function(option, remainingArray) {
  let separatedObj = {};
  if (parserLib.doesOptionContainValue(option)) {
    separatedObj = parserLib.getNumberAndTextFromString(option);
    let optionToSet = separatedObj.text && separatedObj.text.join('') || (this.getParsedArguments().optionSetBy = this.getParsedArguments().defaultOption);

    this.setOptionAndValue('-' + optionToSet, separatedObj.number);
  }else if (parserLib.isLongName(option)) {
    this.setLegalLongName(option);
  }else if (parserLib.doesItContainMultipleOptions(option)) {
    this.parseMultipleOptions(option, remainingArray);
  }else {
    if (option == '-' + this.getParsedArguments().defaultOption) this.getParsedArguments().optionSetBy = 'default';
    this.setOptionAndValue(option, remainingArray.shift());
  }
};

methods.parseMultipleOptions = function(option, remainingArray) {
  let multiOptionArray = parserLib.getTextPartFromString(option);
  if (this.combinedFlags) {
    multiOptionArray = multiOptionArray.map(function(ele) {
      return '-' + ele;
    });
    for (let index = 0; index < multiOptionArray.length;) {
      let element = multiOptionArray[index];
      this.parseOptions(this.getReplacer(multiOptionArray.shift()),
      remainingArray);
    }
  }else {
    this.setOptionAndValue('-' + multiOptionArray.join(''), remainingArray.shift());
  }
};

methods.setLegalLongName = function(LongName) {
  this.validateLongName(ErrorEmitter,LongName);
  this.getParsedArguments().LongNames.push(LongName);
  return true;
};

methods.setOptionalArguments = function(option, remainingArray) {
  remainingArray.unshift(option);
  this.getParsedArguments().arguments = remainingArray.slice();
  remainingArray.length = 0;
};

methods.parse = function(argumentsArray) {
  let copyOfArguments = argumentsArray.slice();
  while (copyOfArguments.length > 0) {
    this.parseArguments(this.getReplacer(copyOfArguments.shift())
    , copyOfArguments);
  }
  return this.getParsedArguments();
};

methods.enableCombinedFlags = function() {
  this.combinedFlags = true;
};

methods.setMaximumOptions = function(numberOfOptions) {
  this.maximum = numberOfOptions;
  return true;
};

methods.getParsedArguments = function() {
  return this.parsedArguments;
};

Parser.prototype = methods;
module.exports = Parser;
