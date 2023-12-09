
#include "MNG_InternalTyp.hpp"

unsigned long int MNG_CpyMsgToInp(MNG_RawDatagram * pFromServer, ComTotal_INPUTS_32BIT_FWRD *pSimInputs) {

    MNG_DatagramType datagramType;
	unsigned long int DWordBuffer;
        unsigned long int byteCount;
	unsigned long int numSignalsInMessage;


	byteCount = N_TO_HUDINT((pFromServer->Header).ByteCount);
	datagramType = static_cast<MNG_DatagramType>(N_TO_HUDINT((pFromServer->Header).DatagramType));
	if (datagramType != MNG_Raw32BitImage) {
		return 0;
	}

    pSimInputs->NumSignals = 24;

    numSignalsInMessage = N_TO_HUDINT(pFromServer->Payload[0]);
        if ((static_cast<long int>(numSignalsInMessage) != pSimInputs->NumSignals) ||
	(byteCount != 4 + numSignalsInMessage * 4)) {
		return 0;
	}

    /* BOOL CapPusher_LBK */
    pSimInputs->CapPusher_LBK = (pFromServer->Payload[1] != 0);

    /* BOOL CapPusher_LFR */
    pSimInputs->CapPusher_LFR = (pFromServer->Payload[2] != 0);

    /* BOOL MagazineEmpty_IR */
    pSimInputs->MagazineEmpty_IR = (pFromServer->Payload[3] != 0);

    /* BOOL CapAtPickup_IR */
    pSimInputs->CapAtPickup_IR = (pFromServer->Payload[4] != 0);

    /* BOOL ColourDetection_IR */
    pSimInputs->ColourDetection_IR = (pFromServer->Payload[5] != 0);

    /* BOOL CapColour_NOT_BLACK */
    pSimInputs->CapColour_NOT_BLACK = (pFromServer->Payload[6] != 0);

    /* BOOL CapColour_METALLIC */
    pSimInputs->CapColour_METALLIC = (pFromServer->Payload[7] != 0);

    /* BOOL SortingConveyorStart_IR */
    pSimInputs->SortingConveyorStart_IR = (pFromServer->Payload[8] != 0);

    /* BOOL LogoConveyorStart_IR */
    pSimInputs->LogoConveyorStart_IR = (pFromServer->Payload[9] != 0);

    /* BOOL LogoConveyorExit_IR */
    pSimInputs->LogoConveyorExit_IR = (pFromServer->Payload[10] != 0);

    /* BOOL LaneGate1_LBK */
    pSimInputs->LaneGate1_LBK = (pFromServer->Payload[11] != 0);

    /* BOOL LaneGate1_LFR */
    pSimInputs->LaneGate1_LFR = (pFromServer->Payload[12] != 0);

    /* BOOL LaneGate2_LBK */
    pSimInputs->LaneGate2_LBK = (pFromServer->Payload[13] != 0);

    /* BOOL LaneGate2_LFR */
    pSimInputs->LaneGate2_LFR = (pFromServer->Payload[14] != 0);

    /* BOOL PickupArm_LBK */
    pSimInputs->PickupArm_LBK = (pFromServer->Payload[15] != 0);

    /* BOOL PickupArm_LFR */
    pSimInputs->PickupArm_LFR = (pFromServer->Payload[16] != 0);

    /* BOOL CapGripper_VACUUM */
    pSimInputs->CapGripper_VACUUM = (pFromServer->Payload[17] != 0);

    /* BOOL LaneTop_IR */
    pSimInputs->LaneTop_IR = (pFromServer->Payload[18] != 0);

    /* FLOAT32 LogoAxis_ACTPOS */
    DWordBuffer = N_TO_HUDINT(pFromServer->Payload[19]);
    brsmemcpy((unsigned long int)&(pSimInputs->LogoAxis_ACTPOS), (unsigned long int)&(DWordBuffer), 4);

    /* BOOL LogoStamper_LBK */
    pSimInputs->LogoStamper_LBK = (pFromServer->Payload[20] != 0);

    /* BOOL LogoStamper_LFR */
    pSimInputs->LogoStamper_LFR = (pFromServer->Payload[21] != 0);

    /* FLOAT32 PuncherAxis_ACTPOS */
    DWordBuffer = N_TO_HUDINT(pFromServer->Payload[22]);
    brsmemcpy((unsigned long int)&(pSimInputs->PuncherAxis_ACTPOS), (unsigned long int)&(DWordBuffer), 4);

    /* BOOL HolePuncher_LBK */
    pSimInputs->HolePuncher_LBK = (pFromServer->Payload[23] != 0);

    /* BOOL HolePuncher_LFR */
    pSimInputs->HolePuncher_LFR = (pFromServer->Payload[24] != 0);


return N_TO_HUDINT((pFromServer->Header).Counter); // return counter
}
