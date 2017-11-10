let isOption = function(option) {
  return option.substring(0, 1) == '-';
};

let isLongName = function(option) {
  return option.substring(0, 2) == '--';
};

let getNumberPartFromString = function(inputString) {
  let numberArray = inputString.match(/[0-9]+/g);
  let result = (Array.isArray(numberArray) && numberArray.length > 0) ? numberArray[numberArray.length - 1] : false;
  return result;
};

let getTextPartFromString = function(inputString) {
  let textArray = inputString.match(/([a-z])/ig);
  let result = (Array.isArray(textArray)) ? textArray : false;
  return result;
};

let getNumberAndTextFromString = function(inputString) {
  let resultObj = {};
  resultObj.number = getNumberPartFromString(inputString);
  resultObj.text = getTextPartFromString(inputString);
  return resultObj;
};

let doesOptionContainValue =  function(option) {
  return getNumberPartFromString(option) && true;
};

let doesItContainMultipleOptions = function(option) {
  let textPart = getTextPartFromString(option) || false;

  return textPart && textPart.length > 1;
};

exports.getTextPartFromString = getTextPartFromString;
exports.getNumberAndTextFromString = getNumberAndTextFromString;
exports.getNumberPartFromString = getNumberPartFromString;
exports.doesItContainMultipleOptions = doesItContainMultipleOptions;
exports.doesOptionContainValue = doesOptionContainValue;
exports.isOption = isOption;
exports.isLongName = isLongName;
