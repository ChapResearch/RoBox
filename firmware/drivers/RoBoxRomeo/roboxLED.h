//
// roboxLED.h
//

#ifndef ROBOXLED_H
#define ROBOXLED_H

class LED {
 private:
  int pin;
  
 public: 
  LED(int);
  void On();
  void Off();
  void Blink(int);
};
#endif
