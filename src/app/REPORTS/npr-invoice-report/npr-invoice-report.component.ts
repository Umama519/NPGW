import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';

export interface NPRInvoice {
  mobile: string;
  action: string;
  nprno: string;
  aact: string;
  nprdate: string;
  loc: string;
  regname: string;
  nprtype: string;
  ooperator: string;
  doperator: string;
  iccid: string;
  oiccid: string;
  oldnic: string;
  newnic: string;
  tid: string;
  passport: string;
  email: string;
  addr1: string;
  addr2: string;
  addr3: string;
  addr4: string;
  ext: string;
  rtel: string;
  otel: string;
  cprod: string;
  postpaid: string;
  fax: string;
  secuirtydeposit: string;
  nprod: string;
  portinfee: string;
  associate1: string;
  tariff: string;
  axesid: string;
  associate2: string;
  lrent: string;
  sms: string;
  ctr: string;
  vms: string;
  cli: string;
  caw: string;
  mstid: string;
  user: string;
  city: string;
  invoice: string;
  tstatus: string;
  tremarks: string;
  userid: string;
  tdate: string;
  waveinline: string;
  waveinsecurity: string;
  waveinport: string;
  portfee: string;
}

declare var $: any;

@Component({
  selector: 'app-forms-nprinvoicesearch1-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './npr-invoice-report.component.html',
  styleUrl: './npr-invoice-report.component.css'
})
export class NprInvoiceReportComponent {
  constructor(private http: HttpClient, private el: ElementRef, private excelService: ExcelExportService) { }
    Daily: NPRInvoice[] = [];
    filteredData: any[] = [];
    GridData: any[] = [];
    defaultUserID: string = '';
    showSuccessPopup: boolean = false;
    isSubmitting: boolean = false;
    isErrorPopup: boolean = false;
    popupMessage: string = '';
    ////LABELS////
    lblMobile: any;
    lblONO: any;
    lblBaseLocation: any;
    lblDNO: any;
    lblProduct: any;
    lblOldImsi: any;
    lblAddres1: any;
    lblAddres2: any;
    lblAddres3: any;
    lblAddres4: any;
    lblRegname: any;
    lblTellRes: any;
    lblUserName: any;
    lblTellOff: any;
    lblEmail: any;
    lblExt: any;
    lblSelectID: any;
    lblFax: any;
    lblCnic: any;
    lblCity: any;
    lblBaseLocation1: any;
    lblNewProduct: any;
    lblAssociate1: any;
    lblAssociate2: any;
    lblNewImsi: any;
    lblTariff: any;
    lblFranchise: any;
    lblAccess: any;
    lblHandSet: any;
    lblCSR: any;
    lblPortFee: any;
    lblWPIF: any;
    lblPIFAmount: any;
    lblSecurityDeposit: any;
    lblWSD: any;
    lblWSDAmount: any;
    lblLinerent: any;
    lblWLR: any;
    lblWLRAmount: any;
    lblTotalAmount: any;
    CalTotal: number = 0;
    Total: number = 0;
    loginUser: string = '';
    
