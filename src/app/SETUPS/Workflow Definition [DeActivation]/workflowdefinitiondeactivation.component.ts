import { transition } from '@angular/animations';
import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from 'app/services/workflow.service';
import { environment } from 'environments/environment';
import { DatepickerService } from '../Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { CdkAriaLive } from "../../../../node_modules/@angular/cdk/a11y/index";
import { forkJoin } from 'rxjs';

export class WorkFlowSetup {
  wf: any;
  wfn: any;
  wfttyp: any;
  wfstat: any;
  mact: any;
  wf_valid_from: any;
  maasn: any;
  wf_valid_to: any;
  mauid: any;
  maugrpid: any;
  matimid: any;
  maalarm: any;
  mainttimid: any;
  maintalarm: any;
  donrec: any;
  timadd: any;

  nextwfn: any;
  msgid: any;
  response: any;
  alarm: any;
  timstat: any;
  timid: any;
  aact: any;
  wfstat_dtl: any;
  sndrec: any;
  transaction: any;
  userid: any;

  constructor() {
    this.wf = '';
    this.wfn = '';
    this.wfttyp = '';
    this.wfstat = '';
    this.mact = '';
    this.wf_valid_from = '';
    this.maasn = '';
    this.wf_valid_to = '';
    this.mauid = '';
    this.maugrpid = '';
    this.matimid = '';
    this.maalarm = '';
    this.mainttimid = '';
    this.maintalarm = '';
    this.donrec = '';
    this.timadd = '';

    this.nextwfn = '';
    this.msgid = '';
    this.response = '';
    this.alarm = '';
    this.timstat = '';
    this.timid = '';
    this.aact = '';
    this.wfstat_dtl = '';
    this.sndrec = '';
    this.transaction = '';
    this.userid = '';
  }
}

export interface RoleGet {
  WF: any,
  WFN: any,
  WFTTYP: any,
  WFSTAT: any,
  MACT: any,
  WF_VALID_FROM: any,
  MAASN: any,
  WF_VALID_TO: any,
  MAUID: any,
  MAUGRPID: any,
  MATIMID: any,
  MAALARM: any,
  NACT: any,
  NACTTYP: any,
  NAASN: any,
  NAUID: any,
  NAUGRPID: any,
  NAMSGID: any,
  DONREC: any,
  NEXTWFAPP: any,
  SEQ: any,
  MAINTTIMID: any,
  MAINTALARM: any,
  IUNIT: any,
  IVALUE: any,
  EUNIT: any,
  EVALUE: any
}

export interface WorkFlowGet {
  WORKFLOW: any,
  RESPONSEID: any,
  MESSEGEID: any,
  MESSEGEDESC: any,
  RESPONSENO: any,
  RESPONSE: any,
  ALARMID: any,
  STAT: any,
  TIMEID: any,
  ACTIONID: any,
  ACTIONDESC: any,
  WORKFLOWSTAT: any,
  SENDRECE: any,
  ACTION: any,
  isNew: any;
}

