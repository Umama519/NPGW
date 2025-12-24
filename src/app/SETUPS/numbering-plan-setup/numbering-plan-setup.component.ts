import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import * as XLSX from 'xlsx';
export class NumberingPlanSetup {
  seq_no: string;
  loC_ID: string;
  loC_NAME: string;
  participant: string;
  nuM_FROM: string;
  nuM_To: string;
  definE_BY: string;
  definE_DATE: string;
  isGreen?: boolean;          // 👈 Optional property
  isPostRemarks?: string;      // 👈 Add this line if not already added



  constructor() {
    this.seq_no = '';
    this.loC_ID = '';
    this.loC_NAME = '';
    this.participant = '';
    this.nuM_FROM = '';
    this.nuM_To = '';
    this.definE_BY = '';
    this.definE_DATE = '';

  }
}

export interface NumPlanGet {
  seq_no: string,
  loC_ID: string,
  loC_NAME: string,
  participant: string,
  nuM_FROM: string,
  nuM_TO: string,
  definE_BY: string,
  definE_DATE: string,
  isPostRemarks?: string,
  isGreen?: boolean;          // 👈 Optional property
}

@Component({
  selector: 'app-public-numbering-plan-setup-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './numbering-plan-setup.component.html',
  styleUrl: './numbering-plan-setup.component.css'
})
export class NumberingPlanSetupComponent {
  showModal: boolean = false; // For controlling modal visibility
  errmessage: string = ""; // Control visibility of popup
  showPopup: boolean = false;  // Control visibility of popup
  popupMessage: string = '';
  Message: string = '';
  TotalRecord: string = '';
  InvalidRecord: string = '';
  ProcessRecord: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  isErrorPopup: boolean = false;
  isadd: string = '';
  SelectedID: any[] = [];
  selectedLoc: any[] = [];
  selectedParti: any[] = [];
  selectedNumFrm: any[] = [];
  selectedNumTo: any[] = [];
  NumObj: NumberingPlanSetup = new NumberingPlanSetup();
  NumGet: NumPlanGet[] = [];
  loginUser: string = '';
  participantNames: any[] = []; // Stores one column (e.g., 'name')
  isChecked = false;
  selectedFile: File | null = null;
  isPostRequest = false;  // Flag to track whether it's a post request or not
  isPostRemarks = true;  // Flag to track whether it's a post request or not

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {

    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.Operator_Lov();
    this.ResetFields();

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
  }
  GetGrid() {
    debugger;
    const url = `http://132.147.160.110:5111/api/NumberPlanSetup`; // Fetch all data
    const txt_RejCode = this.el.nativeElement.querySelector('#txt_RejCode')
    const Description = this.el.nativeElement.querySelector('#txt_Description')
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.NumGet = res;
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
    this.DisableField();

    this.setFieldValue('#txt_ID', row?.loC_ID || '', true);
    this.setFieldValue('#txt_Location', row?.loC_NAME || '', false);
    this.setFieldValue('#ddl_Participaint', row?.participant || '', false);
    this.setFieldValue('#txt_NumberSerialFrom', row?.nuM_FROM || '', false);
    this.setFieldValue('#txt_NumberSerialTo', row?.nuM_TO || '', false);

    this.isadd = 'U';

    setTimeout(() => {
      this.SelectedID = row?.loC_ID || '';
      this.selectedLoc = row?.loC_NAME || '';
      this.selectedParti = row?.participant || '';
      this.selectedNumFrm = row?.nuM_FROM || '';
      this.selectedNumTo = row?.nuM_TO || '';

      this.EnabledFields();
      this.SubmitField();
      this.buttobfun();
      this.isadd = 'U';
    }, 100);
  }
  Operator_Lov() {
    const url = "http://132.147.160.110:5111/api/Participant_Lov_";
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.participantNames = data.map(participant => participant.name);
        console.log("Participant Names:", this.participantNames);
      },
      error: (err) => {
        console.error("Error fetching Participant data:", err);
      }
    });
  }
  searchButton() {
    debugger;
    const txt_ID = this.el.nativeElement.querySelector('#txt_ID').value; // Get input value
    const url = `http://132.147.160.110:5111/api/NumberPlanSetup/${txt_ID}`; // API URL with DepartmentID

    this.http.get<NumPlanGet[]>(url).subscribe({
      next: (res: NumPlanGet[]) => {
        if (res && res.length > 0) {
          this.NumGet = res;
          //this.filteredData = res; // Set filtered data from the API response
        } else {
          alert('No data found for the given Department ID.');
          // this.filteredData = [];
          this.NumGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
        console.log('Error fetching data:', err);
        //this.filteredData = []; // Handle error by setting filteredData to empty
        this.NumGet = [];
      }
    });
  }
  DisableField() {
    const fields = ['#txt_Location', '#ddl_Participaint', '#txt_NumberSerialFrom', '#txt_NumberSerialTo'];

    fields.forEach(selector => {
      const element = this.el.nativeElement.querySelector(selector);
      if (element) {
        element.disabled = true;  // Disable the field directly using the 'disabled' property
      }
    });
  }

  EnabledFields() {
    const fields = ['#txt_Location', '#ddl_Participaint', '#txt_NumberSerialFrom', '#txt_NumberSerialTo'];

    fields.forEach(selector => {
      const element = this.el.nativeElement.querySelector(selector);
      if (element) {
        this.renderer.removeAttribute(element, 'disabled');
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
    const txt_ID = (document.getElementById('txt_ID') as HTMLInputElement).value; // Example: "2025-01-08"    
    this.NumObj.loC_ID = txt_ID; // Reformat to "DD-MM-YYYY"
    this.NumObj.loC_NAME = (document.getElementById('txt_Location') as HTMLInputElement).value;
    this.NumObj.participant = (document.getElementById('ddl_Participaint') as HTMLInputElement).value;
    this.NumObj.nuM_FROM = (document.getElementById('txt_NumberSerialFrom') as HTMLInputElement).value;
    this.NumObj.nuM_To = (document.getElementById('txt_NumberSerialTo') as HTMLInputElement).value;
    this.NumObj.definE_BY = this.loginUser;
    this.NumObj.definE_DATE = '';

    // Validation for empty Department ID
    if (!this.NumObj.loC_ID) {
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

      const updateUrl = `http://132.147.160.110:5111/api/NumberPlanSetup/${this.NumObj.loC_ID}`;
      this.http.put(updateUrl, this.NumObj).subscribe({
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

          this.NumObj.loC_ID = '';
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
      const insertUrl = `http://132.147.160.110:5111/api/NumberPlanSetup`;
      this.http.post(insertUrl, this.NumObj).subscribe({
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

          this.NumObj.loC_ID = '';
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
  ResetButton() {
    // Reset fields (optional if you want to clear or reset form data)
    this.ResetFields();

    // Get the elements
    const chkBox = document.getElementById("txt_Chk") as HTMLInputElement | null;
    const fileInput = document.getElementById("fileInput") as HTMLElement | null;
    const usedUpload = document.getElementById("usedUpload") as HTMLElement | null;
    const btn_upload = document.getElementById("btn_Upload") as HTMLButtonElement | null;
    const btn_Process = document.getElementById("btn_Process") as HTMLButtonElement | null;
    const fileFormatDiv = document.getElementById("fileFormatDiv") as HTMLElement | null;
    const lbl_ID = document.getElementById("lbl_ID") as HTMLElement | null;
    const txt_ID = document.getElementById("txt_ID") as HTMLInputElement | null;
    const lbl_Loc = document.getElementById("lbl_Loc") as HTMLElement | null;
    const txt_Location = document.getElementById("txt_Location") as HTMLInputElement | null;
    const lbl_Parti = document.getElementById("lbl_Parti") as HTMLElement | null;
    const ddl_Participaint = document.getElementById("ddl_Participaint") as HTMLSelectElement | null;
    const lblNumFrm = document.getElementById("lblNumFrm") as HTMLElement | null;
    const txt_NumberSerialFrom = document.getElementById("txt_NumberSerialFrom") as HTMLInputElement | null;
    const lblNumTo = document.getElementById("lblNumTo") as HTMLElement | null;
    const txt_NumberSerialTo = document.getElementById("txt_NumberSerialTo") as HTMLInputElement | null;
    const btn_add = document.getElementById("btn_add") as HTMLButtonElement | null;
    const btn_Submit = document.getElementById("btn_Submit") as HTMLButtonElement | null;
    const btn_Search = document.getElementById("btn_Search") as HTMLButtonElement | null;
    const tableG = document.getElementById("tableG") as HTMLElement | null;

    this.GetGrid();
    if (chkBox) {
      chkBox.checked = false;  // Uncheck the checkbox
    }
    // Show specific elements
    // Hide specific elements on reset
    usedUpload?.style.setProperty("display", "none");
    fileInput?.style.setProperty("display", "none");
    btn_upload?.style.setProperty("display", "none");
    btn_Process?.style.setProperty("display", "none"); // Hide Process button
    fileFormatDiv?.style.setProperty("display", "none");

    // Hide other elements
    [
      lbl_ID, txt_ID, lbl_Loc, txt_Location, lbl_Parti, ddl_Participaint,
      lblNumFrm, txt_NumberSerialFrom, lblNumTo, txt_NumberSerialTo,
      btn_add, btn_Submit, btn_Search, tableG
    ].forEach(element => element?.style.setProperty("display", "block"));

    this.isPostRequest = false;
    this.isPostRemarks = true;
    this.isChecked = false;
  }

  toggleTable(event: any) {
    this.isChecked = event.target.checked; // Checkbox ka status update karna        
    this.GetGrid();
    this.isPostRequest = false;
    this.isPostRemarks = true;


  }
  upload(): void {
    debugger;
    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }

    const FileFormat = document.getElementById("FileFormat") as HTMLElement | null;
    const tableG = document.getElementById("tableG") as HTMLElement | null;

    if (tableG) {
      this.renderer.setStyle(tableG, 'display', 'block');
    }
    if (FileFormat) {
      this.renderer.setStyle(FileFormat, 'display', 'none');
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(this.selectedFile);

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Extract the data from the first 5 columns of each row
      let rowData = jsonData.slice(1).map((row: any) => {
        // Assuming that there are 5 columns in the Excel sheet
        return {
          loC_ID: row[0],                   // First column
          loC_NAME: row[1],             // Second column
          participant: row[2],          // Third column
          nuM_FROM: row[3],     // Fourth column
          nuM_TO: row[4]        // Fifth column
        };
      });

      // Clean the mobile numbers (remove invalid ones)
      rowData = rowData.filter((row: any) => row.loC_ID && row.loC_NAME && row.participant && row.nuM_FROM && row.nuM_TO);  // Ensure these fields are not empty

      // Send the data to the backend API
      this.uploadBatch(rowData);
    };
  }

  uploadBatch(rowData: any[]): void {
    debugger;
    const totalCount = rowData.length;
    const totalRecordsInput = document.getElementById("totalRecords") as HTMLInputElement;
    if (totalRecordsInput) {
      totalRecordsInput.value = totalCount.toString();
    }

    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    const Processbtn = document.getElementById("btn_Process") as HTMLElement | null;
    const btn_upload = document.getElementById("btn_Upload") as HTMLButtonElement | null;
    this.isPostRequest = true;
    this.isPostRemarks = false;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // DELETE request before starting
    const body = {
      seq_no: '',
      loC_ID: '',
      loC_NAME: '',
      participant: '',
      nuM_FROM: '',
      nuM_TO: '',
      definE_DATE: '',
      definE_BY: this.loginUser
    };

    this.http.request('DELETE', `http://132.147.160.110:5111/api/NumberPlanSetup/${this.loginUser}`, {
      headers: headers,
      body: body
    }).subscribe(
      (deleteResponse: any) => {
        const resMessage = deleteResponse.message || '';
        let msgR = resMessage.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
        this.popupMessage = msgR;

        // 🔁 Loop over each row and send POST request
        const updatedRows: any[] = [];
        let processedCount = 0;

        rowData.forEach((row, index) => {
          const formattedData = {
            seq_no: row.seq_no?.toString() || "",
            loC_ID: row.loC_ID?.toString() || "",
            loC_NAME: row.loC_NAME || "",
            participant: row.participant || "",
            nuM_FROM: row.nuM_FROM?.toString() || "",
            nuM_TO: row.nuM_TO?.toString() || "",
            definE_DATE: "",
            definE_BY: this.loginUser
          };

          this.http.post('http://132.147.160.110:5111/api/NumberPlanSetup/UploadData', formattedData, { headers }).subscribe({
            next: (resp: any) => {
              const msg = JSON.stringify(resp);
              const msgRe = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
              // 1. Split the message
              // 1. Split all messages after the first semicolon
              const parts = msg.split(';').slice(1);  // skip first part

              // 2. Clean each message and filter valid ones (start with 'R')
              const validMessages = parts.filter(p => {
                const cleanMsg = p.replace('}', '').replace(/"/g, '').trim();
                return cleanMsg.startsWith('R');
              });

              // 3. Filter invalid messages (not starting with 'R')
              const invalidMessages = parts.filter(p => {
                const cleanMsg = p.replace('}', '').replace(/"/g, '').trim();
                return !cleanMsg.startsWith('R');
              });

              // 4. Set count in inputs
              const processInput = document.getElementById('ProcessRecord') as HTMLInputElement;
              if (processInput) {
                processInput.value = validMessages.length.toString();
              }

              const invalidInput = document.getElementById('InvalidRecords') as HTMLInputElement;
              if (invalidInput) {
                invalidInput.value = invalidMessages.length.toString();
              }






              // ⬅ Add remarks to current row
              row.isPostRemarks = msgRe;
              updatedRows.push(row);

              processedCount++;

              // ✔ Final step: when all done
              if (processedCount === rowData.length) {
                this.NumGet = updatedRows;
                this.showSuccessPopup = true;
                // this.ResetFields();                
                if (Processbtn) {
                  this.renderer.removeAttribute(Processbtn, 'disabled');
                }
                if (btn_upload) {
                  this.renderer.setStyle(btn_upload, 'display', 'none');
                }

              }

            },
            error: (uploadError) => {
              row.isPostRemarks = `Error: ${uploadError.message}`;
              updatedRows.push(row);
              processedCount++;

              if (processedCount === rowData.length) {
                this.NumGet = updatedRows;
                this.showSuccessPopup = true;
                //  this.ResetFields();
                //   this.AddFields();
              }

            }

          });
        });
      }
    );
  }
  Processbtn() {
    debugger
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    this.NumObj.loC_ID = ''
    this.NumObj.loC_NAME = '';
    this.NumObj.participant = '';
    this.NumObj.nuM_FROM = '';
    this.NumObj.nuM_To = '';
    this.NumObj.definE_BY = this.loginUser;
    this.NumObj.definE_DATE = '';

    const Processbtn = document.getElementById("btn_Process") as HTMLElement | null;
    const btn_upload = document.getElementById("btn_Upload") as HTMLButtonElement | null;

    const url = `http://132.147.160.110:5111/api/NumberPlanSetup/ProcessData`;
    this.http.post(url, this.NumObj).subscribe({
      next: (response) => {
        const ab = JSON.stringify(response);
        const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
        this.NumObj.isGreen = msgR.startsWith('R'); // true if R se start hota hai
        this.NumObj.isPostRemarks = msgR;
        this.popupMessage = ('Process Successfully completed'); // Set suc          ; // Set success message   
        this.showSuccessPopup = true; // Show popup           
        if (Processbtn) {
          this.renderer.setStyle(Processbtn, 'display', 'none');
        }
        if (btn_upload) {
          this.renderer.setStyle(btn_upload, 'display', 'block');
        }

        this.popupMessage = ('Process Successfully completed'); // Set suc          
        // Check if the response contains "0" and show custom message and error image if true        
        this.showSuccessPopup = true; // Show popup


      }
    })
  }




  onFileChange(event: any): void {
    const file = event.target.files[0]; // File ko store karna
    if (file) {
      this.selectedFile = file;  // File ko assign karte hain agar wo exist kare
      console.log('File selected:', this.selectedFile);
    } else {
      console.log('No file selected');
    }
  }
  ResetFields() {
    const chkBox = document.getElementById("txt_Chk") as HTMLInputElement | null;
    const lbl_ID = document.getElementById("lbl_ID") as HTMLElement | null;
    const txt_ID = document.getElementById("txt_ID") as HTMLInputElement | null;
    const lbl_Loc = document.getElementById("lbl_Loc") as HTMLElement | null;
    const txt_Location = document.getElementById("txt_Location") as HTMLInputElement | null;
    const lbl_Parti = document.getElementById("lbl_Parti") as HTMLElement | null;
    const ddl_Participaint = document.getElementById("ddl_Participaint") as HTMLSelectElement | null;
    const lblNumFrm = document.getElementById("lblNumFrm") as HTMLElement | null;
    const txt_NumberSerialFrom = document.getElementById("txt_NumberSerialFrom") as HTMLInputElement | null;
    const lblNumTo = document.getElementById("lblNumTo") as HTMLElement | null;
    const txt_NumberSerialTo = document.getElementById("txt_NumberSerialTo") as HTMLInputElement | null;
    const btn_add = document.getElementById("btn_add") as HTMLButtonElement | null;
    const btn_Submit = document.getElementById("btn_Submit") as HTMLButtonElement | null;
    const btn_Search = document.getElementById("btn_Search") as HTMLButtonElement | null;
    const btn_Process = document.getElementById("btn_Process") as HTMLButtonElement | null;
    const btn_upload = document.getElementById("btn_upload") as HTMLButtonElement | null;
    const usedUpload = document.getElementById("usedUpload") as HTMLElement | null;
    const fileFormatDiv = document.getElementById("fileFormatDiv") as HTMLElement | null;
    const tableG = document.getElementById("tableG") as HTMLElement | null;


    if (txt_ID && txt_Location && txt_NumberSerialFrom && txt_NumberSerialTo && ddl_Participaint) {
      this.renderer.setAttribute(txt_Location, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute      
      this.renderer.setAttribute(txt_NumberSerialFrom, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute      
      this.renderer.setAttribute(txt_NumberSerialTo, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute      
      this.renderer.setAttribute(ddl_Participaint, 'disabled', 'true'); // Disable the input by setting 'disabled' attribute      

      txt_ID.value = '';
      txt_Location.value = '';
      txt_NumberSerialFrom.value = '';
      txt_NumberSerialTo.value = '';
      ddl_Participaint.value = '';
    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
      this.renderer.removeAttribute(btn_add, 'disabled');
    }
    if (btn_Search) {
      this.renderer.removeClass(btn_Search, 'newbtndisable');
      this.renderer.addClass(btn_Search, 'newbtn');
      this.renderer.removeAttribute(btn_Search, 'disabled');
    }

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }

    if (txt_ID) {
      this.renderer.removeAttribute(txt_ID, 'disabled');
    }

    if (!chkBox) {
      console.error("Checkbox element not found");
      return;
    }

    // Hide Process button by default
    if (btn_Process) {
      btn_Process.style.display = "none"; // Hide the Process button by default
    }
    chkBox.addEventListener("change", () => {
      if (chkBox.checked) {
        // ✅ Checkbox checked hone par sirf ye show honge
        usedUpload?.style.setProperty("display", "block");
        btn_upload?.style.setProperty("display", "block");
        btn_Process?.style.setProperty("display", "block"); // Show Process button
        fileFormatDiv?.style.setProperty("display", "block");

        [
          lbl_ID, txt_ID, lbl_Loc, txt_Location, lbl_Parti, ddl_Participaint,
          lblNumFrm, txt_NumberSerialFrom, lblNumTo, txt_NumberSerialTo,
          btn_add, btn_Submit, btn_Search, tableG
        ].forEach(element => element?.style.setProperty("display", "none"));

      } else {
        [
          lbl_ID, txt_ID, lbl_Loc, txt_Location, lbl_Parti, ddl_Participaint,
          lblNumFrm, txt_NumberSerialFrom, lblNumTo, txt_NumberSerialTo,
          btn_add, btn_Submit, btn_Search, tableG
        ].forEach(element => element?.style.setProperty("display", "block"));

        // ❌ Used Upload aur Upload button hide ho jayenge
        usedUpload?.style.setProperty("display", "none");
        btn_upload?.style.setProperty("display", "none");
        btn_Process?.style.setProperty("display", "none"); // Hide Process button again
        fileFormatDiv?.style.setProperty("display", "none");

        // ✅ Textboxes clear karne ke liye
        txt_ID?.setAttribute("value", "");
        txt_NumberSerialFrom?.setAttribute("value", "");
        txt_NumberSerialTo?.setAttribute("value", "");
      }
    });
  }


}