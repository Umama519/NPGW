import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-role-assign-action',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './role-assign-action.component.html',
  styleUrls: ['./role-assign-action.component.css']
})
export class RoleAssignActionComponent {
  constructor(private http: HttpClient) { }

  RoleLov: any[] = [];
  selectedRoleAss: string = '';
  selectedDescription: string = '';
  ListBoxOne: any[] = [];   // Available actions
  ListBoxTwo: any[] = [];   // Assigned actions
  selectedValue1: string = '';
  selectedValue2: string = '';
  loginUser: string = 'admin';
  popupMessage: string = '';
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  isErrorPopup: boolean = false;
  errmessage: string = ""; // Control visibility of popup

  ngOnInit() {
    this.RoleAsignLov();
  }

  // ✅ Load Roles
  RoleAsignLov() {
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Role`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.RoleLov = data;
        if (this.RoleLov.length > 0) {
          this.selectedRoleAss = this.RoleLov[0].roleid;
          this.selectedDescription = this.RoleLov[0].roleName;
          this.refreshBothLists(this.selectedRoleAss);
        }
      },
      error: (err) => console.error("Role Load Error:", err)
    });
  }

  // ✅ Refresh both listboxes for selected role
  refreshBothLists(role: string) {
    this.loadRoleAssignedActions(role, () => {
      this.loadAvailableActions(role);
    });
  }

  // ✅ Load Assigned Actions for Role (ListBox2)
  loadRoleAssignedActions(role: string, callback?: () => void) {
    const url = `${environment.apiBaseUrl}/api/ActionRoleAccess/Lov/${role}`;
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        this.ListBoxTwo = (res || []).filter(x => x && x.actionCode && x.descs);
        if (callback) callback();
      },
      error: (err) => {
        console.error("ListBox2 Load Error:", err);
        this.ListBoxTwo = [];
        if (callback) callback();
      }
    });
  }

  // ✅ Load Available Actions (ListBox1)
  loadAvailableActions(role: string) {
    const url = `${environment.apiBaseUrl}/api/ActionRoleAccess/ActionList`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Sirf un actions ko dikhana jo already assigned nahi hain
        this.ListBoxOne = (data || []).filter(
          a1 => !this.ListBoxTwo.some(a2 => a2.actionCode === a1.actionCode)
        );
      },
      error: (err) => console.error("ListBox1 Load Error:", err)
    });
  }

  // ✅ Role change hone pe dono list refresh
  onRoleChange() {
    const selected = this.RoleLov.find(x => x.roleid === this.selectedRoleAss);
    this.selectedDescription = selected ? selected.roleName : '';
    this.refreshBothLists(this.selectedRoleAss);
  }

  // ✅ Move One Right
  moveRight() {
    const selected = this.ListBoxOne.find(x => x.actionCode === this.selectedValue1);
    if (selected) {
      this.ListBoxTwo.push(selected);
      this.ListBoxOne = this.ListBoxOne.filter(x => x.actionCode !== this.selectedValue1);
      this.selectedValue1 = '';
    }
  }

  // ✅ Move All Right
  moveAllRight() {
    this.ListBoxTwo = [...this.ListBoxTwo, ...this.ListBoxOne];
    this.ListBoxOne = [];
  }

  // ✅ Move One Left
  deleteOne() {
    const selected = this.ListBoxTwo.find(x => x.actionCode === this.selectedValue2);
    if (selected) {
      this.ListBoxOne.push(selected);
      this.ListBoxTwo = this.ListBoxTwo.filter(x => x.actionCode !== this.selectedValue2);
      this.selectedValue2 = '';
    }
  }

  // ✅ Move All Left
  deleteAll() {
    this.ListBoxOne = [...this.ListBoxOne, ...this.ListBoxTwo];
    this.ListBoxTwo = [];
  }

  // ✅ Clear both listboxes
  clearAll() {
    this.RoleAsignLov();
  }

  // ✅ Submit (Delete + Insert)
  submitButton() {
  if (!this.selectedRoleAss) {
    this.popupMessage = "Please select a Role first.";
    this.isErrorPopup = true;
    this.showSuccessPopup = true;
    return;
  }

  const url = `${environment.apiBaseUrl}/api/ActionRoleAccess`;

  // 🔹 Step 1: Delete existing role access
  const deletePayload = {
    aact: "",
    rlcd: this.selectedRoleAss,
    userid: this.loginUser,
    actionType: "D"
  };

  this.http.post<any>(url, deletePayload).subscribe({
    next: (deleteRes) => {
      // 🔹 Step 2: Insert all ListBoxTwo actions
      const insertCalls = this.ListBoxTwo.map(item => {
        const insertPayload = {
          aact: item.actionCode,
          rlcd: this.selectedRoleAss,
          userid: this.loginUser,
          actionType: "I"
        };
        return this.http.post<any>(url, insertPayload).toPromise();
      });

      Promise.all(insertCalls)
        .then((responses) => {
          const dbMessages: string[] = [];

          // ✅ Delete ka message
          if (deleteRes?.message) dbMessages.push(deleteRes.message);

          // ✅ Insert ke messages
          responses.forEach(res => {
            if (res?.message) dbMessages.push(res.message);
          });

          // ✅ Combine all database messages
      // ✅ Combine all messages
const finalMessage = dbMessages.join(','); 

// ✅ Extract only proper readable messages (remove 0/1, commas, extra spaces)
const msgParts = finalMessage
  .split(/[;,]/) // ; or , par split
  .map(p => p.trim()) // clean spaces
  .filter(p => p && !/^\d+$/.test(p)) // numbers remove
  .filter(p => !p.startsWith('0') && !p.startsWith('1')); // 0/1 prefixes remove

// ✅ Take the last clean message (usually last insert result)
const msgR = msgParts[msgParts.length - 1] || "Operation completed.";

// ✅ Detect success/error from first char (if any)
if (finalMessage.includes('0;')) {
  this.isErrorPopup = true;
} else {
  this.isErrorPopup = false;
}

// ✅ Show message in popup
this.popupMessage = msgR;
this.showSuccessPopup = true;

// ✅ Auto close after 3 seconds
setTimeout(() => {
  this.showSuccessPopup = false;
  this.popupMessage = '';
}, 3000);


          // ✅ Refresh lists
          this.refreshBothLists(this.selectedRoleAss);
        })
        .catch((err) => {
          console.error("Insert Error:", err);
          this.popupMessage = 'Failed to insert records. Please try again.';
          this.isErrorPopup = true;
          this.showSuccessPopup = true;
        });
    },
    error: (err) => {
      console.error("Delete Error:", err);
      this.popupMessage = 'Failed to delete existing records.';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
    }
  });
}

}
