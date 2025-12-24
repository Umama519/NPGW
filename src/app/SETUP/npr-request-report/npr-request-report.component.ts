import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

export interface NPRRequestGet {
  fromdate: string,
  todate: string, 
  mobile: string,
  userid: string,
  data667: string,
  bvsd: string
}

declare var $: any;
@Component({
  selector: 'app-public-nprequest-aspx',  
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './npr-request-report.component.html',
  styleUrl: './npr-request-report.component.css'
})
export class NprRequestReportComponent {
  NPRRequestGet: NPRRequestGet[] = [];
  constructor(private  http: HttpClient, private el: ElementRef, private renderer: Renderer2, private exportAsService: ExportAsService) { }
  showModal: boolean = false; // For controlling modal visibility
  deptidToDelete: string | null = null;
  errmessage: string = ""; // Control visibility of popup
  popupMessage: string = '';
  
  GridData: any[] = [];
  selectedFromDate: string = '';
  selectedToDate: string = ''
  selectedUserid: string = '';
  selectedMobile: string = '';
  columns: any[] = [];
  isErrorPopup: boolean = false;
  isadd: string = '';
  loginUser: string = '';
  isgridview: boolean = false;

  ngOnInit(): void {
    this.LoadFields();
    debugger;
    // this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }  
  
  ngAfterViewInit(): void {
    this.initializeDatepicker('#txt_FromDate');
    this.initializeDatepicker('#txt_ToDate');
  }
  
  private initializeDatepicker(selector: string): void {
  ($(selector) as any).datepicker({
    dateFormat: 'dd-mm-yy',
    changeYear: true,
    yearRange: '1970:2035',
    changeMonth: true,
    showAnim: 'fadeIn',
    duration: 'fast',
    showOtherMonths: true,
    selectOtherMonths: true,

    beforeShow: (input: any, inst: any) => {
      setTimeout(() => this.styleDatepicker(inst), 10);
    },

    onChangeMonthYear: (year: number, month: number, inst: any) => {
      setTimeout(() => this.styleDatepicker(inst), 10);
    }
  });
}

private styleDatepicker(inst: any): void {
  inst.dpDiv.css({
    background: '#ffffff',
    border: '2px solid #10486B',
    borderRadius: '8px',
    padding: '4px',
    boxShadow: '0 3px 8px rgba(10, 121, 233, 0.2)',
    fontSize: '11px',
    width: '210px',
  });

  inst.dpDiv.find('.ui-datepicker-header').css({
    backgroundColor: '#10486B',
    color: '#ffffff',
    padding: '8px 0',
    fontWeight: 'bold',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center'
  });

  inst.dpDiv.find('td, th').css({
    padding: '2px',
    height: '24px',
    width: '24px',
    textAlign: 'center'
  });

  inst.dpDiv.find('.ui-state-default').css({
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    color: '#212529'
  });

  inst.dpDiv.find('.ui-state-hover').css({
    background: '#ffc107',
    color: '#000'
  });

  inst.dpDiv.find('.ui-state-active').css({
    background: '#10486B',
    color: '#fff',
    fontWeight: 'bold'
  });

  (inst.dpDiv.find('.ui-datepicker-prev, .ui-datepicker-next') as any).css({
    'background-image': 'none',
    // 'color': '#ffc107',
    'font-weight': 'bold',
    'font-size': '18px',
    'background': '#10486B',
    'border': 'none'
  });

  (inst.dpDiv.find('.ui-datepicker-prev') as any).html('⬅️');
  (inst.dpDiv.find('.ui-datepicker-next') as any).html('➡️');
  }
  LoadFields() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit')
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name');
    if (txt_Name) {
      this.renderer.setAttribute(txt_Name, 'disabled', 'true'); // Disable input field
    }
    if (btn_Submit) {
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
  }
    formatHeader(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
   export(format: 'pdf' | 'xls' | 'csv' | 'xml' ) {
    const config: ExportAsConfig = {
      type: format,
      elementIdOrContent: 'tableToExport', // 👈 table id
    };

    this.exportAsService.save(config, 'Department Setup').subscribe(() => {      
    });
  }
  GetGrid() {
    const txt_FromDate = (document.getElementById('txt_FromDate') as HTMLInputElement).value;
    const txt_ToDate = (document.getElementById('txt_ToDate') as HTMLInputElement).value;
    const txt_UserID = (document.getElementById('txt_UserID') as HTMLInputElement).value;
    const txt_Mobile =  (document.getElementById('txt_Mobile') as HTMLInputElement).value;

    const url = `http://localhost:5000/api/NprRequestReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&mobile=${txt_Mobile}&userid=${txt_UserID}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.NPRRequestGet = res;
          this.GridData = res;
          this.isgridview = true;
        } else {
          console.log('No data found');          
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);        
      }
    });
  }
  ResetButton() {
    this.ResetFields();
  }
  ResetFields() {
    const txt_FromDate = this.el.nativeElement.querySelector('#txt_FromDate');
    const txt_ToDate = this.el.nativeElement.querySelector('#txt_ToDate');
    const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile');
    const txt_UserID = this.el.nativeElement.querySelector('#txt_UserID');
    
    txt_FromDate.value = '';
    txt_ToDate.value = '';
    txt_Mobile.value = '';
    txt_UserID.value = ''; 
    this.isgridview = false; 
    this.selectedUserid = '';    
  }
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track

  searchButton() {
    debugger;
    this.GetGrid();
  }
  getID() {
    this.selectedUserid = localStorage.getItem('loginUser') || '';    
  }
}