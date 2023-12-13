/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1702385683_10_
#define _BUR_1702385683_10_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct SortBasicConvDIs_typ
{	plcbit SortBasicConvStart_IR;
} SortBasicConvDIs_typ;

typedef struct SortBasicConvAOs_typ
{	float SortBasicConvSpeed;
} SortBasicConvAOs_typ;

typedef struct SortBasicConvStatus_typ
{	plcbit Running;
	plcbit Error;
} SortBasicConvStatus_typ;

typedef struct SortBasicConvCmd_typ
{	plcbit Start;
	plcbit Stop;
	plcbit Estop;
	plcbit ErrorReset;
} SortBasicConvCmd_typ;

typedef struct SortBasicConv_typ
{	struct SortBasicConvDIs_typ DIs;
	struct SortBasicConvAOs_typ AOs;
	struct SortBasicConvStatus_typ Status;
	struct SortBasicConvCmd_typ Cmd;
} SortBasicConv_typ;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/SortConvPkg/SortTyp.typ\\\" scope \\\"global\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1702385683_10_ */

