import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { DatepickerService } from '../Services/datepicker.service';

export class HolidaySetup {
  hdate: string;
  dscrip: string;
  tuid: string;
  tdate: string;

  constructor() {
    this.hdate = '';
    this.dscrip = '';
    this.tuid = '';
    this.tdate = '';
  }
}

export interface HolidayGet {
  hdate: string,
  dscrip: string,
  tuid: string,
  tdate: string
}

declare var $: any;
@Component({
  selector: 'app-public-holidayssetup-aspx',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './holiday-setup.component.html',  // ✅ Check this path
  styleUrl: './holiday-setup.component.css'
})

export class HolidaySetupComponent {
  holidayObj: HolidaySetup = new HolidaySetup();
  showModal: boolean = false; // For controlling modal visibility
  holidayGet: HolidayGet[] = [];
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService) { }
  date: string | null = null;
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedHoliday: string = '';
  selectedDescription: string = '';
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
  ngAfterViewInit(): void {
    this.datepickerService.initializeDatepicker('#txt_HolidayDate');
  }

  edit(row: any): void {
    
    const txt_HolidayDate = this.el.nativeElement.querySelector('#txt_HolidayDate');
    const txt_Description = this.el.nativeElement.querySelector('#txt_Description');

    if (txt_HolidayDate) {
      if (row.hdate) {
        const [day, month, year] = row.hdate.split('/');
        const formattedDate = `${day}-${month}-${year}`;
        txt_HolidayDate.value = formattedDate;
        this.renderer.setAttribute(txt_HolidayDate, 'disabled', 'true');
        this.selectedHoliday = formattedDate; // Store the selected holiday
      } else {
        txt_HolidayDate.value = "01-01-2000"; // Fallback date for debugging
      }
    }
    if (txt_Description) {
      this.renderer.setProperty(txt_Description, 'value', row.dscrip); // Set description value
      this.renderer.removeAttribute(txt_Description, 'disabled'); // Enable the description field
      this.selectedDescription = row.dscrip; // Store the selected description
    }

    this.SubmitField();
    this.buttobfun();
     this.showAddButton = false;
      this.showSubmitButton = true;
    this.isadd = 'U'; // Set update mode
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
  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/HolidaySetup`; // Fetch all data
    const HolidayDate = this.el.nativeElement.querySelector('#txt_HolidayDate')
    const Description = this.el.nativeElement.querySelector('#txt_Description')
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.holidayGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // Initially display all data
          HolidayDate.value = '';
          Description.value = '';
          if (Description) {
            this.renderer.setAttribute(Description, 'disabled', 'true');
          }
          //this.holidayGet.dscrip = '';
        } else {
      //    console.log('No data found');
          this.filteredData = []; // Set empty array if no data is found
        }
      },
      error: (err) => {
     //   console.error('Error fetching data:', err);
        this.filteredData = []; // Handle error by setting filteredData to empty
      }
    });
  }
  AddButton(): void {

    const input = this.el.nativeElement.querySelector('#txt_Description');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (input) {
      this.renderer.removeAttribute(input, 'disabled'); // Enable input field
    }
    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true'); // Enable input field
    }
    this.SubmitField();
    this.buttobfun();
    this.isadd = 'I';
    this.showAddButton = false;
    this.showSubmitButton = true;
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    // }
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
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }
  }
  ResetFields() {
    const txt_HolidayDate = this.el.nativeElement.querySelector('#txt_HolidayDate');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const txt_Name = this.el.nativeElement.querySelector('#txt_Name');
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (txt_Name) {
      this.renderer.setAttribute(txt_Name, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute
      txt_Name.value = '';
      txt_HolidayDate.value = '';
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
    if (txt_HolidayDate) {
      this.renderer.removeAttribute(txt_HolidayDate, 'disabled'); // Disable the input by setting 'disabled' attribute

    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.GetGrid();
  }

  closePopup() {
    // Hide the popup when "OK" is clicked
    this.showSuccessPopup = false;
  }
  searchButton() {
    
    //const inputD = this.el.nativeElement.querySelector('#txt_HolidayDate').value; // Get input value
    const inputDate = this.el.nativeElement.querySelector('#txt_HolidayDate').value;
    const inputD = inputDate;

    const url = `${environment.apiBaseUrl}/api/HolidaySetup/${inputD}`; // API URL with DepartmentID

    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.holidayGet = res;
          this.filteredData = res; // Set filtered data from the API response
        } else {
      //    console.log('No data found for the given Holiday Date.');
          this.filteredData = [];
          this.holidayGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
     //   console.error('Error fetching data:', err);
        this.filteredData = []; // Handle error by setting filteredData to empty
        this.holidayGet = [];
      }
    });
  }
  holidayData: HolidaySetup = new HolidaySetup();
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  submitButton() {
    
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    const inputDate = (document.getElementById('txt_HolidayDate') as HTMLInputElement).value; // Example: "2025-01-08"    
    this.holidayData.hdate = inputDate; // Reformat to "DD-MM-YYYY"
    this.holidayData.dscrip = (document.getElementById('txt_Description') as HTMLInputElement).value;
    this.holidayData.tuid = this.loginUser;
    this.holidayData.tdate = new Date().toISOString();
    // this.holidayData.Muid = this.loginUser;
    // this.holidayData.Mtdate = new Date().toISOString();

    // Validation for empty Department ID
    if (!this.holidayData.hdate) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage = "Please Enter Holiday Setup";
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }
    this.showAddButton = true;
    this.showSubmitButton = false;
    const DID = this.el.nativeElement.querySelector('#txt_HolidayDate');

    if (this.isadd === 'U') {
      // Update Record
      const updateUrl = `${environment.apiBaseUrl}/api/HolidaySetup/${this.holidayData.hdate}`;
      this.http.put(updateUrl, this.holidayData).subscribe({
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
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          this.holidayData.hdate = '';
          this.holidayData.tuid = '';
          this.ResetFields();
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
      
      // Insert New Record
      const insertUrl = `${environment.apiBaseUrl}/api/HolidaySetup`;
      this.http.post(insertUrl, this.holidayData).subscribe({
        next: (response: any) => {
          

          // API se aaya hua message nikalo
          const msg = response.message || JSON.stringify(response);

          // 👉 Check karo 1 se start ya 0 se
          if (msg.startsWith("1")) {
            // Error case
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = false;
            this.popupMessage = msgR;
          } else if (msg.startsWith("0")) {
            // Success case
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = true;
            this.popupMessage = msgR;
          } else {
            // Unknown response
            this.isErrorPopup = false;
            this.popupMessage = "Unexpected response format!";
          }
          this.showSuccessPopup = true; // Show popup

          // Refresh grid and clear input fields
          this.GetGrid();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          this.holidayData.hdate = '';
          this.holidayData.tuid = '';
          this.ResetFields();

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
  //    console.error('Invalid operation type in isadd');
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

  confirmDelete(holidayT: string) {
  //  console.log("Confirm delete called for deptid:", holidayT); // Add logging
    this.date = holidayT;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }
  formatDate(date: string): string {
    const [day, month, year] = date.split('/');
    return `${day}-${month}-${year}`;
  }
  deleteRecord(hdate: string) {
    
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    
    const HolidayDate = this.el.nativeElement.querySelector('#txt_HolidayDate')
    const body = {
      hdate: '',
      dscrip: '',
      tuid: this.loginUser,
      tdate: ''
    };

    //const headers = { 'Content-Type': 'application/json' };
    let formattedDate = this.date;

    if (this.date) {
      const [day, month, year] = this.date.split('/');
      formattedDate = `${day}-${month}-${year}`;
    }
    const url = `${environment.apiBaseUrl}/api/HolidaySetup/${formattedDate}`
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    };
    this.http.delete(url, options).subscribe(
      (response: any) => {
        // Assuming response has a 'message' property
        
        const resMessage = response.message;
        let msgR = resMessage.split(';').slice(1).join(','); // slice(1) to remo
        msgR = msgR.replace('}', '').trim();
        msgR = msgR.replace('"', '').trim();
        // Assign message to popup
        
        this.popupMessage = msgR;
        this.filteredData = this.filteredData.filter((row) => row.hdate !== hdate);
        this.GetGrid();

        // Show the popup
        this.showSuccessPopup = true;
        this.date = null;
        if (HolidayDate) {
          this.renderer.removeAttribute(HolidayDate, 'disabled'); // Enable input field
        }
        this.showModal = false;
        hdate = '';
        this.ResetFields();
        this.AddFields();
      },
      (error) => {
        // Handle errors
      //  alert(`Error deleting record: ${error.message}`);
      //  console.error('Error Details:', error);
      }
    );
  }
}