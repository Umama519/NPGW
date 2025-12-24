import { Component } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HOMEComponent {
  loginUser: string = '';
  quickLinks: any[] = [];
  popupMessage: string = '';
  isErrorPopup: boolean = false;
  errmessage: string = ""; // Control visibility of popup
  showSuccessPopup: boolean = false;  // Controls the visibility of the popup
  // ✅ Modal variables
  showModal: boolean = false;
  deleteIndex: number | null = null;

  constructor(
    private layout: LayoutComponent,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Home pe breadcrumb hide karne ke liye layout object clear kar do
    this.layout.object = '';
    localStorage.setItem('breadcrumb', 'HOME');
    window.dispatchEvent(new Event('breadcrumb-updated'));

    // Logged in user
    this.loginUser = localStorage.getItem('loginUser') || 'No user';

    // Quick Links load karna
    this.GetQuickLink();
  }

  // ✅ Navigate karna aur breadcrumb set karna
  goToLink(link: any) {
    if (!link.link) return;

    const cleanedLink = link.link.trim();

    localStorage.setItem('breadcrumb', link.title || '');
    window.dispatchEvent(new Event('breadcrumb-updated'));

    this.router.navigateByUrl(cleanedLink).then(() => {
      window.dispatchEvent(new Event('breadcrumb-updated'));
    });
  }

  // ✅ Fetch Quick Links
  GetQuickLink(): void {
    const url = `${environment.apiBaseUrl}/api/QuickLink_Menu/${this.loginUser}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.quickLinks = data;
        console.log('✅ Quick links loaded:', data);
      },
      error: (err) => {
        console.error('❌ Error fetching quick links:', err);
      }
    });
  }

  // ✅ Modal open karna
  openDeleteModal(index: number): void {
    this.deleteIndex = index;
    this.showModal = true;
  }

  // ✅ Modal close karna
  closeModal(): void {
    this.showModal = false;
    this.deleteIndex = null;
  }

  // ✅ Confirm delete (API call)
  confirmDelete(): void {
    if (this.deleteIndex === null) return;

    const link = this.quickLinks[this.deleteIndex];
    const userId = this.loginUser;
    const urlLink = link.link;

    if (!urlLink) {
      this.popupMessage = 'Invalid link — cannot delete.';
      this.isErrorPopup = true;
      this.showSuccessPopup = true;
      setTimeout(() => this.showSuccessPopup = false, 3000);
      return;
    }

    const encodedLink = encodeURIComponent(urlLink);
    const apiUrl = `${environment.apiBaseUrl}/api/QuickLink_Menu/${userId}/${encodedLink}`;

    this.http.delete(apiUrl, { responseType: 'json' }).subscribe({
      next: (response: any) => {
        let message = response?.message || '';
        if (message.includes(';')) {
          message = message.split(';')[1]?.trim() || message;
        }

        // ✅ Remove from UI
        this.quickLinks.splice(this.deleteIndex!, 1);
        this.closeModal();

        // ✅ Show success popup
        this.popupMessage = message;
        this.isErrorPopup = false;
        this.showSuccessPopup = true;

        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000)
      },
      error: (err) => {
        // ✅ Error message (from API or fallback)
        const message = err.error?.message || 'Failed to delete quick link.';

        this.popupMessage = message;
        this.isErrorPopup = true;
        this.showSuccessPopup = true;

        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);

        this.closeModal();
      }
    });
  }

}
