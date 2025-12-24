import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-public-pinpot-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './pinpotview.component.html',
  styleUrl: './pinpotview.component.css'
})
export class PINPOTVIEWComponent {
  //MNP PIN POT
  selectedMobile: string | null = null;
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
  //Activity Information
  selectedPINLstAct: string = '';
  selectedPINPortID: string = '';
  selectedPINDesc: string = '';
  selectedPINRecipient: string = '';
  selectedPINDonor: string = '';
  selectedPINJobDoneBy: string = '';
  selectedPINRejDesc: string = '';
  selectedPINLstDt: string = '';

  //BS Customer Informartion
  selectedBSRegName: string = '';
  selectedBSUserName: string = '';
  selectedBSCnic: string = '';
  selectedBSNic: string = '';
  selectedBSPassport: string = '';
  selectedBSOtherID: string = '';
  selectedBSAccTyp: string = '';
  selectedBSTarifPln: string = '';
  selectedBSAccLvl: string = '';
  selectedBSServiceSts: string = '';
  selectedBSBarTemp: string = '';
  selectedBSSecDep: string = '';
  selectedBSLineRt: string = '';
  selectedBSPassDue: string = '';
  selectedBSCurrBilling: string = '';
  selectedBSUnbill: string = '';
  selectedBSTotalDue: string = '';
  selectedBSCreditLmt: string = '';
  selectedBSUsage: string = '';
  selectedBSICCID: string = '';
  selectedBSSimSts: string = '';
  loginUser: string = '';
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  constructor(private http: HttpClient, private el: ElementRef) { }

  ngOnInit(): void {
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }
  Fetch() {
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    const txt_MOB = this.el.nativeElement.querySelector('#txt_Mobile')?.value?.trim() || '';
    const loader = document.getElementById('loader');

    if (!txt_MOB) {
      this.showSuccessPopup = false;

      setTimeout(() => {
        this.popupMessage = 'Please Enter Mobile';   // 🔹 message set
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);

      return;
    }
    if (loader) loader.style.display = 'block';

    let recordFound = false;

    // --- URLs ---
    const url1 = `${environment.apiBaseUrl}/api/PINPOTVIEW/view1/${txt_MOB}/${this.loginUser}`;
    const url2 = `${environment.apiBaseUrl}/api/PINPOTVIEW/view2/${txt_MOB}`;
    const url3 = `${environment.apiBaseUrl}/api/PINPOTVIEW/view3/${txt_MOB}`;

    // --- Call all three APIs in parallel ---
    Promise.allSettled([
      this.http.get<any>(url1).toPromise(),
      this.http.get<any>(url2).toPromise(),
      this.http.get<any>(url3).toPromise()
    ]).then((results) => {
      // ✅ 1️⃣ View1 Result (Customer Info)
      const res1 = results[0];
      if (res1.status === 'fulfilled' && res1.value?.length > 0) {
        recordFound = true;
        const d1 = res1.value[0];
        this.selectedBSRegName = d1.custname || '';
        this.selectedBSUserName = d1.username || '';
        this.selectedBSCnic = d1.nic || '';
        this.selectedBSNic = d1.nic || '';
        this.selectedBSICCID = d1.imsi || '';
        this.selectedBSAccTyp = d1.connectiontype || '';
        this.selectedBSTarifPln = d1.package1 || '';
        this.selectedBSUsage = d1.usageval || '';
        this.selectedBSAccLvl = d1.accesslevel || '';
        this.selectedBSUnbill = d1.unbilled || '';
        this.selectedBSSecDep = d1.security || '';
        this.selectedBSLineRt = d1.linerent || '';
        this.selectedBSTotalDue = d1.totaldue || '';
        this.selectedBSServiceSts = d1.status || '';
        this.selectedBSTarifPln = d1.packagE1 || '';
        this.selectedBSBarTemp = d1.baR_STATUS || '';
        this.selectedBSVas = d1.vas || '';
      }

      // ✅ 2️⃣ View2 Result (Billing / Financial Info)
      const res2 = results[1];
      if (res2.status === 'fulfilled' && res2.value?.length > 0) {
        recordFound = true;
        const d2 = res2.value[0];
        this.selectedPINRegName = d2.registeR_NAME || '';
        this.selectedPINUserName = d2.useR_NAME || '';
        this.selectedPINCnic = d2.cnic || '';
        this.selectedPINICCID = d2.iccid || '';
        this.selectedPINAccTyp = d2.accouT_TYPE || '';
        this.selectedPINTarifPln = d2.tarifF_PLAN || '';
        this.selectedPINAccLvl = d2.accesS_LEVEL || '';
        this.selectedPINSecDep = d2.securitY_DEPOSIT || '';
        this.selectedPINLineRt = d2.linE_RENT || '';
        this.selectedPINCurrSts = d2.currentstatus || '';
        this.selectedPINMsgTime = d2.actiondate || '';
        this.selectedPINRefundAmt = d2.refundamount || '';
        this.selectedPINRefundDt = d2.refunddate || '';
        this.selectedPINDueDt = d2.duE_DATE || '';
      }

      // ✅ 3️⃣ View3 Result (PIN/POT Info)
      const res3 = results[2];
      if (res3.status === 'fulfilled' && res3.value?.length > 0) {
        recordFound = true;
        const d3 = res3.value[0];
        this.selectedPINLstAct = d3.lasT_ACTIVITY || '';
        this.selectedPINPortID = d3.portid || '';
        this.selectedPINDesc = d3.description || '';
        this.selectedPINRejDesc = d3.actioN_DESCRIPTION || '';
        this.selectedPINLstDt = d3.lastactiondate || '';
        this.selectedPINRecipient = d3.recipient || '';
        this.selectedPINDonor = d3.donor || '';
        this.selectedPINJobDoneBy = d3.joB_DONE_BY || '';
      }

      // ✅ No record found case
      if (!recordFound) {
        //this.showNoRecordsPopup();
      }

      if (loader) loader.style.display = 'none';
    }).catch((err) => {
      console.error('Error in fetching data:', err);
      // if (!recordFound) this.showNoRecordsPopup();
      if (loader) loader.style.display = 'none';
    });
  }


  ResetButton() {
    debugger
    Object.keys(this).forEach(key => {
      if (key.startsWith('selectedPIN') || key.startsWith('selectedBS')) {
        (this as any)[key] = '';
      }
    });
    this.selectedMobile = ''; // empty string  
  }
}