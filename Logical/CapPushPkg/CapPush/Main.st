
PROGRAM _INIT
END_PROGRAM

PROGRAM _CYCLIC
	//calling alrms
	AlarmsCP;
	
	//if any errror will go into error state
	IF iCapPush.Status.Error=TRUE THEN
		sCapPushStep:=enERROR;
	END_IF;
	
	//state machine of case step
	CASE sCapPushStep OF
	
		//wait state if statred will move in next state
		enWAIT:
		//	iCapPush.DOs.PushFWD:=FALSE;
			iCapPush.Status.Running:=FALSE;
			IF iCapPush.Cmd.Start=TRUE THEN
				iCapPush.Cmd.Start:=FALSE; 
				sCapPushStep:=enPUSH;
			END_IF;
			
			//pushing the cap
		enPUSH:
			iCapPush.Status.Running:=TRUE;
			IF iCapPush.DIs.MagznPosnEmpty_IR=FALSE AND iCapPush.DIs.PickUp_IR=FALSE THEN
				iCapPush.DOs.PushFWD:=TRUE ;
				sCapPushStep:=enOPERATION;
			END_IF;

			
			//OPERATION Mode
		enOPERATION:		
			IF iCapPush.DOs.PushFWD=FALSE  THEN
				sCapPushStep:=enWAIT;
	
			END_IF;
			sCapPushStep:=enWAIT;
			
			//error mode
		enERROR:
			iCapPush.DOs.PushFWD:=FALSE ;
			iCapPush.Cmd.Start:=FALSE; 
			IF  iCapPush.Cmd.ErrorReset=TRUE THEN
				iCapPush.Status.Error:=FALSE;
				iCapPush.Cmd.ErrorReset:=FALSE ;
				sCapPushStep:=enWAIT;
			END_IF;
		
		
	END_CASE;
END_PROGRAM

PROGRAM _EXIT
	
END_PROGRAM

