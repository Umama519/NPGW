import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';

export class ErrorCodeSetup {
  rejcd: string;
  descrip: string;
  rtyp: string;
  tuid: string;
  tdate: string;
  conn_type: string;
  status: string;


  constructor() {
    this.rejcd = '';
    this.descrip = '';
    this.rtyp = '';
    this.tuid = '';
    this.tdate = '';
    this.conn_type = '';
    this.status = '';
  }
}

export interface ErrGet {
  rejcd: string,
  descrip: string,
  rtyp: string,
  conn_type: string,
  tuid: string,
  tdate: string,
  status: string
}


@Component({
  selector: 'app-public-errorcodesetup-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './error-code-setup.component.html',
  styleUrl: './error-code-setup.component.css'
})
export class ErrorCodeSetupComponent {

  showModal: boolean = false; // For controlling modal visibility
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  isErrorPopup: boolean = false;
  isadd: string = '';
  SelectErrcode: any[] = [];
  selectedDesc: any[] = [];
  selectedConntyp: any[] = [];
  selectedSts: any[] = [];
  errcd: string | null = null;
  ErrObj: ErrorCodeSetup = new ErrorCodeSetup();
  ErrGet: ErrGet[] = [];
  loginUser: string = '';  

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {
    this.EnabledFields();    
    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';

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

  }
  buttobfun() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtndisable'); // Remove the old class
      this.renderer.addClass(btn_Submit, 'newbtn');
    }
    if (btn_Search) {
      this.renderer.removeClass(btn_Search, 'newbtn');
      this.renderer.addClass(btn_Search, 'newbtndisable');
    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtn');
      this.renderer.addClass(btn_add, 'newbtndisable');
    }
  }
  GetGrid() {
    debugger;
    const url = `http://132.147.160.110:5111/api/ErrorCodeSetup`; // Fetch all data
    const txt_RejCode = this.el.nativeElement.querySelector('#txt_RejCode')
    const Description = this.el.nativeElement.querySelector('#txt_Description')
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.ErrGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // Initially display all data
          txt_RejCode.value = '';
          Description.value = '';
          if (Description) {
            this.renderer.setAttribute(Description, 'disabled', 'true');
          }
          //this.holidayGet.dscrip = '';
        } else {
       //   console.log('No data found');
          this.filteredData = []; // Set empty array if no data is found
        }
      },
      error: (err) => {
      //  console.error('Error fetching data:', err);
        this.filteredData = []; // Handle error by setting filteredData to empty
      }
    });
  }
  searchButton() {
    debugger;
    const txt_Errcd = this.el.nativeElement.querySelector('#txt_Errcd').value; // Get input value
    const url = `http://132.147.160.110:5111/api/ErrorCodeSetup/${txt_Errcd}`; // API URL with DepartmentID

    this.http.get<ErrGet[]>(url).subscribe({
      next: (res: ErrGet[]) => {
        if (res && res.length > 0) {
          this.ErrGet = res;
          //this.filteredData = res; // Set filtered data from the API response
        } else {
          alert('No data found for the given Department ID.');
          // this.filteredData = [];
          this.ErrGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
      //  console.log('Error fetching data:', err);
        //this.filteredData = []; // Handle error by setting filteredData to empty
        this.ErrGet = [];
      }
    });
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
  EnabledFields() {
    const txt_Errcd = this.el.nativeElement.querySelector('#txt_Errcd');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Descrip');
    const ddl_connType = this.el.nativeElement.querySelector('#ddl_connType');    
    const txt_ConnectionType = this.el.nativeElement.querySelector('#txt_ConnectionType');
    const ddl_Status = this.el.nativeElement.querySelector('#ddl_Status');
    if (txt_Errcd) {
      this.renderer.removeAttribute(txt_Errcd, 'disabled');

    }
    if (txt_Description) {
      this.renderer.removeAttribute(txt_Description, 'disabled');

    }
    if (ddl_connType) {
      this.renderer.removeAttribute(ddl_connType, 'disabled');

    }
      if (txt_ConnectionType) {
      this.renderer.removeAttribute(txt_ConnectionType, 'disabled');

    } if (ddl_Status) {
      this.renderer.removeAttribute(ddl_Status, 'disabled');
    }

  }
  DisableFields() {
    
    const txt_Description = this.el.nativeElement.querySelector('#txt_Descrip');
    const ddl_connType = this.el.nativeElement.querySelector('#ddl_connType');    
    const txt_ConnectionType = this.el.nativeElement.querySelector('#txt_ConnectionType');
    const txt_Status = this.el.nativeElement.querySelector('#txt_Status');    
    if (txt_Description) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true');

    }
    if (ddl_connType) {
      this.renderer.setAttribute(ddl_connType, 'disabled', 'true');

    }
      if (txt_ConnectionType) {
      this.renderer.setAttribute(txt_ConnectionType, 'disabled' , 'true');

    } if (txt_Status) {
      this.renderer.setAttribute(txt_Status, 'disabled' , 'true');
    }


  }
  confirmDelete(err: string) {
    debugger;
   // console.log("Confirm delete called for deptid:", err); // Add logging
    this.errcd = err;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }
  deleteRecord(rejcd: string) {
    debugger;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const txt_Errcd = this.el.nativeElement.querySelector('#txt_Errcd')
    const body = {
      rejcd: this.errcd,
      descrip: '',
      rtyp: '',      
      tuid: '',
      tdate: '',
      conn_type: '',
      status: '',    
    };

    const headers = { 'Content-Type': 'application/json' };

    this.http
      .delete(`http://132.147.160.110:5111/api/ErrorCodeSetup/${this.errcd}`, {
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
          if (txt_Errcd) {
            this.renderer.removeAttribute(txt_Errcd, 'disabled'); // Enable input field
          }
          this.showModal = false;
          rejcd = '';
          this.ResetFields();
          this.AddFields();        
        },
        (error) => {
          // Handle errors
        //  alert(`Error deleting record: ${error.message}`);
       //   console.error('Error Details:', error);
        }
      );
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

  edit(row: any): void {
    this.DisableFields();

    this.setFieldValue('#txt_Errcd', row?.rejcd || '', true);
    this.setFieldValue('#txt_Descrip', row?.descrip || '', false);
    this.setFieldValue('#ddl_connType', row?.conn_type || '', false);
    this.setFieldValue('#ddl_Status', row?.status || '', false);

    this.isadd = 'U';

    setTimeout(() => {
      this.SelectErrcode = row?.rejcd || '';
      this.selectedDesc = row?.descrip || '';
      this.selectedConntyp = row?.conn_type || '';
      this.selectedSts = row?.status || '';

      this.EnabledFields();
      this.SubmitField();
      this.buttobfun();
      this.isadd = 'U';
    }, 100);
  }

  submitButton() {
    debugger;
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    const Errcode = (document.getElementById('txt_Errcd') as HTMLInputElement).value; // Example: "2025-01-08"    
    this.ErrObj.rejcd = Errcode; // Reformat to "DD-MM-YYYY"
    this.ErrObj.descrip = (document.getElementById('txt_Descrip') as HTMLInputElement).value;
    this.ErrObj.conn_type = (document.getElementById('ddl_connType') as HTMLInputElement).value;
    this.ErrObj.status = (document.getElementById('ddl_Status') as HTMLInputElement).value;
    this.ErrObj.tuid = this.loginUser;
    this.ErrObj.tdate = '';

    // Validation for empty Department ID
    if (!this.ErrObj.rejcd) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage = "Please Enter Rejection Code";
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }


    if (this.isadd === 'U') {
      debugger;
      // Update Record

      const updateUrl = `http://132.147.160.110:5111/api/ErrorCodeSetup/${this.ErrObj.rejcd}`;
      this.http.put(updateUrl, this.ErrObj).subscribe({
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

          this.ErrObj.rejcd = '';
          //this.holidayData.tuserid = '';
          this.ResetFields();
        },
        error: (err) => {
      //    console.error('Error during update:', err);
          this.popupMessage = 'Failed to update the record. Please try again.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
        }
      });
    } else if (this.isadd === 'I') {
      debugger;
      // Insert New Record
      const insertUrl = `http://132.147.160.110:5111/api/ErrorCodeSetup`;
      this.http.post(insertUrl, this.ErrObj).subscribe({
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

          this.ErrObj.rejcd = '';          
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
    ResetFields() {
      const txt_Errcd = this.el.nativeElement.querySelector('#txt_Errcd');
      const txt_Description = this.el.nativeElement.querySelector('#txt_Descrip');      
      const ddl_connType = this.el.nativeElement.querySelector('#ddl_connType');
      const ddl_Status = this.el.nativeElement.querySelector('#ddl_Status');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    if (txt_Errcd) {
      this.renderer.removeAttribute(txt_Errcd, 'disabled'); // Disable the input by setting 'disabled' attribute
      txt_Errcd.value = '';
    }
    if (txt_Description) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute
      txt_Description.value = '';
    }
    if (ddl_connType) {
      this.renderer.setAttribute(ddl_connType, 'disabled', 'true');
      ddl_connType.value = '';
    }
      if (ddl_Status) {
      this.renderer.setAttribute(ddl_Status, 'disabled', 'true');
      ddl_Status.value = '';
    }
    if (btn_Search) {
      this.renderer.removeClass(btn_Search, 'newbtndisable');
      this.renderer.addClass(btn_Search, 'newbtn');
    }

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
  ResetButton() {
    this.ResetFields();

    
  }
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }

  }
}
