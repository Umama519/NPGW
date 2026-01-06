import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { loaderService } from './SETUPS/Service/loaderService';
import { TranslationService } from '../translation.service';
import { LovDropdownComponent } from './lov-dropdown/lov-dropdown.component';
import { VersionCheckService } from './services/VersionChange';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LovDropdownComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'NPGW';
  private logoutInterval: any;
  private isReloading = false;

  constructor(
    private router: Router,
    private loaderService: loaderService,
    private versionCheckService: VersionCheckService,
    private translationService: TranslationService,
    private location: Location) { }

  ngOnInit(): void {
    this.versionCheckService.startVersionCheck(); // ✅ VERY IMPORTANT

    const perfEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    this.isReloading = perfEntries[0]?.type === 'reload';

    const loginUser = localStorage.getItem('loginUser');
    if (!loginUser) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return;
    }

    this.initializeInactivityTimer();
    this.location.subscribe(() => this.handleBackNavigation());
  }

  // ✅ Logout user and redirect to login
  private logoutAndRedirect(): void {
    // alert('A new version is deployed. You will be logged out.');
    localStorage.removeItem('loginUser');
    localStorage.removeItem('loginTime');
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  // ✅ Session inactivity timer
  private initializeInactivityTimer(): void {
    if (this.logoutInterval) clearInterval(this.logoutInterval);
    localStorage.setItem('loginTime', Date.now().toString());

    this.logoutInterval = setInterval(() => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime && Date.now() - parseInt(loginTime) > 60 * 60 * 1000) {
        this.logoutAndRedirect();
        clearInterval(this.logoutInterval);
      }
    }, 1000);
  }

  // ✅ Update session time on user activity
  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  @HostListener('window:scroll')
  handleUserAction(): void {
    const loginUser = localStorage.getItem('loginUser');
    if (loginUser) localStorage.setItem('loginTime', Date.now().toString());
  }

  handleBackNavigation(): void {
    const loginUser = localStorage.getItem('loginUser');
    if (!loginUser) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return;
    }

    this.router.navigateByUrl('/app-home', { replaceUrl: true });
  }

  @HostListener('window:unload', ['$event'])
  onUnload(event: any) {
    if (!this.isReloading) {
      localStorage.removeItem('loginUser');
      localStorage.removeItem('loginTime');
    }
  }

  onLanguageChange(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    this.translationService.setLanguage(lang);
  }
}


// import { CommonModule, Location } from '@angular/common';
// import { Component, OnInit, HostListener } from '@angular/core';
// import { Router, NavigationStart, NavigationEnd } from '@angular/router';
// import { RouterOutlet } from '@angular/router';
// import { LovDropdownComponent } from './lov-dropdown/lov-dropdown.component';
// import { loaderService } from './SETUPS/Service/loaderService';
// import { TranslationService } from '../translation.service';
// import { PublishCheckService } from './services/VersionChange';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, CommonModule, LovDropdownComponent],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   title = 'NPGW';
//   loading = false;
//   selectedCdtyp: any = '';
//   private currentRoute = '';
//   private isReloading = false;
//   private logoutInterval: any;
//   constructor(
//     private router: Router,
//     private loaderService: loaderService,
//     private translationService: TranslationService,
//     private location: Location,
//     private publishCheckService: PublishCheckService
//   ) {
//     this.router.events.subscribe(event => {
//       if (event instanceof NavigationStart) {
//         this.loaderService.show();
//         setTimeout(() => {
//           this.loaderService.hide();
//           this.selectedCdtyp = 'http://localhost:5000/api';
//         }, 500);
//       }

//       if (event instanceof NavigationEnd) {
//         this.currentRoute = event.urlAfterRedirects;
//         const loginUser = localStorage.getItem('loginUser');
//         if (loginUser) {
//           localStorage.setItem('loginTime', Date.now().toString());
//           this.initializeInactivityTimer();
//         }
//       }
//     });
//   }
//   ngOnInit(): void {
//     if (this.publishCheckService.updateVersion()) {
//       // New deployment detected → logout
//       localStorage.removeItem('loginUser');
//       localStorage.removeItem('loginTime');
//       this.router.navigateByUrl('/login', { replaceUrl: true });
//       return; // stop further execution
//     }
//     const currentUrl = window.location.href;
//     // ✅ Step 1: Check if this is popup route (cares-error)
//     if (currentUrl.includes('app-cares-error')) {
//       return; // 🔥 Stop all further execution for popup
//     }
//     const loginUser = localStorage.getItem('loginUser');
//     const perfEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
//     const navType = perfEntries[0]?.type;
//     this.isReloading = navType === 'reload';
//     if (!loginUser) {
//       this.router.navigateByUrl('/login', { replaceUrl: true });
//       return;
//     }
//     this.initializeInactivityTimer();
//     this.location.subscribe(() => this.handleBackNavigation());
//   }
//   private initializeInactivityTimer() {
//     if (this.logoutInterval) {
//       clearInterval(this.logoutInterval);
//     }
//     localStorage.setItem('loginTime', Date.now().toString());
//     this.logoutInterval = setInterval(() => {
//       const loginTime = localStorage.getItem('loginTime');
//       if (loginTime && Date.now() - parseInt(loginTime) > 60 * 60 * 1000) {
//         localStorage.removeItem('loginUser');
//         localStorage.removeItem('loginTime');
//         clearInterval(this.logoutInterval);
//         this.router.navigateByUrl('/login', { replaceUrl: true });
//       }
//     }, 1000);
//   }
//  @HostListener('window:mousemove')
//   @HostListener('window:keydown')
//   @HostListener('window:click')
//   @HostListener('window:scroll')
//   handleUserAction(): void {
//     if (this.publishCheckService.isVersionUpdated()) {
//       // Agar version mismatch → logout
//       localStorage.removeItem('loginUser');
//       localStorage.removeItem('loginTime');
//       this.router.navigateByUrl('/login', { replaceUrl: true });
//       return;
//     }
//     const loginUser = localStorage.getItem('loginUser');
//     if (loginUser) {
//       localStorage.setItem('loginTime', Date.now().toString());
//     }
//   }
//   handleBackNavigation(): void {
//     const loginUser = localStorage.getItem('loginUser');
//     if (!loginUser) {
//       this.router.navigateByUrl('/login', { replaceUrl: true });
//       return;
//     }
//     if (this.currentRoute.startsWith('/app-home')) {
//       localStorage.removeItem('loginUser');
//       localStorage.removeItem('loginTime');
//       this.router.navigateByUrl('/login', { replaceUrl: true });
//     } else {
//       this.router.navigateByUrl('/app-home', { replaceUrl: true });
//     }
//   }
//   @HostListener('window:unload', ['$event'])
//   onUnload(event: any) {
//     if (!this.isReloading) {
//       localStorage.removeItem('loginUser');
//       localStorage.removeItem('loginTime');
//     }
//   }
//   onLanguageChange(event: Event) {
//     const selectElement = event.target as HTMLSelectElement;
//     const lang = selectElement.value;
//     this.switchLanguage(lang);
//   }
//   switchLanguage(lang: string) {
//     this.translationService.setLanguage(lang);
//     console.log('Language switched to:', lang);
//   }
// }