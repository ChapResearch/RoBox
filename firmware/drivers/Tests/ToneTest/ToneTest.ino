
#include "Arduino.h"
#include "RoBoxRomeoV20.h"

ToneGenerator myTone = ToneGenerator();

int count = 16;
int freq = 110;

void setup()
{
     Serial.begin(9600);

}

void loop()
{
     if(!myTone.status && count) {
	  freq = freq * 12 / 10;
	  myTone.Play(freq,10);
	  count--;
	  Serial.println("beep beep");
     }
     
     myTone.Update();
}
