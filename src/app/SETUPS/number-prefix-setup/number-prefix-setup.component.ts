import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
export class NoPrefixSetup {
  dialcode: string;
  cityid: string;
  cityname: string;
  imsiprefix: string;
  mnphlr: string;
  bussinessunit: string;
  defBy: string;
  defDate: string;

  constructor() {
    this.dialcode = '';
    this.cityid = '';
    this.cityname = '';
    this.imsiprefix = '';
    this.mnphlr = '';
    this.bussinessunit = '';
    this.defBy = '';
    this.defDate = '';

  }
}
export interface NoPrefixGet {
  dialcode: string,
  cityid: string,
  cityname: string,
  imsiprefix: string,
  mnphlr: string,
  bussinessunit: string,
  defBy: string,
  defDate: string,
}
@Component({
  selector: 'app-public-numberprefixsetup-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './number-prefix-setup.component.html',
  styleUrl: './number-prefix-setup.component.css'
})
export class NumberPrefixSetupComponent {
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;
  errmessage: string = ""; // Control visibility of popup
  popupMessage: string = '';
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isadd: string = '';
  loginUser: string = '';
  isErrorPopup: boolean = false;
  showModal: boolean = false; // For controlling modal visibility
  selectedDialCode: string = '';
  selectedCityID: string = '';
  selectedCityName: string = '';
  selectedCityIMSIPrefix: string = '';
  selectedCityMNPHLR: string = '';
  selectedBussinessUnit: string = '';
  NumberPrefixGet: NoPrefixGet[] = [];
  GridData: any[] = [];
  dialCodeToDelete: string | null = null;

