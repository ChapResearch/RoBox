//
// roboxServo.h
//

#ifndef ROBOXSERVO_H
#define ROBOXSERVO_H

#include <Servo.h>

// BIG NOTE - there appears to be an issue with initializing an arduino servo -
//            calling servo.attach() - outside of the setup()/loop() functions.
//            We often do this inside RoBox to create the objects that represent
//            the attachments and sensors of the RoBox. My best guess, without
//            doing the work to figure it out is that much of the Arduino stuff
//            ends up getting initialized in the implied main() that ends up
//            calling setup()/loop(). The point is that a RoBoxServo object, if
//            instantiated before main(), initializes the servo incorrectly.
//            SOOOOooooo, instead of changing all of RoBox to initialize its
//            objects in setup() or treating the RoBoxServer object specially,
//            initializing only it during setup(), we code the RoBoxServer object
//            to intialize just-in-time. That is, initialize it upon first use.

class RoBoxServo {
private:
     bool      	  initialized;	   // TRUE if the servo has been initialized (see above)
     int	  reverse;	   // TRUE if this servo should be reversed, norm FALSE
     int          minTime;         // Value of microseconds (experimentally determined)
                                   // that will move the servo to the smallest position
     int          maxTime;         // Value of microseconds (experimentally determined)
                                   // that will move the servo to the greatest position
     unsigned int targetMillis;    // The milliseconds at which the servo should stop
                                   // rotating in order to shoot exactly one ball
     Servo        *servo;          // The Arduino Servo object
     
     void         init();          // called to initialize the servo just-in-time
     
public:
     RoBoxServo();              // The argument is the pin the servo is connected to
     void Reverse(int);         // To set the reverse to a certain state (TRUE if the servo is reversed)
     void Reverse();            // To toggle the state of reverse

     void Rotate(int);          // For continuous rotation servos, takes number from -100 to 100
                                // negative numbers rotate counterclockwise, positive clockwise
                                // magnitude is speed
     

     void Rotate(int, int);     // Rotates the servo at a certain speed (first parameter) for a certain amount
                                // of milliseconds (second parameter)
     
     void Position(int);        // For non-continuous servos, takes a number from 0 to 100
                                // 0 takes the servo to its minimum degrees and 100 to its maximum
     void Min(int);             // Sets the experimentally determined minimum microseconds
     void Max(int);             // Sets the experimentally determined maximum microseconds
     void Update();             // Makes the servo rotate until it reaches the necessary amount of time
     
};

#endif
