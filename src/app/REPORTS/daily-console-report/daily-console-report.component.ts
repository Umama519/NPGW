import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { DateRangeService } from 'app/services/date-range.service';

export interface Daily {
  fromdate: string;
  todate: string;
  mobile: string;
  portid: string;
  actionid: string;
  datafor: string;
  mnpno: string;
  seqno: string;
  assignname: string;
  accounttype: string;
  recepient: string;
  sendrec: string;
  donor: string;
  activity: string;
  timer: string;
  jobDoneBy: string;
  commpitiondate: string;
  lastmessage: string;
  datetime: string;
  tranid: string;
  followup: string;
  trgdate: string;
  inttrgdate: string;
  inttimid: string;
  wfn: string;
  duedate: string;
  arrivaldate: string;
  errortype: string;
  status: string;
}

declare var $: any;

@Component({
  selector: 'app-public-dailyconsolestatus-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './daily-console-report.component.html',
  styleUrl: './daily-console-report.component.css'
})
export class DailyConsoleReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private dateRangeService: DateRangeService, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
    lovDisabled: boolean = false; 
    Daily: Daily[] = [];
    FormDate: string = '';
    ToDate: String = ''
    Action: any[] = [];
    selectedOperatorId: string = '';
    selectedProduct: string = 'All';
    selectedExport: string = 'S';    
    rhb_Live: string = 'L';
    UserID: string[] = []; // For storing UserID values
    filteredData: any[] = []; // To ho
    GridData: any[] = [];
    selectedUserID: any = '';
    defaultUserID: string = '';  // <- Ye first value store karega
    participantNames: any[] = []; // Stores one column (e.g., 'name')
    showSuccessPopup: boolean = false;
    isSubmitting: boolean = false;
    isErrorPopup: boolean = false;
    popupMessage: string = '';
    loginUser: string = '';
    
    ngOnInit(): void {
      const tab = this.el.nativeElement.querySelector('#table')
      this.Operator_Lov();
      this.loginUser = localStorage.getItem('loginUser') || 'No user';
    }
  
    ngAfterViewInit(): void {
      this.datepickerService.initializeDatepicker('#txt_FromDate');
      this.datepickerService.initializeDatepicker('#txt_ToDate');
    }    
    Export = [
      { code: 'S', name: 'Screen' },
      { code: 'F', name: 'File' }
    ];
  
    Operator_Lov() {
      debugger;
      const url = `${environment.apiBaseUrl}/api/Action_LOV_`;
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          // Check if 'ALL' already exists in API data
          const hasAll = data.some(p => p.action === '' || p.descs === 'Select');
  
          if (!hasAll) {
            // Only add 'ALL' if it's not in API response
            data.unshift({ descs: '', action: '' });
          }
  
          this.participantNames = data;
          this.selectedOperatorId = ' '; 
        },
        error: (err) => {
          console.error("Error fetching participants:", err);
        }
      });
    }
  
    // Fetch the user rights report based on selected UserID
    Fetch() {
      debugger;
      const txt_FromDate = this.el.nativeElement.querySelector('#txt_FromDate').value;
      const txt_ToDate = this.el.nativeElement.querySelector('#txt_ToDate').value;
      const txt_PortID = this.el.nativeElement.querySelector('#txt_PortID').value;
      const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile').value;
      const ddl_Action = this.selectedOperatorId;
      // const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live').checked ? 'L' : 'H';
      // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F'; 
      this.rhb_Live = this.dateRangeService.getRhbLive(txt_FromDate, txt_ToDate);
      const rhb_Screen = this.selectedExport;     
      const table = this.el.nativeElement.querySelector('#table');
  
      const url = `${environment.apiBaseUrl}/api/DailyConsoleReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&cell=${txt_Mobile}&portid=${txt_PortID}&actionid=${ddl_Action}&datafor=${this.rhb_Live}&userid=${this.loginUser}`;
      
      this.http.get<any>(url).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
              if (rhb_Screen === 'S') {
                this.Daily = res;
              } else {
                setTimeout(() => {
                  this.export(res, 'excel');
                  this.Daily = [];
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
                this.Daily = [];
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
      const txt_Frmdate = this.el.nativeElement.querySelector('#txt_FromDate');
      const txt_Todate = this.el.nativeElement.querySelector('#txt_ToDate');
      const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile');
      const txt_PortID = this.el.nativeElement.querySelector('#txt_PortID');
      // const ddl_Action = this.el.nativeElement.querySelector('#ddl_Action');
      // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');
      // const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live');
  
      if (txt_Frmdate) txt_Frmdate.value = '';
      if (txt_Todate) txt_Todate.value = '';
      if (txt_Mobile) txt_Mobile.value = '';
      if (txt_PortID) txt_PortID.value = '';
      if (this.selectedOperatorId) this.selectedOperatorId = '';
      if (this.selectedExport) this.selectedExport = 'S';
      if (this.rhb_Live) this.rhb_Live = 'L';
      this.Daily = [];
    }
    export(res:any, file:any) {
        this.GridData = res;
        this.excelService.exportToFile( 
          this.GridData, 'Daily Console Status Report', {
            recepient: 'Recepient',
            donor: 'Donor',
            mobile: 'Mobile #',
            portid: 'Port ID',
            activity: 'Action Description',
            sendrec: 'Type',
            assignname: 'Assign To',
            arrivaldate: 'Message TimeStamp',
            duedate: 'Due Date',
            commpitiondate: 'Completion Date'
          }, file
        );
      }
  }