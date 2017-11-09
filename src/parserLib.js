var isOption = function (option) {
  return option.substring(0,1)=='-';
}

var isVerbose = function (option) {
  return option.substring(0,2)=='--';
}

var getNumberPartFromString = function (inputString) {
  var numberArray = inputString.match(/[0-9]+/g);
  var result = (Array.isArray(numberArray)&&numberArray.length>0)?numberArray[numberArray.length-1]:false;
  return result;
}

var getTextPartFromString = function (inputString) {
  var textArray = inputString.match(/([a-z])/ig);
  var result = (Array.isArray(textArray))?textArray:false;
  return result;
}

var getNumberAndTextFromString = function (inputString) {
  var resultObj ={};
  resultObj.number = getNumberPartFromString(inputString);
  resultObj.text= getTextPartFromString(inputString);
  return resultObj;
}

var doesOptionContainValue =  function (option) {
  return getNumberPartFromString(option)&&true;
}

var doesItContainMultipleOptions = function (option) {
  var textPart =getTextPartFromString(option) ||false;

  return textPart && textPart.length>1;
}

exports.getTextPartFromString=getTextPartFromString;
exports.getNumberAndTextFromString=getNumberAndTextFromString;
exports.getNumberPartFromString=getNumberPartFromString;
exports.doesItContainMultipleOptions=doesItContainMultipleOptions;
exports.doesOptionContainValue = doesOptionContainValue;
exports.isOption=isOption;
exports.isVerbose=isVerbose;
