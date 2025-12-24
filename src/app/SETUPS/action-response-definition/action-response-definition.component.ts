import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { environment } from 'environments/environment';

export interface ResponseGet {
  aact: string,
  desc: string,
  aacty: string,
  response: string,
  rtype: string,
  rdscr: string,
  msgid: string,
  rejc: string,
  tuid: string,
  tdate: string,
  recordType: string
}

@Component({
  selector: 'app-public-actionresponsesetup-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './action-response-definition.component.html',
  styleUrl: './action-response-definition.component.css'
})
export class ActionResponseDefinitionComponent {
  isAddMode: boolean = false;
  selectedActionID: any = '';
  selectedActionType: any = 'N';
  selectedActionDescription: any = '';
  selectedResponseID: any = '1';
  selectedMessageID: any = '';
  selectedResponseDescription: any = '';
  ActionIDLov: any[] = [];
  MessageLov: any[] = [];
  errmessage: string = "";
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  isadd: string = '';
  loginUser: string = '';
  responseGet: ResponseGet[] = [];
  GridData: any[] = [];
  ActionlovDisabled: boolean = false;
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;
  showDeleteButton: boolean = true;
  tableData: any[] = [];
  showModal: boolean = false;
  showSuccessPopup: boolean = false;
  rowToDelete: any = null;

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.ActionTypeLov();
    this.MessageIDLov();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }
  ActionLov = [
    { code: '1', name: 'OK' },
    { code: '2', name: 'Reject' },
    { code: '3', name: 'Hold' },
    { code: '4', name: 'Cancel' }

  ];
  ActionTypLov = [
    { code: 'N', name: 'NPC' },
    { code: 'S', name: 'Switch Provision' },
    { code: 'F', name: 'Follow Up' },
    { code: 'D', name: 'DML' },
    { code: 'E', name: 'Error' },
    { code: 'C', name: 'Cares' },
    { code: 'X', name: 'WorkFlow Closed' }

  ];
  AddButton(): void {
    const txt_ActDesc = this.el.nativeElement.querySelector('#txt_ActDesc');
    const txt_MsgDesc = this.el.nativeElement.querySelector('#txt_MsgDesc');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    const btn_Delete = this.el.nativeElement.querySelector('#btn_Delete');
    const tbl_data = this.el.nativeElement.querySelector('#tbl_data');

    if (txt_ActDesc) this.renderer.removeAttribute(txt_ActDesc, 'disabled');
    if (txt_MsgDesc) this.renderer.removeAttribute(txt_MsgDesc, 'disabled');

    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true');
      this.renderer.removeClass(btn_add, 'newbtn');
      this.renderer.addClass(btn_add, 'newbtndisable');
    }

    // if (btn_Submit) {
    //   this.renderer.removeAttribute(btn_Submit, 'disabled');
    //   this.renderer.removeClass(btn_Submit, 'newbtndisable');
    //   this.renderer.addClass(btn_Submit, 'newbtn');
    // }

    if (btn_Delete) {
     // this.renderer.setAttribute(btn_Delete, 'disabled', 'true');
    //  this.renderer.removeClass(btn_Delete, 'newbtn');
      this.renderer.addClass(btn_Delete, 'newbtn');
    }

    if (tbl_data) this.renderer.setStyle(tbl_data, 'display', 'none');

    this.isAddMode = true;
    this.selectedActionID = '';
    this.isadd = 'I';
    this.showAddButton = false;
    this.showDeleteButton = false;
    this.showSubmitButton = true;
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) this.renderer.setAttribute(btn_Search, 'disabled', 'true');
  }

  ResetButton() {
    this.isAddMode = false;
    const txt_ActDesc = this.el.nativeElement.querySelector('#txt_ActDesc');
    const txt_MsgDesc = this.el.nativeElement.querySelector('#txt_MsgDesc');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    const btn_Delete = this.el.nativeElement.querySelector('#btn_Delete');
    const tbl_data = this.el.nativeElement.querySelector('#tbl_data');

    if (txt_ActDesc) this.renderer.setAttribute(txt_ActDesc, 'disabled', 'true');
    if (txt_MsgDesc) this.renderer.setAttribute(txt_MsgDesc, 'disabled', 'true');

    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled');
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }

    if (btn_Submit) {
      //this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
      //this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtn');
    }

    if (btn_Delete) {
    //  this.renderer.removeAttribute(btn_Delete, 'disabled');
     // this.renderer.removeClass(btn_Delete, 'newbtndisable');
      this.renderer.addClass(btn_Delete, 'newbtn');
    }

    if (tbl_data) this.renderer.removeStyle(tbl_data, 'display');

    if (this.ActionIDLov.length > 0) this.selectedActionID = this.ActionIDLov[0].desc;
    if (this.ActionIDLov.length > 0) this.selectedActionType = this.ActionIDLov[0].aacty;
    if (this.MessageLov.length > 0) this.selectedMessageID = this.MessageLov[0].msgid;
    this.selectedResponseID = '1';
   this.showAddButton = true;
   this.showSubmitButton = false;
   this.showDeleteButton = true;
    if (this.ActionIDLov.length > 0) {
      const firstRow = this.ActionIDLov[0];
      this.selectedActionID = firstRow.desc;
      this.selectedActionType = firstRow.aacty;
      this.selectedActionDescription = this.getCleanDesc(firstRow.desc);

      // ✅ RESPONSE table me bhi first record ka data show ho
      this.onRowClick(firstRow, true); // page load ke liye flag true
    }
  this.ActionTypeLov();
    this.MessageIDLov();
    this.selectedActionDescription = '';
    this.selectedResponseDescription = '';
  }

  ActionTypeLov(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/Action_LOV_/ActionTypeLov`)
      .subscribe({
        next: (data) => {
          this.ActionIDLov = data;
          if (this.ActionIDLov.length > 0) {
            const firstRow = this.ActionIDLov[0];
            this.selectedActionID = firstRow.desc;
            this.onRowClick(firstRow, true); // 👈 page load flag true
          }
        },
      //  error: (err) => console.error('Error loading alarms', err)
      });
  }

  MessageIDLov(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/Action_LOV_/MessageIDLov`)
      .subscribe({
        next: (data) => {
          this.MessageLov = data;
          if (this.MessageLov.length > 0) {
            this.selectedMessageID = this.MessageLov[0].msgid;
          }
        },
     //   error: (err) => console.error('Error loading Message', err)
      });
  }

  onActionChange(): void {
    const selected = this.ActionIDLov.find(x => x.desc === this.selectedActionID);
    if (selected) {
      this.selectedActionDescription = selected.desc.replace(/\s*\(.*?\)\s*/g, '');
      this.selectedActionType = selected.aacty;
    } else {
      this.selectedActionDescription = '';
      this.selectedActionType = '';
    }
  }

  getCleanDesc(desc: string): string {
    if (!desc) return '';
    return desc.replace(/\s*\([^)]*\)/, '');
  }

  onMessageIDChange(): void {
    const selected = this.MessageLov.find(x => x.msgid === this.selectedMessageID);
    if (selected) {
      this.selectedResponseDescription = selected.msgid;
    }
  }

  getResponseName(value: string) {
    switch (value) {
      case '1': return 'OK';
      case '2': return 'Reject';
      case '3': return 'Hold';
      case '4': return 'Cancel';
      default: return '';
    }
  }

  // ✅ Fixed onRowClick
  onRowClick(row: any, isPageLoad: boolean = false) {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    const btn_Delete = this.el.nativeElement.querySelector('#btn_Delete');

    // 👇 Sirf manual click par button disable hoga
    if (!isPageLoad) {
      if (btn_Submit) {
        this.renderer.removeAttribute(btn_Submit, 'disabled');
        this.renderer.removeClass(btn_Submit, 'newbtndisable');
        this.renderer.addClass(btn_Submit, 'newbtn');
      }
      // if (btn_add) {
      //   this.renderer.setAttribute(btn_add, 'disabled', 'true');
      //   this.renderer.removeClass(btn_add, 'newbtn');
      //   this.renderer.addClass(btn_add, 'newbtndisable');
      // }
      this.showAddButton = false;
      this.showSubmitButton = true;
      this.showDeleteButton = false;
       if (btn_Delete) {
       // this.renderer.setAttribute(btn_Delete, 'disabled', 'true');
       // this.renderer.removeClass(btn_Delete, 'newbtn');
        this.renderer.addClass(btn_Delete, 'newbtn');
      }
    }

    this.selectedActionID = row.desc;
    this.selectedActionDescription = this.getCleanDesc(row.desc);
    this.selectedActionType = row.aacty;

    const url = `${environment.apiBaseUrl}/api/ActionResponseSetup/details/${row.aact}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.responseGet = res;
          this.GridData = res;
        } else {
        //  console.log('No data found');
        }
      },
      error: (err) => {
    //    console.error('Error fetching data:', err);
      }
    });
  }

  addRow() {
    const tbl_data = this.el.nativeElement.querySelector('#tbl_data');
    if (tbl_data) this.renderer.removeStyle(tbl_data, 'display');

    if (this.selectedResponseID && this.selectedMessageID) {
      const exists = this.responseGet.some(
        row => String(row.response).trim().toLowerCase() === String(this.selectedResponseID).trim().toLowerCase()
      );

      if (exists) {
        this.showSuccessPopup = false;
        setTimeout(() => {
          this.popupMessage = "This Response ID already exists!";
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
        }, 100);
        return;
      }

      const responseName = this.getResponseName(this.selectedResponseID);
      const newRow: ResponseGet = {
        aact: this.selectedActionID,
        desc: this.selectedActionDescription,
        aacty: this.selectedActionType,
        response: this.selectedResponseID,
        rtype: '',
        rdscr: responseName,
        msgid: this.selectedMessageID,
        rejc: '',
        tuid: this.loginUser,
        tdate: new Date().toISOString(),
        recordType: 'I'
      };

      this.responseGet = [...this.responseGet, newRow];
    //  console.log("Row Added in responseGet:", newRow);
    } else {
      setTimeout(() => {
        this.popupMessage = "Please select Response ID and Message ID before adding.";
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }
  }

  deleteRow() {
  if (this.rowToDelete) {
    // ✅ responseGet me se delete karein (table isi se render hoti hai)
    this.responseGet = this.responseGet.filter(r => r !== this.rowToDelete);
   // console.log("✅ Row deleted successfully:", this.rowToDelete);
  }
  this.closeModal(); // hide modal after delete
}

confirmDelete(row: any) {
// console.log("🗑️ Confirm delete called for row:", row);
  this.rowToDelete = row; // temporarily store the row to delete
  this.showModal = true;  // show confirmation popup/modal
}

closeModal() {
  this.showModal = false;
  this.rowToDelete = null; // reset after close
}
}