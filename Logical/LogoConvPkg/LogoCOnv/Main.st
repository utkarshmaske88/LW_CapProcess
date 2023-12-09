
PROGRAM _INIT
	(* Insert code here *)
//	 iLogoConv.AOs.LogoConvSpeed:=0.1;
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	
	CASE sLogoConvStep OF
		//waiting for commands
		enWAIT:
			
			IF iLogoConv.Cmd.Start=TRUE THEN
				iLogoConv.Cmd.Start:=FALSE;
				sLogoConvStep:=enOPERATION;
			END_IF;		  
			
			//operation mode cap is on
		enOPERATION:
			iLogoConv.AOs.LogoConvSpeed:=0;
			IF iLogoConv.DIs.LogoConvStart_IR=TRUE THEN
				sLogoConvStep:=enRUNNING;
			END_IF;
			
			//running the conveyor
		enRUNNING:
			iLogoConv.AOs.LogoConvSpeed:=500;
			IF iLogoConv.DIs.LogoConvExit_IR=TRUE THEN
				sLogoConvStep:=enEXIT;	
			END_IF;
		
			//exit cap from conveyor
		enEXIT:
			
			IF iLogoConv.DIs.LogoConvExit_IR=FALSE THEN
				sLogoConvStep:=enEXIT;	
				iLogoConv.AOs.LogoConvSpeed:=0;
				sLogoConvStep:=enWAIT;
			END_IF;
			
			//error mode
		enERROR:
			iLogoConv.AOs.LogoConvSpeed:=0;
			IF iLogoConv.Cmd.ErrorReset=TRUE THEN
				iLogoConv.Cmd.ErrorReset:=FALSE;
				sLogoConvStep:=enWAIT;
			END_IF;
	END_CASE;
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
END_PROGRAM

