import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export interface Portout {
  fromdate: string;
  todate: string;
  nprdate: string;
  recepient: string;
  donor: string;
  portin: string;
  portout: string;
  franchise: string;
  service: string;
  prepaid: string;
  postpaid: string;
  accept: string;
  reject: string;
  hold: string;
  successpot: string;
}


declare var $: any;

@Component({
  selector: 'app-public-portoutsummary-aspx',
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './port-out-summary-report.component.html',
  styleUrl: './port-out-summary-report.component.css'
})
export class PortOutSummaryReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
    lovDisabled: boolean = false;   
    Portout: Portout[] = [];
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
  
      const url = `${environment.apiBaseUrl}/api/PortoutSummaryReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&userid=${this.loginUser}`;
      
      this.http.get<any>(url).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            if (rhb_Screen === 'S') {
              this.Portout = res;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.Portout = [];
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
              this.Portout = [];
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
      // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');
  
      if (txt_Frmdate) txt_Frmdate.value = '';
      if (txt_Todate) txt_Todate.value = '';
      // if (rhb_Screen) rhb_Screen.checked = true;
      if (this.selectedExport) this.selectedExport = 'S';
      this.Portout = [];
    }
    export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'Port Out Summary Report', {
          nprdate: 'NPR Date',
          recepient: 'Recepient',
          donor: 'Donor',
          portin: 'Port In',
          franchise: 'Franchise ID',
          service: 'Service',
          prepaid: 'Pre Paid',
          postpaid: 'Post Paid',
          accept: 'Accept',
          reject: 'Reject',
          hold: 'Hold',
          successpot: 'Success Pot',
        }, file
      );
    }
  }
