import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExcelExportService } from 'app/services/excel-export.service';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export interface UserAction {
  userid: string;
  accept: string;
  reject: string;
  hold: string;
  npr: string;
  npcancel: string;
  total: string;
}

declare var $: any;

@Component({
  selector: 'app-public-useraction-rpt-aspx',
<<<<<<< HEAD
  standalone: true,
=======
>>>>>>> df6adcae315ddb201abfceb949d6603edc257f9e
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './user-action-report.component.html',
  styleUrl: './user-action-report.component.css'
})
export class UserActionReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false;
  UserAction: UserAction[] = [];
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
    const tab = this.el.nativeElement.querySelector('#table');
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

  Fetch() {
    debugger;
    const txt_FromDate = this.el.nativeElement.querySelector('#txt_FromDate').value;
    const txt_ToDate = this.el.nativeElement.querySelector('#txt_ToDate').value;
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';    
    const rhb_Screen = this.selectedExport;

    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/UserActionReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&userid=${this.loginUser}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
            if (rhb_Screen === 'S') {
              this.UserAction = res;
            } else {
              setTimeout(() => {
                this.export(res, 'excel');
                this.UserAction = [];
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
              this.UserAction = [];
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
    if (this.selectedExport) this.selectedExport = 'S';
    this.UserAction = [];
  }
  export(res:any, file:any) {
      this.GridData = res;
      this.excelService.exportToFile( 
        this.GridData, 'User Action Report', {
          userid: 'User ID',
          accept: 'NPR Accept',
          reject: 'NPR Reject',
          hold: 'NPR Hold',
          npr: 'NPR',
          npcancel: 'NPR Cancel',
          total: 'Total'
        }, file
      );
    }
}
