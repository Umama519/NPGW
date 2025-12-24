import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import * as XLSX from 'xlsx';

export class NPRCurrentSetup {
  mobile_no: string;
  register_name: string;
  user_name: string;
  cnic: string;
  nic: string;
  passport: string;
  otherid: string;
  iccid: string;
  account_type: string;
  tariff_plan: string;
  access_level: string;
  secuirty_deposit: string;
  line_rent: string;
  refundamount: string;
  refunddate: string;
  userid: string;
  username: string;
  inititor: string;
  last_actiondate: string;
  current_status: string;
  message_timestamp: string;
  assign_to: string;
  due_date: string;
  donor: string;
  recipient: string;
  rej_desc: string;

  constructor() {
    this.mobile_no = '';
    this.register_name = '';
    this.user_name = '';
    this.cnic = '';
    this.nic = '';
    this.passport = '';
    this.otherid = '';
    this.iccid = '';
    this.account_type = '';
    this.tariff_plan = '';
    this.access_level = '';
    this.secuirty_deposit = '';
    this.line_rent = '';
    this.refundamount = '';
    this.refunddate = '';
    this.userid = '';
    this.username = '';
    this.inititor = '';
    this.last_actiondate = '';
    this.current_status = '';
    this.message_timestamp = '';
    this.assign_to = '';
    this.due_date = '';
    this.donor = '';
    this.recipient = '';
    this.rej_desc = '';    
  }
}
export class NPRBulkSetup {
  userid: string;
   constructor() {
    this.userid = '';
   }
}
@Component({
  selector: 'app-public-nprbulkcurrentstatus-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './npr-current-bulk-status.component.html',
  styleUrl: './npr-current-bulk-status.component.css'
})
export class NprCurrentBulkStatusComponent {
  selectedFile: File | null = null;
  loginUser: string = '';
  filteredData: any[] = [];
  GridData: any[] = [];
  GridData1: any[] = [];
  GridData2: any[] = [];
  GridHeaders : any[] = [];
  isadd: string = '';
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  showSuccessPopup: boolean = false;
  isSubmitting: boolean = false;
  generatedSeqWF: any;  
  batch: string | null = null;
  showModal: boolean = false;
  batchno: string | null = null;

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
   ngOnInit(): void {    
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.GetGrid();
    // this.GetGrid1();
  }
  GetGrid() {
    debugger;
    const url = `http://localhost:5000/api/NPRCurrentStatus/S?id=${this.loginUser}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.GridData = res;
          this.GridHeaders = Object.keys(res[0]);
          // this.filteredData = res;
        } else {
          console.log('No data found');
          this.GridData = [];
           this.GridHeaders = [];
          // this.filteredData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.GridData = [];
         this.GridHeaders = [];
        // this.filteredData = [];
      }
    });
  }
  GetGrid1() {
    debugger;
    const url = `http://localhost:5000/api/Action_LOV_/Batch`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.GridData1 = res;
        } else {
          console.log('No data found');
          this.GridData1 = [];
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.GridData1 = [];
      }
    });
  }
  GetGrid2(batch: any) {
    debugger;
    const url = `http://localhost:5000/api/NPRManualBilk/BD?userid=${this.loginUser}&batch=${batch}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.GridData2 = res;
        } else {
          console.log('No data found');
          this.GridData2 = [];
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.GridData2 = [];
      }
    });
  }
  // onBatch(batch: any) {
  //   this.GetGrid2(batch);
  // }
  previousBatch: any = null;

  onBatch(batch: any) {
    debugger;
    if (this.previousBatch === batch) {
      this.GridData2 = [];
      this.previousBatch = null;
    } else {    
      this.GetGrid2(batch);
      this.previousBatch = batch;
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', this.selectedFile);
    } else {
      console.log('No file selected');
    }
  }
  // onProcess(batch: any) {
  //   debugger;
  //   const setup = new NPRManualSetup();
    
  //     setup.batch = '';
  //     setup.total_records = '';
  //     setup.processDate = '';
  //     setup.loaddate = '';
  //     setup.accept = '';
  //     setup.reject = '';
  //     setup.hold = '';
  //     setup.user_id = this.loginUser;
  //     setup.mobile = '';
  //     setup.rejectHoldCode = '';
  //     setup.processStatus = '';

  //     const mappedData = setup;
  //   const insertUrl = `http://localhost:5000/api/NPRManualBilk/${batch}`;
  //   this.http.put(insertUrl, mappedData).subscribe({
  //     next: (response: any) => {
  //       const respStr = response.message;
  //       this.popupMessage = respStr;
  //       this.showSuccessPopup = true;
  //       this.isErrorPopup = respStr.startsWith('0;');  
  //       this.ResetFields();
  //       setTimeout(() => {
  //         this.showSuccessPopup = false;
  //       }, 3000);              
  //       },
  //       error: (err) => {
  //       console.error('Error during insert:', err);
  //       this.popupMessage = 'Failed to insert the record. Please try again.';
  //       this.isErrorPopup = true;
  //       this.showSuccessPopup = true;        
  //       this.ResetFields();
  //       setTimeout(() => {
  //         this.showSuccessPopup = false;
  //       }, 3000);
  //       }
  //   });
  // }
  uploadFile(fileInput: HTMLInputElement) {
    debugger;
        if (!this.selectedFile) {
          this.popupMessage = 'Please Select File.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
          this.isSubmitting = false;
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
          debugger;
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
    
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
          // Extract the data from the first 5 columns of each row
          let rowData = jsonData.slice(1).map((row: any) => {
          return {
          MOBILE_NO: row[0] !== undefined && row[0] !== '' ? row[0] : ''
          };
        });

// Clean invalid rows (optional — agar dono null ho to hatao)
          rowData = rowData.filter((row: any) => row.MOBILE_NO !== '' || this.loginUser !== '');
          this.isadd = 'I'
          this.submit(rowData);
          fileInput.value = '';
          this.selectedFile = null;
    };
  }
  submit(rowData: any) {
    debugger;
    if (!rowData) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage = "Please Enter Mobile Number";
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }, 100);
      return;
    }
    // const setup = new NPRManualSetup();
    
    //   setup.batch = '';
    //   setup.total_records = '';
    //   setup.processDate = '';
    //   setup.loaddate = '';
    //   setup.accept = '';
    //   setup.reject = '';
    //   setup.hold = '';
    //   setup.user_id = this.loginUser;
    //   setup.mobile = '';
    //   setup.rejectHoldCode = '';
    //   setup.processStatus = '';

    //   const mappedData = setup;
    if (this.isadd === 'I') {
      // debugger;
      // const insertUrl = `http://localhost:5000/api/NPRManualBilk/M`;
      // this.http.post(insertUrl, mappedData).subscribe({
      //   next: (response: any) => {
      //     const respStr = response.message;
      //     const parts = respStr.split(';');
      //     if (parts.length > 2) {
      //       debugger;
      //       const status = parts[0].trim();
      //       const seq = parts[1].trim();
      //       const message = parts[2].trim();
      //       this.generatedSeqWF = seq;
      //       this.popupMessage = message;
      //       // this.GetGrid();
      //       setTimeout(() => {
      //             this.showSuccessPopup = false;
      //           }, 3000);  
      //       if (status === '1') {
              debugger;
              const bulkData: NPRCurrentSetup[] = rowData.map((row: any) => {
              const setup = new NPRCurrentSetup();
              setup.mobile_no = (row.MOBILE_NO ? '0' + String(row.MOBILE_NO) : null) as string;
              setup.register_name = '';
              setup.user_name = '';
              setup.cnic = '';
              setup.nic = '';
              setup.passport = '';
              setup.otherid = '';
              setup.iccid = '';
              setup.account_type = '';
              setup.tariff_plan = '';
              setup.access_level = '';
              setup.secuirty_deposit = '';
              setup.line_rent = '';
              setup.refundamount = '';
              setup.refunddate = '';
              setup.userid = this.loginUser ?? null;
              setup.username = '';
              setup.inititor = '';
              setup.last_actiondate = '';
              setup.current_status = '';
              setup.message_timestamp = '';
              setup.assign_to = '';
              setup.due_date = '';
              setup.donor = '';
              setup.recipient = '';
              setup.rej_desc = '';
              return setup;
            });
              const insertUrl = `http://localhost:5000/api/NPRCurrentStatus/I`;
              this.http.post(insertUrl, bulkData).subscribe({
                next: (response: any) => {
                const respStr = response.message;
                this.popupMessage = respStr;
                this.showSuccessPopup = true;
                this.isErrorPopup = respStr.startsWith('0;');
                this.deleteRecord();
                const setup = new NPRBulkSetup();
    
                setup.userid = this.loginUser;

                const mappedData = setup;
                const insertUrl1 = `http://localhost:5000/api/NPRBulkStatus`;
                this.http.post(insertUrl1, mappedData).subscribe({                
                next: (response: any) => {
                debugger;
                const respStr = response.message;
                this.popupMessage = respStr;
                this.showSuccessPopup = true;
                this.isErrorPopup = respStr.startsWith('0;');                
                // this.ResetFields();
                setTimeout(() => {
                  this.showSuccessPopup = false;
                }, 3000);             
              },
              error: (err) => {
                console.error('Error during insert:', err);
                this.popupMessage = 'Failed to insert the record. Please try again.';
                this.isErrorPopup = true;
                this.showSuccessPopup = true;
                setTimeout(() => {
                  this.showSuccessPopup = false;
                }, 3000);  
              }
              });           
                // this.ResetFields();http://localhost:5000/api/NPRBulkStatus
                setTimeout(() => {
                  this.showSuccessPopup = false;
                }, 3000);             
              },
              error: (err) => {
                console.error('Error during insert:', err);
                this.popupMessage = 'Failed to insert the record. Please try again.';
                this.isErrorPopup = true;
                this.showSuccessPopup = true;
                setTimeout(() => {
                  this.showSuccessPopup = false;
                }, 3000);  
              }
              });
      //       } else {
      //         this.showSuccessPopup = true;
      //         this.isErrorPopup = true;
      //         setTimeout(() => {
      //             this.showSuccessPopup = false;
      //           }, 3000);  
      //       }
      //       this.ResetFields();
      //       setTimeout(() => {
      //             this.showSuccessPopup = false;
      //           }, 3000);  
      //     }          
      //   },
      //   error: (err) => {
      //     console.error('Error during insert:', err);
      //     this.popupMessage = 'Failed to insert the record. Please try again.';
      //     this.isErrorPopup = true; // Error popup
      //     this.showSuccessPopup = true; // Show popup
      //     this.isSubmitting = false;
      //   }
      // });
    }
  }
  confirmDelete(batch: string) {
    console.log("Confirm delete called for Batch No:", batch); // Add logging
    this.batch = batch;
    this.showModal = true; // Show the confirmation modal
  }
  closeModal() {
    this.showModal = false;
  }
  deleteRecord() {
      debugger;
      this.isSubmitting = true;
      this.showSuccessPopup = false;
      this.isErrorPopup = false;

      const body = {
        mobile_no : '',
        register_name : '',
        user_name : '',
        cnic : '',
        nic : '',
        passport : '',
        otherid : '',
        iccid : '',
        account_type : '',
        tariff_plan : '',
        access_level : '',
        secuirty_deposit : '',
        line_rent : '',
        refundamount : '',
        refunddate : '',
        userid : '',
        username : '',
        inititor : '',
        last_actiondate : '',
        current_status : '',
        message_timestamp : '',
        assign_to : '',
        due_date : '',
        donor : '',
        recipient : '',
        rej_desc : ''   
      };

      const url = `http://localhost:5000/api/NPRCurrentStatus/${this.loginUser}`
      const options = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          body: body
        };
      this.http.delete(url, options).subscribe(
          (response: any) => {
            debugger;
            const resMessage = response.message;            
            let msgR = resMessage.split(';').slice(1).join(','); // slice(1) to remo
            msgR = msgR.replace('}', '').trim();
            msgR = msgR.replace('"', '').trim();
            debugger;
            this.popupMessage = msgR;
            // this.filteredData = this.filteredData.filter((row) => row.hdate !== hdate);            
            // Show the popup
            this.showSuccessPopup = true;
            this.showModal = false;     
            // this.ResetFields();
            // this.GetGrid();
            // this.GetGrid1();
            // this.GetGrid2(this.batch);
            setTimeout(() => {
              this.showSuccessPopup = false;
            }, 3000);
            // this.AddFields();
          },
          (error) => {
            // Handle errors
            alert(`Error deleting record: ${error.message}`);
            console.error('Error Details:', error);
            setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
        }
      );
  }
  ResetFields() {
    this.GetGrid();
    this.GetGrid1();
    this.GridData2 = [];
  } 
  onProcess1() {  
    debugger;
    this.batchno = this.batch;
  }
}