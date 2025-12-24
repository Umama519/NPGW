import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { environment } from 'environments/environment';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export class OperatorSetup {
  operator_id: string;
  operator_name: string;
  operator_type: string;
  owner: string;
  addr1: string;
  addr2: string;
  wS_LINK_PR: string;
  wS_LINK_DR: string;
  title: string;
  nrn: string;
  phn1: string;
  phn2: string;
  email: string;
  fax: string;
  url: string;
  status: string;
  wS_USERID: string;
  wS_PASSWORD: string;
  tuid: string;
  tdate: string;
  soap_protocol: string;
  data_format: string;

  constructor() {
    this.operator_id = '';
    this.operator_name = '';
    this.operator_type = '';
    this.owner = '';
    this.addr1 = '';
    this.addr2 = '';
    this.wS_LINK_PR = '';
    this.wS_LINK_DR = '';
    this.title = '';
    this.nrn = '';
    this.phn1 = '';
    this.phn2 = '';
    this.email = '';
    this.fax = '';
    this.url = '';
    this.status = '';
    this.wS_USERID = '';
    this.wS_PASSWORD = '';
    this.tuid = '';
    this.tdate = '';
    this.soap_protocol = '';
    this.data_format = '';
  }
}
export interface OperatorGet {

  operator_id: any,
  operator_name: any,
  operator_type: any,
  owner: any,
  addr1: any,
  addr2: any,
  wS_LINK_PR: any,
  wS_LINK_DR: any,
  title: any,
  nrn: any,
  phn1: any,
  email: any,
  fax: any,
  url: any,
  status: any,
  wS_USERID: any,
  wS_PASSWORD: any,
  tuid: any,
  tdate: any,
  soap_protocol: any,
  data_format: any
}
@Component({
  selector: 'app-public-operatorsetup-aspx',
    standalone: true,  

  imports: [FormsModule, CommonModule, GlobalLovComponent],
  templateUrl: './operator-setup.component.html',
  styleUrl: './operator-setup.component.css'
})
export class OperatorSetupComponent {
  operatorObj: OperatorSetup = new OperatorSetup();
  operatorGet: OperatorGet[] = [];
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  selectedMsgType: any = '';
  popupMessage: string = '';
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedOperatorID: any = '';
  selectedOperatorName: any = '';
  selectedType: any = '';
  optidDelete: string | null = null;
  selectedOwner: any = '';
  selectedAddress1: any = '';
  selectedAddress2: any = '';
  selectedLinkPR: any = '';
  selectedLinkDR: any = '';
  selectedTitle: any = '';
  selectedNRN: any = '';
  selectedPhone: any = '';
  selectedEmail: any = '';
  selectedFax: any = '';
  selectedURL: any = '';
  selectedStatus: any = '';
  selectedUserID: any = '';
  selectedSOAP: any = '';
  selectedDataFormat: any = '';
  selectedPassword: any = '';
  isErrorPopup: boolean = false;
  isadd: string = '';
  SOAP: any[] = [];
  DATAFORMAT: any[] = [];
  loginUser: string = '';
  isDisabled: boolean = true; // By default, fields are disabled
  errmessage: string = ""; // Control visibility of popup
  emailError: string = '';
  private emailSubject = new Subject<string>();
  lovDisabled: boolean = true; // Default disabled  
  isFormatLovDisabled: boolean = true; //
  isSOAPLovDisabled: boolean = true;  // default disabled

  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;

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
    this.SOAPProtocolLov();
    this.DataFoamatLov();
    this.enabledisable();
    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.optid();
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
  onEmailChange(email: string) {
    this.emailSubject.next(email);
  }
  msgTypes = [
    { code: 'C', name: 'Cellular' },
    { code: 'P', name: 'PSTN' },
    { code: 'L', name: 'LDI' },
    { code: 'W', name: 'WLL' }
  ];
  statusTypes = [
    { code: 'A', name: 'Active' },
    { code: 'B', name: 'Block' }

  ];
  onFormatSelected(item: any) {
    console.log("Selected Format:", item);
  }
  onSOAPSelected(item: any) {
    console.log("Selected SOAP:", item);
  }


