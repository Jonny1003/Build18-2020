var Cylon = require('cylon');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/cu.usbmodem14201' }
  },

  devices: {
    pin12: { driver: 'direct-pin', pin: 12}
  },

  work: function(my) {
    var x = 0;
    every((1).seconds(), function(){
      my.pin12.digitalWrite(x);
      x = (x+1)%2;
    });
  }
}).start();