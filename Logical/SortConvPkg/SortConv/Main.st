
PROGRAM _INIT
	(* Insert code here *)
	BasicParameters.Velocity:= 100;
	BasicParameters.Home.Mode:= mpAXIS_HOME_MODE_REF_PULSE;
	BasicParameters.Home.HomingDirection := mpAXIS_HOME_DIR_POSITIVE;
	BasicParameters.Home.HomingVelocity := 500;
	 
END_PROGRAM

PROGRAM _CYCLIC
	//axis action file
	SortAxisA;
	
	IF iSortConv.Status.Error=TRUE THEN
		sSortConvStep:=enERROR;
	END_IF;
	
	//alarms file for conveyor of sorting
	AlarmsSC;
	CASE sSortConvStep OF
		
		//waiting for start command
		enWAIT:
			IF iSortConv.Cmd.Start=TRUE THEN
				iSortConv.Cmd.Start:=FALSE;
				sSortConvStep:=enOPERATION;
			END_IF;
			
			//operation mode
		enOPERATION:
			iSortConv.Status.Running:=TRUE;
			IF iSortConv.DIs.SortBasicConvStart_IR=TRUE THEN
				iSortConv.AOs.SortBasicConvSpeed:=BasicParameters.Velocity/100;
				sSortConvStep:=enRUNNING;
			END_IF;
			
			//running mode
		enRUNNING:
			IF iSortConv.Status.Running=FALSE THEN
				sSortConvStep:=enWAIT;	
				iSortConv.AOs.SortBasicConvSpeed:=0;
			END_IF;
			
			//error mode
		enERROR:
			iSortConv.AOs.SortBasicConvSpeed:=0;
			IF iSortConv.Cmd.ErrorReset=TRUE THEN
				iSortConv.Status.Error:=FALSE;
				iSortConv.Cmd.ErrorReset:=FALSE;
				sSortConvStep:=enWAIT;
			END_IF;
		
	END_CASE;
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	iFb_MpAxisBasic_0.Enable:=FALSE;
	iFb_MpAxisBasic_0();

END_PROGRAM

