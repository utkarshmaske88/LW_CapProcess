
PROGRAM _INIT
	(* Insert code here *)
	StatusCapPush 		:= PV_xgetadr(ADR('CapPush:iCapPush'),ADR(CapPushAddress),ADR(SizeCapPush));
	StatusPickupArm 	:= PV_xgetadr(ADR('PickupArm:iPickupArm'),ADR(PickupArmAddress),ADR(SizePickupArm));
	StatusLogoCOnv 		:= PV_xgetadr(ADR('LogoCOnv:iLogoConv'),ADR(LogoConvAddress),ADR(SizeLogoConv));
	StatusSortConv		:= PV_xgetadr(ADR('SortConv:iSortConv'), ADR(SortConvAddress), ADR(SizeSortConv));
	StatusClrDetect		:= PV_xgetadr(ADR('ClrDetect:iClrDetect'), ADR(ClrDetectAddress), ADR(SizeClrDetect));
	StatusLineGates		:= PV_xgetadr(ADR('LineGates:iLineGates'), ADR(LineGatesAddress), ADR(SizeLineGates));
	gManuelMode;
	iTimeOut.PT:=T#7s;	
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	pCapPush ACCESS CapPushAddress;
	pPickupArm ACCESS PickupArmAddress;
	pLogoConv ACCESS LogoConvAddress;
	pSortConv ACCESS SortConvAddress;
	pClrDetect ACCESS ClrDetectAddress;
	pLineGate ACCESS LineGatesAddress;
	
	IF iTimeOut.Q=TRUE OR gMainCmd.EStop=TRUE THEN
		IF gManuelMode=FALSE THEN
			
		ELSE
			sAutoStep:=enERROR;
		END_IF;
	END_IF;
	CASE sAutoStep OF

		//wait state waiting for commmand
		enWAIT:
			
			iMi_MoveText:="waiting for Start command";
			IF gMainCmd.Start=TRUE THEN
				gMainCmd.Start:=FALSE;
				sAutoStep:=enSTART;
			END_IF;
			
			//start state cap is getting pushed
		enSTART:
			
			iMi_MoveText:="waiting for cap to be on pickup position";
			pCapPush.Cmd.Start:=TRUE;
			iTimeOut.IN:=TRUE;
			IF pCapPush.Status.Running=TRUE THEN
				sAutoStep:=enCAPPUSH;
				iTimeOut.IN:=FALSE;
			END_IF;
		
			//cap is pushed
		enCAPPUSH:
			
			iMi_MoveText:="waiting for cap to be on pickup position";
			iTimeOut.IN:=TRUE;
			IF pCapPush.DIs.PickUp_IR=TRUE THEN
				sAutoStep:=enPICKARM;
				iTimeOut.IN:=FALSE;
			END_IF;
			
			//pick arm picking the cap
		enPICKARM:
			
			iTimeOut.IN:=TRUE;
			IF pLogoConv.DIs.LogoConvStart_IR=FALSE THEN
				iMi_MoveText:="Pickup arm is picking the cap";
				pPickupArm.Cmd.Start:=TRUE;	
			END_IF;
		
			IF pPickupArm.DOs.PArmLBK=TRUE AND pPickupArm.DOs.CapGripVaccum=FALSE AND  pLogoConv.DIs.LogoConvStart_IR=TRUE  THEN
				sAutoStep:=enLOGOCONV;
				iTimeOut.IN:=FALSE;
			END_IF;

		
			//logo conveyor is on
		enLOGOCONV:
			iTimeOut.IN:=TRUE;
			IF pPickupArm.DOs.PArmLBK=TRUE THEN
				pLogoConv.Cmd.Start:=TRUE;
				sAutoStep:=enLOGOTOSORT;
			END_IF;
			
		enLOGOTOSORT:
			IF pLogoConv.DIs.LogoConvExit_IR=TRUE THEN
				iMi_MoveText:="logo conveyor is ON";
				sAutoStep:=enSORTCONV;	
				pSortConv.Cmd.Start:=TRUE;
				iTimeOut.IN:=FALSE;
			END_IF;
		
			
			//sorting conveyor is on
		enSORTCONV:
			iTimeOut.IN:=TRUE;
			pClrDetect.Cmd.Start:=TRUE;
			pLogoConv.Status.Running:=FALSE;
			sAutoStep:=enCLRDETECT;
			iTimeOut.IN:=FALSE;
		
			//color detection is on
		enCLRDETECT:
			iTimeOut.IN:=TRUE;
			iMi_MoveText:="Sorting conveyor is ON and color detect is ON";
			IF pClrDetect.DOs.CapStopperFWD=FALSE THEN
				sAutoStep:=enLANEGATE;		
				pLineGate.Cmd.Start:=TRUE;
				pLineGate.Status.Running:=TRUE;
				iTimeOut.IN:=FALSE;
			END_IF;
		
			//lane gate is on
		enLANEGATE:
			
			iTimeOut.IN:=TRUE;
			IF pLineGate.DIs.LaneTopIR=TRUE THEN
				pSortConv.Status.Running:=FALSE;
				sAutoStep:=enRESET;
				iTimeOut.IN:=FALSE;	
			END_IF;
		
		enRESET:
			IF pLineGate.Cmd.Stop=TRUE OR pClrDetect.Status.iNoOfBlack MOD 9 = 0 OR pClrDetect.Status.iNoOfMetallic MOD 9 = 0 OR pClrDetect.Status.iNoOfRed MOD 9 = 0 THEN
				iMi_MoveText:="Remove the Cap then only start";
				pLineGate.Cmd.Stop:=FALSE;
				sAutoStep:=enWAIT;
			ELSE
				sAutoStep:=enSTART;	
			END_IF;
		enERROR:
			iMi_MoveText:="Error mode please reset";
			pCapPush.Status.Error:=TRUE;
			pPickupArm.Status.Error:=TRUE; 
			pLogoConv.Status.Error:=TRUE;  
			pSortConv.Status.Error:=TRUE; 
			pClrDetect.Status.Error:=TRUE;  
			pLineGate.Status.Error:=TRUE;  
			IF gMainCmd.ErrorReset=TRUE THEN
				sAutoStep:=enWAIT;
				gMainCmd.EStop:=FALSE;
				pCapPush.Cmd.ErrorReset:=TRUE;
				pPickupArm.Cmd.ErrorReset:=TRUE;
				pLogoConv.Cmd.ErrorReset:=TRUE;
				pSortConv.Cmd.ErrorReset:=TRUE;
				pClrDetect.Cmd.ErrorReset:=TRUE; 
				pLineGate.Cmd.ErrorReset:=TRUE;
			END_IF;
	END_CASE;
	
	iTimeOut();
END_PROGRAM

PROGRAM _EXIT
				(* Insert code here *)
	 
END_PROGRAM

