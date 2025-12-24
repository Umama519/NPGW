import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { environment } from 'environments/environment';

export class TimerSetup {
  timid: string;
  descrip: string;
  ttyp: string;
  tunt: string;
  unfor: string;
  tval: string;
  tuid: string;
  tdate: string;

  constructor() {
    this.timid = '';
    this.descrip = '';
    this.ttyp = '';
    this.tunt = '';
    this.tuid = '';
    this.tdate = '';
    this.unfor = '';
    this.tval = '';
  }
}

export interface TimerGet {
  timid: string,
  descrip: string,
  ttyp: string,
  tunt: string,
  unfor: string,
  tval: string,
  tuid: string,
  tdate: string,
}

@Component({
  selector: 'app-public-timer-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './timer-setup.component.html',
  styleUrl: './timer-setup.component.css'
})
export class TimerSetupComponent {

  TimerSetup: TimerSetup = new TimerSetup();
  showModal: boolean = false; // For controlling modal visibility
  RejectGet: TimerGet[] = [];
  isadd: string = '';
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  UnitNames: any[] = [];
  Unit: any[] = [];
  Role: any[] = [];           // Stores Action descriptions
  timidError: boolean = false;
  isTypeLovDisabled: boolean = true;  // default disabled
  isUnitLovDisabled: boolean = true;  // default disabled
  isUnitForLovDisabled: boolean = true;  // default disabled    
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  isErrorPopup: boolean = false;
  selectedTimid: string | null = null;
  selectedDesc: any = '';
  selectedtyp: any = 'E';
  selectedUnit: any = 'D';
  selectedUnitFor: any = '';
  selectedUnitId: any = '';
  selectedVal: any = '';
  loginUser: string = '';
  Tim: string | null = null;
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    debugger;
    this.EnabledFields();
    this.GetGrid();
    this.Operator_Lov();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';

  }
  TypeLov = [
    { code: 'E', name: 'External' },
    { code: 'I', name: 'Internal' }

  ];
  UnitLov = [
    { code: 'D', name: 'Day(s)' },
    { code: 'H', name: 'Hour(s)' },
    { code: 'M', name: 'Minute(s)' },
    { code: 'S', name: 'Second(s)' }

  ];
  buttobfun() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
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

  onUnitChange(event: Event) {
    debugger;
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log("Selected Value:", selectedValue);
    if (selectedValue) {
      this.TimerSetup.unfor = selectedValue;
      console.log("Updated TimerSetup.unfor:", this.TimerSetup.unfor);
    }
  }
  lovenabled() {
    this.isUnitLovDisabled = false;
    this.isUnitForLovDisabled = false;
    this.isTypeLovDisabled = false;
  }
  lovdisabled() {
    this.isUnitLovDisabled = true;
    this.isUnitForLovDisabled = true;
    this.isTypeLovDisabled = true;
    
  }
  edit(row: any): void {
    debugger;
    this.DisableFields();

    this.setFieldValue('#txt_Timid', row?.timid || '', true);
    this.setFieldValue('#txt_Description', row?.descrip || '', false);
    this.setFieldValue('#txt_Val', row?.tval || '', false);

    //this.selectedUnit = row.tunt;
    const msgTypeText = row.tunt?.toString().trim().toLowerCase() || '';
    let connValue = '';

    if (msgTypeText === 'day(s)') {
      connValue = 'D';
    } else if (msgTypeText === 'hour(s)') {
      connValue = 'H';
    } else if (msgTypeText === 'minute(s)') {
      connValue = 'M';
    } else if (msgTypeText === 'second(s)') {
      connValue = 'S';
    } else {
      connValue = '';
    }

    // Force rebind even if same value
    if (this.selectedUnit === connValue) {
      this.selectedUnit = '';  // temporarily clear it
      setTimeout(() => {
        this.selectedUnit = connValue;
      }, 0);
    } else {
      this.selectedUnit = connValue;
    }

    debugger

    const depValue = row.unfor?.toString().trim() || '';

    const exist = this.Role.some(role => role.trim().toLowerCase() === depValue.toLowerCase());
    if (!exist && depValue) {
      this.Role.push(depValue);  // add rlcd to Role array dynamically
    }
    this.selectedUnitFor = depValue;



    // this.selectedUnitFor = row.unfor; 

    this.selectedtyp = row.ttyp === 'Internal' ? 'I' : 'E';


    this.isadd = 'U';

    setTimeout(() => {
      this.selectedTimid = row?.timid || '';
      this.selectedDesc = row?.descrip || '';
      this.selectedVal = row?.tval || '';

      // values already set above
      this.EnabledFields();
      this.SubmitField();
      this.buttobfun();
      this.lovenabled();
      this.showAddButton = false;
      this.showSubmitButton = true;
      this.isadd = 'U';
    }, 100);
  }


  EnabledFields() {
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');
    const ddl_Unit = this.el.nativeElement.querySelector('#ddl_Unit');
    const ddl_UnitFor = this.el.nativeElement.querySelector('#ddl_UnitFor');
    const txt_Val = this.el.nativeElement.querySelector('#txt_Val');
    if (txt_Description) {
      this.renderer.removeAttribute(txt_Description, 'disabled');

    }
    if (ddl_Type) {
      this.renderer.removeAttribute(ddl_Type, 'disabled');

    }
    if (ddl_Unit) {
      this.renderer.removeAttribute(ddl_Unit, 'disabled');

    } if (ddl_UnitFor) {
      this.renderer.removeAttribute(ddl_UnitFor, 'disabled');

    } if (txt_Val) {
      this.renderer.removeAttribute(txt_Val, 'disabled');

    }
  }
  DisableFields() {
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');
    const ddl_Unit = this.el.nativeElement.querySelector('#ddl_Unit');
    const ddl_UnitFor = this.el.nativeElement.querySelector('#ddl_UnitFor');
    const txt_Val = this.el.nativeElement.querySelector('#txt_Val');

    if (txt_Description) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true');
    }
    if (ddl_Type) {
      this.renderer.setAttribute(ddl_Type, 'disabled', 'true');
    }
    if (ddl_Unit) {
      this.renderer.setAttribute(ddl_Unit, 'disabled', 'true');

    } if (ddl_UnitFor) {
      this.renderer.setAttribute(ddl_UnitFor, 'disabled', 'true');

    } if (txt_Val) {
      this.renderer.setAttribute(txt_Val, 'disabled', 'true');

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
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    }
    this.selectedtyp = 'E';
    this.selectedUnit = 'D';

    this.showAddButton = false;
    this.showSubmitButton = true;
    this.selectedUnitFor = this.UnitNames.length > 0 ? this.UnitNames[0].id : '';
    this.lovenabled();
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
    debugger;
    const url = `${environment.apiBaseUrl}/api/TimerSetup`; // Fetch all data
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
    debugger
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    this.TimerSetup.timid = (document.getElementById('txt_Timid') as HTMLInputElement).value; // Example: "2025-01-08"    

    this.TimerSetup.descrip = (document.getElementById('txt_Description') as HTMLInputElement).value;
    this.TimerSetup.ttyp = this.selectedtyp;
    this.TimerSetup.tunt = this.selectedUnit;
    this.TimerSetup.unfor = this.selectedUnitFor
    this.TimerSetup.tval = (document.getElementById('txt_Val') as HTMLInputElement).value;
    this.TimerSetup.tuid = this.loginUser;
    this.TimerSetup.tdate = '';

    if (!this.TimerSetup.timid || !this.TimerSetup.descrip || !this.TimerSetup.ttyp || !this.TimerSetup.tunt || !this.TimerSetup.unfor || !this.TimerSetup.tval) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        if (!this.TimerSetup.timid) {
          this.popupMessage = 'Please Enter Timer ID';
        }
        else if (!this.TimerSetup.descrip) {
          this.popupMessage = 'Please Enter Description';
        }
        else if (!this.TimerSetup.ttyp) {
          this.popupMessage = 'Please Enter Type';
        }
        else if (!this.TimerSetup.tunt) {
          this.popupMessage = 'Please Enter Unit.';
        }
        else if (!this.TimerSetup.unfor || this.TimerSetup.unfor === 'Select') {
          this.popupMessage = 'Please Enter Unit';
        }
        else if (!this.TimerSetup.tval) {
          this.popupMessage = 'Please Enter Value.';
        }
        else {
          this.popupMessage = 'Please Enter Timer ID.';
        }
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

      const updateUrl = `${environment.apiBaseUrl}/api/TimerSetup/${this.TimerSetup.timid}`;
      this.http.put(updateUrl, this.TimerSetup).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // Set success message              
          this.isErrorPopup = false; // Success popup
          this.showSuccessPopup = true; // Show popup
          this.popupMessage = msgR; // S/ Show popup
          this.showSuccessPopup = true;
          // Refresh grid and clear input fields
          this.lovdisabled();
          this.GetGrid();

          this.TimerSetup.timid = '';
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
      const insertUrl = `${environment.apiBaseUrl}/api/TimerSetup`;
      this.http.post(insertUrl, this.TimerSetup).subscribe({
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
          this.lovdisabled();
          this.GetGrid();

          this.TimerSetup.timid = '';
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
  confirmDelete(timi: string) {
    console.log("Confirm delete called for deptid:", timi); // Add logging
    this.Tim = timi;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }
  deleteRecord(Time: string) {
    debugger;
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const txt_Timid = this.el.nativeElement.querySelector('#txt_Timid')
    const body = {
      timid: this.Tim,
      descrip: '',
      ttyp: '',
      tunt: '',
      unfor: '',
      tval: '',
      tuid: this.loginUser,
      tdate: '',
    };

    const headers = { 'Content-Type': 'application/json' };

    this.http
      .delete(`${environment.apiBaseUrl}/api/TimerSetup/${this.Tim}`, {
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
          this.filteredData = this.filteredData.filter((row) => row.timid !== Time);
          this.GetGrid();

          // Show the popup
          this.showSuccessPopup = true;
          //  this.date = null;
          if (txt_Timid) {
            this.renderer.removeAttribute(txt_Timid, 'disabled'); // Enable input field
          }
          this.showModal = false;
          Time = '';
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
  Operator_Lov() {
    debugger;
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/BusinessUnit`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.UnitNames = data.map(Unit => ({
          id: Unit.dynvaL1,
          name: Unit.descrip
        }));
        this.selectedUnitFor = this.UnitNames.length > 0 ? this.UnitNames[0].id : '';
        console.log("Dropdown Data:", this.UnitNames);
      },
      error: (err) => {
        console.error("Error fetching Participant data:", err);
      }
    });
  }
  ResetFields() {
    const txt_Timid = this.el.nativeElement.querySelector('#txt_Timid');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');
    const ddl_Unit = this.el.nativeElement.querySelector('#ddl_Unit');
    const ddl_UnitFor = this.el.nativeElement.querySelector('#ddl_UnitFor');
    const txt_Val = this.el.nativeElement.querySelector('#txt_Val');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    if (txt_Timid) {
      this.renderer.removeAttribute(txt_Timid, 'disabled'); // Disable the input by setting 'disabled' attribute
      txt_Timid.value = '';
    }
    if (txt_Description) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute
      txt_Description.value = '';
    }
    if (ddl_Type) {
      this.renderer.setAttribute(ddl_Type, 'disabled', 'true');
      // ddl_Type.value = '';
    }
    if (ddl_Unit) {
      this.renderer.setAttribute(ddl_Unit, 'disabled', 'true');
      // ddl_Unit.value = '';
    } if (ddl_UnitFor) {
      this.renderer.setAttribute(ddl_UnitFor, 'disabled', 'true');
      // ddl_UnitFor.value = '';
    } if (txt_Val) {
      this.renderer.setAttribute(txt_Val, 'disabled', 'true');
      txt_Val.value = '';
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
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
  }
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }
    this.selectedtyp = 'E';
    this.selectedUnit = 'D';
    this.selectedUnitFor = this.UnitNames.length > 0 ? this.UnitNames[0].id : '';
  }
  searchButton() {
    debugger;
    const txt_Timid = this.el.nativeElement.querySelector('#txt_Timid').value; // Get input value
    const url = `${environment.apiBaseUrl}/api/TimerSetup/${txt_Timid}`; // API URL with DepartmentID

    this.http.get<TimerGet[]>(url).subscribe({
      next: (res: TimerGet[]) => {
        if (res && res.length > 0) {
          this.RejectGet = res;
          //this.filteredData = res; // Set filtered data from the API response
        } else {          
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
    this.lovdisabled();
    this.showAddButton = true;
    this.showSubmitButton = false;
  }
  allowAlphaNumeric(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[a-zA-Z0-9]$/;
    if (!pattern.test(char)) {
      event.preventDefault(); // stops the key from being typed
    }
  }
  allowNumeric(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[0-9]$/;
    if (!pattern.test(char)) {
      event.preventDefault(); // stops the key from being typed
    }
  }
}
