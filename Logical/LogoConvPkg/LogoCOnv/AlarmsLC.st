

ACTION AlarmsLC: 


	IF iLogoConv.AOs.LogoConvSpeed=0 AND iLogoConv.DIs.LogoConvStart_IR=TRUE THEN
		MpAlarmXSet(gAlarmXCore, 'ConvLogoErr');
		IF MpAlarmXCheckReaction(gAlarmXCore, 'EStop') THEN
			iLogoConv.AOs.LogoConvSpeed:=1;
		END_IF
	ELSE
		MpAlarmXReset(gAlarmXCore, 'ConvLogoErr');
	END_IF
END_ACTION

