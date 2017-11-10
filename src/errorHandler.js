let EventEmitter = require('events');
let listen = function(errorObj) {
  console.log(errorObj.name + ' : ' + errorObj.reason);
  process.exit();
};

let ErrorEmitter = new EventEmitter();

ErrorEmitter.on('error', listen);
module.exports = ErrorEmitter;
