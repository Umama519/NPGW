import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { ExcelExportService } from 'app/services/excel-export.service';
import { PaginationService } from 'app/services/pagination.service';

@Component({
  selector: 'app-public-nprmanuallogreport-aspx',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nprmanual-log-report.component.html',
  styleUrl: './nprmanual-log-report.component.css'
})
export class NPRManualLogReportComponent {

  constructor(private pager: PaginationService, private datepickerService: DatepickerService, private el: ElementRef, private http: HttpClient, private excelService: ExcelExportService) {
    this.itemsPerPage = this.pager.defaultItemsPerPage;
  }
  FormDate: string = '';
  ToDate: String = ''
  UserID: string[] = []; // For storing UserID values
  Mobile: string = '';
  windowStart = 1;
  windowSize: number = 0;
  pagedData: any[] = [];
  GridData: any[] = [];
  showSuccessPopup: boolean = false;
  isSubmitting: boolean = false;
  isErrorPopup: boolean = false;
  popupMessage: string = '';
  itemsPerPage: any;
  totalPages = 0;
  currentPage = 1;
  paginationWindowStart = 1;
  paginationWindowSize = 10;
  AllData: any[] = [];   // pura API data
  showPagination = true;
  ngOnInit(): void {
    const table = this.el.nativeElement.querySelector('#table');
    if (table) table.style.display = 'none';
  }
  ngAfterViewInit(): void {
    this.datepickerService.initializeDatepicker('#txt_FromDate');
    this.datepickerService.initializeDatepicker('#txt_ToDate');
  }
  setPage(page: number) {
    this.currentPage = page;

    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.GridData = this.AllData.slice(startIndex, endIndex); // ✅ SAFE
  }

 showNextWindow() {
  const nextStart = this.paginationWindowStart + this.paginationWindowSize;

  if (nextStart <= this.totalPages) {
    this.paginationWindowStart = nextStart;
    this.setPage(this.paginationWindowStart);

  }
}

goToFirstWindow() {
  this.paginationWindowStart = 1;
  this.currentPage = 1;
  this.setPage(1);
}


  goToLastWindow() {
    this.totalPages = Math.ceil(this.AllData.length / this.itemsPerPage);
    const lastWindowStart =
      Math.floor((this.totalPages - 1) / this.paginationWindowSize) *
      this.paginationWindowSize +
      1;

    this.paginationWindowStart = lastWindowStart;
    this.currentPage = this.totalPages;
    this.setPage(this.totalPages);
  }

  showPreviousWindow() {
    const prevStart = this.paginationWindowStart - this.paginationWindowSize;

    if (prevStart >= 1) {
      this.paginationWindowStart = prevStart;
      this.setPage(this.paginationWindowStart); // optional auto jump
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
  Fetch() {

    const fromdate = this.el.nativeElement.querySelector('#txt_FromDate').value;
    const todate = this.el.nativeElement.querySelector('#txt_ToDate').value;
    const Userid = this.el.nativeElement.querySelector('#txt_Userid').value;
    const Mobile = this.el.nativeElement.querySelector('#txt_Mobile').value;
    const table = this.el.nativeElement.querySelector('#table');

    let params: string[] = [];

    if (fromdate) params.push(`fromdate=${fromdate}`);
    if (todate) params.push(`todate=${todate}`);
    if (Userid) params.push(`Userid=${Userid}`);
    if (Mobile) params.push(`Mobile=${Mobile}`);
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    const url = `${environment.apiBaseUrl}/api/ManualLogReport${queryString}`;
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.AllData = res;                     // ✅ full data save
          this.totalPages = Math.ceil(res.length / this.itemsPerPage);
          this.paginationWindowStart = 1;
          this.currentPage = 1;
          this.setPage(1);

          if (table) table.style.display = 'table';
        }
        else {
          this.showSuccessPopup = false;
          setTimeout(() => {
            this.popupMessage = `No Record Found.`;
            this.showPagination = false;
            this.GridData = [];
            this.isErrorPopup = true;
            this.showSuccessPopup = true;
            return;
          }, 100);
        }
      },
      error: (err) => {
        console.error(err);
        this.GridData = [];
      }
    });

  }
  Reset() {

    const fromdate = this.el.nativeElement.querySelector('#txt_FromDate') as HTMLInputElement;
    const todate = this.el.nativeElement.querySelector('#txt_ToDate') as HTMLInputElement;
    const Userid = this.el.nativeElement.querySelector('#txt_Userid') as HTMLInputElement;
    const Mobile = this.el.nativeElement.querySelector('#txt_Mobile') as HTMLInputElement;

    // inputs clear
    if (fromdate) fromdate.value = '';
    if (todate) todate.value = '';
    if (Userid) Userid.value = '';
    if (Mobile) Mobile.value = '';
    this.GridData = [];
    const table = this.el.nativeElement.querySelector('#table') as HTMLElement;
    if (table) table.style.display = 'none';
  }

  export(res: any, file: any) {
    debugger;
    this.GridData = this.GridData;
    this.excelService.exportToFile(
      this.GridData, 'NPR Manual Log Report', {
      Mobile: 'Mobile',
      Data667: 'Data667',
      BVS: 'BVS',
      UserID: 'User ID',
      logData: 'Log Date'
    }, file
    );
  }
}
