const assert = require('assert');
const Parser = require('../src/parser');
const EventEmitter = require('events');
const test={};
exports.test=test;

//========= setDefaultOption ============
test['setDefaultOption should set the default option in parsed arguments object  with given option']=function () {
  let parser = new Parser();
  parser.setDefaultOption('n');
  assert.equal(parser.parsedArguments.defaultOption,'n');
}

// ========== addLegalOption =============
test['addLegalOption should add given option to legal options'] = function () {
  let parser = new Parser();
  parser.addLegalOption('-n');
  let expected = ['n'];
  assert.deepEqual(parser.legalOptions,expected);
}

//============ addLegalVerbose ============
test['addLegalVerbose should add given option to legal verbose  '] = function () {
  let parser = new Parser();
  parser.addLegalVerbose('--help');
  let expected = ['help'];
  assert.deepEqual(parser.legalVerboses,expected);
}

//============= isLegalOption ==========

test['isLegalOption should return true if it is option and included in legalOptions'] = function () {
  let parser = new Parser();
  parser.addLegalOption('-n');
  let actual = parser.isLegalOption('-n');
  assert.ok(actual);
}

test['isLegalOption should return false if it is not  option and included in legalOptions'] = function () {
  let parser = new Parser();
  let actual = parser.isLegalOption('-n');
  assert.ok(!actual);
}

// ========== isLegalVerbose===========

test['isLegalVerbose should return true if it is verbose and included in legalVerboses'] = function () {
  let parser = new Parser();
  parser.addLegalVerbose('--n');
  let actual = parser.isLegalVerbose('--n');
  assert.ok(actual);
}

test['isLegalVerbose should return false if it is not verbose and included in legalVerboses'] = function () {
  let parser = new Parser();
  let actual = parser.isLegalVerbose('--n');
  assert.ok(!actual);
}


//====== parseArgs =====


test['parse seperates options option and value'] = function(){
  let demoArgs1 = ['-n10','-c12'];
  let parser = new Parser();
  let isItNumber = function (value) {
    return(+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);
  parser.addLegalVerbose('--help');
  let expected ={
    arguments:[],
    verboses:[],
    optionSetBy:'default',
    flags:{n:10,c:12},
    defaultOption:'n'
  };

  let actual=parser.parse(demoArgs1);
  assert.deepEqual(actual,expected);
};

test['parse seperates options option and value and optional argument in arguments'] = function(){
  let demoArgs2 = ['-n10','-c12',"toDo.txt"];
  let parser = new Parser();
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  let expected ={
    arguments:['toDo.txt'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:10,c:12},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs2)
  assert.deepEqual(actual,expected);
};

test['parse seperates options and value,files in arguments and verboses'] = function(){
  let demoArgs3 = ['-n12',"toDo.txt",'--help'];
  let parser = new Parser();
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  let expected ={
    arguments:['toDo.txt','--help'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:12},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs3)
  assert.deepEqual(actual,expected);
};

test['parse gives default value of empty arguments'] = function(){
  let demoArgs4 = [];
  let parser = new Parser();
  parser.setDefaultOption('n');
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  let expected ={
    arguments:[],
    verboses:[],
    optionSetBy:'default',
    flags:{},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs4);
  assert.deepEqual(actual,expected);
};

test ['parse should put all the optional argument in arguments'] = function(){
  let demoArgs5 = ["toDo.txt",'abc.txt'];
  let parser = new Parser();
  parser.setDefaultOption('n');
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  let expected ={
    arguments:['toDo.txt','abc.txt'],
    verboses:[],
    optionSetBy:'default',
    flags:{},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs5);
  assert.deepEqual(actual,expected);
};

test ['parse should seperates all the input in options,arguments and verbose'] = function(){
  let demoArgs6 = ['-n12' ,'-c12' , 'toDo.txt','sample.js','--help'];
  let parser = new Parser();
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  let expected ={
    arguments:['toDo.txt','sample.js','--help'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:'12',c:'12'},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs6);
  assert.deepEqual(actual,expected);
};


test ['parse should seperates multiple options  in options,arguments and verbose'] = function(){
  let demoArgs6 = ['-nc' ,'12','12' , 'toDo.txt','sample.js','--help'];
  let parser = new Parser();
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);
  parser.enableCombinedFlags();
  parser.addLegalVerbose('--help');
  let expected ={
    arguments:['toDo.txt','sample.js','--help'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:'12',c:'12'},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs6);
  assert.deepEqual(actual,expected);
};

