import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

export interface LSMSHeader {
  SWT_NO: string;
  MSGTY: string;
  RESP: string;
  WFN: string;
  FOLLOWUP_NO: string;
  RECDT: string;
  SNDDT: string;
  PULLDT: string;
  ACTIVITY_NO: string;
  REJCD: string;
  STATUS: string;
}

export interface LSMSDetail {
  ObjectName: string;
  ObjValue: string;
}

@Component({
  selector: 'app-PasswordChangeAlert',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './PasswordChangeAlert.component.html',
  styleUrl: './PasswordChangeAlert.component.css'
})
export class PasswordChangeAlertComponent {
  lbl_alert: string = "";
  showNo: boolean = true;
  constructor(private router: Router, private http: HttpClient) { }

  selectedRejcd: string | null = null;
  selectedSwtNO: string | null = null;
  selectedMsgty: string | null = null;
  selectedResp: string | null = null;
  selectedWfn: string | null = null;
  selectedFollow: string | null = null;
  selectedRecdt: string | null = null;
  selectedSnddt: string | null = null;
  selectedPulldt: string | null = null;
  selectedActNo: string | null = null;
  

  // ✅ Arrays declared properly  
  selectedobjectName: string[] = [];
  selectedobjValue: string[] = [];

  // API data convert into arrays
  loadDetails(data: LSMSDetail[]) {
    debugger
    this.selectedobjectName = data.map(x => x.ObjectName);
    this.selectedobjValue = data.map(x => x.ObjValue);
  }

  ngOnInit(): void {
    debugger
      const alertValue = localStorage.getItem("Alert");
    const expMsg = localStorage.getItem("Exp_msg");

    if (alertValue === "2") {
      this.showNo = false;        // Hide cancel button
      this.lbl_alert = expMsg || "";  // Show Exp_msg
    } else {
      this.showNo = true;         // Show cancel button
      this.lbl_alert = expMsg || ""; // Show Alert text
    }
  }
  //   this.selectedSwtNO =  localStorage.getItem('swT_NO');
  //   this.selectedMsgty = localStorage.getItem('msgty');
  //   this.selectedResp = localStorage.getItem('resp');
  //   this.selectedWfn = localStorage.getItem('wfn');
  //   this.selectedFollow = localStorage.getItem('followuP_NO');
  //   this.selectedRecdt = localStorage.getItem('recdt');
  //   this.selectedSnddt = localStorage.getItem('snddt');
  //   this.selectedPulldt = localStorage.getItem('pulldt');
  //   this.selectedActNo = localStorage.getItem('activitY_NO');
  //   this.selectedRejcd = localStorage.getItem('rejcd');
  //   const objectNameList = localStorage.getItem('objectNameList');
  //   const objValueList = localStorage.getItem('objValueList');
  //   if (objectNameList) {
  //     this.selectedobjectName = JSON.parse(objectNameList);
  //   }
  //   if (objValueList) {
  //     this.selectedobjValue = JSON.parse(objValueList);
  //   }
  // }

 onOkClick() {
    // go to change password page
    this.router.navigateByUrl("app-change-password");
  }

  onNoClick() {
    // go back to login
    this.router.navigateByUrl("app-public-porting-aspx");
  }

}
