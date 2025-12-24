import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

export class WorkFlow {
  mob_no: string;
  regnam : string;
  username : string;
  newnic : string;
  rtel : string;
  otel : string;
  ext : string;
  fax : string;
  iccid : string;
  nprod : string;
  dscrip : string;
  dscr : string;
  securitY_DEPOSIT : string;
  lrent : string;
  userid : string
  uname : string;
  msT_ID : string
  oldnic : string;
  passp_No : string;
  otherid : string;
  nprdt : string;
  closedt : string;
  refndt: string;
  refndamt: string;
  currentStatus : string;
  actionDate : string;
  assignTO : string;
  due_date : string;

  constructor() {
    this.mob_no = '';
    this.regnam = '';
    this.username = '';
    this.newnic = '';
    this.rtel = '';
    this.otel = '';
    this.ext = '';
    this.fax = '';
    this.iccid = '';
    this.nprod = '';
    this.dscrip = '';
    this.dscr = '';
    this.securitY_DEPOSIT = '';
    this.lrent = '';
    this.userid = '';
    this.uname = '';
    this.msT_ID = '';
    this.oldnic = '';
    this.passp_No = '';
    this.otherid = '';
    this.nprdt = '';
    this.closedt = '';
    this.refndt = '';
    this.refndamt = '';
    this.currentStatus = '';
    this.actionDate = '';
    this.assignTO = '';
    this.due_date = '';
  }
}

@Component({
  selector: 'app-public-nprclosingprocess-aspx',
  standalone: true,  
  imports: [CommonModule, FormsModule],
  templateUrl: './nprclosingprocess.component.html',
  styleUrl: './nprclosingprocess.component.css'
})
export class NPRCLOSINGPROCESSComponent {

  isClose: boolean = false;
  isUnClose: boolean = false;
  //MNP PIN POT
  selectedPINRegName: string = '';
  selectedPINUserName: string = '';
  selectedPINCnic: string = '';
  selectedPINNic: string = '';
  selectedPINPassport: string = '';
  selectedPINOtherID: string = '';
  selectedPINICCID: string = '';
  selectedPINAccTyp: string = '';
  selectedPINTarifPln: string = '';
  selectedPINAccLvl: string = '';
  selectedPINSecDep: string = '';
  selectedPINLineRt: string = '';
  selectedPINRefundAmt: string = '';
  selectedPINRefundDt: string = '';
  selectedPINUserID: string = '';
  selectedPINUsername: string = '';
  selectedPINNPRInt: string = '';
  selectedPINNPRGenDt: string = '';
  selectedPINCurrSts: string = '';
  selectedPINMsgTime: string = '';
  selectedPINAssignTo: string = '';
  selectedBSVas: string = '';
  selectedPINDueDt: string = '';
  selectedPINCloseDt: string = '';
  //Activity Information
  selectedPINLstAct: string = '';
  selectedPINPortID: string = '';
  selectedPINDesc: string = '';
  selectedPINRecipient: string = '';
  selectedPINDonor: string = '';
  selectedPINJobDoneBy: string = '';
  //BS Customer Informartion

  loginUser: string = '';
  showSuccessPopup: boolean = false; 
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  constructor(private http : HttpClient, private el : ElementRef, private route : Router){} 
   ngOnInit(): void {   
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.isClose = true;
    this.isUnClose = true;
  }
  GridData: any[] = [];
  
