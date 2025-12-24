import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export class RoleMaster {
  rlcd: string;
  rlnm: string;
  rlds: string;
  userID: string;
  userDate: string;

  constructor() {
    this.rlcd = '';
    this.rlnm = '';
    this.rlds = '';
    this.userID = '';
    this.userDate = '';
  }
}

export class RoleDetail {
  rlcd: string;
  menuCode: string;
  menuName: string;
  updateAllow: string;
  deleteAllow: string;
  queryAllow: string;
  addAllow: string;
  optionAllow: string;
  userID: string;
  userDate: string;
  granted_by: string;
  granted_date: string;

  constructor() {
    this.rlcd = '';
    this.menuCode = '';
    this.menuName = '';
    this.updateAllow = '';
    this.deleteAllow = '';
    this.queryAllow = '';
    this.addAllow = '';
    this.optionAllow = '';
    this.userID = '';
    this.userDate = '';
    this.granted_by = '';
    this.granted_date = '';
  }
}

export interface RoleGet {
  title: any,
  menucd: any,
  menuname: any,
  grouptype: any,
  url_link: any,
  updateallowed: any,
  deleteallowed: any,
  queryallowed: any,
  addallowed: any,
  optionallowed: any
}

@Component({
  selector: 'app-public-rolesetup-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './user-role-access-setup.component.html',
  styleUrl: './user-role-access-setup.component.css'
})

