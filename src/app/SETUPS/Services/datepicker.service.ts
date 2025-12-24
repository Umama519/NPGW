import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {

  constructor() { }

  public initializeDatepicker(selector: string): void {
    ($(selector) as any).datepicker({
      dateFormat: 'dd-mm-yy',
      changeYear: true,
      yearRange: '1970:2035',
      changeMonth: true,
      showAnim: 'fadeIn',
      duration: 'fast',
      showOtherMonths: true,
      selectOtherMonths: true,

      beforeShow: (input: any, inst: any) => {
        setTimeout(() => this.styleDatepicker(inst), 10);
      },

      onChangeMonthYear: (year: number, month: number, inst: any) => {
        setTimeout(() => this.styleDatepicker(inst), 10);
      }
    });
  }

  private styleDatepicker(inst: any): void {
    inst.dpDiv.css({
      background: '#ffffff',
      border: '2px solid #10486B',
      borderRadius: '8px',
      padding: '4px',
      boxShadow: '0 3px 8px rgba(10, 121, 233, 0.2)',
      fontSize: '11px',
      width: '210px',
    });

    inst.dpDiv.find('.ui-datepicker-header').css({
      backgroundColor: '#10486B',
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
      background: '#10486B',
      color: '#fff',
      fontWeight: 'bold'
    });

    (inst.dpDiv.find('.ui-datepicker-prev, .ui-datepicker-next') as any).css({
      'background-image': 'none',
      'font-weight': 'bold',
      'font-size': '18px',
      'background': '#10486B',
      'border': 'none'
    });

    (inst.dpDiv.find('.ui-datepicker-prev') as any).html('⬅️');
    (inst.dpDiv.find('.ui-datepicker-next') as any).html('➡️');
  }
}
