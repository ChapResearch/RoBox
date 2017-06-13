#include "Arduino.h"
#include "roboxLED.h"


#define LED1_PIN  A1 
#define LED2_PIN  A2
#define LED3_PIN  A3 


LED::LED(int led)
{
  if(led == 1) {
    pin = LED1_PIN;
  } else if (led == 2) {
    pin = LED2_PIN;
  } else {
    pin = LED3_PIN;
  }
  pinMode(pin, OUTPUT);
  digitalWrite(pin,LOW);	// off by default
  state = LOW;
}


void LED::On()
{
  blink_ms = 0;		// setting this to 0 turns off blink
  state = HIGH;
  digitalWrite(pin, state); 
}

void LED::Off()
{
  blink_ms = 0;		// setting this to 0 turns off blink
  state = LOW;
  digitalWrite(pin, state); 
}

void LED::Toggle()
{
  state = (state == HIGH)?LOW:HIGH;
  digitalWrite(pin, state);
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
