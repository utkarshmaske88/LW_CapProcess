/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1702057554_4_
#define _BUR_1702057554_4_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct DIClrDetect_typ
{	plcbit ColorDetectionIR;
	plcbit ColorDtectNotBlack;
	plcbit ColorDtectMetallic;
} DIClrDetect_typ;

typedef struct DOClrDetect_typ
{	plcbit CapStopperFWD;
} DOClrDetect_typ;

typedef struct CmdClrDetect_typ
{	plcbit Start;
	plcbit Stop;
	plcbit Estop;
} CmdClrDetect_typ;

typedef struct StatusClrDetect_typ
{	plcbit Running;
	plcbit Error;
} StatusClrDetect_typ;

typedef struct ClrDetect_typ
{	struct DIClrDetect_typ DIs;
	struct DOClrDetect_typ DOs;
	struct CmdClrDetect_typ Cmd;
	struct StatusClrDetect_typ Status;
} ClrDetect_typ;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/ClrDetectPkg/ClrDetTyp.typ\\\" scope \\\"restricted\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1702057554_4_ */

