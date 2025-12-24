import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-public-npcancel-aspx',
  standalone: true,  
  imports: [FormsModule, CommonModule ],
  templateUrl: './np-cancel.component.html',
  styleUrl: './np-cancel.component.css'
})
export class npcancelComponent {
  model: any = {
    mobile: '',
    onoName: '',
    date: '',
    modbile: '',
    nprDate: '',
    onic: '',
    regName: '',
    passport: '',
    user: '',
    cnic: '',
    productType: '',
    other: '',
    mnpNumber: '',
  
  };
  parseBackendDate(val: any): Date | null {
  if (!val) return null;

  if (typeof val !== "string") return null;
  val = val.trim();
  if (!val) return null;

  // Expected: 20/11/2025 10:22:10
  const parts = val.split(" ");
  if (parts.length !== 2) return null;

  const datePart = parts[0].split("/"); // DD/MM/YYYY
  const timePart = parts[1].split(":"); // HH:mm:ss

  if (datePart.length !== 3 || timePart.length !== 3) return null;

  const dd = Number(datePart[0]);
  const mm = Number(datePart[1]) - 1; // JS months start from 0
  const yyyy = Number(datePart[2]);

  const HH = Number(timePart[0]);
  const MI = Number(timePart[1]);
  const SS = Number(timePart[2]);

  const d = new Date(yyyy, mm, dd, HH, MI, SS);

  return isNaN(d.getTime()) ? null : d;
}
formatDateForBackend(dateInput: any): string {
  const date = this.parseBackendDate(dateInput);
  if (!date) return "";

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

  showSuccessPopup = false;
  popupMessage = '';
  isErrorPopup = false;
   MNPNumber: string = '';
  isSubmitted = false;
  viewStateMnpNumber: string = ''; 
  UserId_: string = '';
  constructor(private http: HttpClient,private el: ElementRef, private  router: Router) { 
    
  }

  ngOnInit(): void {    
    const currentDate = new Date();
    const formattedDate = this.formatDateTime(currentDate);
    const txt_date = this.el.nativeElement.querySelector('#txt_date') as HTMLInputElement;
    if (txt_date) {
      this.model.date = formattedDate;
     }
   
    this.model.mnpNumber = localStorage.getItem("selectedMnp") ?? '';
    this.viewStateMnpNumber = this.model.mnpNumber;
    this.dataLoad();
    
  }
  private formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }
  async dataLoad() {
    
    try {
      const url = `${environment.apiBaseUrl}/api/NPCancel/GetCancelData?mnp=${encodeURIComponent(this.model.mnpNumber)}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json?.success && json?.data && json.data.length > 0) {

      let r = json.data[0];
      this.model.nprDate = r.NPRDT  ?? null;
      this.model.regName = r.REGNAM ?? "";
      this.model.onoName = r.OOPERATOR ?? "";
      this.model.modbile = r.MOB_NO ?? "";
      this.model.onic = r.OLDNIC ?? null;
      this.model.cnic = r.NEWNIC ?? null;
      this.model.passport = r.PASSP_NO ?? null;
      this.model.user = r.USERID ?? "";
      this.model.regName = (r.REGNAM && typeof r.REGNAM === "object" && Object.keys(r.REGNAM).length === 0)
        ? ""
        : r.REGNAM ?? "";
      this.model.onic = (r.OLDNIC && typeof r.OLDNIC === "object" && Object.keys(r.OLDNIC).length === 0)
        ? ""
        : r.OLDNIC ?? "";
      this.model.cnic = (r.NEWNIC && typeof r.NEWNIC === "object" && Object.keys(r.NEWNIC).length === 0)
        ? ""
        : r.NEWNIC ?? "";

      this.model.passport = (r.PASSP_NO && typeof r.PASSP_NO === "object" && Object.keys(r.PASSP_NO).length === 0)
        ? ""
        : r.PASSP_NO ?? "";

        const mnp = localStorage.getItem("selectedMnp") ?? "";

        if (!this.viewStateMnpNumber) {
          this.viewStateMnpNumber = mnp;
        } else {
          this.viewStateMnpNumber = mnp; // VB.NET me dono branches same kaam kar rahe hain
        }
    } else {
        this.showPopup("Unable to load Cancel form data.", true);
      }

    } catch (ex) {
      //console.error(ex);
      this.showPopup("Error loading data: " + ex, true);
    }
  }
  
 resetFields() {
    this.model = {
      mobile: '',
      onoName: '',
      date: '',
      modbile: '',
      nprDate: '',
      onic: '',
      regName: '',
      passport: '',
      user: '',
      cnic: '',
      productType: '',
      other: '',
      mnpNumber: ''
    };
  }
   
  async ResetButton() {
    this.resetFields();
  }
 


    


  // ------------------ SUBMIT FORM ------------------
  async onSubmit() {
    
    if (this.isSubmitted) return;
    this.isSubmitted = true;

    try {
      this.viewStateMnpNumber = this.model.mnpNumber;
      const formattedDate = this.formatDateForBackend(this.model.nprDate);

      const frid = localStorage.getItem("FRID");
      this.UserId_ = frid ? "999999999999999" : (localStorage.getItem('loginUser') ?? '');

      const payload = {
        UID: this.UserId_,
        NPRDATE: formattedDate,
        OOPERATOR: this.model.onoName || '',
        MOB: this.model.modbile || '',
        REGNAME: this.model.regName || '',
        USER: this.model.user || '',
        ONIC: this.model.onic || '',
        NNIC: this.model.cnic || '',
        PASSP: this.model.passport || '',
        AACT: "NPRCAN",
        CPRD: "",
        ACTION: "I",
        UserId: this.UserId_,
        MnpNumber: this.viewStateMnpNumber
      };

      // ----------- SUBMIT (No JSON return) -----------
      await this.http.post(
        `${environment.apiBaseUrl}/api/NPCancel/SubmitCancel`,
        payload,
        { responseType: 'text' }
      ).toPromise();

      // ----------- GET LOG AFTER SUBMIT -----------
      const param0Value =
        frid === null ? localStorage.getItem("loginUser")?.trim() : "999999999999999";

      const logJson: any = await this.http
        .get(`${environment.apiBaseUrl}/api/NPCancel/GetNprLog?userId=${param0Value}&otherParam=`)
        .toPromise();

      if (logJson?.data?.length > 0) {
        const record = logJson.data[0];

        const retValue = record.MSG?.toString().split(";");

        if (retValue && retValue.length >= 2) {
          const code = retValue[0];
          const message = retValue[1];

          if (code !== "0") {
            this.showPopup(message, false);
            if (!frid)
              this.router.navigateByUrl('/app-public-porting-aspx');
              //  window.location.href = "/app-public-porting-aspx";
          } else {
            this.showPopup(message, true);
          }
        } else {
          this.showPopup("Invalid log format.", true);
        }

      } else {
        this.showPopup("No log data returned.", true);
      }

    } catch (err) {
      this.showPopup("Submit Error: " + err, true);

    } finally {
      this.isSubmitted = false;
    }
  }

  showPopup(message: string, isError: boolean = false) {
  this.popupMessage = message;

  // Default values
  this.isErrorPopup = isError;
  this.showSuccessPopup = true;

  // Database return check
  if (message && message.trim().startsWith('0;')) {
    this.isErrorPopup = true;   // Red
  } 
  else if (message && message.trim().startsWith('1;')) {
    this.isErrorPopup = false;  // Green
  }

  // Auto hide after 3 seconds
  setTimeout(() => {
    this.showSuccessPopup = false;
  }, 3000);
}
}

