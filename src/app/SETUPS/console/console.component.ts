import { CommonModule, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewContainerRef, ComponentRef } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { loaderService } from '../Service/loaderService';
import { environment } from 'environments/environment';
import { DatepickerService } from '../Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { Router } from '@angular/router';
import { ExcelExportService } from 'app/services/excel-export.service';
import { CaresErrorComponent } from 'app/cares-error/cares-error.component';
import { PaginationService } from 'app/services/pagination.service';

interface Alarm {
  cnt: number;
  action: string;
  descrip: string;
  almdue: Date; // <-- change string to Date
  almty: string;
}
export interface ConsoleGet {
  activityO: string,
  message: string,
  mobile: string,
  recipient: string,
  donor: string,
  donrec: string
  due_Date: string
  group_ID: string
  originator: string
  message_Description: string
  port_ID: string
  routeID: string
  Group: string
  Account: string
  Comments: string
  Timer: string
  Job: string
  Last: string
  data_667: string
  MNP: string
  Register: string
  New: string
  Arrival: string
  TimerID: string
  Description: string
  AssignTo: string
  Status: string
  Workflow: string
  InternalTimer: string
  InternalTarget: string
  delay: string
  Old: string
  ACTION_TYPE: string
  ERR_TYPE: string
  mnp: string
  Region: string
  Followup: string
  RouteID: string
  PARTICIPANT_ID: string
}
export class Console {
  ID: string;
  Admin: string;
  Checkbox: string;
  CheckboxA: string;
  constructor() {
    this.ID = '';
    this.Admin = '';
    this.Checkbox = '';
    this.CheckboxA = '';
  }
}
export interface DetCon {
  activitY_NO: string,
  msG_NO: string,
  acT_NO: string,
  arrivaldate: string,
  activity: string,
  portid: string,
  celL_TELL: string,
  recipient: string,
  donor: string,
  participantid: string,
  sendreceived: string,
  joB_DONE_BY: string,
  duedate: string,
  commpitiondate: string,
  rejectcode: string,
  xml: string,
}
declare var $: any;
@Component({
  selector: 'app-public-porting-aspx',
  standalone: true,
  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent {
  ConGet: ConsoleGet[] = [];
  ConDet: DetCon[] = [];
  donorFilter: string = '';
  FromDate: string = '';
  ToDate: string = '';
  recipientFilter: string = '';
  private http = inject(HttpClient);
  participantNames: any[] = []; // Stores one column (e.g., 'name')
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  ExData: any[] = [];
  showRecipientFilter: boolean = false;
  selectedActivity: string = '';
  showDonorFilter: boolean = false;
  Visible: boolean = false;     // For checkbox visibility logic
  isfalse: boolean = false;     // For checkbox visibility logic
  status: any[] = [];           // Stores status details
  ddl_Recipient: string = '';
  ddl_Donor: string = '';
  isvisibe: boolean = true;
  loginUser: string = '';
  ErrChk: string | null = null; // ab null assign ho sakta hai
  Message: string = '';
  searchMobile: string = '';
  PortID: string = '';
  FormDate: string = '';
  roleMessage: string = '';
  showXmlPopup: boolean = false;
  formattedXmlContent: string = '';
  expandedRows: { [key: number]: boolean } = {};
  totalItems = 0;
  currentPage = 1;
  itemsPerPage: number = 18;
  windowSize: number = 0;
  windowStart = 1;
  pagedData: any[] = [];
  showNext = false;
  showPrev = false;
  showFirst = false;
  showLast = false;
  showPagination = false;
  selectedAction: string | null = '';
  selectedDescs: any = [];
  searchQuery: string = '';   // new input for filtering  
  isDonorLovDisabled: boolean = false;  // default disabled
  isActionLovDisabled: boolean = false;
  div_grid: boolean = true;
  showDropdown: boolean = false;
  popupMessage = '';
  isErrorPopup = false;
  showSuccessPopup = false;
  selectedDesc = '';
  portin: string = '';
  lovDisabled: boolean = false; // Default disabled  
  showCaresErrorPopup = false;
  alarms: Alarm[] = [];
  lastRefresh: Date = new Date();
  savedCurrentPage: number | null = null;
  savedWindowStart: number | null = null;
  savedFilteredData: any[] = [];
  savedScrollTop: number | null = null;
  Action: any[] = [];
  filteredActions: { descs: string; action: string }[] = [];
  constructor(private el: ElementRef, private loaderService: loaderService, private datepickerService: DatepickerService,
  private router: Router, private excelService: ExcelExportService, private pager: PaginationService) { }
  con: Console = new Console();
  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainer!: ViewContainerRef;
  popupRef?: ComponentRef<CaresErrorComponent>;
  @ViewChild('recipientFilterSection') recipientFilterSection!: ElementRef;
  ngOnInit() {
    this.div_grid = false;
    const loginUser: string = localStorage.getItem('loginUser') || '';
    
    if (!loginUser) {
      this.isvisibe = false;
      return;
    }
    const resetMode: string | null = localStorage.getItem('ConsoleResetMode');
    if (resetMode === 'Y') {
      this.isvisibe = false;
      this.div_grid = false;      
      this.loadAlarms();
      localStorage.removeItem('ConsoleResetMode');
    }
    const fromReset = localStorage.getItem('ConsoleResetMode')
    if (!fromReset) {
      const savedPagedData = localStorage.getItem('ConsolePagedData');
      const savedPage = localStorage.getItem('ConsoleCurrentPage');
      const savedGridData = localStorage.getItem('ConsoleGridData');
      if (savedGridData) this.GridData = JSON.parse(savedGridData);
      if (savedPagedData) {
        this.pagedData = JSON.parse(savedPagedData);
        this.currentPage = savedPage ? Number(savedPage) : 1;
        this.isvisibe = true;
        this.div_grid = true
        this.showPagination = true;
      }
    }
    localStorage.removeItem('selectedActivity');
    localStorage.removeItem('selectedMnp');
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.Message = localStorage.getItem('roleMessage') || 'No user';
    this.roleMessage = this.Message.charAt(0);
    this.Operator_Lov();
    debugger
    this.ActionLov();
    this.checkbox();
    this.loadAlarms();
    // this.GetGrid(); 
    setInterval(() => this.loadAlarms(), 60000);
    this.windowSize = this.pager.defaultWindowSize;  // 👈 FIX
  }
  loadAlarms() {
    this.http.get<Alarm[]>(`${environment.apiBaseUrl}/api/AlarmStatus`).subscribe({
      next: (data) => {
        this.alarms = data.map(alarm => ({
          ...alarm,
          almdue: new Date(alarm.almdue) // convert string to Date
        }));    
        this.lastRefresh = new Date();        
        setInterval(() => {
          this.lastRefresh = new Date();
        }, 60000);
      },      
    });
  }
  ngAfterViewInit(): void {
    this.datepickerService.initializeDatepicker('#FromDate');
    this.datepickerService.initializeDatepicker('#ToDate');
  }
  msgTypes = [
    { code: 'A', name: 'ALL' },
    { code: 'N', name: 'PMD' },
    { code: 'E', name: 'LSMS' },
    { code: 'D', name: 'CARES' }
  ];
  formData: {
    fromDate: string;
    toDate: string;
    portID: string;
    mobile: string;
    donor: string | null;
    recipient: string | null;
    descrip: string | null;

  } = {
      fromDate: '',
      toDate: '',
      portID: '',
      mobile: '',
      donor: null,
      recipient: null,
      descrip: null
    };
  @ViewChild('actionLov') actionLov: any; // HTML mein #actionLov add karo
  edit(row: any): void {
    if (row.actioN_TYPE === 'E' && row.erR_TYPE === 'S') {
      const url = `${environment.apiBaseUrl}/api/LSMSReMessage/GetById/${row.mnp}`;
      this.http.get<any[]>(url).subscribe({
        next: (res: any[]) => {
          if (res && res.length > 0) {
            const activityData = res[0];
            const urlM = `${environment.apiBaseUrl}/api/LSMSReMessage/${activityData.activityNo}?Action=M`;
            const urlD = `${environment.apiBaseUrl}/api/LSMSReMessage/${activityData.activityNo}?Action=D`;
            debugger
            this.http.get<any[]>(urlM).subscribe(dataM => {
              if (dataM && dataM.length > 0) {
                localStorage.setItem('rejcd', dataM[0].rejcd ?? '');
                localStorage.setItem('swT_NO', dataM[0].swT_NO ?? '');
                localStorage.setItem('msgty', row.erR_TYPE ?? '');
                localStorage.setItem('resp', dataM[0].resp ?? '');
                localStorage.setItem('wfn', dataM[0].wfn ?? '');
                localStorage.setItem('followuP_NO', dataM[0].followuP_NO ?? '');
                localStorage.setItem('recdt', dataM[0].recdt ?? '');
                localStorage.setItem('snddt', dataM[0].snddt ?? '');
                localStorage.setItem('pulldt', dataM[0].pulldt ?? '');
                localStorage.setItem('activitY_NO', this.selectedActivity ?? '');
              }
              this.http.get<any[]>(urlD).subscribe(dataD => {
                if (dataD && dataD.length > 0) {
                  localStorage.setItem('objectNameList', JSON.stringify(dataD.map(x => x.objectName)));
                  localStorage.setItem('objValueList', JSON.stringify(dataD.map(x => x.objValue)));
                  localStorage.setItem('seq', dataD[0].seq ?? '');
                  localStorage.setItem('val', dataD[0].val ?? '');
                  localStorage.setItem('msgID', dataD[0].msgID ?? '');
                }
                this.router.navigateByUrl('/app-lsmsre-message');
              });

            });
          }
        },
      });
    }
    else if (row.actioN_TYPE === 'E' || row.erR_TYPE === 'N') {
      const url = `${environment.apiBaseUrl}/api/ReMessage/GetById/${row.mnp}`;
      this.http.get<any[]>(url).subscribe({
        next: (res: any[]) => {
          if (res && res.length > 0) {
            const activityData = res[0];
            const urlM = `${environment.apiBaseUrl}/api/ReMessage/${activityData.activityNo}?Action=M`;
            const urlD = `${environment.apiBaseUrl}/api/ReMessage/${activityData.activityNo}?Action=D`;            
            this.http.get<any[]>(urlM).subscribe(dataM => {
              if (dataM && dataM.length > 0) {
                localStorage.setItem('rejcdR', dataM[0].rejcd ?? '');
                localStorage.setItem('msG_NO', dataM[0].msG_NO ?? '');
                localStorage.setItem('msgtype', dataM[0].msgtype ?? '');
                localStorage.setItem('resP_NO', dataM[0].resP_NO ?? '');
                localStorage.setItem('wfn', dataM[0].wfn ?? '');
                localStorage.setItem('followuP_NO', dataM[0].followuP_NO ?? '');
                localStorage.setItem('mmsG_no', dataM[0].mmsG_no ?? '');
                localStorage.setItem('recdt', dataM[0].recdt ?? '');
                localStorage.setItem('snddt', dataM[0].snddt ?? '');
                localStorage.setItem('status', dataM[0].status ?? '');
                localStorage.setItem('rejcd', this.selectedActivity ?? '');
                localStorage.setItem('activitY_no', dataM[0].activitY_no ?? '');
                localStorage.setItem('buishrs', dataM[0].buishrs ?? '');
                localStorage.setItem('duedate', dataM[0].duedate ?? '');
              }
              this.http.get<any[]>(urlD).subscribe(dataD => {
                if (dataD && dataD.length > 0) {
                  localStorage.setItem('objectNameList', JSON.stringify(dataD.map(x => x.objectName)));
                  localStorage.setItem('objValueList', JSON.stringify(dataD.map(x => x.objValue)));
                  localStorage.setItem('val', dataD[0].val ?? '');
                  localStorage.setItem('msgID', dataD[0].msgID ?? '');
                }                
                this.router.navigateByUrl('/app-re-message');
              });
            });
          }
        },
      });
    }
    else if (row.actioN_TYPE === 'D') {
      localStorage.setItem('Activity', row.activityO ?? '');
      const portin = (row.action === 'CHRERR') ? 'I' : 'O';
      localStorage.setItem('PorIn', portin ?? '');
      const url = `${environment.apiBaseUrl}/api/CaresError/${row.mnp}`;
      const keysToRemove = [
        'loG_ID', 'msisdn', 'imsi', 'custname', 'nic', 'nictype', 'gender',
        'packageid', 'accesslevel', 'corpperson', 'vasstr', 'paymentmode',
        'waivercode', 'waiveramount', 'extradeposit', 'advancebill', 'chequenumber',
        'chequedate', 'bankname', 'modeotherdesc', 'specialnumamount', 'vasamount',
        'creditamount', 'discountamount', 'provtax', 'portingcharges', 'totalpaid',
        'franchisE_CODE', 'erR_MSG', 'activitY11326', 'operatorID'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));      
      this.http.get<any[]>(url).subscribe({
        next: (res: any[]) => {
          if (res && res.length > 0) {
            const activityData = res[0];
            Object.entries(activityData).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                localStorage.setItem(key, value.toString());
              }
            });          
            this.popupContainer.clear();
            this.popupRef = this.popupContainer.createComponent(CaresErrorComponent);
            this.popupRef.instance.portin = portin;
            this.popupRef.instance.closePopup.subscribe(() => {
              this.popupRef?.destroy();
            });
          }
        },        
      });      
      this.popupContainer.clear();
      this.popupRef = this.popupContainer.createComponent(CaresErrorComponent);      
      this.popupRef.instance.portin = portin;      
      this.popupRef.instance.closePopup.subscribe(() => {
        this.popupRef?.destroy();
      });
    }
    else if (row.actioN_TYPE === 'R') {
      this.router.navigateByUrl('/app-public-nprequestupdate-aspx');
    }
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/FollowupLstActLov?Activity=${row.activityO}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        localStorage.removeItem('Activity_No');
        localStorage.removeItem('Stat');
        localStorage.removeItem('Tdate');
        localStorage.removeItem('Userid');
        localStorage.removeItem('Wfn');
        localStorage.removeItem('Uname');
        localStorage.removeItem('LastAction');
        if (res && res.length > 0) {
          const activityData = res[0];

          localStorage.setItem('Activity_No', activityData.activity_No ?? '');
          localStorage.setItem('Activity', activityData.activityO ?? '');
          localStorage.setItem('Stat', activityData.stat ?? '');
          localStorage.setItem('Tdate', activityData.tdate ?? '');
          localStorage.setItem('Userid', activityData.userid ?? '');
          localStorage.setItem('Uname', activityData.uname ?? '');
          localStorage.setItem('LastAction', activityData.lastAction ?? '');
        }
      },
      error: (err) => {
        localStorage.removeItem('Activity_No');
        localStorage.removeItem('Stat');
        localStorage.removeItem('Tdate');
        localStorage.removeItem('Userid');
        localStorage.removeItem('Wfn');
        localStorage.removeItem('Uname');
        localStorage.removeItem('LastAction');
      }
    });
    let formattedFromDate = '';
    if (row.message) {
      const dateOnly = row.message.split(' ')[0]; // e.g. '14/05/2025'        
      const [day, month, year] = dateOnly.split('/');
      formattedFromDate = `${day}-${month}-${year}`;
    }
    let formattedToDate = '';
    if (row.message) {
      const dateOnly = row.message.split(' ')[0];
      const [day, month, year] = dateOnly.split('/');
      formattedToDate = `${day}-${month}-${year}`;
    }
    if (row && row.activityO) {
      localStorage.setItem('selectedActivity', row.activityO);
    } else {
      localStorage.removeItem('selectedActivity');
    }
    localStorage.setItem('selectedMobile', row.mobile);
    localStorage.setItem('selectedPortID', row.port_ID);
    localStorage.setItem('selectedDonor', row.donor);
    localStorage.setItem('selectedAccountType', row.account_Type);
    localStorage.setItem('selectedCnic', row.new_NIC);
    localStorage.setItem('selectedRegion', row.region);
    localStorage.setItem('selectedOno', row.ono);
    localStorage.setItem('selectedImsi', row.imsi);
    localStorage.setItem('selectedActDt', row.action_Date);
    localStorage.setItem('selectedActTyp', row.actioN_TYPE);
    localStorage.setItem('selectedWfn', row.wfn);
    localStorage.setItem('selectedErrorTyp', row.erR_TYPE);
    localStorage.setItem('selectedAction', row.action);
    localStorage.setItem('selectedMnp', row.mnp);
    localStorage.setItem('selectedNPRNO', row.npr_NO);
    debugger
    const selectedItem = this.filteredActions.find(x => x.action === row.action);
    if (selectedItem) {
      this.selectedDescs = selectedItem.action;  // ✅ ngModel me valueField set karo    
    }
    this.formData = {
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      portID: row.port_ID || '',
      mobile: row.mobile || '',
      donor: row.donor || '',
      recipient: row.recipient || '',
      descrip: this.selectedDescs || ''
    };
  }
  LinkButton(row: any): void {
    const chkbElement = this.el.nativeElement.querySelector('#chk');
    let chkb = chkbElement && chkbElement.checked ? 'Y' : 'N';
    let params: any = {
      ID: this.loginUser || '',
      Admin: this.roleMessage || '',
      Checkbox: chkb,
      CheckboxA: 'A',
      action: row.action?.trim() || '',
      participant: 'A',

    };
    const queryParams = new URLSearchParams(params).toString();
    const url = `${environment.apiBaseUrl}/api/ConsoleStatus/filter?${queryParams}`;
    this.loaderService.show();

    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res?.length > 0) {
          this.isvisibe = true;
          this.div_grid = true;
          this.GridData = res;
          this.filteredData = res;   
          this.setPage(1);
        } else {
          this.filteredData = [];
          this.GridData = [];
        }
        this.loaderService.hide();
      },
      error: () => {
        this.filteredData = [];
        this.loaderService.hide();
      }
    });
  }  
  GetGrid() {
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    const chkbElement = this.el.nativeElement.querySelector('#chk');
    let chkb = chkbElement && chkbElement.checked ? 'Y' : 'N';
    const FrmDate = (document.getElementById('FromDate') as HTMLInputElement).value;
    const ToDate = (document.getElementById('ToDate') as HTMLInputElement).value;    
    // if (chkb === 'N') {
    //   const noSelection =
    //     (!FrmDate || FrmDate.trim() === '') &&
    //     (!ToDate || ToDate.trim() === '') &&
    //     (!this.formData.mobile || this.formData.mobile.trim() === '') &&
    //     (!this.formData.portID || this.formData.portID.trim() === '') &&
    //     (!this.selectedDescs || this.selectedDescs.toString() === '') &&
    //     (!this.formData.donor || this.formData.donor.trim() === '') &&
    //     (!this.formData.recipient || this.formData.recipient.trim() === '');

    //   if (noSelection) {
    //     setTimeout(() => {
    //       this.popupMessage = 'Please make a selection';
    //       this.isErrorPopup = true;
    //       this.showSuccessPopup = true;
    //     }, 100);
    //     return;
    //   }
    // }
    let params: any = { 
      ID: this.loginUser || '',
      Admin: this.roleMessage || '',
      Checkbox: chkb,
      CheckboxA: this.ErrChk || 'A',
      FromDate: FrmDate || '',
      ToDate: ToDate || '',
      mobile: this.formData.mobile?.trim() || '',
      PortID: this.formData.portID?.trim() || '',
      action: this.selectedDescs || '',
      donor: this.formData.donor?.trim() || '',
      recipient: this.formData.recipient?.trim() || '',
      participant: '',
      getdata: ''
    };
    const queryParams = new URLSearchParams(params).toString();
    const url = `${environment.apiBaseUrl}/api/ConsoleStatus/filter?${queryParams}`;  
    this.loaderService.show();
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res?.length > 0) {
          this.isvisibe = true;
          this.div_grid = true;
          this.GridData = res;
          this.ExData = [...res];
          this.filteredData = this.savedFilteredData.length ? this.savedFilteredData : res;
          this.currentPage = this.savedCurrentPage ?? 1;
          this.windowStart = this.savedWindowStart ?? 1;
          this.totalItems = this.GridData.length;
          this.showPagination = true;
          this.setPage(this.currentPage);
        } else {
               setTimeout(() => {
          this.popupMessage = 'No Record Found  ';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
        }, 100);
          this.filteredData = [];
          this.GridData = [];
          this.showPagination = false;
          this.div_grid = false;
          this.isvisibe = false;
          
        }
        this.loaderService.hide();
      },
      error: () => {
        this.filteredData = [];
        this.GridData = [];
        this.loaderService.hide();
      }
    });
  }
  setPage(page: number) {
    this.currentPage = page;       
    this.expandedRows = {};    
    const sourceData = this.filteredData?.length ? this.filteredData : this.GridData;
    this.pagedData = this.pager.getPagedData(sourceData, page, this.itemsPerPage);   
    localStorage.setItem('ConsolePagedData', JSON.stringify(this.pagedData));
    localStorage.setItem('ConsoleGridData', JSON.stringify(this.GridData));
    localStorage.setItem('ConsoleCurrentPage', this.currentPage.toString());
    
  }
  get totalPages() {
    const count = this.filteredData?.length ? this.filteredData.length : this.GridData.length;
    return this.pager.getTotalPages(count, this.itemsPerPage);
  }
  goToFirstWindow() {
    this.windowStart = 1;
    this.currentPage = 1;
    this.setPage(1);
  }
  goToLastWindow() {
    const count = this.filteredData?.length ? this.filteredData.length : this.GridData.length;
    const totalPages = this.pager.getTotalPages(count, this.itemsPerPage);
    let lastWindowStart = totalPages - this.windowSize + 1;
    if (lastWindowStart < 1) lastWindowStart = 1;
    this.windowStart = lastWindowStart;
    this.currentPage = totalPages;
    this.setPage(totalPages);
  }
  get paginationNumbers() {
    const count = this.filteredData?.length ? this.filteredData.length : this.GridData.length;
    const totalPages = this.pager.getTotalPages(count, this.itemsPerPage);
    this.showPrev = this.windowStart > 1;
    this.showNext = (this.windowStart + this.windowSize - 1) < totalPages;
    return this.pager.getPageNumbers(count, this.windowStart, this.windowSize, this.itemsPerPage);
  }
  nextWindow(totalRecords: number, windowStart: number, windowSize: number, itemsPerPage: number) {
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const newStart = windowStart + windowSize;

    return newStart <= totalPages ? newStart : windowStart;
  }
  showNextWindow() {
    const count = this.filteredData?.length ? this.filteredData.length : this.GridData.length;
    this.windowStart = this.pager.nextWindow(count, this.windowStart, this.windowSize, this.itemsPerPage);
  }
  showPreviousWindow() {
    this.windowStart = this.pager.prevWindow(this.windowStart, this.windowSize);
  }
 SaveToExl() {
  debugger
  // 🔒 Table state preserve
  const currentPage = this.currentPage;
  const windowStart = this.windowStart;
  const filteredCopy = [...this.filteredData];

  if (!this.GridData || this.GridData.length === 0) {
    return;
  }

  // ✅ Excel export
  this.export([...this.GridData], 'excel');

  // 🔁 Restore table state (IMPORTANT)
  this.filteredData = filteredCopy;
  this.currentPage = currentPage;
  this.windowStart = windowStart;
  this.setPage(this.currentPage);
}

  Reset() {
    localStorage.removeItem('ConsolePagedData');
    localStorage.removeItem('ConsoleCurrentPage');
    localStorage.removeItem('ConsoleGridData');
    this.savedFilteredData = [];
    this.savedScrollTop = null;
    this.formData.fromDate = '';
    this.formData.toDate = '';
    this.formData.donor = null;
    this.formData.recipient = null;
    this.selectedDescs = null; // ✅ now TypeScript allows null
    const FormDate = this.el.nativeElement.querySelector('#FromDate') as HTMLInputElement;
    const ToDate = this.el.nativeElement.querySelector('#ToDate') as HTMLInputElement;
    const PortID = this.el.nativeElement.querySelector('#PortID') as HTMLInputElement;
    const Mob = this.el.nativeElement.querySelector('#Mob') as HTMLInputElement;
    const chkbElement = this.el.nativeElement.querySelector('#chk') as HTMLInputElement;
    this.ddl_Donor = '';
    this.ddl_Recipient = '';
    this.formData.mobile = '';
    this.selectedAction = '';
    this.ErrChk = '';
    if (FormDate) FormDate.value = '';
    if (ToDate) ToDate.value = '';
    if (PortID) PortID.value = '';
    if (Mob) Mob.value = '';
    if (chkbElement) chkbElement.checked = false;
    this.showPagination = false;
    this.checkbox();
    this.Operator_Lov();
    this.formData.portID = '';
    this.searchMobile = '';
    this.con.Checkbox = 'N';
    this.div_grid = false;
    this.isvisibe = false;
    localStorage.setItem('ConsoleIsVisible', 'false');
    this.filteredData = [];
    localStorage.removeItem('Activity_No');
    localStorage.removeItem('Stat');
    localStorage.removeItem('Tdate');
    localStorage.removeItem('Userid');
    localStorage.removeItem('Wfn');
    localStorage.removeItem('Uname');
    localStorage.removeItem('LastAction');
    localStorage.removeItem('selectedActivity');
    localStorage.removeItem('selectedMobile');
    localStorage.removeItem('selectedPortID');
    localStorage.removeItem('selectedDonor');
    localStorage.removeItem('selectedAccountType');
    localStorage.removeItem('selectedCnic');
    localStorage.removeItem('selectedRegion');
    localStorage.removeItem('selectedOno');
    localStorage.removeItem('selectedImsi');
    localStorage.removeItem('selectedActDt');
    localStorage.removeItem('selectedActTyp');
    localStorage.removeItem('selectedWfn');
    localStorage.removeItem('selectedErrorTyp');
    localStorage.removeItem('selectedAction');
    localStorage.removeItem('selectedMnp');
    localStorage.removeItem('selectedNPRNO');
    this.expandedRows = {};
    localStorage.setItem('ConsoleResetMode', 'Y');
  }
  Plus(index: number, row: any): void {
    const cell = row.mobile;
    const mnp = row.mnp;     
    const url = `${environment.apiBaseUrl}/api/ConsoleStatus/details?cell=${cell}&mnp=${mnp}`;
    if (this.expandedRows[index]) {
      this.expandedRows[index] = false;
      return; // Exit function, no API call
    }
    this.expandedRows = {};
    this.expandedRows[index] = true;
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.ConDet = res;
        } else {
          this.ConDet = [];        
        }
      },      
    });
  }
  openXmlPopup(xml: string): void {
    this.formattedXmlContent = this.formatXml(xml);
    this.showXmlPopup = true;
  }
  closeXmlPopup(): void {
    this.showXmlPopup = false;
  }
  formatXml(xml: string): string {
    if (!xml) return '';
    xml = xml.replace(/>\s+</g, '><');
    const PADDING = '  '; // 2 spaces
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;
    xml = xml.replace(reg, '$1\r\n$2$3');
    xml.split('\r\n').forEach((node) => {
      let indent = 0;

      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      }
      const padding = PADDING.repeat(pad);
      formatted += padding + node.trim() + '\r\n';
      pad += indent;
    });
    return formatted.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  checkbox() {
    const check = document.getElementById("chk") as HTMLInputElement;
    this.Visible = check?.checked || false;
    const ddl_Error = this.el.nativeElement.querySelector('#ddl_Error');
    if (ddl_Error) {
      ddl_Error.style.display = 'block';  // hide the element
    }
  }
  Operator_Lov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Participent`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.participantNames = data.map(x => ({ name: x.name }));
        if (this.participantNames.length > 0) {
        this.formData.recipient = this.participantNames[0].name; 
        this.formData.donor = this.participantNames[0].name; 
      }
      },      
    });
  }
  ActionLov() { 
  
    const role = localStorage.getItem('roleMessage')
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Action?roleCode=${role}`;
    // const url = `${environment.apiBaseUrl}/api/Action_LOV_/ActionR`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {        
        this.Action = data.map(x => ({
          descs: x.descs ?? '',        // Display value
          action: x.action ?? ''         // ValueField ke liye
        }));
        this.filteredActions = [...this.Action];  // Initially show all
      },      
    });
  }
  export(res: any, file: any) {
    this.pagedData = res;
    this.excelService.exportToFile(
      this.pagedData, 'Console', {
      activityO: 'Activity No',
      message: 'Message TimeStamp',
      mobile: 'Mobile No',
      recipient: 'Recipient',
      donor: 'Donor',
      message_Description: 'Message Description',
      port_ID: 'Port ID',
      routeID: 'Route ID',
      data_667: 'Error Notification',
      due_Date: 'NP Due Date',
    }, file
    );
  }
}
