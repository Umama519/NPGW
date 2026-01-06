import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { environment } from 'environments/environment';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export class UserProfileSetup {
  userid: string;
  rlcd: string;
  deptid: string;
  uname: string;
  uemail: string;
  operatorname: string;
  salesid: string;
  utype: string;
  cell: string;
  ustatus: string;
  tuid: string;
  userdate: string;
  upaswd: string;
  rpass: string;
  loc: string | null;   // 👈 string | null  
  notification: string;
  changedt: string;
  constructor() {
    this.rlcd = '';
    this.deptid = '';
    this.userid = '';
    this.notification = '';
    this.uname = '';
    this.uemail = '';
    this.operatorname = '';
    this.salesid = '';
    this.utype = '';
    this.cell = '';
    this.ustatus = '';
    this.tuid = '';
    this.userdate = '';
    this.upaswd = '';
    this.rpass = '';
    this.loc = null;
    this.changedt = '';
  }
}
export interface UserPrfGet {
  userid: any,
  rlcd: any,
  deptid: any,
  uname: any,
  uemail: any,
  operator: any,
  salesid: any,
  utype: any,
  cell: any,
  ustatus: any,
  tuid: any,
  userdate: any,
  role_assign_dt: any,
  upaswd: any,
  rpass: any,
  loc: any,
  notification: any,
  changedt: any,
}
@Component({
  selector: 'app-user-profile-setup',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './user-profile-setup.component.html',
  styleUrl: './user-profile-setup.component.css'
})
export class UserProfileSetupComponent {
  UserProfileObj: UserProfileSetup = new UserProfileSetup();
  UserProfileGet: UserPrfGet[] = [];
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  popupMessage: string = '';
  popupMessageA: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  UserPrfGet: any[] = [];
  columnNames: any[] = [];
  optidDelete: string | null = null;
  selectedUserID: any = '';
  selectedUserType: any = '';
  selectedUser: any = '';
  selectedUserStatus: any = '';
  selectedDept: any = '';
  selectedMob: any = '';
  Notifications: boolean = false;
  selectedLoc: any = '';
  selectedRoleAss: any = '';
  selectedEmail: any = '';
  selectedUserOpt: any = '';
  selectedPass: string = '';
  selectedPassword: string = '';
  selectedRpass: any = '';
  selectedUserO: any = '';
  selectedCnfPass: any = '';
  selectedsalesid: any = '';
  showModal: boolean = false; // For controlling modal visibility
  userID: string | null = null;
  isErrorPopup: boolean = false;
  isErrorPopupA: boolean = false;
  isadd: string = '';
  loginUser: string = '';
  dataSource: any[] = [];
  isDisabled: boolean = true; // By default, fields are disabled
  errmessage: string = ""; // Control visibility of popup
  participantNames: any[] = []; // Stores one column (e.g., 'name')
  Action: any[] = [];           // Stores Action descriptions
  Location: any[] = [];           // Stores Action descriptions
  Role: any[] = [];           // Stores Action descriptions
  data: any[] = [];  // Table data array
  Opt: any[] = [];  // Table data array
  displayedColumns: string[] = [];  // Columns to show
  originalData: any[] = [];  // Store original data
  DeptList: string[] = [];
  RoleList: string[] = [];
  emailError: string = '';
  private emailSubject = new Subject<string>();
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  showSuccessPopupA: boolean = false;  // Controls the visibility of the popup
  isSubmitting: boolean = false;  // Track
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;
  lovDisabled: boolean = true; // Default disabled  
  lovTypeDisabled: boolean = true; // Default disabled  
  isDeptLovDisabled: boolean = true;  // default disabled
  isLocationLovDisabled: boolean = true;  // default disabled
  isRoleLovDisabled: boolean = true;  // default disabled
  isOperatorLovDisabled: boolean = true;  // default disabled
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
    this.LocLov();
    this.ActionLov();
    this.enabledisable();
    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.optid();
    this.RoleAsignLov();
    this.getData();
    this.OptLov();
    this.emailSubject.pipe(
      debounceTime(400)
    ).subscribe(email => {
      const emailPattern = /^(?!.*\.\.)(?!.*@@)(?!.*@.*@)(?!.*@.*\.\.)([A-Za-z0-9._%+-]+)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!email) {
        this.emailError = 'Email required';
      } else if (!emailPattern.test(email)) {
        this.emailError = 'Invalid email format';
      } else {
        this.emailError = '';
      }
    });
  }
  UserStatus = [
    { code: 'A', name: 'Active' },
    { code: 'B', name: 'Block' }
  ];
  UserType = [
    { code: 'A', name: 'Admin' },
    { code: 'U', name: 'User' },
    { code: 'S', name: 'Soap' }
  ];
  onEmailChange(email: string) {
    this.selectedEmail = email.trim();  // <-- add trim here
    this.emailSubject.next(email);
  }
  validateEmailInput(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9@._%+-]$/;
    const inputChar = event.key;
    if (inputChar === '@' && (this.selectedEmail.match(/@/g) || []).length >= 1) {
      event.preventDefault();
      return;
    }
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }
  ActionLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/DepartmentSetup`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.Action = data;
      },
      error: (err) => {
        // console.error("Error fetching Actions:", err);
      }
    });
  }
  LocLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Location`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.Location = data;
      },
      error: (err) => {
        // console.error("Error fetching Actions:", err);
      }
    });
  }
  RoleAsignLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Role`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.Role = data;
      },
      error: (err) => {
        //    console.error("Error fetching Actions:", err);
      }
    });
  }
  OptLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Operator`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.Opt = data;
      },
      error: (err) => {
        // console.error("Error fetching Actions:", err);
      }
    });
  }
  getData() {
    const url = `${environment.apiBaseUrl}/api/UserProfile`; // Fetch all data    
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.UserPrfGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // Initially display all data
        } else {
          // console.log('No data found');
          this.UserPrfGet = []; // Set empty array if no data is found
          this.optid();
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.UserPrfGet = []; // Handle error by setting filteredData to empty
      }
    });
  }
  lovdisabled() {
    this.lovTypeDisabled = true; // ✅ Now LOV enables      
    this.lovDisabled = true; // ✅ Now LOV enables 
    this.isDeptLovDisabled = true; // ✅ Now LOV enables      isLocationLovDisabled
    this.isLocationLovDisabled = true;
    this.isRoleLovDisabled = true;
    this.isOperatorLovDisabled = true;
    this.selectedUserType = null;
    this.selectedUserStatus = null;
    this.selectedDept = null;
    this.selectedLoc = null;
    this.selectedRoleAss = null;
    this.selectedUserO = null;
  }
  lovenabled() {
    this.lovDisabled = false; // ✅ Now LOV enables 
    this.lovTypeDisabled = false; // ✅ Now LOV enables      
    this.isDeptLovDisabled = false; // ✅ Now LOV enables      isLocationLovDisabled
    this.isLocationLovDisabled = false;
    this.isRoleLovDisabled = false;
    this.isOperatorLovDisabled = false;
  }
  optid() {
    const txt_UserId = this.el.nativeElement.querySelector('#txt_UserId');
    txt_UserId.value = '';
    if (txt_UserId) {
      this.renderer.removeAttribute(txt_UserId, 'disabled')
    }
  }
  enabledisable() {
    const inputs = [
      this.el.nativeElement.querySelector('#txt_Username'),
      this.el.nativeElement.querySelector('#txt_Mob'),
      this.el.nativeElement.querySelector('#ddl_RoleAssign'),
      this.el.nativeElement.querySelector('#txt_Email'),
      this.el.nativeElement.querySelector('#txt_Url'),
      this.el.nativeElement.querySelector('#txt_Pass'),
      this.el.nativeElement.querySelector('#txt_CnfPass'),
      this.el.nativeElement.querySelector('#chb_Notification'),
      this.el.nativeElement.querySelector('#txt_Salesid'),
    ];
    inputs.forEach((input) => {
      if (input) {
        this.renderer.removeAttribute(input, 'disabled');
      }
    });
  }
  disableenable() {
    const inputs = [
      '#txt_Username',
      '#ddl_Status',
      '#txt_Mob',
      '#txt_Email',
      '#ddl_RoleAssign',
      '#txt_Email',
      '#txt_Pass',
      '#txt_CnfPass',
      '#txt_Salesid',
      '#chb_Notification',

    ];
    inputs.forEach(selector => {
      const input = this.el.nativeElement.querySelector(selector);
      if (input) {
        this.renderer.setAttribute(input, 'disabled', 'true');

        if (input.tagName === 'INPUT') {
          if (input.type === 'checkbox') {
            input.checked = false;
          } else {
            input.value = '';
          }
        } else if (input.tagName === 'SELECT') {
          input.selectedIndex = 0; // Reset dropdown
        } else if (input.tagName === 'TEXTAREA') {
          input.value = '';
        }
      }
    });
  }
  validatePassword(event?: any) {
    const password = this.selectedPass?.trim() || '';
    const confirmPassword = this.selectedCnfPass?.trim() || '';
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
    if (password === '' && confirmPassword === '') {
      this.hidePopup();
      this.disableSubmitButton(true);
      return;
    }
    if (confirmPassword === '') {
      this.hidePopup();
      this.disableSubmitButton(true);
      return;
    }
    if (password !== '' && confirmPassword !== '' && password !== confirmPassword) {
      this.showPopup('Password and Confirm Password do not match');
      this.disableSubmitButton(true);
      return;
    }
    if (!pattern.test(password) && event?.target?.id === 'txt_CnfPass') {
      this.showPopup('Password must contain 8 Character Upper, Lower, Number, and Special Character');
      this.disableSubmitButton(true);
      return;
    }
    if (!pattern.test(confirmPassword)) {
      this.showPopup('Confirm Password must contain 8 Character Upper, Lower, Number, and Special Character');
      this.disableSubmitButton(true);
      return;
    }
    if (pattern.test(password) && pattern.test(confirmPassword) && password === confirmPassword) {
      this.hidePopup();
      this.disableSubmitButton(false);
    }
  }
  showPopup(message: string) {
    this.popupMessageA = message;
    this.isErrorPopupA = true;
    this.showSuccessPopupA = true;
    clearTimeout((this as any).popupTimer);
  }
  hidePopup() {
    this.popupMessageA = '';
    this.showSuccessPopupA = false;

    // ❗ Fade out delay for smooth UX (official-style)
    clearTimeout((this as any).popupTimer);
    (this as any).popupTimer = setTimeout(() => {
      this.showSuccessPopupA = false;
    }, 400); // thoda fade-out delay
  }
  disableSubmitButton(disable: boolean) {
    const btnSubmit = this.el.nativeElement.querySelector('#btn_Submit');
    if (btnSubmit) {
      if (disable) {
        this.renderer.setAttribute(btnSubmit, 'disabled', 'true');
        this.renderer.addClass(btnSubmit, 'disabled-btn');
      } else {
        this.renderer.removeAttribute(btnSubmit, 'disabled');
        this.renderer.removeClass(btnSubmit, 'disabled-btn');
      }
    }
  }
  edit(row: any): void {
    if (!row) return;
    if (!this.DeptList || this.DeptList.length === 0) this.ActionLov();
    if (!this.Role || this.Role.length === 0) this.RoleAsignLov();
    if (!this.Opt || this.Opt.length === 0) this.OptLov();
    if (!this.Location || this.Location.length === 0) this.LocLov();
    this.setFieldValue('#txt_UserId', row.userid || '', true);
    this.setFieldValue('#txt_Username', row.uname || '', false);
    this.setFieldValue('#txt_Mob', row.cell || '', false);
    this.setFieldValue('#txt_Email', row.uemail || '', false);
    this.selectedDept = row.deptid?.toString().trim() || '';
    this.selectedRoleAss = row.rlcd?.toString().trim() || '';
    this.selectedLoc = row.loc?.toString().trim() || '';
    this.selectedPassword = row.upaswd || '';
    this.selectedRpass = row.upaswd || '';

    this.Notifications = row.notification === 'Yes' || row.notification === true;
    const utypeMap: any = { User: 'U', Admin: 'A', Soap: 'S' };
    const ustatusMap: any = { Active: 'A', Block: 'B' };
    this.selectedUserType = utypeMap[row.utype] || '';
    this.selectedUserStatus = ustatusMap[row.ustatus] || '';
    this.enabledisable();
    this.ddl_Sta();
    this.SubmitField();
    this.lovenabled();
    this.isadd = 'U';
    this.showAddButton = false;
    this.showSubmitButton = true;
    setTimeout(() => {
      const deptDDL = this.el.nativeElement.querySelector('#ddl_Dept');
      if (deptDDL) this.renderer.setProperty(deptDDL, 'value', this.selectedDept);
      const roleDDL = this.el.nativeElement.querySelector('#ddl_RoleAssign');
      if (roleDDL) this.renderer.setProperty(roleDDL, 'value', this.selectedRoleAss);
      // const selectedOpt = this.Opt.find(opt =>
      //   opt.operatorName?.toLowerCase().trim() === row.operatorname?.toLowerCase().trim()
      // );
      // this.selectedUserO = selectedOpt ? selectedOpt.operatorId.toString() : '';      
      const locDDL = this.el.nativeElement.querySelector('#ddl_Loc');
      if (locDDL) this.renderer.setProperty(locDDL, 'value', this.selectedLoc);
      const utypeDDL = this.el.nativeElement.querySelector('#ddl_UserTyp');
      if (utypeDDL) this.renderer.setProperty(utypeDDL, 'value', this.selectedUserType);
      const statusDDL = this.el.nativeElement.querySelector('#ddl_Status');
      if (statusDDL) this.renderer.setProperty(statusDDL, 'value', this.selectedUserStatus);
      const notifChk = this.el.nativeElement.querySelector('#chb_Notification');
      if (notifChk) this.renderer.setProperty(notifChk, 'checked', this.Notifications);
      this.selectedsalesid = row.salesid?.toString();
    }, 150);
  }
  setFieldValue(selector: string, value: any, disabled: boolean): void {
    const field = this.el.nativeElement.querySelector(selector);
    if (field) {
      this.renderer.setProperty(field, 'value', '');
      this.renderer.setProperty(field, 'value', value);
      if (disabled) {
        this.renderer.setAttribute(field, 'disabled', 'true');
      } else {
        this.renderer.removeAttribute(field, 'disabled');
      }
      const event = new Event('input', { bubbles: true }); // use 'input' instead of 'change'
      field.dispatchEvent(event);
      this.buttobfun();
    }
  }
  resetFormFields(): void {
    const fields = [
      '#txt_UserId', '#ddl_UserTyp', '#txt_Username', '#txt_Mob',
      '#txt_Email', '#ddl_UserOpt', '#txt_Pass', '#txt_CnfPass', 'chb_Notification'
    ];

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
    if (btn_Search) {
      this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    }
  }
  GetGrid() {
    const url = ``; // Fetch all data    
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.originalData = res;  // Store the original data
          this.dataSource = res;    // Show the data in table
          this.displayedColumns = Object.keys(res[0]);
        } else {
          //  console.log('No data found');
          this.UserProfileGet = []; // Set empty array if no data is found
          this.optid();
        }
      },
      error: (err) => {
        // console.error('Error fetching data:', err);
        this.UserProfileGet = []; // Handle error by setting filteredData to empty
      }
    });
  }
  AddButton(): void {
    this.enabledisable();
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
    this.lovenabled()
    this.showAddButton = false;
    this.showSubmitButton = true;
  }
  ddl_Sta() {
    const ddl_UserTyp = this.el.nativeElement.querySelector('#ddl_UserTyp')
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type')
    if (ddl_UserTyp) {
      this.renderer.removeStyle(ddl_UserTyp, 'background-color');
      this.renderer.setStyle(ddl_UserTyp, 'background-color', '#fffff');
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
    const txt_UserId = this.el.nativeElement.querySelector('#txt_UserId');
    const fieldIds = [
      'txt_UserId', 'ddl_RoleAssign', 'ddl_Dept', 'txt_Username',
      'txt_Pass', 'txt_CnfPass', 'txt_Email', 'ddl_UserOpt', 'txt_Salesid',
      'ddl_UserTyp', 'txt_Mob', 'ddl_Status', 'ddl_Loc', 'chb_Notification'
    ];
    fieldIds.forEach(id => {
      const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
      if (element) {
        element.value = '';  // Clear value
        element.disabled = true; // Disable field
      }
    });
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (txt_UserId) {
      this.renderer.removeAttribute(txt_UserId, 'disabled'); // Disable the input by setting 'disabled' attribute
      txt_UserId.value = '';
    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.selectedsalesid = '';
    
    this.getData();
  }
  ResetButton() {
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.disableenable();
    this.ResetFields();
    this.AddFields();
    this.lovdisabled();
    
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.emailError = '';
    
    this.getData();
  }
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
  }
  searchButton() {
    const txt_UserId = this.el.nativeElement.querySelector('#txt_UserId').value; // Get input value
    const url = `${environment.apiBaseUrl}/api/UserProfile/${txt_UserId}`; // API URL with DepartmentID
    this.http.get<UserPrfGet[]>(url).subscribe({
      next: (res: UserPrfGet[]) => {
        if (res && res.length > 0) {
          this.UserPrfGet = res;
        } else {
          this.UserPrfGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
        // console.log('Error fetching data:', err);
        this.UserProfileGet = [];
      }
    });
  }
  UserPrfData: UserProfileSetup = new UserProfileSetup();
submitButton() {
  debugger;
  // Reset popup flags
  this.showSuccessPopup = false;
  this.isErrorPopup = false;

  // Read inputs
  const txtUser = document.getElementById('txt_Username') as HTMLInputElement;
  const txtEmail = document.getElementById('txt_Email') as HTMLInputElement;
  const txtPass = document.getElementById('txt_Pass') as HTMLInputElement;
  const txtCnfPass = document.getElementById('txt_CnfPass') as HTMLInputElement;
  const txtUserId = document.getElementById('txt_UserId') as HTMLInputElement;
  const txtMob = document.getElementById('txt_Mob') as HTMLInputElement;
  const chbNotification = document.getElementById('chb_Notification') as HTMLInputElement;

  this.selectedUser = txtUser?.value.trim() || '';
  this.selectedEmail = txtEmail?.value.trim() || '';
  const passInput = txtPass && txtPass.value ? txtPass.value.trim() : '';
  const cnfPassInput = txtCnfPass && txtCnfPass.value ? txtCnfPass.value.trim() : '';


  // ---------------------------
  // Required field validation
  // ---------------------------
  if (
    !txtUserId?.value.trim() ||
    !this.selectedUserType ||
    !this.selectedUser ||
    !this.selectedUserStatus ||
    !this.selectedDept ||
    !txtMob?.value.trim() ||
    !this.selectedLoc ||
    !this.selectedRoleAss ||
    !this.selectedEmail
  ) {
    setTimeout(() => {
      this.popupMessage = !txtUserId?.value.trim() ? 'Please Enter User ID' :
                          !this.selectedUserType ? 'Please Select User Type' :
                          !this.selectedUser ? 'Please Enter Username' :
                          !this.selectedUserStatus ? 'Please Select User Status' :
                          !this.selectedDept ? 'Please Select Department' :
                          !txtMob?.value.trim() ? 'Please Select Mobile' :
                          !this.selectedLoc ? 'Please Select Location' :
                          !this.selectedRoleAss ? 'Please Select Role Assign' :
                          'Please Select Email';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
    }, 50);
    return;
  }

  const DID = this.el.nativeElement.querySelector('#txt_UserId');

  // ---------------------------
  // Password logic
  // ---------------------------
  let finalPass = passInput;
  let finalCnfPass = cnfPassInput;

  if (this.isadd === 'U') {
    // Update: Password optional
    if (!passInput && !cnfPassInput) {
      finalPass = this.selectedPassword;
      finalCnfPass = this.selectedRpass;
    } else if (passInput) {
      // Password filled, confirm must be filled
      if (!cnfPassInput) {
        setTimeout(() => {
          this.popupMessage = 'Please Enter Confirm Password.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
        }, 50);
        txtCnfPass?.focus();
        return;
      }
      if (passInput !== cnfPassInput) {
        setTimeout(() => {
          this.popupMessage = 'Password and Confirm Password do not match.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
        }, 50);
        txtPass?.focus();
        return;
      }
    }
  } else {
    // Insert: Password required
   if (this.isadd === 'I') {
  if (!passInput && !cnfPassInput) {
    this.showPopup('Please Enter Password and Confirm Password.');
    txtPass?.focus();
    return;
  }
  if (!passInput) {
    this.showPopup('Please Enter Password.');
    txtPass?.focus();
    return;
  }
  if (!cnfPassInput) {
    this.showPopup('Please Enter Confirm Password.');
    txtCnfPass?.focus();
    return;
  }
  if (passInput !== cnfPassInput) {
    this.showPopup('Password and Confirm Password do not match.');
    txtPass?.focus();
    return;
  }
}

  }

  // ---------------------------
  // Build model
  // ---------------------------
  this.UserPrfData = {
    userid: txtUserId?.value.trim(),
    uname: this.selectedUser,
    utype: this.selectedUserType,
    ustatus: this.selectedUserStatus,
    cell: txtMob?.value.trim(),
    rlcd: this.selectedRoleAss,
    operatorname: '',
    salesid: this.selectedsalesid ?? "",
    uemail: this.selectedEmail,
    tuid: this.loginUser,
    userdate: '',
    deptid: this.selectedDept ?? null,
    changedt: '',
    upaswd: finalPass,
    rpass: finalCnfPass,
    notification: chbNotification?.checked ? 'Y' : 'N',
    loc: this.selectedLoc ?? null
  };

  // ---------------------------
  // UPDATE logic
  // ---------------------------
  if (this.isadd === 'U') {
    const updateUrl = `${environment.apiBaseUrl}/api/UserProfile/${this.UserPrfData.userid}`;
    this.http.put(updateUrl, this.UserPrfData).subscribe({
      next: (res: any) => {
        const msg = res.message || res.toString();
        const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
        this.isErrorPopup = msg.startsWith('0');
        this.popupMessage = msgR;

        this.showSuccessPopup = true;
        this.showAddButton = true;
        this.showSubmitButton = false;
        this.getData();
        this.disableenable();
        this.optid();
        this.lovdisabled();
        this.ResetFields();
        if (DID) this.renderer.removeAttribute(DID, 'disabled');
      },
      error: () => {
        this.popupMessage = 'Failed to update the record. Please try again.';
        this.isErrorPopup = true;
        this.showSuccessPopup = true;
      }
    });
    return;
  }

  if (this.isadd === 'I') {
    this.http.post(`${environment.apiBaseUrl}/api/UserProfile`, this.UserPrfData)
      .subscribe({
        next: (res: any) => {
          const msg = res.message || JSON.stringify(res);
          const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.isErrorPopup = msg.startsWith("0");
          this.popupMessage = msgR;
          this.showSuccessPopup = true;
          this.showAddButton = true;
          this.showSubmitButton = false;
          this.getData();
          this.disableenable();
          this.lovdisabled();
          this.optid();
          this.ResetFields();
          if (DID) this.renderer.removeAttribute(DID, 'disabled');
        },
        error: () => {
          this.popupMessage = 'Failed to insert the record. Please try again.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
        }
      });
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
  confirmDelete(userid: string) {
    this.userID = userid;
    this.showModal = true; // Show the confirmation   modal
  }
  closeModal() {
    this.showModal = false;
  }
  deleteRecord(userID: string) {
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;
    const body = {
      userID: this.userID,
      deptid: '',
      uname: '',
      upaswd: '',
      rpass: '',
      rlcd: '',
      uemail: '',
      utype: '',
      operatorname: '',
      salesid: '',
      cell: '',
      ustatus: '',
      tuid: this.loginUser,
      notification: '',
      loc: 0,
      userdate: '',
      changedt: '',
    };
    const headers = { 'Content-Type': 'application/json' };
    this.http.delete(`${environment.apiBaseUrl}/api/UserProfile/${this.userID}`, {
      headers: headers,
      body: body
    })
      .subscribe(
        (response: any) => {
          const resMessage = response.message;
          let msgR = resMessage.split(';').slice(1).join(','); // slice(1) to remo
          msgR = msgR.replace('}', '').trim();
          msgR = msgR.replace('"', '').trim();
          this.popupMessage = msgR;
          this.filteredData = this.filteredData.filter((row) => row.userid !== userID);
          this.GetGrid();
          this.showSuccessPopup = true;
          this.showModal = false;
          userID = '';
          this.Notifications = false;
          this.ResetFields();
          this.lovdisabled();          

        },
        (error) => {
          // alert(`Error deleting record: ${error.message}`);
          // console.error('Error Details:', error);
        }
      );
  }
}
