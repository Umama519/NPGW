import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Renderer2, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { ExcelExportService } from 'app/services/excel-export.service';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
import Chart from 'chart.js/auto';
import { ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ArcElement, Tooltip, Legend);
Chart.register(ChartDataLabels);

export interface IWPorting {
  fromdate: string;
  todate: string;
  datafor: string;
  recepient: string;
  warid: string;
  ufone: string;
  telenor: string;
  mobilink: string;
  insta: string;
  zong: string;
  paktel: string;
  color: string;
  pos: string;
  Total?: any,
  NetGL?: any,
  Pin_P?: any,
  NetGL_P?: any
}

declare var $: any;

@Component({
  selector: 'app-public-iwportinghistory-aspx',
    standalone: true,  

  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './iw-porting-history-report.component.html',
  styleUrl: './iw-porting-history-report.component.css'
})

export class IwPortingHistoryReportComponent {
constructor(private http: HttpClient, private el: ElementRef, private renderer: Renderer2, private datepickerService: DatepickerService, private excelService: ExcelExportService) { }
  lovDisabled: boolean = false;  
  IWPorting: IWPorting[] = [];
  FormDate: string = '';
  ToDate: String = ''
  Action: any[] = [];
  rhb_Live: string = 'L';
  selectedOperatorId: string = '';
  selectedProduct: string = 'All';
  selectedReport:  string = 'L';
  selectedExport:  string = 'S';
  UserID: string[] = []; // For storing UserID values
  filteredData: any[] = []; // To ho
  GridData: any[] = [];
  selectedUserID: any = '';
  defaultUserID: string = '';  // <- Ye first value store karega
  participantNames: any[] = []; // Stores one column (e.g., 'name')
  showSuccessPopup: boolean = false;
  isSubmitting: boolean = false;
  isErrorPopup: boolean = false;
  popupMessage: string = '';
  loginUser: string = '';

  dataset: IWPorting[] = [];
  HTotal: number = 0;
  warid = 0;
  ufone = 0;
  telenor = 0;
  mobilink = 0;
  zong = 0;
  insta = 0;
  
  footerNetGL: number = 0;
  footerNetGL_P: string = '0%';
  div_excel = false;

  // Stores Action descriptions
  ngOnInit(): void {
    const tab = this.el.nativeElement.querySelector('#table')
    this.Operator_Lov();
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
  }

  ngAfterViewInit(): void {
    this.datepickerService.initializeDatepicker('#txt_FromDate');
    this.datepickerService.initializeDatepicker('#txt_ToDate');
  }
  
  Report = [
    { code: 'L', name: 'Live' },
    { code: 'H', name: 'History' },
    { code: 'B', name: 'Both' }
  ];
  
  Export = [
    { code: 'S', name: 'Screen' },
    { code: 'F', name: 'File' }
  ];

