// src/app/services/date-range.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {

  constructor() { }

  /**
   * Check karta hai ke date range current month mein hai ya history mein
   * @param fromDate string (yyyy-mm-dd)
   * @param toDate string (yyyy-mm-dd)
   * @returns 'L' for Live (current month), 'H' for History (older than 1 month)
   */
  getRhbLive(fromDate: string, toDate: string): 'L' | 'H' {
    // Agar koi date nahi hai to default Live
    if (!fromDate || !toDate) {
      return 'L';
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Invalid date check
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return 'L';
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based

    // Current month ki starting date
    const currentMonthStart = new Date(currentYear, currentMonth, 1);

    // Ek mahina pehle ki starting date
    const oneMonthAgoStart = new Date(currentYear, currentMonth - 1, 1);

    // Agar from ya to date ek mahina purani ya usse pehle ki hai → History
    if (from < oneMonthAgoStart || to < oneMonthAgoStart) {
      return 'H';
    }

    // Baaki sab cases mein Live (including current month aur future)
    return 'L';
  }

  // Bonus: Agar sirf current month check karna ho to ye bhi use kar sakte ho
  isCurrentMonth(dateStr: string): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    return date.getFullYear() === now.getFullYear() &&
           date.getMonth() === now.getMonth();
  }
}