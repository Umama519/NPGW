import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Required for [(ngModel)]
import { environment } from 'environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-public-manualnprsending-aspx',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 Add FormsModule + CommonModule here
  templateUrl: './manualnpr-sending.component.html',
  styleUrls: ['./manualnpr-sending.component.css']
})
export class ManualNprSendingComponent implements OnInit {
  donors: any[] = [];
  records: any[] = [];
 showDivData = false;
showProcessBtn = false;
showSaveBtn = false;
showSuccessPopup = false;
isErrorPopup = false;
popupMessage = '';


  // Filters and fields
  filter = {
    status: 'ALL',
    donor: '%',
    bvs: 'ALL',
    mobile: '',
    rownum: 100,
    
  };

  messageFrom: number | null = null;
  messageTo: number | null = null;
  showFileFormat = true;
  loginUser: string = '';  
  selectedFile: File | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadDonors();
    
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }

  // ----------------------------
  // API CALLS (Front-end Only)
  // ----------------------------

  async loadDonors() {
    try {      
      const res = await fetch(`${environment.apiBaseUrl}/api/Manualnpr/donors`);
      //const res = await fetch('https://your-api-domain.com/api/donors');
      if (!res.ok) throw new Error('Failed to load donors');
      this.donors = await res.json();
    } catch (err) {
    //  console.error('Error loading donors:', err);
      this.showPopup('Error loading donors', true);
    }
  }

  async fetch() {    
  try {
    // Default rows
    if (!this.filter.rownum || this.filter.rownum.toString().trim() === '') {
      this.filter.rownum = 100;
    }

    // Convert BVS dropdown value
    let bvsValue = '%';
    if (this.filter.bvs === 'BVS') {
      bvsValue = 'Y';
    } else if (this.filter.bvs === 'Non BVS') {
      bvsValue = 'N';
    }

    const query = new URLSearchParams({
      status: this.filter.status,
      donor: this.filter.donor,
      bvs: bvsValue,
      mobile: this.filter.mobile || '',
      rownum: this.filter.rownum.toString(),
    });

    const res = await fetch(`${environment.apiBaseUrl}/api/Manualnpr/fetch-npr?${query}`);
    if (!res.ok) throw new Error('Fetch failed');

    this.records = await res.json();

    // Match VB logic:
    if (this.records.length > 0) {
      // ✅ Data available
      this.showDivData = true;            // show grid
      this.showFileFormat = false;        // hide excel format
      this.showProcessBtn = true;         // show process
      this.showSaveBtn = true;            // show save
      this.messageFrom = 1;
      this.messageTo = this.records.length;

      this.showPopup(`${this.records.length} records found.`, false);
    } else {
      // ❌ No data
      this.records = [];
      this.showDivData = false;           // hide grid
      this.showFileFormat = true;         // show excel format
      this.showProcessBtn = false;        // hide process
      this.showSaveBtn = false;           // hide save

      this.showPopup('No record found.', true);
    }

  } catch (err) {
   // console.error('Error fetching data:', err);
    this.showPopup('Error fetching data.', true);
  }
}


 


async uploadFile() {  
  if (!this.selectedFile) {
    this.showPopup('Please select an Excel file', true);
    return;
  }

  const reader = new FileReader();

  reader.onload = (e: any) => {
  try {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
 //   console.log('Sheet found:', sheetName);
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //  console.log('Excel rows count:', jsonData.length);

    const mobiles = (jsonData || [])
      .slice(1)
      .filter((row: any) => Array.isArray(row) && row.length > 0)
      .map((row: any) => ({ mobile: row[0]?.toString().trim() }))
      .filter(x => x.mobile);

   // console.log('Mobiles parsed:', mobiles);
    this.sendToApi(mobiles);
  } catch (err) {
//    console.error('Reader onload error:', err);
    this.showPopup('Invalid Excel file format', true);
  }
};

  reader.readAsArrayBuffer(this.selectedFile);
}


