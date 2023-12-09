
TYPE
	CmdCapPush_typ : 	STRUCT 
		Start : BOOL;
		Estop : BOOL;
		Stop : BOOL;
		ErrorReset : BOOL;
	END_STRUCT;
	CapPush_typ : 	STRUCT 
		Cmd : CmdCapPush_typ;
		DIs : CapPushDIs_typ;
		DOs : CapPushDOs_typ;
		Status : StatusCapPush_typ;
	END_STRUCT;
	StatusCapPush_typ : 	STRUCT 
		Pushing : BOOL;
		Running : BOOL;
		Backing : BOOL;
		Error : BOOL;
	END_STRUCT;
	CapPushDIs_typ : 	STRUCT 
		PusherLBK : BOOL;
		PusherLFR : BOOL;
		PickUp_IR : BOOL;
		MagznPosnEmpty_IR : BOOL;
	END_STRUCT;
	CapPushDOs_typ : 	STRUCT 
		PushFWD : BOOL;
	END_STRUCT;
END_TYPE
