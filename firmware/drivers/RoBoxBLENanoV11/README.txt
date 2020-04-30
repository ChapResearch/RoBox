Important Notes
---------------

The implementation in this driver uses the following pins:

LEDs - A1
BLE - (serial port pins 0/1)
IR - IR1=8, IR2=9, BLAST=13
Motor - 1 - DIR=4, SPEED=5
        2 - DIR=7, SPEED=6
Speaker: 3
Line: A0
Ultra: trig=12, echo=11
Servo: 10

Arduino Pin Usage            Romeo Availability   NOTE
-----------------            ------------------ --------------------------------------------------------
0  - BLE/serial                     -
1  - BLE/serial                     - 
2  -                               yes
3  - Speaker                       yes          Change from previous - used to be on 10
4  - Motor 1 - DIR                  -
5  - Motor 1 - Speed (PWM)          -
6  - Motor 2 - Speed (PWM)          -
7  - Motor 2 - DIR                  -
8  - IR1                           yes
9  - IR2                           yes
10 - servo                         yes           New - used to be speaker
11 - ultra - echo                  yes
12 - ultra - trig                  yes
13 - IR Blaster                    yes
A0 - Line                          yes
A1 - LEDs                          yes
A2 - 
A3 - 



Arduino Timer Usage
-------------------

The Arduino (Atmega328) has three times, that can be connected to PWM pins.  The pin
capabilities are:

PWM PINS     TIMER
-----------  -----
Pins 5 & 6:  Timer0
Pins 9 & 10: Timer1
Pins 11 & 3: Timer2

In addition, existing Arduino libraries are wired to use timers as:

Timer0: delay(), millis(), and micros()

Timer1: servo library

Timer2: tone library


Specific Notes
--------------
BLE - uses the serial port to communicate to the BLE chip. The drive uses "command mode"
over the serial port to do things like setting the bluetooth name.  Note that different
firmware on the BLE chip defaults to different baud rates for the serial port. For the
Romeo it is 115200, and for the BLE-Nano it is 9600.  NOTE - this 9600 may change in the
future, that's pretty darn slow.

IR - "bit banging" is done.  Which means that when a send() is called, it won't return
until the send is complete. This all happens within micro seconds on the order of 100ms.
Upon recieve, the code quickly checks to see if there is a carrier around and if so, it
will go into the reading loop.

MOTOR - drives the motors using analogwrite() on the speed pin. Note that analogwrite()
uses the timer 0 and will potentially have higher than expected duty cycles due to
interaction with millis() and delay() functions. Because pins 5/6 are used for speed,
the PWM freq is 980Hz. (see arduino reference for analogWrite())

Speaker - the speaker driver is using pin 10 currently, but should really be moved to
pin 3.  Then 10 can be used for servo.
