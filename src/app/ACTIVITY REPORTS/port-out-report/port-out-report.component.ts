import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { DateRangeService } from 'app/services/date-range.service';

export interface PortOut {
  mobile: string;
  name: string;
  cnic: string;
  newimsi: string;
  nprdate: string;
  product: string;
  recepient: string;
}

declare var $: any;

@Component({
  selector: 'app-public-portoutreport-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './port-out-report.component.html',
  styleUrl: './port-out-report.component.css'
})
export class PortOutReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private dateRangeService: DateRangeService, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false; 
  PortOut: PortOut[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  selectedOperatorId: string = '';
  selectedProduct: string = 'All';
  selectedExport:  string = 'S';
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
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Operator`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Check if 'ALL' already exists in API data
        const hasAll = data.some(p => p.userid === 'ALL' || p.user === 'ALL');

        if (!hasAll) {
          // Only add 'ALL' if it's not in API response
          data.unshift({ user: 'ALL', userid: 'ALL' });
        }

        this.participantNames = data;
        this.selectedOperatorId = 'ALL'; // Set default as 'ALL'
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
    const donor = this.selectedOperatorId;
    const ddl_Donor = donor === 'ALL' ? 'All' : donor;
    // const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live').checked ? 'L' : 'H';
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    this.rhb_Live = this.dateRangeService.getRhbLive(txt_FromDate, txt_ToDate);
    const rhb_Screen = this.selectedExport;
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/PortOutReport?donor=${ddl_Donor}&fromdate=${txt_FromDate}&todate=${txt_ToDate}&datafor=${this.rhb_Live}&userid=${this.loginUser}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
            if (rhb_Screen === 'S') {
              this.PortOut = res;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.PortOut = [];
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
              this.PortOut = [];
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
    const ddl_Donor = this.el.nativeElement.querySelector('#ddl_Donor');
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');
    // const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (ddl_Donor) ddl_Donor.value = 'ALL';
    if (this.selectedExport) this.selectedExport = 'S';
    if (this.rhb_Live) this.rhb_Live = 'L';
    this.PortOut = [];
  }
  export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'Port Out Report', {
          mobile: 'Mobile #',
          name: 'Name',
          cnic: 'Cnic',
          newimsi: 'New Imsi',
          nprdate: 'NPR Date',
          product: 'Product',
          recepient: 'Recepient'
        }, file
      );
    }
}