    ngOnInit(): void {
      const tab = this.el.nativeElement.querySelector('#table');
      this.loginUser = localStorage.getItem('loginUser') || 'No user';
    }
    Fetch() {
      debugger;
      const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile').value;
      if (!txt_Mobile) {
        this.showSuccessPopup = false;
        setTimeout(() => {
          this.popupMessage = !txt_Mobile ? 'Please Enter Mobile' : '';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
        return;
        }, 100);
        return;
      }
      if (txt_Mobile.length < 10 || txt_Mobile.length > 11 || !/^\d+$/.test(txt_Mobile)) {
        this.showSuccessPopup = false;
        setTimeout(() => {
          this.popupMessage = txt_Mobile ? 'Please Enter Valid Mobile' : '';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
        return;
        }, 100);
        return;
      }
      const action = 'SEARCH_MOBILE';
      const table = this.el.nativeElement.querySelector('#table');
  
      const url = `${environment.apiBaseUrl}/api/NPRInvoiceReport?mobile=${txt_Mobile}&action=${action}&userid=${this.loginUser}`;
      
      this.http.get<any>(url).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
              this.Daily = res;
              this.lblMobile = res[0].mobile;
              this.lblONO = res[0].ooperator;
              this.lblBaseLocation = res[0].loc;
              this.lblDNO = res[0].doperator;
              this.lblProduct = res[0].postpaid;
              this.lblOldImsi = res[0].oiccid;
              this.lblAddres1 = res[0].addr1;
              this.lblAddres2 = res[0].addr2;
              this.lblAddres3 = res[0].addr3;
              this.lblAddres4 = res[0].addr4;
              this.lblRegname = res[0].regname;
              this.lblTellRes = res[0].rtel;
              this.lblUserName = res[0].user;
              this.lblTellOff = res[0].otel;
              this.lblEmail = res[0].email;
              this.lblExt = res[0].ext;
              this.lblSelectID = res[0].addr4;
              this.lblFax = res[0].fax;
              this.lblCnic = res[0].newnic;
              this.lblCity = res[0].city;
              this.lblNewProduct = res[0].nprod;
              this.lblAssociate1 = res[0].associate1;
              this.lblAssociate2 = res[0].associate2;
              this.lblNewImsi = res[0].iccid;
              this.lblTariff = res[0].tariff;
              this.lblFranchise = res[0].mstid;
              this.lblAccess = res[0].axesid;
              this.lblPortFee = res[0].portinfee;
              this.lblWPIF = res[0].waveinport;
              this.lblPIFAmount = res[0].portfee;
              this.lblSecurityDeposit = res[0].secuirtydeposit;
              this.lblWSD = res[0].waveinsecurity;
              this.lblLinerent = res[0].lrent;
              this.lblWLR = res[0].waveinline;
              debugger;
              this.Total = 0;
              if (this.lblWLR !== '0' && this.lblWLR !== '' && this.lblWLR != null) {
                this.CalTotal = this.lblLinerent - this.lblWLR;
              }
              this.Total = this.Total + this.CalTotal;
              this.lblWLRAmount = this.Total;
              this.Total = 0;
              if (this.lblWSD !== '0' && this.lblWSD !== '' && this.lblWSD != null) {
                this.CalTotal = this.lblSecurityDeposit - this.lblWSD;
              }
              this.Total = this.Total + this.CalTotal;
              this.lblWSDAmount = this.Total;             
              this.Total = 0;
              this.Total = this.lblPortFee;
              this.lblTotalAmount = this.Total;
              this.Total = 0;

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
      const txt_Mobile = this.el.nativeElement.querySelector('#txt_Mobile');  
      this.lblMobile = '';
      this.lblONO = '';
      this.lblBaseLocation = '';
      this.lblDNO = '';
      this.lblProduct = '';
      this.lblOldImsi = '';
      this.lblAddres1 = '';
      this.lblAddres2 = '';
      this.lblAddres3 = '';
      this.lblAddres4 = '';
      this.lblRegname = '';
      this.lblTellRes = '';
      this.lblUserName = '';
      this.lblTellOff = '';
      this.lblEmail = '';
      this.lblExt = '';
      this.lblSelectID = '';
      this.lblFax = '';
      this.lblCnic = '';
      this.lblCity = '';
      this.lblBaseLocation1 = '';
      this.lblNewProduct = '';
      this.lblAssociate1 = '';
      this.lblAssociate2 = '';
      this.lblNewImsi = '';
      this.lblTariff = '';
      this.lblFranchise = '';
      this.lblAccess = '';
      this.lblHandSet = '';
      this.lblCSR = '';
      this.lblPortFee = '';
      this.lblWPIF = '';
      this.lblPIFAmount = '';
      this.lblSecurityDeposit = '';
      this.lblWSD = '';
      this.lblWSDAmount = '';
      this.lblLinerent = '';
      this.lblWLR = '';
      this.lblWLRAmount = '';
      this.lblTotalAmount = '';
      
      if (txt_Mobile) txt_Mobile.value = '';
      this.Daily = [];
    }
    Print(): void {
      window.print();
    }
  }