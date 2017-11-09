const assert = require('assert');
const Parser = require('../src/parser');
const test={};
exports.test=test;

//========= setDefaultOption ============
test['setDefaultOption should set the default option in parsed arguments object  with given option']=function () {
  var parser = new Parser();
  parser.setDefaultOption('n');
  assert.equal(parser.parsedArguments.defaultOption,'n');
}

// ========== addLegalOption =============
test['addLegalOption should add given option to legal options'] = function () {
  var parser = new Parser();
  parser.addLegalOption('-n');
  var expected = ['n'];
  assert.deepEqual(parser.legalOptions,expected);
}

//============ addLegalVerbose ============
test['addLegalVerbose should add given option to legal verbose  '] = function () {
  var parser = new Parser();
  parser.addLegalVerbose('--help');
  var expected = ['help'];
  assert.deepEqual(parser.legalVerboses,expected);
}

//============= isLegalOption ==========

test['isLegalOption should return true if it is option and included in legalOptions'] = function () {
  var parser = new Parser();
  parser.addLegalOption('-n');
  var actual = parser.isLegalOption('-n');
  assert.ok(actual);
}

test['isLegalOption should return false if it is not  option and included in legalOptions'] = function () {
  var parser = new Parser();
  var actual = parser.isLegalOption('-n');
  assert.ok(!actual);
}

// ========== isLegalVerbose===========

test['isLegalVerbose should return true if it is verbose and included in legalVerboses'] = function () {
  var parser = new Parser();
  parser.addLegalVerbose('--n');
  var actual = parser.isLegalVerbose('--n');
  assert.ok(actual);
}

test['isLegalVerbose should return false if it is not verbose and included in legalVerboses'] = function () {
  var parser = new Parser();
  var actual = parser.isLegalVerbose('--n');
  assert.ok(!actual);
}


//====== parseArgs =====


test['parse seperates options option and value'] = function(){
  var demoArgs1 = ['-n10','-c12'];
  var parser = new Parser();
  var isItNumber = function (value) {
    return(+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);
  parser.addLegalVerbose('--help');
  var expected ={
    arguments:[],
    verboses:[],
    optionSetBy:'default',
    flags:{n:10,c:12},
    defaultOption:'n'
  };

  var actual=parser.parse(demoArgs1);
  assert.deepEqual(actual,expected);
};

test['parse seperates options option and value and optional argument in arguments'] = function(){
  var demoArgs2 = ['-n10','-c12',"toDo.txt"];
  var parser = new Parser();
  var isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  var expected ={
    arguments:['toDo.txt'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:10,c:12},
    defaultOption:'n'
  };
  var actual = parser.parse(demoArgs2)
  assert.deepEqual(actual,expected);
};

test['parse seperates options and value,files in arguments and verboses'] = function(){
  var demoArgs3 = ['-n12',"toDo.txt",'--help'];
  var parser = new Parser();
  var isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  var expected ={
    arguments:['toDo.txt','--help'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:12},
    defaultOption:'n'
  };
  var actual = parser.parse(demoArgs3)
  assert.deepEqual(actual,expected);
};

test['parse gives default value of empty arguments'] = function(){
  var demoArgs4 = [];
  var parser = new Parser();
  parser.setDefaultOption('n');
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  var expected ={
    arguments:[],
    verboses:[],
    optionSetBy:'default',
    flags:{},
    defaultOption:'n'
  };
  var actual = parser.parse(demoArgs4);
  assert.deepEqual(actual,expected);
};

test ['parse should put all the optional argument in arguments'] = function(){
  var demoArgs5 = ["toDo.txt",'abc.txt'];
  var parser = new Parser();
  parser.setDefaultOption('n');
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  var expected ={
    arguments:['toDo.txt','abc.txt'],
    verboses:[],
    optionSetBy:'default',
    flags:{},
    defaultOption:'n'
  };
  var actual = parser.parse(demoArgs5);
  assert.deepEqual(actual,expected);
};

test ['parse should seperates all the input in options,arguments and verbose'] = function(){
  var demoArgs6 = ['-n12' ,'-c12' , 'toDo.txt','sample.js','--help'];
  var parser = new Parser();
  var isItNumber = function (value) {
    return (+value>0);
  };
  parser.setDefaultOption('n');
  parser.addLegalOption('-n',isItNumber);
  parser.addLegalOption('-c',isItNumber);
  parser.setMaximumOptions(2);

  parser.addLegalVerbose('--help');
  var expected ={
    arguments:['toDo.txt','sample.js','--help'],
    verboses:[],
    optionSetBy:'default',
    flags:{n:'12',c:'12'},
    defaultOption:'n'
  };
  var actual = parser.parse(demoArgs6);
  assert.deepEqual(actual,expected);
};

exports.runTests = function () {
  var testCases = Object.keys(test);
  for(var index=0;index<testCases.length;index++){
  console.log('====> running '+testCases[index]+' <=====')
   test[testCases[index]]();
   }
}
