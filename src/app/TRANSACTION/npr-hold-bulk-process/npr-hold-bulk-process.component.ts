import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import * as XLSX from 'xlsx';
import { environment } from 'environments/environment';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import { ExcelExportService } from 'app/services/excel-export.service';

export class NPRHoldSetup {
  batch: string;
  total_records: string;
  processDate: string;
  loaddate: string;
  holds: string;
  user_id: string;
  mobile: string;
  holdCode: string;
  processStatus: string;

  constructor() {
    this.batch = '';
    this.total_records = '';
    this.processDate = '';
    this.loaddate = '';
    this.holds = '';
    this.user_id = '';
    this.mobile = '';
    this.holdCode = '';
    this.processStatus = '';
  }
}

@Component({
  selector: 'app-public-nprbulkholdresponse-aspx',
  imports: [FormsModule, CommonModule, GlobalLovComponent],
  standalone: true,
  templateUrl: './npr-hold-bulk-process.component.html',
  styleUrl: './npr-hold-bulk-process.component.css'
})
export class NprHoldBulkProcessComponent {
  lovDisabled: boolean = false;
  Batch: any[] = [];
  selectedBatch: any;
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
  lblBatchNo: any;
  lblTotalReccords = 0;
  lblProcessRecords = 0;
  lblErrorRecords = 0;
  lblMessegeprocess: any;
  isProcessData: boolean = false;
  isgridview: boolean = true;
  isgridview1: boolean = true;
  isgridview2: boolean = false;
  isFetchData: boolean = true;


  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private excelService: ExcelExportService) { }
  ngOnInit(): void {
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.GetGrid();
    this.GetGrid1();
  }
  GetGrid() {
    debugger;
    const url = `${environment.apiBaseUrl}/api/NPRHoldBulk/S?id=${this.loginUser}`;
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
    const url = `${environment.apiBaseUrl}/api/NPRHoldBulk/LOV?id=${this.loginUser}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          //this.GridData1 = res;
          this.GridData1 = res
            .sort((a, b) => Number(b.batch) - Number(a.batch))
            .slice(0, 6);
          this.Batch = res.sort((a, b) => Number(a.batch) - Number(b.batch));
          this.selectedBatch = res[0].batch;
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
    const url = `${environment.apiBaseUrl}/api/NPRHoldBulk/BD?userid=${this.loginUser}&batch=${batch}`;
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
      this.isgridview2 = false;
      this.previousBatch = null;
    } else {
      this.GetGrid2(batch);
      this.isgridview2 = true;
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
  onProcess(batch: any) {
    debugger;
    const setup = new NPRHoldSetup();

    setup.batch = '';
    setup.total_records = '';
    setup.processDate = '';
    setup.loaddate = '';
    setup.holds = '';
    setup.user_id = this.loginUser;
    setup.mobile = '';
    setup.holdCode = '';
    setup.processStatus = '';

    const mappedData = setup;
    const insertUrl = `${environment.apiBaseUrl}/api/NPRHoldBulk/${batch}`;
    this.http.put(insertUrl, mappedData).subscribe({
      next: (response: any) => {
        const respStr = response.message;
        this.popupMessage = respStr;
        this.showSuccessPopup = true;
        this.isProcessData = false;
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

      let rowData = jsonData.slice(1).map((row: any) => {
        return {
          MOBILE_NO: row[0] !== undefined && row[0] !== '' ? row[0] : '',
          HOLD_CODE: row[1] !== undefined && row[1] !== '' ? row[1] : ''
        };
      });

      rowData = rowData.filter((row: any) => row.MOBILE_NO !== '' || row.HOLD_CODE !== '');
      const mobileList = rowData.map((r: any) =>
        r.MOBILE_NO.toString().trim()
      ); const duplicateMobiles = mobileList.filter(
        (item, index) => mobileList.indexOf(item) !== index
      );
      if (duplicateMobiles.length > 0) {
        this.showSuccessPopup = false;
        setTimeout(() => {
          this.popupMessage = 'Duplicate Mobile Number Found In Excel Sheet.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
          return;
        }, 100);
        return;
      }
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
    const setup = new NPRHoldSetup();

    setup.batch = '';
    setup.total_records = '';
    setup.processDate = '';
    setup.loaddate = '';
    setup.holds = '';
    setup.user_id = this.loginUser;
    setup.mobile = '';
    setup.holdCode = '';
    setup.processStatus = '';

    const mappedData = setup;
    if (this.isadd === 'I') {
      debugger;
      const insertUrl = `${environment.apiBaseUrl}/api/NPRHoldBulk/M`;
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
              const bulkData: NPRHoldSetup[] = rowData.map((row: any) => {
                const setup = new NPRHoldSetup();
                setup.batch = seq;
                setup.total_records = '';
                setup.processDate = '';
                setup.loaddate = '';
                setup.holds = '';
                setup.user_id = this.loginUser;
                // setup.mobile = row.MOBILE_NO ?? null;
                setup.mobile = (row.MOBILE_NO ? '0' + String(row.MOBILE_NO) : null) as string;
                setup.holdCode = row.HOLD_CODE ?? null;
                setup.processStatus = '';
                return setup;
              });
              for (let i = 0; i < bulkData.length; i++) {
                const mobile = bulkData[i].mobile?.toString();
                if (mobile && mobile.length > 13) {
                  bulkData[i].mobile = mobile.substring(0, 13);
                  this.lblErrorRecords += 1;
                }
              }
              const insertUrl = `${environment.apiBaseUrl}/api/NPRHoldBulk/D`;
              this.http.post(insertUrl, bulkData).subscribe({
                next: (response: any) => {
                  const respStr = response.message;
                  this.lblBatchNo = bulkData[0].batch;
                  this.lblTotalReccords = bulkData.length;
                  this.lblProcessRecords = this.lblTotalReccords - this.lblErrorRecords;
                  this.lblMessegeprocess = "Data Successfully inserted."
                  this.isProcessData = true;
                  this.popupMessage = respStr;
                  this.showSuccessPopup = true;
                  this.isgridview = true;
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
      holds: '',
      user_id: this.loginUser,
      mobile: '',
      holdCode: '',
      processStatus: ''
    };

    const url = `${environment.apiBaseUrl}/api/NPRHoldBulk/${this.batch}`
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
  }
  onFetch() {
    debugger;
    const batch = this.selectedBatch;//(document.getElementById('ddl_Batch') as HTMLInputElement).value;
    this.batch = batch;
    this.isgridview2 = true;
    this.GetGrid2(this.batch);
  }
  onRefresh() {
    window.location.reload();
  }
  onExcel() {
    this.export(this.GridData2, 'excel')
  }
  export(res: any, file: any) {
    debugger;
    this.excelService.exportToFile(
      res, 'Bulk NPR Manual Response', {
      batch: 'Batch #',
      mobile: 'Mobile',
      rejectHoldCode: 'Reject & Hold Code',
      processStatus: 'Process Status',
      user_id: 'User ID'
    }, file
    );
  }
}
