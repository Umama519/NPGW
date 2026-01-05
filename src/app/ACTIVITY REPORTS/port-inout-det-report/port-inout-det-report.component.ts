import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { environment } from 'environments/environment';

export interface PortIn {
  fromdate: string;
  todate: string;
  type: string;
  datafor: string;
  mobile: string;
  status: string;
  franchisetype: string;
  pinpot: string;
  success: string;
  rejcode: string;
  nprdate: string;
  product: string;
  donor: string;
  tariff: string;
  franchiseid: string;
  associate1: string;
  associate2: string;
  nprtype: string;
  recepient: string;
}

declare var $: any;

@Component({
  selector: 'app-public-portinoutdetail-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './port-inout-det-report.component.html',
  styleUrl: './port-inout-det-report.component.css'
})
export class PortInoutDetReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private datepickerService: DatepickerService, private renderer: Renderer2, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false;
  PortIn: PortIn[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  selectedOperatorId: string = '';
  selectedOperatorId1: string = '';
  selectedProduct: string = 'All';
  selectedNPRType: string = 'All';
  selectedExport:  string = 'S';
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
  NPRType = [
    { code: 'All', name: 'ALL' },
    { code: 'PREPAID', name: 'PrePaid' },
    { code: 'POSTPAID', name: 'PostPaid' }
  ];
  Account = [
    { code: 'All', name: 'ALL' },
    { code: 'PORTIN', name: 'PORTIN' },
    { code: 'PORTOUT', name: 'PORTOUT' }
  ];
  Export = [
    { code: 'S', name: 'Screen' },
    { code: 'F', name: 'File' }
  ];

  Operator_Lov() {
    debugger;
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Operator`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Check if 'ALL' already exists in API data
        const hasAll = data.some(p => p.operatorName === 'ALL' || p.operatorId === 'ALL');

        if (!hasAll) {
          // Only add 'ALL' if it's not in API response
          data.unshift({ operatorId: 'ALL', operatorName: 'ALL' });
        }

        this.participantNames = data;
        this.selectedOperatorId = 'ALL';
        this.selectedOperatorId1 = 'ALL'
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
    const donor = this.selectedOperatorId1
    const ddl_Donor = donor === 'ALL' ? 'All' : donor;    
    const txt_FranchiseID = this.el.nativeElement.querySelector('#txt_FranchiseID').value;    
    // const ddl_NPRType = this.el.nativeElement.querySelector('#ddl_NPRType').value;
    const recepient = this.selectedOperatorId
    const ddl_Recepient = recepient === 'ALL' ? 'All' : donor;
    // const ddl_Product = this.el.nativeElement.querySelector('#ddl_Product').value;
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    const rhb_Screen = this.selectedExport;
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/PortInOutReport?recepient=${ddl_Donor}&donor=${ddl_Recepient}&nprtype=${this.selectedNPRType}&type=${this.selectedProduct}&fromdate=${txt_FromDate}&todate=${txt_ToDate}&franchiseid=${txt_FranchiseID}&userid=${this.loginUser}`;
    
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
    const txt_Frmdate = this.el.nativeElement.querySelector('#txt_FromDate');
    const txt_Todate = this.el.nativeElement.querySelector('#txt_ToDate');
    // const ddl_Donor = this.el.nativeElement.querySelector('#ddl_Donor');
    // const ddl_Recepient = this.el.nativeElement.querySelector('#ddl_Recepient');
    const txt_FranchiseID = this.el.nativeElement.querySelector('#txt_FranchiseID');
    // const ddl_NPRType = this.el.nativeElement.querySelector('#ddl_NPRType');
    // const ddl_Product = this.el.nativeElement.querySelector('#ddl_Product');
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (this.selectedOperatorId) this.selectedOperatorId = 'ALL';
    if (this.selectedOperatorId1) this.selectedOperatorId1 = 'ALL';
    if (txt_FranchiseID) txt_FranchiseID.value = '';
    if (this.selectedNPRType) this.selectedNPRType = 'All';
    if (this.selectedProduct) this.selectedProduct = 'All';
    if (this.selectedExport) this.selectedExport = 'S';
    this.PortIn = [];
  }
  export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'Port In-Out Report', {
          nprdate: 'Date',
          franchiseid: 'Franchise ID',
          franchisetype: 'Franchise Type',
          recepient: 'Recepient',
          mobile: 'Mobile #',
          product: 'Product',
          nprtype: 'NPR Type',
          associate1: 'Associate 1',
          associate2: 'Associate 2'
        }, file
      );
    }
}

