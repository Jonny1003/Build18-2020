# Build18-2020
RoboHand Software

Author: Jonathan Ke
Created: Jan 29, 2020 

Most of the code is for testing/flashing Arduino and LeapMotion controller.
Testing code dowloaded and edited from http://cylonjs.com/.

StandardFirmataAdafruitMotorShield.c file hacked together from StandardFirmata.c 
and AdafruitMotorShield.c Arduino files. 

Purpose:
Code in RoboHand.js written by me. Operates an Arduino and Adafruit Motor Shield v2.3
by sending finger angle information from LeapMotion controller through Serial connection.
Ultimately allows hand signals from LeapMotion controller to be mirrored by
RoboHand robot.

Operation:
To run program:
1) Upload StandardFirmataWithAdafruitMotorShield.ino to Arduino operating 
RoboHand hardware. 

2) Install proper Cylon.js libraries into Node.js.

3) Run RoboHand.js using Node.js.