export class UserRoleAccessSetupComponent {
  //operatorObj: RoleSetup = new RoleSetup();
  operatorGet: RoleGet[] = [];

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }

  popupMessage: string = '';
  ddl_RoleCode: any[] = [];
  ddl_RoleCodeid: any[] = [];
  filteredData: any[] = [];
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedRoleCode: any = '';
  selectedRoleName: any = '';
  selectedRoleDesc: any = '';
  isErrorPopup: boolean = false;
  isadd: string = '';
  loginUser: string = '';
  isDisabled: boolean = true;
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;
  RolelovDisabled: boolean = false;

  ngOnInit(): void {
    const btn_Submit = this.el.nativeElement.querySelector('#btn_add');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtndisable')
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true')
    }
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled')
    }
    this.enabledisable();
    this.GetRoleCode();
    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.optid();
  }
  GetRoleCode() {
    debugger;
    const url = `${environment.apiBaseUrl}/api/RoleMaster`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.ddl_RoleCode = res;
          this.selectedRoleCode = this.ddl_RoleCode.length > 0 ? this.ddl_RoleCode[0].rlcd : '';
          this.onRoleCodeChange(this.selectedRoleCode);
          // this.selectedRoleName = this.ddl_RoleCode.length > 0 ? this.ddl_RoleCode[0].rlnm : '';
          // this.selectedRoleDesc = this.ddl_RoleCode.length > 0 ? this.ddl_RoleCode[0].rlds : '';
        } else {
          console.log('No data found');
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
  GetRoleCodeid(role: string) {
    debugger;
    const url = `${environment.apiBaseUrl}/api/RoleMaster/${role}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.ddl_RoleCodeid = res;
          this.selectedRoleCode = this.ddl_RoleCodeid.length > 0 ? this.ddl_RoleCodeid[0].rlcd : '';
          this.selectedRoleName = this.ddl_RoleCodeid.length > 0 ? this.ddl_RoleCodeid[0].rlnm : '';
          this.selectedRoleDesc = this.ddl_RoleCodeid.length > 0 ? this.ddl_RoleCodeid[0].rlds : '';
        } else {
          console.log('No data found');
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
  onRoleCodeChange(value: any) {
    this.GetRoleCodeid(value);
  }
  errorCheckChanged(event: Event, rowIndex: number): void {
    debugger;
    const checkbox = event.target as HTMLInputElement;
    const currentRow = this.operatorGet[rowIndex];

    // If the Option_Allowed checkbox is checked, automatically check the others
    if (checkbox.checked) {
      // Check all other checkboxes in the same row
      currentRow.updateallowed = true;
      currentRow.deleteallowed = true;
      currentRow.queryallowed = true;
      currentRow.addallowed = true;
    } else {
      // Uncheck all other checkboxes in the same row if Option_Allowed is unchecked
      currentRow.updateallowed = false;
      currentRow.deleteallowed = false;
      currentRow.queryallowed = false;
      currentRow.addallowed = false;
    }
  }
  optid() {
    const Role_Code = this.el.nativeElement.querySelector('#txt_RoleCode');
    Role_Code.value = '';
    if (Role_Code) {
      this.renderer.removeAttribute(Role_Code, 'disabled')
    }
  }
  enabledisable() {
    const inputs = [
      this.el.nativeElement.querySelector('#txt_RoleCode'),
      this.el.nativeElement.querySelector('#txt_RoleName'),
      this.el.nativeElement.querySelector('#txt_RoleDesc'),
      this.el.nativeElement.querySelector('#opt_allowed'),
      this.el.nativeElement.querySelector('#upt_allowed'),
      this.el.nativeElement.querySelector('#dlt_allowed'),
      this.el.nativeElement.querySelector('#qry_allowed'),
      this.el.nativeElement.querySelector('#add_allowed')
    ];

    inputs.forEach((input) => {
      if (input) {
        this.renderer.removeAttribute(input, 'disabled');
        input.value = '';
        this.selectedRoleCode = '';
      }
    });
  }
  disableenable() {
    const inputs = [
      this.el.nativeElement.querySelector('#ddl_RoleCode'),
      this.el.nativeElement.querySelector('#txt_RoleName'),
      this.el.nativeElement.querySelector('#txt_RoleDesc'),
      this.el.nativeElement.querySelector('#opt_allowed'),
      this.el.nativeElement.querySelector('#upt_allowed'),
      this.el.nativeElement.querySelector('#dlt_allowed'),
      this.el.nativeElement.querySelector('#qry_allowed'),
      this.el.nativeElement.querySelector('#add_allowed')
    ];

    inputs.forEach((input) => {
      if (input) {
        this.renderer.setAttribute(input, 'disabled', 'true');

        if (input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = '';
        }
      } else {
        this.renderer.removeAttribute(input, 'disabled');
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
  resetFormFields(): void {
    const fields = [
      '#txt_RoleCode', '#opt_allowed', '#upd_allowed',
      '#dlt_allowed', '#qry_allowed', '#add_allowed'
    ];
// '#ddl_RoleCode', '#txt_RoleName', '#txt_RoleDesc',
    fields.forEach(selector => {
      const field = this.el.nativeElement.querySelector(selector);
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = false;
        } else {
          field.value = '';
        }
        this.renderer.removeAttribute(field, 'disabled');
      }
    });
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
  GetGrid() {
    // debugger;
    const url = `${environment.apiBaseUrl}/api/GetRole`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.operatorGet = res;
          this.GridData = res;
          this.filteredData = res;
        } else {
       //   console.log('No data found');
          this.operatorGet = [];
          this.optid();
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.operatorGet = []; // Handle error by setting filteredData to empty
      }
    });
  }
  isRestricted(row: any): boolean {
    // return row.grouptype === 'BS' || row.grouptype === '';
    return row.grouptype === 'G1' && !row.url_link;
  }
  viewState: { [key: string]: any } = {};
  isAddButtonClicked = false;
  isAddButtNotClicked = true;
  AddButton(): void {
    debugger;
    this.isAddButtonClicked = true;
    this.isAddButtNotClicked = false;

    this.viewState["Master"] = "Y";
    this.enabledisable();

    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true');
    }

    this.SubmitField();
    this.buttobfun();
    this.showAddButton = false;
    this.showSubmitButton = true;
    this.isadd = 'I';

    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.setAttribute(btn_Search, 'disabled', 'true');
    // }
  }
  ddl_Sta() {
    const ddl_Status = this.el.nativeElement.querySelector('#ddl_Status')
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type')
    if (ddl_Status) {
      this.renderer.removeStyle(ddl_Status, 'background-color');
      this.renderer.setStyle(ddl_Status, 'background-color', '#fffff');
    }
    if (ddl_Type) {
      this.renderer.removeStyle(ddl_Type, 'background-color');
      this.renderer.setStyle(ddl_Type, 'background-color', '#ffffff');
    }
  }
  AddFields() {
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled'); // Enable input field
    }
  }
  ResetFields() {
    const ddl_RoleCode = this.el.nativeElement.querySelector('#ddl_RoleCode');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const txt_RoleCode = this.el.nativeElement.querySelector('#txt_RoleCode');
    const txt_RoleName = this.el.nativeElement.querySelector('#txt_RoleName');
    const txt_RoleDesc = this.el.nativeElement.querySelector('#txt_RoleDesc');
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (btn_Search) {
      // this.renderer.removeClass(btn_Search, 'newbtndisable');
      // this.renderer.addClass(btn_Search, 'newbtn');
      this.operatorGet.forEach(row => {
        row.updateallowed = false;
        row.deleteallowed = false;
        row.queryallowed = false;
        row.addallowed = false;
        row.optionallowed = false;
      });
    }
    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (ddl_RoleCode) {
      this.renderer.removeAttribute(ddl_RoleCode, 'disabled');
      // ddl_RoleCode.value = '';
      // this.selectedRoleCode = this.ddl_RoleCode.length > 0 ? this.ddl_RoleCode[0].rlcd : '';
    }
    if (txt_RoleCode) {
      this.renderer.removeAttribute(txt_RoleCode, 'disabled');
      txt_RoleCode.value = '';
    }
    if (txt_RoleName) {
      this.renderer.setAttribute(txt_RoleName, 'disabled', 'true');
      // txt_RoleName.value = '';      
      // txt_RoleCode.value = this.ddl_RoleCode.length > 0 ? this.ddl_RoleCode[0].rlnm : '';
    }
    if (txt_RoleDesc) {
      this.renderer.setAttribute(txt_RoleDesc, 'disabled', 'true');
      // txt_RoleDesc.value = '';
      // txt_RoleCode.value = this.ddl_RoleCode.length > 0 ? this.ddl_RoleCode[0].rlds : '';
    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.GetGrid();
    this.GetRoleCode();
  }
  ResetButton() {
    debugger;
    this.isAddButtonClicked = false;
    this.isAddButtNotClicked = true;
    // this.disableenable();
    this.ResetFields();
    this.AddFields();
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      // this.renderer.removeAttribute(btn_Search, 'disabled')
      this.operatorGet.forEach(row => {
        row.updateallowed = false;
        row.deleteallowed = false;
        row.queryallowed = false;
        row.addallowed = false;
        row.optionallowed = false;
      });
    }
    this.showAddButton = true;
    this.showSubmitButton = false;
    // this.selectedRoleCode = this.ddl_RoleCode.length > 0 ? this.ddl_RoleCode[0].rlcd : '';
    // this.selectedRoleName = this.ddl_RoleCode.length > 0 ? this.ddl_RoleCode[0].rlnm : '';
  }
  resetdrp() {
    const ddl_Status = this.el.nativeElement.querySelector('#ddl_Status')
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type')
    if (ddl_Status) {
      this.renderer.removeStyle(ddl_Status, 'background-color');
      this.renderer.setStyle(ddl_Status, 'background-color', '#efeeee');
    }
    if (ddl_Type) {
      this.renderer.removeStyle(ddl_Type, 'background-color');
      this.renderer.setStyle(ddl_Type, 'background-color', '#efeeee');
    }
  }
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  closePopup() {
    this.showSuccessPopup = false;
  }
  ViewState: { [key: string]: any } = {};
  searchButton() {
    debugger;
    this.ViewState["Edit"] = "Y";
    this.operatorGet.forEach(row => {
      row.updateallowed = false;
      row.deleteallowed = false;
      row.queryallowed = false;
      row.addallowed = false;
      row.optionallowed = false;
    });
    const inputD = this.selectedRoleCode;
    const url = `${environment.apiBaseUrl}/api/GetRole/${inputD}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            const apiRow = res[i];
            const menucode = apiRow.menucd?.trim();

            for (let j = 0; j < this.operatorGet.length; j++) {
           if (this.operatorGet[j].menucd?.trim() === menucode) {
                this.operatorGet[j].updateallowed = apiRow.updatE_ALLOWED === 'Y';
                this.operatorGet[j].deleteallowed = apiRow.deletE_ALLOWED === 'Y';
                this.operatorGet[j].queryallowed = apiRow.querY_ALLOWED === 'Y';
                this.operatorGet[j].addallowed = apiRow.adD_ALLOWED === 'Y';
                this.operatorGet[j].optionallowed = apiRow.optioN_ALLOWED === 'Y';
                break;
              }
            }
            // this.SubmitField();
            // this.buttobfun();
            this.isadd = 'U';
            this.showAddButton = false;
            this.showSubmitButton = true;
          }
        } else {
          this.showSuccessPopup = false;
          setTimeout(() => {
            this.popupMessage = 'No data found.';
            this.isErrorPopup = true;
            this.showSuccessPopup = true;
            return;
          }, 100);
          this.showAddButton = true;
          this.showSubmitButton = false;
          this.operatorGet.forEach(row => {
            row.updateallowed = false;
            row.deleteallowed = false;
            row.queryallowed = false;
            row.addallowed = false;
            row.optionallowed = false;
          });
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  RoleMaster: RoleMaster = new RoleMaster();
  RoleDetail: RoleDetail = new RoleDetail();
  submitButton() {
    debugger;
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    // if (btn_Search) {
    //   this.renderer.removeAttribute(btn_Search, 'disabled')
    // }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    if (this.isadd === 'I') {
      this.RoleMaster.rlcd = (document.getElementById('txt_RoleCode') as HTMLInputElement).value;
    }
    else if (this.isadd === 'U') {
      this.RoleMaster.rlcd = this.selectedRoleCode;
    }

    this.RoleMaster.rlnm = (document.getElementById('txt_RoleName') as HTMLInputElement).value;
    this.RoleMaster.rlds = (document.getElementById('txt_RoleDesc') as HTMLInputElement).value;

    this.RoleMaster.userID = this.loginUser;
    this.RoleMaster.userDate = '';//new Date().toISOString();
    // const rlcd = (document.getElementById('ddl_RoleCode') as HTMLInputElement).value;
    const roleDetails = this.operatorGet
      .map(row => ({
        rlcd: this.RoleMaster.rlcd,
        menuCode: row.menucd,
        menuname: "",
        title: row.title,
        grouptype: row.grouptype,
        url_link: row.url_link,
        optionAllow: row.optionallowed === true || row.optionallowed === 'Y',
        updateAllow: row.updateallowed === true || row.updateallowed === 'Y',
        deleteAllow: row.deleteallowed === true || row.deleteallowed === 'Y',
        queryAllow: row.queryallowed === true || row.queryallowed === 'Y',
        addAllow: row.addallowed === true || row.addallowed === 'Y',
        UserID: this.loginUser,
        UserDate: new Date().toISOString(),
        granted_by: this.loginUser,
        granted_date: new Date().toISOString(),
      }))
      .filter(row => row.optionAllow || row.updateAllow || row.deleteAllow || row.queryAllow || row.addAllow);
    const DID = this.el.nativeElement.querySelector('#txt_RoleName');
    if (roleDetails.length === 0) {
  this.showSuccessPopup = false;
  setTimeout(() => {
    this.popupMessage = 'Please Select Role Detail';
    this.isErrorPopup = true;
    this.showSuccessPopup = true;
  }, 100);
  return;
}
    if (this.isadd === 'U') {
      debugger;
      this.deleteRecord();
      const detailUrl = `${environment.apiBaseUrl}/api/RoleDetail`;
      this.http.post(detailUrl, roleDetails).subscribe({
        next: (response: any) => {
          const msg = response.message || JSON.stringify(response);
          if (msg.startsWith("0")) {
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = true;
            this.popupMessage = msgR;
            this.showSuccessPopup = true;
            return;
          }
          else if (msg.startsWith("1")) {
            debugger;
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = false;
            this.popupMessage = msgR;
            this.showSuccessPopup = true;
          }
          this.GetGrid();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          this.RoleMaster.rlnm = '';
          this.RoleMaster.rlds = '';
          this.ResetFields();
          this.showAddButton = true;
          this.showSubmitButton = false;
        },
        error: (err) => {
          console.error("Error inserting details:", err);
          this.popupMessage = 'Details insert failed!';
          this.isErrorPopup = false;
          this.showSuccessPopup = true;
        }
      });
    } else if (this.isadd === 'I') {
      debugger;
      const insertUrl = `${environment.apiBaseUrl}/api/RoleMaster`;
      this.http.post(insertUrl, this.RoleMaster).subscribe({
        next: (response: any) => {
          debugger;

          const msg = response.message || JSON.stringify(response);
          if (msg.startsWith("0")) {
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = true;
            this.popupMessage = msgR;
            this.showSuccessPopup = true;
            return;
          }
          else if (msg.startsWith("1")) {
            debugger;
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = false;
            this.popupMessage = msgR;
            this.showSuccessPopup = true;

            const detailUrl = `${environment.apiBaseUrl}/api/RoleDetail`;
            this.http.post(detailUrl, roleDetails).subscribe({
              next: (response: any) => {
                const msg = response.message || JSON.stringify(response);
                if (msg.startsWith("0")) {
                  const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
                  this.isErrorPopup = true;
                  this.popupMessage = msgR;
                  this.showSuccessPopup = true;
                  return;
                }
                else if (msg.startsWith("1")) {
                  debugger;
                  const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
                  this.isErrorPopup = false;
                  this.popupMessage = msgR;
                  this.showSuccessPopup = true;
                }
                this.GetGrid();
                if (DID) {
                  this.renderer.removeAttribute(DID, 'disabled');
                }
                this.ResetFields();
                this.enabledisable();
                this.isAddButtonClicked = false;
                this.isAddButtNotClicked = true;
                this.showAddButton = true;
                this.showSubmitButton = false;
              },
              error: (err) => {
                console.error("Error inserting details:", err);
                this.popupMessage = 'Details insert failed!';
                this.isErrorPopup = false;
                this.showSuccessPopup = true;
              }
            });
          } else {
            this.isErrorPopup = false;
            this.popupMessage = "Unexpected response format!";
            this.showSuccessPopup = true;
          }
        },
        error: (err) => {
          console.error('Error during insert:', err);
          this.popupMessage = 'Failed to insert the record. Please try again.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
          this.isSubmitting = false;
        }
      });
    } else {
      console.error('Invalid operation type in isadd');
      this.popupMessage = 'Invalid operation type.';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      this.isSubmitting = false;
    }
  }

  deleteRecord() {
    // debugger;
    const body = {
      rlcd: '',
      menuCode: '',
      menuName: '',
      updateAllow: false,
      deleteAllow: false,
      queryAllow: false,
      addAllow: false,
      optionAllow: false,
      userID: this.loginUser,
      userDate: '',
      granted_by: '',
      granted_date: ''
    };
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: body
    };

    // const headers = { 'Content-Type': 'application/json' }; 
    const Rlcd = this.selectedRoleCode;
    const url = `${environment.apiBaseUrl}/api/RoleDetail/${Rlcd}`
    this.http.delete(url, options).subscribe(
      (response: any) => {
        const resMessage = response.message;
        let msgR = resMessage.split(';').slice(1).join(',');
        msgR = msgR.replace('}', '').trim();
        this.popupMessage = msgR;
        this.showAddButton = true;
        this.showSubmitButton = false;     
      },
      (error) => {
        // Handle errors
        alert(`Error deleting record: ${error.message}`);
        console.error('Error Details:', error);
      }
    );
  }
}
