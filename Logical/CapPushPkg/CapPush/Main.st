
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
			iCapPush.DOs.PushFWD:=FALSE;
			iCapPush.Status.Running:=FALSE;
			IF iCapPush.Cmd.Start=TRUE THEN
				iCapPush.Cmd.Start:=FALSE; 
				sCapPushStep:=enPUSH;
			END_IF;
			
			//pushing the cap
		enPUSH:
			iCapPush.Status.Running:=TRUE;
			IF iCapPush.DIs.MagznPosnEmpty_IR=FALSE AND iCapPush.DIs.PickUp_IR=FALSE THEN
				IF gManuelMode=TRUE THEN
					
				ELSE
					iCapPush.DOs.PushFWD:=TRUE ;
				END_IF;

				sCapPushStep:=enOPERATION;
			END_IF;

			
			//OPERATION Mode
		enOPERATION:	
			iCapPush.DOs.PushFWD:=TRUE 	;
			IF iCapPush.DIs.PusherLFR=TRUE THEN
				iCapPush.DOs.PushFWD:=FALSE;
				sCapPushStep:=enWAIT;
			END_IF;
			
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

