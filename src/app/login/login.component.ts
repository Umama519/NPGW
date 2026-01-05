import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userObj: any = {
    Username: '',
    Password: ''
  };
  errmessage: string = '';
  showPassword: boolean = false;

  private http = inject(HttpClient);
  private router = inject(Router);


  ngOnInit() {        
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('versionChanged') === 'true') {
      // this.errmessage = 'Application has been updated. Please login again.';
      this.Timeout();
    }


    this.checkPreviousSession();
    const UserID = document.getElementById('txtUserid');
    if (UserID) {
      UserID.focus();
    }
  }

  // ✅ Aapka existing code...
  checkPreviousSession() {
    const userID = localStorage.getItem("loginUser");
    const sessionID = localStorage.getItem("SessionID");

    if (userID && userID !== "") {
      if (sessionID) {
        this.sessionTracking().subscribe({
          next: (res) => console.log("Previous session updated:", res),
          error: (err) => console.error("Tracking error:", err)
        });
      }

      localStorage.removeItem("GST");
      localStorage.removeItem("IP");
      localStorage.removeItem("Mobile_type");
      localStorage.removeItem("FrName");
      localStorage.removeItem("Role");
      localStorage.removeItem("Role_cd");
      localStorage.removeItem("UserPrivilege");
      localStorage.removeItem("loginUser");
      localStorage.removeItem("Rcode");
      localStorage.removeItem("UserName");
      localStorage.removeItem("Exp_msg");
      localStorage.removeItem("SessionID");
    }
  }

  sessionTracking() {
    const body = {
      sessionID: localStorage.getItem("SessionID"),
      ip: localStorage.getItem("IP"),
      userID: localStorage.getItem("loginUser"),
      lat: 0,
      lng: 0
    };

    const url = `${environment.apiBaseUrl}/api/Login/SessionTracking`;
    return this.http.post(url, body);
  }

  Timeout() {
    setTimeout(() => {
      this.errmessage = '';
    }, 2000);
  }

  generateSessionID(): string {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  onLogin(): void {
    if (!this.userObj.Userid) {
      this.errmessage = 'Please Enter Username';
      this.Timeout();
      return;
    } else if (!this.userObj.Password) {
      this.errmessage = 'Please Enter Password';
      this.Timeout();
      return;
    } else {
      let sid = localStorage.getItem("SessionID");
      if (!sid) {
        sid = this.generateSessionID();
        localStorage.setItem("SessionID", sid);
        console.log("Generated SessionID:", sid);
      }
      this.checkMultiSessionAllow();
      const url = `${environment.apiBaseUrl}/api/Login`;

      const loginData = {
        username: this.userObj.Userid,
        password: this.userObj.Password,
        sessionID: localStorage.getItem("SessionID")
      };

      this.http.post(url, loginData).subscribe({
        next: (res: any) => {
          if (res.message.startsWith('1')) {
            const msg = res.message.split(';');
            localStorage.setItem('loginUser', this.userObj.Userid);
            localStorage.setItem('roleMessage', msg[5] || '');
            localStorage.setItem('lastLogging', msg[6] || '');
            localStorage.setItem('FrID', msg[8] || '');
            
            localStorage.setItem('loginTime', Date.now().toString());
            this.http.get<any>(`${environment.apiBaseUrl}/api/UpdateVersion/version`)
              .subscribe(v => {
                localStorage.setItem('appVersion', v.version);
              });                        
            localStorage.removeItem('ConsolePagedData');
            localStorage.removeItem('ConsoleCurrentPage');
            localStorage.removeItem('ConsoleGridData');
            debugger
            localStorage.setItem('token', res.token);

            this.router.navigateByUrl('app-home');
          }
          else if (res.message.startsWith('2')) {
            const msg = res.message.split(';');
            localStorage.setItem('Alert', msg[0] || '');
            localStorage.setItem('PasswordChange', 'E');
            localStorage.setItem('Values', res.message || '');
            localStorage.setItem('loginUser', this.userObj.Userid);
            localStorage.setItem('Exp_msg', msg[4] || '');
            localStorage.setItem('FrID', msg[8] || '');
           

            this.router.navigateByUrl('app-PasswordChangeAlert');
          }
          else if (res.message.startsWith('3')) {
            const msg = res.message.split(';');
            localStorage.setItem('Alert', msg[0] || '');
            localStorage.setItem('Values', res.message || '');
            localStorage.setItem('loginUser', this.userObj.Userid);
            localStorage.setItem('Exp_msg', msg[4] || '');
            localStorage.setItem('Expiry', msg[3] || '');
            localStorage.setItem('FrID', msg[8] || '');
              localStorage.setItem('roleMessage', msg[5] || '');
            localStorage.setItem('lastLogging', msg[6] || '');
            localStorage.setItem('PasswordChange', 'Y');

            this.router.navigateByUrl('app-PasswordChangeAlert');
          }
          else {
            const messageParts = res.message.split(';');
            this.errmessage = messageParts[1]?.trim() || 'Invalid credentials.';
            this.userObj.Password = '';
            this.Timeout();
          }
        },
        error: (err) => {
          this.errmessage = 'Server has not Response. Please Try Again';
          this.userObj.Password = '';
          this.Timeout();
        }
      });
    }
  }

  checkMultiSessionAllow() {
    debugger;
    const userId = this.userObj.Userid
    if (!userId) return;

    const url = `${environment.apiBaseUrl}/api/Login/CheckMultiSession?userId=${userId}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        localStorage.setItem("Multi_Session_Allow", res.multiSession || "Y");
      },
      error: () => {
        localStorage.setItem("Multi_Session_Allow", "Y");
      }
    });
  }

  onReset() {
    this.userObj.Userid = '';
    this.userObj.Password = '';
    this.errmessage = '';
  }

  ChangePassword() {
    if (!this.userObj.Userid) {
      this.errmessage = 'Must Enter User ID before changing password'
      this.Timeout();
      return;
    }
    localStorage.setItem('loginUser', this.userObj.Userid);
    this.router.navigateByUrl('app-change-password');
  }
}