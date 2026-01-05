import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';

export interface T5Log {
  sessionid: string;
  sessionadmin: string;
  portid: string;
  isbroad: string;
  mobile: string;
  fromdate: string;
  todate: string;
  duefdate: string;
  duetdate: string;
  activity: string;
  donor: string;
  recepient: string;
  actionid: string;
  status: string;
  mnpno: string;
  seqno: string;
  assignname: string;
  accounttype: string;
  sendrec: string;
  timer: string;
  job_done_by: string;
  commpitiondate: string;
  lastmessage: string;
  datetime: string;
  tranid: string;
  actiontype: string;
  followup: string;
  trgdate: string;
  inttrgdate: string;
  inttimid: string;
  wfn: string;
  arrivaldate: string;
  errortype: string;
  totaltime: string;
}


declare var $: any;

@Component({
  selector: 'app-public-t5log-rpt-aspx',
<<<<<<< HEAD
<<<<<<< HEAD
  standalone: true,
=======
   standalone: true, 
>>>>>>> a610ef1c1d7d032226ea4d45a66ed2c66f02743a
=======
>>>>>>> df6adcae315ddb201abfceb949d6603edc257f9e
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './t5-log-report.component.html',
  styleUrl: './t5-log-report.component.css'
})
export class T5LogReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false; 
  PortIn: T5Log[] = [];
  FormDate: string = '';
  ToDate: String = ''
  DueFormDate: String = ''
  DueToDate: String = ''
  Action: any[] = [];
  selectedRecepient: string = '';
  selectedDonor: string = '';
  selectedStatus: string = 'A';
  selectedAction: string = '';
  selectedBoard: any = '';
  selectedExport:  string = 'S';
  UserID: string[] = [];
  filteredData: any[] = [];
  GridData: any[] = [];
  selectedUserID: any = '';
  defaultUserID: string = '';
  participantNames: any[] = []; 
  participantNames1: any[] = []; 
  showSuccessPopup: boolean = false;
  isSubmitting: boolean = false;
  isErrorPopup: boolean = false;
  popupMessage: string = '';
  loginUser:  string = '';

  // Stores Action descriptions
  ngOnInit(): void {
    const tab = this.el.nativeElement.querySelector('#table')
    this.Operator_Lov();
    this.Operator_Lov1();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }

  ngAfterViewInit(): void {
    this.datepickerService.initializeDatepicker('#txt_FromDate');
    this.datepickerService.initializeDatepicker('#txt_ToDate');
    this.datepickerService.initializeDatepicker('#txt_DueFDate');
    this.datepickerService.initializeDatepicker('#txt_DueTDate');
  }
  Status = [
    { code: 'A', name: 'ALL' },
    { code: 'D', name: 'Done' },
    { code: 'N', name: 'Not Done' }
  ];
  Export = [
    { code: 'S', name: 'Screen' },
    { code: 'F', name: 'File' }
  ];
  Operator_Lov() {
      debugger;
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Action`;
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          // Check if 'ALL' already exists in API data
          const hasAll = data.some(p => p.action === '' || p.descs === 'ACC  -  NP Activated Error');
  
          if (!hasAll) {
            // Only add 'ALL' if it's not in API response
            data.unshift({ descs: '', action: '' });
          }
  
          this.participantNames1 = data;
          this.selectedAction = 'ACC'; 
        },
        error: (err) => {
          console.error("Error fetching participants:", err);
        }
      });
    }
  Operator_Lov1() {
    debugger;
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Operator`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        const hasAll = data.some(p => p.operatorName === 'ALL' || p.operatorId === 'ALL');

        if (!hasAll) {
          data.unshift({ operatorId: 'ALL', operatorName: 'ALL' });
        }

        this.participantNames = data;
        this.selectedRecepient = 'ALL'; // Set default as 'ALL'
        this.selectedDonor = 'ALL';
      },
      error: (err) => {
        console.error("Error fetching participants:", err);
      }
    });
  }
  Fetch() {
    debugger;
    const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile').value;
    const txt_PortID = this.el.nativeElement.querySelector('#txt_PortID').value;
    const txt_Activity = this.el.nativeElement.querySelector('#txt_Activity').value;
    const txt_FromDate = this.el.nativeElement.querySelector('#txt_FromDate').value;
    const txt_ToDate = this.el.nativeElement.querySelector('#txt_ToDate').value;
    const txt_Status = this.selectedStatus;
    const txt_DueFDate = this.el.nativeElement.querySelector('#txt_DueFDate').value;
    const txt_DueTDate = this.el.nativeElement.querySelector('#txt_DueTDate').value;
    const recepient = this.selectedRecepient;
    const ddl_recepient = recepient === 'ALL' ? '%' : recepient;
    const donor = this.selectedDonor;
    const ddl_donor = donor === 'ALL' ? '%' : donor;
    const action = this.selectedAction;
    const ddl_action = action === '' ? '%' : action;
    const chb_Broad = this.el.nativeElement.querySelector('#chb_Broad').checked ? 'Y' : 'F';
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    const rhb_Screen = this.selectedExport;
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/T5LogReport?sessionid=${this.loginUser}&sessionadmin=${this.loginUser}&portid=${txt_PortID}&isbroad=${chb_Broad}&mobile=${txt_Mobile}&fromdate=${txt_FromDate}&todate=${txt_ToDate}&duefdate=${txt_DueFDate}&duetdate=${txt_DueTDate}&activity=${txt_Activity}&donor=${ddl_donor}&recepient=${ddl_recepient}&actionid=${ddl_action}&status=${txt_Status}&userid=${this.loginUser}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
            if (rhb_Screen === 'S') {
              this.PortIn = res;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.PortIn = [];
                this.Reset();
                return;
              }, 100); 
            }
          } else {
            this.showSuccessPopup = false;
            setTimeout(() => {
              this.popupMessage = `No Record Found.`;
              this.isErrorPopup = true;
              this.showSuccessPopup = true;
              this.Reset(); 
              this.PortIn = [];
              return;
            }, 100); 
            document.getElementById('loader')!.style.display = 'none';
            if (table) table.style.display = 'none';
          }
      },
      error: (err) => {
        document.getElementById('loader')!.style.display = 'none';
        console.error("Error fetching UserRightReport data:", err);
        this.Reset();
      }
    });
  }
  Reset() {
    const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile');
    const txt_PortID = this.el.nativeElement.querySelector('#txt_PortID');
    const txt_Activity = this.el.nativeElement.querySelector('#txt_Activity');
    const txt_Frmdate = this.el.nativeElement.querySelector('#txt_FromDate');
    const txt_Todate = this.el.nativeElement.querySelector('#txt_ToDate');
    const txt_DueFDate = this.el.nativeElement.querySelector('#txt_DueFDate');
    const txt_DueTDate = this.el.nativeElement.querySelector('#txt_DueTDate');
    // const ddl_recepient = this.el.nativeElement.querySelector('#ddl_recepient');
    // const ddl_donor = this.el.nativeElement.querySelector('#ddl_donor');
    // const ddl_action = this.el.nativeElement.querySelector('#ddl_action');
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');
    const chb_Broad = this.el.nativeElement.querySelector('#chb_Broad');

    if (txt_Mobile) txt_Mobile.value = '';
    if (txt_PortID) txt_PortID.value = '';
    if (txt_Activity) txt_Activity.value = '';
    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (txt_DueFDate) txt_DueFDate.value = '';
    if (txt_DueTDate) txt_DueTDate.value = '';
    if (this.selectedRecepient) this.selectedRecepient = 'ALL';
    if (this.selectedDonor) this.selectedDonor = 'ALL';
    if (this.selectedAction) this.selectedAction = 'ACC';
    if (this.selectedStatus) this.selectedStatus = 'A';
    if (chb_Broad) chb_Broad.checked = false;
    if (this.selectedExport) this.selectedExport = 'S';    
    this.PortIn = [];
  }
  export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'T5 Log Report', {
           recepient: 'Recepient',
            donor: 'Donor',
            mobile: 'Mobile #',
            portid: 'Port ID',
            activity: 'Action Description',
            sendrec: 'Type',
            assignname: 'Assign To',
            status: 'Status',
            arrivaldate: 'Message TimeStamp',
            duefdate: 'Due Date',
            commpitiondate: 'Completion Date',
            totaltime: 'Time in Minutes'
        }, file
      );
    }
}



