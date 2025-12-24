import { Component, Input, Output, EventEmitter, HostListener, forwardRef, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'app-global-lov',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-lov.component.html',
  styleUrls: ['./global-lov.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GlobalLovComponent),
      multi: true
    }
  ]
})
export class GlobalLovComponent implements ControlValueAccessor, OnChanges {
  @Input() items: any[] = [];
  @Input() displayField: string = '';
  @Input() valueField: string = 'code';
  @Input() disabled: boolean = true;
  @Input() inputClass: string = 'lov-input';
  @Output() selected = new EventEmitter<any>();
  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('lovInput') lovInput!: ElementRef;
  static openedLov: GlobalLovComponent | null = null;
  search = '';
  show = false;
  controlValue = '';
  private preventClose: boolean = false;
  private isMouseDownOnOption: boolean = false;
  private _value: any;
  private onChange: any = () => { };
  private onTouched: any = () => { };
  highlightIndex: number = -1;
  openDropdown() {
    if (this.disabled) return;
    if (this.show) return;

    this.showDropdown();
  }
  private showDropdown() {
    if (GlobalLovComponent.openedLov && GlobalLovComponent.openedLov !== this) {
      GlobalLovComponent.openedLov.closeDropdown();
    }
    this.show = true;
    this.search = '';
    this.highlightIndex = -1;
    GlobalLovComponent.openedLov = this
    setTimeout(() => {
      if (this.searchBox?.nativeElement) {
        this.searchBox.nativeElement.focus();
        this.searchBox.nativeElement.select();
      }
    }, 50);
  }
  closeDropdown() {
    this.show = false;
    if (GlobalLovComponent.openedLov === this) {
      GlobalLovComponent.openedLov = null;
    }
  }
  preventBlur() {
    this.preventClose = true;
  }
  onSearchBlur() {
    setTimeout(() => {
      if (!this.preventClose && !this.isMouseDownOnOption) {
        this.closeDropdown();
      }
      this.preventClose = false;
    }, 100);
  }
  onOptionMouseDown(event: MouseEvent) {
    this.isMouseDownOnOption = true;
    setTimeout(() => {
      this.isMouseDownOnOption = false;
    }, 200);
  }
  private scrollToHighlight() {
    if (this.highlightIndex < 0 || !this.scrollContainer || !this.scrollContainer.nativeElement) {
      return;
    }
    const options = this.scrollContainer.nativeElement.querySelectorAll('.lov-option');
    if (options.length > this.highlightIndex) {
      options[this.highlightIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'auto'
      });
    }
  }
  highlightNext() {
    const list = this.filteredItems();
    if (list.length === 0) return;
    this.highlightIndex = (this.highlightIndex + 1) % list.length;
    this.scrollToHighlight();
  }
  highlightPrev() {
    const list = this.filteredItems();
    if (list.length === 0) return;
    this.highlightIndex = (this.highlightIndex - 1 + list.length) % list.length;
    this.scrollToHighlight();
  }
  onSearchKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightNext();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightPrev();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const items = this.filteredItems();
      if (items.length > 0 && this.highlightIndex >= 0) {
        this.choose(items[this.highlightIndex]);
      }
    }
    if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }
  handleInputKey(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.closeDropdown();
      return;
    }
    if (!this.show && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter')) {
      event.preventDefault();
      this.showDropdown();
      return;
    }
    if (this.show && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter')) {
      event.stopPropagation();
      event.preventDefault();
      if (event.key === 'ArrowDown') {
        this.highlightNext();
      } else if (event.key === 'ArrowUp') {
        this.highlightPrev();
      } else if (event.key === 'Enter') {
        const items = this.filteredItems();
        if (items[this.highlightIndex]) {
          this.choose(items[this.highlightIndex]);
        }
      }
    }
  }
  choose(item: any) {
    this.controlValue = item[this.displayField];
    this.value = item[this.valueField];
    this.selected.emit(item);
    this.closeDropdown();
  }
  @HostListener('document:click', ['$event'])
  closeOnClickOutside(event: any) {
    if (!event.target.closest('.lov-container')) {
      this.closeDropdown();
    }
  }
  get showSearchBox(): boolean {
    return this.items && this.items.length > 7;
  }
  get dropdownMaxHeight(): string {
    const count = this.items ? this.items.length : 0;
    const rows = count <= 7 ? count : 7;
    return `${rows * 40}px`;
  }
  get value(): any {
    return this._value;
  }
  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.updateDisplayValue();
      this.onChange(val);
      this.onTouched();
    }
  }
  writeValue(value: any): void {
    this._value = value;
    this.updateDisplayValue();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      if (this.disabled) {
        this.closeDropdown();
      }
    }
    if (changes['items'] && this._value !== undefined) {
      this.updateDisplayValue();
    }
  }

  private updateDisplayValue() {
    if (!this._value) {
      this.controlValue = '';
      return;
    }
    if (typeof this._value === 'string') {
      const selectedItem = this.items?.find(
        x => x[this.valueField] === this._value
      );
      this.controlValue = selectedItem ? selectedItem[this.displayField] : this._value;
      return;
    }
    const selected = this.items?.find(
      x => x[this.valueField] === this._value
    );
    this.controlValue = selected ? selected[this.displayField] : '';
  }
  filteredItems() {
    if (!this.items) return [];
    return this.items.filter(x =>
      x[this.displayField]?.toLowerCase().includes(this.search.toLowerCase())
    );
  }
}