test['parse seperates verbose , files from arguments given'] = function(){
  let demoArgs3 = ['--help',"toDo.txt"];
  let parser = new Parser();
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  let expected ={
    arguments:['toDo.txt'],
    verboses:['--help'],
    optionSetBy:'default',
    flags:{},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs3)
  assert.deepEqual(actual,expected);
};


test['parse seperates multi letter option , files from arguments given'] = function(){
  let demoArgs3 = ['-nc','12',"toDo.txt"];
  let parser = new Parser();
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-nc',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  let expected ={
    arguments:['toDo.txt'],
    verboses:[],
    optionSetBy:'default',
    flags:{nc:12},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs3)
  assert.deepEqual(actual,expected);
};



test['parse seperates single numerival value as option from arguments given'] = function(){
  let demoArgs3 = ['-12',"toDo.txt"];
  let parser = new Parser();
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  let expected ={
    arguments:['toDo.txt'],
    verboses:[],
    optionSetBy:'n',
    flags:{n:'12'},
    defaultOption:'n'
  };
  let actual = parser.parse(demoArgs3)
  assert.deepEqual(actual,expected);
};


// ====== addReplacer =========
test['addReplacer should set given value to given key'] = function () {
  let parser = new Parser();
  parser.addReplacer('--','-n10');
  assert.equal(parser.replaces['--'],'-n10');
}

//===== getReplacer ========
test['getReplacer should return  value to given key'] = function () {
  let parser = new Parser();
  parser.addReplacer('--','-n10');
  assert.equal(parser.getReplacer('--'),'-n10');
}

//======== validateOptionAndValue =====
test['validateOptionAndValue shoud emit the event error on given emitter when option is not valid'] = function () {
  let contents='';
  let parser = new Parser();
  let dummyEmitter =new EventEmitter();
  let onError = function () {
    contents=true;
  }
  dummyEmitter.on('error',onError);
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.addLegalOption('-n',isItNumber);
  parser.validateOptionAndValue(dummyEmitter,'-x','4');
  assert.ok(contents);
}


test['validateOptionAndValue shoud emit the event error on given emitter when value is not valid'] = function () {
  let contents='';
  let parser = new Parser();
  let dummyEmitter =new EventEmitter();
  let onError = function () {
    contents=true;
  }
  dummyEmitter.on('error',onError);
  let isItNumber = function (value) {
    return (+value>0);
  };
  parser.addLegalOption('-n',isItNumber);
  parser.validateOptionAndValue(dummyEmitter,'-n','x');
  assert.ok(contents);
}

//======== validateVerbose ====
test['validateVerbose shoud emit the event error on given emitter when verbose is not valid'] = function () {
  let contents='';
  let parser = new Parser();
  let dummyEmitter =new EventEmitter();
  let onError = function () {
    contents=true;
  }
  dummyEmitter.on('error',onError);

  parser.addLegalVerbose('--help');
  parser.validateVerbose(dummyEmitter,'--step');
  assert.ok(contents);
}

//======== isMaximumOptionsReached ====
test['isMaximumOptionsReached should emit error on given emitter when number options reached']=function () {
  let contents='';
  let parser = new Parser();
  let dummyEmitter =new EventEmitter();
  let onError = function () {
    contents=true;
  }
  dummyEmitter.on('error',onError);
  parser.setMaximumOptions(-1);
  parser.isMaximumOptionsReached(dummyEmitter);
  assert.ok(contents);
}
exports.runTests = function () {
  let testCases = Object.keys(test);
  for(let index=0;index<testCases.length;index++){
  console.log('====> running '+testCases[index]+' <=====')
   test[testCases[index]]();
   }
}
