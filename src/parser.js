const ErrorEmitter = require('./errorHandler');
const parserLib = require('./parserLib');
let Parser = function () {
  this.legalOptions=[];
  this.legalVerboses=[];
  this.replaces={};
  this.parsedArguments ={
    arguments:[],
    verboses:[],
    optionSetBy:'default',
    flags:{},
  };
  this.combinedFlags=false;
  this.maximum=1;
}
let methods={};

methods.addReplacer = function (key,value) {
  this.replaces[key]=value;
}
methods.getReplacer = function (key) {
  let replacer = (this.replaces[key] != undefined)?this.replaces[key]:key;
  return replacer;
}
methods.setDefaultOption = function (defaultOption) {
  this.getParsedArguments().defaultOption=defaultOption;
};

methods.addLegalOption = function (option,validationCallback) {
  this.legalOptions.push(option.substring(1));
  this[option.substring(1)]=validationCallback;
};
methods.addLegalVerbose = function (verbose) {
  this.legalVerboses.push(verbose.substring(2));
};

methods.isLegalOption = function (option) {
  return parserLib.isOption(option)&&this.legalOptions.includes(option.substring(1));
}

methods.isLegalVerbose = function (verbose) {
  return parserLib.isVerbose(verbose)&&this.legalVerboses
  .includes(verbose.substring(2));
}

methods.validateOptionAndValue = function (option,value) {
  let err = {};
   if(!this.isLegalOption(option)){
     err.name='option';
     err.reason='invalid option --'+option;
     ErrorEmitter.emit('error',err);
   }else if(!this[option.substring(1)](value)){
     err.name='value';
     err.reason='invalid value '+ value+'for --'+option;
     ErrorEmitter.emit('error',err);
   }
   return true;
}

methods.setOptionAndValue=function (option,value) {
  this.validateOptionAndValue(option,value)
  this.getParsedArguments().flags[option.substring(1)]=value;
  this.isMaximumOptionsReached();
}

methods.isMaximumOptionsReached = function () {
  let optionsSet = Object.keys(this.getParsedArguments().flags);
  if(optionsSet.length>this.maximum)
    ErrorEmitter.emit('error',{name:'maximum options ',reason:'maximum options reached  '+ optionsSet});
}
methods.parseArguments = function (option,remainingArray) {
  if(parserLib.isOption(option)){
    this.parseOptions(option,remainingArray);
  }else{
    this.setOptionalArguments(option,remainingArray);
  }
  return true;
}

methods.parseOptions = function (option,remainingArray) {
  let separatedObj={};
  if(parserLib.doesOptionContainValue(option)){
    separatedObj=parserLib.getNumberAndTextFromString(option);
    let optionToSet = separatedObj.text && separatedObj.text.join('') || (this.getParsedArguments().optionSetBy='program'&& this.getParsedArguments().defaultOption);
    this.setOptionAndValue('-'+optionToSet,separatedObj.number);

  }else if (this.isLegalVerbose(option)) {
    this.setLegalVerbose(option);

  }else if (parserLib.doesItContainMultipleOptions(option)) {
    let multiOptionArray = parserLib.getTextPartFromString(option);

    if(this.combinedFlags){
      multiOptionArray = multiOptionArray.map(function (ele) {
        return '-'+ele;
      });
    for(let index=0;index<multiOptionArray.length;){
     let element = multiOptionArray[index];
     this.parseOptions(this.getReplacer(multiOptionArray.shift()),
     remainingArray);
     }
   }else{
     this.setOptionAndValue('-'+multiOptionArray.join(''),remainingArray.shift());
   }
  }else{
    if(option == '-'+this.getParsedArguments().defaultOption) this.getParsedArguments().optionSetBy='default';
    this.setOptionAndValue(option,remainingArray.shift());
  }
}

methods.setLegalVerbose = function (verbose) {
  this.getParsedArguments().verboses.push(verbose);
  return true;
}

methods.setOptionalArguments = function (option,remainingArray) {
  remainingArray.unshift(option);
  this.getParsedArguments().arguments=remainingArray.slice();
  remainingArray.length=0;
}

methods.parse = function (argumentsArray) {
  let copyOfArguments = argumentsArray.slice();
  while (copyOfArguments.length>0) {
    this.parseArguments(this.getReplacer(copyOfArguments.shift())
    ,copyOfArguments);
  }
  return this.getParsedArguments();
}

methods.enableCombinedFlags = function () {
  this.combinedFlags=true;
}

methods.setMaximumOptions = function (numberOfOptions) {
  this.maximum=numberOfOptions;
  return true;
};

methods.getParsedArguments=function () {
  return this.parsedArguments;
}

Parser.prototype=methods;
module.exports=Parser;
