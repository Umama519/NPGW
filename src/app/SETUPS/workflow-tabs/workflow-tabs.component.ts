import { Component, OnInit, provideExperimentalCheckNoChangesForDebug } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowService } from '../../services/workflow.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-public-workflowtab-aspx',
  templateUrl: './workflow-tabs.component.html',
  styleUrls: ['./workflow-tabs.component.css'],
  imports: [CommonModule, MatTabsModule],
  providers: [WorkflowService]
})
export class WorkflowTabsComponent implements OnInit {
  tabs: any[] = [];       // Tabs ka data
  gridData: any[] = [];   // Grid ka data
  activeTab: string = '';
  activeTabPF: string = '';
  wfId: string = '';
  Index: any;
  constructor(private workflowService: WorkflowService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.wfId = params['pf'] || null;
    this.loadTabs();
  });
}
loadTabs() {
  this.workflowService.getTabs().subscribe(data => {
    this.tabs = data || [];

    if (this.tabs.length > 0) {

      let index = 0;

      if (this.wfId) {
        const foundIndex = this.tabs.findIndex(t => t.pf == this.wfId);
        index = foundIndex !== -1 ? foundIndex : 0;
      }

      this.activeTabPF = this.tabs[index].pf;
      this.activeTab = this.tabs[index].tabName;

      this.loadData(this.activeTabPF);
      this.onTabChange(index);
    }
  });
}

  // loadTabs() {
  //   this.workflowService.getTabs().subscribe(data => {
  //     this.tabs = data || [];
  //     if (this.tabs.length > 0) {
  //       this.activeTabPF = this.tabs[0].pf;
  //       this.activeTab = this.tabs[0].tabName;
  //       this.loadData(this.activeTabPF);
  //       this.onTabChange(0);
  //     }
  //   });
  // }
  onTabChange(index: number) {
    debugger;
    this.activeTab = this.tabs[index].tabName;
    this.activeTabPF = this.tabs[index].pf;
    this.loadData(this.activeTabPF);
  }

  loadData(pf: string) {
    if (!pf) {
      console.warn('PF id undefined, API call skipped.');
      return;
    }

    this.workflowService.getWorkflowData(pf).subscribe({
      next: (data) => {
        this.gridData = data;
      },
      error: (err) => {
        console.error('Error loading grid data:', err);
      }
    });
  }
  formatCell(value: any): string {
    if (value === null || value === undefined) return '';

    if (typeof value === 'object') {
      if (Object.keys(value).length === 0) return '';

      return Object.values(value).join(' | ');
    }

    return value.toString();
  }
  goToForm(value: any) {
    console.log("Clicked WF ID:", value);
    debugger;
    this.router.navigate(['/app-public-workflow-aspx'], { queryParams: { wfId: value, pf: this.activeTabPF } });
  }
  getColumns(item: any): string[] {
    // return item ? Object.keys(item) : [];
    return item ? Object.keys(item).slice(1) : [];
  }

  addNew(pf: any) {
    debugger;
    this.router.navigate(['/app-public-workflow-aspx'], { queryParams: { pf: this.activeTabPF } });
  }
}
