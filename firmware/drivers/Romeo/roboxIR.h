
#ifndef ROBOXIR_H
#define ROBOXIR_H

// Defines for receiving

#define IR_SYNC			 9000		// 9ms - IR sync width
#define IR_SILENCE		 4500		// 4.5ms - Silence before data

#define IR_SYNC_TIMEOUT		10000		// 10ms - timeout for getting end of sync
#define IR_SILENCE_TIMEOUT	 5000		// 5ms - post-sync silence timeout
#define IR_SILENCE_MINIMUM	 3500		// 3.5ms - minimum amount of silence to be valid
#define IR_BIT_TIMEOUT		 1000		// 1ms - maximum amount of time to wait for bit marker
#define IR_BIT_TWEEN_TIMEOUT	 2000		// 2ms - max time to wait for bit measurement
#define IR_BIT_WIDTH_CUTOFF	 1000		// 1ms - less means zero, greater means one

// Defines for sending
#define IR_BITWIDTH		  562		// .562ms - width of a bit on the way out

class IRSender {
private:
     int	pin;	// pin to use for sending - passed to digitalWrite()

private:
     void carrier(unsigned int);

public:
     IRSender(int);
     void sendCode(uint32_t);
};

class IRReceiver {
private:
     int		pin;

public:
     IRReceiver(int);
     uint32_t checkAndReceive();
};

#endif
