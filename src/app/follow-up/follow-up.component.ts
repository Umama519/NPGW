import { Component, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

@Component({
  selector: 'app-follow-up',
  standalone: true,  
  imports: [CommonModule, FormsModule, GlobalLovComponent ],
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.css'
})
export class FollowUpComponent {
  showSuccessPopup: boolean = false;
  errmessage: string = "";
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  selectedMobile: string | null = null;
  selectedPortID: string | null = null;
  selectedDonor: string | null = null;
  selectedAccountType: string | null = null;
  selectedCnic: string | null = null;
  selectedRegion: string | null = null;
  selectedOno: string | null = null;
  selectedImsi: string | null = null;
  selectedActDt: string | null = null;
  selectedActNo: string | null = null;
  selectedStat: string | null = null;
  selectedTdate: string | null = null;
  selectedUserid: string | null = null;
  selectedWfn: string | null = null;
  selectedUname: string | null = null;
  selectedValue: string = '';
  selectedLastAction: string | null = null;
  ResponseData: any[] = [];
  ReasonData: any[] = [];
  Response: string = '';
  lovRespDisabled: boolean = false; // Default disabled  
  SelectedReason: string = '';
  CommentText: string = '';
  loginUser: string = '';

  constructor(
    private http: HttpClient,
    private el: ElementRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const currentDate = new Date();
    const formattedDate = this.formatDateTime(currentDate);
    const txtInput = this.el.nativeElement.querySelector('#txt_NPRDueDT') as HTMLInputElement;
    if (txtInput) {
      txtInput.value = formattedDate;
    }
    this.ResponseLov();

    // ✅ LocalStorage values load karo
    this.selectedMobile = localStorage.getItem('selectedMobile');
    this.selectedPortID = localStorage.getItem('selectedPortID');
    this.selectedDonor = localStorage.getItem('selectedDonor');
    this.selectedAccountType = localStorage.getItem('selectedAccountType');
    this.selectedCnic = localStorage.getItem('selectedCnic');
    this.selectedRegion = localStorage.getItem('selectedRegion');
    this.selectedActDt = localStorage.getItem('selectedActDt');
    this.selectedOno = localStorage.getItem('selectedOno');
    this.selectedImsi = localStorage.getItem('selectedImsi');
    this.selectedWfn = localStorage.getItem('selectedWfn');
    this.selectedActNo = localStorage.getItem('selectedActivity');
    this.selectedStat = localStorage.getItem('Stat');
    this.selectedTdate = localStorage.getItem('Tdate');
    this.selectedUserid = localStorage.getItem('Userid');
    this.selectedUname = localStorage.getItem('Uname');
    this.selectedLastAction = localStorage.getItem('LastAction');
    this.loginUser = localStorage.getItem('loginUser') || 'No user';


  }
  private formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }
  // ✅ Get Response LOV and load default Reason
  ResponseLov() {
  const url = `${environment.apiBaseUrl}/api/Action_LOV_/FollowupLov?Maction=NPVALM&ConnType=B`;
  this.http.get<any[]>(url).subscribe({
    next: (data) => {
      this.ResponseData = data;

      if (this.ResponseData.length > 0) {
        // ✅ Response LOV mein top value set karo
        this.Response = this.ResponseData[0].rdscr; // displayField ke hisaab se
        this.selectedValue = this.ResponseData[0].resp; // valueField ke hisaab se

        const firstChar = this.selectedValue.charAt(0);
        let rejVal = '';

        // 🔹 Agar 1 ya 2 nahi hai to ";" ke baad ki value nikaal lo
        if (firstChar !== '1' && firstChar !== '2') {
          const parts = this.selectedValue.split(';');
          if (parts.length > 1) rejVal = parts[1].trim();
        }

        this.loadDefaultReason(firstChar, rejVal);
      }
    },
    error: (err) => console.error('Error fetching Response data:', err)
  });
}

// ✅ Load Reason using ResVal & optional RejVal
loadDefaultReason(resVal: string, rejVal: string = '') {
  const url = `${environment.apiBaseUrl}/api/Action_LOV_/ReasonLov?ResVal=${resVal}&RejVal=${rejVal}&ConnTyp=B`;
  this.http.get<any[]>(url).subscribe({
    next: (data) => {
      this.ReasonData = data;
      if (this.ReasonData.length > 0) {
        // ✅ Reason LOV mein top value set karo
        this.SelectedReason = this.ReasonData[0].rejcd;
        this.CommentText = this.ReasonData[0].descrip;
      } else {
        this.SelectedReason = '';
        this.CommentText = '';
      }
    },
    error: (err) => console.error('Error fetching default Reason data:', err)
  });
}

// ✅ On Response dropdown change - FIXED
onRespChange(selectedValue: any) {
  console.log('Response changed:', selectedValue);
  
  // ✅ Selected value se resp nikaalo
  const selectedItem = this.ResponseData.find(item => item.rdscr === selectedValue);
  if (selectedItem) {
    this.selectedValue = selectedItem.resp;
    const firstChar = this.selectedValue.charAt(0);
    let rejVal = '';

    if (firstChar !== '1' && firstChar !== '2') {
      const parts = this.selectedValue.split(';');
      if (parts.length > 1) rejVal = parts[1].trim();
    }

    // ✅ Reason LOV refresh karo
    this.loadDefaultReason(firstChar, rejVal);
  }
}

// ✅ On Reason change update CommentText - FIXED
onReasonChange(selectedReasonValue: any) {
  console.log('Reason changed:', selectedReasonValue);
  
  const selectedReason = this.ReasonData.find(r => r.rejcd === selectedReasonValue);
  this.CommentText = selectedReason ? selectedReason.descrip : '';
}
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  // ✅ Submit function — only first char of resp + input values
  Submit() {
    debugger
    const selectedActNo = localStorage.getItem('selectedActivity');
    const selectedUserid = this.loginUser;

    const txt_Comment1 = (this.el.nativeElement.querySelector('#txt_Comment1') as HTMLTextAreaElement)?.value || '';
    const txt_Comment2 = (this.el.nativeElement.querySelector('#txt_Comment2') as HTMLTextAreaElement)?.value || '';
    const txt_NPRDueDT = (this.el.nativeElement.querySelector('#txt_NPRDueDT') as HTMLInputElement)?.value || '';
    const ddl_reason = this.SelectedReason;
    const selectedReason = ddl_reason ? ddl_reason : '';
    const rescom = selectedReason + ': ' + txt_Comment2;

    if (!selectedActNo) {
        this.popupMessage = ('Activity number missing!');
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      return;
    }

    if (!this.selectedValue) {      
      this.popupMessage = ('Please select a response!');
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      return;
    }



    
    const url = `${environment.apiBaseUrl}/api/FollowUp`;
    const body = {
      resp: this.selectedValue.charAt(0),   // ✅ sirf pehla character
      wfn: this.selectedWfn,
      followuP_NO: '',
      tdate: txt_NPRDueDT,                  // ✅ textbox value
      userid: selectedUserid,
      activitY_NO: selectedActNo,
      stat: '',
      comnts: rescom,                 // ✅ user input
      rescd: selectedReason,
      rcomnts: rescom                 // ✅ readonly comment
    };

    console.log('📤 Sending Body:', body);
    

    this.http.post(url, body).subscribe({
      next: (res: any) => {
      //  console.log('✅ FollowUp Response:', res);
      //  alert(res.message || 'Follow-up submitted successfully.');
        this.router.navigateByUrl('/app-public-porting-aspx')
      },
      
      error: (err) => { 
        console.error('❌ Error in FollowUp API:', err);        
      }
    });
  }

  Back() {
    this.router.navigateByUrl('app-public-porting-aspx');
  }
}
