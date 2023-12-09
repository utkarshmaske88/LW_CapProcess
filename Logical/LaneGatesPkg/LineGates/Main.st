
PROGRAM _INIT
	(* Insert code here *)
	 
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	iLineGates;
	
	CASE sLineGateStep OF
		//waiting for the start
		enWAIT:
			IF iLineGates.Cmd.Start=TRUE THEN
				iLineGates.Cmd.Start:=FALSE;
				sLineGateStep:=enOPERATION;
			END_IF;
		  
			//operating the linegagtes
		enOPERATION:
			IF gColorCap="Black" THEN
				iLineGates.DOs.LG1FWD:=TRUE;
				IF iLineGates.DIs.LG1_LFR=TRUE THEN
					sLineGateStep:=enRUNNING;
				END_IF;
			ELSIF gColorCap="Metallic" THEN
				iLineGates.DOs.LW2FWD :=TRUE;
				IF iLineGates.DIs.LG2_LFR=TRUE THEN
					sLineGateStep:=enRUNNING;
				END_IF;
			ELSE
				iLineGates.DOs.LG1FWD:=FALSE;
				iLineGates.DOs.LW2FWD:=FALSE;
				sLineGateStep:=enRUNNING;
			END_IF;

			//running mode
		enRUNNING:
			
			IF iLineGates.DIs.LaneTopIR=TRUE THEN
				iLineGates.DOs.LG1FWD:=FALSE;
				iLineGates.DOs.LW2FWD:=FALSE;
			END_IF;
		
			
			IF iLineGates.DIs.LG1_LBK=TRUE AND  iLineGates.DIs.LG2_LBK=TRUE THEN
				sLineGateStep:=enWAIT;
			END_IF;
		
			//error mode
		enERROR:
			iLineGates.DOs.LG1FWD:=FALSE;
			iLineGates.DOs.LW2FWD:=FALSE;
			IF iLineGates.Cmd.ErrorReset=TRUE THEN
				iLineGates.Cmd.ErrorReset:=FALSE;
				sLineGateStep:=enWAIT;	
			END_IF;
		
		
	END_CASE;
	
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
END_PROGRAM

