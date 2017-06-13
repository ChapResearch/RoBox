//
// roboxLED.h
//

#ifndef ROBOXLED_H
#define ROBOXLED_H

class LED {
 private:
  int pin;
  int state;
  int blink_ms;
  long blink_target;
  
 public: 
  LED(int);
  void On();
  void Off();
  void Toggle();
  void Blink(int);
  void Update();	
};
#endif
