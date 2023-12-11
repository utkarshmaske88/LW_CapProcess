 

ACTION AlarmsCD: 


	IF iClrDetect.Cmd.Estop=TRUE   THEN
		MpAlarmXSet(gAlarmXCore, 'EStopLG');
		iClrDetect.Status.Error:=TRUE;
		IF MpAlarmXCheckReaction(gAlarmXCore, 'EStop') THEN
			sClrDetectStep:=enERROR;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'EStopLG');
	END_IF

END_ACTION

