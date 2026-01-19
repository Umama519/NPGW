import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './SETUPS/Service/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'app-change-password',
    loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent)
  },
  {
    path: 'app-PasswordChangeAlert',
    loadComponent: () => import('./PasswordChangeAlert/PasswordChangeAlert/PasswordChangeAlert.component').then(m => m.PasswordChangeAlertComponent)
  },
  {
    path: 'app-cares-error',
    loadComponent: () => import('./cares-error/cares-error.component').then(m => m.CaresErrorComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'app-public-followup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./follow-up/follow-up.component').then(m => m.FollowUpComponent)
      },
      {
        path: 'app-public-porting-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/console/console.component').then(m => m.ConsoleComponent)
      },
      {
        path: 'app-public-manualnprsending-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/manualnpr-sending/manualnpr-sending.component').then(m => m.ManualNprSendingComponent)
      },
      {
        path: 'app-public-nprequest-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/np-request/np-request.component').then(m => m.NpRequestComponent)
      },
      {
        path: 'app-public-nprequestupdate-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/npr-request-update/npr-request-update.component').then(m => m.NpRequestupdateComponent)
      },
      {
        path: 'app-npr-invoice',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/npr-invoice/npr-invoice.component').then(m => m.NPRINVOICEComponent)
      },
      {
        path: 'app-public-departmentsetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/department-setup/department-setup.component').then(m => m.DepartmentSetupComponent)
      },
      {
        path: 'app-public-operatorsetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/operator-setup/operator-setup.component').then(m => m.OperatorSetupComponent)
      },
      {
        path: 'app-public-rejectholdcodesetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/rejection-&-hold-code-setup/reject-hold-code-setup.component').then(m => m.RejectHoldCodeSetupComponent)
      },
      {
        path: 'app-public-timer-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/timers-setup/timer-setup.component').then(m => m.TimerSetupComponent)
      },
      {
        path: 'app-public-location-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/location-setup/location-setup.component').then(m => m.LocationSetupComponent)
      },
      {
        path: 'app-lsmsre-message',
        canActivate: [authGuard],
        loadComponent: () => import('./LSMSReMessage/lsmsre-message/lsmsre-message.component').then(m => m.LSMSReMessageComponent)
      },
      {
        path: 'app-re-message',
        canActivate: [authGuard],
        loadComponent: () => import('./re-message/re-message.component').then(m => m.ReMessageComponent)
      },
      {
        path: 'app-public-dynamicsetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/basic-configuration/dynamic-setup.component').then(m => m.DynamicSetupComponent)
      },
      {
        path: 'app-public-nprclosingprocess-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/nprclosingprocess/nprclosingprocess.component').then(m => m.NPRCLOSINGPROCESSComponent)
      },
      {
        path: 'app-public-nprbulkholdresponse-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/npr-hold-bulk-process/npr-hold-bulk-process.component').then(m => m.NprHoldBulkProcessComponent)
      },
      {
        path: 'app-public-nprmanualbulkprocess-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/npr-manual-bulk-process/npr-manual-bulk-process.component').then(m => m.NprManualBulkProcessComponent)
      },
      {
        path: 'app-public-holidayssetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/holidays-setup/holiday-setup.component').then(m => m.HolidaySetupComponent)
      },
      {
        path: 'app-public-rolesetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/user-role-access-setup/user-role-access-setup.component').then(m => m.UserRoleAccessSetupComponent)
      },      
      {
        path: 'app-public-numbering-plan-setup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/numbering-plan-setup/numbering-plan-setup.component').then(m => m.NumberingPlanSetupComponent)
      },
      {
        path: 'app-public-xmlpacketobjectsetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/soap-message-object-definition/xmlpacket-object-setup.component').then(m => m.XMLPacketObjectSetupComponent)
      },
      {
        path: 'app-public-xmlpacketmessagesetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/soap-messge-type-definition/xmlpacket-type-definition.component').then(m => m.XMLPacketTypeDefinitionComponent)
      },
      {
        path: 'app-public-xmlpacketdefinition-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/soap-message-format-definition/soap-message-format-definition.component').then(m => m.SoapMessageFormatDefinitionComponent)
      },
      {
        path: 'app-public-userprofilesetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/user-profile-setup/user-profile-setup.component').then(m => m.UserProfileSetupComponent)
      },
      {
        path: 'app-public-porting-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/console/console.component').then(m => m.ConsoleComponent)
      },
      {
        path: 'app-public-alaramsetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/alarm-setup/alarm-setup.component').then(m => m.AlarmSetupComponent)
      },
      {
        path: 'app-public-useraccessrole-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/role-assign-action/role-assign-action.component').then(m => m.RoleAssignActionComponent)
      },
      {
        path: 'app-public-npcancel-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/np-cancel/np-cancel.component').then(m => m.npcancelComponent)
      },
      {
        path: 'app-public-npdisconnect-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/np-disconnect/np-disconnect.component').then(m => m.npdisconnectComponent)
      },
      {
        path: 'app-public-numberprefixsetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/number-prefix-setup/number-prefix-setup.component').then(m => m.NumberPrefixSetupComponent)
      },
      {
        path: 'app-public-pinpot-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/pinpotview/pinpotview.component').then(m => m.PINPOTVIEWComponent)
      },
      {
        path: 'app-public-usergroupsetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/user-group-setup/user-group-setup.component').then(m => m.UserGroupSetupComponent)
      },
      {
        path: 'app-home',
        canActivate: [authGuard],
        loadComponent: () => import('./home/home.component').then(m => m.HOMEComponent)
      },
      {
        path: 'app-public-workflowtab-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/workflow-tabs/workflow-tabs.component').then(m => m.WorkflowTabsComponent)
      },
      {
        path: 'app-public-workflow-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/Workflow Definition [DeActivation]/workflowdefinitiondeactivation.component').then(m => m.WorkflowdefinitiondeactivationComponent)
      },
      {
        path: 'app-workflow.aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/user-group-setup/user-group-setup.component').then(m => m.UserGroupSetupComponent)
      },
      {
        path: 'app-public-actionresponsesetup-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUPS/action-response-definition/action-response-definition.component').then(m => m.ActionResponseDefinitionComponent)
      },
      
      //Reports
      {
        path: 'app-public-nprmanualbulkprocess-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUP/npr-manual-bulk-process/npr-manual-bulk-process.component').then(m => m.NprManualBulkProcessComponent)
      },
      {
        path: 'app-public-nprbulkholdresponse-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUP/npr-hold-bulk-process/npr-hold-bulk-process.component').then(m => m.NprHoldBulkProcessComponent)
      },
      {
        path: 'app-public-nprbulkcurrentstatus-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUP/npr-current-bulk-status/npr-current-bulk-status.component').then(m => m.NprCurrentBulkStatusComponent)
      },
      {
        path: 'app-public-nprbulkresendresponse-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUP/npr-resend-bulk-response/npr-resend-bulk-response.component').then(m => m.NprResendBulkResponseComponent)
      },
      {
        path: 'app-public-nprbulkresendsolicitederror-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUP/npr-resend-solerr-response/npr-resend-solerr-response.component').then(m => m.NprResendSolerrResponseComponent)
      },
      {
        path: 'app-public-nprbulkdisconnectprocess-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUP/npr-disconnect-bulk-process/npr-disconnect-bulk-process.component').then(m => m.NprDisconnectBulkProcessComponent)
      },
      {
        path: 'app-public-nprbulkworkflowcloseprocess-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUP/npr-close-bulk-process/npr-close-bulk-process.component').then(m => m.NprCloseBulkProcessComponent)
      },
      {
        path: 'app-public-nprequest-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SETUP/npr-request-report/npr-request-report.component').then(m => m.NprRequestReportComponent)
      },
      {
        path: 'app-public-portinreport-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/port-in-report/port-in-report.component').then(m => m.PortInReportComponent)
      },
      {
        path: 'app-public-portoutreport-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/port-out-report/port-out-report.component').then(m => m.PortOutReportComponent)
      },
      {
        path: 'app-public-portinoutdetail-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/port-inout-det-report/port-inout-det-report.component').then(m => m.PortInoutDetReportComponent)
      },
      {
        path: 'app-public-currentrejectreport-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/current-rejection-report/current-rejection-report.component').then(m => m.CurrentRejectionReportComponent)
      },
      {
        path: 'app-public-rejectionhisreport-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/rejection-history-report/rejection-history-report.component').then(m => m.RejectionHistoryReportComponent)
      },
      {
        path: 'app-public-rejectbydonor-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/reject-by-donor-report/reject-by-donor-report.component').then(m => m.RejectByDonorReportComponent)
      },
      {
        path: 'app-public-portinghistory-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/porting-history-report/porting-history-report.component').then(m => m.PortingHistoryReportComponent)
      },
      {
        path: 'app-report-financereport-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/finance-report/finance-report.component').then(m => m.FinanceReportComponent)
      },
      {
        path: 'app-public-solicitederrreport-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/solicited-error-report/solicited-error-report.component').then(m => m.SolicitedErrorReportComponent)
      },
      {
        path: 'app-public-nprcancel-rpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./ACTIVITY REPORTS/nprcancel-report/nprcancel-report.component').then(m => m.NprcancelReportComponent)
      },
      {
        path: 'app-public-portinsummary-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SUMMARY REPORTS/port-in-summary-report/port-in-summary-report.component').then(m => m.PortInSummaryReportComponent)
      },
      {
        path: 'app-public-portoutsummary-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SUMMARY REPORTS/port-out-summary-report/port-out-summary-report.component').then(m => m.PortOutSummaryReportComponent)
      },
      {
        path: 'app-public-portinoutsummary-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./SUMMARY REPORTS/port-inout-summary-report/port-inout-summary-report.component').then(m => m.PortInoutSummaryReportComponent)
      },
      {
        path: 'app-public-totalportoutstatus-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./INDUSTRY WIDE REPORTS/total-portout-status-report/total-portout-status-report.component').then(m => m.TotalPortoutStatusReportComponent)
      },
      {
        path: 'app-public-totalportinstatusrpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./INDUSTRY WIDE REPORTS/total-portin-status-report/total-portin-status-report.component').then(m => m.TotalPortinStatusReportComponent)
      },
      {
        path: 'app-public-portingstatusreport-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./INDUSTRY WIDE REPORTS/porting-status-report/porting-status-report.component').then(m => m.PortingStatusReportComponent)
      },
      {
        path: 'app-public-iwportinghistory-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./INDUSTRY WIDE REPORTS/iw-porting-history-report/iw-porting-history-report.component').then(m => m.IwPortingHistoryReportComponent)
      },
      {
        path: 'app-report-lsms-query-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./LOG REPORTS/lsms-report/lsms-report.component').then(m => m.LsmsReportComponent)
      },
      {
        path: 'app-report-npcrecrpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./LOG REPORTS/npc-receiving-report/npc-receiving-report.component').then(m => m.NpcReceivingReportComponent)
      },
      {
        path: 'app-report-npcsendingrpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./LOG REPORTS/npc-sending-report/npc-sending-report.component').then(m => m.NpcSendingReportComponent)
      },
      {
        path: 'app-report-npcsoapsendingrpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./LOG REPORTS/npc-soap-sending-aging-report/npc-soap-sending-aging-report.component').then(m => m.NpcSoapSendingAgingReportComponent)
      },
      {
        path: 'app-report-bussinesshourrpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./LOG REPORTS/business-hours-report/business-hours-report.component').then(m => m.BusinessHoursReportComponent)
      },
      {
        path: 'app-report-caresloggingdatarec-rpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./LOG REPORTS/cares-log-report/cares-log-report.component').then(m => m.CaresLogReportComponent)
      },
      {
        path: 'app-public-dailyconsolestatus-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./REPORTS/daily-console-report/daily-console-report.component').then(m => m.DailyConsoleReportComponent)
      },
      {
        path: 'app-report-sysintegrationstatus-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./REPORTS/integration-status-report/integration-status-report.component').then(m => m.IntegrationStatusReportComponent)
      },
      {
        path: 'app-public-t5log-rpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./REPORTS/t5-log-report/t5-log-report.component').then(m => m.T5LogReportComponent)
      },
      {
        path: 'app-public-t5logdiff-rpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./REPORTS/t5-log-difference-report/t5-log-difference-report.component').then(m => m.T5LogDifferenceReportComponent)
      },
      {
        path: 'app-public-useraction-rpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./REPORTS/user-action-report/user-action-report.component').then(m => m.UserActionReportComponent)
      },
      {
        path: 'app-report-pmd-msg-log-rpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./REPORTS/pmd-log-report/pmd-log-report.component').then(m => m.PmdLogReportComponent)
      },
      {
        path: 'app-forms-nprinvoicesearch1-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./REPORTS/npr-invoice-report/npr-invoice-report.component').then(m => m.NprInvoiceReportComponent)
      },
      {
        path: 'app-report-mnpaction-rpt-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./REPORTS/mnp-action-report/mnp-action-report.component').then(m => m.MnpActionReportComponent)
      },
      {
        path: 'app-public-nprmanuallogreport-aspx',
        canActivate: [authGuard],
        loadComponent: () => import('./TRANSACTION/nprmanual-log-report/nprmanual-log-report.component').then(m => m.NPRManualLogReportComponent)
      },
    ]
  }
];
