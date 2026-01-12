import { Component, HostListener, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { TranslationService } from '../../translation.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface QuickLinkAdd {
  title: string;    // p_MENUTITLE
  link: string;     // p_MENUDISC
  createdBy: string;      // p_MENUNUM
}
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  showHeader: boolean = true;

  showModal: boolean = false;
  dropdownOpen = false;
  hoveredHeader: string = '';
  loginUser: string = '';
  roleMessage: string = '';
  operator: string = '';
  lastLogging: string = '';
  object: string = '';
  bsItems: any[] = [];
  depGet: any[] = [];
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  intervalId: any;
  errmessage: string = ""; // Control visibility of popup
  showSuccessPopup: boolean = false;
  private http = inject(HttpClient);
  private router = inject(Router);
  constructor(private translationService: TranslationService, private sanitizer: DomSanitizer) { }
  languages = [
    { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' },
    { code: 'ur', name: 'Urdu' }, { code: 'fr', name: 'French' },
    { code: 'sw', name: 'Swahili' }, { code: 'lg', name: 'Luganda' },
    { code: 'ach', name: 'Acholi' }, { code: 'rn', name: 'Runyankole' },
    { code: 'rk', name: 'Rukiga' }, { code: 'ar', name: 'Arabic' },
    { code: 'sd', name: 'Sindhi' }, { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' }, { code: 'ja', name: 'Japanese' }
  ];
  ngOnInit() {
    const hide = localStorage.getItem('HideHeader');

    if (hide === 'true') {
      this.showHeader = false;   // logout ke baad header hide
    } else {
      this.showHeader = true;
    }

    this.checkIfNewSessionCreated();
    this.intervalId = setInterval(() => {
      this.checkIfNewSessionCreated();
    }, 10000);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkIfNewSessionCreated();
      }
    });

    this.object = localStorage.getItem('breadcrumb') || '';
    this.roleMessage = localStorage.getItem('roleMessage') || 'No Role Assigned';
    this.getAllUser();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.operator = localStorage.getItem('operator') || 'No operator assigned';
    this.lastLogging = localStorage.getItem('lastLogging') || 'No Logging Time Store';
    window.addEventListener('breadcrumb-updated', () => {
      this.object = localStorage.getItem('breadcrumb') || '';
    });
    history.pushState(null, '');
    window.addEventListener('popstate', () => {
      history.pushState(null, '');
    });
  }
  toggleDropdowna() { this.dropdownOpen = !this.dropdownOpen; }
  selectLanguage(code: string) { this.translationService.setLanguage(code); this.dropdownOpen = false; }
  setHovered(headerTitle: string) { this.hoveredHeader = headerTitle; }
  getAllUser() {
    const url = `${environment.apiBaseUrl}/api/MasterPage/${this.roleMessage}/N`;
    this.http.get<any[]>(url).subscribe({
      next: (res: any[]) => {
        if (!res?.length) return;
        this.depGet = res;
        const g1Items = this.depGet
          .filter(x => x.grouptype === 'G1')
          .sort((a, b) => Number(a.seq) - Number(b.seq));
        this.bsItems = g1Items.map(parent => ({
          ...parent,
          isOpen: false,

          children: this.depGet
            .filter(child => String(child.pmenucd) === String(parent.menu_cd) && child.grouptype === 'D')
            .sort((a, b) => Number(a.seq) - Number(b.seq)) // optional: sort children
            .map(child => ({
              ...child,
              isOpen: false,
              subChildren: this.depGet
                .filter(sub => String(sub.pmenucd) === String(child.menu_cd))
                .sort((a, b) => Number(a.menu_cd) - Number(b.menu_cd)) // optional: sort subChildren
                .map(sub => ({ ...sub, isOpen: false }))
            }))
        }));
      },
      error: err => {
        console.error(err);
      }
    });
  }
  onMouseEnter(item: any): void {
    // item.isOpen = true;
    item.keepOpen = true; // dropdown stay
    // this.hoveredHeader = item.title;
  }
  onMouseLeave(item: any): void {
    // item.keepOpen = false;
    setTimeout(() => {
      if (!item.keepOpen) {
        item.isOpen = false;
        this.hoveredHeader = '';
      }
    }, 200);
  }
  @HostListener('document:click', ['$event'])
  onWindowClick(event: Event) {
    const target = event.target as HTMLElement;    
    if (!target.closest('.menu-header')) {
      this.bsItems.forEach((item: any) => {
        item.isOpen = false;
      });
    }
  }

  onHeaderClick(event: Event, item: any) {
    event.preventDefault();
    this.bsItems.forEach((x: any) => {
      if (x !== item) {
        x.isOpen = false;
      }
    });
    item.isOpen = !item.isOpen;

    this.hoveredHeader = item.title;
    if (item.url_link) {
      if (item.url_link === 'Public/FollowUp.aspx') {
        const selectedActivity = localStorage.getItem('selectedActivity');
        const selectedActTyp = localStorage.getItem('selectedActTyp');
        if (!selectedActivity || selectedActivity.trim() === '') {
          if (!selectedActivity) {
            this.showSuccessPopup = false;
            setTimeout(() => {
              this.popupMessage = "First Select Activity Number";
              this.isErrorPopup = true;
              this.showSuccessPopup = true;
            }, 100);
            return;
          }
          return;
        }
        if (selectedActTyp !== 'F') {
          if (selectedActTyp) {
            this.showSuccessPopup = false;
            setTimeout(() => {
              this.popupMessage = "Request is not allowed for FollowUp";
              this.isErrorPopup = true;
              this.showSuccessPopup = true;
            }, 100);
            return;
          }
          return;
        }
      }
      const routePath = this.mapTitleToRoute(item.url_link, item.obj);
      if (routePath) {
        this.router.navigate([routePath]).then(() => this.closeAllDropdowns());
      }
    }
  }
  onChildClick(event: Event, child: any, parentItem: any) {
    event.preventDefault();
    this.object = child.obj ?? '';
    localStorage.setItem('breadcrumb', this.object);

    const routePath = this.mapTitleToRoute(child.url_link, child.obj);
    if (routePath) {
      this.router.navigate([routePath]).then(() => this.closeAllDropdowns());
    }
  }
  onSubChild(event: Event, subChild: any, parentItem: any, child: any): void {
    event.preventDefault();

    const routePath = this.mapTitleToRoute(subChild.url_link, subChild.obj);
    if (routePath) {
      this.router.navigate([routePath]).then(() => {
        subChild.isOpen = false;
        parentItem.isOpen = false;
      });
    } else {
      console.warn('Route not found for url:', subChild.url_link);
    }
  }
  mapTitleToRoute(urlLink: string, obj: string): string {
    debugger
    if (!urlLink) return '';
    this.object = obj;
    localStorage.setItem('breadcrumb', this.object);
    const cleanedTitle = urlLink.replace(/\[\s*(.*?)\s*\]/g, '[$1]');
    const normalizedTitle = cleanedTitle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9&\[\]]+/g, '-')   // alphanum, [ ], &
      .replace(/^-+|-+$/g, '');           // start/end  Remove    
    return `app-${normalizedTitle}`;
  }
  // ⭐ 2️⃣ CHECK IF NEW SESSION CREATED (ASP.NET MASTERPAGE LOGIC)
  checkIfNewSessionCreated() {
    const userId = localStorage.getItem("loginUser");
    const sessionId = localStorage.getItem("SessionID");
    const allow = localStorage.getItem("Multi_Session_Allow");
    if (!userId || !sessionId) return;
    if (allow == "N") return;

    const url = `${environment.apiBaseUrl}/api/Login/IsNewSessionCreated?userId=${userId}&sessionId=${sessionId}`;
    this.http.get(url).subscribe({
      next: (res: any) => {
        if (res.isNew === true) {
          this.showModal = true;
          this.showSuccessPopup = false;
        }
      },
      error: (err) => {
        console.error("Session check error:", err);
      }
    });
  }
  CheckNewSession() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  closeAllDropdowns() {
    this.bsItems.forEach(item => {
      item.isOpen = false;
      item.children?.forEach((child: any) => child.isOpen = false);
    });
  }
  get currentUrl(): string {
    return this.router.url;
  }
  HomeFun() { this.object = ''; this.router.navigateByUrl('app-home'); }
  formatObject(value: string): SafeHtml {
    const words = value.trim().split(' ');
    // if (words.length === 1) {
    //   return this.sanitizer.bypassSecurityTrustHtml(
    //     `<span style="font-size:15px;">${value}</span>`
    //   );
    // }
    const text = `
    <span style="font-size:13px;">
      ${words.map(w => w.toUpperCase()).join(' ')}
    </span>
  `;
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
  addQuickLink(title: string, url: string, obj: string): void {
    if (!title || !url || !obj) {
      return;
    }
    const quickLink: QuickLinkAdd = {
      title: title,
      link: url,
      createdBy: this.loginUser
    };
    const apiUrl = `${environment.apiBaseUrl}/api/QuickLink_Menu`;
    this.http.post(apiUrl, quickLink).subscribe({
      next: (response: any) => {
        let message = response?.message || '';
        let statusCode = message.split(';')[0]?.trim(); // "1" ya "0"
        let actualMessage = message.split(';')[1]?.trim() || message;
        this.popupMessage = actualMessage;
        this.isErrorPopup = (statusCode === '0'); // agar 0 ho to error
        this.showSuccessPopup = true;
        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
      },
    });
  }
  btnLog() {
    localStorage.removeItem('ConsoleResetMode');
    localStorage.removeItem('ConsolePagedData');
    localStorage.removeItem('ConsoleCurrentPage');
    localStorage.removeItem('ConsoleGridData');
    localStorage.removeItem('loginUser');
    localStorage.removeItem('ConsoleIsVisible');
    sessionStorage.clear();
    localStorage.setItem('ConsoleResetMode', 'Y'); // header hide ke liye

    this.router.navigateByUrl('/login');
  }
}
