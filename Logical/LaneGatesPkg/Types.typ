(*main control*)

TYPE
	LineGates_typ : 	STRUCT  (*Line gate main control*)
		Cmd : CmdLineGates_typ; (*command for line gates*)
		Status : StatusLineGates_typ; (*status for line gates*)
		DIs : DILineGates_typ; (*Dis for line gate*)
		DOs : DOLineGates_typ; (*dos for line gates*)
	END_STRUCT;
	DILineGates_typ : 	STRUCT  (*di strcutue for line gate*)
		LG1_LFR : BOOL; (*line gate 1 Left front*)
		LG1_LBK : BOOL; (*line gate 2 Leftback*)
		LG2_LFR : BOOL; (*line gate 1 Left front*)
		LG2_LBK : BOOL; (*line gate 2 Left back*)
		LaneTopIR : BOOL; (*Lane top IR sensor*)
	END_STRUCT;
	DOLineGates_typ : 	STRUCT  (*do line gates*)
		LG1FWD : BOOL; (*lane 1 forward*)
		LW2FWD : BOOL; (*lane 2 forward*)
	END_STRUCT;
	StatusLineGates_typ : 	STRUCT  (*sttus for line gates*)
		Running : BOOL; (*running state*)
		Error : BOOL; (*in errror state*)
	END_STRUCT;
	CmdLineGates_typ : 	STRUCT  (*command to line gates*)
		Start : BOOL; (*starting the line gates*)
		Stop : BOOL; (*stopping the linegate*)
		Estop : BOOL; (*emergency stop for line gate*)
	END_STRUCT;
END_TYPE
