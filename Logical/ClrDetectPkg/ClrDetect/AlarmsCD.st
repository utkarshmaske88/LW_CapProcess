

ACTION AlarmsCD: 


	IF iClrDetect.Cmd.Estop=TRUE   THEN
		MpAlarmXSet(gAlarmXCore, 'EStopCD');
		iClrDetect.Status.Error:=TRUE;
		IF MpAlarmXCheckReaction(gAlarmXCore, 'EStop') THEN
		//	sClrDetectStep:=enERROR;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'EStopCD');
	END_IF
	
	IF iClrDetect.Status.iNoOfBlack =MAXNOCAP   OR iClrDetect.Status.iNoOfRed =MAXNOCAP  OR iClrDetect.Status.iNoOfMetallic=MAXNOCAP   THEN
		MpAlarmXSet(gAlarmXCore, 'CapsFull');
		IF MpAlarmXCheckReaction(gAlarmXCore, 'EStop') THEN
			iClrDetect.Status.iNoOfBlack:=0;
			iClrDetect.Status.iNoOfMetallic:=0;
			iClrDetect.Status.iNoOfMetallic:=0;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'CapsFull');
	END_IF
END_ACTION

