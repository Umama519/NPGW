import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';

export interface TotalPortin {
  fromdate: string;
  todate: string;
  total: string;
  donor: string;
  recepient: string;
}

declare var $: any;

@Component({
  selector: 'app-public-totalportinstatusrpt-aspx',
<<<<<<< HEAD
<<<<<<< HEAD
  standalone: true,
=======
>>>>>>> df6adcae315ddb201abfceb949d6603edc257f9e
=======
    standalone: true,  

>>>>>>> a610ef1c1d7d032226ea4d45a66ed2c66f02743a
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './total-portin-status-report.component.html',
  styleUrl: './total-portin-status-report.component.css'
})
export class TotalPortinStatusReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false;
  TotalPortin: TotalPortin[] = [];
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
    // const ddl_Recepient = this.el.nativeElement.querySelector('#ddl_Recepient').value;
    // const ddl_Donor = this.el.nativeElement.querySelector('#ddl_Donor').value;
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    const rhb_Screen = this.selectedExport;
    
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/TotalPortinStatusReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&donor=${this.selectedDonor}&recepient=${this.selectedRecepient}&userid=${this.loginUser}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
            if (rhb_Screen === 'S') {
              this.TotalPortin = res;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.TotalPortin = [];
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
              this.TotalPortin = [];
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
    // const ddl_Recepient = this.el.nativeElement.querySelector('#ddl_Recepient');
    // const ddl_Donor = this.el.nativeElement.querySelector('#ddl_Donor');
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (this.selectedRecepient) this.selectedRecepient = 'ALL';
    if (this.selectedDonor) this.selectedDonor = 'ALL';
    // if (rhb_Screen) rhb_Screen.checked = true;
    if (this.selectedExport) this.selectedExport = 'S';
    this.TotalPortin = [];
  }
  getGrandTotal(): number {
    return this.TotalPortin.reduce((sum, row) => sum + Number(row.total || 0), 0);
  } 
  export(res:any, file:any) {
      // this.Porting = res;
      this.excelService.exportToFile( 
        this.TotalPortin, 'Total Portin Status Report', {
          donor: 'Donor',
          total: 'Grand Total'
        }, file
      );
  }
}