@Component({
  selector: 'app-workflow.aspx',
  standalone: true,
  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './workflowdefinitiondeactivation.component.html',
  styleUrl: './workflowdefinitiondeactivation.component.css'
})
export class WorkflowdefinitiondeactivationComponent {
  operatorObj: WorkFlowSetup = new WorkFlowSetup();
  operatorGet: RoleGet[] = [];
  router: any;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private el: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private routers: Router,
    private wfService: WorkflowService,
    private datepickerService: DatepickerService,
    private workflowService: WorkflowService
  ) {
    this.form = this.fb.group({
      txtWF: [{ value: '', disabled: true }],
      ddlWFType: ['A'],
      ddlWFStatus: ['L'],
      ddlActAs: ['D'],
      txtVaildFrom: [''],
      txtTo: [''],
      ddlActionCode: [''],
      ddlAssignTo: ['U'],
      ddluserid: [''],
      txtUserName: [''],
      ddlgroupid: [''],
      txtGroupName: [''],
      ddlInternalTimerID: [''],
      ddlInternalAlarmID: [''],
      ddlExternalTimerID: [''],
      ddlExternalAlarmID: [''],
      ddlResponseCode: [''],
      ddlNextActionCode: [''],
      ddlCurrentWFStatus: ['C'],
      ddlMessageID: [''],
      ddlMessageType: ['S'],
      chkbxWFStop: [false]
    });
  }
  selectedRow: any = null;
  popupMessage: string = '';
  internalTimers: any[] = [];
  internalAlarms: any[] = [];
  externalAlarms: any[] = [];
  externalTimers: any[] = [];
  messages: any[] = [];
  nextActions: any[] = [];
  users: any[] = [];
  groups: any[] = [];
  actions: any[] = [];
  responses: any[] = [];
  alarmid: any[] = [];
  messageid: any[] = [];
  timerid: any[] = [];
  externalunit: any[] = [];
  externalvalue: any[] = [];
  internalunit: any[] = [];
  internalvalue: any[] = [];

  filteredData: any[] = [];
  gridData: any[] = [];
  columnNames: any[] = [];
  selectedWF: any = '';
  selectedWFN: any = '';
  selectedWFType: any = 'M';
  selectedWFStat: any = 'L';
  selectedValidFrom: any = '';
  selectedValidTo: any = '';
  selectedActionCode: any = '';
  selectedAddActionCode: any = '';
  selectedAddActionDesc: any = '';
  selectedAssignTo: any = 'U';
  selectedUserID: any = '';
  selectedGroupID: any = '';
  selectedUserName: any = '';
  selectedGroupName: any = '';
  selectedExternalUnit: any = '';
  selectedExternalValue: any = '';
  selectedInternalUnit: any = '';
  selectedInternalValue: any = '';
  selectedExternalAlarm: any = '';
  selectedExternalTimer: any = '';
  selectedInternalAlarm: any = '';
  selectedInternalTimer: any = '';
  selectedResponseCode: string = '';
  selectedResponseDesc: string = '';
  selectedCurrentWFStatus: any = 'C';
  selectedMessageID: any = '';
  selectedMessageDesc: any = '';
  selectedMessageType: any = 'S';
  selectedMessageSend: any = 'O';
  selectedWFStop: any = 'N';
  isErrorPopup: boolean = false;
  isadd: string = 'I';
  loginUser: string = '';
  isDisabled: boolean = true;
  isaddresponse = true;
  externalUnit: string = '';
  externalValue: number = 0;
  internalUnit: string = '';
  internalValue: number = 0;
  messagedesc: any[] = [];
  wfId: any;
  wf: any;
  index: any;
  lovDisabled: boolean = false;

  ngOnInit(): void {
    debugger;
    this.isaddresponse = true;
    this.loadActions();
    // this.loadActions1();
    this.loadInternalTimers();
    this.loadInternalAlaram();
    this.loadExternalTimers();
    this.loadExternalAlaram();
    this.loadMessages();
    this.loadUsers();
    this.loadGroups();
    this.loadNextActions();
    this.loadMessagesID();
    //this.loderesponse();
    this.route.queryParams.subscribe(params => {
      this.wfId = params['wfId'] || null;
      this.wf = params['pf'] || null;

      if (this.wfId) {
        this.GetGrid(this.wfId);
        this.GetGrid1(this.wfId);
        this.loadData(this.wf);
      } else if (this.wf) {
        this.loadData(this.wf);
      } else {
        console.warn("⚠️ wfId not found in query params!");
        this.isadd = 'I';
        this.isDisabled = false;
        // this.isgridview = true;
        // this.isaddresponse = false;
        this.AddResponse();
      }
    });
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }
  ngAfterViewInit(): void {
    this.datepickerService.initializeDatepicker('#txtVaildFrom');
    this.datepickerService.initializeDatepicker('#txtVaildTo');
  }
  WFStatus = [
    { code: 'L', name: 'Live' },
    { code: 'S', name: 'Stop' }
  ];
  ddlWFType = [
    { code: 'M', name: 'Manual' },
    { code: 'A', name: 'Auto' }
  ];
  ddlAssignTo = [
    { code: 'U', name: 'Users' },
    { code: 'G', name: 'Group' }
  ];
  CurrentWFStatus = [
    { code: 'C', name: 'Continue' },
    { code: 'S', name: 'Stop' }
  ];
  MessageType = [
    { code: '', name: 'NONE' },
    { code: 'S', name: 'Send' },
    { code: 'R', name: 'Receive' }
  ];
  MessageSendTo = [
    { code: 'O', name: 'Other' },
    { code: 'D', name: 'Donor' },
    { code: 'R', name: 'Recepient' }
  ];
  WFStop = [
    { code: 'Y', name: 'Yes' },
    { code: 'N', name: 'No' }
  ]

  Actioncode: string = '';
  loadActions() {
    this.wfService.getAction().subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.actions = res;
          this.selectedActionCode = this.actions[0].aact;
          this.selectedAddActionCode = this.actions[0].aact;
          this.selectedAddActionDesc = this.actions[0].descrip;
          this.loderesponse();
          
        } else {
          console.log('No data found');
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  loadResponse() {
    this.wfService.getJLov(this.selectedActionCode || '', '', '', '', 'RESPONSE_CODE').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.responses = res;
          this.selectedResponseCode = this.responses[0].RESPONSE;
          this.selectedResponseDesc = this.responses[0].RDSCR;
        } else {
          console.log('No data found');
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  //loadInternalTimers() {
  //  this.wfService.getJLov('', '', '', '', 'LST_INTERNAL_TIMER').subscribe(res => this.externalTimers = res || [], err => console.error(err));
  //}
  //loadInternalAlaram() {
  //  this.wfService.getJLov('', '', '', '', 'DDL_INT_ALARM_ID').subscribe(res => this.internalAlarms = res || [], err => console.error(err));
  //}
  loadInternalAlaram() {
    this.wfService.getJLov('', '', '', '', 'DDL_INT_ALARM_ID').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.internalAlarms = res;
          this.selectedInternalAlarm = this.internalAlarms[0].ALARM;
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  loadInternalTimers() {
    this.wfService.getJLov('', '', '', '', 'DDL_INT_TIMER_ID').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.internalTimers = res;
          this.selectedInternalTimer = this.internalTimers[0].TIMID;
          // this.onTimer1(this.selectedInternalTimer);
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  loadExternalAlaram() {
    this.wfService.getJLov('', '', '', '', 'DDL_EXT_ALARM_ID').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.externalAlarms = res;
          this.selectedExternalAlarm = this.externalAlarms[0].ALARM;
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  loadExternalTimers() {
    this.wfService.getJLov('', '', '', '', 'DDL_EXT_TIMER_ID').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.externalTimers = res;
          this.selectedExternalTimer = this.externalTimers[0].TIMID;
          //this.onTimer(this.selectedExternalTimer);
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  loadMessages() {
    // this.wfService.getJLov('', '', '', '', 'LST_MESSAGE').subscribe(res => this.messages = res || [], err => console.error(err));
    this.wfService.getJLov('', '', '', '', 'LST_MESSAGE').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          // this.externalAlarms = res;
          // this.selectedExternalAlarmID = this.messages[0].ALARM;          
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  loadUsers() {
    this.wfService.getJLov('', '', '', '', 'LST_USER').subscribe(res => {
      this.users = (res || []).map((r: any) => ({ USERID: r.USERID || r.UID11322, UNAME: r.UNAME || r.UNAME11322 }));
      this.selectedUserID = this.users[1]?.USERID || '';
      const selectedUser = this.users.find(u => u.USERID === this.selectedUserID);
      this.selectedUserName = selectedUser ? selectedUser.UNAME : '';
      // this.selectedUserName = this.selectedUserID[0]?.UNAME || '';
    }, err => console.error(err));
  }
  loadGroups() {
    this.wfService.getJLov('', '', '', '', 'LST_GROUP').subscribe(res => {
      this.groups = (res || []).map((r: any) => ({ UGRPID: r.UGRPID || r.UGRPID11317, UGRPNAM: r.UGRPNAM || r.UGRPNAM11317 }));
      this.selectedGroupID = this.groups[1]?.UGRPID || '';
      const selectedGroup = this.groups.find(u => u.UGRPID === this.selectedGroupID);
      this.selectedGroupName = selectedGroup ? selectedGroup.UGRPNAM : '';
    }, err => console.error(err));
  }
  loadNextActions() {
    // this.wfService.getJLov('', '', '', '', 'LST_NEXT_ACTION').subscribe(res => this.nextActions = res || [], err => console.error(err));    
    this.wfService.getJLov('', '', '', '', 'LST_NEXT_ACTION').subscribe({
      next: (res: any[]) => {
        this.actions = res;
        this.selectedAddActionCode = this.actions[0].aact;
        this.selectedAddActionDesc = this.actions[0].descrip;
        // if (res && res.length > 0) {
        //   this.externalAlarms = res;
        //   this.selectedExternalAlarmID = this.messages[0].ALARM;          
        // }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  loadMessagesID() {
    // this.wfService.getJLov('', '', '', '', 'MESSAGE_ID').subscribe(res => this.messageid = res || [], err => console.error(err));
    this.wfService.getJLov('', '', '', '', 'MESSAGE_ID').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.messageid = res;
          this.selectedMessageID = this.messageid[0].MSGID;
          this.selectedMessageDesc = this.messageid[0].MSG;
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  loderesponse() {
    const aact = this.selectedActionCode;
    //this.wfService.getJLov(aact || '', '', '', '', 'RESPONSE_CODE').subscribe(res => this.responses = res || [], err => console.error(err));
    this.wfService.getJLov(aact || '', '', '', '', 'RESPONSE_CODE').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.responses = res;
          this.selectedResponseCode = this.responses[0].RESPONSE;
          this.selectedResponseDesc = this.responses[0].RDSCR;
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  onActionCodeChange() {
    const aact = this.selectedActionCode;
    //this.wfService.getJLov(aact || '', '', '', '', 'RESPONSE_CODE').subscribe(res => this.responses = res || [], err => console.error(err));
    this.wfService.getJLov(aact || '', '', '', '', 'RESPONSE_CODE').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.responses = res;
          this.selectedResponseCode = this.responses[0].RESPONSE;
        }
      },
      error: (err) => {
        console.error('Error fetching action data:', err);
      }
    });
  }
  resetFormFields(): void {
    //const fields = [
    //  '#txtWF'
    //  //, '#ddlWFStatus', '#txtVaildFrom', '#txtVaildTo', '#ddlActionCode', '#ddlAssignTo', 
    //  // '#ddluserid', '#ddlgroupid', '#txtUserName', '#txtGroupName', '#ddlgroupid', '#ddlExternalTimerID', '#lblExternalUnit',
    //  // '#lblExternalValue' , '#ddlExternalAlarmID' , '#ddlResponseCode' , '#ddlNextActionCode' , '#ddlCurrentWFStatus' , '#ddlMessageID',
    //  // 'ddlMessageType', 'ddl_MessageSendTo', 'chkbxWFStop'
    //];

    //fields.forEach(selector => {
    //  const field = this.el.nativeElement.querySelector(selector);
    //  if (field) {
    //    if (field.type === 'checkbox') {
    //      field.checked = false;
    //    } else {
    //      field.value = '';
    //    }
    //    this.renderer.removeAttribute(field, 'disabled');
    //  }
    //});
  }
  buttobfun() {
    // const btn_add = this.el.nativeElement.querySelector('#btn_add')
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    // if (btn_Submit) {
    //   this.renderer.removeClass(btn_Submit, 'newbtndisable'); // Remove the old class
    //   this.renderer.addClass(btn_Submit, 'newbtn');
    // }
    // if (btn_Search) {
    //   this.renderer.removeClass(btn_Search, 'newbtn');
    //   this.renderer.addClass(btn_Search, 'newbtndisable');
    // }
    // if (btn_add) {
    //   this.renderer.removeClass(btn_add, 'newbtn');
    //   this.renderer.addClass(btn_add, 'newbtndisable');
    // }
  }
  SubmitField() {
    // const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Submit) {
    //   this.renderer.removeAttribute(btn_Submit, 'disabled')
    // }
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    // }
  }
  GetGrid(wfId: number) {
    // Safely assign the ID
    const id = wfId?.toString();;

    this.wfService.getJLov(id, '', '', '', 'WF_B_ELSE').subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.operatorGet = res;
          this.edit(res);
          console.log('Data received for WF ID:', id, res);
        } else {
          console.log('No data found for WF ID:', id);
          this.operatorGet = [];
        }
      },
      error: (err) => {
        console.error('Error while fetching data for WF ID:', id, err);
        this.operatorGet = [];
      }
    });
  }
  convertToDDMMYYYY(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  edit(res: any) {
    this.operatorGet = res.map((item: any) => ({
      WF: item.WF ?? '',
      WFN: item.WFN ?? '',
      WFTTYP: item.WFTTYP ?? '',
      WFSTAT: item.WFSTAT ?? '',
      MACT: item.MACT ?? '',
      WF_VALID_FROM: this.convertToDDMMYYYY(item.WF_VALID_FROM) ?? '',
      MAASN: item.MAASN ?? '',
      WF_VALID_TO: this.convertToDDMMYYYY(item.WF_VALID_TO) ?? '',
      MAUID: item.MAUID ?? '',
      MAUGRPID: item.MAUGRPID ?? '',
      MATIMID: item.MATIMID ?? '',
      MAALARM: item.MAALARM ?? '',
      NACT: item.NACT ?? '',
      NACTTYP: item.NACTTYP ?? '',
      NAASN: item.NAASN ?? '',
      NAUID: item.NAUID ?? '',
      NAUGRPID: item.NAUGRPID ?? '',
      NAMSGID: item.NAMSGID ?? '',
      DONREC: item.DONREC ?? '',
      NEXTWFAPP: item.NEXTWFAPP ?? '',
      SEQ: item.SEQ ?? '',
      MAINTTIMID: item.MAINTTIMID ?? '',
      MAINTALARM: item.MAINTALARM ?? '',
      IUNIT: item.IUNIT ?? '',
      IVALUE: item.IVALUE ?? '',
      EUNIT: item.EUNIT ?? '',
      EVALUE: item.EVALUE ?? ''
    }));
    this.isadd = 'U';
    this.isDisabled = false;
    this.isgridview = true;
    this.isaddresponse = false;

    this.selectedWFN = this.operatorGet[0].WFN;
    this.selectedWF = this.operatorGet[0].WF;
    // this.selectedWFStat = this.operatorGet[0].WFSTAT;
    this.selectedWFStat = this.operatorGet[0].WFSTAT === 'L' ? 'L' : this.operatorGet[0].WFSTAT === 'S' ? 'S' : '';
    this.selectedWFType = this.operatorGet[0].WFTTYP === 'M' ? 'M' : this.operatorGet[0].WFTTYP === 'A' ? 'A' : '';
    this.selectedValidFrom = this.operatorGet[0].WF_VALID_FROM;
    this.selectedValidTo = this.operatorGet[0].WF_VALID_TO;
    this.selectedAssignTo = this.operatorGet[0].MAASN;
    this.assignTo = this.operatorGet[0].MAASN;
    this.onLovChange();
    this.selectedActionCode = this.operatorGet[0].MACT;
    // const found = this.actions.find(x => x.aact === this.operatorGet[0].MACT);
    // if (found) {
    //   this.selectedActionCode = found.aact;
    // }
    // this.Actioncode = this.selectedActionCode.aact;
    //this.selectedUserID = this.operatorGet[0].MAUID;
    //this.selectedUserName = this.operatorGet[0].MAUID;
    //this.selectedGroupID = this.operatorGet[0].MAUGRPID;
    this.selectedExternalTimer = (this.operatorGet[0].MATIMID && Object.keys(this.operatorGet[0].MATIMID).length === 0)
      ? 'Select' : this.operatorGet[0].MATIMID;//this.operatorGet[0].MATIMID;
    this.selectedExternalAlarm = (this.operatorGet[0].MAALARM && Object.keys(this.operatorGet[0].MAALARM).length === 0)
      ? 'Select' : this.operatorGet[0].MAALARM;//this.operatorGet[0].MAALARM;
    this.selectedInternalTimer = (this.operatorGet[0].MAINTTIMID && Object.keys(this.operatorGet[0].MAINTTIMID).length === 0)
      ? 'Select' : this.operatorGet[0].MAINTTIMID;
    this.selectedInternalAlarm = (this.operatorGet[0].MAINTALARM && Object.keys(this.operatorGet[0].MAINTALARM).length === 0)
      ? 'Select' : this.operatorGet[0].MAINTALARM;

    this.externalunit = (this.operatorGet[0].EUNIT && Object.keys(this.operatorGet[0].EUNIT).length === 0)
      ? '' : this.operatorGet[0].EUNIT;//this.operatorGet[0].EUNIT;
    this.externalvalue = (
      this.operatorGet[0].EVALUE && typeof this.operatorGet[0].EVALUE === 'object' && Object.keys(this.operatorGet[0].EVALUE).length === 0
    ) ? '' : this.operatorGet[0].EVALUE;

    this.internalunit = (this.operatorGet[0].IUNIT && Object.keys(this.operatorGet[0].IUNIT).length === 0)
      ? '' : this.operatorGet[0].IUNIT;//this.operatorGet[0].IUNIT;
    this.internalvalue = (
      this.operatorGet[0].IVALUE && typeof this.operatorGet[0].IVALUE === 'object' && Object.keys(this.operatorGet[0].IVALUE).length === 0
    ) ? '' : this.operatorGet[0].IVALUE;
    this.selectedMessageSend = this.operatorGet[0].DONREC;
    this.selectedResponseCode = '';//this.operatorGet[0].MAASN;
    this.onActionCodeChange();
    // this.selectedCurrentWFStatus = this.operatorGet[0].WFSTAT;
    // this.selectedMessageID = this.operatorGet[0].NAMSGID;
    // this.messagedesc = this.operatorGet[0].;
    
    // this.selectedMessageType = this.operatorGet[0].NACTTYP;
    // this.selectedMes
    // sageSend = this.operatorGet[0].NAASN;        
  }
  GetGrid1(userID: any) {
    if (!userID) {

    } else {
      this.wfService.getJLov(userID, '', '', '', 'WF_B_ELSE_D').subscribe({
        next: (res: WorkFlowGet[]) => {
          if (res && res.length > 0) {
            this.gridDat = res;
            this.gridDat = res.map(item => ({
              WORKFLOW: this.convertToText(item.WORKFLOW),
              RESPONSEID: this.convertToText(item.RESPONSEID),
              MESSEGEID: this.convertToText(item.MESSEGEID),
              MESSEGEDESC: this.convertToText(item.MESSEGEDESC),
              RESPONSENO: this.convertToText(item.RESPONSEID),
              RESPONSE: this.convertToText(item.RESPONSENO),
              ALARMID: this.convertToText(item.ALARMID),
              STAT: this.convertToText(item.STAT),
              TIMEID: this.convertToText(item.TIMEID),
              ACTIONID: this.convertToText(item.ACTIONID),
              ACTIONDESC: this.convertToText(item.ACTIONDESC),
              WORKFLOWSTAT: this.convertToText(item.WORKFLOWSTAT),
              SENDRECE: this.convertToText(item.SENDRECE),
              ACTION: this.convertToText(item.ACTION),
              isNew: item.isNew ?? false
            }));
            // this.GridData = this.gridDat;
          } else {
            console.log('No data found');
            this.gridDat = [];
            // this.optid();
          }
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.operatorGet = [];
        }
      });
    }
  }
  viewState: { [key: string]: any } = {};
  isAddButtonClicked = false;
  isAddButtNotClicked = true;
  assignTo: string = 'U'; // default is 'U'
  convertToText(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return ''; // agar object hai to blank
    return value;
  }

  onAssignToChange() {
    // optional: handle anything when assignTo changes
    console.log('Selected:', this.assignTo);
  }
  AddButton(): void {
  }
  //gridDat: WorkFlowSetup[] = [];
  gridDat: WorkFlowGet[] = [];
  isgridview = false;
  AddButton1(): void {
    debugger;
    this.isSubmitting = true;
    const id = this.selectedResponseCode + '-' + this.selectedResponseDesc;
    let isNewFlag = true;
    const isDuplicateIndex = this.gridDat.findIndex(item => item.RESPONSEID === id);
    const response = this.gridDat[0].RESPONSE;
    if (isDuplicateIndex !== -1) {
      this.gridDat.splice(isDuplicateIndex, 1);
      isNewFlag = false;
    }

    const wf = (document.getElementById('txtWF') as HTMLInputElement).value;
    const responseid = this.selectedResponseDesc;//(document.getElementById('ddlResponseCode') as HTMLSelectElement).selectedOptions[0].text;
    const responseno = this.selectedResponseCode;//(document.getElementById('ddlResponseCode') as HTMLInputElement).value;    
    const messageid = this.selectedMessageID;//(document.getElementById('ddlMessageID') as HTMLSelectElement).selectedOptions[0].text;
    const messageDesc = this.selectedMessageDesc;//(document.getElementById('ddlMessageID') as HTMLInputElement).value;
    const status = this.selectedCurrentWFStatus;//(document.getElementById('ddlCurrentWFStatus') as HTMLSelectElement).selectedOptions[0].text;
    const action = this.selectedAddActionDesc;//(document.getElementById('ddlNextActionCode') as HTMLSelectElement).selectedOptions[0].text;
    const actionDesc = this.selectedAddActionCode;//(document.getElementById('ddlNextActionCode') as HTMLInputElement).value;
    const messagetype = this.selectedMessageType;//(document.getElementById('ddlMessageType') as HTMLSelectElement).selectedOptions[0].text;
    // const messagesend = (document.getElementById('ddl_MessageSendTo') as HTMLSelectElement).selectedOptions[0].text;
    const check = this.selectedWFStop;//(document.getElementById('chkbxWFStop') as HTMLInputElement).checked ? 'Y' : 'N';

    if (!responseno) {
      this.popupMessage = 'Please Select Response Code';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      this.isSubmitting = false;
      return;
    }

    const newRow: WorkFlowGet = {
      WORKFLOW: wf,
      RESPONSEID: responseno + '-' + responseid,
      MESSEGEID: messageid,
      MESSEGEDESC: messageDesc,
      RESPONSENO: responseno,
      RESPONSE: response,
      ALARMID: '',
      STAT: status === 'C' ? 'Continue' : status === 'S' ? 'Stop' : '',
      TIMEID: '',
      ACTIONID: actionDesc,
      ACTIONDESC: action,
      WORKFLOWSTAT: check === 'Y' ? 'Yes' : check === 'N' ? 'No' : '',
      SENDRECE: messagetype === 'N' ? 'NONE' : messagetype === 'S' ? 'Send' : messagetype === 'R' ? 'Receive' : '',
      ACTION: 'I',
      isNew: isNewFlag
    };

    this.gridDat.push(newRow);
    this.isgridview = true;
    this.isSubmitting = false;
    (document.getElementById('txt_UserName') as HTMLInputElement).value = '';
    this.selectedUserID = '';
    this.selectedResponseCode = '';
    this.selectedAddActionCode = '';
    this.selectedCurrentWFStatus = '';
    this.selectedMessageID = '';
    this.selectedMessageType = '';
    this.selectedMessageSend = '';
    this.selectedWFStat = '';
  }
  AddResponse() {
    if (this.isaddresponse === false) {
      this.isaddresponse = true;
    }
    else {
      this.isaddresponse = false;
    }
  }
  ResetButton() {
    debugger;
    this.wf;
    this.routers.navigate(['/app-public-workflowtab-aspx'], { queryParams: { pf: this.wf } });
  }
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  closePopup() {
    // Hide the popup when "OK" is clicked
    // this.showSuccessPopup = false;
  }
  ViewState: { [key: string]: any } = {};
  searchButton(row: any) {
    const inputD = row.mdescr;
    if (inputD != null) {
      const txtWF = this.el.nativeElement.querySelector('#txtWF');
      const ddlWFStatus = this.el.nativeElement.querySelector('#ddlWFStatus');
      const txtVaildFrom = this.el.nativeElement.querySelector('#txtVaildFrom');
      const txtVaildTo = this.el.nativeElement.querySelector('#txtVaildTo');

      if (txtWF) {
        this.renderer.setProperty(txtWF, 'value', row.wfid); // Set the value
        this.renderer.setAttribute(txtWF, 'disabled', 'true'); // Disable the field
      }
      if (ddlWFStatus) {
        this.renderer.setProperty(ddlWFStatus, 'value', row.mdescr); // Set the value
        this.renderer.removeAttribute(ddlWFStatus, 'disabled'); // Enable the field
      }
      if (txtVaildFrom) {
        this.renderer.setProperty(txtVaildFrom, 'value', row.mvalidfrom); // Set the value
        this.renderer.removeAttribute(txtVaildFrom, 'disabled'); // Enable the field
      }
      if (txtVaildTo) {
        this.renderer.setProperty(txtVaildTo, 'value', row.mvalidto); // Set the value
        this.renderer.removeAttribute(txtVaildTo, 'disabled'); // Enable the field
      }
      // Set selected values
      this.selectedWF = row.wfid;
      this.selectedWFStat = row.mdescr;
      this.selectedValidFrom = row.mvalidfrom;
      this.selectedValidTo = row.mvalidto;
      this.GetGrid(this.wfId);
      this.isgridview = true;
      const userID = this.selectedWF;
      this.GetGrid1(userID);
      this.isadd = 'U';
      this.SubmitField();
      this.buttobfun();
      //this.isaddbutton = true;
    }
    // this.ViewState["Edit"] = "Y";

    // const url = `http://132.147.160.110:5111/api/RoleSetupDtl/${inputD}`;  
    // this.http.get<any[]>(url).subscribe({
    //   next: (res: any[]) => {
    //     if (res && res.length > 0) {
    //       // Loop through grid rows
    //       for (let i = 0; i < res.length; i++) {
    //         const apiRow = res[i];
    //         const menucode = apiRow.mncd?.trim();              
    //         this.SubmitField();
    //         this.buttobfun();
    //       }
    //     } else {
    //       alert('No data found for the selected Role Code.');
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Error fetching data:', err);
    //   }
    // });
  }
  generatedSeqWF: any;
  operatorData: WorkFlowSetup = new WorkFlowSetup();
  submitButton() {
    debugger;
    this.isSubmitting = true;

    this.operatorData.wf = this.selectedWF || this.wf;
    this.operatorData.wfn = (document.getElementById('txtWF') as HTMLInputElement).value;
    this.operatorData.wfttyp = this.selectedWFType;//(document.getElementById('ddlWFType') as HTMLInputElement).value;
    this.operatorData.wfstat = this.selectedWFStat;//(document.getElementById('ddlWFStatus') as HTMLInputElement).value;
    this.operatorData.mact = this.selectedActionCode;//(document.getElementById('ddlActionCode') as HTMLSelectElement).value;//'NPRREC';

    const fromdate = (document.getElementById('txtVaildFrom') as HTMLInputElement).value;
    const parts = fromdate.split('-');
    const day = parts[0];   // 30
    const month = parts[1]; // 01
    const year = parts[2];
    const finalDate = `${month}-${day}-${year}`;
    this.operatorData.wf_valid_from = finalDate;

    this.operatorData.maasn = this.selectedAssignTo//(document.getElementById('ddlAssignTo') as HTMLSelectElement).value;

    const todate = (document.getElementById('txtVaildTo') as HTMLInputElement).value;
    const parts1 = todate.split('-');
    const day1 = parts1[0];   // 30
    const month1 = parts1[1]; // 01
    const year1 = parts1[2];
    const finalDate1 = `${month1}-${day1}-${year1}`;
    this.operatorData.wf_valid_to = finalDate1;

    // this.operatorData.wf_valid_to = (document.getElementById('txtVaildTo') as HTMLInputElement).value;
    if (this.assignTo === 'U') {
      this.operatorData.mauid = this.selectedUserID;//(document.getElementById('ddluserid') as HTMLSelectElement).value;
      // this.operatorData.mauid = (document.getElementById('ddluserid') as HTMLSelectElement).value;
    } else if (this.assignTo === 'G') {
      this.operatorData.maugrpid = this.selectedGroupID;//(document.getElementById('ddlgroupid') as HTMLSelectElement).value
      // this.operatorData.maugrpid = (document.getElementById('ddlgroupid') as HTMLSelectElement).value
    }
    this.operatorData.matimid = this.selectedExternalTimer === 'Select' ? '' : this.selectedExternalTimer;//(document.getElementById('ddlExternalTimerID') as HTMLSelectElement).value;
    this.operatorData.maalarm = this.selectedExternalAlarm === 'Select' ? '' : this.selectedExternalAlarm === 'External' ? 'A2' : this.selectedExternalAlarm;//(document.getElementById('ddlExternalAlarmID') as HTMLSelectElement).value;
    this.operatorData.donrec = this.selectedMessageSend; //"";//(document.getElementById('ddl_MessageSendTo') as HTMLSelectElement).value;
    this.operatorData.timadd = "S";
    this.operatorData.mainttimid = this.selectedInternalTimer === 'Select' ? '' : this.selectedInternalTimer;
    this.operatorData.maintalarm = this.selectedInternalAlarm === 'Select' ? '' : this.selectedExternalAlarm === 'Internal' ? 'A1' : this.selectedInternalAlarm;

    this.operatorData.nextwfn = "";
    this.operatorData.msgid = "";//(document.getElementById('ddlMessageID') as HTMLSelectElement).value;
    this.operatorData.response = "";//(document.getElementById('ddlResponseCode') as HTMLSelectElement).value;
    this.operatorData.alarm = "";
    this.operatorData.timstat = "";//(document.getElementById('ddlCurrentWFStatus') as HTMLSelectElement).value;
    this.operatorData.timid = "";
    this.operatorData.aact = "";//(document.getElementById('ddlNextActionCode') as HTMLSelectElement).value;    
    this.operatorData.wfstat_dtl = "";
    this.operatorData.sndrec = "";//(document.getElementById('ddlMessageType') as HTMLSelectElement).value;
    this.operatorData.transaction = "";
    this.operatorData.userid = this.loginUser;//checkbox.checked ? 'Y' : 'N';    

    // if (!this.operatorData.operator_id || !this.operatorData.operator_name || !this.operatorData.nrn || !this.operatorData.addr1) {
    //   this.popupMessage =
    //     !this.operatorData.operator_id ? 'Please Enter Operator ID' :
    //       !this.operatorData.operator_name ? 'Please Enter Operator Name' :
    //         !this.operatorData.nrn ? 'Please Enter NRN' :
    //           'Please Enter Address 1'; // Error message

    //   this.isErrorPopup = true; // Error popup
    //   this.showSuccessPopup = true; // Show popup
    //   this.isSubmitting = false; // Stop further execution
    //   return; // Stop further execution
    // }

    const DID = this.el.nativeElement.querySelector('#txtWF');
    const srButton = this.el.nativeElement.querySelector('#btn_Search');
    const sbButton = this.el.nativeElement.querySelector('#btn_Submit');
    if (this.gridDat.length === 0) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage = 'Please Add WorkFlow Detail';
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }
    if (this.isadd === 'U') {
      const updateUrl = `${environment.apiBaseUrl}/api/WorkFlow/GroupMaster/${this.operatorData.wfn}`;
      this.operatorData.transaction = "ME";
      this.http.put(updateUrl, this.operatorData, { responseType: 'text' })
        .subscribe({
          next: (response: string) => {
            if (response) {
              // Example response: "1;12345;Master Record Successfully Inserted."
              // const parts = response.split(';');
              // if (parts.length >= 2) {
              //   const seqWF = parts[1]; // yeh tumhara SEQ_WF hai
              //   console.log('SEQ_WF:', seqWF);

              //   // Ab tum isey kahin bhi use kar sakte ho
              this.generatedSeqWF = this.operatorData.wfn;
              // }

              // alert(parts[2] || 'Record updated successfully!');

              //   const id = this.generatedSeqWF;

              if (this.selectedRow !== null && this.selectedRow !== undefined && this.selectedRow !== '') {
                const id = this.operatorData.wfn;
                const respon = this.selectedRow.RESPONSEID || '';
                const responseNumber = respon.split('-')[0];
                this.deleteRecord(id, responseNumber);
              }
              this.insertGroupDetail();
              this.resetFormFields();
            } else {
              this.popupMessage = 'Failed to update the detail record. Please try again.';
              this.isErrorPopup = true;
              this.showSuccessPopup = true;
              this.isSubmitting = false;
              this.resetFormFields();
            }
          },
          error: (err) => {
            console.error('Error during update:', err);
            this.popupMessage = 'Failed to update the record. Please try again.';
            this.isErrorPopup = true; // Error popup
            this.showSuccessPopup = true; // Show popup
            this.isSubmitting = false;
          }
        });
    } else if (this.isadd === 'I') {
      this.operatorData.transaction = "M";
      this.http.post(`${environment.apiBaseUrl}/api/WorkFlow/GroupMaster`, this.operatorData, { responseType: 'text' })
        .subscribe({
          next: (response: string) => {
            if (response) {
              const parts = response.split(';');
              if (parts.length >= 2) {
                const seqWF = parts[1];
                console.log('SEQ_WF:', seqWF);

                // this.generatedSeqWF = seqWF;
                this.generatedSeqWF = this.operatorData.wfn;
              }
              //alert(parts[2] || 'Record inserted successfully!');      

              if (this.selectedRow !== null && this.selectedRow !== undefined && this.selectedRow !== '') {
                const id = this.operatorData.wfn;
                const respon = this.selectedRow.RESPONSEID || '';
                const responseNumber = respon.split('-')[0];
                this.deleteRecord(id, responseNumber);
              }
              this.insertGroupDetail();
              this.resetFormFields();
            } else {
              this.popupMessage = 'Failed to insert the detail record. Please try again.';
              this.isErrorPopup = true;
              this.showSuccessPopup = true;
              this.isSubmitting = false;
              this.ngOnInit();
            }
          },
          error: (err) => {
            console.error('Error during insert:', err);
            this.popupMessage = 'Failed to insert the record. Please try again.';
            this.isErrorPopup = true; // Error popup
            this.showSuccessPopup = true; // Show popup
            this.isSubmitting = false;
          }
        });
    } else {
      console.error('Invalid operation type in isadd');
      this.popupMessage = 'Invalid operation type.';
      this.isErrorPopup = true; // Error popup
      this.showSuccessPopup = true; // Show popup
      this.isSubmitting = false;
    }
  };
  updateButtonStyles(srButton: any, sbButton: any) {
    // if (srButton) {
    //   this.renderer.removeAttribute(srButton, 'newbtndisable');
    //   this.renderer.addClass(srButton, 'newbtn');
    // }
    // if (sbButton) {
    //   this.renderer.removeClass(sbButton, 'newbtn');
    //   this.renderer.addClass(sbButton, 'newbtndisable');
    // }
  }
  deleteRecord1(ModuleCode: string) {
    // debugger;
    // const body = {
    //   ModuleCode: ModuleCode,
    //   menuname: '',
    //   menucode: '',
    //   optionallowed: '',
    //   option_allowed: '',
    //   update_allowed: '',
    //   delete_allowed: '',
    //   query_allowed: '',
    //   add_allowed: '',
    //   tuid: '',
    //   tdate: ''
    // };

    // const headers = { 'Content-Type': 'application/json' };

    // this.http.delete(`http://132.147.160.110:5111/api/RoleSetupDtl/${ModuleCode}`, {
    //   headers: headers,
    //   body: body
    // })
    //   .subscribe(
    //     (response: any) => {
    //       // Assuming response has a 'message' property

    //       const resMessage = response.message;
    //       let msgR = resMessage.split(';').slice(1).join(','); // slice(1) to remo
    //       msgR = msgR.replace('}', '').trim();
    //       // Assign message to popup
    //       this.popupMessage = msgR;

    //       // Remove the deleted record from the filtered data
    //       this.filteredData = this.filteredData.filter((row) => row.deptid !== ModuleCode);

    //       // Refresh grid
    //       this.GetGrid();

    //       // Show the popup
    //       this.showSuccessPopup = true;

    //       // Reset deptid
    //       ModuleCode = '';
    //       this.disableenable();
    //       this.optid();
    //       this.resetdrp();
    //     },
    //     (error) => {
    //       // Handle errors
    //       alert(`Error deleting record: ${error.message}`);
    //       console.error('Error Details:', error);
    //     }
    //   );
  }
  onUser() {
    const selectedUser = this.users.find(u => u.USERID === this.selectedUserID);
    this.selectedUserName = selectedUser ? selectedUser.UNAME : '';
  }
  //insertGroupDetail() {
  //  debugger;
  //  this.isSubmitting = true;

  //  const urlInsert = `${environment.apiBaseUrl}/api/WorkFlow/GroupDetail`;

  //  if (this.gridDat.length === 0) {
  //    this.popupMessage = 'No data to insert!';
  //    this.isErrorPopup = true;
  //    this.showSuccessPopup = true;
  //    this.ResetButton();
  //    return;
  //  }

  //  // 🔹 Check insert or update
  //  const hasNewRow = this.gridDat.some(r => r.isNew);
  //  this.isadd = hasNewRow ? 'I' : 'U';



  //  // ======================================
  //  // 🔥 INSERT MODE (ONE POST REQUEST)
  //  // ======================================
  //  if (this.isadd === 'I') {

  //    const mappedData: WorkFlowSetup[] = this.gridDat.map(item => {
  //      const setup = new WorkFlowSetup();
  //      setup.wf = '';
  //      setup.wfn = this.generatedSeqWF;
  //      setup.nextwfn = '';
  //      setup.response = String(item.RESPONSENO);
  //      setup.aact = item.ACTIONID;
  //      setup.alarm = item.ALARMID;
  //      setup.timstat = item.STAT === 'Continue' ? 'C' : item.STAT === 'Stop' ? 'S' : '';
  //      setup.sndrec = item.SENDRECE === 'NONE' ? '' : item.SENDRECE === 'Send' ? 'S' : 'R';
  //      setup.msgid = item.MESSEGEID === 'No Message' ? '' : item.MESSEGEID;
  //      setup.timid = item.TIMEID;
  //      setup.wfstat_dtl = item.WORKFLOWSTAT === 'Yes' ? 'Y' : 'N';
  //      setup.transaction = 'D';
  //      setup.userid = this.loginUser;
  //      return setup;
  //    });

  //    setTimeout(() => {
  //      this.http.post(urlInsert, mappedData).subscribe({
  //        next: (response: any) => this.handleServerResponse(response),
  //        error: (error) => {
  //          this.popupMessage = `Error inserting data: ${error.message}`;
  //          this.isErrorPopup = true;
  //          this.showSuccessPopup = true;
  //          this.isSubmitting = false;
  //        }
  //      });
  //    }, 500);

  //    return; // Insert end
  //  }



  //  // ======================================
  //  // 🔥 UPDATE MODE (MULTIPLE PUT REQUESTS)
  //  // ======================================
  //  if (this.isadd === 'U') {
  //    debugger;
  //    const requests = this.gridDat.map(item => {

  //      const urlUpdate = `${environment.apiBaseUrl}/api/WorkFlow/GroupDetail/${this.operatorData.wfn}/${item.RESPONSENO}`;

  //      const setup = new WorkFlowSetup();
  //      setup.wf = '';
  //      setup.wfn = this.generatedSeqWF;
  //      setup.nextwfn = '';
  //      setup.response = String(item.RESPONSENO);
  //      setup.aact = item.ACTIONID;
  //      setup.alarm = item.ALARMID;
  //      setup.timstat = item.STAT === 'Continue' ? 'C' : item.STAT === 'Stop' ? 'S' : '';
  //      setup.sndrec = item.SENDRECE === 'NONE' ? '' : item.SENDRECE === 'Send' ? 'S' : 'R';
  //      setup.msgid = item.MESSEGEID === 'No Message' ? '' : item.MESSEGEID;
  //      setup.timid = item.TIMEID;
  //      setup.wfstat_dtl = item.WORKFLOWSTAT === 'Yes' ? 'Y' : 'N';
  //      setup.transaction = 'DE';
  //      setup.userid = this.loginUser;

  //      return this.http.put(urlUpdate, [setup]);
  //    });

  //    setTimeout(() => {
  //      forkJoin(requests).subscribe({
  //        next: (responses: any[]) => {
  //          this.popupMessage = "Record(s) updated successfully!";
  //          this.isErrorPopup = false;
  //          this.showSuccessPopup = true;
  //          this.isSubmitting = false;
  //          this.loadData(this.wf);
  //        },
  //        error: (error) => {
  //          this.popupMessage = `Error updating data: ${error.message}`;
  //          this.isErrorPopup = true;
  //          this.showSuccessPopup = true;
  //          this.isSubmitting = false;
  //        }
  //      });
  //    }, 500);
  //  }
  //}
  //handleServerResponse(response: any) {
  //  const msg = response.message || JSON.stringify(response);

  //  if (msg.startsWith("1")) {
  //    const msgR = msg.split(';').slice(1).join(',').replace(/["}]/g, '').trim();
  //    this.isErrorPopup = false;
  //    this.popupMessage = msgR;
  //    this.loadData(this.wf);
  //  } else if (msg.startsWith("0")) {
  //    const msgR = msg.split(';').slice(1).join(',').replace(/["}]/g, '').trim();
  //    this.isErrorPopup = true;
  //    this.popupMessage = msgR;
  //  } else {
  //    this.isErrorPopup = false;
  //    this.popupMessage = "Unexpected response format!";
  //  }

  //  this.showSuccessPopup = true;
  //  this.isSubmitting = false;
  //}


  insertGroupDetail() {
    debugger;
    this.isSubmitting = true;
    const url = `${environment.apiBaseUrl}/api/WorkFlow/GroupDetail`;
    const url1 = `${environment.apiBaseUrl}/api/WorkFlow/GroupDetail/${this.operatorData.wfn}/${this.gridDat[0].RESPONSE}`;

    if (this.gridDat.length === 0) {
      this.popupMessage = 'No data to insert!';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      this.ResetButton();
      return;
    }

    const hasNewRow = this.gridDat.some(r => r.isNew);
    this.isadd = hasNewRow ? 'I' : 'U';

    const mappedData: WorkFlowSetup[] = this.gridDat.map((item, index) => {

      const setup = new WorkFlowSetup();
      setup.wf = '';
      setup.wfn = this.generatedSeqWF;//item.WORKFLOW;
      setup.nextwfn = '';
      setup.response = String(item.RESPONSENO)//String(this.selectedResponseCode);//this.selectedResponseCode;
      setup.aact = item.ACTIONID;//this.selectedAddActionCode;
      setup.alarm = item.ALARMID;
      setup.timstat = item.STAT === 'Continue' ? 'C' : item.STAT === 'Stop' ? 'S' : '';
      setup.sndrec = item.SENDRECE === 'NONE' ? '' : item.SENDRECE === 'Send' ? 'S' : item.SENDRECE === 'Receive' ? 'R' : ''; // setup.sndrec = item.sndrec;
      setup.msgid = item.MESSEGEID === 'No Message' ? '' : item.MESSEGEID;;//this.selectedMessageID;
      setup.timid = item.TIMEID;
      setup.wfstat_dtl = item.WORKFLOWSTAT === 'Yes' ? 'Y' : item.STAT === 'No' ? 'N' : '';
      setup.transaction = this.isadd === 'I' ? 'D' : this.isadd === 'U' ? 'DE' : '';
      setup.userid = this.loginUser;
      setup.wfttyp = '';
      setup.wfstat = '';
      setup.mact = '';
      setup.wf_valid_from = '';
      setup.maasn = '';
      setup.wf_valid_to = '';
      setup.mauid = '';
      setup.maugrpid = '';
      setup.matimid = '';
      setup.maalarm = '';
      setup.mainttimid = '';
      setup.maintalarm = '';
      setup.donrec = '';
      setup.timadd = '';
      // setup.timid = '';

      return setup;
    });
    if (this.isadd === 'U') {
      setTimeout(() => {
        this.http.put(url1, mappedData).subscribe({
          next: (response: any) => {
            debugger;
            // this.popupMessage = `${this.gridDat.length} record(s) inserted successfully!`;
            // this.gridDat = response;
            // this.isErrorPopup = false;
            // this.showSuccessPopup = true;
            // this.gridDat = [];
            // this.isgridview = false;
            // this.isSubmitting = false;
            const msg = response.message || JSON.stringify(response);
            if (msg.startsWith("1")) {
              const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
              this.isErrorPopup = false;
              this.popupMessage = msgR;
            this.showSuccessPopup = true;
              // this.ResetButton();
            } else if (msg.startsWith("0")) {
              const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
              this.isErrorPopup = true;
              this.popupMessage = msgR;
            this.showSuccessPopup = false;
            } else {
              this.isErrorPopup = false;
              this.popupMessage = "Unexpected response format!";
            this.showSuccessPopup = true;
            }
            this.loadData(this.wf);
          },
          error: (error) => {
            this.popupMessage = `Error inserting data: ${error.message}`;
            this.isErrorPopup = true;
            this.showSuccessPopup = true;
            this.isSubmitting = false;
            // this.ResetButton();
          }
        });
      }, 0);
    } else if (this.isadd === 'I') {
      setTimeout(() => {
        this.http.post(url, mappedData).subscribe({
          next: (response: any) => {
            if (response) {
              const msg = response.message || JSON.stringify(response);
              if (msg.startsWith("1")) {
                const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
                this.isErrorPopup = false;
                this.popupMessage = msgR;
                // this.ResetButton();
              } else if (msg.startsWith("0")) {
                const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
                this.isErrorPopup = true;
                this.popupMessage = msgR;
              } else {
                this.isErrorPopup = false;
                this.popupMessage = "Unexpected response format!";
              }
              this.showSuccessPopup = true;
              this.loadData(this.wf);
              // this.popupMessage = `${this.gridDat.length} record(s) inserted successfully!`;
              // this.gridDat = response;
              // this.isErrorPopup = false;
              // this.showSuccessPopup = true;
              // this.gridDat = [];
              // this.isgridview = false;
              // this.isSubmitting = false;
            } else {

            }
          },
          error: (error) => {
            this.popupMessage = `Error inserting data: ${error.message}`;
            this.isErrorPopup = true;
            this.showSuccessPopup = true;
            this.isSubmitting = false;
            // this.ResetButton();
          }
        });
      }, 0);
    }
  }
  onRowSelect(event: any, row: any) {
    debugger;
    const isChecked = event.target.checked;
    if (isChecked) {
      this.isaddresponse = true;
    } else if (!isChecked) {
      this.isaddresponse = false;
    }
    this.selectedRow = row;
  }
  deleteSelectedRow() {
    if (!this.selectedRow) {      
      return;
    }

    const index = this.gridDat.indexOf(this.selectedRow);
    if (index > -1) {
      this.gridDat.splice(index, 1);
      //this.selectedRow = null;
    }

    // debugger;
    // if (!this.selectedRow) {
    //   alert("Please select a row to delete.");
    //   return;
    // }

    // const id = this.selectedRow.WORKFLOW;
    // const nextid = this.selectedRow.RESPONSENO;
    // const body = {
    //       wf: '',
    //       wfn: id,
    //       wfttyp: '',
    //       wfstat: '',
    //       mact: '',
    //       queryAllow: '',
    //       addAllow: '',
    //       wf_valid_from: '',
    //       maasn: '',
    //       wf_valid_to: '',
    //       mauid: '',
    //       maugrpid: '',
    //       matimid: '',
    //       maalarm: '',
    //       mainttimid: '',
    //       maintalarm: '',
    //       donrec: '',
    //       timadd: '',
    //       nextwfn: '',
    //       msgid: '',
    //       response: nextid,
    //       alarm: '',
    //       timstat: '',
    //       timid: '',
    //       aact: '',
    //       sndrec: '',          
    //       transaction: 'D',
    //       userid: this.loginUser,
    //     };
    //     const options = {
    //         headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    //         body: body
    //       };


    // this.http.delete(`http://localhost:5000/api/WorkFlow/${id}/${nextid}`, options)
    // .subscribe({
    //   next: (response: any) => {
    //     alert("Deleted successfully: " + response.message);
    //     this.gridDat = this.gridDat.filter(r => r !== this.selectedRow);
    //     this.selectedRow = null;
    //   },
    //   error: err => {
    //     alert("Error deleting row.");
    //   }
    // });
  }
  deleteRecord(wfn: any, response: any) {
    const body = {
      wf: '',
      wfn: wfn,
      wfttyp: '',
      wfstat: '',
      mact: '',
      queryAllow: '',
      addAllow: '',
      wf_valid_from: '',
      maasn: '',
      wf_valid_to: '',
      mauid: '',
      maugrpid: '',
      matimid: '',
      maalarm: '',
      mainttimid: '',
      maintalarm: '',
      donrec: '',
      timadd: '',
      nextwfn: response,
      msgid: '',
      response: '',
      alarm: '',
      timstat: '',
      timid: '',
      aact: '',
      wfstat_dtl: '',
      sndrec: '',
      transaction: this.isadd === 'I' ? 'D' : this.isadd === 'U' ? 'D' : '',
      userid: this.loginUser,
    };
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    };

    this.http.delete(`${environment.apiBaseUrl}/api/WorkFlow/${wfn}/${response}`, options).subscribe({
      next: (response: any) => {
        const resMessage = response.message;
        if (JSON.stringify(resMessage).includes('0')) {
          this.isErrorPopup = true;
          const ab = JSON.stringify(resMessage);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // Set suc
        } else {
          this.isErrorPopup = false;
        }
        this.showSuccessPopup = true; // Show popup

        this.showSuccessPopup = true; // Show popup
        this.gridDat = this.gridDat.filter((row) => row.WORKFLOW !== wfn && row.RESPONSENO !== response);
        // Refresh grid
        // this.GetGrid();
        this.isErrorPopup = false;
        this.showSuccessPopup = true;
        this.isadd = 'I';

        this.gridDat = [];
        this.isgridview = false;
        this.isSubmitting = false;
        // this.GetGrid();
        // this.ResetButton();
      },
      error: (error) => {
        this.popupMessage = `Error inserting data: ${error.message}`;
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
        this.isSubmitting = false;
        // this.ResetButton();
      }
    });
  }
  DeleteMaster() {
    debugger;
    const id = (document.getElementById('txtWF') as HTMLInputElement).value;
    if (!id) {
      this.popupMessage = 'Please select a WF to delete.';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      return;
    }
    const selectedRows = this.selectedWFN;//this.gridDat.filter(row => row.wfn);
    if (selectedRows.length === 0) {
      alert('Please select at least one row to delete.');
      return;
    }
    //const idsToDelete = selectedRows;
    //this.deleteRecord(idsToDelete);
  }
  onLovChange() {
    if (this.assignTo === 'U') {
      const selectedUser = this.users.find(u => u.USERID === this.selectedUserID);
      this.selectedUserName = selectedUser ? selectedUser.UNAME : '';
      console.log('User Selected:', this.selectedUserID, this.selectedUserName);
    }

    else if (this.assignTo === 'G') {
      const selectedGroup = this.groups.find(g => g.UGRPID === this.selectedGroupID);
      this.selectedGroupName = selectedGroup ? selectedGroup.UGRPDESC || selectedGroup.UGRPID : '';
      console.log('Group Selected:', this.selectedGroupID, this.selectedGroupName);
    }
  }
  onResponseSelected(item: any) {
    this.selectedResponseCode = item.RESPONSE;
    this.selectedResponseDesc = item.RDSCR;
  }
  onActionSelected(item: any) {
    this.selectedAddActionCode = item.aact;
    this.selectedAddActionDesc = item.descrip;
  }
  ActionCode(item: any) {
    debugger;
    this.selectedActionCode = item;
    this.loadResponse();
  }
  onMessageSelected(item: any) {
    this.selectedMessageID = item.MSGID;
    this.selectedMessageDesc = item.MSG;
  }
  onTimer() {
    const id = this.selectedExternalTimer;
    this.wfService.getJLov(id, '', '', '', 'EXT_TIMER_ID_SELECTED').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.selectedExternalUnit = res[0].UNIT;
          this.selectedExternalValue = res[0].TVAL;
          this.externalunit = this.selectedExternalUnit;
          this.externalvalue = this.selectedExternalValue;
        } else {
          console.log('No data found');
          this.externalunit = [];
          this.externalvalue = [];
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
  id: any;
  onTimer1() {
    const id = this.selectedInternalTimer//? item[0].DESCRIP : '';
    this.wfService.getJLov(id, '', '', '', 'INT_TIMER_ID_SELECTED').subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.selectedInternalUnit = res[0].UNIT;
          this.selectedInternalValue = res[0].TVAL;
          this.internalunit = this.selectedInternalUnit;
          this.internalvalue = this.selectedInternalValue;
        } else {
          console.log('No data found');
          this.internalunit = [];
          this.internalvalue = [];
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
  loadData(pf: string) {
    if (!pf) {
      console.warn('PF id undefined, API call skipped.');
      return;
    }

    this.workflowService.getWorkflowData(pf).subscribe({
      next: (data) => {
        this.gridData = data;
      },
      error: (err) => {
        console.error('Error loading grid data:', err);
      }
    });
  }
  getColumns(item: any): string[] {
    return item ? Object.keys(item).slice(1) : [];
  }
  formatCell(value: any): string {
    if (value === null || value === undefined) return '';

    if (typeof value === 'object') {
      if (Object.keys(value).length === 0) return '';

      return Object.values(value).join(' | ');
    }

    return value.toString();
  }
  goToForm(value: any) {
    console.log("Clicked WF ID:", value);
    debugger;
    this.GetGrid(value);
    this.GetGrid1(value);
  }
}