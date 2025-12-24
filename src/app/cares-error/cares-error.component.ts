import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cares-error',
  standalone: true,   
  imports: [FormsModule,CommonModule],
  templateUrl: './cares-error.component.html',
  styleUrls: ['./cares-error.component.css']
})
export class CaresErrorComponent {
  // Local storage variables
  loG_ID: string | null = null;
  msisdn: string | null = null;
  imsi: string | null = null;
  custname: string | null = null;
  nic: string | null = null;
  nictype: string | null = null;
  gender: string | null = null;
  packageid: string | null = null;
  accesslevel: string | null = null;
  corpperson: string | null = null;
  vasstr: string | null = null;
  paymentmode: string | null = null;
  waivercode: string | null = null;
  waiveramount: string | null = null;
  extradeposit: string | null = null;
  advancebill: string | null = null;
  chequenumber: string | null = null;
  chequedate: string | null = null;
  bankname: string | null = null;
  modeotherdesc: string | null = null;
  specialnumamount: string | null = null;
  vasamount: string | null = null;
  creditamount: string | null = null;
  discountamount: string | null = null;
  provtax: string | null = null;
  portingcharges: string | null = null;
  totalpaid: string | null = null;
  franchisE_CODE: string | null = null;
  err_MSG: string | null = null;
  activity_NO: string | null = null;
  operatorID: string | null = null;
  Mnp: string | null = null;
  PortIn: string | null = null;
  popupMessage: string = '';
  showSuccessPopup: boolean = false; 
  errmessage: string = ""; // Control visibility of popup
  loginUser: string = '';
  isErrorPopup: boolean = false;
  
  constructor(private http: HttpClient) { }

  @Input() portin!: string;
  @Output() closePopup = new EventEmitter<void>();
  caresError = {
    msisdn: '',
    imsi: '',
    custname: '',
    nic: '',
    nictype: '',
    gender: '',
    packageid: '',
    accesslevel: '',
    corpperson: '',
    vasstr: '',
    paymentmode: '',
    waivercode: '',
    waiveramount: '',
    extradeposit: '',
    advancebill: '',
    chequenumber: '',
    chequedate: '',   // format yyyy-MM-dd
    bankname: '',
    modeotherdesc: '',
    specialnumamount: '',
    vasamount: '',
    creditamount: '',
    discountamount: '',
    provtax: '',
    portingcharges: '',
    totalpaid: '',
    franchisE_CODE: '',
    activityno: '',
    action: '',
    perrorcode: '',
    userid: this.loginUser,
    operatorID: '',
    Mnp: ''    
  };
  ngOnInit(): void {
    this.loadFromLocalStorage();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';

  }

  loadFromLocalStorage(): void {
    this.loG_ID = localStorage.getItem('loG_ID');
    this.msisdn = localStorage.getItem('msisdn');
    this.imsi = localStorage.getItem('imsi');
    this.custname = localStorage.getItem('custname');
    this.nic = localStorage.getItem('nic');
    this.nictype = localStorage.getItem('nictype');
    this.gender = localStorage.getItem('gender');
    this.packageid = localStorage.getItem('packageid');
    this.accesslevel = localStorage.getItem('accesslevel');
    this.corpperson = localStorage.getItem('corpperson');
    this.vasstr = localStorage.getItem('vasstr');
    this.paymentmode = localStorage.getItem('paymentmode');
    this.waivercode = localStorage.getItem('waivercode');
    this.waiveramount = localStorage.getItem('waiveramount');
    this.extradeposit = localStorage.getItem('extradeposit');
    this.advancebill = localStorage.getItem('advancebill');
    this.chequenumber = localStorage.getItem('chequenumber');
    this.chequedate = localStorage.getItem('chequedate');
    this.bankname = localStorage.getItem('bankname');
    this.modeotherdesc = localStorage.getItem('modeotherdesc');
    this.specialnumamount = localStorage.getItem('specialnumamount');
    this.vasamount = localStorage.getItem('vasamount');
    this.creditamount = localStorage.getItem('creditamount');
    this.discountamount = localStorage.getItem('discountamount');
    this.provtax = localStorage.getItem('provtax');
    this.portingcharges = localStorage.getItem('portingcharges');
    this.totalpaid = localStorage.getItem('totalpaid');
    this.franchisE_CODE = localStorage.getItem('franchisE_CODE');
    this.err_MSG = localStorage.getItem('err_MSG');
    this.activity_NO = localStorage.getItem('Activity');
    this.operatorID = localStorage.getItem('operatorID');
    this.PortIn = localStorage.getItem('PortIn');    
    this.Mnp = localStorage.getItem('selectedMnp');    

  }
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  submitbutton() {
    debugger
          
    const insertUrl = `${environment.apiBaseUrl}/api/CaresSubmissionFirst`;
    

    // 🔹 Local storage / input values ko caresError object me map karo
    this.caresError = {
      msisdn: this.msisdn ?? '',
      imsi: this.imsi ?? '',
      custname: this.custname ?? '',
      nic: this.nic ?? '',
      nictype: this.nictype ?? '',
      gender: this.gender ?? '',
      packageid: this.packageid ?? '',
      accesslevel: this.accesslevel ?? '',
      corpperson: this.corpperson ?? '',
      vasstr: this.vasstr ?? '',
      paymentmode: this.paymentmode ?? '',
      waivercode: this.waivercode ?? '',
      waiveramount: this.waiveramount ?? '',
      extradeposit: this.extradeposit ?? '',
      advancebill: this.advancebill ?? '',
      chequenumber: this.chequenumber ?? '',
      chequedate: this.formatDate(this.chequedate) || new Date().toISOString().split('T')[0],
      bankname: this.bankname ?? '',
      modeotherdesc: this.modeotherdesc ?? '',
      specialnumamount: this.specialnumamount ?? '',
      vasamount: this.vasamount ?? '',
      creditamount: this.creditamount ?? '',
      discountamount: this.discountamount ?? '',
      provtax: this.provtax ?? '',
      portingcharges: this.portingcharges ?? '',
      totalpaid: this.totalpaid ?? '',
      franchisE_CODE: this.franchisE_CODE ?? '',
      action: '',
      perrorcode: this.err_MSG ?? '',
      userid: this.loginUser,      
      operatorID: this.operatorID ?? '',      
      activityno: this.activity_NO ?? '',
      Mnp: this.Mnp ?? ''
    };

    this.http.post(insertUrl, this.caresError).subscribe({
      next: (res: any) => {
        debugger;
        const ab = JSON.stringify(res);
        const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
        this.popupMessage = msgR;
        this.isErrorPopup = false;
        this.showSuccessPopup = true;
       this.close();
      },
      error: (err) => {
        console.error('🚨 API Error:', err);
        alert('Internal server error. Please check backend logs.');
      }
    });
  }
  private formatDate(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null; // invalid date
    return date.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  close() {
    this.closePopup.emit();
  }
}
