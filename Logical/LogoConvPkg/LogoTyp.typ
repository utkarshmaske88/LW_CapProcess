(*Main control for logo conveyor*)

TYPE
	LogoConv_typ : 	STRUCT 
		DIs : LogoConvDIs; (*digital inputs*)
		AOs : LogoConvAOs; (*anallog outputs*)
		Cmd : LogoConvCmd; (*commands*)
		Status : LogoConvStatus; (*statuses*)
	END_STRUCT;
END_TYPE

(*Conveyor belt digital inputs*)

TYPE
	LogoConvDIs : 	STRUCT  (*digital inputs*)
		LogoConvStart_IR : BOOL; (*conveyor is started*)
		LogoConvExit_IR : BOOL; (*exiting the conveyor*)
		LogoActPos : REAL; (*actual position of the conveyor belt*)
	END_STRUCT;
END_TYPE

(*analog outputs *)

TYPE
	LogoConvAOs : 	STRUCT  (*analog outputs*)
		LogoConvSpeed : REAL; (*conveyor speed for conveyor*)
	END_STRUCT;
END_TYPE

(*status of the logo conveyor*)

TYPE
	LogoConvStatus : 	STRUCT  (*status for logo conveyor*)
		Running : BOOL; (*running*)
		Error : BOOL; (*in error mode*)
	END_STRUCT;
END_TYPE

(*command to logo conveyor*)

TYPE
	LogoConvCmd : 	STRUCT  (*basic commnds*)
		Start : BOOL; (*stating the conv*)
		Stop : BOOL; (*stopping*)
		Estop : BOOL; (*emergency stop*)
		ErrorReset : BOOL;
	END_STRUCT;
END_TYPE
