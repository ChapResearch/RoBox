#include "actions.h"
#include "debug.h"
#include "program.h"
#include "RXL.h"
#include "robox.h"

#include "EEPROM.h"

int main(int argc, char **argv)
{
	// the \033 is an octal (base 8) constant - which is -100 in our world
	Program program("WL\033WR\177S\012B\332\109");

//	program.Dump();

	RXL(program);

}
