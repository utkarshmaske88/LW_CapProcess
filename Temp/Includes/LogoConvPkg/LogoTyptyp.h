/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1702271142_9_
#define _BUR_1702271142_9_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct LogoConvDIs
{	plcbit LogoConvStart_IR;
	plcbit LogoConvExit_IR;
	float LogoActPos;
} LogoConvDIs;

typedef struct LogoConvAOs
{	float LogoConvSpeed;
} LogoConvAOs;

typedef struct LogoConvCmd
{	plcbit Start;
	plcbit Stop;
	plcbit Estop;
	plcbit ErrorReset;
} LogoConvCmd;

typedef struct LogoConvStatus
{	plcbit Running;
	plcbit Error;
} LogoConvStatus;

typedef struct LogoConv_typ
{	struct LogoConvDIs DIs;
	struct LogoConvAOs AOs;
	struct LogoConvCmd Cmd;
	struct LogoConvStatus Status;
} LogoConv_typ;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/LogoConvPkg/LogoTyp.typ\\\" scope \\\"global\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1702271142_9_ */

