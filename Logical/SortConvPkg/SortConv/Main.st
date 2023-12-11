
PROGRAM _INIT
	(* Insert code here *)
	BasicParameters.Velocity:= 100;
	 
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	SortAxisA;
	CASE sSortConvStep OF
		enWAIT:
			IF iSortConv.Cmd.Start=TRUE THEN
				iSortConv.Cmd.Start:=FALSE;
				sSortConvStep:=enOPERATION;
			END_IF;

		enOPERATION:
			iSortConv.Status.Running:=TRUE;
			IF iSortConv.DIs.SortBasicConvStart_IR=TRUE THEN
				iSortConv.AOs.SortBasicConvSpeed:=BasicParameters.Velocity/100;;
				sSortConvStep:=enRUNNING;
			END_IF;
			
		enRUNNING:
			IF iSortConv.Status.Running=FALSE THEN
				sSortConvStep:=enWAIT;			
			END_IF;
			
		enERROR:
			iSortConv.AOs.SortBasicConvSpeed:=0;
			IF iSortConv.Cmd.ErrorReset=TRUE THEN
				iSortConv.Cmd.ErrorReset:=FALSE;
				sSortConvStep:=enWAIT;
			END_IF;
		
	END_CASE;
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
END_PROGRAM