  // ✅ Prevent invalid characters while typing
  validateEmailInput(event: KeyboardEvent) {
    const allowedChars = /^[a-zA-Z0-9@._%+-]$/;
    const inputChar = event.key;

    // disallow multiple '@'
    if (inputChar === '@' && (this.selectedEmail.match(/@/g) || []).length >= 1) {
      event.preventDefault();
      return;
    }

    // disallow invalid characters
    if (!allowedChars.test(inputChar)) {
      event.preventDefault();
    }
  }
  optid() {
    const operator_id = this.el.nativeElement.querySelector('#txt_Operatorid');
    operator_id.value = '';
    if (operator_id) {
      this.renderer.removeAttribute(operator_id, 'disabled')
    }
  }
  enabledisable() {
    const inputs = [
      this.el.nativeElement.querySelector('#txt_Operatorname'),
      this.el.nativeElement.querySelector('#txt_UserId'),
      this.el.nativeElement.querySelector('#txt_Password'),
      this.el.nativeElement.querySelector('#txt_Title'),
      // this.el.nativeElement.querySelector('#ddl_Type'),
      this.el.nativeElement.querySelector('#txt_NRN'),
      // this.el.nativeElement.querySelector('#ddl_Soap'),
      // this.el.nativeElement.querySelector('#ddl_Format'),
      this.el.nativeElement.querySelector('#chb_Owner'),
      this.el.nativeElement.querySelector('#txt_Phone1'),
      this.el.nativeElement.querySelector('#txt_Fax'),
      this.el.nativeElement.querySelector('#txt_Email'),
      // this.el.nativeElement.querySelector('#ddl_Status'),
      this.el.nativeElement.querySelector('#txt_Url'),
      this.el.nativeElement.querySelector('#txt_Address1'),
      this.el.nativeElement.querySelector('#txt_Link_PR'),
      this.el.nativeElement.querySelector('#txt_Address2'),
      this.el.nativeElement.querySelector('#txt_Link_DR')
    ];

    inputs.forEach((input) => {
      if (input) {
        this.renderer.removeAttribute(input, 'disabled');
      }
    });

  }

