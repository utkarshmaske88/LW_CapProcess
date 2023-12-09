(*Main control for pickup arm*)

TYPE
	PickupArm_typ : 	STRUCT 
		DOs : DOs_typ; (*digital outputs*)
		Cmd : PArmCmd_typ; (*commands*)
		Status : PArmStatus_typ; (*status of arm*)
		DIs : DIs_typ; (*digital inputs*)
	END_STRUCT;
END_TYPE

(*pickuparm status*)

TYPE
	PArmStatus_typ : 	STRUCT  (*status of arm*)
		Running : BOOL; (*running*)
		PickingUp : BOOL; (*picking up cap*)
		Dropping : BOOL; (*dropping cap*)
		Holding : BOOL; (*holding cap*)
		Error : BOOL; (*error mode*)
	END_STRUCT;
END_TYPE

(*commands for parm*)

TYPE
	PArmCmd_typ : 	STRUCT  (*command strcture*)
		Start : BOOL; (*starting the arm*)
		Stop : BOOL; (*stopping the arm'*)
		Estop : BOOL; (*emergency stopping arm*)
		ErrorReset : BOOL;
	END_STRUCT;
END_TYPE

(*digital outputs*)

TYPE
	DOs_typ : 	STRUCT  (*digital outputs structure*)
		PArmLFR : BOOL; (*parm left forewarding*)
		PArmLBK : BOOL; (*arm left backword*)
		CapGripVaccum : BOOL; (*cap gripping by vaccume*)
	END_STRUCT;
END_TYPE

(*digital inputs*)

TYPE
	DIs_typ : 	STRUCT 
		PArm_FWD : BOOL; (*arm going forward*)
		PArm_BWD : BOOL; (*arm going backward*)
		CapGripper_PICK : BOOL; (*cap gripper is picking*)
	END_STRUCT;
END_TYPE
