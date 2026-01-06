import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { PaginationService } from '../../services/pagination.service';

export interface PMDLog {
  mobile: string;
  message: string;
  arrialdate: string;
  process: string;
  status: string;
  xml: string;
}

declare var $: any;

@Component({
  selector: 'app-report-pmd-msg-log-rpt-aspx',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './pmd-log-report.component.html',
  styleUrl: './pmd-log-report.component.css'
})
export class PmdLogReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private pager: PaginationService, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false;
  PMDLog: PMDLog[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  selectedOperatorId: string = 'A';
  selectedRejection: string = 'ALL';
  selectedProduct: string = 'All';
  selectedRecepient: string = '';
  selectedDonor: string = '';
  selectedExport: string = 'S';
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

  itemsPerPage: any;
  totalPages = 0;
  currentPage = 1;
  pagedData: any[] = [];
  paginationWindowStart = 1;
  paginationWindowSize = 10;
  showPagination = true;

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
  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    //this.pagedData = this.GridData.slice(startIndex, endIndex);
    this.pagedData = this.filteredData.slice(startIndex, endIndex);
  }
  showNextWindow() {
    if (this.paginationWindowStart + this.paginationWindowSize <= this.totalPages) {
      this.paginationWindowStart += this.paginationWindowSize;
    }
  }
  showPreviousWindow() {
    if (this.paginationWindowStart - this.paginationWindowSize >= 1) {
      this.paginationWindowStart -= this.paginationWindowSize;
    }
  }
  get paginationNumbers(): number[] {
    const pages = [];
    const end = Math.min(this.paginationWindowStart + this.paginationWindowSize - 1, this.totalPages);
    for (let i = this.paginationWindowStart; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
    const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile').value;
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    const rhb_Screen = this.selectedExport;

    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/PMDLogReport?mobile=${txt_Mobile}&fromdate=${txt_FromDate}&todate=${txt_ToDate}&userid=${this.loginUser}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          if (rhb_Screen === 'S') {
            this.PMDLog = res;
            this.filteredData = res;
            this.totalPages = Math.ceil(this.PMDLog.length / this.itemsPerPage);
            this.paginationWindowStart = 1;
            this.setPage(1);
            if (table) table.style.display = 'table';
            this.showPagination = true;
          } else {
            setTimeout(() => {
              this.export(res, 'excel');
              this.PMDLog = [];
              this.filteredData = [];
              this.showPagination = false;
              return;
            }, 100);
          }
        } else {
          this.showSuccessPopup = false;
          setTimeout(() => {
            this.popupMessage = `No Record Found.`;
            this.isErrorPopup = true;
            this.showSuccessPopup = true;
            //this.Reset();
            this.PMDLog = [];
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
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (txt_Mobile) txt_Mobile.value = '';
    // if (rhb_Screen) rhb_Screen.checked = true;
    if (this.selectedExport) this.selectedExport = 'S';
    this.PMDLog = [];
    this.showPagination = false;
    const table = this.el.nativeElement.querySelector('#table');
    if (table) table.style.display = 'none';
  }
  export(res: any, file: any) {
    this.GridData = res;
    this.excelService.exportToFile(
      this.GridData, 'PMD Message Log Report', {
      mobile: 'Mobile',
      message: 'Message',
      xml: 'XML',
      arrivaldate: 'Arrival Date',
      process: 'Process Date',
      status: 'Status'
    }, file
    );
  }
}
