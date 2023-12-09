
TYPE
	ClrDetect_typ : 	STRUCT  (*main strcuter for colore detection*)
		DIs : DIClrDetect_typ; (*digital inputs*)
		DOs : DOClrDetect_typ; (*digital outputs*)
		Cmd : CmdClrDetect_typ; (*commands*)
		Status : StatusClrDetect_typ; (*status for color*)
	END_STRUCT;
	DIClrDetect_typ : 	STRUCT  (*Digital input strcutuere*)
		ColorDetectionIR : BOOL; (*ir sensor for color detection*)
		ColorDtectNotBlack : BOOL; (*cap is not black*)
		ColorDtectMetallic : BOOL; (*cap is of mettalic color*)
	END_STRUCT;
	DOClrDetect_typ : 	STRUCT  (*do for color detection*)
		CapStopperFWD : BOOL; (*cap stopper in forward direxn*)
	END_STRUCT;
	CmdClrDetect_typ : 	STRUCT  (*color command strcutre*)
		Start : BOOL; (*starting*)
		Stop : BOOL; (*stopping*)
		Estop : BOOL; (*emergency stop pressed*)
	END_STRUCT;
	StatusClrDetect_typ : 	STRUCT  (*status for color structure*)
		Running : BOOL; (*running *)
		Error : BOOL; (*error mode*)
	END_STRUCT;
END_TYPE
