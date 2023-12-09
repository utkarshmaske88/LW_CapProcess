/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1702118596_1_
#define _BUR_1702118596_1_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct CmdLineGates_typ
{	plcbit Start;
	plcbit Stop;
	plcbit Estop;
} CmdLineGates_typ;

typedef struct StatusLineGates_typ
{	plcbit Running;
	plcbit Error;
} StatusLineGates_typ;

typedef struct DILineGates_typ
{	plcbit LG1_LFR;
	plcbit LG1_LBK;
	plcbit LG2_LFR;
	plcbit LG2_LBK;
	plcbit LaneTopIR;
} DILineGates_typ;

typedef struct DOLineGates_typ
{	plcbit LG1FWD;
	plcbit LW2FWD;
} DOLineGates_typ;

typedef struct LineGates_typ
{	struct CmdLineGates_typ Cmd;
	struct StatusLineGates_typ Status;
	struct DILineGates_typ DIs;
	struct DOLineGates_typ DOs;
} LineGates_typ;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/LaneGatesPkg/Types.typ\\\" scope \\\"global\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1702118596_1_ */

