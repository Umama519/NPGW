import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import * as XLSX from 'xlsx';

export class NPRResendSetup {
  nprnumber: string;
  name: string;
  cnic: string;
  imsi: string;
  donor: string;
  uploaddate: string;
  tage: string;
  jobno: string;
  remarks: string;
  fromdate: string;
  todate: string;
  nprremarks: string;
  ip: string;
  userid: string;

  constructor() {
    this.nprnumber = '';
    this.name = '';
    this.cnic = '';
    this.imsi = '';
    this.donor = '';
    this.uploaddate = '';
    this.tage = '';
    this.jobno = '';
    this.remarks = '';
    this.fromdate = '';
    this.todate = '';
    this.nprremarks = '';
    this.ip = '';
    this.userid = '';
  }
}

export class NPRResendSolerrSetup {
  mobile_no: string;
  name: string;
  cnic: string;
  imsi: string;
  donor: string;
  jobno: string;
  fromdate: string;
  todate: string;
  ip: string;
  userid: string;

  constructor() {
    this.mobile_no = '';
    this.name = '';
    this.cnic = '';
    this.imsi = '';
    this.donor = '';
    this.jobno = '';
    this.fromdate = '';
    this.todate = '';
    this.ip = '';
    this.userid = '';
  }
}
declare var $: any;
@Component({
  selector: 'app-public-nprbulkresendsolicitederror-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './npr-resend-solerr-response.component.html',
  styleUrl: './npr-resend-solerr-response.component.css'
})
export class NprResendSolerrResponseComponent {
  selectedFile: File | null = null;
  loginUser: string = '';
  filteredData: any[] = [];
  GridData: any[] = [];
  GridData1: any[] = [];
  GridData2: any[] = [];
  isadd: string = '';
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  showSuccessPopup: boolean = false;
  isSubmitting: boolean = false;
  generatedSeqWF: any;  
  batch: string | null = null;
  showModal: boolean = false;
  batchno: string | null = null;  
  isgrid1 = false;
  isgrid2 = false;
  lblBatchNo: any;
  lblTotalReccords = 0;
  lblProcessRecords = 0;
  lblErrorRecords = 0;
  lblMessegeprocess: any;
  isProcessData: boolean = false;

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
   ngOnInit(): void {    
    this.initializeDatepicker('#txt_ToDate');
    this.initializeDatepicker('#txt_FromDate');
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.GetGrid();
    this.GetGrid1();
  }

  private initializeDatepicker(selector: string): void {
  ($(selector) as any).datepicker({
    dateFormat: 'dd-mm-yy',
    changeYear: true,
    yearRange: '1970:2035',
    changeMonth: true,
    showAnim: 'fadeIn',
    duration: 'fast',
    showOtherMonths: true,
    selectOtherMonths: true,

    beforeShow: (input: any, inst: any) => {
      setTimeout(() => this.styleDatepicker(inst), 10);
    },

    onChangeMonthYear: (year: number, month: number, inst: any) => {
      setTimeout(() => this.styleDatepicker(inst), 10);
    }
  });
}
  private styleDatepicker(inst: any): void {
  inst.dpDiv.css({
    background: '#ffffff',
    border: '2px solid #10486B',
    borderRadius: '8px',
    padding: '4px',
    boxShadow: '0 3px 8px rgba(10, 121, 233, 0.2)',
    fontSize: '11px',
    width: '210px',
  });

  inst.dpDiv.find('.ui-datepicker-header').css({
    backgroundColor: '#10486B',
    color: '#ffffff',
    padding: '8px 0',
    fontWeight: 'bold',
    borderRadius: '8px 8px 0 0',
    textAlign: 'center'
  });

  inst.dpDiv.find('td, th').css({
    padding: '2px',
    height: '24px',
    width: '24px',
    textAlign: 'center'
  });

  inst.dpDiv.find('.ui-state-default').css({
    background: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    color: '#212529'
  });

  inst.dpDiv.find('.ui-state-hover').css({
    background: '#ffc107',
    color: '#000'
  });

  inst.dpDiv.find('.ui-state-active').css({
    background: '#10486B',
    color: '#fff',
    fontWeight: 'bold'
  });

  (inst.dpDiv.find('.ui-datepicker-prev, .ui-datepicker-next') as any).css({
    'background-image': 'none',
    // 'color': '#ffc107',
    'font-weight': 'bold',
    'font-size': '18px',
    'background': '#10486B',
    'border': 'none'
  });

  (inst.dpDiv.find('.ui-datepicker-prev') as any).html('⬅️');
  (inst.dpDiv.find('.ui-datepicker-next') as any).html('➡️');
  }

