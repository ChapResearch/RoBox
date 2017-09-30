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
unsigned long RXL_Sleep(Program&);
void RXL_Beep(Program&);
void RXL_Led(Program&);
void RXL_Ir(Program&);
int RXL_Repeat(Program&);
bool RXL_OpEvaluate(int,int,int);
int RXL_ValueEvaluate(int);
int RXL_If(Program&);
int RXL_Else(Program&);
void RXL_Start(Program&);
void RXL_Variable(Program&);
void RXL_SetMethod(Program&);
int RXL_RunMethod(Program&);
void RXL_PreLoad(Program&);

#endif
