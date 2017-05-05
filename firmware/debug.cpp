//
//         __     __               
//    ____/ /__  / /_  __  ______ _
//   / __  / _ \/ __ \/ / / / __ `/
//  / /_/ /  __/ /_/ / /_/ / /_/ / 
//  \__,_/\___/_.___/\__,_/\__, /  
//                        /____/   
//

#include "debug.h"

#include <stdarg.h>
#include <stdio.h>
#include "debug.h"

void debugOutput(const char *format,...)
{
#ifdef DEBUGGING

	va_list args;
	va_start(args,format);
	vprintf(format,args);
	va_end(args);

#endif
}

