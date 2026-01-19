import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  Value: string;
}
@Component({
  selector: 'app-re-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './re-message.component.html',
  styleUrl: './re-message.component.css'
})
export class ReMessageComponent {

  constructor(private router: Router, private http: HttpClient) { }

  selectedRejcd: string | null = null;
  selectedMsg: string | null = null;
  selectedMsgty: string | null = null;
  selectedResp: string | null = null;
  selectedWfn: string | null = null;
  selectedFollow: string | null = null;
  selectedRecdt: string | null = null;
  selectedSnddt: string | null = null;
  selectedPulldt: string | null = null;
  selectedActNo: string | null = null;
  selectedMobile: string | null = null;
  selectedDonor: string | null = null;
  selectedRecipient: string | null = null;
  selectedVal: string | null = null;
  selectedobjectName: string[] = [];
  selectedobjValue: string[] = [];
  selectedValue: string[] = [];
  loadDetails(data: LSMSDetail[]) {
    this.selectedobjectName = data.map(x => x.ObjectName);
    this.selectedobjValue = data.map(x => x.ObjValue);
    this.selectedValue = data.map(x => x.Value);
  }

  ngOnInit(): void {
    this.selectedMsg = localStorage.getItem('msG_NO');
    this.selectedMsgty = localStorage.getItem('msgtype');
    this.selectedResp = localStorage.getItem('resP_NO');
    this.selectedWfn = localStorage.getItem('wfn');
    this.selectedFollow = localStorage.getItem('followuP_NO');
    this.selectedRecdt = localStorage.getItem('recdt');
    this.selectedSnddt = localStorage.getItem('snddt');
    this.selectedPulldt = localStorage.getItem('pulldt');
    this.selectedActNo = localStorage.getItem('selectedActivity');
    this.selectedRejcd = localStorage.getItem('rejcdR');
    this.selectedMobile = localStorage.getItem('selectedMobile');
    this.selectedDonor = localStorage.getItem('selectedDonor');
    this.selectedRecipient = localStorage.getItem('selectedRecipient');
    this.selectedVal = localStorage.getItem('Value');
    const objectNameList = localStorage.getItem('objectNameList');
    const objValueList = localStorage.getItem('objValueList');
    const ValueList = localStorage.getItem('Value');
    if (objectNameList) {
      this.selectedobjectName = JSON.parse(objectNameList);
    }
    if (objValueList) {
      this.selectedobjValue = JSON.parse(objValueList);
    }
    if (objValueList) {
      this.selectedobjValue = JSON.parse(objValueList);
    }
    if (ValueList) {
      this.selectedValue = JSON.parse(ValueList);
    }
  }
  btn_Submit() {
    const apiUrlM = `${environment.apiBaseUrl}/api/ReMessaging/Submit?action=M`;
    const payloadM = {
      msgty: this.selectedMsgty || '',
      resp: this.selectedResp || '',
      wfn: this.selectedWfn || '',
      followuP_NO: this.selectedFollow || '',
      mmsG_NO: this.selectedMsg || '',
      rejcd: this.selectedRejcd || '',
      buishre: '',
      duedt: '',
      activitY_NO: this.selectedActNo || '',
      userID: localStorage.getItem("loginUser") || '',
      mobile: this.selectedMobile,
      recipient: this.selectedRecipient,
      donor: this.selectedDonor,
      msgid: this.selectedobjValue?.[1] || '', // first objValue for master
      seq: '',
      objid: '',
      objval: '',
      val: '',
      msgno: this.selectedMsg || '',
    };
    debugger
    this.http.post(apiUrlM, payloadM).subscribe({
      next: (res: any) => {
        const generatedMsgNo = res.MSGNO || res.message;
        const apiUrlD = `${environment.apiBaseUrl}/api/ReMessaging/Submit?action=D`;
        const detailRequests = this.selectedobjectName.map((objId: string, index: number) => {
          const payloadD = {
            msgty: '',
            resp: '',
            wfn: '',
            followuP_NO: this.selectedFollow || '',
            mmsG_NO: this.selectedMsg || '',
            rejcd: this.selectedRejcd || '',
            buishre: '',
            duedt: '',
            activitY_NO: this.selectedActNo || '',
            userID: localStorage.getItem("loginUser") || '',
            mobile: this.selectedMobile || '',
            recipient: this.selectedRecipient || '',
            donor: this.selectedDonor || '',
            msgid: this.selectedobjValue?.[1] || '',
            seq: (index + 1).toString(),
            objid: objId,
            objval: this.selectedobjValue?.[index] || '',
            val: this.selectedValue?.[index] || '',
            msgno: generatedMsgNo.toString(),  // string type            
          };
          return this.http.post(apiUrlD, payloadD);
        });
        forkJoin(detailRequests).subscribe({
          next: _ => {
          },
        });
        const apiUrlXml = `${environment.apiBaseUrl}/api/ReMessaging/Submit?action=X`;
        const payloadX = {
          msgty: this.selectedMsgty || '',
          resp: this.selectedResp || '',
          wfn: this.selectedWfn || '',
          followuP_NO: this.selectedFollow || '',
          mmsG_NO: this.selectedMsg || '',
          rejcd: this.selectedRejcd || '',
          buishre: '',
          duedt: '',
          activitY_NO: this.selectedActNo || '',
          userID: localStorage.getItem("loginUser") || '',
          mobile: this.selectedMobile,
          recipient: this.selectedRecipient,
          donor: this.selectedDonor,
          msgid: this.selectedobjValue?.[1] || '',
          seq: '',
          objid: '',
          objval: '',
          val: '',
          msgno: this.selectedMsg || '',
        };
        this.http.post(apiUrlXml, payloadX).subscribe({
          next: (res: any) => {
           
          }
        })        
        const payload = {
          activity: this.selectedActNo,
          resp: '1',
          userID: localStorage.getItem('loginUser')
        };        
        this.http.post(
          `${environment.apiBaseUrl}/api/ReMessaging/ErrorSubmit`,
          payload
        ).subscribe(res => {
           this.router.navigateByUrl('/app-public-porting-aspx');          
        });

      },
      error: err => {
        alert('!Error Submission');
      }
    });
  }
  btn_Close() {
    localStorage.removeItem('rejcd');
    localStorage.removeItem('objectNameList');
    localStorage.removeItem('objValueList');
    localStorage.removeItem('seq');
    localStorage.removeItem('val');
    localStorage.removeItem('msgID');
    this.router.navigateByUrl('app-public-porting-aspx');
  }
}
