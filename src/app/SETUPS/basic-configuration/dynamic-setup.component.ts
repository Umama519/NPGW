import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { TranslatePipe } from '../../translate.pipe';
import { environment } from 'environments/environment';

export class DynamicSetup {
  dyncd: string;
  descrip: string;
  dynval1: string;
  dynval2: string;
  dynval3: string;
  dynval4: string;
  definE_BY: string;
  definE_DATE: string;
  modifY_BY: string;
  modifY_DATE: string;
  constructor() {
    this.dyncd = '';
    this.descrip = '';
    this.dynval1 = '';
    this.dynval2 = '';
    this.dynval3 = '';
    this.dynval4 = '';
    this.definE_BY = '';
    this.definE_DATE = new Date().toISOString();
    this.modifY_BY = '';
    this.modifY_DATE = new Date().toISOString();

  }
}
export interface DynamicGet {
  dyncd: string,
  descrip: string,
  dynval1: string,
  dynval2: string,
  dynval3: string,
  dynval4: string,
  definE_BY: string,
  definE_DATE: string,
  modifY_BY: string,
  modifY_DATE: string,
}
@Component({
  selector: 'app-public-dynamicsetup-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, TranslatePipe],
  templateUrl: './dynamic-setup.component.html',
  styleUrl: './dynamic-setup.component.css'
})
export class DynamicSetupComponent {
  dynamicObj: DynamicSetup = new DynamicSetup();
  dynamicGet: DynamicGet[] = [];
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  dyncdToDelete: string | null = null;
  showModal: boolean = false; // For controlling modal visibility
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedDeptid: string = '';
  selectedDname: string = '';
  isadd: string = '';
  loginUser: string = '';
  selectedDynamicCode: string = '';
  selectedDescription: string = '';
  selectedDynamicVal1: string = '';
  selectedDynamicVal2: string = '';
  selectedDynamicVal3: string = '';
  selectedDynamicVal4: string = '';
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;
  ngOnInit(): void {
    this.LoadFields();
    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }
  LoadFields() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit')

    if (btn_Submit) {
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
  }
  // export(format: 'pdf' | 'xls' | 'csv') {
  //   const config: ExportAsConfig = {
  //     type: format,
  //     elementIdOrContent: 'tableToExport', // 👈 table id
  //   };

