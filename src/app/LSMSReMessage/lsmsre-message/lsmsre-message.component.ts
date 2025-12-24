import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

export interface LSMSHeader {
  swtno: string;
  msgty: string;
  resp: string;
  wfn: string;
  followuP_NO: string;
  activitY_NO: string;  
}

export interface LSMSDetail {
  ObjectName: string;
  ObjValue: string;
}

@Component({
  selector: 'app-lsmsre-message',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './lsmsre-message.component.html',
  styleUrl: './lsmsre-message.component.css'
})
export class LSMSReMessageComponent {

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
    
    this.selectedobjectName = data.map(x => x.ObjectName);
    this.selectedobjValue = data.map(x => x.ObjValue);
  }

  ngOnInit(): void {
    debugger;
    this.selectedSwtNO = localStorage.getItem('swT_NO');
    this.selectedMsgty = localStorage.getItem('msgty');
    this.selectedResp = localStorage.getItem('resp');
    this.selectedWfn = localStorage.getItem('wfn');
    this.selectedFollow = localStorage.getItem('followuP_NO');
    this.selectedRecdt = localStorage.getItem('recdt');
    this.selectedSnddt = localStorage.getItem('snddt');
    this.selectedPulldt = localStorage.getItem('pulldt');
    this.selectedActNo = localStorage.getItem('selectedActivity');
    this.selectedRejcd = localStorage.getItem('rejcd');
    const objectNameList = localStorage.getItem('objectNameList');
    const objValueList = localStorage.getItem('objValueList');
    if (objectNameList) {
      this.selectedobjectName = JSON.parse(objectNameList);
    }
    if (objValueList) {
      this.selectedobjValue = JSON.parse(objValueList);
    }
  }

  btn_Submit() {

    const apiUrl = `${environment.apiBaseUrl}/api/LSMSReMessageSubmition/Submit`;

    const payload = {
      swtno: this.selectedSwtNO || '',
      msgty: this.selectedMsgty || '',
      resp: this.selectedResp || '',
      wfn: this.selectedWfn || '',
      followuP_NO: this.selectedFollow || '',
      // RECDT: this.selectedRecdt || '',
      // SNDDT: this.selectedSnddt || '',
      // PULLDT: this.selectedPulldt || '',
      activitY_NO: this.selectedActNo || '',
      // STATUS: this.selectedRejcd || '',
      // REJCD: this.selectedRejcd || '',
      // OBJID: this.selectedSwtNO || '',
      // MSGID: localStorage.getItem("msgID") || '',
      // SEQ: localStorage.getItem("seq") || '',
      // VAL: localStorage.getItem("val") || '',
      // OBJVAL: this.selectedobjValue.join(","),
      // USERID: localStorage.getItem("loginUser") || ''
    };
debugger
    this.http.post(apiUrl, payload).subscribe({
      
      next: (res: any) => {
        // debugger
        // alert("Submission Successful!");
        this.router.navigateByUrl('/app-public-porting-aspx')
      },
      error: (err) => {
        console.error(err);
        alert("!Error Submission");
      }
    });

  }

  btn_Close() {
    // Only here clear the storage
    localStorage.removeItem('rejcd');
    localStorage.removeItem('objectNameList');
    localStorage.removeItem('objValueList');
    localStorage.removeItem('seq');
    localStorage.removeItem('val');
    localStorage.removeItem('msgID');

    this.router.navigateByUrl('app-public-porting-aspx');
  }

}
