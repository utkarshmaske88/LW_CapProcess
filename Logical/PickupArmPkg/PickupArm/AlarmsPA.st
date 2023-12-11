

ACTION AlarmsPA: 

	IF  iPickupArm.DIs.PArm_BWD=TRUE AND iPickupArm.DIs.PArm_FWD=TRUE THEN
		MpAlarmXSet(gAlarmXCore, 'PArmError');
		IF MpAlarmXCheckReaction(gAlarmXCore, 'EStop') THEN
			//	iCapPush.Status.Error:=TRUE ;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'PArmError');
	END_IF

	IF iPickupArm.DOs.PArmLFR =TRUE AND iPickupArm.DOs.CapGripVaccum=FALSE THEN
		MpAlarmXSet(gAlarmXCore, 'VaccumError');
		IF MpAlarmXCheckReaction(gAlarmXCore, 'Warning') THEN
			//	iCapPush.Status.Error:=TRUE ;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'VaccumError');
	END_IF
END_ACTION

