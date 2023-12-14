
PROGRAM _INIT
	(* Insert code here *)
	 
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	IF iLineGates.Status.Error=TRUE THEN
		sLineGateStep:=enERROR;
	END_IF;
	
	CASE sLineGateStep OF
		//waiting for the start
		enWAIT:
			iLineGates.Status.Running:=FALSE;
			iLineGates.DOs.LG1FWD:=FALSE;
			iLineGates.DOs.LW2FWD:=FALSE;
			IF iLineGates.Cmd.Start=TRUE THEN
				iLineGates.Cmd.Start:=FALSE;
				iLineGates.Status.Running:=TRUE;
				sLineGateStep:=enOPERATION;
			END_IF;
		  
			//operating the linegagtes
		enOPERATION:
			
			IF gManuelMode= TRUE THEN
				
			ELSE	
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
				ELSIF  gColorCap="RED" THEN
					iLineGates.DOs.LG1FWD:=FALSE;
					iLineGates.DOs.LW2FWD:=FALSE;
					sLineGateStep:=enRUNNING;
				END_IF;
				
			END_IF;


			//running mode
		enRUNNING:
			
			IF iLineGates.DIs.LaneTopIR=TRUE THEN
				iLineGates.DOs.LG1FWD:=FALSE;
				iLineGates.DOs.LW2FWD:=FALSE;
				sLineGateStep:=enWAIT;
				//sLineGateStep:=enRESET;
			END_IF;
		
			//enRESET:
			
			//iLineGates.DOs.LG1FWD:=FALSE;
			//iLineGates.DOs.LW2FWD:=FALSE;
			//			IF iLineGates.DIs.LG1_LBK=TRUE AND  iLineGates.DIs.LG2_LBK=TRUE THEN
		//	sLineGateStep:=enWAIT;
			//				iLineGates.Status.Running:=FALSE;
			//			END_IF;
		
			//error mode
		enERROR:
			iLineGates.DOs.LG1FWD:=FALSE;
			iLineGates.DOs.LW2FWD:=FALSE;
			IF iLineGates.Cmd.ErrorReset=TRUE THEN
				iLineGates.Status.Error:=FALSE;
				iLineGates.Status.Running:=FALSE;
				iLineGates.Cmd.ErrorReset:=FALSE;
				sLineGateStep:=enWAIT;	
			END_IF;
		
		
	END_CASE;
	
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
END_PROGRAM

