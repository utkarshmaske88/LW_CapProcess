
PROGRAM _INIT
	
//	 iLogoConv.AOs.LogoConvSpeed:=0.1;
	BasicParameters.Velocity:= 100;
	iFb_MpAxisBasic_0.ErrorReset:=TRUE;
	
END_PROGRAM

PROGRAM _CYCLIC
	
	iLogoConv.AOs.LogoConvSpeed:=iFb_MpAxisBasic_0.Velocity/100;
	//axis action file
	LogoAxis;
	//alarms file for the logo conveyor
	AlarmsLC;
	
	IF iLogoConv.Status.Error=TRUE THEN
		sLogoConvStep:=enERROR;
	END_IF;
	
	CASE sLogoConvStep OF
		//waiting for commands
		enWAIT:
			
			iLogoConv.Status.Running:=FALSE;
			IF iLogoConv.Cmd.Start=TRUE THEN
				iLogoConv.Status.Running:=TRUE;
				iLogoConv.Cmd.Start:=FALSE;
				sLogoConvStep:=enOPERATION;
			END_IF;		  
			
			//operation mode cap is on
		enOPERATION:
			IF iLogoConv.DIs.LogoConvStart_IR=TRUE THEN

				cmdStop:=TRUE;
				IF iFb_MpAxisBasic_0.Stopped=TRUE THEN
					sLogoConvStep:=enRUNNING;
				END_IF;
			END_IF;
			
			//running the conveyor
		enRUNNING:
			IF gManuelMode=TRUE THEN
			
			ELSE
				cmdMoveVelocity:=TRUE;
			END_IF;
			IF iLogoConv.DIs.LogoConvExit_IR=TRUE THEN
				sLogoConvStep:=enEXIT;	
			END_IF;
		
			//exit cap from conveyor
		enEXIT:
			cmdMoveVelocity:=FALSE;
			cmdStop:=TRUE;
			
			IF iLogoConv.Status.Running=FALSE THEN
				sLogoConvStep:=enWAIT;
			END_IF;
			
			//error mode
		enERROR:
			IF iLogoConv.Cmd.ErrorReset=TRUE THEN
				iLogoConv.Cmd.ErrorReset:=FALSE;
				iLogoConv.Status.Error:=FALSE;
				iLogoConv.Cmd.Estop:=FALSE;
				sLogoConvStep:=enWAIT;
			END_IF;
	END_CASE;
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	iFb_MpAxisBasic_0.Enable:=FALSE;
	iFb_MpAxisBasic_0();
	
END_PROGRAM

