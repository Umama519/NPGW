import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
export interface UserGet {
  assigN_TO: string,
  recipient: string,
  cell: string,
  sendReceived: string,
  donor: string,
  activity: string,
  completion: string,
  arrivaldate: string,
  portid: string,
  dueDate: string,
}
declare var $: any;
@Component({
  selector: 'app-daily-console-status',
    standalone: true,  

  imports: [CommonModule, FormsModule],
  templateUrl: './daily-console-status.component.html',
  styleUrl: './daily-console-status.component.css'
})
export class DailyConsoleStatusComponent {

  constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2) { }
  RejectGet: UserGet[] = [];
  FormDate: string = '';
  ToDate: String = '';
  PortID: String = '';
  Mobile: String = '';
  Action: any[] = [];
  selectedOperatorId: string = '';
  selectedProduct: string = '%';  // ALL ko default selected banata hai
  UserID: string[] = []; // For storing UserID values
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  selectedUserID: any = '';
  defaultUserID: string = '';  // <- Ye first value store karega
  participantNames: any[] = []; // Stores one column (e.g., 'name')

  // Stores Action descriptions
  ngOnInit(): void {
    const tab = this.el.nativeElement.querySelector('#table')
    
  }

  ngAfterViewInit(): void {
    initializeDatepicker('#FromDate');
    initializeDatepicker('#ToDate');


    function initializeDatepicker(selector: string) {
      $(selector).datepicker({
        dateFormat: 'dd-mm-yy',
        changeYear: true,
        yearRange: '1970:2035',
        changeMonth: true,
        showAnim: 'fadeIn',
        duration: 'fast',
        showOtherMonths: true,
        selectOtherMonths: true,

        beforeShow: function (input: any, inst: any) {
          setTimeout(() => styleDatepicker(inst), 10);
        },

        onChangeMonthYear: function (year: number, month: number, inst: any) {
          setTimeout(() => styleDatepicker(inst), 10); // Reapply style
        }
      });
    }

    function styleDatepicker(inst: any) {
      inst.dpDiv.css({
        background: '#ffffff',
        border: '2px solid #007bff',
        borderRadius: '10px',
        padding: '6px',
        boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)',
        fontSize: '13px'
      });

      inst.dpDiv.find('.ui-datepicker-header').css({
        backgroundColor: '#007bff',
        color: '#ffffff',
        padding: '8px 0',
        fontWeight: 'bold',
        borderRadius: '8px 8px 0 0',
        textAlign: 'center'
      });

      inst.dpDiv.find('td, th').css({
        padding: '2px',
        height: '24px',
        width: '24px',
        textAlign: 'center'
      });

      inst.dpDiv.find('.ui-state-default').css({
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        color: '#212529'
      });

      inst.dpDiv.find('.ui-state-hover').css({
        background: '#ffc107',
        color: '#000'
      });

      inst.dpDiv.find('.ui-state-active').css({
        background: '#007bff',
        color: '#fff',
        fontWeight: 'bold'
      });

      // **Left and Right Arrows (Prev/Next) Color White**
      inst.dpDiv.find('.ui-datepicker-prev, .ui-datepicker-next').css({
        color: '#ffffff !important', // Force white color for arrows
        background: 'transparent !important', // Transparent background
        border: 'none !important', // Remove border
        fontWeight: 'bold !important', // Bold arrows
        fontSize: '16px !important' // Optional: Adjust font size
      });
    }
  }

  // Fetch the user rights report based on selected UserID
  Fetch() {
    debugger;
    const txt_Frmdate = this.el.nativeElement.querySelector('#FromDate').value;     // formdate
    const txt_Todate = this.el.nativeElement.querySelector('#ToDate').value;        // todate
    const PortID = this.el.nativeElement.querySelector('#PortID').value;      // acttype
    const Mobile = this.el.nativeElement.querySelector('#Mobile').value;      // acttype
    const table = this.el.nativeElement.querySelector('#table');    // formdate    

    const url = `http://132.147.160.110:5111/api/DailyConsoleStatus?mob=${Mobile}&portid=${PortID}&formdate=${txt_Frmdate}&todate=${txt_Todate}`;
    document.getElementById('loader')!.style.display = 'block';

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.RejectGet = res;
          this.GridData = res; // Save all data in GridData
          this.filteredData = res; // In
          document.getElementById('loader')!.style.display = 'none';
          if (table) table.style.display = 'table';

        } else {
          document.getElementById('loader')!.style.display = 'none';
          if (table) table.style.display = 'none';
        }
      },
      error: (err) => {
        document.getElementById('loader')!.style.display = 'none';
        console.error("Error fetching UserRightReport data:", err);
      }
    });
  }
  Reset() {
    const txt_Frmdate = this.el.nativeElement.querySelector('#FromDate');
    const txt_Todate = this.el.nativeElement.querySelector('#ToDate');
    const PortId = this.el.nativeElement.querySelector('#PortID');
    const Mobile = this.el.nativeElement.querySelector('#Mobile');


    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    if (PortId) PortId.value = '';
    if (Mobile) Mobile.value = '';

    // Optionally reset model values too

    this.FormDate = '';
    this.ToDate = '';

    this.selectedUserID = this.defaultUserID;  // pehla option wapas select ho jayega

    this.RejectGet = [];



  }
}