/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1702121556_1_
#define _BUR_1702121556_1_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct CmdCapPush_typ
{	plcbit Start;
	plcbit Estop;
	plcbit Stop;
	plcbit ErrorReset;
} CmdCapPush_typ;

typedef struct CapPushDIs_typ
{	plcbit PusherLBK;
	plcbit PusherLFR;
	plcbit PickUp_IR;
	plcbit MagznPosnEmpty_IR;
} CapPushDIs_typ;

typedef struct CapPushDOs_typ
{	plcbit PushFWD;
} CapPushDOs_typ;

typedef struct StatusCapPush_typ
{	plcbit Pushing;
	plcbit Running;
	plcbit Backing;
	plcbit Error;
} StatusCapPush_typ;

typedef struct CapPush_typ
{	struct CmdCapPush_typ Cmd;
	struct CapPushDIs_typ DIs;
	struct CapPushDOs_typ DOs;
	struct StatusCapPush_typ Status;
} CapPush_typ;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/CapPushPkg/CapPushtyp.typ\\\" scope \\\"global\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1702121556_1_ */

