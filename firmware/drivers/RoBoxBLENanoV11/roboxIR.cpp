//
// roboxIR.ino (.cpp)
//
//   This file implements RoBox-specific IR processing. We started to use the
//   popular IR library, except that it can only send on the PWM pins, which
//   are being use in RoBox for the drive motors. Further, the library was quite
//   general, and took up more space than we wanted.
//
//   So we went with good ole' bit-banging approach. The code was modeled after
//   two great sources:
// 	- https://gist.github.com/EEVblog/6206934
//      - https://learn.adafruit.com/ir-sensor/using-an-ir-sensor
//
//   This code implements an NEC-style IR transmission and reception with a 4-byte
//   packet.  We use 2 bytes to identify RoBox, and 2 bytes for robox id number.
//

// The following defines need to be set appropriately in the source. The port
// register is used directly in the receive code. For port mapping see 
//   - https://www.arduino.cc/en/Hacking/Atmega168Hardware
// If you change the receive pin, then change the port if necessary.
//

#include "Arduino.h"
#include "roboxIR.h"

#define IR_RECV_1_PIN	8
#define IR_RECV_2_PIN	9
	
#define IR_SEND_PIN	13

//
// IRCarrier() - turns on the 38KHz carrier for the given number of microseconds'ish.
//               Disables interrupts to keep it consistent.
//               Call ends with IR LED off.
//
void IRSender::carrier(unsigned int micros)
{
     int loops = micros/26;	// number of loops to run

     cli();
     for(int i=loops; i--; ) {
	  digitalWrite(pin, HIGH); // digitalWrite takes about 5us - turn on IR LED
	  delayMicroseconds(8);		  // delay for 13us (8us + digitalWrite)
	  digitalWrite(pin, LOW);  // turn off the IR LED
	  delayMicroseconds(8);
     }
     sei();
}

IRSender::IRSender()
{
     pin = IR_SEND_PIN;
     digitalWrite(pin, LOW);    //turn off IR LED to start
     pinMode(pin, OUTPUT);
}

//
// IRSendCode() - Sends the given 4-byte code in NEC format (one of many possibilities).
//
void IRSender::sendCode(uint32_t code)
{
     //send the leading pulse
     carrier(IR_SYNC);            //9ms of carrier
     delayMicroseconds(IR_SILENCE);    //4.5ms of silence
  
     //send the user defined 4 byte/32bit code
     for (int i=32; i--;)				//send all 4 bytes or 32 bits
     {
	  carrier(IR_BITWIDTH);               	// turn on the carrier for one bit time
	  if (code & 0x80000000) {			// get the current bit by masking all but the MSB
	       delayMicroseconds(3 * IR_BITWIDTH);	//a HIGH is 3 bit time periods
	  } else{
	       delayMicroseconds(IR_BITWIDTH);		//a LOW is only 1 bit time period
	  }
	  code<<=1;                        		//shift to the next bit for this byte
     }
     carrier(IR_BITWIDTH);                 //send a single STOP bit.
}

IRReceiver::IRReceiver(int recv_number)
{
	if(recv_number == 2) {
		pin = IR_RECV_2_PIN;
	} else { 
		pin = IR_RECV_1_PIN;
	}
	pinMode(pin, INPUT);
	debounce_target = 0;
}

//
// Debounce() - tells the IR routines to ignore incoming signals during the
//              debounce period. This routine should be called RIGHT AFTER
//              a recognized code, and BEFORE the next call to receive a code.
//
void IRReceiver::Debounce()
{
#define DEFAULT_IR_DEBOUNCE	500

     debounce_target = millis() + DEFAULT_IR_DEBOUNCE;
}

//
// IRcheckAndReceive() - checks for an incoming IR signal. If one is incoming
//                       it will be received and returned as 32 bits. If one is
//                       not incoming, zero is returned (false) which is
//                       guaranteed not to be a valid value received.
//
uint32_t IRReceiver::checkAndReceive()
{
     unsigned long start;	// used to provide an escape hatch if things need to timeout
     unsigned long limit;

     // ignore incoming signals during deboung period

     if(millis() < debounce_target) {
	  return(0);
     }

     // note that the logic values of received IR are inverted, so low
     // indicates that a signal is being received.

     // An IR starts off with a 9ms pulse. We are set-up to always catch
     // the first on pulse through our loops, so we should catch it somewhere.

     if(digitalRead(pin)) {		// high, no signal being received
	  return(0);
     }

     // at this point, we are somewhere in an incoming IR signal, hopefully the sync
     // so we wait for the end of the sync, the post-sync-silence, then start decoding
     // This is a spin-loop, just zooming around waiting. Note that we can't let ourselves
     // get stuck here, so if we spend too much time, then we have to assume some problem.
     // The BIG problem is that if we get stuck in a sync, that means that the transmitter
     // is just sending the 38k carrier.  We need to start to ignore the input until it
     // gets fixed.

     limit = micros() + IR_SYNC_TIMEOUT;

     // wait for the sync to get done - signal goes high again

     while(!digitalRead(pin)) {
	  if(micros() > limit) {		// just in case
	       // seems to have a stuck carrier at this point
	       // TODO: track the stuck carrier and return - on the
	       //       way back, wait for it to get unstuck before
	       //       doing anything. Otherwise, each call to this
	       //       loop is a 10ms delay.
	       return(0);
	  }
     }

     start = micros();
     limit = start + IR_SILENCE_TIMEOUT;

     // now wait for the end silence before the data

     while(digitalRead(pin)) {
	  if(micros() > limit) {		// just in case
	       return(0);
	  }
     }

     if((micros() - start) < IR_SILENCE_MINIMUM) {
	  // if we didn't get at least this amount of silence, we have a problem
	  return(0);
     }

     // at this point, we read data for 32 bits - we assume that we are
     // at the start of the first marker (before the first bit)

     uint32_t value = 0;

     for(int i=32; i--; ) {
	  // wait for the rise of the bit, then time until the next fall
	  limit = micros() + IR_BIT_TIMEOUT;
	  while(!digitalRead(pin)) {
	       if(micros() > limit) {		// just in case
		    return(0);
	       }
	  }
	  // at this point we have started the silence to be measured
	  start = micros();
	  limit = start + IR_BIT_TWEEN_TIMEOUT;
	  while(digitalRead(pin)) {
	       if(micros() > limit) {		// just in case
		    return(0);
	       }
	  }
	 
	  // this is where the "end" of the bit is - but not needed as far as I know
	  //   so uncomment these if needed.

	  // unsigned long end;
	  // end = micros();


	  // the next bit marker has just arrived, so we have the value of this bit

	  value <<= 1;
	  if(micros()-start > IR_BIT_WIDTH_CUTOFF) {
	       value |= 0x01;
	  }
     }

     return(value);
}
