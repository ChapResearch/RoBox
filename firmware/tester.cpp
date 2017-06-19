#include "actions.h"
#include "debug.h"
#include "program.h"
#include "RXL.h"
#include "robox.h"

#include "EEPROM.h"

int main(int argc, char **argv)
{
	debugOutput("--------------\n");
	// the \033 is an octal (base 8) constant - which is -100 in our world

//                          000   00    000    111   111   111   1   22   22   2   22   2   22   333   3   33
//                          012   345   6789   012   345   678   9   01   23   4   56   7   89   012   3   45
//	Program program(36,"WL\033WR\177S\012B\332\107L20L11L31F\200\010RT\011(WL\033WR\177RT\005(B\100\100))");

//	Program program(30,"WL\033RT\002(WL\033WR\177RT\005(B\100\100K\000B\100\100B\100\100))");

// this program is particularly nasty, it has what looks like a paren in one of the instructions

//	Program program(40,"WL\051WR\002RT\003(WL\050WR\051B\000\000)RT\003(WL\050WR\051B\000\000)B\100\100B\100\100");

	for(int i=0; i < 1; i++) {

//	    Program program(30,"WL\000RT\002(RT\003(WL\001WR\001K\003B\100\100)B\000\000)B\050\050");	    
	    Program program(30,"I\000=\000(WL\003WR\000)");

	    program.Dump();

	    RXL(program);
	}

	debugOutput("--------------\n");
}
