import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { ExcelExportService } from 'app/services/excel-export.service';

export interface Integration {
  adesc: string;
  interfac: string;
  total: string;
  done: string;
  os: string;
  date1: string;
  date: string;
  sendrec: string;
}

declare var $: any;

@Component({
  selector: 'app-report-sysintegrationstatus-aspx',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './integration-status-report.component.html',
  styleUrl: './integration-status-report.component.css'
})
export class IntegrationStatusReportComponent {
constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
    lovDisabled: boolean = false; 
    Daily: Integration[] = [];
    FormDate: string = '';
    ToDate: String = ''
    Action: any[] = [];
    selectedOperatorId: string = '';
    selectedProduct: string = 'All';
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
    currentDate: Date = new Date();
  
    // Stores Action descriptions
    ngOnInit(): void {
      debugger;
      const tab = this.el.nativeElement.querySelector('#table')
      this.currentDate = new Date();
      this.Fetch();
    }
    Fetch() {
      debugger;
      const table = this.el.nativeElement.querySelector('#table');
  
      const url = `http://localhost:5000/api/IntegrationStatusReport`;
      
      this.http.get<any>(url).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            this.Daily = res;
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
      const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');
      const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live');
  
      if (txt_Frmdate) txt_Frmdate.value = '';
      if (txt_Todate) txt_Todate.value = '';
      if (txt_Mobile) txt_Mobile.value = '';
      if (txt_PortID) txt_PortID.value = '';
      if (this.selectedOperatorId) this.selectedOperatorId = '';
      if (rhb_Screen) rhb_Screen.checked = true;
      if (rhb_Live) rhb_Live.checked = true;
      this.Daily = [];
    }

    export(res:any, file:any) {
      debugger;
      this.GridData = this.Daily;
        this.excelService.exportToFile( 
          this.GridData, 'System Integration Status Report', {
            adesc: 'Description',
            interfac: 'Interface',
            sendrec: 'Account Type',
            total: 'Total',
            done: 'Done',
            os: 'OS',
            date: 'Date'
          }, file
        );
      }
  }