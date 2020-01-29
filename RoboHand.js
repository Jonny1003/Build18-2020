"use strict";

var Cylon = require("cylon");

Cylon.robot({

  connections: {
    leap: { adaptor: "leapmotion" },
    arduino: { adaptor: "firmata", port: "/dev/tty.usbmodem14201" }
  },

  devices: {
    pinkyMotor: { driver: "servo", pin: 3, connection: "arduino" },
    indexMotor: { driver: "servo", pin: 4, connection: "arduino" },
    middleMotor: { driver: "servo", pin: 5, connection: "arduino" },
    ringMotor: { driver: "servo", pin: 6, connection: "arduino" },
    leapmotion: {driver: "leapmotion", connection: "leap"},
    IAPHSendM1B0: { driver: 'direct-pin', pin: 7, connection: "arduino"},
    IAPHRecieveM1B0: { driver: 'direct-pin', pin: 8, connection: "arduino"},
    IAPHSendM1B1: { driver: 'direct-pin', pin: 9, connection: "arduino"},
    IAPHRecieveM1B1: { driver: 'direct-pin', pin: 10, connection: "arduino"},
    IAPHSendM2B0: { driver: 'direct-pin', pin: 11, connection: "arduino"},
    IAPHRecieveM2B0: { driver: 'direct-pin', pin: 12, connection: "arduino"},
    IAPHSendM2B1: { driver: 'direct-pin', pin: 13, connection: "arduino"},
    IAPHRecieveM2B1: { driver: 'direct-pin', pin: 15, connection: "arduino"},
  },

  work: function(my) {
    //capture hand object
    var currentHand = null;
    my.leapmotion.on('hand', function(hand){
        currentHand = hand;
    });

    var filterAngle = function(n){
      if (n > 180){
        return 180;
      } else if (n< 0){
        return 0;
      }
      return n;
    }
    
    //set hand data to manipulation functions
    every((0.1).seconds(), function(){
        if (currentHand !== null){

          var angles = {
            pinkyAngle: filterAngle(my.commands.getFingerAngle('pinky', currentHand)),
            middleAngle: filterAngle(my.commands.getFingerAngle('middle', currentHand)),
            thumbAngle: filterAngle(my.commands.getFingerAngle('thumb', currentHand)),
            indexAngle: filterAngle(my.commands.getFingerAngle('index', currentHand)),
            ringAngle: filterAngle(my.commands.getFingerAngle('ring', currentHand)),
          }

          console.log(angles);
          
          my.commands.setServoAngle(my.pinkyMotor, angles.pinkyAngle);
          my.commands.setServoAngle(my.middleMotor, angles.middleAngle);
          my.commands.setServoAngle(my.ringMotor, angles.ringAngle);
          my.commands.setServoAngle(my.indexMotor, angles.indexAngle);
        
          //hand angle processing and IAPH protocol message
          var palmVelocity = currentHand.palmVelocity; // mm/sec
          var velocityXAxis = palmVelocity[0];
          var velocityYAxis = palmVelocity[1];
          my.commands.sendIAPH(my.IAPHSendM1B0, my.IAPHSendM1B1, velocityXAxis);
          my.commands.sendIAPH(my.IAPHSendM2B0, my.IAPHSendM2B1, velocityYAxis);
        }
    });

  },

  commands: function(my){
    var commands = {};

    commands.setServoAngle = this.setServoAngle;
    commands.dotProduct = this.dotProduct;
    commands.magnitude = this.magnitude;
    commands.angleCalc = this.angleCalc;
    commands.getFingerVector = this.getFingerVector;
    commands.getFingerAngle = this.getFingerAngle;
    commands.sendIAPH = this.sendIAPH;

    return commands;
  },

  //sends a protocol for motor movement
  sendIAPH: function(b0, b1, v){
    var still = 50; //v considered static if v (mm/s) < 20 mm/s
    if (v < -still){ //left
      b0.digitalWrite(1);
      b1.digitalWrite(0);
    } else if (v > still){ //right
      b0.digitalWrite(0);
      b1.digitalWrite(1);
    } else{ //off
      b0.digitalWrite(0);
      b1.digitalWrite(0);
    }
  },

  //sets the angle of a given servo motor
  setServoAngle: function(servoMotor, angle){
    if (angle > 180 || angle < 0) return;
    servoMotor.angle(angle);
  },

  // calculates dot product from 2 arrays representing 3D vectors
  dotProduct: function(v1, v2){
    var out = 0;
    for (var i = 0; i < v1.length; i++){
        out += v1[i] * v2[i];
    }
    return out;
  },

  //takes input of array of length 3
  magnitude: function(v){
      return v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
  },

  //calculates the angle between two 3D vectors
  angleCalc: function(v1, v2){
      var product = this.dotProduct(v1, v2);
      var m1 = this.magnitude(v1);
      var m2 = this.magnitude(v2);
      return 360 * Math.acos(product/(m1*m2)) / (2*Math.PI);
  },

  //gets the direction vector of a finger object
  getFingerVector: function(finger){
    var carpPos = finger.carpPosition;
    var distPos = finger.dipPosition;
    //calculate vector
    var x = distPos[0] - carpPos[0];
    var y = distPos[1] - carpPos[1];
    var z = distPos[2] - carpPos[2];
    return [x,y,z];
  },

  //direction of hand 
  getHandDirectionVector: function(hand){
      return hand.direction;
  },

  //angle of specified finger(string)
  getFingerAngle: function(finger, hand){
    if (finger === 'pinky'){
        var v = this.getHandDirectionVector(hand.pinky);
    } else if (finger === 'index'){
        var v  = this.getHandDirectionVector(hand.indexFinger);
    } else if (finger === 'ring'){
        var v = this.getHandDirectionVector(hand.ringFinger);
    } else if (finger === 'middle'){
        var v = this.getHandDirectionVector(hand.middleFinger);
    } else{
        var v = this.getHandDirectionVector(hand.thumb);
    }
    var actualAngle = this.angleCalc(v, this.getHandDirectionVector(hand));
    return 180 - (90 + (actualAngle-90)*1.5);
  },
  

}).start();
//command jonathan

//stop working...

//result Jonathan stopped working
//YAY