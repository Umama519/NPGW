import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export interface NPRLog {
  action: string;
  rownum: string;
  activity: string;
  nprdate: string;
  nprtime: string;
  mobile: string;
  username: string;
  imsi: string;
  newimsi: string;
  oldnic: string;
  newnnic: string;
  passport: string;
  portid: string;
  route: string;
  rejectcode: string;
  duedate: string;
  duedatetime: string;
  recepient: string;
  donor: string;
  product: string;
  region: string;
  description: string;
}

declare var $: any;

@Component({
  selector: 'app-report-mnpaction-rpt-aspx',
<<<<<<< HEAD
  standalone: true,
=======
>>>>>>> df6adcae315ddb201abfceb949d6603edc257f9e
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './mnp-action-report.component.html',
  styleUrl: './mnp-action-report.component.css'
})
export class MnpActionReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false;
  PMDLog: NPRLog[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  selectedAction: string = '';
  selectedDonor: string = '';
  selectedExport: string = 'S';
  UserID: string[] = []; // For storing UserID values
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  selectedUserID: any = '';
  defaultUserID: string = '';  // <- Ye first value store karega
  participantNames: any[] = []; // Stores one column (e.g., 'name')
  operatorNames: any[] = [];
  showSuccessPopup: boolean = false;
  isSubmitting: boolean = false;
  isErrorPopup: boolean = false;
  popupMessage: string = '';
  loginUser: string = '';

  // Stores Action descriptions
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
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Action`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Check if 'ALL' already exists in API data
        const hasAll = data.some(p => p.action === '' || p.descs === 'ACC  -  NP Activated Error');

        if (!hasAll) {
          // Only add 'ALL' if it's not in API response
          data.unshift({ descs: '', action: '' });
        }

        this.participantNames = data;
        this.selectedAction = 'ACC';
      },
      error: (err) => {
        console.error("Error fetching participants:", err);
      }
    });
  }

  Fetch() {
    debugger;
    const txt_FromDate = this.el.nativeElement.querySelector('#txt_FromDate').value;
    const txt_ToDate = this.el.nativeElement.querySelector('#txt_ToDate').value;
    const ddl_Action = this.selectedAction;
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    const rhb_Screen = this.selectedExport;

    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/MNPActionReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&action=${ddl_Action}&userid=${this.loginUser}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          if (rhb_Screen === 'S') {
            this.PMDLog = res;
          } else {
            setTimeout(() => {
              this.export(res, 'excel');
              this.PMDLog = [];
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
            this.PMDLog = [];
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
    // const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile');
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (this.selectedAction) this.selectedAction = 'ACC';
    if (this.selectedExport) this.selectedExport = 'S';
    this.PMDLog = [];
  }
  export(res: any, file: any) {
    this.GridData = res;
    this.excelService.exportToFile(
      this.GridData, 'MNP Action Report', {
      activity: 'Activity #',
      nprdate: 'NPR Date',
      nprtime: 'NPR Time',
      mobile: 'Mobile #',
      username: 'User Name',
      imsi: 'Old IMSI',
      newimsi: 'New IMSI',
      oldnic: 'Old NIC',
      newnnic: 'New NIC',
      passport: 'Passport #',
      portid: 'Mobile',
      route: 'New Route',
      rejectcode: 'Reject Code',
      duedate: 'Due Date',
      duedatetime: 'Due Date Time',
      recepient: 'Recepient',
      donor: 'Donor',
      product: 'Product',
      region: 'Region',
      action: 'Action',
      description: 'Description'
    }, file
    );
  }
}
