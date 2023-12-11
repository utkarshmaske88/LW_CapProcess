

ACTION AlarmsCP: 

	IF iCapPush.DIs.MagznPosnEmpty_IR=TRUE THEN
		MpAlarmXSet(gAlarmXCore, 'CapPush');
		IF MpAlarmXCheckReaction(gAlarmXCore, 'Warning') THEN
		//	iCapPush.Status.Error:=TRUE ;
	//		iCapPush.DOs.PushFWD:=TRUE;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'CapPush');
	END_IF
 
END_ACTION

