 

ACTION AlarmsAuto: 


	IF gMainCmd.EStop=TRUE   THEN
		MpAlarmXSet(gAlarmXCore, 'EStopAuto');
		iClrDetect.Status.Error:=TRUE;
		IF MpAlarmXCheckReaction(gAlarmXCore, 'EStop') THEN
			sClrDetectStep:=enERROR;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'EStopAuto');
	END_IF

END_ACTION

