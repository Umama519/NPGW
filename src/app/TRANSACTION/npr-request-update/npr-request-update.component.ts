import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';
interface CustomerType {
  code: string;
  name: string;
}
@Component({
  standalone: true,
  selector: 'app-public-nprequestupdate-aspx',
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './npr-request-update.component.html',
  styleUrl: './npr-request-update.component.css'
})
export class NpRequestupdateComponent implements OnInit {
  showWaiverFields = false;
  lblWaiverCode = 'Waiver Code';
  public isTariffDisabled: boolean = true;
  public isAccessIdDisabled: boolean = true;
  public isImeiDisabled: boolean = true; // default: disabled
  public lovDisabled: boolean = true;
  public lovDNO: boolean = false;
  public lovCustomer: boolean = false;
  public lovProType: boolean = false;
  public lovCategory: boolean = false;
  public lovnewProductType: boolean = true;
  isnewprodTypeDisabled = false;
  isAssociate1ReadOnly = false;
  isAssociate2ReadOnly = false;
  isNewICCIDReadOnly = false;
  isMobileReadOnly = false;
  isWaiverCodeDisabled = false;
  isOMODisabled = true;
  handsetCharges = 0;
  isWithHS = false; // No selected by default
  loginUser: string = '';
  ddlTariffPlan: string = '-1';
  ddlAccessID: string = '';
  tariffPlanList: any[] = [];   // Tariff dropdown list
  accessList: any[] = [];
  showSecurityDepositFields: boolean = true;
  sdAmountFields: boolean = true;
  wsdFields: boolean = true;
  lineRentFields: boolean = true;
  wlrFields: boolean = true;
  lrAmountFields: boolean = true;
  waiverCodeFields: boolean = true;
  selectedNPRNo: any | null = null;
  selectedMobile: any | null = null;
  selectedAction: any | null = null;
  //lovDisabled: boolean = false;
  mode: 'INSERT' | 'UPDATE' = 'UPDATE';
  popupMessage = '';
  isErrorPopup = false;
  showSuccessPopup = false;
  lblICCIDMessage: string = '';
  lblMessage: string = '';
  uiState = {
    securityDeposit: true,
    lineRent: true,
    lrAmount: false,
    sdAmount: false,
    wsd: false,
    wlr: false,
    showSecurity: false,
    showWLR: false,
    showWSD: false,
    showSDAmount: false,
    showLRAmount: false
  };
  currentProductType = [
    { code: 'R', name: 'Prepaid' },
    { code: 'O', name: 'Postpaid' },
    { code: 'I', name: 'PostPaid with IR' }

  ];
  selectNIC = [
    { code: 'C', name: 'CNIC' },
    { code: 'N', name: 'NIC' },
    { code: 'P', name: 'Passport' },
    { code: 'O', name: 'Other' }
  ];

  readonlyFields = {
    wlr: true,
    wsd: true,
    lovDisabled: true
  };
  lookups: any = {
    waiverCodes: [],
    operators: [],
    dmos: [],
    newProductType: [],
    tariffPlan: [],
    accessIds: [],
    csrs: [],
    donors: []
  };
  viewState = {
    IMSI_ALLOW: '',
    Tarrif_Allow: '',
    Tarrif_Description: '',
    Tarrif_Value: '',
    PREPOST_ALLOW: '',
    Product_code: '',
    afd_fr: '',
    wht_val: '',
    IDTYPE: '',
    Product_code2: ''
  };
  model: any = this.getEmptyModel();
  action: string = '';
  async ngOnInit() {
    debugger
    this.loginUser = localStorage.getItem('loginUser') || 'No user';
    this.selectedNPRNo = localStorage.getItem('selectedNPRNO');
    this.selectedMobile = localStorage.getItem('selectedMobile');
    this.selectedAction = localStorage.getItem('selectedAction');
    this.lookups.operators = false;
    await this.loadHandsetCharges();
    await this.loadLookups();
    await this.updateValues();
    this.mode = 'UPDATE';
    await this.loadForm(this.selectedNPRNo, this.selectedMobile, this.selectedAction);
    await this.fillCSRId();
  }

