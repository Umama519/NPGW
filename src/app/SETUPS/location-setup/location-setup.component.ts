import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { environment } from 'environments/environment';

export class LocationSetup {
  locid: string;
  descrip: string;
  title: string;
  region: string;
  defBy: string;
  defDate: string;

  constructor() {
    this.locid = '';
    this.descrip = '';
    this.title = '';
    this.region = '';
    this.defBy = '';
    this.defDate = '';
  }
}

export interface LocationGet {
  locid: string,
  descrip: string,
  title: string,
  region: string,
  defBy: string,
  defDate: string,

}

@Component({
  selector: 'app-public-location-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './location-setup.component.html',
  styleUrl: './location-setup.component.css'
})
export class LocationSetupComponent {
  locObj: LocationSetup = new LocationSetup();

  locGet: LocationGet[] = [];

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  locToDelete: string | null = null;
  showModal: boolean = false; // For controlling modal visibility
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedDeptid: string = '';
  selectedDname: string = '';
  isErrorPopup: boolean = false;
  isadd: string = '';
  loginUser: string = '';
  selectedLoc: string = '';
  selectedDescription: string = '';
  selectedTilte: string = '';
  selectedRegion: any = '';
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;
  RegionlovDisabled: boolean = true;

  ngOnInit(): void {
    this.LoadFields();
    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }
  RegionLov = [
    { code: 'All', name: 'All' },
    { code: 'South', name: 'South' },
    { code: 'North', name: 'North' },

  ];
  LoadFields() {
    // const inputs = [    
    //   this.el.nativeElement.querySelector('#txt_Description'),
    //   this.el.nativeElement.querySelector('#txt_DynamicVal1'),
    //   this.el.nativeElement.querySelector('#txt_DynamicVal2'),
    //   this.el.nativeElement.querySelector('#txt_DynamicVal3'),
    //   this.el.nativeElement.querySelector('#txt_DynamicVal4')
    // ];
    // if (inputs) {
    //   this.renderer.setAttribute(inputs, 'disabled', 'true'); // Disable input field
    // }
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit')

    if (btn_Submit) {
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
  }
  edit(row: any): void {

  const txt_LocID = this.el.nativeElement.querySelector('#txt_LocID');
  const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
  const txt_Title = this.el.nativeElement.querySelector('#txt_Title');

  if (txt_LocID) {
    this.renderer.setProperty(txt_LocID, 'value', row.locid);
    this.renderer.setAttribute(txt_LocID, 'disabled', 'true'); // ❌ only disable ID
  }

  if (txt_Description && txt_Title ) {
    this.renderer.setProperty(txt_Description, 'value', row.descrip);
    this.renderer.setProperty(txt_Title, 'value', row.title);    

    // ✅ Ensure fields are always enabled in edit mode
    this.renderer.removeAttribute(txt_Description, 'disabled');
    this.renderer.removeAttribute(txt_Title, 'disabled');    
  }

  this.lovenabled(); // if this disables again remove those lines inside function

  this.SubmitField();
  this.buttobfun();     

  this.selectedLoc = row.locid;
  this.selectedDescription = row.descrip;
  this.selectedTilte = row.title;
  this.selectedRegion = row.region;

  this.showAddButton = false;
  this.showSubmitButton = true;
  this.isadd = 'U';
}

  lovenabled() {
    this.RegionlovDisabled = false;
  }
  lovdisabled() {
    this.RegionlovDisabled = true;
    this.selectedRegion = null;
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

    const url = `${environment.apiBaseUrl}/api/LocationSetip`; // Fetch all data
    const txt_DynamicCode = this.el.nativeElement.querySelector('#txt_DynamicCode');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_Title = this.el.nativeElement.querySelector('#txt_Title');
    const ddl_Rigion = this.el.nativeElement.querySelector('#ddl_Rigion');
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.locGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // Initially display all data
          txt_DynamicCode.value = '';
          txt_Description.value = '';
          txt_Title.value = '';
          ddl_Rigion.value = '';
          if (txt_Description && txt_Title && ddl_Rigion) {
            this.renderer.setAttribute(txt_Description, 'disabled', 'true'); //|| txt_DynamicVal1 || txt_DynamicVal2 || txt_DynamicVal3 || txt_DynamicVal4
            this.renderer.setAttribute(txt_Title, 'disabled', 'true');
            this.renderer.setAttribute(ddl_Rigion, 'disabled', 'true');

          }
          // this.dynamicData.descrip = '';
          // this.dynamicData.dynval1 = '';
          // this.dynamicData.dynval2 = '';
          // this.dynamicData.dynval3 = '';
          // this.dynamicData.dynval4 = '';
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
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }
  }