  GetGrid() {
    debugger;
    const url = `http://localhost:5000/api/NPRResendBulk/S?id=${this.loginUser}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.GridData = res;
          // this.filteredData = res;
        } else {
          console.log('No data found');
          this.GridData = [];
          // this.filteredData = [];
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.GridData = [];
        // this.filteredData = [];
      }
    });
  }
  GetGrid1() {
    debugger;
    const url = `http://localhost:5000/api/Action_LOV_/BatchResend`;
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
  GetGrid2(jobno: any) {
    debugger;
    const url = `http://localhost:5000/api/NPRResendSolerr/G?id=${jobno}`;
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
  previousJobno: any = null;

  onBatch(jobno: any) {
    debugger;
    if (this.previousJobno === jobno) {
      this.GridData2 = [];
      this.previousJobno = null;
      this.isgrid2 = false;
    } else {    
      this.GetGrid2(jobno);
      this.previousJobno = jobno;     
      this.isgrid2 = true;
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
  onProcess(jobno: any) {
    debugger;
    const setup = new NPRResendSetup();
    
      setup.nprnumber = '';
      setup.name = '';
      setup.cnic = '';
      setup.imsi = '';
      setup.donor = '';
      setup.uploaddate = '';
      setup.tage = '';
      setup.jobno = jobno;
      setup.remarks = '';
      setup.fromdate = '';
      setup.todate = '';
      setup.nprremarks = '';
      setup.ip = '';
      setup.userid = this.loginUser;

      const mappedData = setup;
    const insertUrl = `http://localhost:5000/api/NPRResendBulk/${jobno}`;
    this.http.put(insertUrl, mappedData).subscribe({
      next: (response: any) => {
        const respStr = response.message;
        this.popupMessage = respStr;
        this.showSuccessPopup = true;
        this.isErrorPopup = respStr.startsWith('0;');  
        this.ResetFields();
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);              
        },
        error: (err) => {
        console.error('Error during insert:', err);
        this.popupMessage = 'Failed to insert the record. Please try again.';
        this.isErrorPopup = true;
        this.showSuccessPopup = true;        
        this.ResetFields();
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
        }
    });
  }
  uploadFile(fileInput: HTMLInputElement) {
    debugger;
       if (!this.selectedFile) {
      this.showSuccessPopup = false;
      setTimeout(() => {
      this.popupMessage =
        !this.selectedFile ? 'Please Select File' : '';

        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      return;
      }, 100);
      return;
    }
    this.lblBatchNo = '';
        this.lblTotalReccords = 0;
        this.lblErrorRecords = 0;
        this.lblProcessRecords = 0;
        this.lblMessegeprocess = '';
        this.isProcessData = false;
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
          Mobile_No: row[0] !== undefined && row[0] !== '' ? row[0] : '',
          Name: row[1] !== undefined && row[1] !== '' ? row[1] : '',
          Cnic: row[2] !== undefined && row[2] !== '' ? row[2] : '',
          Ismi: row[3] !== undefined && row[3] !== '' ? row[3] : '',
          Donor: row[4] !== undefined && row[4] !== '' ? row[4] : ''
          };
        });

// Clean invalid rows (optional — agar dono null ho to hatao)
          rowData = rowData.filter((row: any) => row.Mobile_No !== '' || row.Name !== '' || row.Cnic !== '' || row.Ismi !== '' || row.Donor !== '');
          this.isadd = 'I'
          this.submit(rowData);
          fileInput.value = '';
          this.selectedFile = null;
    };
  }
  submit(rowData: any) {
    debugger;
    if (!rowData) {
      // this.showSuccessPopup = false;
      // setTimeout(() => {
      //   this.popupMessage = "Please Enter Rejection Code";
      //   this.isErrorPopup = true;
      //   this.showSuccessPopup = true;
      // }, 100);
      return;
    }
    const setup = new NPRResendSolerrSetup();
    setup.mobile_no = '';
    setup.name = '';
    setup.cnic = '';
    setup.imsi = '';
    setup.donor = '';
    setup.jobno = '';
    setup.fromdate = '';
    setup.todate = '';
    setup.ip = '';
    setup.userid = this.loginUser;

    const mappedData = setup;
    if (this.isadd === 'I') {
      debugger;
      const insertUrl = `http://localhost:5000/api/NPRResendSolerr/M`;
      this.http.post(insertUrl, mappedData).subscribe({
        next: (response: any) => {
          const respStr = response.message;
          const parts = respStr.split(';');
          if (parts.length > 2) {
            debugger;
            const status = parts[0].trim();
            const seq = parts[1].trim();
            const message = parts[2].trim();
            this.generatedSeqWF = seq;
            this.popupMessage = message;
            // this.GetGrid();
            setTimeout(() => {
                  this.showSuccessPopup = false;
                }, 3000);  
            if (status === '1') {
              debugger;
              const bulkData: NPRResendSolerrSetup[] = rowData.map((row: any) => {
              const setup = new NPRResendSolerrSetup();
              setup.mobile_no = (row.Mobile_No ? '0' + String(row.Mobile_No) : null) as string;
              setup.name = row.Name ?? null;
              setup.cnic = (row.Cnic ? '0' + String(row.Cnic) : null) as string;
              setup.imsi = row.Ismi;
              setup.donor =  row.Donor;
              setup.jobno = this.generatedSeqWF;
              setup.fromdate = '';
              setup.todate = '';
              setup.ip = '::1';
              setup.userid = this.loginUser;
              return setup;
            });
             for (let i = 0; i < bulkData.length; i++) {
              const mobile = bulkData[i].mobile_no?.toString();
              if (mobile && mobile.length > 13) {
                bulkData[i].mobile_no = mobile.substring(0, 13);
                this.lblErrorRecords += 1;
            }
          }
              const insertUrl = `http://localhost:5000/api/NPRResendSolerr/D`;
              this.http.post(insertUrl, bulkData).subscribe({
                next: (response: any) => {
                const respStr = response.message;
                this.lblBatchNo = bulkData[0].jobno;
                this.lblTotalReccords = bulkData.length;
                this.lblProcessRecords = this.lblTotalReccords - this.lblErrorRecords;
                this.lblMessegeprocess = "Data Successfully inserted."
                this.isProcessData = true;
                this.popupMessage = respStr;
                this.showSuccessPopup = true;
                this.isErrorPopup = respStr.startsWith('0;');                
                this.ResetFields();
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
            } else {
              this.showSuccessPopup = true;
              this.isErrorPopup = true;
              setTimeout(() => {
                  this.showSuccessPopup = false;
                }, 3000);  
            }
            this.ResetFields();
            setTimeout(() => {
                  this.showSuccessPopup = false;
                }, 3000);  
          }          
        },
        error: (err) => {
          console.error('Error during insert:', err);
          this.popupMessage = 'Failed to insert the record. Please try again.';
          this.isErrorPopup = true; // Error popup
          this.showSuccessPopup = true; // Show popup
          this.isSubmitting = false;
        }
      });
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
        batch: '',
        total_records: '',
        processDate: '',
        loaddate: '',
        user_id: this.loginUser,
        mobile: '',
        processStatus: ''
      };

      const url = `http://localhost:5000/api/NPRResendBulk/${this.batch}`
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
            this.GetGrid();
            this.GetGrid1();
            this.GetGrid2(this.batch);
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
    setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
  } 
  onProcess1() {  
    debugger;
    this.batchno = this.batch;
  }
  onSearch() {
    debugger;      
    const jobnoInput = (document.getElementById('txt_Jobno') as HTMLInputElement).value.trim();
    const fromDateInput = (document.getElementById('txt_FromDate') as HTMLInputElement).value.trim();
    const toDateInput = (document.getElementById('txt_ToDate') as HTMLInputElement).value.trim();

    if (!jobnoInput || !fromDateInput || !toDateInput) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage =
          !jobnoInput ? 'Please Enter Job Number ID' :
            !fromDateInput ? 'Please Enter From Date'
             : 'Please Enter To Date';

        this.isErrorPopup = true;
        this.showSuccessPopup = true;
        return;
      }, 100);
      return;
    }
    
    const url = `http://localhost:5000/api/NPRResendSolerr/S?fromdate=${fromDateInput}&todate=${toDateInput}&jobno=${jobnoInput}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.GridData = res;
          this.isgrid1 = true;
          this.isgrid2 = false;
        } else {
          this.popupMessage = "No data found";
          this.isErrorPopup = true;
          this.showSuccessPopup = false;
          this.GridData = [];
          this.isgrid1 = false;
          this.isgrid2 = false;
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.popupMessage = err;
        this.isErrorPopup = true;
        this.showSuccessPopup = false;
        this.GridData = [];
        this.isgrid1 = false;
        this.isgrid2 = false;
      }
    });
    setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
  }
}
