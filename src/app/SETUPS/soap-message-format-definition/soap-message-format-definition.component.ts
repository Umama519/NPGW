import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { environment } from 'environments/environment';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { PaginationService } from 'app/services/pagination.service';
export class XmlFormatSetup {
  private baseUrl = environment.apiBaseUrl;
  msgid: string;
  objid: string;
  seq: string;
  descrip: string;
  val: string;
  createdBy: string;
  createdDate: string;
  msgdescrip: string;
  constructor() {
    this.msgid = '';
    this.objid = '';
    this.seq = '';
    this.descrip = '';
    this.val = '';
    this.createdBy = '';
    this.createdDate = '';
    this.msgdescrip = '';
  }
}

export interface XmlObjGet {
  objid: string;
  seq: string;
  objDesc: string;
  val: string;
}

@Component({
  selector: 'app-public-xmlpacketdefinition-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './soap-message-format-definition.component.html',
  styleUrl: './soap-message-format-definition.component.css'
})
export class SoapMessageFormatDefinitionComponent {

  XmlFormat: XmlFormatSetup = new XmlFormatSetup();
  showModal: boolean = false; // For controlling modal visibility
  XmlObjGet: XmlObjGet[] = [];
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private pager: PaginationService) { }
  Objid: string | null = null;
  seq: string | null = null;
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  MSGID: any[] = [];           // Stores Action descriptions
  MSG: any[] = [];           // Stores Action descriptions
  MSGType: any[] = [];           // Stores Action descriptions
  OBJID: any[] = [];
  isMsgIdLovDisabled: boolean = false;  // default disabled
  isObjLovDisabled: boolean = true;  // default disabled
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedObjID: string = '';
  selectedSequence: string = '';
  selectedDescription: string = '';
  selectedMsg: any;
  isChecked: boolean = false; // default
  selectedMsgId: string = '';
  selectedMtype: string = '';
  selectedLenght: string = '';
  isErrorPopup: boolean = false;
  isadd: string = '';
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  loginUser: string = '';
  //Paging
  totalItems = 0;
  currentPage = 1;
  itemsPerPage!: number;
  windowSize!: number;
  windowStart = 1;
  pagedData: any[] = [];
  showPagination = false;

  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;

  ngOnInit(): void {
    this.LoadFields();
    const input = this.el.nativeElement.querySelector('#txt_Description');
    if (input) {
      this.renderer.setAttribute(input, 'disabled', 'true'); // Disable input field
    }

    this.GetGrid();
    this.ObjLov();
    this.MSGLov();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }

  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/XmlPacketDefination`;
    // const url = `http://localhost:5000/api/XmlPacketDefination`; // Fetch all data
    const HolidayDate = this.el.nativeElement.querySelector('#txt_ObjectID')
    const Description = this.el.nativeElement.querySelector('#txt_Description')
    const txt_Lenght = this.el.nativeElement.querySelector('#txt_Lenght')
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.XmlObjGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // Initially display all data
           this.totalItems = this.GridData.length;
          this.currentPage = 1;
          this.windowStart = 1;            // start of pagination window          
          this.showPagination = true;

          this.setPage(1);                 
          HolidayDate.value = '';
          Description.value = '';
          txt_Lenght.value = '';
          if (Description) {
            this.renderer.setAttribute(Description, 'disabled', 'true');
          }
          if (txt_Lenght) {
            this.renderer.setAttribute(txt_Lenght, 'disabled', 'true');
          }
          //this.holidayGet.dscrip = '';
        } else {
          console.log('No data found');
          this.filteredData = []; // Set empty array if no data is found
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.filteredData = []; // Handle error by setting filteredData to empty
      }
    });
  }
  onMsgIdChange(isInit: boolean = false) {

    // ✅ Pick object from list using msgid
    if (!isInit) {
      this.selectedMsg = this.MSGID.find(x => x.msgid === this.selectedMsgId);
    }

    if (this.selectedMsg) {
      this.selectedDescription = this.selectedMsg.msGtxt;
      this.selectedMtype = this.selectedMsg.msGtype;
    } else {
      this.selectedDescription = '';
      this.selectedMtype = '';
    }

    const url = `${environment.apiBaseUrl}/api/XmlPacketDefination/${this.selectedMsgId}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.XmlObjGet = data;
        this.GridData = data;
        this.filteredData = data;
      },
      error: (err) => console.error(err)
    });
  }



  MSGLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/MessageID`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.MSGID = data;

        if (this.MSGID.length > 0) {
          this.selectedMsg = this.MSGID[0];
          this.selectedMsgId = this.selectedMsg.msgid; // Show default in LOV
          this.onMsgIdChange();
        }
      }
    });
  }

  ObjLov() {
    debugger
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/ObjectID`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.OBJID = data;   // ❗ full object assign karo
        if (this.OBJID.length > 0) {
          this.selectedObjID = this.OBJID[0].OBJ; // first value in LOV
        }
      },
      error: (err) => {
        console.error("Error fetching Actions:", err);
      }
    });
  }

  LoadFields() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit')
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name');
    if (txt_Name) {
      this.renderer.setAttribute(txt_Name, 'disabled', 'true'); // Disable input field
    }
    // if (btn_Submit) {
    //   this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    // }
  }
  buttobfun() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtndisable'); // Remove the old class
      this.renderer.addClass(btn_Submit, 'newbtn');
    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtn');
      this.renderer.addClass(btn_add, 'newbtndisable');
    }
  }
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }
  }
  SubmitField() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Submit) {
    //   this.renderer.removeAttribute(btn_Submit, 'disabled')
    // }
    if (btn_Search) {
      this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    }
  }
  AddButton(): void {

    const Obj = this.el.nativeElement.querySelector('#ddl_Obj');
    const Seq = this.el.nativeElement.querySelector('#txt_Sequence');
    const chb = this.el.nativeElement.querySelector('#chb');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (Seq) {
      this.renderer.removeAttribute(Seq, 'disabled'); // Enable input field
    }
    if (Obj) {
      this.renderer.removeAttribute(Obj, 'disabled'); // Enable input field
    }
    if (chb) {
      this.renderer.removeAttribute(chb, 'disabled'); // Enable input field
    }
    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true'); // Enable input field
    }
    this.SubmitField();
    this.buttobfun();
    this.lovenabled();
    this.isadd = 'I';
    this.showAddButton = false;
    this.showSubmitButton = true;

  }
  lovenabled() {
    this.isObjLovDisabled = false;
  }
  lovdisabled() {
    this.isObjLovDisabled = true;
  }
  ResetFields() {
    const Seq = this.el.nativeElement.querySelector('#txt_Sequence');
    const chb = this.el.nativeElement.querySelector('#chb');
    const txt_ObjectID = this.el.nativeElement.querySelector('#txt_ObjectID');
    const txt_Obj = this.el.nativeElement.querySelector('#ddl_Obj');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_Type = this.el.nativeElement.querySelector('#txt_Type');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')

    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (txt_Description) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute      

    }
    if (Seq) {
      this.renderer.setAttribute(Seq, 'disabled', 'true'); // Enable input field
      Seq.value = '';
    }
    if (chb) {
      this.renderer.setAttribute(chb, 'disabled', 'true'); // Enable input field
      chb.checked = false;

    }
    if (txt_Type) {
      this.renderer.setAttribute(txt_Type, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute      
    }
    if (txt_Obj) {
      this.renderer.setAttribute(txt_Obj, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute
      txt_Obj.value = '';
    }
    if (btn_Search) {
      this.renderer.removeClass(btn_Search, 'newbtndisable');
      this.renderer.addClass(btn_Search, 'newbtn');
    }

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      //  this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (txt_ObjectID) {
      this.renderer.removeAttribute(txt_ObjectID, 'disabled'); // Disable the input by setting 'disabled' attribute
      txt_ObjectID.value = '';
    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.GetGrid();
    this.MSGLov();
    this.ObjLov();
    this.lovdisabled();
  }
  ResetButton() {
    this.ResetFields();
    this.AddFields();
    this.showAddButton = true;
    this.showSubmitButton = false;

  }
  setPage(page: number) {
    this.currentPage = page;
    this.pagedData = this.pager.getPagedData(this.GridData, page, this.itemsPerPage);
  }

  get totalPages() {
    return this.pager.getTotalPages(this.totalItems, this.itemsPerPage);
  }

  get paginationNumbers() {
    return this.pager.getPageNumbers(this.totalItems, this.windowStart, this.windowSize, this.itemsPerPage);
  }

  showNextWindow() {
    this.windowStart = this.pager.nextWindow(this.totalItems, this.windowStart, this.windowSize, this.itemsPerPage);
  }

  showPreviousWindow() {
    this.windowStart = this.pager.prevWindow(this.windowStart, this.windowSize);
  }

  onCheckboxChange() {
    this.XmlFormat.val = this.isChecked ? '1' : '0';
    console.log("Value:", this.XmlFormat.val);
  }
  submitButton() {
    debugger;
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    this.XmlFormat.msgid = this.selectedMsg.msgid;
    this.XmlFormat.objid = this.selectedObjID;
    this.XmlFormat.msgdescrip = (document.getElementById('txt_Type') as HTMLInputElement).value; // Example: "2025-01-08"    
    this.XmlFormat.seq = (document.getElementById('txt_Sequence') as HTMLInputElement).value;
    this.XmlFormat.descrip = (document.getElementById('txt_Description') as HTMLInputElement).value;
    this.XmlFormat.val = this.XmlFormat.val;
    this.XmlFormat.createdBy = this.loginUser;
    this.XmlFormat.createdDate = '';

    // Validation for empty Department ID
    if (!this.XmlFormat.objid) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage = "Please Enter ObjectID";
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }
    this.showAddButton = true;
    this.showSubmitButton = false;
    const txt_ObjectID = this.el.nativeElement.querySelector('#ddl_Obj');

    if (this.isadd === 'I') {
      debugger;
      // Insert New Record
      const insertUrl = `${environment.apiBaseUrl}/api/XmlPacketDefination`;
      this.http.post(insertUrl, this.XmlFormat).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // Set success message                        
          if (JSON.stringify(response).includes('0')) {
            this.isErrorPopup = true; // Error popup
            const ab = JSON.stringify(response);
            const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.popupMessage = msgR; // Set suc
          } else {
            this.isErrorPopup = false; // Success popup
          }
          this.showSuccessPopup = true; // Show popup

          // Refresh grid and clear input fields
          this.lovdisabled();
          this.GetGrid();
          if (txt_ObjectID) {
            this.renderer.removeAttribute(txt_ObjectID, 'disabled');
          }
          this.XmlFormat.objid = '';
          this.XmlFormat.descrip = '';
          this.XmlFormat.seq = ''
          this.ResetFields();

        },
        error: (err) => {
          console.error('Error during insert:', err);
          this.popupMessage = 'Failed to insert the record. Please try again.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
        }
      });
    } else {
      console.error('Invalid operation type in isadd');
      this.popupMessage = 'Invalid operation type.';
      this.isErrorPopup = true; // Error popup
      this.showSuccessPopup = true; // Show popup
      this.isSubmitting = false;
    }
  }
  confirmDelete(Obj: string, seq: string) {
    debugger;
    console.log("Confirm delete called for deptid:", Obj); // Add logging
    this.Objid = Obj;
    this.seq = seq;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }
  deleteRecord(Obj: string) {
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const body = {
      msgid: this.selectedMsg?.msgid || '',  // ✅ required for delete
      objid: this.Objid,                     // ✅ required for delete
      seq: this.seq || '',                   // ✅ required for delete
      descrip: '',
      val: '',
      createdBy: '',
      createdDate: ''
    };

    const headers = { 'Content-Type': 'application/json' };

    this.http.delete(`${environment.apiBaseUrl}/api/XmlPacketDefination`, { headers, body })
      .subscribe(
        (response: any) => {
          const resMessage = response.message;
          let msgR = resMessage.split(';').slice(1).join(',').replace(/[}"]/g, '').trim();
          this.popupMessage = msgR;

          this.filteredData = this.filteredData.filter((row) => row.objid !== Obj);
          this.GetGrid();
          this.showSuccessPopup = true;

          this.Objid = null;
          const txt_ObjectID = this.el.nativeElement.querySelector('#ddl_Obj');
          if (txt_ObjectID) this.renderer.removeAttribute(txt_ObjectID, 'disabled');

          this.showModal = false;
          this.ResetFields();
          this.AddFields();
          this.showAddButton = true;
          this.showSubmitButton = false;
        },
        (error) => {
          alert(`Error deleting record: ${error.message}`);
          console.error('Error Details:', error);
        }
      );
  }


}

