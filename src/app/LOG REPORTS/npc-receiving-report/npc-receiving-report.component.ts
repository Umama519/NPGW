import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';

export interface NPCReceiving {
  mobile: string;
  msg: string;
  arrivaldate: string;
  portdate: string;
  duedate: string;
  difference: string;
  msenddate: string;
  mpulldate: string;
  mprocessdate: string;
  mdifference: string;
}

declare var $: any;

@Component({
  selector: 'app-report-npcrecrpt-aspx',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './npc-receiving-report.component.html',
  styleUrl: './npc-receiving-report.component.css'
})
export class NpcReceivingReportComponent {
constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
    Porting: NPCReceiving[] = [];
    FormDate: string = '';
    ToDate: String = ''
    Action: any[] = [];
    selectedRecepient: string = '';
    selectedDonor: string = '';  
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
      
      const table = this.el.nativeElement.querySelector('#table');
  
      const url = `${environment.apiBaseUrl}/api/NPCReceivingReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&userid=${this.loginUser}`;
      
      this.http.get<any>(url).subscribe({
        next: (res) => {
          let index = res.length;
          if (res && res.length > 0) {            
            this.GridData = res;
            this.showSuccessPopup = false;
            setTimeout(() => {
              this.export(res, 'excel');
              this.popupMessage = `Process Completed ${index} Record(s) Found.`;
              this.isErrorPopup = false;
              this.showSuccessPopup = true;
              this.Porting = [];
              return;
            }, 100); 
            document.getElementById('loader')!.style.display = 'none';
            if (table) table.style.display = 'table';
          } else {
            this.showSuccessPopup = false;
            setTimeout(() => {
              this.popupMessage = `Process Completed ${index} Record(s) Found.`;
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
  
      if (txt_Frmdate) txt_Frmdate.value = '';
      if (txt_Todate) txt_Todate.value = '';
      this.Porting = [];
    }
    getTotalRecepient() {
      // return this.Porting.reduce((sum, row) => sum + Number(row.recepient || 0), 0);
    }
    getTotalDonor() {
      // return this.Porting.reduce((sum, row) => sum + Number(row.donor || 0), 0);
    }
    export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'NPC Receiving Report', {
        mobile: 'Mobile #',
        msg: 'Message',
        arrivaldate: 'Arrival Date',
        portdate: 'Port Date',
        duedate: 'Due Date',
        difference: 'Difference',
        msenddate: 'MSend Date',
        mpulldate: 'MPull Date',
        mprocessdate: 'MProcess Date',
        mdifference: 'MDifference',
        }, file
      );
    }
  }
