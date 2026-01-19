import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements AfterViewInit {
  ChangeUser: string = '';
  errmessage: string = '';
  isFormValid: boolean = false;
  showForm: boolean = true;
  showSuccess: boolean = false;
  successMessage: string = "";

  private http = inject(HttpClient);
  private router = inject(Router);

  userObj: any = {
    OldPassword: '',
    NewPassword: '',
    ConfrmPass: ''
  };

  @ViewChild('oldPass') oldPass!: ElementRef;
  @ViewChild('newPass') newPass!: ElementRef;
  @ViewChild('confirmPass') confirmPass!: ElementRef;

  ngOnInit() {
    this.ChangeUser = localStorage.getItem('loginUser') || '';
  }

  ngAfterViewInit() {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validateField = (input: ElementRef, value: string, isBlur: boolean) => {
      const inputName = input.nativeElement.getAttribute('name');
      let isFieldValid = true;

      // ✅ Agar field khali hai → default border & error clear
      if (!value || value.trim() === '') {
        input.nativeElement.style.border = '';
        if (isBlur) this.errmessage = '';
        return;
      }

      // ✅ Validate only on blur (user finishes typing)
   if (isBlur) {
  // ✅ Agar field empty hai → border reset aur error hide
  if (!value || value.trim() === '') {
    input.nativeElement.style.border = ''; // default border
    this.errmessage = '';
    return;
  }

  // ✅ Confirm Password check (sirf tab jab dono valid pattern hon)
  if (
    inputName === 'confirmPassword' &&
    this.userObj.NewPassword &&
    passwordPattern.test(this.userObj.NewPassword) &&
    passwordPattern.test(value) &&
    value !== this.userObj.NewPassword
  ) {
    input.nativeElement.style.border = '2px solid #d72222';
    this.errmessage = 'New password and confirm password do not match.';
    isFieldValid = false;
  }

  // ✅ Pattern check (Old / New / Confirm Password)
  else if (
    !passwordPattern.test(value) &&
    (inputName === 'oldPassword' || inputName === 'newPassword' || inputName === 'confirmPassword')
  ) {
    input.nativeElement.style.border = '2px solid #d72222';
    this.errmessage =
      'Password must include uppercase, lowercase, number, special character, and be 8+ chars long.';
    isFieldValid = false;
  }

  // ✅ Everything valid → green border
  else {
    input.nativeElement.style.border = '2px solid #026e02';
  }

  // ✅ Check overall form validity
  const allValid =
    passwordPattern.test(this.userObj.OldPassword) &&
    passwordPattern.test(this.userObj.NewPassword) &&
    passwordPattern.test(this.userObj.ConfrmPass) &&
    this.userObj.NewPassword === this.userObj.ConfrmPass;

  if (allValid) {
    this.errmessage = '';
    this.isFormValid = true;
  } else {
    this.isFormValid = false;
  }
}



      // ✅ Check full form validity
      const allValid =
        passwordPattern.test(this.userObj.OldPassword) &&
        passwordPattern.test(this.userObj.NewPassword) &&
        this.userObj.NewPassword === this.userObj.ConfrmPass &&
        this.userObj.OldPassword.trim() !== '' &&
        this.userObj.NewPassword.trim() !== '' &&
        this.userObj.ConfrmPass.trim() !== '';

      if (allValid) {
        this.errmessage = '';
        this.isFormValid = true;
      } else {
        this.isFormValid = false;
      }
    };

    // ✅ Blur par validation chalayenge (typing ke dauran nahi)
    [this.oldPass, this.newPass, this.confirmPass].forEach((input) => {
      fromEvent(input.nativeElement, 'blur').subscribe(() => {
        const value = input.nativeElement.value;
        validateField(input, value, true);
      });

      // ✅ Reset border jab input clear kare
      fromEvent(input.nativeElement, 'input')
        .pipe(debounceTime(300), map(() => input.nativeElement.value))
        .subscribe((value: string) => {
          if (!value || value.trim() === '') {
            input.nativeElement.style.border = '';
            this.errmessage = '';
          }
        });
    });
  }

  ChangePassword(): void {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!this.ChangeUser) {
      this.errmessage = 'User ID not found. Please login again.';
      return;
    }

    // if (!this.userObj.OldPassword || !this.userObj.NewPassword || !this.userObj.ConfrmPass) {
    //   this.errmessage = 'All fields are required.';
    //   return;
    // }

    if (!passwordPattern.test(this.userObj.NewPassword)) {
      this.errmessage =
        'Password must include uppercase, lowercase, number, special character, and be 8+ chars long.';
      return;
    }

    if (this.userObj.NewPassword !== this.userObj.ConfrmPass) {
      this.errmessage = 'New password and confirm password do not match.';
      return;
    }
    const url = `${environment.apiBaseUrl}/api/ChangePassword`;
    const requestBody = {
      Username: this.ChangeUser,
      OldPassword: this.userObj.OldPassword,
      NewPassword: this.userObj.NewPassword
    };

    this.http.post(url, requestBody).subscribe({
      
      next: (res: any) => {
       const parts = res.message.split(';');
        if (res.message.startsWith('1')) {
          //this.onReset();
          this.successMessage = parts[1]?.trim() || "Password changed successfully!";
        this.showForm = false;      
        this.showSuccess = true;    
      } else {
        this.errmessage = parts[1]?.trim() || 'Password change failed.';
      }
    },
    error: () => {
      this.errmessage = "Something went wrong. Please try again.";
    }
  });
}
onReLogin() {
  this.router.navigateByUrl('/login');
}

  onReset() {
    this.router.navigateByUrl('/login');
  }
}
