import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';

export interface Current {
  fromdate: string;
  todate: string;
  reject: string;
  rejcd: string;
  msisdn: string;
  city: string;
  descrip: string;
  nprdate: string;
  product: string;
  donor: string;
  franchiseid: string;
  associate1: string;
  associate2: string;
  nprtype: string;
  recepient: string;
}

declare var $: any;

@Component({
  selector: 'app-public-rejectionhisreport-aspx',
<<<<<<< HEAD
<<<<<<< HEAD
  standalone: true,
=======
>>>>>>> df6adcae315ddb201abfceb949d6603edc257f9e
=======
    standalone: true,  

>>>>>>> a610ef1c1d7d032226ea4d45a66ed2c66f02743a
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './rejection-history-report.component.html',
  styleUrl: './rejection-history-report.component.css'
})
export class RejectionHistoryReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  Current: Current[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
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
  lovDisabled: boolean = false; 
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

  NPRType = [
    { code: 'A', name: 'ALL' },
    { code: 'R', name: 'PIN' },
    { code: 'D', name: 'POT' }
  ];
  Export = [
    { code: 'S', name: 'Screen' },
    { code: 'F', name: 'File' }
  ];

  Operator_Lov() {
    debugger;
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Rejection`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        debugger;
        const hasAll = data.some(p => p.descs === 'ALL');

        if (!hasAll) {
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
        const hasAll = data.some(p => p.operatorName === 'ALL' || p.operatorId === 'ALL');

        if (!hasAll) {
          // Only add 'ALL' if it's not in API response
          data.unshift({ operatorId: 'ALL', operatorName: 'ALL' });
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
    // const ddl_NPRType = this.el.nativeElement.querySelector('#ddl_NPRType').value;
    const txt_FranchiseID = this.el.nativeElement.querySelector('#txt_FranchiseID').value;
    const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile').value;
    // const ddl_Rejection = this.el.nativeElement.querySelector('#ddl_Rejection').value;
    // const ddl_Recepient = this.el.nativeElement.querySelector('#ddl_Recepient').value;
    // const ddl_Donor = this.el.nativeElement.querySelector('#ddl_Donor').value;
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    const rhb_Screen = this.selectedExport;
    
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/RejectionHistoryReport?nprtype=${this.selectedOperatorId}&reject=${this.selectedRejection}&recepient=${this.selectedRecepient}&donor=${this.selectedDonor}&fromdate=${txt_FromDate}&todate=${txt_ToDate}&msisdn=${txt_Mobile}&franchiseid=${txt_FranchiseID}&userid=${this.loginUser}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
            if (rhb_Screen === 'S') {
              this.Current = res;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.Current = [];
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
              this.Current = [];
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
    // const ddl_NPRType = this.el.nativeElement.querySelector('#ddl_NPRType');
    const txt_FranchiseID = this.el.nativeElement.querySelector('#txt_FranchiseID');
    const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile');
    // const ddl_Rejection = this.el.nativeElement.querySelector('#ddl_Rejection');
    // const ddl_Recepient = this.el.nativeElement.querySelector('#ddl_Recepient');
    // const ddl_Donor = this.el.nativeElement.querySelector('#ddl_Donor');
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (this.selectedOperatorId) this.selectedOperatorId = 'A';
    if (txt_FranchiseID) txt_FranchiseID.value = '';
    if (txt_Mobile) txt_Mobile.value = '';
    if (this.selectedRejection) this.selectedRejection = 'ALL';
    if (this.selectedRecepient) this.selectedRecepient = 'ALL';
    if (this.selectedDonor) this.selectedDonor = 'ALL';
    if (this.selectedExport) this.selectedExport = 'S';
    // if (rhb_Screen) rhb_Screen.checked = true;
    this.Current = [];
  }
  export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'Rejection History Report', {
          msisdn: 'Mobile #',
          product: 'Product',
          city: 'City',
          franchiseid: 'Franchise ID',
          rejcd: 'Rejection Code',
          todate: 'Rejection Date',
          nprdate: 'NPR Date',
          recepient: 'Recepient',
          donor: 'Donor',
          associate1: 'Associate 1',
          associate2: 'Associate 2'
        }, file
      );
    }
}
