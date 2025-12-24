import {
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  ViewContainerRef,
  inject,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { loaderService } from '../SETUPS/Service/loaderService';

@Component({
  selector: 'app-lov-dropdown',
  standalone: true,
  imports: [CommonModule], // 👈 modules/components only here
  templateUrl: './lov-dropdown.component.html',
  styleUrls: ['./lov-dropdown.component.css']
})
export class LovDropdownComponent {
 @Input() items: any[] = [];
  @Input() labelKey: string = 'descs';
  @Input() placeholder: string = 'Search...';
  @Output() select = new EventEmitter<any>();
  constructor(public loaderService: loaderService) {}
  searchQuery: string = '';
  filteredList: any[] = [];
  showDropdown: boolean = false;

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
    this.filteredList = [...this.items];
  }

  onInputChange(event: any): void {
    this.searchQuery = event.target.value;
    this.filteredList = this.items.filter(item =>
      item[this.labelKey]?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectItem(item: any): void {
    this.searchQuery = item[this.labelKey];
    this.select.emit(item);
    this.showDropdown = false;
  }

}