import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { DateRangeService } from 'app/services/date-range.service';
import { PaginationService } from '../../services/pagination.service';

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
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private pager: PaginationService, private dateRangeService: DateRangeService, private datepickerService: DatepickerService, private excelService: ExcelExportService) {
    this.itemsPerPage = this.pager.defaultItemsPerPage;
  }
  lovDisabled: boolean = false;
  PortOut: PortOut[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  selectedOperatorId: string = '';
  selectedProduct: string = 'All';
  selectedExport: string = 'S';
  selectedLive: string = 'L';
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
  Live = [
    { code: 'L', name: 'Live' },
    { code: 'H', name: 'History' }
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
    //this.rhb_Live = this.dateRangeService.getRhbLive(txt_FromDate, txt_ToDate);
    const rhb_Live = this.selectedLive;
    const rhb_Screen = this.selectedExport;
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/PortOutReport?donor=${ddl_Donor}&fromdate=${txt_FromDate}&todate=${txt_ToDate}&datafor=${rhb_Live}&userid=${this.loginUser}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          if (rhb_Screen === 'S' && res.length < 1000) {
            this.PortOut = res;
            this.filteredData = res;
            this.totalPages = Math.ceil(this.PortOut.length / this.itemsPerPage);
            this.paginationWindowStart = 1;
            this.setPage(1);
            if (table) table.style.display = 'table';
            this.showPagination = true;
          } else {
            setTimeout(() => {
              this.export(res, 'excel');
              this.PortOut = [];
              this.filteredData = [];
              this.showPagination = false;
              //this.Reset();
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
            this.PortOut = [];
            this.showPagination = false;
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
    if (this.selectedLive) this.selectedLive = 'L';
    //if (this.rhb_Live) this.rhb_Live = 'L';
    this.PortOut = [];
    this.showPagination = false;
    const table = this.el.nativeElement.querySelector('#table');
    if (table) table.style.display = 'none';
  }
  export(res: any, file: any) {
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
