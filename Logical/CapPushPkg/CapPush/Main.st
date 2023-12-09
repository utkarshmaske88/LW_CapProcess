
PROGRAM _INIT
	(* Insert code here *)
	 
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	iCapPush;
	CASE sCapPushStep OF
		//wait state if statred will move in next state
		enWAIT:
			
			IF iCapPush.Cmd.Start=TRUE THEN
				iCapPush.Cmd.Start:=FALSE; 
				sCapPushStep:=enPUSH;
			END_IF;
			//pushing the ca
		enPUSH:
			
			IF iCapPush.DIs.MagznPosnEmpty_IR=FALSE AND iCapPush.DIs.PickUp_IR=FALSE THEN
				iCapPush.DOs.PushFWD:=TRUE ;
			END_IF;
			
			IF iCapPush.DIs.PusherLFR=TRUE  THEN
				sCapPushStep:=enOPERATION;
			END_IF;
			//OPERATION Mode
		enOPERATION:
			iCapPush.DOs.PushFWD:=FALSE; 
			sCapPushStep:=enWAIT;
			
			//error mode
		
		enERROR:
			iCapPush.DOs.PushFWD:=FALSE ;
			iCapPush.Cmd.Start:=FALSE; 
			IF  iCapPush.Cmd.ErrorReset=TRUE THEN
				iCapPush.Cmd.ErrorReset:=TRUE ;
				sCapPushStep:=enWAIT;
			END_IF;
		
		
	END_CASE;
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
END_PROGRAM

