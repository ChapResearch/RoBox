int pinNumber = A2;
int pinNumber2 = A1;
int pinNumber3 = A3;
void setup() {

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(pinNumber, OUTPUT);
  pinMode(pinNumber2, OUTPUT);
  pinMode(pinNumber3, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(pinNumber, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);                       // wait for a second
  digitalWrite(pinNumber, LOW);    // turn the LED off by making the voltage LOW
  delay(100); 
  digitalWrite(pinNumber2, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);                       // wait for a second
  digitalWrite(pinNumber2, LOW);    // turn the LED off by making the voltage LOW
  delay(100);  
  digitalWrite(pinNumber3, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);                       // wait for a second
  digitalWrite(pinNumber3, LOW);    // turn the LED off by making the voltage LOW
  delay(100);  // wait for a second
}
