//
// IR-ID.h
//
//   This file defines the base IR-ID for RoBox, which is
//   sent as the upper 16 bits in the IR code.  The lower
//   16 bits are the particular RoBox identifier
//

// The following code is based upon the SparkFun remote control
// Note that the new remote has different codes, and the RoBox
// and target will respond to the new codes.  HOWEVER, the RoBox
// sends out the original codes (IR_BASE_ID1) only.

#define IR_BASE_ID1	0x10EF		// original control
#define IR_A_CODE1	0xf807		// original A
#define IR_B_CODE1	0x7887		// original B
#define IR_C_CODE1	0x58a7		// original C

#define IR_BASE_ID2	0x00FF		// new one
#define IR_A_CODE2	0x22DD		// new A
#define IR_B_CODE2	0x02FD		// new B
#define IR_C_CODE2	0xC23D		// new C

#define IRHIT(v)  (((v & 0xffff0000)>>16) == IR_BASE_ID1 || ((v & 0xffff0000)>>16) == IR_BASE_ID2)

