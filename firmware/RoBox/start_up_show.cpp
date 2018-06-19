#include "Arduino.h"
#include "hardware.h"
#include "start_up_show.h"

int count = 4;
int freq[] = {23, 35, 47, 59};

void start_up_show()
{
    hw_led(1, 1);
    delay(250);
    hw_led(2, 1);
    delay(250);
    hw_led(3, 1); 
    delay(250);
    hw_led(1,0);
    hw_led(2,0);
    hw_led(3,0);
    delay(250);
    hw_led(1, 1);
    hw_led(2, 1);
    hw_led(3, 1);
    delay(250);
    hw_led(1,0);
    hw_led(2,0);
    hw_led(3,0);

    for(int i = 0; i < count; i++) {
	hw_tone(freq[i], 1);
	delay(100);
    }
}
