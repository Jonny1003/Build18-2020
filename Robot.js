var Cylon  = require("cylon");

var robot = new Cylon.robot({
    work: function(){
        every((1).second(), function() {
            console.log("Hello");
        });
    }
});

robot.start();