(*|¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯|*)
(*| Copyright      :-  B&R Industrial Automation GmbH															 |*)
(*| Contact Person :-  maskeu																					 |*)
(*|——————————————————————————————————————————————————————————————————————————————————————————————————————————————|*)
(*| System       :-  TODO: Sewing Machine                                                                        |*)
(*| Task Name    :-  TODO: Dosctrl                                                                   	         |*)
(*| Auther Name  :-  maskeu																						 |*)
(*| Created Date :-  October 10, 2023 																		   	 |*)
(*| Task Class   :-  Task Class #1                                                                               |*)
(*| Task Time    :-  Task Timing 10mSec                                                                          |*)
(*| OS Version   :-  V0.00.0                                                                                     |*)
(*| AS Version   :-  AS 4.12.4.107                                                                               |*)
(*|——————————————————————————————————————————————————————————————————————————————————————————————————————————————|*)
(*| Description  :-  Dosing Control                                                            |*)
(*|                                                                                                              |*)
(*|——————————————————————————————————————————————————————————————————————————————————————————————————————————————|*)
(*| History (Task Modification):                                                                                 |*)
(*|                                                                                                              |*)
(*| Version      Date       Modified By      Modification                                             Status     |*)
(*| V1.00.0   10/10/2023    maskeu        TODO: Insert Modification Done                       Update Status     |*)
(*|______________________________________________________________________________________________________________|*)

PROGRAM _INIT
	(* Insert code here *)
	 
END_PROGRAM

PROGRAM _CYCLIC
	(* Insert code here *)
	// alarmx on
	iFb_AlarmX.Enable:=TRUE;
	iFb_AlarmX.MpLink:=ADR(gAlarmXCore);
	
	iFb_AlarmUI.Enable:=TRUE;
	iFb_AlarmUI.MpLink:=ADR(gAlarmXCore);
	iFb_AlarmUI.UIConnect:=ADR(UIConnectCore);
	
	
	iFb_AlarmX();
	iFb_AlarmUI();
	
	
END_PROGRAM

PROGRAM _EXIT
	(* Insert code here *)
	 
	iFb_AlarmUI.Enable:=FALSE;
	iFb_AlarmX.Enable:=FALSE;
	iFb_AlarmX();
	iFb_AlarmUI();
END_PROGRAM

