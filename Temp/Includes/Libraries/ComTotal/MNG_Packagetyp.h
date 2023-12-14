/* Automation Studio generated header file */
/* Do not edit ! */

#ifndef _BUR_1702452007_5_
#define _BUR_1702452007_5_

#include <bur/plctypes.h>

/* Datatypes and datatypes of function blocks */
typedef struct ComTotal_INPUTS_32BIT
{	signed short NumSignals;
	plcbit CapPusher_LBK;
	plcbit CapPusher_LFR;
	plcbit MagazineEmpty_IR;
	plcbit CapAtPickup_IR;
	plcbit ColourDetection_IR;
	plcbit CapColour_NOT_BLACK;
	plcbit CapColour_METALLIC;
	plcbit SortingConveyorStart_IR;
	plcbit LogoConveyorStart_IR;
	plcbit LogoConveyorExit_IR;
	plcbit LaneGate1_LBK;
	plcbit LaneGate1_LFR;
	plcbit LaneGate2_LBK;
	plcbit LaneGate2_LFR;
	plcbit PickupArm_LBK;
	plcbit PickupArm_LFR;
	plcbit CapGripper_VACUUM;
	plcbit LaneTop_IR;
	float LogoAxis_ACTPOS;
	plcbit LogoStamper_LBK;
	plcbit LogoStamper_LFR;
	float PuncherAxis_ACTPOS;
	plcbit HolePuncher_LBK;
	plcbit HolePuncher_LFR;
} ComTotal_INPUTS_32BIT;

typedef struct ComTotal_OUTPUTS_32BIT
{	signed short NumSignals;
	plcbit CapPusher_FWD;
	float SortingConveyor_SETSPEED;
	plcbit SortingConveyor_CLEAR;
	float LogoConveyor_SETSPEED;
	plcbit LogoConveyor_CLEAR;
	plcbit LaneGate1_FWD;
	plcbit LaneGate2_FWD;
	plcbit LaneStopper1_CLEAR;
	plcbit LaneStopper2_CLEAR;
	plcbit LaneStopper3_CLEAR;
	plcbit PickupArm_FWD;
	plcbit PickupArm_BWD;
	plcbit CapGripper_PICK;
	plcbit CapStopper_FWD;
	plcbit CP1586_PRESS;
	float LogoAxis_SETPOS;
	plcbit LogoStamper_FWD;
	float PuncherAxis_SETPOS;
	plcbit HolePuncher_FWD;
} ComTotal_OUTPUTS_32BIT;






__asm__(".section \".plc\"");

/* Used IEC files */
__asm__(".ascii \"iecfile \\\"Logical/Libraries/ComTotal/MNG_Package.typ\\\" scope \\\"global\\\"\\n\"");

/* Exported library functions and function blocks */

__asm__(".previous");


#endif /* _BUR_1702452007_5_ */