  disableenable() {
    const inputs = [
      '#txt_Operatorname',
      '#txt_UserId',
      '#txt_Password',
      '#txt_Title',
      '#txt_NRN',
      '#chb_Owner',
      '#txt_Phone1',
      '#txt_Fax',
      '#txt_Email',

      '#txt_Url',
      '#txt_Address1',
      '#txt_Link_PR',
      '#txt_Address2',
      '#txt_Link_DR'
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


  edit(row: any): void {
    debugger;
    this.resetFormFields();

    // Normal input fields set karna
    this.setFieldValue('#txt_Operatorid', row.operator_id, true);
    this.setFieldValue('#txt_Operatorname', row.operator_name, false);
    this.setFieldValue('#txt_Title', row.title, false);
    this.setFieldValue('#txt_UserId', row.wS_USERID, false);
    this.setFieldValue('#txt_Password', row.wS_PASSWORD, false);
    this.setFieldValue('#ddl_Soap', row.soap_protocol, false);
    this.setFieldValue('#ddl_Format', row.data_format, false);
    this.setFieldValue('#txt_NRN', row.nrn, false);
    this.setFieldValue('#chb_Owner', row.owner === 'Yes', false);
    this.setFieldValue('#txt_Phone1', row.phn1, false);
    this.setFieldValue('#txt_Fax', row.fax, false);
    this.setFieldValue('#txt_Email', row.email, false);
    this.setFieldValue('#txt_Url', row.url, false);
    this.setFieldValue('#txt_Address1', row.addr1, false);
    this.setFieldValue('#txt_Link_PR', row.wS_LINK_PR, false);
    this.setFieldValue('#txt_Address2', row.addr2, false);
    this.setFieldValue('#txt_Link_DR', row.wS_LINK_DR, false);

    // ✅ Operator Type Mapping
    const type = row.operator_type?.trim().toLowerCase();
    let newType = '';
    switch (type) {
      case 'cellular': newType = 'C'; break;
      case 'pstn': newType = 'P'; break;
      case 'ldi': newType = 'L'; break;
      case 'wll': newType = 'W'; break;
      default: newType = ''; break;
    }

    // Force re-render even if value same
    this.selectedMsgType = '';
    setTimeout(() => this.selectedMsgType = newType, 0);

    const status = row.status?.trim().toLowerCase();
    let newStatus = '';
    switch (status) {
      case 'active': newStatus = 'A'; break;
      case 'block': newStatus = 'B'; break;
      default: newStatus = ''; break;
    }

    this.selectedStatus = '';
    setTimeout(() => this.selectedStatus = newStatus, 0);

    // Baaki values
    this.selectedOperatorID = row.operator_id;
    this.selectedOperatorName = row.operator_name;
    this.selectedTitle = row.title;
    this.selectedNRN = row.nrn;
    this.selectedUserID = row.wS_USERID;
    this.selectedPassword = row.wS_PASSWORD;
    this.selectedPhone = row.phn1;
    this.selectedFax = row.fax;
    this.selectedEmail = row.email;
    this.selectedURL = row.url;
    setTimeout(() => {
      this.selectedDataFormat = row.data_format;
    }, 10);

    this.selectedSOAP = row.soap_protocol;

    this.selectedAddress1 = row.addr1;
    this.selectedLinkPR = row.wS_LINK_PR;
    this.selectedAddress2 = row.addr2;
    this.selectedLinkDR = row.wS_LINK_DR;

    // ✅ Owner checkbox handle
    const isOwner = row.owner?.trim().toLowerCase() === 'yes';

    this.selectedOwner = false;  // temporarily reset
    setTimeout(() => this.selectedOwner = isOwner, 0);


    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');
    if (btn_Submit) {
      this.renderer.removeAttribute(btn_Submit, 'disabled');
    }

    this.enabledisable();
    this.ddl_Sta();
    this.lovenabled();
    this.showAddButton = false;
    this.showSubmitButton = true;
    this.isadd = 'U';
  }
  SOAPProtocolLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/SOAPProtocol`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.SOAP = data;
      },
      error: (err) => {
        console.error("Error fetching SOAP Protocols:", err);
      }
    });
  }

  DataFoamatLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/MessageFormat`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.DATAFORMAT = data;

        // ✅ agar edit mode me pehle value set hai to dobara assign karo
        if (this.selectedDataFormat) {
          setTimeout(() => {
            this.selectedDataFormat = this.selectedDataFormat;
          }, 0);
        }
      },
      error: (err) => {
        console.error("Error fetching Data Format:", err);
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
      '#txt_Operatorid', '#txt_Operatorname', '#txt_Title', '#txt_UserId', '#txt_Password', '#txt_NRN', '#chb_Owner', '#txt_Phone1',
      '#txt_Fax', '#txt_Email', '#txt_Url', '#txt_Address1', '#txt_Link_PR', '#txt_Address2', '#txt_Link_DR'
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
    //const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    // if (btn_Submit) {
    //   this.renderer.removeClass(btn_Submit, 'newbtndisable'); // Remove the old class
    //   this.renderer.addClass(btn_Submit, 'newbtn');
    // }
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
    if (btn_Search) {
      this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    }
  }
  GetGrid() {
    const url = `${environment.apiBaseUrl}/api/OperatorSetup`; // Fetch all data    
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          this.operatorGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res;
        } else {
          console.log('No data found');
          this.operatorGet = [];
          this.optid();
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.operatorGet = [];
      }
    });
  }
  AddddlStyle() {
    const ddl_Status = this.el.nativeElement.querySelector('#ddl_Status')
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Type')
    if (ddl_Status) {
      this.renderer.removeStyle(ddl_Status, 'background-color');
      this.renderer.setStyle(ddl_Status, 'background-color', '#ffffffff');
    }
    if (ddl_Type) {
      this.renderer.removeStyle(ddl_Type, 'background-color');
      this.renderer.setStyle(ddl_Type, 'background-color', '#ffffffff');
    }
  }
  lovenabled() {
    this.lovDisabled = false; // ✅ Now LOV enables
    this.isFormatLovDisabled = false;
    this.isSOAPLovDisabled = false;
    this.selectedDataFormat = false;
  }
  lovdisabled() {
    this.lovDisabled = true; // ✅ Now LOV enables
    this.isFormatLovDisabled = true;
    this.isSOAPLovDisabled = true;
    this.selectedDataFormat = true;
    this.selectedSOAP = null; // Soap LOV bhi reset karni ho to
    this.selectedStatus = null; // Soap LOV bhi reset karni ho to
    this.selectedType = null; // Soap LOV bhi reset karni ho to
    this.selectedMsgType = null; // Soap LOV bhi reset karni ho to    
  }
  AddButton(): void {
    debugger
    this.enabledisable();
    const btn_add = this.el.nativeElement.querySelector('#btn_add');


    if (btn_add) {
      this.renderer.setAttribute(btn_add, 'disabled', 'true'); // Enable input field
    }
    this.SubmitField();
    this.buttobfun();
    this.isadd = 'I';
    this.AddddlStyle();
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.setAttribute(btn_Search, 'disabled', 'true')
    }
    this.lovenabled()
    this.showAddButton = false;
    this.showSubmitButton = true;
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
    const txt_Operatorid = this.el.nativeElement.querySelector('#txt_Operatorid');
    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    // const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    // if (btn_Search) {
    //   this.renderer.removeClass(btn_Search, 'newbtndisable');
    //   this.renderer.addClass(btn_Search, 'newbtn');
    // }

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (txt_Operatorid) {
      this.renderer.removeAttribute(txt_Operatorid, 'disabled'); // Disable the input by setting 'disabled' attribute
      txt_Operatorid.value = '';

    }
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.GetGrid();
  }
  ResetButton() {

    this.disableenable();
    this.ResetFields();
    this.AddFields();
    this.lovdisabled();
    this.showAddButton = true;
    this.showSubmitButton = false;
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }

  }
  Timeout() {
    setTimeout(() => {
      this.errmessage = '';  // Clear the error message
    }, 2000)
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

  searchButton() {
    debugger;
    const inputD = this.el.nativeElement.querySelector('#txt_Operatorid').value; // Get input value
    const url = `${environment.apiBaseUrl}/api/OperatorSetup/${inputD}`; // API URL with DepartmentID

    this.http.get<OperatorGet[]>(url).subscribe({
      next: (res: OperatorGet[]) => {
        if (res && res.length > 0) {
          this.operatorGet = res;
          //this.filteredData = res; // Set filtered data from the API response
        } else {
          this.operatorGet = []; // Set empty array if no data found
        }
      },
      error: (err) => {
        console.log('Error fetching data:', err);
        //this.filteredData = []; // Handle error by setting filteredData to empty
        this.operatorGet = [];
      }
    });
  }
  operatorData: OperatorSetup = new OperatorSetup();

  submitButton() {
    debugger;

    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    // Get input values
    this.operatorData.operator_id = (document.getElementById('txt_Operatorid') as HTMLInputElement).value;
    this.operatorData.operator_name = (document.getElementById('txt_Operatorname') as HTMLInputElement).value;
    this.operatorData.operator_type = this.selectedMsgType;
    const checkbox = document.getElementById('chb_Owner') as HTMLInputElement;
    this.operatorData.owner = checkbox.checked ? 'Y' : 'N';
    this.operatorData.addr1 = (document.getElementById('txt_Address1') as HTMLInputElement).value;
    this.operatorData.addr2 = (document.getElementById('txt_Address2') as HTMLInputElement).value;
    this.operatorData.wS_LINK_PR = (document.getElementById('txt_Link_PR') as HTMLInputElement).value;
    this.operatorData.wS_LINK_DR = (document.getElementById('txt_Link_DR') as HTMLInputElement).value;
    this.operatorData.title = (document.getElementById('txt_Title') as HTMLInputElement).value;
    this.operatorData.nrn = (document.getElementById('txt_NRN') as HTMLInputElement).value;
    this.operatorData.phn1 = (document.getElementById('txt_Phone1') as HTMLInputElement).value;
    this.operatorData.phn2 = (document.getElementById('txt_Phone1') as HTMLInputElement).value;
    this.operatorData.email = (document.getElementById('txt_Email') as HTMLInputElement).value;
    this.operatorData.fax = (document.getElementById('txt_Fax') as HTMLInputElement).value;
    this.operatorData.url = (document.getElementById('txt_Url') as HTMLInputElement).value;
    this.operatorData.status = this.selectedStatus;
    this.operatorData.wS_USERID = (document.getElementById('txt_UserId') as HTMLInputElement).value;
    this.operatorData.wS_PASSWORD = (document.getElementById('txt_Password') as HTMLInputElement).value;
    this.operatorData.tuid = this.loginUser;
    this.operatorData.tdate = '';
    this.operatorData.soap_protocol = this.selectedSOAP;
    this.operatorData.data_format = this.selectedDataFormat;

    // Validation for empty Department ID
    if (!this.operatorData.operator_id ||
      !this.operatorData.operator_name ||
      !this.operatorData.title ||
      !this.operatorData.operator_type ||
      !this.operatorData.nrn ||
      !this.operatorData.wS_USERID ||
      !this.operatorData.wS_PASSWORD ||
      !this.operatorData.phn1 ||
      !this.operatorData.email ||
      !this.operatorData.status ||
      !this.operatorData.url ||
      !this.operatorData.addr1 ||
      !this.operatorData.wS_LINK_PR ||
      !this.operatorData.addr2 ||
      !this.operatorData.wS_LINK_DR) {
      this.showSuccessPopup = false;
      setTimeout(() => {
        this.popupMessage =
          !this.operatorData.operator_id ? 'Please Enter Operator ID' :
            !this.operatorData.operator_name ? 'Please Enter Operator Name' :
              !this.operatorData.title ? 'Please Enter Title' :
                !this.operatorData.operator_type ? 'Please Enter Operator Type' :
                  !this.operatorData.nrn ? 'Please Enter Nrn' :
                    !this.operatorData.wS_USERID ? 'Please Enter WS UserID' :
                      !this.operatorData.wS_PASSWORD ? 'Please Enter WS Password' :
                        !this.operatorData.phn1 ? 'Please Enter Phone No' :
                          !this.operatorData.email ? 'Please Enter E-mail' :
                            !this.operatorData.status ? 'Please Enter Status' :
                              !this.operatorData.url ? 'Please Enter URL' :
                                !this.operatorData.addr1 ? 'Please Enter Address 1' :
                                !this.operatorData.wS_LINK_PR ? 'Please Enter Web Service PR Site' :
                                !this.operatorData.addr2 ? 'Please Enter Address 2' :                                
                                  'Please Enter Web Service DR Site'; // Error message

        this.isErrorPopup = true; // Error popup
        this.showSuccessPopup = true; // Show popup
        return;
      }, 100);
      return;
    }
    this.showAddButton = true;
    this.showSubmitButton = false;
    this.AddFields();
    const DID = this.el.nativeElement.querySelector('#txt_OperatorID');
    // const srButton = this.el.nativeElement.querySelector('#btn_Search');
    const sbButton = this.el.nativeElement.querySelector('#btn_Submit');
    debugger;
    if (this.isadd === 'U') {
      debugger;
      // Update Record
      const updateUrl = `${environment.apiBaseUrl}/api/OperatorSetup/${this.operatorData.operator_id}`;
      this.http.put(updateUrl, this.operatorData).subscribe({
        next: (response) => {
          const ab = JSON.stringify(response);
          const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
          this.popupMessage = msgR;
          this.showSuccessPopup = true;

          this.GetGrid();
          this.disableenable();
          this.optid();
          this.ResetFields();
          this.lovdisabled();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          if (sbButton) {
            this.renderer.removeAttribute(sbButton, 'disabled');
          }
          // this.departmentData.deptid = '';
          // this.departmentData.dname = '';
          //this.updateButtonStyles(srButton, sbButton);
          this.resetdrp();
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
      this.http.post(`${environment.apiBaseUrl}/api/OperatorSetup`, this.operatorData).subscribe({
        next: (response: any) => {
          const msg = response.message || JSON.stringify(response);

          // 👉 Check karo 1 se start ya 0 se
          if (msg.startsWith("0")) {
            // Error case
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = true;
            this.popupMessage = msgR;
          } else if (msg.startsWith("1")) {
            // Success case
            const msgR = msg.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
            this.isErrorPopup = false;
            this.popupMessage = msgR;

          } else {
            // Unknown response
            this.isErrorPopup = true;
            this.popupMessage = "Unexpected response format!";
          }
          this.showSuccessPopup = true; // Show popup

          // Refresh grid and clear input fields
          this.GetGrid();
          this.disableenable();
          this.ResetFields();
          this.optid();
          this.lovdisabled();
          if (DID) {
            this.renderer.removeAttribute(DID, 'disabled');
          }
          // this.operatorD.a_operator_id = '';
          // this.operatorD.b_operator_name = '';
          // this.updateButtonStyles(srButton, sbButton);
          this.resetdrp();

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

  // updateButtonStyles(srButton: any, sbButton: any) {
  //   if (srButton) {
  //     this.renderer.removeAttribute(srButton, 'newbtndisable');
  //     this.renderer.addClass(srButton, 'newbtn');
  //   }
  //   if (sbButton) {
  //     this.renderer.removeClass(sbButton, 'newbtn');
  //     this.renderer.addClass(sbButton, 'newbtndisable');
  //   }
  // }
}