  Operator_Lov() {
    debugger;
    const url = `${environment.apiBaseUrl}/api/Action_LOV_/Operator`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        const hasAll = data.some(p => p.userid === 'ALL' || p.user === 'ALL');

        if (!hasAll) {
          // Only add 'ALL' if it's not in API response
          data.unshift({ user: 'ALL', userid: 'ALL' });
        }

        this.participantNames = data;
        this.selectedOperatorId = 'ALL'; // Set default as 'ALL'
      },
      error: (err) => {
        console.error("Error fetching participants:", err);
      }
    });
  }
  loadData() {
    const txt_FromDate = this.el.nativeElement.querySelector('#txt_FromDate').value;
    const txt_ToDate = this.el.nativeElement.querySelector('#txt_ToDate').value;
    // const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live').checked
    // ? 'L'
    // : this.el.nativeElement.querySelector('#rhb_History').checked
    // ? 'H'
    // : 'B';
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen').checked ? 'S' : 'F';
    this.rhb_Live = this.selectedReport;
    const rhb_Screen = this.selectedExport;
    const table = this.el.nativeElement.querySelector('#table');

    const url = `${environment.apiBaseUrl}/api/IWPortingHistoryReport?fromdate=${txt_FromDate}&todate=${txt_ToDate}&datafor=${this.rhb_Live}&userid=${this.loginUser}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          if (rhb_Screen === 'S') {
            this.dataset  = res;
            this.processData();
            this.IWPorting = this.dataset;
            this.div_excel = true;
            debugger;
            setTimeout(() => {
              this.createPieChart1();
              this.createPieChart2();
              this.createPieChart3();
              this.createPieChart4();
            }, 500);
          } else {
            this.dataset  = res;
            this.processData();
            this.IWPorting = this.dataset;
            this.div_excel = true;
              setTimeout(() => {
                this.export(this.IWPorting, 'excel');
                this.IWPorting = [];
                this.Reset();
                return;
              }, 100); 
            }
          } else {
            this.showSuccessPopup = false;
            setTimeout(() => {
              this.popupMessage = `No Record Found.`;
              this.isErrorPopup = true;
              this.showSuccessPopup = true;
              this.Reset(); 
              this.IWPorting = [];
              return;
            }, 100); 
            document.getElementById('loader')!.style.display = 'none';
            if (table) table.style.display = 'none';
          }
      },
      error: (err) => {
        document.getElementById('loader')!.style.display = 'none';
        console.error("Error fetching UserRightReport data:", err);
        this.Reset();
      }
    });
  }
  Fetch() {    
    debugger;
    this.HTotal = 0;
    this.warid = 0;
    this.ufone = 0;
    this.telenor = 0;
    this.mobilink = 0;
    this.zong = 0;
    this.insta = 0;
    this.loadData();
  }
  Reset() {
    const txt_Frmdate = this.el.nativeElement.querySelector('#txt_FromDate');
    const txt_Todate = this.el.nativeElement.querySelector('#txt_ToDate');
    // const rhb_Screen = this.el.nativeElement.querySelector('#rhb_Screen');
    // const rhb_Live = this.el.nativeElement.querySelector('#rhb_Live');

    if (txt_Frmdate) txt_Frmdate.value = '';
    if (txt_Todate) txt_Todate.value = '';
    // if (rhb_Screen) rhb_Screen.checked = true;
    // if (rhb_Live) rhb_Live.checked = true;
    if (this.selectedReport) this.selectedReport = 'L';
    if (this.selectedExport) this.selectedExport = 'S';
    this.IWPorting = [];    
    this.div_excel = false; 
  }
  getTotal(column: keyof IWPorting): number {
  return this.IWPorting.reduce((sum, row) => {
    const value = Number(row[column] || 0);
    return sum + (isNaN(value) ? 0 : value);
    }, 0);
  }
  processData() {
    debugger;
    this.HTotal = 0;
    this.warid = 0;
    this.ufone = 0;
    this.telenor = 0;
    this.mobilink = 0;
    this.zong = 0;
    this.insta = 0;
    this.footerNetGL = 0;
    this.footerNetGL_P = '';

    this.dataset.forEach(row => {
      const warid = Number(row.warid) || 0;
      const ufone = Number(row.ufone) || 0;
      const telenor = Number(row.telenor) || 0;
      const mobilink = Number(row.mobilink) || 0;
      const zong = Number(row.zong) || 0;
      const insta = Number(row.insta) || 0;
  
      row.Total = warid + ufone + telenor + mobilink + zong + insta;
      
      this.HTotal += row.Total;
      
      this.warid += warid;
      this.ufone += ufone;
      this.telenor += telenor;
      this.mobilink += mobilink;
      this.zong += zong;
      this.insta += insta;
    });

    this.dataset.forEach(row => {
      const GTotal = row.Total || 0;
      let PIN_P = 0, POT_P = 0;
      let NetGL = 0;

      if (GTotal !== 0 && this.HTotal !== 0) {
        PIN_P = Math.round((GTotal / this.HTotal) * 100);

        switch (row.recepient) {
        case 'WARID':
          POT_P = Math.round((this.warid / this.HTotal) * 100);
          NetGL = this.warid - GTotal;
          break;
        case 'UFONE':
          POT_P = Math.round((this.ufone / this.HTotal) * 100);
          NetGL = this.ufone - GTotal;
          break;
        case 'TELENOR':
          POT_P = Math.round((this.telenor / this.HTotal) * 100);
          NetGL = this.telenor - GTotal;
          break;
        case 'MOBILINK':
          POT_P = Math.round((this.mobilink / this.HTotal) * 100);
          NetGL = this.mobilink - GTotal;
          break;
        case 'ZONG':
          POT_P = Math.round((this.zong / this.HTotal) * 100);
          NetGL = this.zong - GTotal;
          break;
        case 'INSTA':
          POT_P = Math.round((this.insta / this.HTotal) * 100);
          NetGL = this.insta - GTotal;
          break;
      }

        debugger;
        row.NetGL = NetGL;
        row.Pin_P = `${PIN_P}%` || '0%';
        row.NetGL_P = `${PIN_P - POT_P}%`  || '0%';
      }
    });
    const totalGL = this.warid + this.ufone + this.telenor + this.mobilink + this.zong + this.insta;
  this.footerNetGL = totalGL - this.HTotal;
  if (totalGL !== 0) {
    const percent = Math.round(((totalGL - this.HTotal) / totalGL) * 100);
    this.footerNetGL_P = `${percent}%`;
  }
    this.IWPorting = this.dataset;
  }

  getPercent(value: number, total: number): string {
  if (!total) return '0%';
    const percent = Math.round((value / total) * 100);
    return `${percent}%`;
  }

  chart: any = null;
  chartRef1: Chart | null = null;
  chartRef2: Chart | null = null;
  chartRef3: Chart | null = null;
  chartRef4: Chart | null = null;
  createPieChart1() {
  debugger;  
  if (this.chartRef1) {
    this.chartRef1.destroy();
  }
  const data = {
    labels: ['UFONE','WARID', 'TELENOR', 'MOBILINK', 'ZONG', 'INSTA'],
    datasets: [{
      label: 'Port-Out Analysis',
      data: [this.dataset[0].Total, this.dataset[1].Total, this.dataset[2].Total, this.dataset[3].Total, this.dataset[4].Total, this.dataset[5].Total],
      backgroundColor: ['#b6abf1ff','#F7B37A', '#7FC6D8', '#FF7878', '#A1C85A', '#b6da37ff'],
      borderWidth: 1
    }]
  };

  const config: any = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true
        }
      }
    }
  };

  const canvas = this.el.nativeElement.querySelector('#operatorPieChart1');
  if (canvas) {
    this.chartRef1 = new Chart(canvas, config);
  }
}

  createPieChart2() {
  // const total = this.ufone + this.telenor + this.mobilink + this.zong;
  if (this.chartRef2) {
    this.chartRef2.destroy();
  }
  const data = {
    labels: ['UFONE','WARID', 'TELENOR', 'MOBILINK', 'ZONG', 'INSTA'],
    datasets: [{
      label: 'Port-In Analysis',
      data: [this.dataset[0].Total, this.dataset[1].Total, this.dataset[2].Total, this.dataset[3].Total, this.dataset[4].Total, this.dataset[5].Total],
      backgroundColor: ['#b6abf1ff','#F7B37A', '#7FC6D8', '#FF7878', '#A1C85A', '#b6da37ff'],
      borderWidth: 1
    }]
  };

  const config: any = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true
        }
      }
    }
  };

  // Check if canvas exists
  const canvas = this.el.nativeElement.querySelector('#operatorPieChart2');
  if (canvas) {
    this.chartRef2 = new Chart(canvas, config);
  }
}
createPieChart3() {
  // const total = this.ufone + this.telenor + this.mobilink + this.zong;
 if (this.chartRef3) {
    this.chartRef3.destroy();
  }
  const data = {
    labels: ['UFONE','WARID', 'TELENOR', 'MOBILINK', 'ZONG', 'INSTA'],
    datasets: [{
      label: 'Port-In Analysis',
      data: [this.dataset[0].Total, this.dataset[1].Total, this.dataset[2].Total, this.dataset[3].Total, this.dataset[4].Total, this.dataset[5].Total],
      backgroundColor: ['#b6abf1ff','#F7B37A', '#7FC6D8', '#FF7878', '#A1C85A', '#b6da37ff'],
      borderWidth: 1
    }]
  };

  const config: any = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true
        }
      }
    }
  };

  // Check if canvas exists
  const canvas = this.el.nativeElement.querySelector('#operatorPieChart3');
  if (canvas) {
    this.chartRef3 = new Chart(canvas, config);
  }
}
 createPieChart4() {
  // const total = this.ufone + this.telenor + this.mobilink + this.zong;
 if (this.chartRef4) {
    this.chartRef4.destroy();
  }
  const data = {
    labels: ['UFONE','WARID', 'TELENOR', 'MOBILINK', 'ZONG', 'INSTA'],
    datasets: [{
      label: 'Port-Out Analysis',
      data: [this.dataset[0].Total, this.dataset[1].Total, this.dataset[2].Total, this.dataset[3].Total, this.dataset[4].Total, this.dataset[5].Total],
      backgroundColor: ['#b6abf1ff','#F7B37A', '#7FC6D8', '#FF7878', '#A1C85A', '#b6da37ff'],
      borderWidth: 1
    }]
  };

  const config: any = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true
        }
      }
    }
  };

  // Check if canvas exists
  const canvas = this.el.nativeElement.querySelector('#operatorPieChart4');
  if (canvas) {
    this.chartRef4 = new Chart(canvas, config);
  }
}

    export(IWPorting:any, file:any) {
      this.IWPorting = IWPorting;
      this.excelService.exportToFile( 
        this.IWPorting, 'Industry Wise Porting History Report', {
          recepient: 'Recepient',
          warid: 'Warid',
          ufone: 'Ufone',
          telenor: 'Telenor',
          mobilink: 'Mobilink',
          zong: 'Zong',
          insta: 'Insta',
          Total: 'Grand Total',
          NetGL: 'Net Gain Loss',
          Pin_P: 'PIN %',
          NetGL_P: 'Net Gain Loss %'
        }, file
      );
    }
}