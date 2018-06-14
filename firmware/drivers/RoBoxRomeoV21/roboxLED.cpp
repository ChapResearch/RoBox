#include "Arduino.h"
#include "roboxLED.h"
//library for addressable led timing
#include <PololuLedStrip.h>

#define LED_PIN  A1
#define LED_COUNT 3

//an ledStrip object starting on pin 1
PololuLedStrip<LED_PIN> ledStrip;

rgb_color colors[LED_COUNT];

//setting default colors for LEDs
void setOff(int ledIndex) 
{
    colors[ledIndex].red = 0x00;
    colors[ledIndex].green = 0x00;
    colors[ledIndex].blue = 0x00;
    ledStrip.write(colors,LED_COUNT);
}
void setRed(int ledIndex) 
{
    //green and red are switched since the LEDs are programmed in the order G-R-B
    colors[ledIndex].green = 0x80;
    colors[ledIndex].red = 0x00;
    colors[ledIndex].blue = 0x00;
    ledStrip.write(colors,LED_COUNT);
}
void setYellow(int ledIndex) 
{
    //green and red are switched since the LEDs are programmed in the order G-R-B
    colors[ledIndex].red = 0x20;
    colors[ledIndex].green = 0x50;
    colors[ledIndex].blue = 0x00;
    ledStrip.write(colors,LED_COUNT);
}
void setGreen(int ledIndex) 
{
     //green and red are switched since the LEDs are programmed in the order G-R-B
    colors[ledIndex].green = 0x00;
    colors[ledIndex].red = 0x20;
    colors[ledIndex].blue = 0x00;
    ledStrip.write(colors,LED_COUNT);
}


LED::LED(int in_led)
{

    led = in_led-1;      // in_led is between 1 and 3
    state = LOW;
}


void LED::On()
{
    switch(led) {
    case 0: setRed(led); break;
    case 1: setYellow(led); break;
    case 2: setGreen(led); break;
    }
  blink_ms = 0;		// setting this to 0 turns off blink
  state = HIGH;
}

void LED::Off()
{
    setOff(led);
    blink_ms = 0;		// setting this to 0 turns off blink
    state = LOW;
}

void LED::Toggle()
{
    if(state == HIGH) {
	setOff(led);
    } else {
	switch(led) {
	case 0: setRed(led); break;
	case 1: setYellow(led); break;
	case 2: setGreen(led); break;
	}
    }    
    state = (state==HIGH) ? LOW : HIGH;
}

//
// Blink() - blink the LED at the given frequency. 
//		freq is given in ms. For example, if the freq 
//		given is 250 then the blink would be 4 times a second.
//		To turn off blink, set freq to 0.
//
void LED::Blink(int freq)
{
  blink_ms = freq/2; 
  blink_target = millis()+blink_ms;
}

//
// Update() - call this routine at the end of every loop
//		to update any blinking LEDs
// 
void LED::Update()
{
    if(blink_ms!=0 && millis()>blink_target) {
	blink_target = millis()+blink_ms;    
	Toggle();
    }
}
