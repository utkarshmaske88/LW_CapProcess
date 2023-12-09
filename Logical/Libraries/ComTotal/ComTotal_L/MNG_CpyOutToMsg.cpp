
#include "MNG_InternalTyp.hpp"

unsigned long int MNG_CpyOutToMsg(MNG_RawDatagram * pToServer, unsigned long int counter, ComTotal_OUTPUTS_32BIT_FWRD *pSimOutputs ) {

    
        unsigned long int DWordBuffer;
	
        pSimOutputs->NumSignals = 19;
        (pToServer->Header).ByteCount    = H_TO_NUDINT(80);
        (pToServer->Header).DatagramType = H_TO_NUDINT(MNG_Raw32BitImage);
        (pToServer->Header).SentTime = H_TO_NUDINT(0);  // Todo
        (pToServer->Header).Counter = H_TO_NUDINT(counter);
        pToServer->Payload[0] = H_TO_NUDINT(pSimOutputs->NumSignals);

    
    /* CapPusher_FWD : BOOL */
    if(pSimOutputs->CapPusher_FWD == 1) {
        pToServer->Payload[1] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[1] = 0;
    }


    /* SortingConveyor_SETSPEED : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->SortingConveyor_SETSPEED), 4);
    pToServer->Payload[2] = H_TO_NUDINT(DWordBuffer);


    /* SortingConveyor_CLEAR : BOOL */
    if(pSimOutputs->SortingConveyor_CLEAR == 1) {
        pToServer->Payload[3] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[3] = 0;
    }


    /* LogoConveyor_SETSPEED : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->LogoConveyor_SETSPEED), 4);
    pToServer->Payload[4] = H_TO_NUDINT(DWordBuffer);


    /* LogoConveyor_CLEAR : BOOL */
    if(pSimOutputs->LogoConveyor_CLEAR == 1) {
        pToServer->Payload[5] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[5] = 0;
    }


    /* LaneGate1_FWD : BOOL */
    if(pSimOutputs->LaneGate1_FWD == 1) {
        pToServer->Payload[6] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[6] = 0;
    }


    /* LaneGate2_FWD : BOOL */
    if(pSimOutputs->LaneGate2_FWD == 1) {
        pToServer->Payload[7] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[7] = 0;
    }


    /* LaneStopper1_CLEAR : BOOL */
    if(pSimOutputs->LaneStopper1_CLEAR == 1) {
        pToServer->Payload[8] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[8] = 0;
    }


    /* LaneStopper2_CLEAR : BOOL */
    if(pSimOutputs->LaneStopper2_CLEAR == 1) {
        pToServer->Payload[9] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[9] = 0;
    }


    /* LaneStopper3_CLEAR : BOOL */
    if(pSimOutputs->LaneStopper3_CLEAR == 1) {
        pToServer->Payload[10] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[10] = 0;
    }


    /* PickupArm_FWD : BOOL */
    if(pSimOutputs->PickupArm_FWD == 1) {
        pToServer->Payload[11] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[11] = 0;
    }


    /* PickupArm_BWD : BOOL */
    if(pSimOutputs->PickupArm_BWD == 1) {
        pToServer->Payload[12] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[12] = 0;
    }


    /* CapGripper_PICK : BOOL */
    if(pSimOutputs->CapGripper_PICK == 1) {
        pToServer->Payload[13] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[13] = 0;
    }


    /* CapStopper_FWD : BOOL */
    if(pSimOutputs->CapStopper_FWD == 1) {
        pToServer->Payload[14] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[14] = 0;
    }


    /* CP1586_PRESS : BOOL */
    if(pSimOutputs->CP1586_PRESS == 1) {
        pToServer->Payload[15] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[15] = 0;
    }


    /* LogoAxis_SETPOS : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->LogoAxis_SETPOS), 4);
    pToServer->Payload[16] = H_TO_NUDINT(DWordBuffer);


    /* LogoStamper_FWD : BOOL */
    if(pSimOutputs->LogoStamper_FWD == 1) {
        pToServer->Payload[17] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[17] = 0;
    }


    /* PuncherAxis_SETPOS : FLOAT32 */
    brsmemcpy((unsigned long int)&(DWordBuffer), (unsigned long int)&(pSimOutputs->PuncherAxis_SETPOS), 4);
    pToServer->Payload[18] = H_TO_NUDINT(DWordBuffer);


    /* HolePuncher_FWD : BOOL */
    if(pSimOutputs->HolePuncher_FWD == 1) {
        pToServer->Payload[19] = 0xFFFFFFFF;   /*BOOL */
    } else { 
        pToServer->Payload[19] = 0;
    }


	return 0;
}
