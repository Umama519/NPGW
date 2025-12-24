import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { environment } from 'environments/environment';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export class AlaramSetup {
  alarm: string;
  descrip: string;
  aType: string;
  almty: string;
  unit: string;
  value: string;
  email: string;
  admin: string;
  subject: string;
  mode: string;
  tuid: string;
  tdate: string;


  constructor() {
    this.alarm = '';
    this.descrip = '';
    this.aType = '';
    this.almty = '';
    this.unit = '';
    this.value = '';
    this.email = '';
    this.admin = '';
    this.subject = '';
    this.mode = '';
    this.tuid = '';
    this.tdate = '';
  }
}

export interface AlaramGet {
  alarm: any,
  descrip: any,
  aType: any,
  almty: any,
  unit: any,
  value: any,
  email: any,
  admin: any,
  subject: any,
  tuid: any,
  tdate: any
}

@Component({
  selector: 'app-public-alaramsetup-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './alarm-setup.component.html',
  styleUrl: './alarm-setup.component.css'
})
export class AlarmSetupComponent {
  AlaramSetupObj: AlaramSetup = new AlaramSetup();
  isAddMode: boolean = false; // 👈 Flag add kiya
  AlaramGet: AlaramGet[] = [];
  AlarmID: string | null = null;
  almty: string | null = null;
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  popupMessage: string = '';
  AlaramLov: any[] = [];   // sirf dropdown ke liye
  AlaramGrid: any[] = [];  // 
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  showModal: boolean = false; // For controlling modal visibility
  columnNames: any[] = [];
  selectedAlaramID: any = '';
  selectedDescription: any = '';
  selectedType: any = 'A';
  selectedUnit: any = 'D';
  selectedValue: any = '';
  selectedSubject: any = '';
  selectedEmail: any = '';
  selectedAdmin: any = '';
  optidDelete: string | null = null;
  isErrorPopup: boolean = false;
  isadd: string = '';
  loginUser: string = '';
  isDisabled: boolean = true;
  errmessage: string = "";
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;
  AlarmlovDisabled: boolean = false;
  AlarmTyplovDisabled: boolean = true;
  UnitlovDisabled: boolean = true;

