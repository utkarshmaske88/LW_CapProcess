
#ifndef  _MNGGLOBAL_HPP_
#define _MNGGLOBAL_HPP_

#include <mng_globalTYP.h>


    typedef struct {

		signed short NumSignals;

        /* BOOL CapPusher_LBK */
        BOOL CapPusher_LBK;
        /* BOOL CapPusher_LFR */
        BOOL CapPusher_LFR;
        /* BOOL MagazineEmpty_IR */
        BOOL MagazineEmpty_IR;
        /* BOOL CapAtPickup_IR */
        BOOL CapAtPickup_IR;
        /* BOOL ColourDetection_IR */
        BOOL ColourDetection_IR;
        /* BOOL CapColour_NOT_BLACK */
        BOOL CapColour_NOT_BLACK;
        /* BOOL CapColour_METALLIC */
        BOOL CapColour_METALLIC;
        /* BOOL SortingConveyorStart_IR */
        BOOL SortingConveyorStart_IR;
        /* BOOL LogoConveyorStart_IR */
        BOOL LogoConveyorStart_IR;
        /* BOOL LogoConveyorExit_IR */
        BOOL LogoConveyorExit_IR;
        /* BOOL LaneGate1_LBK */
        BOOL LaneGate1_LBK;
        /* BOOL LaneGate1_LFR */
        BOOL LaneGate1_LFR;
        /* BOOL LaneGate2_LBK */
        BOOL LaneGate2_LBK;
        /* BOOL LaneGate2_LFR */
        BOOL LaneGate2_LFR;
        /* BOOL PickupArm_LBK */
        BOOL PickupArm_LBK;
        /* BOOL PickupArm_LFR */
        BOOL PickupArm_LFR;
        /* BOOL CapGripper_VACUUM */
        BOOL CapGripper_VACUUM;
        /* BOOL LaneTop_IR */
        BOOL LaneTop_IR;
        /* REAL LogoAxis_ACTPOS */
        REAL LogoAxis_ACTPOS;
        /* BOOL LogoStamper_LBK */
        BOOL LogoStamper_LBK;
        /* BOOL LogoStamper_LFR */
        BOOL LogoStamper_LFR;
        /* REAL PuncherAxis_ACTPOS */
        REAL PuncherAxis_ACTPOS;
        /* BOOL HolePuncher_LBK */
        BOOL HolePuncher_LBK;
        /* BOOL HolePuncher_LFR */
        BOOL HolePuncher_LFR;

        } ComTotal_INPUTS_32BIT_FWRD;


    typedef struct {

		signed short NumSignals;

        /* BOOL CapPusher_FWD */
        BOOL CapPusher_FWD;
        /* REAL SortingConveyor_SETSPEED */
        REAL SortingConveyor_SETSPEED;
        /* BOOL SortingConveyor_CLEAR */
        BOOL SortingConveyor_CLEAR;
        /* REAL LogoConveyor_SETSPEED */
        REAL LogoConveyor_SETSPEED;
        /* BOOL LogoConveyor_CLEAR */
        BOOL LogoConveyor_CLEAR;
        /* BOOL LaneGate1_FWD */
        BOOL LaneGate1_FWD;
        /* BOOL LaneGate2_FWD */
        BOOL LaneGate2_FWD;
        /* BOOL LaneStopper1_CLEAR */
        BOOL LaneStopper1_CLEAR;
        /* BOOL LaneStopper2_CLEAR */
        BOOL LaneStopper2_CLEAR;
        /* BOOL LaneStopper3_CLEAR */
        BOOL LaneStopper3_CLEAR;
        /* BOOL PickupArm_FWD */
        BOOL PickupArm_FWD;
        /* BOOL PickupArm_BWD */
        BOOL PickupArm_BWD;
        /* BOOL CapGripper_PICK */
        BOOL CapGripper_PICK;
        /* BOOL CapStopper_FWD */
        BOOL CapStopper_FWD;
        /* BOOL CP1586_PRESS */
        BOOL CP1586_PRESS;
        /* REAL LogoAxis_SETPOS */
        REAL LogoAxis_SETPOS;
        /* BOOL LogoStamper_FWD */
        BOOL LogoStamper_FWD;
        /* REAL PuncherAxis_SETPOS */
        REAL PuncherAxis_SETPOS;
        /* BOOL HolePuncher_FWD */
        BOOL HolePuncher_FWD;

        } ComTotal_OUTPUTS_32BIT_FWRD;



#endif
