
#include <Arduino.h>
#include "RoBoxBLENanoV11.h"

RoBoxServo myServo = RoBoxServo(10);

void setup()
{
  Serial.begin(9600);

}

void loop()
{
  for (int pos = 0; pos <= 100; pos += 1) { // Goes from minimum degrees to maximum degrees of the servo
    // in scales steps
    myServo.Position(pos);              // tell servo to go to position in corresponding to the
                                        // relative position between 0 and 100 specified by pos
    delay(15);                          // waits 15ms for the servo to reach the position
  }
  for (int pos = 100; pos >= 0; pos -= 1) { 
    myServo.Position(pos);              
    delay(15);                       
  }

}
