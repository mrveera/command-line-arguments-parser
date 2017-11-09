var EventEmitter = require('events');
var listen = function (errorObj) {
  console.log(errorObj.name +' : '+errorObj.reason);
  process.exit();
}

var ErrorEmitter = new EventEmitter();

ErrorEmitter.on('error',listen);
module.exports=ErrorEmitter;
