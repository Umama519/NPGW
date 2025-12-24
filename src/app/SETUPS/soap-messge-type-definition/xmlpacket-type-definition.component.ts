import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { environment } from 'environments/environment';
export class XmlObjSetup {
  messageID: string;
  message: string;
  operator_Message: string;
  messageType: string;
  createdBy: string;
  createdDate: string;
  constructor() {
    this.messageID = '';
    this.message = '';
    this.operator_Message = '';
    this.messageType = '';
    this.createdBy = '';
    this.createdDate = '';
  }
}

export interface XmlMsgGet {
  messageID: string;
  message: string;
  operator_Message: string;
  messageType: string;
  createdBy: string;
  createdDate: string;
}


@Component({
  selector: 'app-public-xmlpacketmessagesetup-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './xmlpacket-type-definition.component.html',
  styleUrl: './xmlpacket-type-definition.component.css'
})
export class XMLPacketTypeDefinitionComponent {

  XmlObj: XmlObjSetup = new XmlObjSetup();
  showModal: boolean = false; // For controlling modal visibility
  XmlObjGet: XmlMsgGet[] = [];
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  MsgID: string | null = null;
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedMsgID: string = '';
  selectedMsg: string = '';
  selectedOpt: string = '';
  selectedMsgType: any = '';
  isErrorPopup: boolean = false;
  isadd: string = '';
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  loginUser: string = '';
  Role: any[] = [];
  MsglovDisabled: boolean = true;  // default disabled
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
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }
  MsgType = [
    { code: 'I', name: 'Internal' },
    { code: 'E', name: 'External' }

  ];
  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/XMLPacketMessageSetup`; // Fetch all data
    const HolidayDate = this.el.nativeElement.querySelector('#txt_ObjectID')
    const Description = this.el.nativeElement.querySelector('#txt_Description')
    const txt_Lenght = this.el.nativeElement.querySelector('#txt_Lenght')
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.XmlObjGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // Initially display all data
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
  LoadFields() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit')
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name');
    if (txt_Name) {
      this.renderer.setAttribute(txt_Name, 'disabled', 'true'); // Disable input field
    }
    if (btn_Submit) {
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
  }
  lovenabled() {
    this.MsglovDisabled = false;
  }
  lovDisabled() {
    this.MsglovDisabled = true;
    this.selectedMsgType = null;

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

    const txt_Message = this.el.nativeElement.querySelector('#txt_Message');
    const txt_OptMsg = this.el.nativeElement.querySelector('#txt_OptMsg');
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (txt_Message) {
      this.renderer.removeAttribute(txt_Message, 'disabled'); // Enable input field
    }
    if (txt_OptMsg) {
      this.renderer.removeAttribute(txt_OptMsg, 'disabled'); // Enable input field
    }
    if (ddl_Type) {
      this.renderer.removeAttribute(ddl_Type, 'disabled'); // Enable input field
    }
    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true'); // Enable input field
    }
    this.SubmitField();
    this.buttobfun();
    this.lovenabled()
    this.isadd = 'I';
    this.showAddButton = false;
    this.showSubmitButton = true;
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    // }
  }
  searchButton() {
    debugger;
    //const inputD = this.el.nativeElement.querySelector('#txt_HolidayDate').value; // Get input value
    const txt_MessageID = this.el.nativeElement.querySelector('#txt_MessageID').value;
    const inputD = txt_MessageID;

    const url = `${environment.apiBaseUrl}/api/XMLPacketMessageSetup/${inputD}`; // API URL with DepartmentID

    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.XmlObjGet = res;
          this.filteredData = res; // Set filtered data from the API response
        } else {
          console.log('No data found for the given Holiday Date.');
          this.filteredData = [];
          this.XmlObjGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.filteredData = []; // Handle error by setting filteredData to empty
        this.XmlObjGet = [];
      }
    });
  }
  edit(row: any): void {
    debugger;
    const txt_MessageID = this.el.nativeElement.querySelector('#txt_MessageID');
    const txt_Message = this.el.nativeElement.querySelector('#txt_Message');
    const txt_OptMsg = this.el.nativeElement.querySelector('#txt_OptMsg');
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');

    if (txt_MessageID) {
      this.renderer.setProperty(txt_MessageID, 'value', row.messageID); // Set description value
      this.renderer.setAttribute(txt_MessageID, 'disabled', 'true'); // Enable the description field
      this.selectedMsg = row.msgid; // Store the selected description
    }
    if (txt_Message) {
      this.renderer.setProperty(txt_Message, 'value', row.message); // Set description value
      this.renderer.removeAttribute(txt_Message, 'disabled'); // Enable the description field
      this.selectedMsg = row.message; // Store the selected description
    }
    if (txt_OptMsg) {
      this.renderer.setProperty(txt_OptMsg, 'value', row.operator_Message); // Set description value
      this.renderer.removeAttribute(txt_OptMsg, 'disabled'); // Enable the description field
      this.selectedOpt = row.operator_Message; // Store the selected description
    }
    this.selectedMsgType = '';

    // Short delay dene se Angular ko detect karne ka mauka milta hai
    setTimeout(() => {
      const msgTypeText = row.messageType?.toString().trim().toLowerCase() || '';

      if (msgTypeText === 'internal') {
        this.selectedMsgType = 'I';
      } else if (msgTypeText === 'external') {
        this.selectedMsgType = 'E';
      } else {
        this.selectedMsgType = '';
      }

      // Enable dropdown
      const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');
      if (ddl_Type) {
        this.renderer.removeAttribute(ddl_Type, 'disabled');
      }
    }, 50);

    this.showAddButton = false;
    this.showSubmitButton = true;
    this.lovenabled()
    this.SubmitField();
    this.buttobfun();
    this.isadd = 'U'; // Set update mode
  }
  ResetFields() {
    this.lovDisabled();
    const txt_MessageID = this.el.nativeElement.querySelector('#txt_MessageID');
    const txt_Message = this.el.nativeElement.querySelector('#txt_Message');
    const txt_OptMsg = this.el.nativeElement.querySelector('#txt_OptMsg');
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (txt_Message) {
      this.renderer.removeAttribute(txt_Message, 'disabled'); // Enable input field
    }
    if (txt_OptMsg) {
      this.renderer.removeAttribute(txt_OptMsg, 'disabled'); // Enable input field
    }

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (txt_MessageID) {
      this.renderer.removeAttribute(txt_MessageID, 'disabled'); // Disable the input by setting 'disabled' attribute
      txt_MessageID.value = '';
      txt_Message.value = '';
      txt_OptMsg.value = '';
    }
    // if (btn_add) {
    //   this.renderer.removeClass(btn_add, 'newbtndisable');
    //   this.renderer.addClass(btn_add, 'newbtn');
    // }
    this.GetGrid();
  }
  ResetButton() {
    this.ResetFields();
    this.AddFields();
    this.disableenable();
    this.lovDisabled();

    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showAddButton = true;
    this.showSubmitButton = false;
  }

  disableenable() {

    const inputs = [

      '#txt_Message',
      '#txt_OptMsg',
      '#txt_OptMsg',
      '#ddl_Type',
    ];

    inputs.forEach(selector => {
      const input = this.el.nativeElement.querySelector(selector);
      if (input) {
        this.renderer.setAttribute(input, 'disabled', 'true');

        if (input.tagName === 'INPUT') {
          if (input.type === 'checkbox') {
            input.checked = false;
          } else {
            input.value = '';
          }
        } else if (input.tagName === 'SELECT') {
          input.selectedIndex = 0; // Reset dropdown
        } else if (input.tagName === 'TEXTAREA') {
          input.value = '';
        }
      }
    });
  }
  submitButton() {
    debugger;
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    this.XmlObj.messageID = (document.getElementById('txt_MessageID') as HTMLInputElement).value; // Example: "2025-01-08"    
    this.XmlObj.message = (document.getElementById('txt_Message') as HTMLInputElement).value;
    this.XmlObj.operator_Message = (document.getElementById('txt_OptMsg') as HTMLInputElement).value;
    this.XmlObj.messageType = this.selectedMsgType;
    this.XmlObj.createdBy = this.loginUser;
    this.XmlObj.createdDate = '';

    // Validation for empty Department ID
    if (
      !this.XmlObj.messageID ||
      !this.XmlObj.message ||
      !this.XmlObj.messageType
    ) {
      this.showSuccessPopup = false;

      setTimeout(() => {
        if (!this.XmlObj.messageID) {
          this.popupMessage = "Please Enter Message ID";
        } else if (!this.XmlObj.message) {
          this.popupMessage = "Please Enter Message";
        } else if (!this.XmlObj.messageType) {
          this.popupMessage = "Please Select Message Type";
        }

        this.isErrorPopup = true;
        this.showSuccessPopup = true;

        // Auto hide popup after 2 seconds
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 2000);
      }, 100);

      return;
    }

    this.showAddButton = true;
    this.showSubmitButton = false;
    const txt_MessageID = this.el.nativeElement.querySelector('#txt_MessageID');

    if (this.isadd === 'U') {
      // Update Record
      console.log('Update Request Payload:', JSON.stringify(this.XmlObj));

      const updateUrl = `${environment.apiBaseUrl}/api/XMLPacketMessageSetup/${this.XmlObj.messageID}`;
      this.http.put(updateUrl, this.XmlObj).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // Set success message              
          this.isErrorPopup = false; // Success popup
          this.showSuccessPopup = true; // Show popup
          this.popupMessage = msgR; // S/ Show popup
          this.showSuccessPopup = true;
          // Refresh grid and clear input fields
          this.lovDisabled();
          this.GetGrid();
          if (txt_MessageID) {
            this.renderer.removeAttribute(txt_MessageID, 'disabled');
          }
          this.XmlObj.messageID = '';
          this.XmlObj.message = '';
          this.XmlObj.operator_Message = '';
          this.ResetButton();
        },
        error: (err) => {
          console.error('Error during update:', err);
          this.popupMessage = 'Failed to update the record. Please try again.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
        }
      });
    } else if (this.isadd === 'I') {
      debugger;
      // Insert New Record
      const insertUrl = `${environment.apiBaseUrl}/api/XMLPacketMessageSetup`;
      this.http.post(insertUrl, this.XmlObj).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // Set success message              

          // Check if the response contains "0" and show custom message and error image if true
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
          this.GetGrid();
          this.lovDisabled();

          if (txt_MessageID) {
            this.renderer.removeAttribute(txt_MessageID, 'disabled');
          }
          this.XmlObj.messageID = '';
          this.XmlObj.message = '';
          this.XmlObj.operator_Message = ''
          this.ResetButton();

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
  confirmDelete(Obj: string) {
    console.log("Confirm delete called for deptid:", Obj); // Add logging
    this.MsgID = Obj;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }

  deleteRecord(objid: string) {
    debugger;
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const txt_ObjectID = this.el.nativeElement.querySelector('#txt_ObjectID')
    const body = {
      messageID: this.MsgID,
      message: '',
      operator_Message: '',
      messageType: '',
      createdBy: this.loginUser,
      createdDate: ''
    };

    const headers = { 'Content-Type': 'application/json' };

    this.http
      .delete(`${environment.apiBaseUrl}/api/XMLPacketMessageSetup/${this.MsgID}`, {
        headers: headers,
        body: body
      })
      .subscribe(
        (response: any) => {
          // Assuming response has a 'message' property

          const resMessage = response.message;
          let msgR = resMessage.split(';').slice(1).join(','); // slice(1) to remo
          msgR = msgR.replace('}', '').trim();
          msgR = msgR.replace('"', '').trim();
          // Assign message to popup
          this.popupMessage = msgR;
          this.filteredData = this.filteredData.filter((row) => row.objid !== objid);
          this.GetGrid();

          // Show the popup
          this.showSuccessPopup = true;
          this.MsgID = null;
          if (txt_ObjectID) {
            this.renderer.removeAttribute(txt_ObjectID, 'disabled'); // Enable input field
          }
          this.showModal = false;
          objid = '';
          this.ResetButton();
          this.AddFields();
        },
        (error) => {
          // Handle errors
          alert(`Error deleting record: ${error.message}`);
          console.error('Error Details:', error);
        }
      );
  }
}
