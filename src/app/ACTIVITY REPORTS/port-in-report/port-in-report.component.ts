import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { DateRangeService } from 'app/services/date-range.service';
import { loaderService } from 'app/SETUPS/Service/loaderService';
import { PaginationService } from 'app/services/pagination.service';

export interface PortIn {
  fromdate: string;
  todate: string;
  type: string;
  datafor: string;
  mobile: string;
  address: string;
  name: string;
  city: string;
  email: string;
  otel: string;
  cnic: string;
  newimsi: string;
  oldimsi: string;
  nprdate: string;
  product: string;
  donor: string;
  tariff: string;
  franchiseid: string;
  portfee: string;
  handsetfee: string;
  handsetiemi: string;
  associate1: string;
  associate2: string;
  mail: string;
  userid: string;
  bvstag: string;
  npr: string;
}

declare var $: any;

@Component({
  selector: 'app-public-portinreport-aspx',
  standalone: true,
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './port-in-report.component.html',
  styleUrl: './port-in-report.component.css'
})
export class PortInReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private pager: PaginationService, public loaderService: loaderService, private dateRangeService: DateRangeService, private datepickerService: DatepickerService, private excelService: ExcelExportService) {
    this.itemsPerPage = this.pager.defaultItemsPerPage;
  }
  lovDisabled: boolean = false;
  PortIn: PortIn[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  selectedOperatorId: string = '';
  selectedProduct: string = 'All';
  selectedExport: string = 'S';
  selectedLive: string = 'L';
  UserID: string[] = []; // For storing UserID values
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  selectedUserID: any = '';
  defaultUserID: string = '';
  participantNames: any[] = [];
  showSuccessPopup: boolean = false;
  isSubmitting: boolean = false;
  isErrorPopup: boolean = false;
  popupMessage: string = '';
  rhb_Live: string = 'L';
  loginUser: string = '';
  data: any[] = [];

  itemsPerPage: any;
  totalPages = 0;
  currentPage = 1;
  pagedData: any[] = [];
  paginationWindowStart = 1;
  paginationWindowSize = 10;
  showPagination = true;

  ngOnInit(): void {
    const tab = this.el.nativeElement.querySelector('#table')
    this.Operator_Lov();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }
  ngAfterViewInit(): void {
    this.datepickerService.initializeDatepicker('#txt_FromDate');
    this.datepickerService.initializeDatepicker('#txt_ToDate');
  }
  Product = [
    { code: 'All', name: 'ALL' },
    { code: 'PREPAID', name: 'PrePaid' },
    { code: 'POSTPAID', name: 'PostPaid' }
  ];
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
        const hasAll = data.some(p => p.operatorName === 'ALL' || p.operatorId === 'ALL');

        if (!hasAll) {
          data.unshift({ operatorId: 'ALL', operatorName: 'ALL' });
        }

        this.participantNames = data;
        this.selectedOperatorId = 'ALL';
      },
      error: (err) => {
        console.error("Error fetching participants:", err);
      }
    });
  }
  Fetch() {
    debugger;
    this.loaderService.show();
    try {
      const txt_FromDate = this.el.nativeElement.querySelector('#txt_FromDate').value;
      const txt_ToDate = this.el.nativeElement.querySelector('#txt_ToDate').value;
      const donor = this.selectedOperatorId;
      const ddl_Donor = donor === 'ALL' ? 'All' : donor;
      const txt_FranchiseID = this.el.nativeElement.querySelector('#txt_FranchiseID').value;
      const rhb_Live = this.selectedLive;//this.el.nativeElement.querySelector('#rhb_Live').checked ? 'L' : 'H';
      //this.rhb_Live = this.dateRangeService.getRhbLive(txt_FromDate, txt_ToDate);
      const rhb_Screen = this.selectedExport;
      const table = this.el.nativeElement.querySelector('#table');
      const url = `${environment.apiBaseUrl}/api/PortInReport?donor=${ddl_Donor}&fromdate=${txt_FromDate}&todate=${txt_ToDate}&type=${this.selectedProduct}&franchiseid=${txt_FranchiseID}&datafor=${rhb_Live}&userid=${this.loginUser}`;

      this.http.get<any>(url).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            if (rhb_Screen === 'S' && res.length < 1000) {
              this.PortIn = res;
              this.filteredData = res;
              this.totalPages = Math.ceil(this.PortIn.length / this.itemsPerPage);
              this.paginationWindowStart = 1;
              this.setPage(1);
              if (table) table.style.display = 'table';
              this.showPagination = true;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.PortIn = [];
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
              this.PortIn = [];
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
        },
        complete: () => {
          this.loaderService.hide();
        }
      });
    } catch (err) {
      console.error(err);
      this.loaderService.hide();
    }
  }
  Reset() {
    debugger;
    const txt_Frmdate = this.el.nativeElement.querySelector('#txt_FromDate');
    const txt_Todate = this.el.nativeElement.querySelector('#txt_ToDate');
    // const ddl_Donor = this.el.nativeElement.querySelector('#ddl_Donor');
    const txt_FranchiseID = this.el.nativeElement.querySelector('#txt_FranchiseID');
     const ddl_Product = this.el.nativeElement.querySelector('#ddl_Product');
     //const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (this.selectedOperatorId) this.selectedOperatorId = 'ALL';
    if (txt_FranchiseID) txt_FranchiseID.value = '';
    if (this.selectedProduct) this.selectedProduct = 'All';
    if (this.selectedExport) this.selectedExport = 'S';
    if (this.selectedLive) this.selectedLive = 'L';
    //if (this.selectedExport) this.selectedExport = 'S';
    //if (this.rhb_Live) this.rhb_Live = 'L';
    this.PortIn = [];
    this.showPagination = false;
    const table = this.el.nativeElement.querySelector('#table');
    if (table) table.style.display = 'none';
  }
  export(res: any, file: any) {
    this.GridData = res;
    this.excelService.exportToFile(
      this.GridData, 'Port In Report', {
      mobile: 'Mobile #',
      address: 'Address',
      name: 'Name',
      city: 'City',
      email: 'Email',
      otel: 'Other Contact No',
      cnic: 'Cnic',
      newimsi: 'New Imsi',
      oldimsi: 'Old Imsi',
      nprdate: 'NPR Date',
      product: 'Product',
      donor: 'Donor',
      tariff: 'Tariff',
      franchiseid: 'Franchise ID',
      portfee: 'Port Fee',
      handsetfee: 'Handset Fee',
      handsetiemi: 'Handset IMEI',
      associate1: 'Associate 1',
      associate2: 'Associate 2',
      mail: 'Mail',
      userid: 'User ID',
      bvstag: 'BVS Tag',
      npr: 'NPR',
    }, file
    );
  }
}
