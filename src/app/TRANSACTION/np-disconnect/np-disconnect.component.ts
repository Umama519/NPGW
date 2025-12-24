import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-public-npdisconnect-aspx',
  standalone: true,  
  imports: [FormsModule, CommonModule ],
  templateUrl: './np-disconnect.component.html',
  styleUrl: './np-disconnect.component.css'
})
export class npdisconnectComponent {
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
    mnpNumber: ''
    
   
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
  viewStateMnpNumber: string = '';
  UserId_: string = '';
  constructor(private http: HttpClient,private el: ElementRef,) { 
    
  }

  ngOnInit(): void {
    this.resetFields();
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
   showPopup(message: string, isError: boolean = false) {
    this.popupMessage = message;
    this.isErrorPopup = isError;
    this.showSuccessPopup = true;
    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 3000); // popup auto-hide after 3 sec
  }
  async onSearchClick() {
    
    if (!this.model.mobile) {
      this.showPopup('Please enter Mobile #', true);
      return;
    }

    try {
      const res = await fetch(`${environment.apiBaseUrl}/api/NPDisconnect/CheckMobile?mobile=${encodeURIComponent(this.model.mobile)}`);
      const json = await res.json();

      if (json?.success && json?.result) {
        const retval = json.result.split(';');
        if (retval[0] === '1' && retval[1]) {
          this.loadData(retval[1]);
        } else {
          this.resetFields();
          this.showPopup(retval[1] || 'No data found', true);
        }
      } else {
        this.showPopup('Error: Could not fetch mobile details', true);
      }
    } catch (err) {
  //    console.error(err);
      this.showPopup('Error occurred while searching', true);
    }
  }

  async loadData(type: string) {
    
    try {
      const res = await fetch(`${environment.apiBaseUrl}/api/NPDisconnect/GetNPDiscount?mobile=${encodeURIComponent(this.model.mobile)}&type=${encodeURIComponent(type)}`);
      const json = await res.json();

      if (json?.success && json.data?.length > 0) {
        const row = json.data[0];
        this.model.nprDate = row.NPRDT;

        this.model.regName = row.REGNAM ?? "";
        this.model.onoName = row.OOPERATOR ?? "";
        this.model.modbile = row['MOB_NO'] ?? "";
        this.model.onic = row.OLDNIC ?? "";
        this.model.cnic = row.NEWNIC ?? "";
        this.model.passport = row['PASSP'] ?? "";
        this.model.other = row.OtherID ?? "";
        this.model.user = row.USERID ?? "";
        this.model.mnpNumber = row.MNP_NO ?? "";
        this.viewState.MNPNumber = this.model.mnpNumber;
        this.model.productType = row.NPROD === 'O' ? 'PostPaid' : 'PrePaid';

        this.model.regName = (row.REGNAM && typeof row.REGNAM === "object" && Object.keys(row.REGNAM).length === 0)
        ? ""
        : row.REGNAM ?? "";
      this.model.onic = (row.OLDNIC && typeof row.OLDNIC === "object" && Object.keys(row.OLDNIC).length === 0)
        ? ""
        : row.OLDNIC ?? "";
      this.model.cnic = (row.NEWNIC && typeof row.NEWNIC === "object" && Object.keys(row.NEWNIC).length === 0)
        ? ""
        : row.NEWNIC ?? "";

      this.model.passport = (row.PASSP && typeof row.PASSP === "object" && Object.keys(row.PASSP).length === 0)
        ? ""
        : row.PASSP ?? "";
      } else {
        this.resetFields();
        this.showPopup('No data found', true);
      }
    } catch (err) {
   //   console.error(err);
      this.showPopup('Error loading data', true);
    }
  }
    viewState = {
      MNPNumber: ''
    };
  async ResetButton() {
    this.resetFields();
  }
  async onSubmitClick() {
    
  if (!this.model.mnpNumber) {
    this.showPopup('No record selected for disconnection', true);
    return;
  }

  // Session variables mimic karne ke liye assume yeh properties hain
  const sessionUserId = localStorage.getItem("loginUser") || ""; //this.sessionUserId;  // example: from local storage or service
  const sessionFrid = localStorage.getItem("FRID") || ""; 

  try {
    this.viewStateMnpNumber = this.model.mnpNumber;
    const formattedDate = this.formatDateForBackend(this.model.nprDate);
     const frid = localStorage.getItem("FRID");
     this.UserId_ = frid ? "999999999999999" : (localStorage.getItem('loginUser') ?? '');
    // Step 1: Stored Procedure call (Equivalent to ExecuteNonQueryOracle(SQL))
    const payload = {
      UID: this.UserId_,
      OOPERATOR: this.model.onoName,
      PRODUCT_TYPE: this.model.productType === 'PostPaid' ? 'O' : 'R',
      MOB: this.model.modbile,
      ONIC: this.model.onic,
      REGNAME: this.model.regName,
      NNIC: this.model.cnic,
      USER: this.model.user,
      PASSP: this.model.passport,
      NPRDATE: formattedDate,  // Make sure this is in correct date format (ISO string preferred)
      CPRD: '',
      AACT: "NPRDIS",
      ACTION: 'I', // Insert operation as in VB code
      UserId: this.UserId_,
      mnpNumber: String(this.model.mnpNumber ?? "")
    };
    
      await this.http.post(
        `${environment.apiBaseUrl}/api/NPDisconnect/NPDiscount`,
        payload,
        { responseType: 'text' }
      ).toPromise();
    // const procResponse = await fetch(`${environment.apiBaseUrl}/api/NPDisconnect/ExecuteProcedure`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(procPayload)
    // });

    const param0Value =
        frid === null ? localStorage.getItem("loginUser")?.trim() : "999999999999999";

      const logJson: any = await this.http
        .get(`${environment.apiBaseUrl}/api/NPDisconnect/GetNprLog?userId=${param0Value}&otherParam=`)
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
              this.showPopup(message, false);
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
    }

    // } finally {
    //   this.isSubmitted = false;
    // }
  }

 
}




