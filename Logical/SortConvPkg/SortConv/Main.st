
PROGRAM _INIT
	(* Insert code here *)
	 
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	iSortConv;
	
	CASE sSortConvStep OF
		enWAIT:
			IF iSortConv.Cmd.Start=TRUE THEN
				iSortConv.Cmd.Start:=FALSE;
				sSortConvStep:=enOPERATION;
			END_IF;

		enOPERATION:
			IF iSortConv.DIs.SortBasicConvStart_IR=TRUE THEN
				iSortConv.AOs.SortBasicConvSpeed:=500;
				sSortConvStep:=enRUNNING;
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

