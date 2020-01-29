var Cylon = require('cylon');

Cylon.robot({
  connections: {
    leapmotion: { adaptor: 'leapmotion' }
  },

  devices: {
    leapmotion: { driver: 'leapmotion' }
  },

  work: function(my) {
    var currentHand = null;
    my.leapmotion.on('hand', function(hand) {
      currentHand = hand;
    });
    
    every((1).seconds(), function(){
      if (currentHand != null){
        console.log('**********************************************')
        console.log(currentHand.direction);
        if (currentHand.type === 'right'){
          console.log('Righty!!!');
        } else {
          console.log('Lefty!');
        }
      }
    });
  }
}).start();