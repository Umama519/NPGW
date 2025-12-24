import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-npr-invoice',
  standalone: true,  
  imports: [CommonModule],
  templateUrl: './npr-invoice.component.html',
  styleUrl: './npr-invoice.component.css'
})
export class NPRINVOICEComponent {
  nprNo: string = '';
  invoiceData: any = {};
  model: any = {}; 
  loading: boolean = false;
  errorMsg: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    
    this.nprNo = this.route.snapshot.queryParamMap.get('nprNo') || '';
    if (this.nprNo) {
      this.loadInvoiceData(this.nprNo);
    }
  }

  loadInvoiceData(nprNo: string) {
    
    this.http.get(`${environment.apiBaseUrl}/api/NprDetailInvoice/getInvoice?npr=${nprNo}`).subscribe({
      next: (data: any) => {
    //  console.log('API Response:', data);
        this.loading = false;
        this.mapResponseToModel(data);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Error fetching invoice data.';
     //   console.error(err);
      }
    });
  }

  mapResponseToModel(data: any) {
  if (!data || !data.length) {
    this.errorMsg = 'No record found for this NPR number.';
    return;
  }

  const record = data[0];

  // Safe conversion helper
  const safe = (val: any) => {
    if (val == null || val === '' || val === undefined) return 0;
    if (typeof val === 'object') {
      if (Object.keys(val).length === 0) return '';
      return JSON.stringify(val);
    }
    return val;
  };

  // Convert safely to numbers
  const num = (val: any) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  let total = 0;
  let calTotal = 0;

  // --- Basic Info ---
  this.model.lblinvoiceNo = safe(record.INVOICE);
  this.model.lblONO = safe(record.OOPERATOR);
  this.model.lblDNO = safe(record.DOPERATOR);
  this.model.lblMobile = safe(record.MOB_NO);
  this.model.lblOLDICCID = safe(record.OICCID);
  this.model.lblBaseLoc = safe(record.CITY);
  this.model.lblCurrentProduct = safe(record.PRODUCT);

  // --- Personal Info ---
  this.model.lblRegisterName = safe(record.REGNAM);
  this.model.lblNIC = safe(record.OLDNIC);
  this.model.lblUserName = safe(record.USERID);
  this.model.lblCNIC = safe(record.NEWNIC);
  this.model.lblEmail = safe(record.EMAIL);
  this.model.lblPassport = safe(record.PASSP_NO);
  this.model.lblAddres1 = safe(record.ADDR1);
  this.model.lblAddres2 = safe(record.ADDR2);
  this.model.lblAddres3 = safe(record.ADDR3);
  this.model.lblAddress4 = safe(record.ADDR4);
  this.model.lblOther = safe(record.OTHERID);
  this.model.lblTelres = safe(record.RTEL);
  this.model.lblTeloff = safe(record.OTEL);
  this.model.lblFax = safe(record.FAX);

  // --- Product Info ---
  this.model.lblBaseLocationNew = safe(record.CITY);
  this.model.lblNewProductType = safe(record.NPROD);
  this.model.lblNewICCID = safe(record.ICCID);
  this.model.lblLActionDescription = safe(record.TARIFF);
  this.model.LblFranchisee = safe(record.MST_ID);
  this.model.lblTariff = safe(record.TARIFF);
  this.model.lblAssociate1 = safe(record.ASSOCIATE_1);
  this.model.lblAccessID = safe(record.AXESID);
  this.model.lblAssociated2 = safe(record.ASSOCIATE_2);
  this.model.LblWavierCode = safe(record.WAIVERCD);

  // --- Port-In Charges ---
  this.model.lblportinfee = safe(record.PORTINFEE);
  this.model.lblWPIF = safe(record.WAVEINPORTFEE);
  this.model.lblPIFAmount = num(record.PORTFEEAMOUNT);

  // --- Handset / Waiver Info ---
  this.model.lblHSCharges = num(record.HANDSETFEE);
  this.model.lblWHS = num(record.WAVEINSECURITY);
  this.model.lblHSAmount = num(record.HANDSETFEE);

  this.model.lblSecurityDeposit = num(record.SECURITY_DEPOSIT);
  this.model.lblWSD = num(record.WAVEINSECURITY);
  this.model.lblWSDAmount = num(record.SECURITY_DEPOSIT);

  this.model.lblLinerent = num(record.LRENT);
  this.model.lblWLR = num(record.WAVEINLINERENT);
  this.model.lblWLRAmount = num(record.LRENT);

  // --- Normalize product name (trim + lowercase) ---
  const productName = (record.PRODUCT || '').toString().trim().toLowerCase();

  // --- Postpaid Product Calculations ---
  if (productName === 'postpaid') {
    const linerent = num(record.LRENT);
    const wlinerent = num(record.WAVEINLINERENT);
    const security = num(record.SECURITY_DEPOSIT);
    const wsecurity = num(record.WAVEINSECURITY);

    // Line Rent
    calTotal = linerent - wlinerent;
    total += calTotal;
    this.model.lblWLRAmount = calTotal;

    // Security Deposit
    calTotal = security - wsecurity;
    total += calTotal;
    this.model.lblWSDAmount = calTotal;
  } else {
    // Clear postpaid-only fields
    this.model.lblWSD = '';
    this.model.lblWLR = '';
    this.model.lblWLRAmount = '';
    this.model.lblWSDAmount = '';
    this.model.lblSecurityDeposit = '';
    this.model.lblLinerent = '';
  }

  // --- Port Fee ---
  total += num(record.PORTFEEAMOUNT);
  this.model.lblPIFAmount = num(record.PORTFEEAMOUNT);

  // --- Handset Fee ---
  const handsetFee = num(record.HANDSETFEE);
  if (handsetFee > 0) {
    this.model.lblHSCharges = handsetFee;
    this.model.lblHSAmount = handsetFee;
    total += handsetFee;
  }

  // --- Total ---
  this.model.lblTotalAmount = total;
}



  printPage(): void {
    window.print();
  }
}


