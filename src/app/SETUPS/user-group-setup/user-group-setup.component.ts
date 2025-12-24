import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

export class userSetup {
  //Master
  userGroupID: string;
  name: string;
  status: string;
  //Detail
  userID: string;
  region: string;
  //Others
  tuid: string;
  tdate: string;

  constructor() {
    this.userGroupID = '';
    this.name = '';
    this.status = '';
    this.userID = '';
    this.region = '';
    this.tuid = '';
    this.tdate = '';
  }
}

export interface userGet {
  userGroupID: any,
  name: any,
  status: any,
  tuid: any,
  tdate: any
}

export interface userDetail {
  userID: any,
  name: any,
  region: any,
  tuid: any
}

@Component({
  selector: 'app-public-usergroupsetup-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './user-group-setup.component.html',
  styleUrl: './user-group-setup.component.css'
})
export class UserGroupSetupComponent {
  operatorObj: userSetup = new userSetup();
  operatorGet: userGet[] = [];
  userDet: userDetail[] = [];
  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }

  popupMessage: string = '';
  ddl_RoleCode: any[] = [];
  filteredData: any[] = [];
  GridData: any[] = [];
  columnNames: any[] = [];
  selectedGroupName: any = '';
  selectedGroupDescription: any = '';
  selectedActive: any = '';
  selectedUserID: any = '';
  selectedUserName: any = '';
  selectedRegion: any = '';
  isErrorPopup: boolean = false;
  isadd: string = '';
  loginUser: string = '';
  isDisabled: boolean = true;
  showModal: boolean = false;
  isaddbutton = false;
  isgridview = false;
  lovDisabled: boolean = true;
  showAddButton: boolean = true;
  showResetButton: boolean = true;
  showSubmitButton: boolean = false;

  ngOnInit(): void {
    this.UserID_Lov()
    this.Region_Lov()
    const btn_Submit = this.el.nativeElement.querySelector('#btn_add');
    const btn_add = this.el.nativeElement.querySelector('#btn_add');
    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtndisable')
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true')
    }
    if (btn_add) {
      this.renderer.removeAttribute(btn_add, 'disabled')
    }
    // this.enabledisable();
    this.GetGrid();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.optid();
  }
  UserID: any[] = [];
  Regions: any[] = [];
  UserID_Lov() {
    debugger;
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/UserID`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.UserID = data//.map(item => item.userid);
          this.selectedUserID = data[0].userid;
          this.selectedUserID = data[0].userid;
        } else {
          this.UserID = [];
        }
      },
      error: (err) => {
        console.error("Error fetching UserLov data:", err);
      }
    });
  }
  Region_Lov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Region`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.Regions = data
          //.filter(item => item.region && item.region.trim() !== '') // empty region hata do
          //.map(item => item.region);

          // default value set karo (pehla region)
          this.selectedRegion = this.Regions[0].region;
        } else {
          this.Regions = [];
        }
      },
      error: (err) => {
        console.error("Error fetching Region data:", err);
      }
    });
  }
  optid() {
    const GroupName = this.el.nativeElement.querySelector('#txt_GroupName');
    GroupName.value = '';
    if (GroupName) {
      this.renderer.removeAttribute(GroupName, 'disabled')
    }
  }
  enabledisable() {
    const inputs = [
      this.el.nativeElement.querySelector('#txt_GroupName'),
      this.el.nativeElement.querySelector('#txt_GroupDescription'),
      this.el.nativeElement.querySelector('#chb_Active'),
      //this.el.nativeElement.querySelector('#ddl_UserID'),
      this.el.nativeElement.querySelector('#txt_UserName'),
      //this.el.nativeElement.querySelector('#ddl_Region')
    ];

    this.lovDisabled = false;
    this.showAddButton = false;
    this.showSubmitButton = true;
    inputs.forEach((input) => {
      if (input) {
        this.renderer.removeAttribute(input, 'disabled');
      }
    });
  }
  disableenable() {
    const inputs = [
      this.el.nativeElement.querySelector('#txt_GroupName'),
      this.el.nativeElement.querySelector('#txt_GroupDescription'),
      this.el.nativeElement.querySelector('#chb_Active'),
      //this.el.nativeElement.querySelector('#ddl_UserID'),
      this.el.nativeElement.querySelector('#txt_UserName'),
      //this.el.nativeElement.querySelector('#ddl_Region')
    ];

    this.lovDisabled = true;
    this.showAddButton = true;
    this.showSubmitButton = false;
    inputs.forEach((input) => {
      if (input) {
        // Disable the input field
        this.renderer.setAttribute(input, 'disabled', 'true');

        if (input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = ''; // For other input fields
        }
      } else {
        this.renderer.removeAttribute(input, 'disabled');
      }
    });
  }
  edit(row: any): void {
    debugger;
    const txt_GroupName = this.el.nativeElement.querySelector('#txt_GroupName');
    const txt_GroupDescription = this.el.nativeElement.querySelector('#txt_GroupDescription');
    const chb_Active = this.el.nativeElement.querySelector('#chb_Active');
    //const ddl_UserID = this.el.nativeElement.querySelector('#ddl_UserID');
    const txt_UserName = this.el.nativeElement.querySelector('#txt_UserName');
    //const ddl_Region = this.el.nativeElement.querySelector('#ddl_Region');    

    if (txt_GroupName) {
      this.renderer.setProperty(txt_GroupName, 'value', row.userGroupID); // Set the value
      this.renderer.setAttribute(txt_GroupName, 'disabled', 'true'); // Disable the field
    }
    if (txt_GroupDescription) {
      this.renderer.setProperty(txt_GroupDescription, 'value', row.name); // Set the value
      this.renderer.removeAttribute(txt_GroupDescription, 'disabled'); // Enable the field
    }
    if (chb_Active) {
      const isActive = row.status === 'Active'; // Check status
      this.renderer.setProperty(chb_Active, 'checked', isActive); // Set checkbox checked/unchecked
      this.renderer.removeAttribute(chb_Active, 'disabled'); // Enable the checkbox
    }
    //if (ddl_UserID) {
    //  this.renderer.setProperty(ddl_UserID, 'value', ''); // Set the value
    //  this.renderer.removeAttribute(ddl_UserID, 'disabled'); // Enable the field
    //}
    //if (txt_UserName) {
    //  this.renderer.setProperty(txt_UserName, 'value', ''); // Set the value
    //  this.renderer.removeAttribute(txt_UserName, 'disabled'); // Enable the field
    //}
    //if (ddl_Region) {
    //  this.renderer.setProperty(ddl_Region, 'value', ''); // Set the value
    //  this.renderer.removeAttribute(ddl_Region, 'disabled'); // Enable the field
    //}
    this.lovDisabled = false;
    // Set selected values
    this.selectedGroupName = row.userGroupID;
    this.selectedGroupDescription = row.name;
    this.selectedActive = row.status === 'Active';
    // this.GetGrid();
    this.isgridview = true;
    const name = this.selectedGroupName;
    this.GetGrid1(name);
    this.isadd = 'U';
    this.SubmitField();
    this.buttobfun();
    // this.enabledisable();
    this.isaddbutton = true;
    this.showAddButton = false;
    this.showSubmitButton = true;
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
      '#txt_GroupName', '#txt_GroupDescription', '#chb_Active'//, '#txt_UserName', '#ddl_UserID', '#ddl_Region'
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
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtndisable'); // Remove the old class
      this.renderer.addClass(btn_Submit, 'newbtn');
    }
    //if (btn_Search) {
    //  this.renderer.removeClass(btn_Search, 'newbtn');
    //  this.renderer.addClass(btn_Search, 'newbtndisable');
    //}
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
    // debugger;
    const url = `${environment.apiBaseUrl}/api/UserGroupMst`;
    this.http.get<userGet[]>(url).subscribe({
      next: (res: userGet[]) => {
        if (res && res.length > 0) {
          this.operatorGet = res;
          this.GridData = res;
        } else {
          console.log('No data found');
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
  GetGrid1(name: string) {
    // debugger;
    const url = `${environment.apiBaseUrl}/api/UserGroupDtl/${name}`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          // Set default values for missing fields
          this.gridDat = res.map(item => ({
            userID: item.userID ?? null,
            name: item.name ?? '',
            region: item.region ?? '',
            tuid: item.tuid
          }));

          this.GridData = this.gridDat;
        } else {
          console.log('No data found');
          this.gridDat = [];
          // this.optid();
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.operatorGet = [];
      }
    });
  }
  gridData: userGet[] = [];
  gridDat: userDetail[] = [];
  AddButton1() {
    debugger;
    this.isSubmitting = true;

    const ugrpid = (document.getElementById('txt_GroupName') as HTMLInputElement).value;
    const userid = this.selectedUserID//(document.getElementById('ddl_UserID') as HTMLInputElement).value;
    const region = this.selectedRegion//(document.getElementById('ddl_Region') as HTMLSelectElement).selectedOptions[0].text;
    const user = this.loginUser;
    if (!userid) {
      this.popupMessage = 'Please Select UserID';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      this.isSubmitting = false;
      return;
    }
    const newRow: userDetail = {
      userID: userid,
      name: ugrpid,
      region: region,
      tuid: user
    };
    this.gridDat.push(newRow);
    this.isgridview = true;
    this.isSubmitting = false;

    // Reset form inputs
    //(document.getElementById('txt_UserName') as HTMLInputElement).value = '';
    //(document.getElementById('ddl_UserID') as HTMLInputElement).value = '';
    //(document.getElementById('ddl_Region') as HTMLSelectElement).selectedIndex = 0;
  }
  AddButton(): void {
    this.isaddbutton = true;
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
  }
  ddl_Sta() {
    const ddl_Status = this.el.nativeElement.querySelector('#ddl_UserID')
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Region')
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
    const txt_GroupName = this.el.nativeElement.querySelector('#txt_GroupName');
    //const txt_GroupDescription = this.el.nativeElement.querySelector('#txt_GroupDescription');
    //const chb_Active = this.el.nativeElement.querySelector('#chb_Active');
    //chb_Active.checked = false;

    const btn_add = this.el.nativeElement.querySelector('#btn_add')
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    const btn_Submit = this.el.nativeElement.querySelector('#btn_Submit');

    //if (btn_Search) {
    //  this.renderer.removeClass(btn_Search, 'newbtndisable');
    //  this.renderer.addClass(btn_Search, 'newbtn');
    //}
    if (btn_Submit) {
      this.renderer.removeClass(btn_Submit, 'newbtn');
      this.renderer.addClass(btn_Submit, 'newbtndisable');
      this.renderer.setAttribute(btn_Submit, 'disabled', 'true');
    }
    if (txt_GroupName) {
      this.renderer.removeAttribute(txt_GroupName, 'disabled');
      txt_GroupName.value = '';
    }
    //if (txt_GroupDescription) {
    //  this.renderer.removeAttribute(txt_GroupDescription, 'disabled');
    //  txt_GroupDescription.value = '';
    //}
    // if (chb_Active) {
    //  this.renderer.removeAttribute(chb_Active, 'disabled');
    //  chb_Active.value = '';
    //}
    if (btn_add) {
      this.renderer.removeClass(btn_add, 'newbtndisable');
      this.renderer.addClass(btn_add, 'newbtn');
    }
    this.GetGrid();
  }
  ResetButton() {
    debugger;
    this.isgridview = false;
    this.isaddbutton = false;
    this.disableenable();
    this.ResetFields();
    this.AddFields();
    const btn_Search = this.el.nativeElement.querySelector('#btn_Search');
    if (btn_Search) {
      this.renderer.removeAttribute(btn_Search, 'disabled')
    }
  }
  resetdrp() {
    const ddl_Status = this.el.nativeElement.querySelector('#ddl_UserID')
    const ddl_Type = this.el.nativeElement.querySelector('#ddl_Region')
    if (ddl_Status) {
      this.renderer.removeStyle(ddl_Status, 'background-color');
      this.renderer.setStyle(ddl_Status, 'background-color', '#efeeee');
    }
    if (ddl_Type) {
      this.renderer.removeStyle(ddl_Type, 'background-color');
      this.renderer.setStyle(ddl_Type, 'background-color', '#efeeee');
    }
  }
  showSuccessPopup: boolean = false;
  isSubmitting: boolean = false;
  closePopup() {
    this.showSuccessPopup = false;
  }
  ViewState: { [key: string]: any } = {};
  searchButton() {
    debugger;
    const inputD = this.el.nativeElement.querySelector('#txt_GroupName').value;
    const url = `${environment.apiBaseUrl}/api/UserGroupMst/${inputD}`;

    this.http.get<userGet[]>(url).subscribe({
      next: (res: userGet[]) => {
        if (res && res.length > 0) {
          this.operatorGet = res;
        } else {
          console.log('No data found.');
          this.operatorGet = [];
        }
      },
      error: (err) => {
        console.log('Error fetching data:', err);
        this.operatorGet = [];
      }
    });
  }
  userData: userSetup = new userSetup();
  submitButton() {
    debugger;
    this.isSubmitting = true;

    // Collect input data
    this.userData.userGroupID = (document.getElementById('txt_GroupName') as HTMLInputElement).value;
    this.userData.name = (document.getElementById('txt_GroupDescription') as HTMLInputElement).value;
    this.userData.status = (document.getElementById('chb_Active') as HTMLInputElement).checked ? 'A' : 'B';
    this.userData.tuid = this.loginUser;
    this.userData.tdate = new Date().toISOString();

    if (!this.userData.userGroupID || !this.userData.name || !this.userData.status) {
      this.popupMessage = !this.userData.userGroupID ? 'Please Enter Group Name'
        : !this.userData.name ? 'Please Enter Group Description'
          : 'Please Enter Group Status';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      this.isSubmitting = false;
      return;
    }

    const DID = this.el.nativeElement.querySelector('#txt_GroupName');
    const srButton = this.el.nativeElement.querySelector('#btn_Search');
    const sbButton = this.el.nativeElement.querySelector('#btn_Submit');

    if (this.isadd === 'U') {
      debugger;
      this.http.put(`${environment.apiBaseUrl}/api/UserGroupMst/${this.userData.userGroupID}`, this.userData)
        .subscribe((res) => {
          if (res) {
            // const row = this.gridDat.find(r => r.name === this.userData.userGroupID);
            // if (row) {
            //   const rowIndex = this.gridDat.indexOf(row);
            this.deleteRecord1(this.userData.userGroupID);
            if (DID) {
              this.renderer.removeAttribute(DID, 'disabled');
            }
            if (sbButton) {
              this.renderer.removeAttribute(sbButton, 'disabled');
            }
            // }        
            // this.insertGroupDetail();
          }
        });
    } else if (this.isadd === 'I') {
      // INSERT
      debugger;
      this.http.post(`${environment.apiBaseUrl}/api/UserGroupMst`, this.userData).subscribe({
        next: (res) => {
          if (res) {
            this.popupMessage = '', res;
            this.insertGroupDetail();

            if (DID) {
              this.renderer.removeAttribute(DID, 'disabled');
            }
            this.updateButtonStyles(srButton, sbButton);
          }
        },
        error: (err) => {
          console.error('Error inserting GroupMaster:', err);
          this.popupMessage = 'Failed to insert the GroupMaster.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
          this.isSubmitting = false;
          this.ResetButton();
        }
      });
    } else {
      this.popupMessage = 'Invalid operation type.';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      this.isSubmitting = false;
      this.ResetButton();
    }
  }
  insertGroupDetail() {
    debugger;
    this.isSubmitting = true;
    const url = `${environment.apiBaseUrl}/api/UserGroupDtl`;

    const sbButton = this.el.nativeElement.querySelector('#btn_Submit');
    // if (this.gridDat.length === 0) {
    //   this.popupMessage = 'No data to insert!';
    //   this.isErrorPopup = true;
    //   this.showSuccessPopup = true;
    //   this.ResetButton();
    //   return;
    // }
    // const payload = Array.isArray(this.gridDat) ? this.gridDat : [this.gridDat];
    this.http.post(url, this.gridDat).subscribe({
      next: (response: any) => {
        const ab = JSON.stringify(response);
        const msgR = ab.split(';').slice(1).join(',').replace('}', '').replace('"', '').trim();
        this.popupMessage = msgR;
        this.showSuccessPopup = true;
        this.isErrorPopup = false;
        this.gridDat = [];
        this.isgridview = false;
        this.isSubmitting = false;
        this.GetGrid();
        if (sbButton) {
          this.renderer.removeAttribute(sbButton, 'disabled');
        }
        this.ResetFields();
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
      },
      error: (error) => {
        // this.popupMessage = `Error inserting data: ${error.message}`;
        // this.isErrorPopup = true;
        // this.showSuccessPopup = true;
        // this.isSubmitting = false;
        // this.ResetButton();
        // setTimeout(() => {
        //   this.showSuccessPopup = false;
        // }, 3000);
      }
    });
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
  deleteRecord(ugrpid: string) {
    debugger;
    this.isSubmitting = true;
    this.showSuccessPopup = false;
    this.isErrorPopup = false;

    const body = {
      userGroupID: 'ugrpid',
      name: '',
      status: '',
      tuid: this.loginUser,
      tdate: ''
    };
    const headers = { 'Content-Type': 'application/json' };
    const url = `${environment.apiBaseUrl}/api/UserGroupMst/${ugrpid}`
    this.http.delete(url, {
      headers: headers,
      body: body
    })
      .subscribe(
        (response: any) => {
          const resMessage = response.message;
          let msgR = resMessage.split(';').slice(1).join(','); // slice(1) to remo
          msgR = msgR.replace('}', '').trim();
          msgR = msgR.replace('"', '').trim();
          // Assign message to popup
          this.popupMessage = msgR;
          this.showSuccessPopup = true;
          // this.isErrorPopup = true;
          this.filteredData = this.filteredData.filter((row) => row.userData.ugrpid !== ugrpid);
          this.GetGrid();
          const txt_DepartmentID = this.el.nativeElement.querySelector('#txt_GroupName');
          if (txt_DepartmentID) {
            this.renderer.removeAttribute(txt_DepartmentID, 'disabled'); // Enable input field
          }
          this.showModal = false;
          //ugrpid = '';
          this.ResetFields();
          this.AddFields();
          setTimeout(() => {
            this.showSuccessPopup = false;
          }, 3000);
        },
        (error) => {
          alert(`Error deleting record: ${error.message}`);
          console.error('Error  Details:', error);
          this.ResetButton();
          setTimeout(() => {
            this.showSuccessPopup = false;
          }, 3000);
        }
      );
  }
  deleterow(row: any, index: number) {
    debugger;
    if (row.name || row.userID || row.region) {
      this.gridDat.splice(index, 1);
      return;
    }
  }
  deleteRecord1(ugrpid: string) {
    debugger;

    // const ugrpid = row.name;
    // const userid = row.userID;
    // const region = row.region;

    const url = `${environment.apiBaseUrl}/api/UserGroupDtl/${ugrpid}`;

    const body = {
      userID: '',
      name: '',
      ugrpstat: '',
      region: '',
      tuid: this.loginUser
    };

    this.http.delete(url, {
      headers: { 'Content-Type': 'application/json' },
      body: body
    }).subscribe(
      (response: any) => {
        const resMessage = response.message;
        let msgR = resMessage.split(';').slice(1).join(',');
        msgR = msgR.replace('}', '').trim();
        msgR = msgR.replace('"', '').trim();
        this.popupMessage = msgR;
        this.showSuccessPopup = true;
        // this.isErrorPopup = true;
        this.showModal = false;
        this.disableenable();
        this.optid();
        this.resetdrp();
        this.insertGroupDetail();
        this.ResetButton();
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
      },
      (error) => {
        this.popupMessage = 'Error while deleting!';
        this.isErrorPopup = true;
        this.showSuccessPopup = false;
        this.ResetButton();
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
      }
    );
  }
  confirmDelete1(row: any, index: number) {
    debugger;
    if (confirm('Are you sure you want to delete this row?')) {
      this.deleterow(row, index);
    }
  }
  userGroupID: string | null = null;
  confirmDelete(userGroupID: string) {
    debugger;
    console.log("Confirm delete called for deptid:", userGroupID); // Add logging
    this.userGroupID = userGroupID;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
}

