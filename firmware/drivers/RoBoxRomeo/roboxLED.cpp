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
}


void LED::On()
{
  digitalWrite(pin, HIGH); 
}

void LED::Off()
{
  digitalWrite(pin, LOW); 
}

void LED::Blink(int freq)
{
  digitalWrite(pin, HIGH); 
  delay(freq); 
  digitalWrite(pin, LOW); 
  delay(freq); 
}
