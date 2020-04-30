//
// roboxServo.h
//

#ifndef ROBOXSERVO_H
#define ROBOXSERVO_H

#include <Servo.h>

class RoBoxServo {
private:
     int	continuous;      // TRUE if this is a continuous servo
     int	reverse;	 // TRUE if this servo should be reversed, norm FALSE
     int        minTime;         // Value of microseconds (experimentally determined)
                                 // that will move the servo to the smallest position
     int        maxTime;         // Value of microseconds (experimentally determined)
                                 // that will move the servo to the greatest position
     Servo      *servo;           // The Arduino Servo object
     
public:
     RoBoxServo(int);                // The argument is the pin the servo is connected to
     void Continuous(int);      // To set the continuous to a certain state (TRUE if the servo is continuous)
     void Continuous();         // To toggle the state of continuous
     void Reverse(int);         // To set the reverse to a certain state (TRUE if the servo is reversed)
     void Reverse();            // To toggle the state of reverse

     void Rotate(int);          // For continuous rotation servos, takes number from -100 to 100
                                // negative numbers rotate counterclockwise, positive clockwise
                                // magnitude is speed
     
     void Position(int);        // For non-continuous servos, takes a number from 0 to 100
                                // 0 takes the servo to its minimum degrees and 100 to its maximum
     void Min(int);             // Sets the experimentally determined minimum microseconds
     void Max(int);             // Sets the experimentally determined maximum microseconds
     
private:
     
};

#endif