  isSubmitting: boolean = false;  // Track

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {
    // this.LoadFields();    
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
  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/NumberPrefixSetup`; // Fetch all data
    // const txt_DepartmentID = this.el.nativeElement.querySelector('#txt_DepartmentID')
    // const txt_Name = this.el.nativeElement.querySelector('#txt_Name')
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.NumberPrefixGet = res;
          this.GridData = res; // Save all data in GridData          
          // txt_DepartmentID.value = '';
          // txt_Name.value = '';
          // if (txt_Name) {
          //   this.renderer.setAttribute(txt_Name, 'disabled', 'true');
          // }

          //this.departmentData.dname = '';
        } else {
          console.log('No data found');
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
  edit(row: any): void {
    debugger;
    const txt_DialCode = this.el.nativeElement.querySelector('#txt_DialCode');
    const txt_CityID = this.el.nativeElement.querySelector('#txt_CityID');
    const txt_CityName = this.el.nativeElement.querySelector('#txt_CityName');
    const txt_IMSI = this.el.nativeElement.querySelector('#txt_IMSI');
    const txt_MNP = this.el.nativeElement.querySelector('#txt_MNP');
    const txt_Buissunit = this.el.nativeElement.querySelector('#txt_Buissunit');

    if (txt_DialCode) {
      this.renderer.setProperty(txt_DialCode, 'value', row.dialcode); // Set the value
      this.renderer.setAttribute(txt_DialCode, 'disabled', 'true'); // Disable the field
    }
    if (txt_CityID) {
      this.renderer.setProperty(txt_CityID, 'value', row.cityid); // Set the value
      this.renderer.removeAttribute(txt_CityID, 'disabled'); // Enable the field
    }
    if (txt_CityName) {
      this.renderer.setProperty(txt_CityName, 'value', row.cityname); // Set the value
      this.renderer.removeAttribute(txt_CityName, 'disabled'); // Enable the field
    }
    if (txt_IMSI) {
      this.renderer.setProperty(txt_IMSI, 'value', row.imsiprefix); // Set the value
      this.renderer.removeAttribute(txt_IMSI, 'disabled'); // Enable the field
    }
    if (txt_MNP) {
      this.renderer.setProperty(txt_MNP, 'value', row.mnphlr); // Set the value
      this.renderer.removeAttribute(txt_MNP, 'disabled'); // Enable the field
    }
    if (txt_Buissunit) {
      this.renderer.setProperty(txt_Buissunit, 'value', row.bussinessunit); // Set the value
      this.renderer.removeAttribute(txt_Buissunit, 'disabled'); // Enable the field
    }
    this.SubmitField();
    this.buttobfun();
    // Set selected values
    this.showAddButton = false;
    this.showSubmitButton = true;
    this.selectedDialCode = row.dialcode;
    this.selectedCityID = row.cityid;
    this.selectedCityName = row.cityname;
    this.selectedCityIMSIPrefix = row.imsiprefix;
    this.selectedCityMNPHLR = row.mnphlr;
    this.selectedBussinessUnit = row.bussinessunit;

    this.isadd = 'U';
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
    const txt_CityID = this.el.nativeElement.querySelector('#txt_CityID');
    const txt_CityName = this.el.nativeElement.querySelector('#txt_CityName');
    const txt_IMSI = this.el.nativeElement.querySelector('#txt_IMSI');
    const txt_MNP = this.el.nativeElement.querySelector('#txt_MNP');
    const txt_Buissunit = this.el.nativeElement.querySelector('#txt_Buissunit');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');

    if (txt_CityID) {
      this.renderer.removeAttribute(txt_CityID, 'disabled'); // Enable input field
    }
    if (txt_CityName) {
      this.renderer.removeAttribute(txt_CityName, 'disabled'); // Enable input field
    }
    if (txt_IMSI) {
      this.renderer.removeAttribute(txt_IMSI, 'disabled'); // Enable input field
    }
    if (txt_MNP) {
      this.renderer.removeAttribute(txt_MNP, 'disabled'); // Enable input field
    }
    if (txt_Buissunit) {
      this.renderer.removeAttribute(txt_Buissunit, 'disabled'); // Enable input field
    }
    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true'); // Enable input field
    }
    this.SubmitField();
    this.buttobfun();
    this.isadd = 'I';
    this.showAddButton = false;
    this.showSubmitButton = true;
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
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
    const txt_DialCode = this.el.nativeElement.querySelector('#txt_DialCode');
    const txt_CityID = this.el.nativeElement.querySelector('#txt_CityID');
    const txt_CityName = this.el.nativeElement.querySelector('#txt_CityName');
    const txt_IMSI = this.el.nativeElement.querySelector('#txt_IMSI');
    const txt_MNP = this.el.nativeElement.querySelector('#txt_MNP');
    const txt_Buissunit = this.el.nativeElement.querySelector('#txt_Buissunit');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (txt_CityID) {
      this.renderer.setAttribute(txt_CityID, 'disabled', 'true');
      this.renderer.setAttribute(txt_Buissunit, 'disabled', 'true');
      txt_DialCode.value = '';
      txt_CityID.value = '';
      txt_CityName.value = '';
      txt_IMSI.value = '';
      txt_MNP.value = '';
      txt_Buissunit.value = '';
    }
    if (txt_CityName) {
      this.renderer.setAttribute(txt_CityName, 'disabled', 'true');
    }
    if (txt_IMSI) {
      this.renderer.setAttribute(txt_IMSI, 'disabled', 'true');
    }
    if (txt_MNP) {
      this.renderer.setAttribute(txt_MNP, 'disabled', 'true');
    }
    if (txt_Buissunit) {
      this.renderer.setAttribute(txt_Buissunit, 'disabled', 'true');
    }
    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (txt_DialCode) {
      this.renderer.removeAttribute(txt_DialCode, 'disabled'); // Disable the input by setting 'disabled' attribute

      // }
      if (btn_add) {
        this.renderer.removeClass(btn_add, 'newbtndisable');
        this.renderer.addClass(btn_add, 'newbtn');
      }
      this.GetGrid();
    }
  }
  searchButton() {
    debugger;
    const txt_DialCode = this.el.nativeElement.querySelector('#txt_DialCode').value; // Get input value
    const url = `${environment.apiBaseUrl}/api/NumberPrefixSetup/${txt_DialCode}`; // API URL with DepartmentID

    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.NumberPrefixGet = res;
        } else {
          console.log('No data found for the given Department ID.');
          this.NumberPrefixGet = [];
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.NumberPrefixGet = [];
      }
    });
  }
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  NoPrefixData: NoPrefixSetup = new NoPrefixSetup();
  submitButton() {
    debugger;



    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    this.NoPrefixData.dialcode = (document.getElementById('txt_DialCode') as HTMLInputElement).value;
    this.NoPrefixData.cityid = (document.getElementById('txt_CityID') as HTMLInputElement).value;
    this.NoPrefixData.cityname = (document.getElementById('txt_CityName') as HTMLInputElement).value;
    this.NoPrefixData.imsiprefix = (document.getElementById('txt_IMSI') as HTMLInputElement).value;
    this.NoPrefixData.mnphlr = (document.getElementById('txt_MNP') as HTMLInputElement).value;
    this.NoPrefixData.bussinessunit = (document.getElementById('txt_Buissunit') as HTMLInputElement).value;
    this.NoPrefixData.defBy = this.loginUser;
    this.NoPrefixData.defDate = '';
    // this.NoPrefixData.euid = this.loginUser;
    // this.NoPrefixData.edate = '';      
    if (
      !this.NoPrefixData.dialcode ||
      !this.NoPrefixData.cityid ||
      !this.NoPrefixData.cityname ||
      !this.NoPrefixData.imsiprefix ||
      !this.NoPrefixData.mnphlr ||
      !this.NoPrefixData.bussinessunit
    ) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage =
          !this.NoPrefixData.dialcode ? 'Please Enter Dial Code' :
            !this.NoPrefixData.cityid ? 'Please Enter City ID' :
              !this.NoPrefixData.cityname ? 'Please Enter City Name' :
                !this.NoPrefixData.imsiprefix ? 'Please Enter IMSI Prefix' :
                  !this.NoPrefixData.mnphlr ? 'Please Enter MNP HLR' :
                    'Please Enter Business Unit';

        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }

    this.showAddButton = true;
    this.showSubmitButton = false;
    const txt_DialCode = this.el.nativeElement.querySelector('#txt_DialCode');
    if (this.isadd === 'U') {
      // this.NoPrefixData.euid = this.loginUser;
      // this.NoPrefixData.edate = '';  
      const updateUrl = `${environment.apiBaseUrl}/api/NumberPrefixSetup/${this.NoPrefixData.dialcode}`;
      this.http.put(updateUrl, this.NoPrefixData).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR; // S/ Show popup
          this.showSuccessPopup = true;
          this.GetGrid();
          if (txt_DialCode) {
            this.renderer.removeAttribute(txt_DialCode, 'disabled');
          }
          this.NoPrefixData.dialcode = '';
          this.NoPrefixData.cityid = '';
          this.NoPrefixData.cityname = '';
          this.NoPrefixData.imsiprefix = '';
          this.NoPrefixData.mnphlr = '';
          this.NoPrefixData.bussinessunit = '';


          this.ResetFields();
          this.AddFields();
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
      //   this.NoPrefixData.euid = null as any; 
      // this.NoPrefixData.edate =  null as any;  
      // Insert New Record
      const insertUrl = `${environment.apiBaseUrl}/api/NumberPrefixSetup`;

      this.http.post(insertUrl, this.NoPrefixData).subscribe({
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
          if (txt_DialCode) {
            this.renderer.removeAttribute(txt_DialCode, 'disabled');
          }
          this.NoPrefixData.dialcode = '';
          this.NoPrefixData.cityid = '';
          this.NoPrefixData.cityname = '';
          this.NoPrefixData.imsiprefix = '';
          this.NoPrefixData.mnphlr = '';
          this.NoPrefixData.bussinessunit = '';
          this.ResetFields();
          this.AddFields();
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
  confirmDelete(dialcode: string) {
    debugger;
    console.log("Confirm delete called for dialcode:", dialcode);

    this.dialCodeToDelete = dialcode; // ✅ store the selected dialcode
    this.showModal = true;             // ✅ open confirmation modal
  }

  closeModal() {
    this.showModal = false;
  }

  deleteRecord() {
    debugger;
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const body = {
      dialcode: this.dialCodeToDelete,  // ✅ use stored dialcode
      cityid: '',
      cityname: '',
      imsiprefix: '',
      mnphlr: '',
      bussinessunit: '',
      defBy: this.loginUser,
      defDate: ''
    };

    const headers = { 'Content-Type': 'application/json' };
    this.http
      .delete(`${environment.apiBaseUrl}/api/NumberPrefixSetup/${this.dialCodeToDelete}`, {
        headers: headers,
        body: body
      })
      .subscribe(
        (response: any) => {
          debugger;
          const resMessage = response.message;
          let msgR = resMessage.split(';').slice(1).join(',');
          msgR = msgR.replace(/[{}"]/g, '').trim();

          this.popupMessage = msgR.includes('.') ? msgR.split('.')[0] + '.' : msgR;

          this.GetGrid();
          this.showSuccessPopup = true;
          this.dialCodeToDelete = null;
          this.showModal = false;
          this.ResetFields();
          this.AddFields();
        },
        (error) => {
          alert(`Error deleting record: ${error.message}`);
          console.error('Error  Details:', error);
        }
      );
  }

}