  AddButton(): void {
    this.lovenabled();

    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_Title = this.el.nativeElement.querySelector('#txt_Title');
    

    if (txt_Description && txt_Title) { // && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4 // && txt_DynamicVal1 && txt_DynamicVal2 && txt_DynamicVal3 && txt_DynamicVal4
      this.renderer.removeAttribute(txt_Description, 'disabled');
      this.renderer.removeAttribute(txt_Title, 'disabled');      

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
    this.AddFields();
    this.ResetFields();     
    this.lovdisabled();
    this.showAddButton = true;
    this.showSubmitButton = false;
    if (btn_add) {
      this.renderer.addClass(btn_add, 'newbtn'); // Remove the old class
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.removeAttribute(btn_add, 'disabled')
    }     
  }
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  closePopup() {
    // Hide the popup when "OK" is clicked
    this.showSuccessPopup = false;
  }
  ResetFields() {
    const txt_LocID = this.el.nativeElement.querySelector('#txt_LocID');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');
    const txt_Title = this.el.nativeElement.querySelector('#txt_Title');    

    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');

    if (txt_Description && txt_Title) {
      this.renderer.setAttribute(txt_Description, 'disabled', 'true');
      this.renderer.setAttribute(txt_Title, 'disabled', 'true');
      
      txt_LocID.value = "";
      txt_Description.value = '';
      txt_Title.value = '';      
    }    
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (txt_LocID) {
      this.renderer.removeAttribute(txt_LocID, 'disabled'); // Disable the input by setting 'disabled' attribute

    }
    
    this.GetGrid();

  }
  searchButton() {
    //const inputD = this.el.nativeElement.querySelector('#txt_DepartmentID').value;
    const txt_LocID = this.el.nativeElement.querySelector('#txt_LocID').value;
    const url = `${environment.apiBaseUrl}/api/LocationSetip/${txt_LocID}`;

    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.locGet = res;
          this.filteredData = res; // Set filtered data from the API response
        } else {
          console.log('No data found for the given Department ID.');
          this.filteredData = [];
          this.locGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.filteredData = []; // Handle error by setting filteredData to empty
        this.locGet = [];
      }
    });
  }
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  LocData: LocationSetup = new LocationSetup();
  submitButton() {    
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.removeAttribute(btn_Search, 'disabled')
    // }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    // Get input values
    this.LocData.locid = (document.getElementById('txt_LocID') as HTMLInputElement).value;
    this.LocData.descrip = (document.getElementById('txt_Description') as HTMLInputElement).value;
    this.LocData.title = (document.getElementById('txt_Title') as HTMLInputElement).value;
    this.LocData.region = this.selectedRegion;
    this.LocData.defBy = this.loginUser;
    this.LocData.defDate = new Date().toISOString();
    this.isErrorPopup = false;
    // Validation for empty Department ID
    if (!this.LocData.locid ||
      !this.LocData.descrip ||
      !this.LocData.title ||
      !this.LocData.region) {

      this.showSuccessPopup = false;

      setTimeout(() => {
        this.popupMessage =
          !this.LocData.locid ? 'Please Enter Location ID' :
            !this.LocData.descrip ? 'Please Enter Description' :
              !this.LocData.title ? 'Please Enter Title' :
                'Please Enter Region';

        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);

      return;
    }

    this.showAddButton = true;
    this.showSubmitButton = false;
    const DID = this.el.nativeElement.querySelector('#txt_LocID');


    if (this.isadd === 'U') {
      const url = `${environment.apiBaseUrl}/api/LocationSetip/${this.LocData.locid}`;
      this.http.put(url, this.LocData).subscribe({
        next: (res) => {
          const ab = JSON.stringify(res);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // Set success message              
          this.isErrorPopup = false; // Success popup
          this.showSuccessPopup = true; // Show popup
          this.GetGrid();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          this.LocData.locid = '';
          this.LocData.descrip = '';
          this.LocData.title = '';
          this.LocData.region = '';
          this.LocData.defBy = '';
          this.LocData.defDate = '';
          this.lovdisabled();
          this.ResetFields();
          this.AddFields();
        },
        error: (err) => {
          console.error('Update Failed', err);
          alert('Update Failed!');
        }
      });
    } else if (this.isadd === 'I') {
      // Insert New Record      
      const insertUrl = `${environment.apiBaseUrl}/api/LocationSetip`;
      this.http.post(insertUrl, this.LocData).subscribe({
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

          // Refresh grid and clear input fields
          this.lovdisabled();
          this.GetGrid();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          this.LocData.locid = '';
          this.LocData.descrip = '';
          this.LocData.title = '';
          this.LocData.region = '';
          this.LocData.defBy = '';
          this.LocData.defDate = '';
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
  confirmDelete(dyncd: string) {
    console.log("Confirm delete called for deptid:", dyncd); // Add logging
    this.locToDelete = dyncd;
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
      locid: this.locToDelete,
      descrip: '',
      title: '',
      region: '',
      defBy: this.loginUser,
      defDATE: ''
    };

    const headers = { 'Content-Type': 'application/json' };

    this.http
      .delete(`${environment.apiBaseUrl}/api/LocationSetip/${this.locToDelete}`, {
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

          // Remove the deleted record from the filtered data
          this.filteredData = this.filteredData.filter((row) => row.dyncd !== dyncd);

          // Refresh grid
          this.lovdisabled();
          this.GetGrid();
          this.showSuccessPopup = true;
          this.locToDelete = null; // Reset de
          const txt_DynamicCode = this.el.nativeElement.querySelector('#txt_DynamicCode');
          if (txt_DynamicCode) {
            this.renderer.removeAttribute(txt_DynamicCode, 'disabled'); // Enable input field
          }
          this.showModal = false;

          // Reset deptid
          this.LocData.locid = '';
          this.LocData.descrip = '';
          this.LocData.title = '';
          this.LocData.region = '';
          this.LocData.defBy = this.loginUser;
          this.LocData.defDate = '';
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