  ngOnInit(): void {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_add');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    this.loadAlarms();  // LOV
    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtndisable')
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true')
    }
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled')
    }
    this.enabledisable();
    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.optid();
  }
    AlarmTypLov = [
    { code: 'A', name: 'Arrival' },
    { code: 'B', name: 'Before' },
    { code: 'L', name: 'Late' },
    { code: 'E', name: 'Error' }

  ];
  UnitLov = [
    { code: 'D', name: 'Days' },
    { code: 'H', name: 'Hours' },    
    { code: 'M', name: 'Minutes' }

  ];
  optid() {
    const operator_id = this.el.nativeElement.querySelector('#txt_Operatorid');
    operator_id.value = '';
    if (operator_id) {
      this.renderer.removeAttribute(operator_id, 'disabled')
    }
  }
  enabledisable() {
    const inputs = [

      // this.el.nativeElement.querySelector('#txt_Descrip'),
      
      this.el.nativeElement.querySelector('#txt_Value'),
      this.el.nativeElement.querySelector('#txt_Subject'),
      this.el.nativeElement.querySelector('#chb_Email'),
      this.el.nativeElement.querySelector('#chb_Admin'),
    ];
  

    inputs.forEach((input) => {
      if (input) {
        this.renderer.removeAttribute(input, 'disabled');
      }
    });

  }
  disableenable() {
    const inputs = [
      // this.el.nativeElement.querySelector('#txt_Descrip'),
      // this.el.nativeElement.querySelector('#ddl_Type'),
      // this.el.nativeElement.querySelector('#ddl_Unit'),
      this.el.nativeElement.querySelector('#txt_Value'),
      this.el.nativeElement.querySelector('#txt_Subject'),
      this.el.nativeElement.querySelector('#chb_Email'),
      this.el.nativeElement.querySelector('#chb_Admin'),
    ];

    inputs.forEach((input) => {
      if (input) {
        // Disable the input field
        this.renderer.setAttribute(input, 'disabled', 'true');


        // Clear the value of the input field
        if (input.type === 'checkbox') {
          input.checked = false; // For checkboxes
        } else {
          input.value = ''; // For other input fields
        }
      } else {
        this.renderer.removeAttribute(input, 'disabled');
      }
    });
  }

  edit(row: any): void {
    
    this.AlarmlovDisabled = true


    this.isAddMode = true;

    this.resetFormFields(); // Reset fields

    // Set values for form fields
    this.setFieldValue('#ddl_Alarm', row.alarm, true);
    this.setFieldValue('#txt_Descrip', row.descrip, true);
    this.setFieldValue('#ddl_Type', row.type, false);
    this.setFieldValue('#ddl_Unit', row.unit, false);
    this.setFieldValue('#txt_Value', row.value, false);
    this.setFieldValue('#chb_Admin', row.admin === 'Y', false);
    this.setFieldValue('#chb_Email', row.email === 'Y', false);
    this.setFieldValue('#txt_Subject', row.subject, false);
    // Set selected values
    this.selectedAlaramID = row.alarm;
    this.selectedDescription = row.descrip;
    this.selectedType = row.type;
    const msgTypeText = row.unit;

    let tempType = '';
    switch (msgTypeText) {
      case 'Days':
        tempType = 'D';
        break;
      case 'Hours':
        tempType = 'H';
        break;
      case 'Minutes':
        tempType = 'M';
        break;
      default:
        tempType = '';
    }

    this.selectedType = '';
    setTimeout(() => {
      this.selectedType = Type;
    }, 0);

    const msgType = row.almty;

    let Type = '';
    switch (msgType) {
      case 'Alarm':
        Type = 'A';
        break;
      case 'Before':
        Type = 'B';
        break;
      case 'Late':
        Type = 'L';
        break;
      case 'Error':
        Type = 'E';
        break;
      default:
        Type = '';
    }

    this.selectedUnit = '';
    setTimeout(() => {
      this.selectedUnit = tempType;
    }, 0);

    this.selectedUnit = row.unit;
    this.selectedType = row.type;
    // this.selectedType = row.operator_type;
    this.selectedValue = row.value;
    (document.getElementById('chb_Admin') as HTMLInputElement).checked = (row.admin === 'Y');
    (document.getElementById('chb_Email') as HTMLInputElement).checked = (row.email === 'Y');
    // this.selectedEmail = row.email === 'Y';
    // this.selectedAdmin = row.admin === 'Y';
    this.selectedSubject = row.subject;
    this.enabledisable(); // Enable/disable fields based on conditions
    this.ddl_Sta();
    this.isadd = 'U';
    this.SubmitField();
    this.buttobfun();
    this.showAddButton = false;
    this.showSubmitButton = true;
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');
    if (ddl_Type) {
      this.renderer.setAttribute(ddl_Type, 'disabled', 'true');
    }
    const txt_Descrip = this.el.nativeElement.querySelector('#txt_Descrip');
    if (txt_Descrip) {
      this.renderer.setAttribute(txt_Descrip, 'disabled', 'true');
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

  resetFormFields(): void {
    const fields = [
      '#ddl_Alarm', '#txt_Descrip', '#ddl_Type', '#ddl_Unit', '#txt_Value', '#chb_Email', '#chb_Admin'
    ];

    fields.forEach(selector => {
      const field = this.el.nativeElement.querySelector(selector);
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = false;
        } else {
          field.value = '';
        }
        this.renderer.removeAttribute(field, 'disabled');
      }
    });
  
  }
  buttobfun() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
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
  SubmitField() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Submit) {
      this.renderer.removeAttribute(btn_Submit, 'disabled')
    }
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    // }
  }

  GetGrid() {
    
    const url = `${environment.apiBaseUrl}/api/AlarmSetup`; // Fetch all data    
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.AlaramGet = res;
          this.GridData = res; // Save all data in GridData
          //this.AlaramLov = res;
          this.filteredData = res; // Initially display all data

        } else {
       //   console.log('No data found');
          this.AlaramGet = []; // Set empty array if no data is found
          this.optid();
        }
      },
      error: (err) => {
      //  console.error('Error fetching data:', err);
        this.AlaramGet = []; // Handle error by setting filteredData to empty
      }
    });
  }

  loadAlarms(): void {
    
    const url = `${environment.apiBaseUrl}/api/Alarm_LOV_`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.AlaramLov = res;
          this.selectedAlaramID = this.AlaramLov.length > 0 ? this.AlaramLov[0].alarm : '';
          this.selectedDescription = this.AlaramLov.length > 0 ? this.AlaramLov[0].descrip : '';
        } else {
       //   console.log('No data found');
          this.AlaramLov = [];
        }
      },
      error: (err) => {
    //    console.error('Error fetching data:', err);
        this.AlaramGet = []; // Handle error by setting filteredData to empty
      }
    });
  }

  onAlarmChange(): void {
    
    const selected = this.AlaramLov.find(x => x.alarm === this.selectedAlaramID);
    this.selectedDescription = selected ? selected.descrip : '';
  }

  AddButton(): void {
    this.enabledisable();
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    this.isAddMode = true;

    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true');
    }

    this.SubmitField();
    this.buttobfun();
    this.isadd = 'I';
      this.UnitlovDisabled = false;
    this.AlarmTyplovDisabled = false;
    this.showAddButton = false;
    this.showSubmitButton = true;
    // this.selectedAlaramID = '';

    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true');
    // }
    this.selectedType = 'A';
    this.selectedUnit = 'D';
    this.selectedAlaramID = this.AlaramLov.length > 0 ? this.AlaramLov[0].alarm : '';
    this.selectedDescription = this.AlaramLov.length > 0 ? this.AlaramLov[0].descrip : '';
    // const txt_Descrip = this.el.nativeElement.querySelector('#txt_Descrip');
    // if (txt_Descrip) {
    //   this.renderer.removeAttribute(txt_Descrip, 'disabled');
    // }
  }

  ddl_Sta() {
    const ddl_Status = this.el.nativeElement.querySelector('#ddl_Status')
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type')
    if (ddl_Status) {
      this.renderer.removeStyle(ddl_Status, 'background-color');
      this.renderer.setStyle(ddl_Status, 'background-color', '#fffff');
    }
    if (ddl_Type) {
      this.renderer.removeStyle(ddl_Type, 'background-color');
      this.renderer.setStyle(ddl_Type, 'background-color', '#ffffff');
    }
  }
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }
    this.selectedType = 'A';
    this.selectedUnit = 'D';
  }
  ResetFields() {
    const txt_Alaramid = this.el.nativeElement.querySelector('#ddl_Alarm');
    // txt_Alaramid.value = '';
    const txt_Descrip = this.el.nativeElement.querySelector('#txt_Descrip');
    // txt_Descrip.value = '';
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type');
    // ddl_Type.value = '';
    const ddl_Unit = this.el.nativeElement.querySelector('#ddl_Unit');
    // ddl_Unit.value = '';
    const txt_Value = this.el.nativeElement.querySelector('#txt_Value');
    txt_Value.value = '';
    const txt_Subject = this.el.nativeElement.querySelector('#txt_Subject');
    txt_Subject.value = '';
    const chb_Email = this.el.nativeElement.querySelector('#chb_Email');
    chb_Email.checked = false;
    const chb_Admin = this.el.nativeElement.querySelector('#chb_Admin');
    chb_Admin.checked = false;

    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

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
    if (txt_Alaramid) {
      this.renderer.removeAttribute(txt_Alaramid, 'disabled'); // Disable the input by setting 'disabled' attribute
      // txt_Alaramid.value = '';
    }
    if (txt_Descrip) {
      this.renderer.setAttribute(txt_Descrip, 'disabled', 'true');
      // txt_Descrip.value = '';
    } 
    if (txt_Value) {
      this.renderer.setAttribute(txt_Value, 'disabled', 'true');
      txt_Value.value = '';
    }
    if (txt_Subject) {
      this.renderer.setAttribute(txt_Subject, 'disabled', 'true');
      txt_Subject.value = '';
    }
    if (chb_Email) {
      this.renderer.setAttribute(chb_Email, 'disabled', 'true');
      chb_Email.checked = false;
    }
    if (chb_Admin) {
      this.renderer.setAttribute(chb_Admin, 'disabled', 'true');
      chb_Admin.checked = false;
    }
      this.UnitlovDisabled = true;
    this.AlarmTyplovDisabled = true;

    this.GetGrid();
    this.AddFields();
    // if (btn_Search) {
    //   this.renderer.removeAttribute(btn_Search, 'disabled')
    // }
  }
  ResetButton() {
    
    this.disableenable();
    this.ResetFields();
    this.AddFields();
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.AlarmlovDisabled = false;
    this.isAddMode = false;   // 👈 Reset pe bhi dropdown ho

    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.removeAttribute(btn_Search, 'disabled')
    // }

  }
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  resetdrp() {
    const ddl_Status = this.el.nativeElement.querySelector('#ddl_Status')
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type')
    const ddl_Alarm = this.el.nativeElement.querySelector('#ddl_Alarm')

    if (ddl_Status) {
      this.renderer.removeStyle(ddl_Status, 'background-color');
      this.renderer.setStyle(ddl_Status, 'background-color', '#efeeee');
    }
    if (ddl_Type) {
      this.renderer.removeStyle(ddl_Type, 'background-color');
      this.renderer.setStyle(ddl_Type, 'background-color', '#efeeee');
    }
    if (ddl_Alarm) {
      this.renderer.removeStyle(ddl_Alarm, 'background-color');
      this.renderer.setStyle(ddl_Alarm, 'background-color', '#efeeee');
    }
  }
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track

  searchButton() {
    
    const inputD = this.el.nativeElement.querySelector('#ddl_Alarm').value; // Get input value
    const url = `${environment.apiBaseUrl}/api/AlarmSetup/${inputD}`; // API URL with DepartmentID

    this.http.get<AlaramGet[]>(url).subscribe({
      next: (res: AlaramGet[]) => {
        if (res && res.length > 0) {
          this.AlaramGet = res;
          //this.filteredData = res;
        } else {
          this.popupMessage = 'No Record Found.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
          this.AlaramGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
    //    console.log('Error fetching data:', err);
        //this.filteredData = []; // Handle error by setting filteredData to empty
        this.AlaramGet = [];
      }
    });
  }
  AlaramData: AlaramSetup = new AlaramSetup();
  //operatorD: OperatorSet = new OperatorSet();

  submitButton() {
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    // Get input values
    this.AlaramData.alarm = this.selectedAlaramID;
    this.AlaramData.descrip = (document.getElementById('txt_Descrip') as HTMLInputElement).value;
    this.AlaramData.aType = this.AlaramData.descrip.trim().charAt(0).toUpperCase();
    this.AlaramData.unit = this.selectedUnit;
    this.AlaramData.value = (document.getElementById('txt_Value') as HTMLInputElement).value;
    this.AlaramData.almty = this.selectedType;
    this.AlaramData.subject = (document.getElementById('txt_Subject') as HTMLInputElement).value;
    const chkEmail = document.getElementById('chb_Email') as HTMLInputElement;
    this.AlaramData.email = chkEmail.checked ? 'Y' : 'N';

    const chkAdmin = document.getElementById('chb_Admin') as HTMLInputElement;
    this.AlaramData.admin = chkAdmin.checked ? 'Y' : 'N';
    this.AlaramData.mode = '';
    this.AlaramData.tuid = this.loginUser;
    this.AlaramData.tdate = new Date().toISOString();

    if (!this.AlaramData.alarm || !this.AlaramData.aType || !this.AlaramData.value || !this.AlaramData.subject || !this.AlaramData.unit) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage =
          !this.AlaramData.alarm ? 'Please Enter Alarm ID' :
            !this.AlaramData.aType ? 'Please Enter Alarm Type' :
            !this.AlaramData.value ?  'Please Enter Value' :
             'Please Enter Subject' 
              

        this.isErrorPopup = true;
        this.showSuccessPopup = true;
        return;
      }, 100);
      return;
    }
    this.showAddButton = true;
    this.showSubmitButton = false;
    const DID = this.el.nativeElement.querySelector('#ddl_Alarm');
    const srButton = this.el.nativeElement.querySelector('#btn_Search');
    const sbButton = this.el.nativeElement.querySelector('#btn_Submit');
    
    if (this.isadd === 'U') {
      
      // Update Record
      const updateUrl = `${environment.apiBaseUrl}/api/AlarmSetup/${this.AlaramData.alarm}`;
      this.http.put(updateUrl, this.AlaramData).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // Set success message              
          this.isErrorPopup = false; // Success popup
          this.showSuccessPopup = true;
          this.popupMessage = msgR;
          this.showSuccessPopup = true;

          this.GetGrid();
          this.AlarmlovDisabled = false;
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          if (sbButton) {
            this.renderer.removeAttribute(sbButton, 'disabled');
          }
          this.AlaramData.alarm = '';
          this.ResetFields();
          this.isSubmitting = false;
        },
        error: (err) => {
        //  console.error('Error during update:', err);
          this.popupMessage = 'Failed to update the record. Please try again.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
        }
      });
    } else if (this.isadd === 'I') {
    
      this.AlaramData.mode = 'DT';
      this.http.post(`${environment.apiBaseUrl}/api/AlarmSetup`, this.AlaramData).subscribe({
        next: (response: any) => {
  
          const msg = response.message || JSON.stringify(response);

          if (msg.startsWith("1")) {
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = false;
            this.popupMessage = msgR;
          } else if (msg.startsWith("0")) {
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = true;
            this.popupMessage = msgR;
          } else {
            this.isErrorPopup = false;
            this.popupMessage = "Unexpected response format!";
          }
          this.showSuccessPopup = true; // Show popup

          // Refresh grid and clear input fields
          this.GetGrid();
          this.ResetButton();
          this.optid();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          this.AlaramData.alarm = '';
          this.AlarmlovDisabled = false;          
          this.updateButtonStyles(srButton, sbButton);
          this.resetdrp();
          this.resetFormFields();
        },
        error: (err) => {
       //   console.error('Error during insert:', err);
          this.popupMessage = 'Failed to insert the record. Please try again.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
        }
      });
    } else {
    //  console.error('Invalid operation type in isadd');
      this.popupMessage = 'Invalid operation type.';
      this.isErrorPopup = true; // Error popup
      this.showSuccessPopup = true; // Show popup
      this.isSubmitting = false;
    }
  }

  updateButtonStyles(srButton: any, sbButton: any) {
    if (srButton) {
      this.renderer.removeAttribute(srButton, 'newbtndisable');
      this.renderer.addClass(srButton, 'newbtn');
    }
    if (sbButton) {
      this.renderer.removeClass(sbButton, 'newbtn');
      this.renderer.addClass(sbButton, 'newbtndisable');
    }
  }
  confirmDelete(AlarmID: string, almty: string) {
    
   // console.log("Confirm delete called for deptid:", AlarmID, almty); // Add logging
    this.AlarmID = AlarmID;
    this.almty = almty.trim().charAt(0).toUpperCase();
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  deleteRecord(hdate: string, almty: string) {
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    

    const txt_Alaramid = this.el.nativeElement.querySelector('#ddl_Alarm');

    // URL with 2 path parameters
    const url = `${environment.apiBaseUrl}/api/AlarmSetup/${this.AlarmID}/${this.almty}`;

    // Body required by API
    const body = {
      alarm: this.AlarmID,
      descrip: '',
      aType: '',
      almty: almty,
      unit: '',
      value: '',
      email: '',
      admin: '',
      subject: '',
      mode: '',
      tuid: 'NPGW',
      tdate: ''
    };

    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    };

    this.http.delete(url, options).subscribe(
      (response: any) => {
        

        const ab = JSON.stringify(response);
        const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
        this.popupMessage = msgR;

        // remove record from local grid
        this.filteredData = this.filteredData.filter(
          (row) => row.hdate !== hdate
        );

        this.GetGrid();

        this.showSuccessPopup = true;
        this.AlarmID = null;

        if (txt_Alaramid) {
          this.renderer.removeAttribute(txt_Alaramid, 'disabled');
        }

        this.showModal = false;
        this.ResetFields();
        this.AddFields();
      },
      (error) => {
    //    alert(`Error deleting record: ${error.message}`);
      //  console.error('Error Details:', error);
        this.isErrorPopup = true;
      }
    );
  }
  allowNumeric(event: KeyboardEvent) {
    const char = event.key;
    const pattern = /^[0-9]$/;
    if (!pattern.test(char)) {
      event.preventDefault(); // stops the key from being typed
    }
  }
}



