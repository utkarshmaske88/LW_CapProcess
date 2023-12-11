
PROGRAM _INIT
	(* Insert code here *)
	 
END_PROGRAM

PROGRAM _CYCLIC
	
	//alarms of clr detect file
	AlarmsCD;
	
	
	CASE sClrDetectStep OF
		
		//waiting for start
		enWAIT:
			IF iClrDetect.Cmd.Start=TRUE THEN
				gColorCap:="";
				iClrDetect.Cmd.Start:=FALSE;
				iClrDetect.DOs.CapStopperFWD:=TRUE;
				sClrDetectStep:=enOPERATION;
			END_IF;

			//operation mode if ir detects
		enOPERATION:
			IF iClrDetect.DIs.ColorDetectionIR =TRUE THEN
				sClrDetectStep:=enRUNNING;
			END_IF;	
			
			//running mode
		enRUNNING:
			IF iClrDetect.DIs.ColorDtectMetallic=TRUE THEN
				iClrDetect.Status.iNoOfMetallic:=iClrDetect.Status.iNoOfMetallic+1;
				gColorCap:="Metallic";
				sClrDetectStep:=enEXIT;
			ELSIF iClrDetect.DIs.ColorDtectNotBlack =FALSE AND iClrDetect.DIs.ColorDtectMetallic=FALSE THEN 
				iClrDetect.Status.iNoOfBlack:=iClrDetect.Status.iNoOfBlack+1;
				gColorCap:="Black";	
				sClrDetectStep:=enEXIT;
			ELSIF iClrDetect.DIs.ColorDtectNotBlack =TRUE AND iClrDetect.DIs.ColorDtectMetallic=FALSE THEN 
				iClrDetect.Status.iNoOfRed:=iClrDetect.Status.iNoOfRed+1;
				gColorCap:="RED";	
				sClrDetectStep:=enEXIT;
			END_IF;
		
			//exiting the station
		enEXIT:
			
			iClrDetect.DOs.CapStopperFWD:=FALSE;
			sClrDetectStep:=enWAIT;
		
			//error mode
		enERROR:
			
			iClrDetect.DOs.CapStopperFWD:=TRUE;
			IF iClrDetect.Cmd.ErrorReset=TRUE THEN
				iClrDetect.Status.Error:=FALSE;
				iClrDetect.Cmd.ErrorReset:=FALSE; 
				sClrDetectStep:=enWAIT;
			END_IF;

	END_CASE;
	
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
END_PROGRAM

