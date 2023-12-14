
PROGRAM _INIT
	(* Insert code here *)
	 
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	//if any error will go into error mode
	AlarmsPA;
	IF iPickupArm.Status.Error=TRUE THEN
		sPArmStep:=enERROR;
	END_IF;
	
	//case step for p-arm
	CASE sPArmStep OF
		
		//wait state 
		enWAIT:
			
			iPickupArm.DIs.PArm_FWD:=FALSE;
			iPickupArm.DIs.PArm_BWD:=FALSE;
			iPickupArm.Status.Running:=FALSE;
			IF iPickupArm.Cmd.Start=TRUE THEN
				iPickupArm.Status.Running:=TRUE;
				iPickupArm.Cmd.Start:=FALSE;
				sPArmStep:=enPICKING;
			END_IF;
		  
			//picking the caps
		enPICKING:
			IF gManuelMode=TRUE THEN
					
			ELSE
				iPickupArm.DIs.PArm_FWD:=TRUE;
			END_IF;
			IF iPickupArm.DOs.PArmLFR = TRUE THEN
				IF gManuelMode=TRUE THEN
					
				ELSE
					iPickupArm.DIs.CapGripper_PICK:=TRUE;
				END_IF;
			END_IF;
			IF iPickupArm.DOs.CapGripVaccum=TRUE THEN
				iPickupArm.DIs.PArm_FWD:=FALSE;
				sPArmStep:=enDROPPING;
			END_IF;
		
			//dropping caps on conveyor
		enDROPPING:
			IF gManuelMode=TRUE THEN
					
			ELSE
				//iPickupArm.Status.Running:=FALSE;
				IF iPickupArm.DOs.PArmLBK=TRUE THEN
					iPickupArm.DIs.PArm_BWD:=FALSE;
					IF gManuelMode=TRUE THEN
					
					ELSE
						iPickupArm.DIs.CapGripper_PICK:=FALSE;
					END_IF;
					IF iPickupArm.Status.Running=FALSE THEN	
						iPickupArm.Cmd.Start:=FALSE;
						sPArmStep:=enWAIT;
					END_IF;
				END_IF;
			END_IF;
		
			//error mode
		enERROR:
			iPickupArm.DIs.PArm_FWD:=FALSE;
			iPickupArm.DIs.PArm_BWD:=TRUE;
			IF iPickupArm.DOs.PArmLBK=TRUE THEN
				iPickupArm.DIs.PArm_BWD:=FALSE;
				iPickupArm.DIs.CapGripper_PICK:=FALSE;
			END_IF;
			IF iPickupArm.Cmd.ErrorReset=TRUE THEN
				iPickupArm.Status.Error:=FALSE;
				iPickupArm.Cmd.Estop:=FALSE;
				iPickupArm.Cmd.ErrorReset:=FALSE; 
				sPArmStep:=enWAIT;
			END_IF;
	END_CASE;
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
END_PROGRAM

