import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

 @Injectable({ providedIn: 'root' })
 export class VersionCheckService {

  private readonly VERSION_API = `${environment.apiBaseUrl}/api/UpdateVersion/version`;
  private readonly CHECK_INTERVAL = 10000; // 10 sec
  private intervalId: any;

  constructor(private http: HttpClient, private router: Router) {}

 startVersionCheck() {

  if (this.intervalId) {
    return; // 🔒 duplicate interval brea
  }

  this.intervalId = setInterval(() => {
    this.http.get<any>(this.VERSION_API).subscribe({
      next: (res) => {
        const serverVersion = res.version;
        const localVersion = localStorage.getItem('appVersion');

        if (!localVersion) {
          localStorage.setItem('appVersion', serverVersion);
          return;
        }

        if (localVersion !== serverVersion) {
        //   alert('Session Expired, Please login again.');
          localStorage.clear();
          location.href = '/login';
        }
      }
    });
  }, this.CHECK_INTERVAL);
}

 }
