import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export interface RejectDonor {
  fromdate: string;
  todate: string;
  seq_no: string;
  nprdate: string;
  npr_no: string;
  cell: string;
  regname: string;
  newnic: string;
  oldnic: string;
  iccid: string;
  acctype: string;
  donor: string;
  recepient: string;
  activity: string;
  arrivaldate: string;
  action: string;
  portid: string;
  rej_code: string;
  associate1: string;
  associate2: string;
}

declare var $: any;

@Component({
  selector: 'app-public-rejectbydonor-aspx',
<<<<<<< HEAD
<<<<<<< HEAD
  standalone: true,
=======
>>>>>>> df6adcae315ddb201abfceb949d6603edc257f9e
=======
    standalone: true,  

>>>>>>> a610ef1c1d7d032226ea4d45a66ed2c66f02743a
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './reject-by-donor-report.component.html',
  styleUrl: './reject-by-donor-report.component.css'
})
export class RejectByDonorReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  RejectDonor: RejectDonor[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  lovDisabled: boolean = false; 
  selectedOperatorId: string = 'A';
  selectedRejection: string = 'ALL';
  selectedProduct: string = 'All';
  selectedRecepient: string = '';
  selectedDonor: string = '';  
  selectedExport:  string = 'S';
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
    this.Operator_Lov1();
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
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/RejectCode`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Check if 'ALL' already exists in API data
        const hasAll = data.some(p => p.descs === 'ALL');

        if (!hasAll) {
          // Only add 'ALL' if it's not in API response
          data.unshift({ descs: 'ALL' });
        }

        this.participantNames = data;
        this.selectedRejection = 'ALL';
      },
      error: (err) => {
        console.error("Error fetching participants:", err);
      }
    });
  }

  Operator_Lov1() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Operator`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Check if 'ALL' already exists in API data
        const hasAll = data.some(p => p.userid === 'ALL' || p.user === 'ALL');

        if (!hasAll) {
          // Only add 'ALL' if it's not in API response
          data.unshift({ user: 'ALL', userid: 'ALL' });
        }

        this.operatorNames = data;
        this.selectedRecepient = 'ALL';
        this.selectedDonor = 'ALL';
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
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    const rhb_Screen = this.selectedExport;
    
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/RejectByDonorReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&userid=${this.loginUser}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
            if (rhb_Screen === 'S') {
              this.RejectDonor = res;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.RejectDonor = [];
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
              this.RejectDonor = [];
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
    const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (rhb_Screen) rhb_Screen.checked = true;
    this.RejectDonor = [];
  }
  export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'Reject By Donor Report', {
          seq_no: 'Activity #',
          npr_no: 'NPR #',
          nprdate: 'NPR Date',
          cell: 'Mobile #',
          regname: 'Name',
          newnic: 'New Nic',
          oldnic: 'Old Nic',
          iccid: 'Iccid',
          acctype: 'Account Type',
          donor: 'Donor',
          recepient: 'Recepient',
          activity: 'Activity',
          arrivaldate: 'Arrival Date',
          action: 'Action',
          portid: 'Port ID',
          rej_code: 'Rejection Code',
          associate1: 'Associate 1',
          associate2: 'Associate 2',
        }, file
      );
    }
}