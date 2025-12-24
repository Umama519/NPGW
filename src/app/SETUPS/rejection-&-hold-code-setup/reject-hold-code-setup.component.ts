import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { environment } from 'environments/environment';

export class RejectHoldCodeSetup {
  rejcd: string;
  descrip: string;
  rtyp: string;
  reasondescrip: string;
  tuid: string;
  tdate: string;
  conn_type: string;
  status: string;
  timid: string;
  // uid: string;
  // Mtdate: string;

  constructor() {
    this.rejcd = '';
    this.descrip = '';
    this.rtyp = '';
    this.reasondescrip = '';
    this.tuid = '';
    this.tdate = '';
    this.conn_type = '';
    this.status = '';
    this.timid = '';
    // this.Muid = '';
    // this.Mtdate = '';
  }
}

export interface RejectGet {
  rejcd: string,
  descrip: string,
  rtyp: string,
  timid: string
  reasondescrip: string,
  conn_type: string,
  status: string
  tuid: string,
  tdate: string,
}

@Component({
  selector: 'app-reject-hold-code-setup',
  standalone: true,
  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './reject-hold-code-setup.component.html',
  styleUrl: './reject-hold-code-setup.component.css'
})
export class RejectHoldCodeSetupComponent {

  RejectObj: RejectHoldCodeSetup = new RejectHoldCodeSetup();
  showModal: boolean = false; // For controlling modal visibility
  RejectGet: RejectGet[] = [];
  isadd: string = '';
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  isErrorPopup: boolean = false;
  selectedRejcd: any = '';
  selectedRejDesc: any = '';
  Role: any[] = [];
  timerid: any[] = [];
  selectedCdtyp: any = '';
  selectedTimid: any = '';
  selectedRes: any = '';
  selectedConn: any = '';
  selectedSts: any = '';
  loginUser: string = '';
  CodelovDisabled: boolean = true; // Default disabled  
  TimerlovDisabled: boolean = true; // Default disabled  
  ConnectionlovDisabled: boolean = true; // Default disabled  
  StatuslovDisabled: boolean = true; // Default disabled  
  rejcd: string | null = null;
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.DisableFields();
    this.GetGrid();
    this.TimerIDLov()
    this.loginUser = localStorage.getItem('loginUser') || 'No user';

  }

  CodeType = [
    { code: 'R', name: 'Rejection' },
    { code: 'H', name: 'Hold' }

  ];
  ConnectionType = [
    { code: 'R', name: 'Prepaid' },
    { code: 'O', name: 'PostPaid' },
    { code: 'B', name: 'Both' }

  ];
  TimerLov = [
    { code: 'E', name: 'Enabled' },
    { code: 'D', name: 'Disable' }


  ];
  buttobfun() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    //const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtndisable'); // Remove the old class
      this.renderer.addClass(btn_Submit, 'newbtn');
    }
    // if (btn_Search) {
    //   this.renderer.removeClass(btn_Search, 'newbtn');
    //   this.renderer.addClass(btn_Search, 'newbtndisable');
    // }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtn');
      this.renderer.addClass(btn_add, 'newbtndisable');
    }
  }
  setFieldValue(selector: string, value: any, disabled: boolean): void {
    const field = this.el.nativeElement.querySelector(selector);
    if (field) {
      this.renderer.setProperty(field, 'value', value);
      if (disabled) {
        this.renderer.setAttribute(field, 'disabled', 'true');
      } else {
        this.renderer.removeAttribute(field, 'disabled');
      }
    }
    this.buttobfun();
  }

  TimerIDLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/TIMERID`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.timerid = data;
      },
      error: (err) => {
        console.error("Error fetching Actions:", err);
      }
    });
  }
  edit(row: any): void {
    this.DisableFields();

    this.setFieldValue('#txt_RejCode', row?.rejcd || '', true);
    this.setFieldValue('#txt_Description', row?.descrip || '', false);
    this.setFieldValue('#ddl_cdType', row?.rtyp || '', false);
    this.setFieldValue('#txt_Timer', row?.timid || '', false);
    this.setFieldValue('#txt_Reason', row?.reasondescrip || '', false);
    this.setFieldValue('#ddl_ConnectionType', row?.conn_type || '', false);
    this.setFieldValue('#ddl_Status', row?.status || '', false);

    this.isadd = 'U';

    setTimeout(() => {
      debugger
      this.selectedRejcd = row?.rejcd || '';
      this.selectedRejDesc = row?.descrip || '';
      const msgTypeText = row.conn_type?.toString().trim().toLowerCase() || '';
      let connValue = '';

      if (msgTypeText === 'prepaid') {
        connValue = 'R';
      } else if (msgTypeText === 'postpaid') {
        connValue = 'O';
      } else if (msgTypeText === 'both') {
        connValue = 'B';
      } else {
        connValue = '';
      }
      if (this.selectedConn === connValue) {
        this.selectedConn = '';  // temporarily clear it
        setTimeout(() => {
          this.selectedConn = connValue;
        }, 0);
      } else {
        this.selectedConn = connValue;
      }
      this.selectedRes = row?.reasondescrip || '';
      this.selectedTimid = row.timid;
      const msg = row.status?.toString().trim().toLowerCase() || '';
      let conn = '';
      if (msg === 'enable') {
        conn = 'E';
      } else if (msg === 'disable') {
        conn = 'D';
      } else {
        conn = '';
      }

      // Force rebind even if same value
      if (this.selectedSts === conn) {
        this.selectedSts = '';  // temporarily clear it
        setTimeout(() => {
          this.selectedSts = conn;
        }, 0);
      } else {
        this.selectedSts = conn;
      }
      const msgCon = row.rtyp?.toString().trim().toLowerCase() || '';
      let con = '';

      if (msgCon === 'rejection') {
        con = 'R';
      } else if (msgCon === 'hold') {
        con = 'H';
      } else {
        con = '';
      }

      // Force rebind even if same value
      if (this.selectedCdtyp === con) {
        this.selectedCdtyp = '';  // temporarily clear it
        setTimeout(() => {
          this.selectedCdtyp = con;
        }, 0);
      } else {
        this.selectedCdtyp = con;
      }
      //this.selectedCdtyp = row?.rtyp || '';

      this.EnabledFields();
      this.SubmitField();
      this.buttobfun();
      this.lovenabled();
      this.isadd = 'U';
      this.showAddButton = false;
      this.showSubmitButton = true;
    }, 100);
  }
  lovenabled() {
    this.CodelovDisabled = false;
    this.TimerlovDisabled = false;
    this.ConnectionlovDisabled = false;
    this.StatuslovDisabled = false;
  }
  lovdisabled() {
    this.CodelovDisabled = true;
    this.TimerlovDisabled = true;
    this.ConnectionlovDisabled = true;
    this.StatuslovDisabled = true;
    this.selectedCdtyp = null;
    this.selectedSts = null;
    this.selectedTimid = null;
    this.selectedConn = null;
  }

  EnabledFields() {
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_cdType = this.el.nativeElement.querySelector('#ddl_cdType');
    const txt_Reason = this.el.nativeElement.querySelector('#txt_Reason');
    const txt_Timer = this.el.nativeElement.querySelector('#txt_Timer');
    const txt_ConnectionType = this.el.nativeElement.querySelector('#ddl_ConnectionType');
    const txt_Status = this.el.nativeElement.querySelector('#ddl_Status');
    if (txt_Description) {
      this.renderer.removeAttribute(txt_Description, 'disabled');

    }
    if (txt_cdType) {
      this.renderer.removeAttribute(txt_cdType, 'disabled');

    }
    if (txt_Reason) {
      this.renderer.removeAttribute(txt_Reason, 'disabled');

    } if (txt_Timer) {
      this.renderer.removeAttribute(txt_Timer, 'disabled');

    } if (txt_ConnectionType) {
      this.renderer.removeAttribute(txt_ConnectionType, 'disabled');

    } if (txt_Status) {
      this.renderer.removeAttribute(txt_Status, 'disabled');

    }

  }
  DisableFields() {
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_cdType = this.el.nativeElement.querySelector('#ddl_cdType');
    const txt_Reason = this.el.nativeElement.querySelector('#txt_Reason');
    const txt_Timer = this.el.nativeElement.querySelector('#txt_Timer');
    const txt_ConnectionType = this.el.nativeElement.querySelector('#ddl_ConnectionType');
    const txt_Status = this.el.nativeElement.querySelector('#ddl_Status');

    if (txt_Description) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true');
    }
    if (txt_cdType) {
      this.renderer.setAttribute(txt_cdType, 'disabled', 'true');
    }
    if (txt_Reason) {
      this.renderer.setAttribute(txt_Reason, 'disabled', 'true');

    } if (txt_Timer) {
      this.renderer.setAttribute(txt_Timer, 'disabled', 'true');

    } if (txt_ConnectionType) {
      this.renderer.setAttribute(txt_ConnectionType, 'disabled', 'true');

    } if (txt_Status) {
      this.renderer.setAttribute(txt_Status, 'disabled', 'true');

    }


  }
  AddButton(): void {

    this.EnabledFields();
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true'); // Enable input field
    }
    this.SubmitField();
    this.buttobfun();
    this.isadd = 'I';
    this.showAddButton = false;
    this.showSubmitButton = true;
    this.lovenabled()
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    }

  }
  SubmitField() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Submit) {
      this.renderer.removeAttribute(btn_Submit, 'disabled')
    }
    if (btn_Search) {
      this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    }
  }
  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/RejectHoldCodeSetup`; // Fetch all data
    const txt_RejCode = this.el.nativeElement.querySelector('#txt_RejCode')
    const Description = this.el.nativeElement.querySelector('#txt_Description')
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.RejectGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // Initially display all data
          txt_RejCode.value = '';
          Description.value = '';
          if (Description) {
            this.renderer.setAttribute(Description, 'disabled', 'true');
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
  submitButton() {
    debugger;
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    const rejcode = (document.getElementById('txt_RejCode') as HTMLInputElement).value; // Example: "2025-01-08"    
    this.RejectObj.rejcd = rejcode; // Reformat to "DD-MM-YYYY"
    this.RejectObj.descrip = (document.getElementById('txt_Description') as HTMLInputElement).value.replace(/&amp;/g, "&");

    this.RejectObj.rtyp = this.selectedCdtyp;
    this.RejectObj.reasondescrip = (document.getElementById('txt_Reason') as HTMLInputElement).value.replace(/&amp;/g, "&");
    this.RejectObj.timid = this.selectedTimid;
    this.RejectObj.conn_type = this.selectedConn;
    this.RejectObj.status = this.selectedSts;
    this.RejectObj.tuid = this.loginUser;
    this.RejectObj.tdate = '';
    // this.RejectObj.Muid = this.loginUser;
    // this.RejectObj.Mtdate = new Date().toISOString(); 


    if (
      !this.RejectObj.rejcd ||
      !this.RejectObj.descrip ||
      !this.RejectObj.rtyp ||
      !this.RejectObj.conn_type ||
      !this.RejectObj.status
    ) {
      this.showSuccessPopup = false;

      setTimeout(() => {
        this.popupMessage =
          !this.RejectObj.rejcd ? 'Please Enter Rejection Code' :
          !this.RejectObj.descrip ? 'Please Enter Description' :
            !this.RejectObj.rtyp ? 'Please Select Code Type' :
              !this.RejectObj.conn_type ? 'Please Select Connection Type' :
                !this.RejectObj.status ? 'Please Select Status' :
                  ''; // Default, kabhi nahi aayega
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);

      return;
    }

    this.showAddButton = true;
    this.showSubmitButton = false;

    if (this.isadd === 'U') {
      debugger;
      // Update Record

      const updateUrl = `${environment.apiBaseUrl}/api/RejectHoldCodeSetup/${this.RejectObj.rejcd}`;
      this.http.put(updateUrl, this.RejectObj).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // Set success message              
          this.isErrorPopup = false; // Success popup
          this.showSuccessPopup = true; // Show popup
          this.popupMessage = msgR; // S/ Show popup
          this.showSuccessPopup = true;
          // Refresh grid and clear input fields
          this.GetGrid();
          this.lovdisabled();


          this.RejectObj.rejcd = '';
          //this.holidayData.tuserid = '';
          this.ResetFields();
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
      const insertUrl = `${environment.apiBaseUrl}/api/RejectHoldCodeSetup`;
      this.http.post(insertUrl, this.RejectObj).subscribe({
        next: (response: any) => {
          debugger;

          // API se aaya hua message nikalo
          const msg = response.message || JSON.stringify(response);

          // 👉 Check karo 1 se start ya 0 se
          if (msg.startsWith("0")) {
            // Error case
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = true;
            this.popupMessage = msgR;
          } else if (msg.startsWith("1")) {
            // Success case
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = false;
            this.popupMessage = msgR;
          } else {
            // Unknown response
            this.isErrorPopup = true;
            this.popupMessage = "Unexpected response format!";
          }
          this.showSuccessPopup = true; // Show popup

          // Refresh grid and clear input fields
          this.GetGrid();
          this.lovdisabled();


          this.RejectObj.rejcd = '';
          //this.holidayData.tuserid = '';
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
  confirmDelete(rej: string) {
    console.log("Confirm delete called for deptid:", rej); // Add logging
    this.rejcd = rej;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }
  deleteRecord(rejcd: string) {

    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const RejectCode = this.el.nativeElement.querySelector('#txt_RejCode')
    const body = {
      rejcd: this.rejcd,
      descrip: '',
      rtyp: '',
      reasondescrip: '',
      tuid: this.loginUser,
      tdate: '',
      conn_type: '',
      status: '',
      timid: '',

    };

    const headers = { 'Content-Type': 'application/json' };

    this.http
      .delete(`${environment.apiBaseUrl}/api/RejectHoldCodeSetup/${this.rejcd}`, {
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
          this.filteredData = this.filteredData.filter((row) => row.rejcd !== rejcd);
          this.GetGrid();

          // Show the popup
          this.showSuccessPopup = true;
          //  this.date = null;
          if (RejectCode) {
            this.renderer.removeAttribute(RejectCode, 'disabled'); // Enable input field
          }
          this.showModal = false;
          rejcd = '';
          this.ResetFields();
          //this.AddFields();        
        },
        (error) => {
          // Handle errors
          alert(`Error deleting record: ${error.message}`);
          console.error('Error Details:', error);
        }
      );
  }
  ResetFields() {
    const txt_RejCode = this.el.nativeElement.querySelector('#txt_RejCode');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_cdType = this.el.nativeElement.querySelector('#ddl_cdType');
    const txt_Reason = this.el.nativeElement.querySelector('#txt_Reason');
    const txt_Timer = this.el.nativeElement.querySelector('#txt_Timer');
    const txt_ConnectionType = this.el.nativeElement.querySelector('#ddl_ConnectionType');
    const txt_Status = this.el.nativeElement.querySelector('#ddl_Status');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    if (txt_RejCode) {
      this.renderer.removeAttribute(txt_RejCode, 'disabled'); // Disable the input by setting 'disabled' attribute
      txt_RejCode.value = '';
    }
    if (txt_Description) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute
      txt_Description.value = '';
    }
    if (txt_cdType) {
      this.renderer.setAttribute(txt_cdType, 'disabled', 'true');
      txt_cdType.value = '';
    }
    if (txt_Reason) {
      this.renderer.setAttribute(txt_Reason, 'disabled', 'true');
      txt_Reason.value = '';
    } if (txt_Timer) {
      this.renderer.setAttribute(txt_Timer, 'disabled', 'true');
      txt_Timer.value = '';
    } if (txt_ConnectionType) {
      this.renderer.setAttribute(txt_ConnectionType, 'disabled', 'true');
      txt_ConnectionType.value = '';
    } if (txt_Status) {
      this.renderer.setAttribute(txt_Status, 'disabled', 'true');
      txt_Status.value = '';
    }
    // if (btn_Search) {
    //   this.renderer.removeClass(btn_Search, 'newbtndisable');
    //   this.renderer.addClass(btn_Search, 'newbtn');
    // }

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.GetGrid();
    this.AddFields();
    this.lovdisabled();
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
  }
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }

  }
  searchButton() {
    debugger;
    const txt_RejCode = this.el.nativeElement.querySelector('#txt_RejCode').value; // Get input value
    const url = `${environment.apiBaseUrl}/api/RejectHoldCodeSetup/${txt_RejCode}`; // API URL with DepartmentID

    this.http.get<RejectGet[]>(url).subscribe({
      next: (res: RejectGet[]) => {
        if (res && res.length > 0) {
          this.RejectGet = res;
          //this.filteredData = res; // Set filtered data from the API response
        } else {
          // alert('No data found for the given Department ID.');
          // this.filteredData = [];
          this.RejectGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
        console.log('Error fetching data:', err);
        //this.filteredData = []; // Handle error by setting filteredData to empty
        this.RejectGet = [];
      }
    });
  }

  ResetButton() {
    this.ResetFields();
    this.showAddButton = true;
    this.showSubmitButton = false;
  }
}
