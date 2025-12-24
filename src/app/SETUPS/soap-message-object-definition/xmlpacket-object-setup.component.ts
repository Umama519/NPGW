import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { environment } from 'environments/environment';
import { FormsModule } from '@angular/forms';
export class XmlObjSetup {
  objid: string;
  descrip: string;
  lngth: string;
  userid: string;
  userdate: string;
  constructor() {
    this.objid = '';
    this.descrip = '';
    this.lngth = '';
    this.userid = '';
    this.userdate = '';
  }
}

export interface XmlObjGet {
  objid: string;
  descrip: string;
  lngth: string;
  userid: string;
  userdate: string;
}

@Component({
  selector: 'app-public-xmlpacketobjectsetup-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule],
  templateUrl: './xmlpacket-object-setup.component.html',
  styleUrl: './xmlpacket-object-setup.component.css'
})
export class XMLPacketObjectSetupComponent {
XmlObj: XmlObjSetup = new XmlObjSetup();
  showModal: boolean = false; // For controlling modal visibility
  XmlObjGet: XmlObjGet[] = [];
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  ObjidToDelete: string | null = null;
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedObjID: string = '';
  selectedDescription: string = '';
  selectedLenght: string = '';  
  isErrorPopup: boolean = false;
  isadd: string = '';
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  loginUser: string = '';  
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

  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/XmlPacketObject`; // Fetch all data
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
          this.MessageData.objid = '';
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
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
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
    this.AddFields();

  }
  AddButton(): void {

    const input = this.el.nativeElement.querySelector('#txt_Description');
    const Lenght = this.el.nativeElement.querySelector('#txt_Lenght');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (input) {
      this.renderer.removeAttribute(input, 'disabled'); // Enable input field
    }
    if (Lenght) {
      this.renderer.removeAttribute(Lenght, 'disabled'); // Enable input field
    }
    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true'); // Enable input field
    }
    this.showAddButton = false;
    this.showSubmitButton = true;
    this.SubmitField();    
    this.buttobfun();
    this.isadd = 'I';
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    // }
  }
  searchButton() {    
    //const inputD = this.el.nativeElement.querySelector('#txt_HolidayDate').value; // Get input value
    const txt_ObjectID = this.el.nativeElement.querySelector('#txt_ObjectID').value;        
    const inputD = txt_ObjectID; 

    const url = `${environment.apiBaseUrl}/api/XmlPacketObject/${inputD}`; // API URL with DepartmentID

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
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  MessageData: XmlObjSetup = new XmlObjSetup();
  edit(row: any): void {  
    const txt_ObjectID = this.el.nativeElement.querySelector('#txt_ObjectID');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');    
    const txt_Lenght = this.el.nativeElement.querySelector('#txt_Lenght');    
  
    if (txt_ObjectID) {
      this.renderer.setProperty(txt_ObjectID, 'value', row.objid); // Set description value
      this.renderer.setAttribute(txt_ObjectID, 'disabled', 'true'); // Enable the description field
      this.selectedObjID = row.objid; // Store the selected description
    }
    if (txt_Description) {
      this.renderer.setProperty(txt_Description, 'value', row.descrip); // Set description value
      this.renderer.removeAttribute(txt_Description, 'disabled'); // Enable the description field
      this.selectedDescription = row.descrip; // Store the selected description
    }
    if (txt_Lenght) {
      this.renderer.setProperty(txt_Lenght, 'value', row.lngth); // Set description value
      this.renderer.removeAttribute(txt_Lenght, 'disabled'); // Enable the description field
      this.selectedLenght = row.lngth; // Store the selected description
    }
    this.showAddButton = false;
    this.showSubmitButton = true;
    this.SubmitField();
    this.buttobfun();
    this.isadd = 'U'; // Set update mode
  }
  ResetFields() {
    const txt_ObjectID = this.el.nativeElement.querySelector('#txt_ObjectID');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_Lenght = this.el.nativeElement.querySelector('#txt_Lenght');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    
   // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (txt_Description) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute
      txt_Description.value = '';
      
    }
    if (txt_Lenght) {
      this.renderer.setAttribute(txt_Lenght, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute
      txt_Lenght.value = '';      
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
    if (txt_ObjectID) {
      this.renderer.removeAttribute(txt_ObjectID, 'disabled'); // Disable the input by setting 'disabled' attribute
      txt_ObjectID.value = '';
    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.GetGrid();
  }
  ResetButton() {
    this.ResetFields();
    this.AddFields();
     this.showAddButton = true;
    this.showSubmitButton = false;
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }

  }
  submitButton() {    
    
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;    
    this.XmlObj.objid = (document.getElementById('txt_ObjectID') as HTMLInputElement).value;
    this.XmlObj.descrip = (document.getElementById('txt_Description') as HTMLInputElement).value;    
    this.XmlObj.lngth = (document.getElementById('txt_Lenght') as HTMLInputElement).value;    
    this.XmlObj.userid = this.loginUser;
    this.XmlObj.userdate = '';

    // Validation for empty Department ID
    if (!this.XmlObj.objid) {
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

    const txt_ObjectID = this.el.nativeElement.querySelector('#txt_ObjectID');  

    if (this.isadd === 'U') {

      // Update Record
      console.log('Update Request Payload:', JSON.stringify(this.XmlObj));

      const updateUrl = `${environment.apiBaseUrl}/api/XmlPacketObject/${this.XmlObj.objid}`;
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
          this.GetGrid();
          if (txt_ObjectID) {
            this.renderer.removeAttribute(txt_ObjectID, 'disabled');
          }
          this.XmlObj.objid = '';
          this.XmlObj.descrip = '';          
          this.XmlObj.lngth = '';          
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

      // Insert New Record
      const insertUrl = `${environment.apiBaseUrl}/api/XmlPacketObject`;
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
          if (txt_ObjectID) {
            this.renderer.removeAttribute(txt_ObjectID, 'disabled');
          }
          this.XmlObj.objid = '';
          this.XmlObj.descrip = '';          
          this.XmlObj.lngth = ''
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
  confirmDelete(objid: string) {

    console.log("Confirm delete called for objid:", objid); // Add logging
    this.ObjidToDelete = objid;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }

  deleteRecord(objid: string) {
     this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const txt_ObjectID = this.el.nativeElement.querySelector('#txt_ObjectID')
    const body = {
      objid: this.ObjidToDelete,
      descrip: '',
      lngth: '',
      userid: this.loginUser,
      userdate: '',
      


    };

    const headers = { 'Content-Type': 'application/json' };
    this.http
    
      .delete(`${environment.apiBaseUrl}/api/XmlPacketObject/${this.ObjidToDelete}`, {
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
          this.ObjidToDelete = null;
          if (txt_ObjectID) {
            this.renderer.removeAttribute(txt_ObjectID, 'disabled'); // Enable input field
          }
          this.showModal = false;          
          objid = '';
          this.ResetFields();
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
