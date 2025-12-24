import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationService {

  // ✅ Global default values
  defaultItemsPerPage = 18;       // har component me default
  defaultWindowSize = 10;          // page number window size

  // Return sliced data for the selected page
  getPagedData(data: any[], currentPage: number, itemsPerPage?: number) {
    const ipp = itemsPerPage ?? this.defaultItemsPerPage;
    const start = (currentPage - 1) * ipp;
    const end = start + ipp;
    return data.slice(start, end);
  }

  // Total pages
  getTotalPages(totalItems: number, itemsPerPage?: number): number {
    const ipp = itemsPerPage ?? this.defaultItemsPerPage;
    return Math.ceil(totalItems / ipp);
  }

  // Pagination numbers (window like 1...5)
  getPageNumbers(totalItems: number, currentWindowStart: number, windowSize?: number, itemsPerPage?: number) {
    const ipp = itemsPerPage ?? this.defaultItemsPerPage;
    const ws = windowSize ?? this.defaultWindowSize;
    const totalPages = this.getTotalPages(totalItems, ipp);

    const pages = [];
    const end = Math.min(currentWindowStart + ws - 1, totalPages);

    for (let i = currentWindowStart; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Next window
  nextWindow(totalItems: number, currentWindowStart: number, windowSize?: number, itemsPerPage?: number) {
    const ipp = itemsPerPage ?? this.defaultItemsPerPage;
    const ws = windowSize ?? this.defaultWindowSize;
    const totalPages = this.getTotalPages(totalItems, ipp);
    if (currentWindowStart + ws <= totalPages) return currentWindowStart + ws;
    return currentWindowStart;
  }
  // Go to last window
  lastWindow(totalItems: number, windowSize?: number, itemsPerPage?: number) {
    const ipp = itemsPerPage ?? this.defaultItemsPerPage;
    const ws = windowSize ?? this.defaultWindowSize;

    const totalPages = Math.ceil(totalItems / ipp);

    // last window always totalPages - ws + 1
    let start = totalPages - ws + 1;
    if (start < 1) start = 1;
    return start;
  }

  // Previous window
  prevWindow(currentWindowStart: number, windowSize?: number) {
    const ws = windowSize ?? this.defaultWindowSize;
    if (currentWindowStart - ws >= 1) return currentWindowStart - ws;
    return currentWindowStart;
  }
}
