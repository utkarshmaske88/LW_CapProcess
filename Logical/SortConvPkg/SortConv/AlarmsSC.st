

ACTION AlarmsSC: 


	IF iSortConv.AOs.SortBasicConvSpeed=0 AND iSortConv.DIs.SortBasicConvStart_IR=TRUE THEN
		MpAlarmXSet(gAlarmXCore, 'ConvSortErr');
		IF MpAlarmXCheckReaction(gAlarmXCore, 'EStop') THEN
			iSortConv.AOs.SortBasicConvSpeed:=1;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'ConvSortErr');
	END_IF
END_ACTION

