
ACTION LogoAxis: 

	iFb_MpAxisBasic_0.MpLink := ADR(gAxisBasic);
	iFb_MpAxisBasic_0.Axis := ADR(gAxis01);
	iFb_MpAxisBasic_0.Enable := 1;
	iFb_MpAxisBasic_0.Parameters := ADR(BasicParameters);
	iFb_MpAxisBasic_0();
	//	BasicParameters.Velocity := 1000; 
	//	BasicParameters.Distance := 1000; 
	//		
	IF iVl_OldVelocity <> BasicParameters.Acceleration THEN
		iFb_MpAxisBasic_0.Update:=TRUE ;
		IF	iFb_MpAxisBasic_0.UpdateDone=TRUE THEN
			iVl_OldVelocity:= BasicParameters.Velocity;
			iFb_MpAxisBasic_0.Update:=FALSE ;
		END_IF;
	END_IF;
	
	IF iVl_OldAcc<> BasicParameters.Acceleration THEN
		iFb_MpAxisBasic_0.Update:=TRUE ;
		IF	iFb_MpAxisBasic_0.UpdateDone=TRUE THEN
			iVl_OldAcc:= BasicParameters.Acceleration;
			iFb_MpAxisBasic_0.Update:=FALSE ;
		END_IF;
	END_IF;
	
	IF iVl_OldAccNeg<> BasicParameters.Deceleration THEN
		iFb_MpAxisBasic_0.Update:=TRUE ;
		IF	iFb_MpAxisBasic_0.UpdateDone=TRUE THEN
			iVl_OldAccNeg:= BasicParameters.Deceleration;
			iFb_MpAxisBasic_0.Update:=FALSE ;
		END_IF;
	END_IF;
	
	//	iFb_MC_MoveVelocity_0.Acceleration := 2000;
	//	iFb_MC_MoveVelocity_0.Deceleration := 2000;
	
	iFb_MC_MoveVelocity_0.Axis := ADR(gAxis01);
	iFb_MpAxisBasic_0.Power := cmdPower;
	iFb_MpAxisBasic_0.Home := cmdHome;
	iFb_MpAxisBasic_0.ErrorReset := cmdErrorReset;
	iFb_MpAxisBasic_0.MoveVelocity := cmdMoveVelocity;
	iFb_MpAxisBasic_0.MoveAdditive;
	
	//Limit for the torque
	BasicParameters.Torque.Limit:=0.8;
	
	IF cmdStop=TRUE THEN
		iFb_MpAxisBasic_0.Stop:=TRUE;
		IF iFb_MpAxisBasic_0.Stopped=TRUE THEN
			iFb_MpAxisBasic_0.Stop:=FALSE;
			cmdStop:=FALSE;
		END_IF;
	END_IF;
		
	IF iFb_MpAxisBasic_0.Error=TRUE THEN
		strStep:=enERRORA;
	END_IF;
	
	CASE strStep OF
		
		enINITA:
			strStep := 	enSTARTA;
		enSTARTA:
			IF iFb_MpAxisBasic_0.Info.ReadyToPowerOn = TRUE THEN
				strStep := enPOWER_ONA;
			END_IF
		enPOWER_ONA:
			cmdPower := TRUE;
			IF iFb_MpAxisBasic_0.PowerOn = TRUE THEN
				strStep := enHOMEA;
			END_IF
		enHOMEA:
			cmdHome := TRUE;
			IF iFb_MpAxisBasic_0.IsHomed = TRUE THEN
				strStep := enOPERATIONA;
				cmdHome := FALSE;
			END_IF
		enOPERATIONA:
			IF iFb_MpAxisBasic_0.Error =TRUE THEN
				strStep := enERRORA;
			END_IF
			IF cmdMoveAdditive=TRUE THEN
				iFb_MpAxisBasic_0.MoveAdditive:=TRUE;
				cmdMoveAdditive := FALSE;
			END_IF;
			
		enERRORA:
			cmdPower := FALSE;
			cmdMoveVelocity := FALSE;
			cmdStop := FALSE;
			
			cmdErrorReset:=TRUE;
			IF iFb_MpAxisBasic_0.Error = FALSE THEN;
				strStep := enSTARTA;
				cmdErrorReset := FALSE;
			END_IF
	END_CASE
	
	iFb_MpAxisBasic_0();
	//iFb_MC_MoveVelocity_0();
END_ACTION