  //   this.exportAsService.save(config, 'Department Setup').subscribe(() => {
  //   });
  // }
  edit(row: any): void {
    const txt_DynamicCode = this.el.nativeElement.querySelector('#txt_DynamicCode');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_DynamicVal1 = this.el.nativeElement.querySelector('#txt_DynamicVal1');
    const txt_DynamicVal2 = this.el.nativeElement.querySelector('#txt_DynamicVal2');
    const txt_DynamicVal3 = this.el.nativeElement.querySelector('#txt_DynamicVal3');
    const txt_DynamicVal4 = this.el.nativeElement.querySelector('#txt_DynamicVal4');
    if (txt_DynamicCode && txt_Description && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4) {
      this.renderer.setProperty(txt_DynamicCode, 'value', row.dyncd); // Set the value
      this.renderer.setAttribute(txt_DynamicCode, 'disabled', 'true'); // Disable the field
      this.renderer.setProperty(txt_Description, 'value', row.descrip); // Set the value
      this.renderer.setAttribute(txt_Description, 'disabled', 'true'); // Disable the field
      this.renderer.setProperty(txt_DynamicVal1, 'value', row.dynval1); // Set the value
      this.renderer.setAttribute(txt_DynamicVal1, 'disabled', 'true'); // Disable the field
      this.renderer.setProperty(txt_DynamicVal2, 'value', row.dynval2); // Set the value
      this.renderer.setAttribute(txt_DynamicVal2, 'disabled', 'true'); // Disable the field
      this.renderer.setProperty(txt_DynamicVal3, 'value', row.dynval3); // Set the value
      this.renderer.setAttribute(txt_DynamicVal3, 'disabled', 'true'); // Disable the field
      this.renderer.setProperty(txt_DynamicVal4, 'value', row.dynval4); // Set the value
      this.renderer.setAttribute(txt_DynamicVal4, 'disabled', 'true'); // Disable the field
    }

    if (txt_Description && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4) {
      this.renderer.removeAttribute(txt_Description, 'disabled');
      this.renderer.removeAttribute(txt_DynamicVal1, 'disabled');// || txt_DynamicVal1 || txt_DynamicVal2 || txt_DynamicVal3 || txt_DynamicVal4
      this.renderer.removeAttribute(txt_DynamicVal2, 'disabled');
      this.renderer.removeAttribute(txt_DynamicVal3, 'disabled');
      this.renderer.removeAttribute(txt_DynamicVal4, 'disabled');
    }
    this.SubmitField();
    this.buttobfun();
    this.selectedDynamicCode = row.dyncd;
    this.selectedDescription = row.descrip;
    this.selectedDynamicVal1 = row.dynval1;
    this.selectedDynamicVal2 = row.dynval2;
    this.selectedDynamicVal3 = row.dynval3;
    this.selectedDynamicVal4 = row.dynval4;
    this.showAddButton = false;
    this.showSubmitButton = true;
    this.isadd = 'U';
  }
  buttobfun() {
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
  }
  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/DynamicSetup`; // Fetch all data
    const txt_DynamicCode = this.el.nativeElement.querySelector('#txt_DynamicCode');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_DynamicVal1 = this.el.nativeElement.querySelector('#txt_DynamicVal1');
    const txt_DynamicVal2 = this.el.nativeElement.querySelector('#txt_DynamicVal2');
    const txt_DynamicVal3 = this.el.nativeElement.querySelector('#txt_DynamicVal3');
    const txt_DynamicVal4 = this.el.nativeElement.querySelector('#txt_DynamicVal4');
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.dynamicGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // Initially display all data
          txt_DynamicCode.value = '';
          txt_Description.value = '';
          txt_DynamicVal1.value = '';
          txt_DynamicVal2.value = '';
          txt_DynamicVal3.value = '';
          txt_DynamicVal4.value = '';
          if (txt_Description && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4) {
            this.renderer.setAttribute(txt_Description, 'disabled', 'true'); //|| txt_DynamicVal1 || txt_DynamicVal2 || txt_DynamicVal3 || txt_DynamicVal4
            this.renderer.setAttribute(txt_DynamicVal1, 'disabled', 'true');
            this.renderer.setAttribute(txt_DynamicVal2, 'disabled', 'true');
            this.renderer.setAttribute(txt_DynamicVal3, 'disabled', 'true');
            this.renderer.setAttribute(txt_DynamicVal4, 'disabled', 'true');
          }
        } else {
          this.filteredData = []; // Set empty array if no data is found
        }
      },
      error: (err) => {
        //   console.error('Error fetching data:', err);
        this.filteredData = []; // Handle error by setting filteredData to empty
      }
    });
  }
  SubmitField() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    //const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Submit) {
      this.renderer.removeAttribute(btn_Submit, 'disabled')
    }
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    // }
  }
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }
  }
  AddButton(): void {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_DynamicVal1 = this.el.nativeElement.querySelector('#txt_DynamicVal1');
    const txt_DynamicVal2 = this.el.nativeElement.querySelector('#txt_DynamicVal2');
    const txt_DynamicVal3 = this.el.nativeElement.querySelector('#txt_DynamicVal3');
    const txt_DynamicVal4 = this.el.nativeElement.querySelector('#txt_DynamicVal4');
    if (txt_Description && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4) { // && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4 // && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4
      this.renderer.removeAttribute(txt_Description, 'disabled');
      this.renderer.removeAttribute(txt_DynamicVal1, 'disabled');
      this.renderer.removeAttribute(txt_DynamicVal2, 'disabled');
      this.renderer.removeAttribute(txt_DynamicVal3, 'disabled');
      this.renderer.removeAttribute(txt_DynamicVal4, 'disabled');
    }
    this.SubmitField();
    this.buttobfun();
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtn'); // Remove the old class
      this.renderer.addClass(btn_add, 'newbtndisable');
      this.renderer.setAttribute(btn_add, 'disabled', 'true')
    }
    this.showAddButton = false;
    this.showSubmitButton = true;
    this.isadd = 'I';
  }
  ResetButton() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.AddFields();
    this.ResetFields();
    if (btn_add) {
      this.renderer.addClass(btn_add, 'newbtn'); // Remove the old class
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.removeAttribute(btn_add, 'disabled')
    }
  }
  isSubmitting: boolean = false;  // Track
  closePopup() {    
    this.showSuccessPopup = false;
  }
  ResetFields() {
    const txt_DynamicCode = this.el.nativeElement.querySelector('#txt_DynamicCode');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_DynamicVal1 = this.el.nativeElement.querySelector('#txt_DynamicVal1');
    const txt_DynamicVal2 = this.el.nativeElement.querySelector('#txt_DynamicVal2');
    const txt_DynamicVal3 = this.el.nativeElement.querySelector('#txt_DynamicVal3');
    const txt_DynamicVal4 = this.el.nativeElement.querySelector('#txt_DynamicVal4');
    //const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (txt_Description && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true');
      this.renderer.setAttribute(txt_DynamicVal1, 'disabled', 'true');
      this.renderer.setAttribute(txt_DynamicVal2, 'disabled', 'true');
      this.renderer.setAttribute(txt_DynamicVal3, 'disabled', 'true');
      this.renderer.setAttribute(txt_DynamicVal4, 'disabled', 'true');      
      txt_Description.value = '';
      txt_DynamicVal1.value = '';
      txt_DynamicVal2.value = '';
      txt_DynamicVal3.value = '';
      txt_DynamicVal4.value = '';
    }
    // if (btn_Search) {
    //   this.renderer.removeClass(btn_Search, 'newbtndisable');
    //   this.renderer.addClass(btn_Search, 'newbtn');
    // }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (txt_DynamicCode) {
      this.renderer.removeAttribute(txt_DynamicCode, 'disabled'); // Disable the input by setting 'disabled' attribute
    }
    this.GetGrid();
  }
  searchButton() {    
    const txt_DynamicCode = this.el.nativeElement.querySelector('#txt_DynamicCode').value;
    const url = `${environment.apiBaseUrl}/api/DynamicSetup/${txt_DynamicCode}`; // API URL with DepartmentID

    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.dynamicGet = res;
          this.filteredData = res; // Set filtered data from the API response
        } else {          
          this.filteredData = [];
          this.dynamicGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {        
        this.filteredData = []; // Handle error by setting filteredData to empty
        this.dynamicGet = [];
      }
    });
  }
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  dynamicData: DynamicSetup = new DynamicSetup();
  submitButton() {
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    this.dynamicData.dyncd = (document.getElementById('txt_DynamicCode') as HTMLInputElement).value;
    this.dynamicData.descrip = (document.getElementById('txt_Description') as HTMLInputElement).value;
    this.dynamicData.dynval1 = (document.getElementById('txt_DynamicVal1') as HTMLInputElement).value;
    this.dynamicData.dynval2 = (document.getElementById('txt_DynamicVal2') as HTMLInputElement).value;
    this.dynamicData.dynval3 = (document.getElementById('txt_DynamicVal3') as HTMLInputElement).value;
    this.dynamicData.dynval4 = (document.getElementById('txt_DynamicVal4') as HTMLInputElement).value;
    this.dynamicData.definE_BY = this.loginUser;
    this.dynamicData.definE_DATE = new Date().toISOString();    
    if (
      !this.dynamicData.dyncd ||
      !this.dynamicData.descrip ||
      !this.dynamicData.dynval1
    ) {
      this.showSuccessPopup = false;
      setTimeout(() => {
      this.popupMessage =
       !this.dynamicData.dyncd ? 'Please Enter Dynamic Code' : !this.dynamicData.descrip ? 'Please Enter Description' :
       'Please Enter Dynamic Value 1';
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }
    this.showAddButton = true;
    this.showSubmitButton = false;
    const DID = this.el.nativeElement.querySelector('#txt_DynamicCode');

    // 🔹 UPDATE CASE
    if (this.isadd === 'U') {
      this.dynamicData.modifY_BY = this.loginUser;            // loginUser
      this.dynamicData.modifY_DATE = new Date().toISOString(); // system date

      const url = `${environment.apiBaseUrl}/api/DynamicSetup/${this.dynamicData.dyncd}`;
      this.http.put(url, this.dynamicData).subscribe({
        next: (res) => {
          const ab = JSON.stringify(res);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR;
          this.isErrorPopup = false;
          this.showSuccessPopup = true;
          this.GetGrid();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          this.dynamicData.dyncd = '';
          this.dynamicData.descrip = '';
          this.dynamicData.dynval1 = '';
          this.dynamicData.dynval2 = '';
          this.dynamicData.dynval3 = '';
          this.dynamicData.dynval4 = '';
          this.ResetFields();
          this.AddFields();
        },        
      });
    }
    else if (this.isadd === 'I') {
      const insertUrl = `${environment.apiBaseUrl}/api/DynamicSetup`;
      this.http.post(insertUrl, this.dynamicData).subscribe({
        next: (response: any) => {
          const msg = response.message || JSON.stringify(response);          
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
            this.isErrorPopup = true;
            this.popupMessage = "Unexpected response format!";
          }
          this.showSuccessPopup = true;
          this.GetGrid();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          this.dynamicData.dyncd = '';
          this.dynamicData.descrip = '';
          this.dynamicData.dynval1 = '';
          this.dynamicData.dynval2 = '';
          this.dynamicData.dynval3 = '';
          this.dynamicData.dynval4 = '';
          this.ResetFields();
          this.AddFields();
        },
        error: (err) => {     
          this.popupMessage = 'Failed to insert the record. Please try again.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
          this.isSubmitting = false;
        }
      });
    }
    else {      
      this.popupMessage = 'Invalid operation type.';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      this.isSubmitting = false;
    }
  }
  confirmDelete(dyncd: string) {    
    this.dyncdToDelete = dyncd;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
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
  deleteRecord(dyncd: string) {
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    const body = {
      dyncd: this.dyncdToDelete,
      descrip: '',
      dynval1: '',
      dynval2: '',
      dynval3: '',
      dynval4: '',
      definE_BY: this.loginUser,
      definE_DATE: '',
      modifY_BY: '',
      modifY_DATE: ''
    };
    const headers = { 'Content-Type': 'application/json' };
    this.http
      .delete(`${environment.apiBaseUrl}/api/DynamicSetup/${this.dyncdToDelete}`, {
        headers: headers,
        body: body
      })
      .subscribe(
        (response: any) => {          
          const resMessage = response.message;
          let msgR = resMessage.split(';').slice(1).join(','); // slice(1) to remo
          msgR = msgR.replace('}', '').trim();
          msgR = msgR.replace('"', '').trim();          
          this.popupMessage = msgR;          
          this.filteredData = this.filteredData.filter((row) => row.dyncd !== dyncd);        
          this.GetGrid();
          this.showSuccessPopup = true;
          this.dyncdToDelete = null; // Reset de
          const txt_DynamicCode = this.el.nativeElement.querySelector('#txt_DynamicCode');
          if (txt_DynamicCode) {
            this.renderer.removeAttribute(txt_DynamicCode, 'disabled'); // Enable input field
          }
          this.showModal = false;          
          this.dynamicData.dyncd = '';
          this.dynamicData.descrip = '';
          this.dynamicData.dynval1 = '';
          this.dynamicData.dynval2 = '';
          this.dynamicData.dynval3 = '';
          this.dynamicData.dynval4 = '';
          this.ResetFields();
          this.AddFields();
        },        
      );
  }
}