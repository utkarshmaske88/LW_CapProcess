
PROGRAM _INIT
(* Insert code here *)
	StatusCapPush 		:= PV_xgetadr(ADR('CapPush:iCapPush'),ADR(CapPushAddress),ADR(SizeCapPush));
	StatusPickupArm 	:= PV_xgetadr(ADR('PickupArm:iPickupArm'),ADR(PickupArmAddress),ADR(SizePickupArm));
	StatusLogoCOnv 		:= PV_xgetadr(ADR('LogoCOnv:iLogoConv'),ADR(LogoConvAddress),ADR(SizeLogoConv));
	StatusSortConv		:= PV_xgetadr(ADR('SortConv:iSortConv'), ADR(SortConvAddress), ADR(SizeSortConv));
	StatusClrDetect		:= PV_xgetadr(ADR('ClrDetect:iClrDetect'), ADR(ClrDetectAddress), ADR(SizeClrDetect));
	StatusLineGates		:= PV_xgetadr(ADR('LineGates:iLineGates'), ADR(LineGatesAddress), ADR(SizeLineGates));
	gManuelMode;
	iTimeOut.PT:=T#8s;	
END_PROGRAM

PROGRAM _CYCLIC
(* Insert code here *)
	pCapPush ACCESS CapPushAddress;
	pPickupArm ACCESS PickupArmAddress;
	pLogoConv ACCESS LogoConvAddress;
	pSortConv ACCESS SortConvAddress;
	pClrDetect ACCESS ClrDetectAddress;
	pLineGate ACCESS LineGatesAddress;
	
	IF gManuelMode=TRUE THEN
		iTimeOut.PT:=T#8000s;	
	END_IF;
	
	IF iTimeOut.Q=TRUE  THEN
		IF gManuelMode=FALSE THEN
		
		ELSE
			sAutoStep:=enERROR;
		END_IF;
	END_IF;

	IF gMainCmd.EStop=TRUE THEN
		sAutoStep:=enERROR;	
	END_IF;
	IF iMi_QuickStop=TRUE THEN
		gMainCmd.ErrorReset:=TRUE;
		sAutoStep:=enQSTOP;
	END_IF;
	
	IF iMi_ResumeQS=TRUE THEN
		gMainCmd.ErrorReset:=TRUE;
		sAutoStep:=iVi_CurrentState;
		iMi_ResumeQS:=FALSE;
		gMainCmd.ErrorReset:=FALSE;
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
		
			iVi_CurrentState:=enSTART;
			iMi_MoveText:="waiting for cap to be on pickup position";
			pCapPush.Cmd.Start:=TRUE;
			iTimeOut.IN:=TRUE;
			IF pCapPush.Status.Running=TRUE THEN
				sAutoStep:=enCAPPUSH;
				iTimeOut.IN:=FALSE;
			END_IF;
	
			//cap is pushed
		enCAPPUSH:
		
			iVi_CurrentState:=enCAPPUSH;
			iMi_MoveText:="waiting for cap to be on pickup position";
			iTimeOut.IN:=TRUE;
			IF pCapPush.DIs.PickUp_IR=TRUE THEN
				sAutoStep:=enPICKARM;
				iTimeOut.IN:=FALSE;
			END_IF;
		
			//pick arm picking the cap
		enPICKARM:
		
			iVi_CurrentState:=enPICKARM;
			iTimeOut.IN:=TRUE;
			IF pLogoConv.DIs.LogoConvStart_IR=FALSE THEN
				iMi_MoveText:="Pickup arm is picking the cap";
				pPickupArm.Cmd.Start:=TRUE;	
				sAutoStep:=enPARMTOLOGO;
			END_IF;
			
			
		enPARMTOLOGO:
			
			IF pPickupArm.DOs.PArmLBK=TRUE AND pPickupArm.DOs.CapGripVaccum=FALSE AND  pLogoConv.DIs.LogoConvStart_IR=TRUE  THEN
				sAutoStep:=enLOGOCONV;
				pPickupArm.Status.Running:=FALSE;
				pPickupArm.Cmd.Start:=FALSE;				
				iTimeOut.IN:=FALSE;
			END_IF;

	
			//logo conveyor is on
		enLOGOCONV:
			iVi_CurrentState:=enLOGOCONV;
			iTimeOut.IN:=TRUE;
			IF pPickupArm.DOs.PArmLBK=TRUE THEN
				pLogoConv.Cmd.Start:=TRUE;
				sAutoStep:=enLOGOTOSORT;
			END_IF;
		
		enLOGOTOSORT:
				iMi_MoveText:="logo conveyor is ON";
			pLogoConv.Cmd.Start:=TRUE;
			pSortConv.Cmd.Start:=TRUE;
			iVi_CurrentState:=enLOGOTOSORT;
			IF pSortConv.DIs.SortBasicConvStart_IR=TRUE THEN
				sAutoStep:=enSORTCONV;	
				pSortConv.Cmd.Start:=TRUE;
				iTimeOut.IN:=FALSE;
			END_IF;
	
		
			//sorting conveyor is on
		enSORTCONV:
			iVi_CurrentState:=enSORTCONV;
			iTimeOut.IN:=TRUE;
			pClrDetect.Cmd.Start:=TRUE;
			pLogoConv.Status.Running:=FALSE;
			sAutoStep:=enCLRDETECT;
			iTimeOut.IN:=FALSE;
	
			//color detection is on
		enCLRDETECT:
			pClrDetect.Cmd.Start:=TRUE;
			iVi_CurrentState:=enCLRDETECT;
			iTimeOut.IN:=TRUE;
			iMi_MoveText:="Sorting conveyor is ON and color detect is ON";
			IF pClrDetect.DOs.CapStopperFWD=FALSE AND gColorCap <> "" THEN
				sAutoStep:=enLANEGATE;		
				pLineGate.Cmd.Start:=TRUE;
				pLineGate.Status.Running:=TRUE;
				iTimeOut.IN:=FALSE;
			END_IF;
	
			//lane gate is on
		enLANEGATE:
			iVi_CurrentState:=enLANEGATE;	
			pLineGate.Cmd.Start:=TRUE;
		
			iTimeOut.IN:=TRUE;
			IF pLineGate.DIs.LaneTopIR=TRUE THEN
				pSortConv.Status.Running:=FALSE;
				sAutoStep:=enRESET;
				iTimeOut.IN:=FALSE;	
			END_IF;
	
		enRESET:
			
			pLogoConv.Status.Running:=FALSE;
			pLineGate.Status.Running:=FALSE;
			iVi_CurrentState:=enRESET;
			IF   pClrDetect.Status.iNoOfBlack MOD 9 = 0 OR pClrDetect.Status.iNoOfMetallic MOD 9 = 0 OR pClrDetect.Status.iNoOfRed MOD 9 = 0 THEN
				iMi_MoveText:="Remove the Cap then only start";
				pLineGate.Cmd.Stop:=FALSE;
				sAutoStep:=enWAIT;
			ELSIF gMainCmd.Stop=TRUE THEN
				iMi_MoveText:="Machine is Stopped please Press -> Start";
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
				gMainCmd.ErrorReset:=FALSE;
				sAutoStep:=enWAIT;
				gMainCmd.EStop:=FALSE;
				iTimeOut.IN:=FALSE;
				pCapPush.Cmd.ErrorReset:=TRUE;
				pPickupArm.Cmd.ErrorReset:=TRUE;
				pLogoConv.Cmd.ErrorReset:=TRUE;
				pSortConv.Cmd.ErrorReset:=TRUE;
				pClrDetect.Cmd.ErrorReset:=TRUE; 
				pLineGate.Cmd.ErrorReset:=TRUE;
			END_IF;
		
		enQSTOP:
			
			pCapPush.Status.Error:=TRUE;
			pPickupArm.Status.Error:=TRUE; 
			pLogoConv.Status.Error:=TRUE;  
			pSortConv.Status.Error:=TRUE; 
			pClrDetect.Status.Error:=TRUE;  
			pLineGate.Status.Error:=TRUE;  
			IF gMainCmd.ErrorReset=TRUE THEN
				//gMainCmd.ErrorReset:=FALSE;
				iTimeOut.IN:=FALSE;
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

