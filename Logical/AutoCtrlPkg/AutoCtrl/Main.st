
PROGRAM _INIT
	(* Insert code here *)
	StatusCapPush 		:= PV_xgetadr(ADR('CapPush:iCapPush'),ADR(CapPushAddress),ADR(SizeCapPush));
	StatusPickupArm 	:= PV_xgetadr(ADR('PickupArm:iPickupArm'),ADR(PickupArmAddress),ADR(SizePickupArm));
	StatusLogoCOnv 		:= PV_xgetadr(ADR('LogoCOnv:iLogoConv'),ADR(LogoConvAddress),ADR(SizeLogoConv));
	StatusSortConv		:= PV_xgetadr(ADR('SortConv:iSortConv'), ADR(SortConvAddress), ADR(SizeSortConv));
	StatusClrDetect		:= PV_xgetadr(ADR('ClrDetect:iClrDetect'), ADR(ClrDetectAddress), ADR(SizeClrDetect));
	StatusLineGates		:= PV_xgetadr(ADR('LineGates:iLineGates'), ADR(LineGatesAddress), ADR(SizeLineGates));
 
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
	
	IF iTimeOut.Q=TRUE THEN
		
	END_IF;
	CASE sAutoStep OF

		//wait state waiting for commmand
		enWAIT:
			
			IF gMainCmd.Start=TRUE THEN
				gMainCmd.Start:=FALSE;
				sAutoStep:=enSTART;
			END_IF;
			
			//start state cap is getting pushed
		enSTART:
			
			pCapPush.Cmd.Start:=TRUE;
			iTimeOut.IN:=TRUE;
			IF pCapPush.Status.Running=TRUE THEN
				sAutoStep:=enCAPPUSH;
				iTimeOut.IN:=FALSE;
			END_IF;
		
			//cap is pushed
		enCAPPUSH:
			
			iTimeOut.IN:=TRUE;
			IF pCapPush.DIs.PusherLFR=TRUE THEN
				sAutoStep:=enPICKARM;
				pPickupArm.Cmd.Start:=TRUE;
				iTimeOut.IN:=FALSE;
			END_IF;
			
			//pick arm picking the cap
		enPICKARM:
			iTimeOut.IN:=TRUE;
			IF pPickupArm.DOs.PArmLBK=TRUE THEN
				pCapPush.DOs.PushFWD:=FALSE;
				sAutoStep:=enLOGOCONV;
				pLogoConv.Cmd.Start:=TRUE;
				iTimeOut.IN:=FALSE;
			END_IF;
		
			//logo conveyor is on
		enLOGOCONV:
			iTimeOut.IN:=TRUE;
			//IF pLogoConv.DIs.LogoConvExit_IR=TRUE THEN
				IF pLogoConv.DIs.LogoConvExit_IR=TRUE THEN
					sAutoStep:=enSORTCONV;	
					pSortConv.Cmd.Start:=TRUE;
					iTimeOut.IN:=FALSE;
				END_IF;
//END_IF;
		
			
			//sorting conveyor is on
		enSORTCONV:
				iTimeOut.IN:=TRUE;
				sAutoStep:=enCLRDETECT;
				pClrDetect.Cmd.Start:=TRUE;
				iTimeOut.IN:=FALSE;
		
			//color detection is on
		enCLRDETECT:
			iTimeOut.IN:=TRUE;
			
			IF pClrDetect.DOs.CapStopperFWD=FALSE THEN
				sAutoStep:=enLANEGATE;		
				pLineGate.Cmd.Start:=TRUE;
				iTimeOut.IN:=FALSE;
			END_IF;
		
			//lane gate is on
		enLANEGATE:
			
			iTimeOut.IN:=TRUE;
			IF pLineGate.Status.Running=FALSE THEN
				pSortConv.Status.Running:=FALSE;
				IF pLineGate.Cmd.Stop=TRUE OR pClrDetect.Status.iNoOfBlack=9 OR pClrDetect.Status.iNoOfMetallic=9 OR pClrDetect.Status.iNoOfRed=9 THEN
					iMi_MoveText:="Remove the Cap then only start";
					pLineGate.Cmd.Stop:=FALSE;
					sAutoStep:=enWAIT;
				ELSE
					sAutoStep:=enSTART;	
				END_IF;
				iTimeOut.IN:=FALSE;	
			END_IF;
		
	END_CASE;
	
	iTimeOut();
END_PROGRAM

PROGRAM _EXIT
				(* Insert code here *)
	 
END_PROGRAM

