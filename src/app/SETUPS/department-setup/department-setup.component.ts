import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
// import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

export class DepartmentSetup {
  deptid: string;
  dname: string;
  tuid: string;
  tdate: string;
  euid: string;
  edate: string;

  constructor() {
    this.deptid = '';
    this.dname = '';
    this.tuid = '';
    this.tdate = '';
    this.euid = '';
    this.edate = '';
  }
}
export interface DepartmentGet {
  deptid: string,
  dname: string, 
  tuid: string,
  tdate: string
}
@Component({
  selector: 'app-public-departmentsetup-aspx', 
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './department-setup.component.html',
  styleUrl: './department-setup.component.css'
})
export class DepartmentSetupComponent {
  departmentObj: DepartmentSetup = new DepartmentSetup();
  departmentGet: DepartmentGet[] = [];
  constructor(private  http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  showModal: boolean = false; // For controlling modal visibility
  deptidToDelete: string | null = null;
  errmessage: string = ""; // Control visibility of popup
  popupMessage: string = '';
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  GridData: any[] = [];
  selectedDeptid: string = '';
  selectedDname: string = '';
  columns: any[] = [];
  isErrorPopup: boolean = false;
  isadd: string = '';
  loginUser: string = '';
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
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name');
    if (txt_Name) {
      this.renderer.setAttribute(txt_Name, 'disabled', 'true'); // Disable input field
    }
    if (btn_Submit) {
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
  }
    formatHeader(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
  //  export(format: 'pdf' | 'xls' | 'csv' | 'xml' ) {
  //   const config: ExportAsConfig = {
  //     type: format,
  //     elementIdOrContent: 'tableToExport', // 👈 table id
  //   };

  //   this.exportAsService.save(config, 'Department Setup').subscribe(() => {      
  //   });
  // }
  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/DepartmentSetup`; // Fetch all data
    const txt_DepartmentID = this.el.nativeElement.querySelector('#txt_DepartmentID')
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name')
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.departmentGet = res;
          this.GridData = res; // Save all data in GridData          
          txt_DepartmentID.value = '';
          txt_Name.value = '';
          if (txt_Name) {
            this.renderer.setAttribute(txt_Name, 'disabled', 'true');
          }

          this.departmentData.dname = '';
        } else {
      //    console.log('No data found');          
        }
      },
      error: (err) => {
      //  console.error('Error fetching data:', err);        
      }
    });
  }

  edit(row: any): void {
    const txt_DepartmentID = this.el.nativeElement.querySelector('#txt_DepartmentID');
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name');

    if (txt_DepartmentID) {
      this.renderer.setProperty(txt_DepartmentID, 'value', row.deptid); // Set the value
      this.renderer.setAttribute(txt_DepartmentID, 'disabled', 'true'); // Disable the field
    }
    if (txt_Name) {
      this.renderer.setProperty(txt_Name, 'value', row.dname); // Set the value
      this.renderer.removeAttribute(txt_Name, 'disabled'); // Enable the field
    }
    this.SubmitField();
    this.buttobfun();
    // Set selected values
     this.showAddButton = false;
    this.showSubmitButton = true;
    this.selectedDeptid = row.deptid;
    this.selectedDname = row.dname;

    this.isadd = 'U';
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

  AddButton(): void {
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (txt_Name) {
      this.renderer.removeAttribute(txt_Name, 'disabled'); // Enable input field
    }
    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true'); // Enable input field
    }
    this.SubmitField();
    this.buttobfun();
    this.isadd = 'I';
    this.showAddButton = false;
     this.showSubmitButton = true;
    //const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    // }
  }
  SubmitField() {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Submit) {
      this.renderer.removeAttribute(btn_Submit, 'disabled')
    }
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    // }
  }
  ResetButton() {
    this.ResetFields();
    this.AddFields();
    this.showAddButton = true;
    this.showSubmitButton = false;
    //const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.removeAttribute(btn_Search, 'disabled')
    // }

  }
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }
  }

  ResetFields() {
    const txt_DepartmentID = this.el.nativeElement.querySelector('#txt_DepartmentID');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name');
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (txt_Name) {
      this.renderer.setAttribute(txt_Name, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute
      txt_Name.value = '';
      txt_DepartmentID.value = '';
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
    if (txt_DepartmentID) {
      this.renderer.removeAttribute(txt_DepartmentID, 'disabled'); // Disable the input by setting 'disabled' attribute

    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.GetGrid();
  }
 

  searchButton() {
    const depid = this.el.nativeElement.querySelector('#txt_DepartmentID').value; // Get input value
    const url = `${environment.apiBaseUrl}/api/DepartmentSetup/${depid}`; // API URL with DepartmentID

    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
           this.departmentGet = res;          
        } else {
      //    console.log('No data found for the given Department ID.');
          this.departmentGet = [];                    
        }
      },
      error: (err) => {
      //  console.error('Error fetching data:', err);        
        this.departmentGet = [];
      }
    });
  }
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  departmentData: DepartmentSetup = new DepartmentSetup();
  submitButton() {
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    this.departmentData.deptid = (document.getElementById('txt_DepartmentID') as HTMLInputElement).value;
    this.departmentData.dname = (document.getElementById('txt_Name') as HTMLInputElement).value;
    this.departmentData.tuid = this.loginUser;
    this.departmentData.tdate = '';      
    this.departmentData.euid = this.loginUser;
    this.departmentData.edate = '';      
    if (!this.departmentData.deptid) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage = "Please Enter Department ID";
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }
    this.showAddButton = true;
    this.showSubmitButton = false;
    const txt_DepartmentID = this.el.nativeElement.querySelector('#txt_DepartmentID');
    if (this.isadd === 'U') {
      this.departmentData.euid = this.loginUser;
      this.departmentData.edate = '';  
      const updateUrl = `${environment.apiBaseUrl}/api/DepartmentSetup/${this.departmentData.deptid}`;
      this.http.put(updateUrl, this.departmentData).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // S/ Show popup
          this.showSuccessPopup = true;
          this.GetGrid();
          if (txt_DepartmentID) {
            this.renderer.removeAttribute(txt_DepartmentID, 'disabled');
          }
          this.departmentData.deptid = '';
          this.departmentData.dname = '';
          this.ResetFields();
          this.AddFields();
        },

        error: (err) => {
       //   console.error('Error during update:', err);
          this.popupMessage = 'Failed to update the record. Please try again.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
        }
      });
    } else if (this.isadd === 'I') {      
      this.departmentData.euid = null as any; 
    this.departmentData.edate =  null as any;  
      // Insert New Record
      const insertUrl = `${environment.apiBaseUrl}/api/DepartmentSetup`;
      
      this.http.post(insertUrl, this.departmentData).subscribe({
         next: (response: any) => {
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
          this.GetGrid();
          if (txt_DepartmentID) {
            this.renderer.removeAttribute(txt_DepartmentID, 'disabled');
          }
          this.departmentData.deptid = '';
          this.departmentData.dname = '';
          this.ResetFields();
          this.AddFields();
        },
        error: (err) => {
        //  console.error('Error during insert:', err);
          this.popupMessage = 'Failed to insert the record. Please try again.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
        }
      });
    } else {
   //   console.error('Invalid operation type in isadd');
      this.popupMessage = 'Invalid operation type.';
      this.isErrorPopup = true; // Error popup
      this.showSuccessPopup = true; // Show popup
      this.isSubmitting = false;
    }
  }
  
  updateButtonStyles(searchButton: any, submitButton: any) {
    if (searchButton) {
      this.renderer.removeAttribute(searchButton, 'newbtndisable');
      this.renderer.addClass(searchButton, 'newbtn');
    }
    if (submitButton) {
      this.renderer.removeClass(submitButton, 'newbtn');
      this.renderer.addClass(submitButton, 'newbtndisable');
    }
  }
  confirmDelete(deptid: string) {
  //  console.log("Confirm delete called for deptid:", deptid); // Add logging
    this.deptidToDelete = deptid;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }
  deleteRecord(deptid: string) {
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const body = {
      deptid: this.deptidToDelete,
      dname: '',
      tuid: this.loginUser,
      tdate: ''
    };
    const headers = { 'Content-Type': 'application/json' };
    this.http
      .delete(`${environment.apiBaseUrl}/api/DepartmentSetup/${this.deptidToDelete}`, {
        headers: headers,
        body: body
      })
      .subscribe(
        (response: any) => {
          const resMessage = response.message;
          let msgR = resMessage.split(';').slice(1).join(',');
          msgR = msgR.replace('}', '').trim();
          msgR = msgR.replace('"', '').trim();
          this.popupMessage = msgR;
          
          this.GetGrid();
          this.showSuccessPopup = true;
          this.deptidToDelete = null; // Reset de
          const txt_DepartmentID = this.el.nativeElement.querySelector('#txt_DepartmentID');
          if (txt_DepartmentID) {
            this.renderer.removeAttribute(txt_DepartmentID, 'disabled'); // Enable input field
          }
          this.showModal = false;
          deptid = '';
          this.ResetFields();
          this.AddFields();
        },        
      );
  }
}