/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1702452007_8_
#define _BUR_1702452007_8_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct DOs_typ
{	plcbit PArmLFR;
	plcbit PArmLBK;
	plcbit CapGripVaccum;
} DOs_typ;

typedef struct PArmCmd_typ
{	plcbit Start;
	plcbit Stop;
	plcbit Estop;
	plcbit ErrorReset;
} PArmCmd_typ;

typedef struct PArmStatus_typ
{	plcbit Running;
	plcbit PickingUp;
	plcbit Dropping;
	plcbit Holding;
	plcbit Error;
} PArmStatus_typ;

typedef struct DIs_typ
{	plcbit PArm_FWD;
	plcbit PArm_BWD;
	plcbit CapGripper_PICK;
} DIs_typ;

typedef struct PickupArm_typ
{	struct DOs_typ DOs;
	struct PArmCmd_typ Cmd;
	struct PArmStatus_typ Status;
	struct DIs_typ DIs;
} PickupArm_typ;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/PickupArmPkg/Pickuptyp.typ\\\" scope \\\"global\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1702452007_8_ */

