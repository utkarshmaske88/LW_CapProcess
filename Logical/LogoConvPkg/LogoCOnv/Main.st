
PROGRAM _INIT
	
//	 iLogoConv.AOs.LogoConvSpeed:=0.1;
	BasicParameters.Velocity:= 5000;
	iFb_MpAxisBasic_0.ErrorReset:=TRUE;
	
	BasicParameters.Home.Mode:= mpAXIS_HOME_MODE_REF_PULSE;
	BasicParameters.Home.HomingDirection := mpAXIS_HOME_DIR_POSITIVE;
	BasicParameters.Home.HomingVelocity := 500;
END_PROGRAM

PROGRAM _CYCLIC
	
	iLogoConv.AOs.LogoConvSpeed:=iFb_MpAxisBasic_0.Velocity/10000;
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
				cmdStop:=TRUE;
			END_IF;		  
			
			iLogoConv.AOs.LogoConvSpeed:=0;
			//operation mode cap is on
		enOPERATION:
			iLogoConv.AOs.LogoConvSpeed:=0;
			IF iLogoConv.DIs.LogoConvStart_IR=TRUE THEN

				IF cmdStop=FALSE THEN
					sLogoConvStep:=enRUNNING;
				END_IF;
			END_IF;
			//running the conveyor
		enRUNNING:
			IF gManuelMode=FALSE THEN
				cmdMoveVelocity:=TRUE;
			
			ELSE
			END_IF;
		//	IF iLogoConv.DIs.LogoConvExit_IR=TRUE THEN
				sLogoConvStep:=enEXIT;	
		//	END_IF;
		
			//exit cap from conveyor
		enEXIT:
//			cmdMoveVelocity:=FALSE;
			//			cmdStop:=TRUE;
			cmdMoveVelocity:=TRUE;
			
			IF iLogoConv.Status.Running=FALSE THEN
				sLogoConvStep:=enWAIT;
				cmdMoveVelocity:=FALSE;
				cmdStop:=TRUE;
			END_IF;
			
			//error mode
		enERROR:
			cmdMoveVelocity:=FALSE;
			cmdStop:=TRUE;
			
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

