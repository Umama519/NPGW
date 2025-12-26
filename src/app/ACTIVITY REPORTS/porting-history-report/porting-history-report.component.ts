import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { DateRangeService } from 'app/services/date-range.service';

export interface Porting {
  fromdate: string;
  todate: string;
  nprtype: string;
  product: string;
  datafor: string;
  msisdn: string;
  franchiseid: string;
  regname: string;
  oldnetwork: string;
  newnetwork: string;
  nprdate: string;
  portdate: string;
  newroute: string;
  region: string;
  portid: string;
  saleperson: string;
  bvs: string;
  recepient: string;
  associate1: string;
  associate2: string;
}

declare var $: any;

@Component({
  selector: 'app-public-portinghistory-aspx',
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './porting-history-report.component.html',
  styleUrl: './porting-history-report.component.css'
})
export class PortingHistoryReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private dateRangeService: DateRangeService, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false; 
  Porting: Porting[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  selectedOperatorId: string = '%';
  selectedRejection: string = '%';
  selectedProduct: string = '%';
  selectedRecepient: string = '';
  selectedDonor: string = '';  
  selectedExport:  string = 'S';
  rhb_Live: string = 'L';
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
 NPRType = [
    { code: '%', name: 'ALL' },
    { code: 'R', name: 'PIN' },
    { code: 'D', name: 'PIN' },
    { code: 'B', name: 'BROADCAST' }
  ];  
  Product = [
    { code: '%', name: 'ALL' },
    { code: 'O', name: 'PrePaid' },
    { code: 'R', name: 'PostPaid' }
  ];
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
    // const ddl_NPRType = this.el.nativeElement.querySelector('#ddl_NPRType').value;
    const txt_FranchiseID = this.el.nativeElement.querySelector('#txt_FranchiseID').value;
    const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile').value;
    // const ddl_Product = this.el.nativeElement.querySelector('#ddl_Product').value;
    // const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live').checked ? 'L' : 'H';
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    this.rhb_Live = this.dateRangeService.getRhbLive(txt_FromDate, txt_ToDate);
    const rhb_Screen = this.selectedExport;
    
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/PortingHistoryReport?nprtype=${this.selectedOperatorId}&product=${this.selectedProduct}&fromdate=${txt_FromDate}&todate=${txt_ToDate}&msisdn=${txt_Mobile}&franchiseid=${txt_FranchiseID}&datafor=${this.rhb_Live}&userid=${this.loginUser}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
            if (rhb_Screen === 'S') {
              this.Porting = res;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.Porting = [];
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
              this.Porting = [];
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
    // const ddl_Product = this.el.nativeElement.querySelector('#ddl_Product');
    // const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live');
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (this.selectedOperatorId) this.selectedOperatorId = '%';
    if (txt_FranchiseID) txt_FranchiseID.value = '';
    if (txt_Mobile) txt_Mobile.value = '';
    if (this.selectedProduct) this.selectedProduct = '%';
    if (this.selectedExport) this.selectedExport = 'S';
    if (this.rhb_Live) this.rhb_Live = 'L';
    this.Porting = [];
  }
  export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'Porting History Report', {
          msisdn: 'Mobile',
          regname: ' Name',
          product: 'Product',
          nprtype: 'NPR Type',
          franchiseid: 'Franchise ID',
          oldnetwork: 'Old Network',
          newnetwork: 'New Network',
          nprdate: 'NPR Date',
          portdate: 'Port Date',
          newroute: 'New Route',
          region: 'Region',
          portid: 'Port ID',
          associate1: 'Associate 1',
          associate2: 'Associate 2',
          saleperson: 'Sale Person',
          bvs: 'BVS'
        }, file
      );
    }
}