  Fetch() {
  const txt_MOB = this.el.nativeElement.querySelector('#txt_Mobile').value;
  if (!txt_MOB) {
    this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage = "Please Enter Mobile Number";
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
    return;
  }
  const url = `${environment.apiBaseUrl}/api/NPRClosingProcess/${txt_MOB}`;
  this.http.get<any>(url).subscribe({
    next: (data1) => {
      if (data1 && data1.length > 0) {
        const data = data1[0];
        this.GridData = data1;
        if (data.closedt) {
          this.isClose = true;
          this.isUnClose = false;
        } else if (!data.closedt) {
          this.isClose = false;
          this.isUnClose = true;
        } 
        this.selectedPINRegName = data.regnam || '';
        this.selectedPINUserName = data.username || '';
        this.selectedPINCnic = data.newnic || '';
        this.selectedPINNic = data.oldnic || '';
        this.selectedPINPassport = data.passp_No || '';
        this.selectedPINOtherID = data.otherid || '';
        this.selectedPINICCID = data.iccid || '';
        this.selectedPINAccTyp = data.nprod || '';
        this.selectedPINTarifPln = data.DSCRIP || '';
        this.selectedPINAccLvl = data.DSCR || '';
        this.selectedPINSecDep = data.securitY_DEPOSIT || '';
        this.selectedPINLineRt = data.LRENT || '';
        this.selectedPINRefundAmt = data.refndamt || '';
        this.selectedPINRefundDt = data.refndt || '';
        this.selectedPINUserID = data.userid || '';
        this.selectedPINUsername = data.uname || '';
        this.selectedPINNPRInt = data.msT_ID || '';
        this.selectedPINNPRGenDt = data.nprdt || '';
        this.selectedPINCurrSts = data.currentStatus || '';
        this.selectedPINMsgTime = data.pinMsgTime || '';
        this.selectedPINAssignTo = data.assignTO || '';
        this.selectedPINDueDt = data.due_date || '';
        this.selectedPINCloseDt = data.closedt || '';
      }
      else {        
        this.popupMessage = "No data found";
        this.isErrorPopup = true; 
        this.showSuccessPopup = true;
      }
    },
    error: (err) => console.error('Error fetching Customer Info data:', err)
  });
}
Fetch1() {
  const txt_MOB = this.el.nativeElement.querySelector('#txt_Mobile').value;
  if (!txt_MOB) {
    this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage = "Please Enter Mobile Number";
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
    return;
  }
  const url = `${environment.apiBaseUrl}/api/NPRClosingProcess/${txt_MOB}`;
  this.http.get<any>(url).subscribe({
    next: (data1) => {
      if (data1 && data1.length > 0) {
        const data = data1[0];
        this.selectedPINRegName = data.regnam || '';
        this.selectedPINUserName = data.username || '';
        this.selectedPINCnic = data.newnic || '';
        this.selectedPINNic = data.oldnic || '';
        this.selectedPINPassport = data.passp_No || '';
        this.selectedPINOtherID = data.otherid || '';
        this.selectedPINICCID = data.iccid || '';
        this.selectedPINAccTyp = data.nprod || '';
        this.selectedPINTarifPln = data.DSCRIP || '';
        this.selectedPINAccLvl = data.DSCR || '';
        this.selectedPINSecDep = data.securitY_DEPOSIT || '';
        this.selectedPINLineRt = data.LRENT || '';
        this.selectedPINRefundAmt = data.refndamt || '';
        this.selectedPINRefundDt = data.refndt || '';
        this.selectedPINUserID = data.userid || '';
        this.selectedPINUsername = data.uname || '';
        this.selectedPINNPRInt = data.msT_ID || '';
        this.selectedPINNPRGenDt = data.nprdt || '';
        this.selectedPINCurrSts = data.currentStatus || '';
        this.selectedPINMsgTime = data.pinMsgTime || '';
        this.selectedPINAssignTo = data.assignTO || '';
        this.selectedPINDueDt = data.due_date || '';
        this.selectedPINCloseDt = data.closedt || '';
      }
      else {        
        this.popupMessage = 'No data found for Customer Info.';
        this.isErrorPopup = true; 
      }
    },
    error: (err) => console.error('Error fetching Customer Info data:', err)
  });
  }

  ResetButton() {    
    
    this.route.navigate(['/app-home']);
  }

  WorkFlow: WorkFlow = new WorkFlow();
  CloseButton() {
  

  // Reset popup states before making API call
  this.showSuccessPopup = false;
  this.isErrorPopup = false;
  // this.isClose = false;
  // this.isUnClose = false;
  this.popupMessage = '';

  const txt_MOB = this.el.nativeElement.querySelector('#txt_Mobile').value;
  const url = `${environment.apiBaseUrl}/api/NPRClosingProcess/Close/${txt_MOB}`;

  setTimeout(() => {
    this.http.put(url, this.WorkFlow)
      .subscribe({
        next: (res: any) => {
          const msg = res.message || JSON.stringify(res);
          let msgR = "";

          if (msg.startsWith("1")) {
            // Error case
            msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = false;
          } else if (msg.startsWith("0")) {
            // Success case
            msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = true;
          } else {
            // Unknown response
            msgR = "Unexpected response format!";
            this.isErrorPopup = true;
          }
          this.popupMessage = msgR;
          this.showSuccessPopup = true; 
          this.Fetch1();         
          this.isClose = true;
          this.isUnClose = true;

          // Optional: Auto-hide popup after few seconds
          setTimeout(() => {
            this.showSuccessPopup = false;
          }, 3000);
        },
        error: (err) => {
          console.error('Error during update:', err);
          this.popupMessage = 'Failed to update the record. Please try again.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
          this.isClose = false;
          this.isUnClose = true;

          setTimeout(() => {
            this.showSuccessPopup = false;
          }, 3000);
        }
      });
  }, 500);
}
 UnCloseButton() {
  

  // Reset popup states before making API call
  this.showSuccessPopup = false;
  this.isErrorPopup = false;
  // this.isClose = false;
  // this.isUnClose = false;
  this.popupMessage = '';

  const txt_MOB = this.el.nativeElement.querySelector('#txt_Mobile').value;
  const url = `${environment.apiBaseUrl}/api/NPRClosingProcess/UnClose/${txt_MOB}`;

  setTimeout(() => {
    this.http.put(url, this.WorkFlow)
      .subscribe({
        next: (res: any) => {
          const msg = res.message || JSON.stringify(res);
          let msgR = "";

          if (msg.startsWith("1")) {
            // Error case
            msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = false;
          } else if (msg.startsWith("0")) {
            // Success case
            msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = true;
          } else {
            // Unknown response
            msgR = "Unexpected response format!";
            this.isErrorPopup = true;
          }

          this.popupMessage = msgR;
          this.showSuccessPopup = true;
          this.Fetch1();
          this.isClose = true;
          this.isUnClose = true;
          // Optional: Auto-hide popup after few seconds
          setTimeout(() => {
            this.showSuccessPopup = false;
          }, 3000);
        },
        error: (err) => {
          console.error('Error during update:', err);
          this.popupMessage = 'Failed to update the record. Please try again.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
          this.isClose = false;
          this.isUnClose = true;

          setTimeout(() => {
            this.showSuccessPopup = false;
          }, 3000);
        }
      });
  }, 500);
}
}