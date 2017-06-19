//      ____ _  __ __ 
//     / __ \ |/ // / 
//    / /_/ /   // /  
//   / _, _/   |/ /___
//  /_/ |_/_/|_/_____/
// 
// rxl.h
//

#ifndef RXL_H
#define RXL_H

int RXL(Program&);
void RXL_Skip(Program&);
Program RXL_SubProgram(Program&);

int RXL_Break(Program&);
void RXL_Wheel(Program&);
void RXL_Sleep(Program&);
void RXL_Beep(Program&);
void RXL_Led(Program&);
void RXL_Ir(Program&);
int RXL_Repeat(Program&);
void RXL_If(Program&);

#endif
