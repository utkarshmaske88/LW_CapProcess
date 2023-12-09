
PROGRAM _INIT
	(* Insert code here *)
	 
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	
	CASE sPArmStep OF
		
		//wait state 
		enWAIT:
			
			iPickupArm.DIs.PArm_FWD:=FALSE;
			iPickupArm.DIs.PArm_BWD:=FALSE;
			IF iPickupArm.Cmd.Start=TRUE THEN
				iPickupArm.Cmd.Start:=FALSE;
				sPArmStep:=enPICKING;
			END_IF;
		  
			//picking the caps
		enPICKING:
			
			iPickupArm.DIs.PArm_FWD:=TRUE;
			
			iPickupArm.DIs.CapGripper_PICK:=TRUE;
			IF iPickupArm.DOs.PArmLFR=TRUE AND iPickupArm.DOs.CapGripVaccum=TRUE THEN
				iPickupArm.DIs.PArm_FWD:=FALSE;
				sPArmStep:=enDROPPING;
			END_IF;
		
			//dropping caps on conveyor
		enDROPPING:
			iPickupArm.DIs.PArm_BWD:=TRUE;
			IF iPickupArm.DOs.PArmLBK=TRUE THEN
				iPickupArm.DIs.PArm_BWD:=FALSE;
				iPickupArm.DIs.CapGripper_PICK:=FALSE;
				sPArmStep:=enWAIT;
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
				iPickupArm.Cmd.ErrorReset:=FALSE; 
				sPArmStep:=enWAIT;
			END_IF;
	END_CASE;
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
END_PROGRAM