async sendToApi(mobiles: any[]) {
  try {
    const res = await fetch(`${environment.apiBaseUrl}/api/Manualnpr/UploadManualNPR`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: this.loginUser,
    data: mobiles
      })
    });

    // 🔹 Try to read JSON safely
    let result: any = null;
    try {
      result = await res.json();
    } catch {
      result = null;
    }

    if (!res.ok) {
      const msg = result?.message || `Upload failed (${res.status})`;
      throw new Error(msg);
    }

    this.showPopup(result?.message || `File uploaded successfully. Total: ${result?.total || 0}`, false);
  } catch (err) {
 //   console.error('Upload error:', err);
    this.showPopup('Upload failed: ' + (err as any)?.message, true);
  }
}

  async fetchUploaded() {
    try {
    const res = await fetch(
      `${environment.apiBaseUrl}/api/Manualnpr/fetch-uploaded?userId=${this.loginUser}`
    );

    if (!res.ok) throw new Error('Fetch uploaded failed');

    const result = await res.json();
this.showDivData = true;
    // 🟢 Backend se data mila?
    if (result.success && result.data && result.data.length > 0) {
      this.records = result.data;
      this.showFileFormat = false;
      this.showProcessBtn = true;
      this.showSaveBtn = true;
      this.showPopup(result.message || 'Uploaded data fetched successfully');
    } else {
      this.records = [];
      this.showProcessBtn = false;
      this.showSaveBtn = false;
      this.showFileFormat = true;
      this.showPopup(result.message || 'No data found', true);
    }
  } catch (err: any) {
   // console.error('Fetch uploaded error:', err);
    this.records = [];
    this.showFileFormat = true;
    this.showProcessBtn = false;
    this.showSaveBtn = false;
    this.showPopup('Error fetching uploaded data', true);
  }
}


  async processSelected() {
      try {
    if (!this.messageFrom || !this.messageTo) {
      this.showPopup('Message Number From and To is required.', true);
      return;
    }

    if (this.messageTo < this.messageFrom) {
      this.showPopup('Message Number To must be greater than Message Number From.', true);
      return;
    }

    const selected = this.records.filter(x => x.__selected);
    if (selected.length === 0) {
      this.showPopup('There are no selected messages for processing.', true);
      return;
    }

    const messageId = selected
      .map(x => x.MESSAGEID)
      .filter(id => id != null && id != undefined)
      .join(',');

    const payload = {
      messageIds: messageId,
      userId: localStorage.getItem('loginUser') || '' // replace with actual login user if available
    };

    const res = await fetch(`${environment.apiBaseUrl}/api/Manualnpr/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('API call failed');

    const result = await res.json();

    if (result.success) {
      this.showPopup(result.message || 'Records processed successfully.');
      this.fetch(); // refresh data (equivalent to VB filldata)
    } else {
      this.showPopup(result.message || 'Error processing records.', true);
    }
  } catch (err) {
    //console.error('Process error:', err);
    this.showPopup('Error processing records.', true);
  }
}


  async exportExcel() {
  try {
    this.showPopup('Preparing Excel file...');

    // 🔹 1. Build query string (use your filters)
    const query = new URLSearchParams({
      status: this.filter.status || 'ALL',
      donor: this.filter.donor || 'ALL',
      bvs: this.filter.bvs || 'ALL',
      mobile: this.filter.mobile || '',
      rownum: this.filter.rownum?.toString() || '100',
    });

    // 🔹 2. Fetch data from API
    const res = await fetch(`${environment.apiBaseUrl}/api/Manualnpr/exportdata?${query}`);
    if (!res.ok) throw new Error('Failed to fetch data');

    const data = await res.json();
    if (!data || data.length === 0) {
      this.showPopup('No records found to export', true);
      return;
    }

    // 🔹 3. Clean data (handle [object Object] and nulls)
    const cleanedData = data.map((row: any) => {
        const cleanRow: any = {};
        Object.keys(row).forEach(key => {
          cleanRow[key] = this.getDisplayValue(row[key]);
        });
        return cleanRow;
      });

    // 🔹 4. Convert JSON → worksheet → workbook
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(cleanedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Manual NPR Data': worksheet },
      SheetNames: ['Manual NPR Data'],
    };

    // 🔹 5. Generate Excel file
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // 🔹 6. Trigger file download
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ManualNPRData.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);

    this.showPopup('Excel exported successfully');
  } catch (err) {
   // console.error('Error exporting Excel:', err);
    this.showPopup('Error exporting Excel', true);
  }
}


getDisplayValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    // try to return something readable if it has one property
    const keys = Object.keys(value);
    return keys.length > 0 ? value[keys[0]] : '';
  }
  return value;
}
  // ----------------------------
  // Utility Methods
  // ----------------------------

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = event.target.files[0];
 // console.log('Selected File:', this.selectedFile);
    this.showFileFormat = !!file;
  }

  hasSelection(): boolean {
    return this.records.some((x) => x.__selected);
  }

  selectRange() {
    if (this.messageFrom == null || this.messageTo == null) {
      this.showPopup('Please enter both From and To range', true);
      return;
    }

    const from = Number(this.messageFrom);
    const to = Number(this.messageTo);

    if (isNaN(from) || isNaN(to)) {
      this.showPopup('Range values must be numeric', true);
      return;
    }

    if (from > to) {
      this.showPopup('Range "From" cannot be greater than "To"', true);
      return;
    }

    this.records.forEach((r, i) => {
      r.__selected = i + 1 >= from && i + 1 <= to;
    });

    this.showPopup(`Records ${from} to ${to} selected successfully`);
  }

  reset() {
    
    this.filter = { status: 'ALL', donor: '%', bvs: 'ALL', mobile: '', rownum: 100 };
    this.records = [];
    this.selectedFile = null;
    this.messageFrom = null;
    this.messageTo = null;
    this.showDivData = false;
    this.showFileFormat = true;         // show excel format
      this.showProcessBtn = false;        // hide process
      this.showSaveBtn = false;  
   // this.showFileFormat = false;
   // this.showPopup('Form reset');
  }

  showPopup(message: string, isError: boolean = false) {
    this.popupMessage = message;
    this.isErrorPopup = isError;
    this.showSuccessPopup = true;
    setTimeout(() => (this.showSuccessPopup = false), 3000);
  }
}
