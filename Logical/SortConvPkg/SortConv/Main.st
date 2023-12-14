
PROGRAM _INIT
	(* Insert code here *)
	BasicParameters.Velocity:= 10;
	iFb_MpAxisBasic_0.ErrorReset:=TRUE;
	
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
		
	iSortConv.AOs.SortBasicConvSpeed:=iFb_MpAxisBasic_0.Velocity/10000;
		
	//alarms file for conveyor of sorting
	AlarmsSC;
	CASE sSortConvStep OF
	
		//waiting for start command
		enWAIT:
			iSortConv.Status.Running:=FALSE;
			IF iSortConv.Cmd.Start=TRUE THEN
				iSortConv.Status.Running:=TRUE;
				cmdMoveVelocity:=FALSE;
				iSortConv.Cmd.Start:=FALSE;
				sSortConvStep:=enOPERATION;
			END_IF;
			
			//operation mode
		enOPERATION:
			iSortConv.Status.Running:=TRUE;
			IF iSortConv.DIs.SortBasicConvStart_IR=TRUE THEN
				//cmdMoveVelocity:=TRUE;
				sSortConvStep:=enRUNNING;
			END_IF;
			
			//running mode
		enRUNNING:
			IF gManuelMode=TRUE THEN
				
			ELSE
				cmdMoveVelocity:=TRUE;
			END_IF;
			IF iSortConv.Status.Running=FALSE THEN
				sSortConvStep:=enWAIT;	
				cmdMoveVelocity:=FALSE;
				cmdStop:=TRUE;
			END_IF;
			
			//error mode
		enERROR:
			cmdMoveVelocity:=FALSE;
			cmdStop:=TRUE;
			
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