  getEmptyModel() {
    return {
      prefix: '',
      mobile: '',
      OMO: '',
      DMO: '',
      registerName: '',
      customertype: '',
      email: '',
      baseLocation: '',
      address1: '',
      address2: '',
      address3: '',
      address4: '',
      telRes: '',
      telOff: '',
      ext: '',
      fax: '',
      cnic: '',
      oldNIC: '',
      passport: '',
      otherID: '',
      currentProductType: '',
      newProductType: '',
      tariffPlan: '',
      accessId: '',
      franchiseId: '',
      csrId: '',
      associate1: '',
      associate2: '',
      waiverCode: '',
      lineRent: '',
      securityDeposit: '',
      portFeeAmount: '',
      wsd: '',
      wlr: '',
      handsetCharges: '',
      imei: ''
    };
  }
  async loadLookups() {
    try {
      const op = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/operators`).then(r => r.json());
      if (op?.success) this.lookups.operators = op.data;
      const waiver = await fetch(`${environment.apiBaseUrl}/api/NPRequest/Waiver`).then(r => r.json()).catch(() => null);
      if (waiver?.success) this.lookups.waiver = waiver.data;
      const dmo = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/donors`).then(r => r.json()).catch(() => null);
      if (dmo?.success) this.lookups.dmos = dmo.data;
      const pt = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/producttypes`).then(r => r.json());
      if (pt?.success) this.lookups.newProductType = pt.data;
      const imsiRes = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetImsiFlag`);
      const imsiJson = await imsiRes.json();
      if (imsiJson?.success) {
        const imsi = imsiJson.data[0]?.IMIS_VAL;
        this.viewState.IMSI_ALLOW = imsi;
        if (imsi === 'N') {
          this.model.newICCID = '999999999999';
        } else {
          this.model.newICCID = '';
        }
      }
      const tariffRes = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetTariffData`);
      const tariffJson = await tariffRes.json();
      if (tariffJson?.success) {
        const row = tariffJson.data[0];
        if (row.TARIFF_ALLOW === 'Y') {
          this.viewState.Tarrif_Allow = 'Y';
          this.viewState.Tarrif_Description = row.TARIF_DESC;
          this.viewState.Tarrif_Value = row.TARIF_VAL;
        } else {
          this.viewState.Tarrif_Allow = 'N';
        }
      }
      const prepostRes = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetPrePostVal`);
      const prepostJson = await prepostRes.json();
      if (prepostJson?.success) {
        const prepost = prepostJson.data[0].PREPOST_VAL;
        if (prepost === 'Y') {
          this.lookups.productTypes = [
            { text: '', value: '' },
            { text: 'Post Paid', value: 'O' },
            { text: 'Pre Paid', value: 'R' }
          ];
          this.viewState.PREPOST_ALLOW = 'Y';
        } else {
          this.lookups.productTypes = [
            { text: 'Pre Paid', value: 'R' }
          ];
          this.viewState.PREPOST_ALLOW = 'N';
        }
      }
      if (!this.action) {
        this.updateValues(); // VB ka updatevalues()
        if (this.viewState.Product_code === 'R') {
          let foundIR = false;
          for (let i = 0; i < this.lookups.accessIds.length; i++) {
            const item = this.lookups.accessIds[i];
            if (item.text === 'IR') {
              this.model.accessId = item.value; // select "IR"
              this.model.accessId = true;
              foundIR = true;
              break;
            }
          }
          if (!foundIR) {
            this.model.accessId = false;
            this.model.accessId = this.lookups.accessIds[0]?.value || '';
          }
        } else {
          this.model.accessId = false;
          this.model.accessId = this.lookups.accessIds[0]?.value || '';
        }
      }
      if (this.action) {
        await this.getDutyCal('1');
      }
      await this.loadTariffPlanAndAccess();

    } catch (err) {
      this.showPopup('Lookup load failed', true);
    }
  }
  @ViewChild('custLov') custLov!: GlobalLovComponent;
  @ViewChild('currLov') currLov!: GlobalLovComponent;

  getCustomerTypeLabel(code: string): string {
    code = (code || '').toString().trim().toUpperCase();
    const mapping: { [key: string]: string } = {
      C: 'Company',
      I: 'Individual'
    };
    return mapping[code] || '';
  }
    onCustomerTypeChange(item: any) {    
    this.model.customertype = item.code;
  }
  onCurrentProductChange(item: any) {    
    this.model.currentProductType = item.code;
  }
  async loadForm(npr: string, mobile: string, action: string) {
    try {
      const res = await fetch(
        `${environment.apiBaseUrl}/api/NPRequestupdate/GetNprData?npr=${encodeURIComponent(npr)}&mobile=${encodeURIComponent(mobile)}&action=${encodeURIComponent(action)}`
      );
      const json = await res.json();
      if (!res.ok || !json.success || !json.data || json.data.length === 0) {
        this.showPopup(json?.message || 'No record found', true);
        return;
      }
      const r = json.data[0];
      this.model.NPR = r["NPR_NO"] ?? '';
      const mob = (r["MOB_NO"] ?? '').toString();
      this.model.prefix = mob ? mob.substring(0, 3) : '';
      this.model.mobile = mob ? mob.substring(3) : '';
      this.model.OMO = r["OOPERATOR"] ?? '';
      this.model.dmos = r["DOPERATOR"] ?? '';
      const rawDate = r["DONDUEDATE"];
      if (rawDate) {
        const dateObj = new Date(rawDate);
        if (!isNaN(dateObj.getTime())) {
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          this.model.dob = `${day}-${month}-${year}`;
        } else {
          this.model.dob = '';
        }
      } else {
        this.model.dob = '';
      }
      this.model.waiverCode = r["WAIVERCD1"] ?? '';
      this.model.franchiseId = this.getValue(r["MST_ID"]);
      await this.Get_Base_Location(this.model.mobile);
      
      this.lookups.customertype = [
        { code: 'C', name: 'Company' },
        { code: 'I', name: 'Individual' }
      ];
      const sms = (r["SMS"] ?? '').toString().trim().toUpperCase();
      const selectedCustomerType = this.lookups.customertype.find((x: { code: string; name: string }) =>
        x.code.toUpperCase() === sms
      );
      
      const cprod = (r["CPROD"] ?? '').toString().trim();
      const selectedProdType = this.lookups.newProductType?.find(
        (x: any) => x.PROD_CODE === cprod
      );

      setTimeout(() => {
        
        this.model.customertype = selectedCustomerType?.code || '';

        // Force GlobalLov to update display value
        if (this.custLov) {
          this.custLov.writeValue(this.model.customertype);
        }
        debugger
        this.model.currentProductType = selectedProdType ? selectedProdType.PROD_CODE : '';
        if (this.currLov) {
          this.currLov.writeValue(this.model.currentProductType);
        }

      }, 0); // 50ms ya 100ms delay ensures LOV ready

      if ((r["NPROD"] ?? '').toString().trim() === 'O') {
        if (this.viewState.PREPOST_ALLOW === 'N') {
          this.lookups.newProductType = [
            { PROD_DESC: 'Post Paid', PROD_CODE: 'O' }
          ];
          this.model.newProductType = 'O';
        } else {
          this.model.newProductType = 'O';
          this.viewState.Product_code = 'O';
        }
        this.model.portFeeAmount = this.getNumber(r["PORTFEEAMOUNT"]);
        this.model.portFee = this.getNumber(r["PORTINFEE"]);
        this.model.securityDeposit = this.getNumber(r["SECURITY_DEPOSIT"]);
        this.model.lineRent = this.getNumber(r["LRENT"]);
        this.model.wsd = this.getNumber(r["WAVEINSECURITY"]);
        this.model.wlr = this.getNumber(r["WAVEINLINERENT"]);
        await this.NPRTariffPlan(); // Tariff + Access
        if (this.model.tariffPlan && this.model.tariffPlan !== '-1') {
          const tariffValue = r["TARIFF"] ?? '';
          const tariffFound = this.lookups.tariffPlans.find((t: any) => t.TARIFF11344 === tariffValue);
          if (tariffFound) {
            this.model.tariffPlan = tariffValue;
          }
          await this.FillAccess_Data(tariffValue);
          const accessValue = r["AXESID"] ?? '';
          const accessFound = this.lookups.accessIds.find((a: any) => a.value === accessValue);
          if (accessFound) {
            this.model.accessId = accessValue.accid;
          }
        }
        this.calc();
      } else if ((r["NPRTYPE"] ?? '').toString().trim() === 'R') {
        if (this.viewState.PREPOST_ALLOW === 'N') {
          this.lookups.newProductType = [
            { PROD_DESC: 'Pre Paid', PROD_CODE: 'R' }];
          this.model.newProductType = 'R';
        } else {
          this.model.newProductType = 'R';
          this.viewState.Product_code = 'R';
        }
        this.showSecurityDepositFields = false;
        this.sdAmountFields = false;
        this.wsdFields = false;
        this.lineRentFields = false;
        this.wlrFields = false;
        this.lrAmountFields = false;
        this.model.portFeeAmount = this.getNumber(r["PORTFEEAMOUNT"]);
        this.model.portFee = this.getNumber(r["PORTINFEE"]);
        if (this.viewState.Tarrif_Allow === 'Y') {
          this.lookups.tariffPlans = [{
            DSCR11344: this.viewState.Tarrif_Description,
            TARIFF11344: this.viewState.Tarrif_Value
          }];
          this.isTariffDisabled = true;
          this.model.tariffPlan = this.viewState.Tarrif_Value;
          this.lookups.accessIds = [{ ACCID: '3', ACCNAME: 'IR' }];
          this.isAccessIdDisabled = true;
          const defaultAccess = this.lookups.accessIds.find(
            (a: any) => a.ACCNAME === 'IR'
          );
          if (defaultAccess) {
            this.model.accessId = defaultAccess.ACCID;
          } else if (this.lookups.accessIds.length > 0) {
            this.model.accessId = this.lookups.accessIds[0].ACCID;
          } else {
            this.model.accessId = '';
          }
        } else {
          await this.NPRTariffPlan();
          this.isTariffDisabled = true;
        }
        this.model.total = this.model.portFeeAmount;
      }
      const imsiRes = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetImsiFlag`);
      const imsiJson = await imsiRes.json();
      if (imsiJson?.data?.IMIS_VAL === 'N') {
        this.viewState.IMSI_ALLOW = 'N';
        this.model.newICCID = '999999999999';
      } else {
        this.viewState.IMSI_ALLOW = 'Y';
        this.model.newICCID = this.getValue(r["ICCID"]);
      }
      const oldNicVal = this.getValue(r["OLDNIC"]);
      const newNicVal = this.getValue(r["NEWNIC"]);
      const passportVal = this.getValue(r["PASSP_NO"]);
      const otherIdVal = this.getValue(r["OTHERID"]);
      if (oldNicVal.trim() !== '') {
        this.model.selectNIC = 'N';
        this.model.oldNIC = oldNicVal;
      } else if (newNicVal.trim() !== '') {
        this.model.selectNIC = 'C';
        this.model.cnic = newNicVal;
      } else if (passportVal.trim() !== '') {
        this.model.selectNIC = 'P';
        this.model.passport = passportVal;
      } else if (otherIdVal.trim() !== '') {
        this.model.selectNIC = 'O';
        this.model.otherID = otherIdVal;
      }
      this.model.registerName = r["REGNAM"] ?? '';
      this.model.userName = r["USERID"] ?? '';
      this.model.email = this.getValue(r["EMAIL"]);
      this.model.address1 = this.getValue(r["ADDR1"]);
      this.model.postalcode = this.getValue(r["POSTALCODE"]);
      this.model.address2 = this.getValue(r["ADDR2"]);
      this.model.address3 = this.getValue(r["ADDR3"]);
      this.model.address4 = this.getValue(r["ADDR4"]);
      this.model.city = this.getValue(r["CITY"]);
      this.model.associate1 = this.getValue(r["ASSOCIATE_1"]);
      this.model.associate2 = this.getValue(r["ASSOCIATE_2"]);
      this.model.rejection = this.getValue(r["REJECTION"]);
      this.model.oldICCID = this.getValue(r["OICCID"]);
      this.model.waiverCode = r["WAIVERCD1"] ?? '';
      this.calc();
      this.showField();
      // ===== LAST LINE of loadForm =====
      Promise.resolve().then(() => {
        this.model.customertype = selectedCustomerType?.code || '';

        this.custLov?.writeValue(this.model.customertype);
      });

    } catch (err) {
      this.showPopup('Error loading form', true);
    }
  }

  readOnlyFields() {
    this.isTariffDisabled = true;
    this.isAccessIdDisabled = true;
    this.isnewprodTypeDisabled = true;
    this.isAssociate1ReadOnly = true;
    this.isAssociate2ReadOnly = true;
    this.isNewICCIDReadOnly = true;
    this.isMobileReadOnly = true;
    this.isWaiverCodeDisabled = true;
  }
  async NPRTariffPlan() {
    
    try {
      const request = {
        FRID: this.model.franchiseId,   // 👈 same name as C# property
        ProductCode: this.viewState.Product_code
      };
      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/NPRTariffPlan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const result = await res.json();
      if (result.success && result.data.length > 0) {
        this.lookups.tariffPlans = result.data;
        const firstTariff = result.data[0];
        this.model.tariffPlan = firstTariff["TARIFF11344"]; // value
        const tariffName = firstTariff["DSCR11344"];

        await this.FillAccess_Data(this.model.tariffPlan);
      } else {
        this.lookups.tariffPlans = [];
        await this.FillAccess_Data('');
      }
      this.showField();
    } catch (err) {
      console.error('Error fetching tariff plan:', err);
    }
  }
  async FillAccess_Data(tariff: string) {
    try {
      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/FillAccessLevel?tariff=${tariff}`);
      const json = await res.json();
      if (json?.success && json.data?.length > 0) {
        const sample = json.data[0];
        const hasUpperCaseKeys = !!sample.ACCID;

        // ✅ Lowercase property names use karo
        this.lookups.accessIds = json.data.map((item: any) => ({
          accid: hasUpperCaseKeys ? item.ACCID : item.AccID,      // lowercase
          accname: hasUpperCaseKeys ? item.ACCNAME : item.AccName  // lowercase
        }));

        this.model.accessId = this.lookups.accessIds[0]?.accid ?? '';

        if (this.model.accessId && this.model.accessId.trim() !== '') {
          await this.fillAccess(tariff, this.model.accessId);
        } else {
          await this.fillAccess('', '');
        }
      } else {
        this.lookups.accessIds = [];
        await this.fillAccess('', '');
      }
    } catch (err) {
      console.error('FillAccess_Data error:', err);
      this.lookups.accessIds = [];
      await this.fillAccess('', '');
    }
  }


  async Get_Base_Location(mobile: string) {
    try {
      const mobile = (this.model.prefix || '') + (this.model.mobile || '');
      if (!mobile || mobile.trim().length < 10) {
        this.model.location = '';
        this.showPopup('Mobile number is required', true);
        return;
      }
      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetBaseLocation?mobile=${mobile}`);
      const json = await res.json();
      if (json?.success) {
        this.model.location = json.baseLocation || '';
        this.model.baseCode = json.baseCode || '';
      } else {
        this.model.location = '';
        this.showPopup(json?.message || 'Failed to fetch base location', true);
      }
    } catch (err) {
      console.error('Get_Base_Location error', err);
    }
  }
  onCsrChange(event: any) {
    const index = event.target.selectedIndex;
    const text = event.target.options[index].text;
    this.model.csrName = text; // agar zarurat ho to
  }
  getValue(val: any): string {
    if (val == null) return '';
    if (typeof val === 'object') {
      return val.Value || val.Text || val.text || val.value || '';
    }
    return String(val);
  }
  getNumber(val: any): number {
    if (val == null) return 0;
    if (typeof val === 'object') {
      const num = val.Value || val.Text || val.value || val.text;
      return Number(num) || 0;
    }
    return Number(val) || 0;
  }
  async updateValues() {
    try {
      let bln = false;
      this.showField();
      await this.getDutyCal("0");
      if (!this.model.portFeeAmount) this.model.portFeeAmount = "";
      this.model.total = "";
      const frid = localStorage.getItem("FRID") || "";
      if (frid !== "") this.portFeeVisible("0");
      else this.portFeeVisible("1");
      if (this.viewState.IDTYPE === " " && this.model.franchiseId.trim() !== "") {
        this.lblMessage = "Web/Invalid franchise id or franchise type is not defined.";
        return;
      }
      if (this.model.newProductType) {
        this.model.accessId = true;
        const selectedType = this.lookups.newProductType.find(
          (p: any) => p.PROD_CODE === this.model.newProductType
        );
        const desc = selectedType ? selectedType.PROD_DESC : "";
        const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetProductTypeDesc?desc=${desc}`);
        const json = await res.json();
        if (json?.success && json.data.length > 0) {
          this.viewState.Product_code2 = json.data[0].PROD_CODE2;
          this.viewState.Product_code = json.data[0].PROD_CODE.substring(0, 1);
        }
        if (this.viewState.Product_code === "R") {
          this.isTariffDisabled = true;
          if (this.viewState.Tarrif_Allow === "Y") {
            if (this.model.newProductType === "R") {
              this.lookups.tariffPlans = [
                {
                  DSCR11344: this.viewState.Tarrif_Description || "Default Tariff",
                  TARIFF11344: this.viewState.Tarrif_Value || "0",
                },
              ];
              this.model.tariffPlan = this.lookups.tariffPlans[0].TARIFF11344;
            } else {
              await this.fillTariffPlan();
              this.model.tariffPlan = this.lookups.tariffPlans[0]?.TARIFF11344 || "";
            }
          } else {
            await this.fillTariffPlan();
            this.model.tariffPlan = this.lookups.tariffPlans[0]?.TARIFF11344 || "";
          }
        } else {
          this.isTariffDisabled = true;
          await this.fillTariffPlan();
          if (this.lookups.tariffPlans.length > 0) {
            this.model.tariffPlan = this.lookups.tariffPlans[0].TARIFF11344;
          }
        }
        if (this.viewState.Product_code === "R") {
          if (this.model.newProductType === "R" || this.model.newProductType === "R1") {
            this.lookups.accessIds = [{ ACCNAME: "IR", ACCID: "3" }];
            this.model.accessId = "3";
            this.isAccessIdDisabled = true;
            bln = true;
          }
        } else {
          if (this.lookups.accessIds.length > 0) {
            this.model.accessId = this.lookups.accessIds[0].ACCID;
            this.isAccessIdDisabled = true;
          }
        }
      }
      this.calFee();
    } catch (err: any) {
      this.lblMessage = err.message || "Unexpected error in updateValues()";
    }
  }
  calFee(): void {
    const portinFee = Number(this.model.portFeeAmount) || 0;
    const security = Number(this.model.sdAmount) || 0;
    const lineRate = Number(this.model.lrAmount) || 0;
    const wsd = Number(this.model.wsd) || 0;
    const wlr = Number(this.model.wlr) || 0;
    let portinFeeAmount = 0;
    let sdAmount = 0;
    let lrAmount = 0;
    if (!this.model.waiverCodes || this.model.waiverCodes === '') {
      this.model.portFeeAmount = portinFee;
    } else {
      this.model.portFeeAmount = Number(this.model.waiverCodes);
    }
    if (this.model.newProductType === 'O') {
      if (wsd < this.model.securityDeposit) {
        sdAmount = this.model.securityDeposit - wsd;
      } else {
        this.model.wsd = '';
        this.model.sdAmount = this.model.securityDeposit;
      }
      if (wlr < this.model.securityDeposit) {
        lrAmount = lineRate - wlr;
      } else {
        this.model.wlr = '';
        this.model.lrAmount = lineRate;
      }
    } else {
      this.model.sdAmount = '0';
      this.model.lrAmount = '0';
      this.model.hcAmount = '0';
    }
    const total =
      (Number(portinFeeAmount) || 0) +
      (Number(this.model.sdAmount) || 0) +
      (Number(this.model.lrAmount) || 0);
    this.model.portinFeeAmount = portinFeeAmount;
    this.model.total = total;
  }
  async onDdWavierChange(selectedValue: string) {
    try {
      if (!selectedValue) return;
      const productCode = this.viewState.Product_code?.trim();
      const franchiseId = this.model.franchiseId;
      const url = `${environment.apiBaseUrl}/api/NPRequest/GetCharges?discount=${encodeURIComponent(selectedValue)}&productCode=${encodeURIComponent(productCode)}&franchiseId=${encodeURIComponent(franchiseId)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.success && json.data?.length > 0) {
        const firstRow = json.data[0];
        this.viewState.afd_fr = firstRow.afd_fr_gets;
        this.viewState.wht_val = firstRow.wht_val;

        this.model.portinFeeAmount = firstRow.CUST_PAY?.toString() || '0';
      } else {
        this.model.portinFeeAmount = '0';
      }
      this.model.securityDeposit = this.model.securityDeposit || '0';
      this.model.wsd = this.model.wsd || '0';
      this.model.sdAmount = this.model.sdAmount || '0';
      this.model.lineRent = this.model.lineRent || '0';
      this.model.wlr = this.model.wlr || '0';
      this.model.lrAmount = this.model.lrAmount || '0';
      this.model.total =
        Number(this.model.portinFeeAmount) +
        Number(this.model.securityDeposit) +
        Number(this.model.wsd) +
        Number(this.model.sdAmount) +
        Number(this.model.lineRent) +
        Number(this.model.wlr) +
        Number(this.model.lrAmount);
    } catch (error) {
      console.error('Error fetching charges:', error);
      this.model.portinFeeAmount = '0';
      this.model.total = 0;
    }
  }
  async portFeeVisible(isFran: string) {
    try {
      const frid = localStorage.getItem('FRID') || '';
      const franchiseId = this.model.franchiseId || '';
      let idParam = '';
      if (isFran === '0') {
        idParam = frid;
      } else {
        idParam = franchiseId;
      }
      const url = `${environment.apiBaseUrl}/api/NPRequestupdate/GetIdType?franchiseId=${encodeURIComponent(idParam)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.success && json.data.length > 0) {
        const idType = json.data[0].ID_TYPE || json.data[0].IDTYPE || '';
        // 📝 ViewState ke alternate mein hum viewState object use kar rahe hain
        this.viewState.IDTYPE = idType;
        this.model.waiverCode = idType;
        if (idType === 'SH') {
          this.showWaiverFields = true;
          this.model.waiverCodeSelected = '0'; // default selection
        } else {
          this.showWaiverFields = false;
          this.model.waiverCodeSelected = '1';
        }
      }
    } catch (err) {
      console.error('Error in portFeeVisible:', err);
    }
  }
  async fillTariffPlan() {
    try {
      const idType = this.viewState.IDTYPE || '';
      const prodCode = this.viewState.Product_code || '';
      const prodCode2 = this.viewState.Product_code2 || '';
      const url = `${environment.apiBaseUrl}/api/NPRequestupdate/FillTariffPlan?idType=${idType}&productCode=${prodCode}&productCode2=${prodCode2}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.success && json.data.length > 0) {
        this.lookups.tariffPlans = json.data;
        this.model.tariffPlan = this.lookups.tariffPlans[0].TARIFF11344;
        this.showField();
        const tariff = this.model.tariffPlan;
        await this.fillAccessData(tariff);
      } else {
        this.lookups.tariffPlans = [];
        this.model.tariffPlan = '';
        await this.fillAccessData('');
      }
    } catch (err) {
      console.error('fillTariffPlan error', err);
      this.showPopup('Error loading tariff plans', true);
    }
  }
  async fillAccessData(tariff: string) {
    try {
      const url = `${environment.apiBaseUrl}/api/NPRequestupdate/FillAccessLevel?tariff=${encodeURIComponent(tariff)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.success && json.data.length > 0) {
        this.lookups.accessIds = json.data;
        this.model.accessId = this.lookups.accessIds[0].ACCID;
        await this.fillAccess(tariff, this.model.accessId);
      } else {
        this.lookups.accessIds = [];
        this.model.accessId = '';
        await this.fillAccess('', '');
      }
    } catch (err) {
      console.error('fillAccessData error', err);
      this.showPopup('Error loading access level', true);
    }
  }
  async fillAccess(packageId: string, accessId: string) {
    try {
      const url = `${environment.apiBaseUrl}/api/NPRequestupdate/GetSecurityAndLineRent?packageId=${encodeURIComponent(packageId)}&accessId=${encodeURIComponent(accessId)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.success && json.data.length > 0) {
        const VAL = json.data[0].VAL;
        if (VAL && VAL.includes(';')) {
          const [security, lineRent] = VAL.split(';');
          this.model.securityDeposit = security || '';
          this.model.lineRent = lineRent || '';
        } else {
          this.model.securityDeposit = '';
          this.model.lineRent = '';
        }
      } else {
        this.model.securityDeposit = '';
        this.model.lineRent = '';
      }
    } catch (err) {
      console.error('fillAccess error', err);
      this.showPopup('Error loading Security & Line Rent data', true);
    }
  }
  async onAccessIdChange(event: any) {
    try {
      const selectedAccessId = event.target.value;
      this.model.accessId = selectedAccessId;
      if (this.viewState.Product_code === 'O') {
        await this.fillAccess(this.model.tariffPlan, this.model.accessId);
      }
      this.showField();
    } catch (err) {
      console.error('Error in onAccessIdChange', err);
    }
  }
  async onFranchiseIdChange() {
    try {
      await this.updateValues();
      if (this.model.franchiseId && this.model.franchiseId.trim() !== '') {
        await this.fillCSRId();
      }
    } catch (err) {
      console.error('Franchise ID Change Error:', err);
      this.showPopup('Error while updating Franchise ID', true);
    }
  }
  async fillCSRId() {
    try {
      let frid = localStorage.getItem('FRID') || '';
      if (!frid) frid = this.model.franchiseId;
      const userId = localStorage.getItem('loginUser') || '';
      const url = `${environment.apiBaseUrl}/api/NPRequestupdate/FillCSRID?userId=${userId}&frid=${frid}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json?.success && json.data.length > 0) {
        this.lookups.csrs = json.data;

        this.model.csrs = '';          // reset
        await Promise.resolve();        // LOV render wait
        this.model.csrs = this.lookups.csrs[0].USER_CD;  // set default

      } else {
        this.lookups.csrs = [];
        this.model.csrs = '';
      }
    } catch (err) {
      console.error('fillCSRId error:', err);
      this.showPopup('Error loading CSR list', true);
    }
  }
  showField() {
    const productCode = this.viewState.Product_code;
    const waiverCode = this.model.waiverCode || '';

    if (productCode === 'O') {
      // Show postpaid related fields
      this.uiState = {
        ...this.uiState,
        securityDeposit: true,
        lineRent: true,
        lrAmount: true,
        sdAmount: true,
        wsd: true,
        wlr: true
      };

      // If WaiverCode = SH => editable, otherwise readonly
      if (waiverCode === 'SH') {
        this.readonlyFields.wlr = false;
        this.readonlyFields.wsd = false;
      } else {
        this.readonlyFields.wlr = true;
        this.readonlyFields.wsd = true;
      }
    }
    else if (productCode === 'R') {
      // Hide prepaid related fields and reset values
      this.uiState = {
        ...this.uiState,
        securityDeposit: true,
        lineRent: true,
        // showLine: false,
        lrAmount: true,
        sdAmount: true,
        wsd: true,
        wlr: true

      };
      this.model.wlr = '';
      this.model.wsd = '';
      this.model.sdAmount = '';
      this.model.lrAmount = '';
    }
  }
  async getDutyCal(isValidFranch: string) {

    try {
      this.lblMessage = '';

      // 🔹 Prepare parameters
      const frid = localStorage.getItem('FRID')?.trim() || '';
      const productCode = this.viewState.Product_code?.trim() || '';

      // 🔹 API call (SP: MNPMS_GET_Duty_Calculation_SP)
      const body = {
        FRID: frid,
        ProductCode: productCode,
        ExtraParam: ''
      };

      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetDutyCalculation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const json = await res.json();

      if (json?.success && json.data?.length > 0) {
        const row = json.data[0];

        // ✅ Bind dropdown waiverCode
        this.lookups.waivers = json.data.map((x: any) => ({
          value: x.DISCOUNT,
          text: x.DISCOUNT
        }));

        // ✅ Bind Portin fee fields
        this.model.portFee = row.CHARGES ?? '';
        this.model.portFeeAmount = row.CUST_PAY ?? '';

        // ✅ Security Deposit assign fix
        this.model.securityDeposit = Number(row.SECURITY_DEPOSIT || 0);  // 🟢 new line
        this.model.sdAmount = this.model.securityDeposit;                // 🟢 new line

        // ✅ Line Rent fix (if applicable)
        this.model.lineRent = Number(row.LINE_RENT || 0);                // optional, only if backend returns it
        this.model.lrAmount = this.model.lineRent;                       // 🟢

        // ✅ Store viewState (like VB ViewState)
        this.viewState.afd_fr = row.afd_fr_gets;
        this.viewState.wht_val = row.wht_val;

        // ✅ Immediately recalc total after getting duty values
        this.calc();                                                     // 🟢 important

        this.lblMessage = '';

      } else {
        // ❌ No data found
        this.lookups.waivers = [];
        this.model.portFee = '';
        this.model.portFeeAmount = '';
        this.model.securityDeposit = 0;                                 // 🟢 reset
        this.model.sdAmount = 0;                                        // 🟢 reset

        // Only show message if isValidFranch == "1"
        if (isValidFranch === '1') {
          this.lblMessage = 'Charges are not defined against this Franchisee';
        }

        // recalc to clear totals
        this.calc();                                                    // 🟢
      }

    } catch (err: any) {
      console.error('DutyCal error', err);
      this.lblMessage = err.message || 'Error during duty calculation';
    }
  }
  async loadTariffPlanAndAccess() {
    const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetTariffData`);
    const json = await res.json();
    if (json?.success) this.lookups.tariffPlans = json.data;
  }
  async onOmoChange(operatorId?: any) {
    try {
      this.model.prefix = '';
      this.model.baseLocation = '';

      if (!operatorId) return;

      // ✅ Find the selected operator object from lookup list
      const selectedOperator = this.lookups.operators.find(
        (op: any) => op.OPERATORID === operatorId
      );

      if (selectedOperator) {
        this.model.OMO_NAME = selectedOperator.OPERATOR_NAME;
        this.model.OMO_ID = selectedOperator.OPERATORID;
      }

      // ✅ Fetch operator prefix
      const res = await fetch(
        `${environment.apiBaseUrl}/api/NPRequest/GetOperatorPrefix?operatorId=${encodeURIComponent(operatorId)}`
      );
      const json = await res.json();

      if (json?.success && json.data && json.data.length > 0) {
        this.model.prefix =
          json.data.length > 1
            ? json.data[1].DESCRIP ?? ''
            : json.data[0].DESCRIP ?? '';
      } else {
        this.model.prefix = '';
      }
    } catch (err) {
      console.error('Error loading prefix', err);
      this.showPopup('Error loading operator prefix', true);
    }
  }
  onDmoChange(selectedValue: any) {
    try {
      const operatorId = selectedValue;
      if (!operatorId) return;
      const selectedObj = this.lookups.dmos.find(
        (x: any) => x.OPERATORID === operatorId
      );
      if (selectedObj) {
        this.model.DMO_ID = selectedObj.OPERATORID;
        this.model.DMO_NAME = selectedObj.OPERATOR_NAME;
      }
    } catch (err) {
      console.error('Error loading DMO', err);
      this.showPopup('Error selecting Donor Operator', true);
    }
  }
  async onMobileChange() {
    try {
      const mobile = (this.model.prefix || '') + (this.model.mobile || '');
      if (!mobile || mobile.trim().length < 10) {
        this.model.location = '';
        this.showPopup('Mobile number is required', true);
        return;
      }
      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetBaseLocation?mobile=${encodeURIComponent(mobile)}`);
      const json = await res.json();
      if (json?.success) {
        this.model.location = json.baseLocation || '';
        this.model.baseCode = json.baseCode || '';
      } else {
        this.model.location = '';
        this.showPopup(json?.message || 'Failed to fetch base location', true);
      }
    } catch (err) {
      console.error('Base location error', err);
      this.showPopup('Error fetching base location', true);
    }
  }
  onSelectNIC() {
    this.model.cnic = this.model.oldNIC = this.model.passport = this.model.otherID = '';
  }
  async onNewProductTypeChange() {
    try {
      const selectedText = this.lookups.newProductType.find(
        (x: any) => x.PROD_CODE === this.model.newProductType
      )?.PROD_DESC;
      if (!selectedText) {
        console.warn('No product type selected');
        return;
      }
      const res = await fetch(
        `${environment.apiBaseUrl}/api/NPRequestupdate/GetProductTypeDesc?desc=${encodeURIComponent(selectedText)}`
      );
      const json = await res.json();

      if (json?.success && json.data?.length > 0) {
        const row = json.data[0];
        this.viewState.Product_code2 = row.PROD_CODE2;
        this.viewState.Product_code = row.PROD_CODE?.substring(0, 1);
      }
      this.updateValues();
    } catch (err) {
      console.error('Error in onNewProductTypeChange', err);
      this.showPopup('Error while changing product type', true);
    }
  }
  onTariffPlanChange(event: Event) {
    const selectedTariff = (event.target as HTMLSelectElement).value;
    this._onTariffPlanChange(selectedTariff); // Call the actual logic
  }
  async _onTariffPlanChange(selectedTariff: string) {
    try {
      if (this.viewState.Product_code === 'O') {
        await this.fillAccessData(selectedTariff);
      } else {
        this.lookups.accessIds = [{ ACCNAME: 'IR', ACCID: '3' }];
        this.model.accessId = '3';
        this.isAccessIdDisabled = true;
        await this.fillAccess(selectedTariff, '3');
      }
      this.showField();
      this.calFee();
    } catch (err) {
      console.error('Error in onTariffPlanChange', err);
      this.showPopup('Error processing tariff change', true);
    }
  }
  async loadHandsetCharges() {
    try {
      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/GetHandsetCharges`);
      const json = await res.json();
      if (json?.success) {
        this.handsetCharges = json.data;
        this.model.handsetCharges = json.data; // same as VB: txtHandsetCharges.Text = GetHandsetCharges()
        this.model.hcAmount = 0; // initially 0
      }
    } catch (err) {
      console.error("Error loading handset charges:", err);
    }
  }
  // 🔘 Radio Change Handlers
  onWithHSClick() {
    this.isWithHS = false;
    this.model.hcAmount = 0;
    this.model.withHandset = false;
    this.isImeiDisabled = true; // default: disabled
    this.calc(); // same as Calc()
  }
  onWithoutHSClick() {
    this.isWithHS = true;
    this.model.hcAmount = this.handsetCharges;
    this.model.handsetCharges = this.handsetCharges; // ✅ Add this line
    this.model.withHandset = true;
    this.isImeiDisabled = false;
    this.calc(); // same as Calc()
  }
  calc() {
    try {
      const securityDeposit = Number(this.model.securityDeposit || 0);
      const wsd = Number(this.model.wsd || 0);
      const lineRent = Number(this.model.lineRent || 0);
      const wlr = Number(this.model.wlr || 0);
      const portFee = Number(this.model.portFeeAmount || 0);
      const handsetCharges = Number(this.model.hcAmount || 0);
      this.model.sdAmount = wsd > 0 ? Math.max(securityDeposit - wsd, 0) : securityDeposit;
      this.model.lrAmount = wlr > 0 ? Math.max(lineRent - wlr, 0) : lineRent;
      const isRType = (this.model.newProductType?.trim() === 'R');
      const includeHandset = this.model.withHandset === true;
      let total = 0;
      if (isRType) {
        total = portFee + (includeHandset ? handsetCharges : 0);
      } else {
        total = this.model.sdAmount + this.model.lrAmount + portFee;
        if (includeHandset) total += handsetCharges;
      }
      this.model.total = total;
    } catch (err) {
      console.error('calc() error:', err);
    }
  }
  reset() {
    window.location.href = "/app-public-porting-aspx";
  }
  validateBeforeSubmit(): { ok: boolean; msg?: string } {
    const m = this.model;
    if (!m.OMO) return { ok: false, msg: 'Select Owner Operator' };
    if (!m.dmos) return { ok: false, msg: 'Select Donor Operator' };
    if (!m.mobile || m.mobile.toString().length < 7) return { ok: false, msg: 'Mobile is required' };
    if (!m.registerName) return { ok: false, msg: 'Register Name is required' };
    if (!m.userName) return { ok: false, msg: 'User Name is required' };
    if (!m.address1) return { ok: false, msg: 'Address1 is required' };
    if (!m.city) return { ok: false, msg: 'City is required' };
    if (!m.selectNIC) return { ok: false, msg: 'Select ID Category' };
    if (m.selectNIC === 'C' && (!m.cnic || m.cnic.toString().length !== 13))
      return { ok: false, msg: 'CNIC must be 13 digits' };
    if (m.selectNIC === 'N' && (!m.oldNIC || m.oldNIC.toString().length !== 11))
      return { ok: false, msg: 'Old NIC must be 11 digits' };
    if (m.selectNIC === 'P' && (!m.passport || m.passport.toString().length < 12))
      return { ok: false, msg: 'Passport must be at least 12 chars' };
    if (m.selectNIC === 'O' && !m.otherID)
      return { ok: false, msg: 'Other ID required' };
    if (!m.newICCID || m.newICCID.toString().length < 1)
      return { ok: false, msg: 'New IMSI/ICCID required' };
    if (!m.franchiseId)
      return { ok: false, msg: 'Franchisee ID required' };
    if (!m.newProductType)
      return { ok: false, msg: 'Select New Product Type' };

    return { ok: true };
  }
  showPopup(message: string, isError: boolean = false) {
    this.popupMessage = message;
    this.isErrorPopup = isError;
    this.showSuccessPopup = true;
    if (message && message.trim().startsWith('0;')) {
      this.isErrorPopup = true;   // Red
    }
    else if (message && message.trim().startsWith('1;')) {
      this.isErrorPopup = false;  // Green
    }
    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 3000);
  }

  async onSubmit(form: any) {
    debugger;
    const dateParts = (document.getElementById('dob') as HTMLInputElement).value;
    const v = this.validateBeforeSubmit();
    if (!v.ok) {
      this.showPopup(v.msg || 'Validation failed', true);
      return;
    }
    // 🔹 Payload
    const payload: any = {
      p_NPR_NO: String(this.model.NPR || ''),
      p_LOC: this.model.baseCode || '',
      p_REGNAM: this.model.registerName || '',
      p_OOPERATOR: this.model.OMO || '',
      p_OOPERATORID: this.lookups.operators.find(
        (x: any) => x.OPERATORID === this.model.OMO)?.OPERATOR_NAME || '',

      // p_OOPERATORID: String(this.model.OMO_NAME || ''),

      p_DOPERATOR: this.model.dmos || '',
      p_DOPERATORID: this.lookups.dmos.find(
        (x: any) => x.OPERATORID === this.model.dmos)?.OPERATOR_NAME || '',
      //p_DOPERATORID: String(this.model.DMO_NAME || ''),
      p_ROPERATOR: '',
      p_ROPERATORID: '',
      p_MOB_NO: (this.model.prefix || '') + (this.model.mobile || ''),
      p_ICCID_NO: this.model.newICCID || '',
      p_AACT: 'NPRINS',
      p_OICCID: this.model.oldICCID || '',
      p_OLDNIC: this.model.oldNIC || '',
      p_NEWNIC: this.model.cnic || '',
      p_PASSP_NO: this.model.passport || '',
      p_EMAIL: this.model.email || '',
      p_ADDR_1: this.model.address1 || '',
      p_ADDR_2: this.model.address2 || '',
      p_ADDR_3: this.model.address3 || '',
      p_ADDR_4: this.model.address4 || '',
      p_EXT_NO: this.model.ext || '',
      p_RTEL_NO: this.model.telRes || '',
      p_OTEL_NO: this.model.telOff || '',
      p_CPROD: this.model.currentProductType || '',
      p_FAX_NO: '',
      p_SECURITY_DEPOSIT: Number(this.model.securityDeposit) || 0,
      p_NPROD: this.model.newProductType || '',
      p_ASSOCIATE_1: this.model.associate1 || '',
      p_TARIFF: this.model.tariffPlan || '',
      p_ASSOCIATE_2: this.model.associate2 || '',
      p_AXESID: this.model.accessId || '',
      p_LRENT: Number(this.model.lineRent) || 0,
      p_COMPANY_FLAG: this.model.customertype ?? '',
      p_POSTALCODE: this.model.postalcode || '',
      p_VMS: 'T',
      p_CLI: 'T',
      p_CAW: 'T',
      p_REGION: '',
      p_WAIVERCD: this.model.waiverCode || '',
      p_MST_ID: this.model.franchiseId || '',
      p_CITY: this.model.city || '',
      p_PORTINFEE: Number(this.model.portFeeAmount) || 0,
      p_WAVEINLINERENT: Number(this.model.wlr) || 0,
      p_WAVEINSECURITY: this.model.wsd || '',
      p_WAVEINPORTFEE: 0,
      p_PORTFEEAMOUNT: Number(this.model.portFeeAmount) || 0,
      p_PORTID: '',
      p_NEWROUTE: '',
      p_DOB: dateParts || '',
      p_CSPID: this.model.csrId || '',
      p_HANDSETFEE: Number(this.model.handsetCharges) || 0,
      p_HANDSETIEMI: this.model.imei || '',
      p_OTHERID: this.model.otherID || '',
      p_ACTION: this.mode === 'UPDATE' ? 'E' : 'I',
      p_USERID: this.loginUser || '',
      p_DONREC: 'R'
    };
    try {
      debugger
      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequestupdate/SubmitPortRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const textResponse = await res.text();
      let message = '';
      let isError = false;
      let nprNo: string | null = null;
      if (textResponse.includes(';')) {
        const parts = textResponse.split(';');
        const code = parts[0].trim();
        message = parts.slice(1).join(';').trim();
        isError = code !== '1';
        const match = message.match(/Assigned\s+MNP\s+No\s+is\s*:\s*([0-9:]+)/i);
        if (match && match[1]) {
          const allNos = match[1].split(':').map(x => x.trim());
          nprNo = allNos[allNos.length - 1]; // 🔹 always take last one (177)       
        }
      } else {
        message = textResponse.trim();
        isError = true;
      }
      if (isError && nprNo) {
        setTimeout(() => {
          window.location.href = `/app-npr-invoice?nprNo=${nprNo}`;
        }, 1000);
        return; // stop further execution
      }
      this.showPopup(message, isError);
    } catch (err: any) {
      console.error('Submit error:', err);
      this.showPopup('Submit error — network ya CORS issue', true);
    }
  }
}