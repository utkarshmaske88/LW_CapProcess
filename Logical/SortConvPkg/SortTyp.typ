(*Strcutre for main control*)

TYPE
	SortBasicConv_typ : 	STRUCT  (*conveyor main strcutre*)
		DIs : SortBasicConvDIs_typ; (*DI strcture*)
		AOs : SortBasicConvAOs_typ; (*AO strcutre *)
		Status : SortBasicConvStatus_typ; (*status strcuter*)
		Cmd : SortBasicConvCmd_typ; (*commands*)
	END_STRUCT;
END_TYPE

(*Digital outputs*)

TYPE
	SortBasicConvDIs_typ : 	STRUCT  (*sort conveyor Digital inputs*)
		SortBasicConvStart_IR : BOOL; (*IR sesnor detecting*)
	END_STRUCT;
END_TYPE

(*Analog ouputs*)

TYPE
	SortBasicConvAOs_typ : 	STRUCT  (*Analog outputs*)
		SortBasicConvSpeed : REAL; (*conveyor spped of basics*)
	END_STRUCT;
END_TYPE

(*Status for the conv belt'*)

TYPE
	SortBasicConvStatus_typ : 	STRUCT  (*statuses for conveyor*)
		Running : BOOL; (*running mode*)
		Error : BOOL; (*in n errror mode*)
	END_STRUCT;
END_TYPE

(*basic commands*)

TYPE
	SortBasicConvCmd_typ : 	STRUCT  (*basic conveyor command*)
		Start : BOOL; (*starting commadnd*)
		Stop : BOOL; (*stopping*)
		Estop : BOOL; (*emergency stop*)
	END_STRUCT;
END_TYPE
