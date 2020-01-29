// Dependancy upon Johnny-Five
var five = require("johnny-five");
// Set up references to Arduino Board and LED
var myBoard, myLed;
// Initialise Microcontroller 
myBoard = new five.Board();
// After successful initialisation of the board this code block will be run
myBoard.on("ready", function() {
 
 // Instantiate a LED Object (Arduino Uno has a LED attached to Pin 13)
 myLed = new five.Led(13);
 
 // Strobe the LED (ms)
 myLed.strobe( 300 );
 
});