import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DatepickerService } from 'app/SETUPS/Services/datepicker.service';
import { GlobalLovComponent } from 'app/global-lov/global-lov.component';

//const API_BASE = (window as any).__env?.apiBaseUrl || (window as any).apiBaseUrl || 'http://localhost:5000/api';
@Component({
  standalone: true,
  selector: 'app-public-nprequest-aspx',
  imports: [CommonModule, FormsModule, GlobalLovComponent],
  templateUrl: './np-request.component.html',
  styleUrl: './np-request.component.css'
})
export class NpRequestComponent implements OnInit {
  
  showWaiverFields = false;
  lblWaiverCode = 'Waiver Code';
  isTariffDisabled = false;
  public isImeiDisabled: boolean = true;
  isAccessIdDisabled = false;
  handsetCharges = 0;
  isWithHS = false; // No selected by default
  loginUser: string = '';
  Frid: string = '';
  lovDisabled: boolean = false;
  lovCSRDisabled: boolean = false;
 isFranchiseDisabled: boolean = false;
  @ViewChild('tariffLov') tariffLov: any;
  @ViewChild('accessLov') accessLov: any;
  @ViewChild('customerLov') customerLov: any;
  @ViewChild('CurrentLov') CurrentLov: any;
  @ViewChild('CNIC') CNICLov: any;

  mode: 'INSERT' | 'UPDATE' = 'INSERT';

  popupMessage = '';
  isErrorPopup = false;
  showSuccessPopup = false;
  lblICCIDMessage: string = '';
  lblMessage: string = '';
  dob: string = '';
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
  customertype = [

    { code: 'C', name: 'Company' },
    { code: 'I', name: 'Individual' }

  ];
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
    wsd: true
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


  constructor(private route: ActivatedRoute, private datepickerService: DatepickerService) { } 

  action: string = '';
 async ngOnInit() {
  this.loginUser = localStorage.getItem('loginUser') || 'No user';
  this.Frid = localStorage.getItem('FrID') || "";    
  this.model.customertype = 'I';
  this.model.currentProductType = 'R';
  this.model.selectNIC = 'C';

  await this.loadHandsetCharges();
  await this.loadLookups(); // load lookups first

  // Only now initialize franchise & CSR
  this.initializeFranchiseCsr();

  this.mode = 'INSERT';
  await this.updateValues();
}


  ngAfterViewInit(): void {
    this.datepickerService.initializeDatepicker('#dob');
    setTimeout(() => {
      this.model.customertype = 'I';
      if (this.customerLov) {
        this.customerLov.writeValue('I'); 
      }
      this.model.currentProductType = 'R';
      if (this.CurrentLov) {
        this.CurrentLov.writeValue('R'); 
      }
      this.model.selectNIC = 'C';  
      if (this.CNICLov) {
        this.CNICLov.writeValue('C'); 
      }

    }, 50); 
  }
  copyRegisterNameToUserName() {
    this.model.userName = this.model.registerName;
  }
async initializeFranchiseCsr() {
  const frid = this.Frid;

  if (frid) {
    // Set franchise ID
    this.model.franchiseId = frid;

    // ✅ Call API to fill CSR for this FRID
    await this.fillCSRId();

    // Disable fields
    this.isFranchiseDisabled = true;
    this.lovCSRDisabled = true;

    this.portFeeVisible("0");
  } else {
    // Enable fields if FRID not set
    this.model.franchiseId = '';
    this.model.csrs = '';
    this.isFranchiseDisabled = false;
    this.lovCSRDisabled = false;
    this.portFeeVisible("1");
  }
}

  getEmptyModel() {
    return {
      prefix: '',
      mobile: '',
      OMO: '',
      DMO: '',
      registerName: '',
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
      dob: '',
      customertype: '',
      postalcode: '',
      portFeeAmount: '',
      wsd: '',
      wlr: '',
      handsetCharges: '',
      imei: ''

    };
  }

  async loadLookups() {
    
    try {
      
      // operators

      const op = await fetch(`${environment.apiBaseUrl}/api/NPRequest/operators`).then(r => r.json());

      if (op?.success) this.lookups.operators = op.data;

      // waiver
      const waiver = await fetch(`${environment.apiBaseUrl}/api/NPRequest/Waiver`).then(r => r.json()).catch(() => null);
      if (waiver?.success) this.lookups.Waiver = waiver.data;
      // dmos
      const dmo = await fetch(`${environment.apiBaseUrl}/api/NPRequest/donors`).then(r => r.json()).catch(() => null);
      if (dmo?.success) this.lookups.dmos = dmo.data;

      // product types
      // After fetching product types
      const pt = await fetch(`${environment.apiBaseUrl}/api/NPRequest/producttypes`).then(r => r.json());
      if (pt?.success) {
        this.lookups.newProductType = pt.data;

        if (this.lookups.newProductType.length > 1) {
          const secondItem = this.lookups.newProductType[1];

          // Angular ko ensure karo ki ngModel assign ho after items render
          setTimeout(() => {
            this.model.newProductType = secondItem.PROD_CODE;
            this.onNewProductTypeChange();
          }, 100); // 100ms delay ensures items render ho chuki hain
        }
      }


      const imsiRes = await fetch(`${environment.apiBaseUrl}/api/NPRequest/GetImsiFlag`);
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

      // 5️⃣ Tariff Data
      const tariffRes = await fetch(`${environment.apiBaseUrl}/api/NPRequest/GetTariffData`);
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

      // 6️⃣ PrePost Display (Pre Paid / Post Paid)
      const prepostRes = await fetch(`${environment.apiBaseUrl}/api/NPRequest/GetPrePostVal`);
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

      // ✅ Duty calculation if FRID session exists
      if (!this.action) {
        this.updateValues(); // VB ka updatevalues()

        // 2️⃣ Product code check karo
        if (this.viewState.Product_code === 'R') {
          let foundIR = false;

          // accessIds ek dropdown list mani ja rahi hai
          for (let i = 0; i < this.lookups.accessIds.length; i++) {
            const item = this.lookups.accessIds[i];
            if (item.text === 'IR') {
              this.model.accessId = item.value; // select "IR"
              this.model.accessId = true;
              foundIR = true;
              break;
            }
          }

          // agar IR nahi mila
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
      // ✅ Tariff Plan & Access ID fills
      await this.loadTariffPlanAndAccess();

    } catch (err) {
   //   console.error('lookup load error', err);
      this.showPopup('Lookup load failed', true);
    }
  }
  onCsrChange(event: any) {
    const index = event.target.selectedIndex;
    const text = event.target.options[index].text;
    this.model.csrName = text; // agar zarurat ho to
  }
  async updateValues() {
    
    try {
      let bln = false;

      // 1️⃣ Show Field
      this.showField();

      // 2️⃣ Duty Calculation
      await this.getDutyCal("0");

      // 3️⃣ Port Fee Amount check
      if (!this.model.portFeeAmount) this.model.portFeeAmount = "";

      // 4️⃣ Reset Total
      this.model.total = "";

      // 5️⃣ Franchise session check
      const frid = localStorage.getItem("FRID") || "";
      if (frid !== "") this.portFeeVisible("0");
      else this.portFeeVisible("1");

      // 6️⃣ Invalid Franchise validation
      if (this.viewState.IDTYPE === " " && this.model.franchiseId.trim() !== "") {
        this.lblMessage = "Web/Invalid franchise id or franchise type is not defined.";
        return;
      }

      // 7️⃣ Product Type selection check
      if (this.model.newProductType) {
        this.model.accessId = true;

        // 🔹 Get selected Product Type description
        const selectedType = this.lookups.newProductType.find(
          (p: any) => p.PROD_CODE === this.model.newProductType
        );
        const desc = selectedType ? selectedType.PROD_DESC : "";

        // 🔹 Fetch Product Type Desc (SP: MNPMS_GET_Product_Typ_desc_SP)
        const res = await fetch(`${environment.apiBaseUrl}/api/NPRequest/GetProductTypeDesc?desc=${desc}`);
        const json = await res.json();
        if (json?.success && json.data.length > 0) {
          this.viewState.Product_code2 = json.data[0].PROD_CODE2;
          this.viewState.Product_code = json.data[0].PROD_CODE.substring(0, 1);
        }

        // 8️⃣ Tariff Plan logic
        if (this.viewState.Product_code === "R") {
          // Disable Tariff dropdown for R
          this.isTariffDisabled = true;

          if (this.viewState.Tarrif_Allow === "Y") {
            if (this.model.newProductType === "R") {
              // Static single row bind
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
          // Enable for others
          this.isTariffDisabled = false;
          await this.fillTariffPlan();
          if (this.lookups.tariffPlans.length > 0) {
            this.model.tariffPlan = this.lookups.tariffPlans[0].TARIFF11344;
          }
        }

        // 9️⃣ AccessID logic (IR condition)
        if (this.viewState.Product_code === "R") {
          if (this.model.newProductType === "R" || this.model.newProductType === "R1") {
            this.lookups.accessIds = [{ ACCNAME: "IR", ACCID: "3" }];
            this.model.accessId = "3";
            this.isAccessIdDisabled = true;
            bln = true;
          }
        } else {
          await this.fillAccessData(this.model.tariffPlan);
          this.calFee();
          if (this.lookups.accessIds.length > 0) {
            this.model.accessId = this.lookups.accessIds[0].ACCID;
          }
          this.isAccessIdDisabled = false;
        }
      }

      // 🔟 Calculate Fee
      // this.calFee();

    } catch (err: any) {
      this.lblMessage = err.message || "Unexpected error in updateValues()";
    }
  }

  calFee(): void {
    
    // Convert all values safely to numbers (default 0 if empty)
    const portinFee = Number(this.model.portFeeAmount) || 0;
    const security = Number(this.model.securityDeposit) || 0;
    const lineRate = Number(this.model.lrAmount) || 0;
    const wsd = Number(this.model.wsd) || 0;
    const wlr = Number(this.model.wlr) || 0;

    let portinFeeAmount = 0;
    let sdAmount = 0;
    let lrAmount = 0;

    // 🟢 Waiver handling
    if (!this.model.waiver || this.model.waiver === '') {
      portinFeeAmount = portinFee;
    } else {
      portinFeeAmount = Number(this.model.waiver);
    }

    // 🟢 If Postpaid (Product Type = 'O')
    if (this.model.newProductType === 'O') {

      // Security Deposit Difference
      if (wsd < security) {
        sdAmount = security - wsd;
        this.model.sdAmount = sdAmount;
      } else {
        this.model.wsd = '';
        this.model.sdAmount = security;
      }

      // Line Rent Difference
      if (wlr < lineRate) {
        lrAmount = lineRate - wlr;
        this.model.lrAmount = lrAmount;
      } else {
        this.model.wlr = '';
        this.model.lrAmount = lineRate;
      }

    } else {
      // 🟠 If Prepaid (Product Type = 'R')
      this.model.sdAmount = '';
      this.model.lrAmount = '';
      this.model.hcAmount = '';
    }

    // 🟣 Calculate total
    const total =
      (Number(portinFeeAmount) || 0) +
      (Number(this.model.sdAmount) || 0) +
      (Number(this.model.lrAmount) || 0);

    this.model.portinFeeAmount = portinFeeAmount;
    this.model.total = total;
  }

  async portFeeVisible(isFran: string) {

    try {
      // 🟡 Franchise ID ko localStorage ya model se get karein
      const frid = localStorage.getItem('FRID') || '';
      const franchiseId = this.model.franchiseId || '';

      let idParam = '';

      if (isFran === '0') {
        idParam = frid;
      } else {
        idParam = franchiseId;
      }

      // 🔸 API Call for MNPMS_GET_ID_TYPE_SP
      const url = `${environment.apiBaseUrl}/api/NPRequest/GetIdType?franchiseId=${encodeURIComponent(idParam)}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json?.success && json.data.length > 0) {
        const idType = json.data[0].ID_TYPE || json.data[0].IDTYPE || '';
        // const idType = 'SH';

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
     // console.error('Error in portFeeVisible:', err);
    }
  }

  async fillTariffPlan() {

    try {
      const idType = this.viewState.IDTYPE || '';
      const prodCode = this.viewState.Product_code || '';
      const prodCode2 = this.viewState.Product_code2 || '';

      // API call (VB SP: MNPMS_FILL_TARRIFFPLAN_SP)
      const url = `${environment.apiBaseUrl}/api/NPRequest/FillTariffPlan?idType=${idType}&productCode=${prodCode}&productCode2=${prodCode2}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json?.success && json.data.length > 0) {
        // Direct assign (no mapping)
        this.lookups.tariffPlans = json.data;

        // Default select first plan
        this.model.tariffPlan = this.lookups.tariffPlans[0].TARIFF11344;

        // Equivalent of ShowField()
        this.showField();

        // Now call FillAccess_Data(Tariff)
        const tariff = this.model.tariffPlan;
        await this.fillAccessData(tariff);

      } else {
        // Empty tariff plan case
        this.lookups.tariffPlans = [];
        this.model.tariffPlan = '';
        await this.fillAccessData('');
      }
    } catch (err) {
    //  console.error('fillTariffPlan error', err);
      this.showPopup('Error loading tariff plans', true);
    }
  }
  async fillAccessData(tariff: string) {
    
    try {
      const url = `${environment.apiBaseUrl}/api/NPRequest/FillAccessLevel?tariff=${encodeURIComponent(tariff)}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json?.success && json.data.length > 0) {
        // ✅ Direct assign (no mapping)
        this.lookups.accessIds = json.data;

        // ✅ Select first record
        this.model.accessId = this.lookups.accessIds[0].ACCID;

        // ✅ Call next step
        await this.fillAccess(tariff, this.model.accessId);
      } else {
        this.lookups.accessIds = [];
        this.model.accessId = '';
        await this.fillAccess('', '');
      }
    } catch (err) {
   //   console.error('fillAccessData error', err);
      this.showPopup('Error loading access level', true);
    }
  }

  async fillAccess(packageId: string, accessId: string) {
    
    try {
      // 🟢 Call API for MNPMS_GET_SEC_LNRENT_SP
      const url = `${environment.apiBaseUrl}/api/NPRequest/GetSecurityAndLineRent?packageId=${encodeURIComponent(packageId)}&accessId=${encodeURIComponent(accessId)}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json?.success && json.data.length > 0) {
        const VAL = json.data[0].VAL;

        if (VAL && VAL.includes(';')) {
          const [security, lineRent] = VAL.split(';');

          // Bind directly to model
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
      this.calc();
    } catch (err) {
    //  console.error('fillAccess error', err);
      this.showPopup('Error loading Security & Line Rent data', true);
    }
  }
  async onAccessIdChange(event: any) {
    try {
      const selectedAccessId = event?.target?.value || this.model.accessId;
      this.model.accessId = selectedAccessId;

      if (this.viewState.Product_code === 'O') {
        await this.fillAccess(this.model.tariffPlan, this.model.accessId);
      }

      this.showField();

      // Optional: update fee
      // this.calFee();

    } catch (err) {
   //   console.error('Error in onAccessIdChange', err);
    }
  }

  async onFranchiseIdChange() {
    
    try {
      // Step 1: Update values logic (VB’s updatevalues())
      await this.updateValues();

      // Step 2: Only call API if franchise ID is not empty
      if (this.model.franchiseId && this.model.franchiseId.trim() !== '') {
        await this.fillCSRId();
      }
    } catch (err) {
    //  console.error('Franchise ID Change Error:', err);
      this.showPopup('Error while updating Franchise ID', true);
    }
  }
  async fillCSRId() {
  try {
    const frid = this.model.franchiseId?.trim();
    if (!frid) return;

    const userId = localStorage.getItem('loginUser') || '';

    const url = `${environment.apiBaseUrl}/api/NPRequest/FillCSRID?userId=${userId}&frid=${frid}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json?.success && json.data.length > 0) {
      this.lookups.csrs = json.data;
      // Angular change detection
      setTimeout(() => {
        this.model.csrs = this.lookups.csrs[0].USER_CD; // valueField
      }, 50);
    } else {
      this.lookups.csrs = [];
      this.model.csrs = '';
    }
  } catch (err) {
 //   console.error('fillCSRId error:', err);
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

        // securityDeposit: true,

        securityDeposit: true,
        lineRent: true,
        // showLine: false,
        lrAmount: true,
        sdAmount: true,
        wsd: true,

        wlr: true

        // lineRent: true,
        // lrAmount: true,
        // showSecurity: true,
        // showWLR: true,
        // showWSD: true,
        // showSDAmount: true,
        // showLRAmount: true
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
        securityDeposit: false,
        lineRent: false,
        // showLine: false,
        lrAmount: false,
        sdAmount: false,
        wsd: false,
        wlr: false
        //showSecurity: false,
        //showWLR: false,
        //showWSD: false,
        //showSDAmount: false,
        //showLRAmount: false
      };

      // Reset values for prepaid
      this.model.wlr = '';
      this.model.wsd = '';
      this.model.sdAmount = '';
      this.model.lrAmount = '';
    }
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

      // Make sure numeric values default to 0 if empty or undefined
      this.model.securityDeposit = this.model.securityDeposit || '0';
      this.model.wsd = this.model.wsd || '0';
      this.model.sdAmount = this.model.sdAmount || '0';

      this.model.lineRent = this.model.lineRent || '0';
      this.model.wlr = this.model.wlr || '0';
      this.model.lrAmount = this.model.lrAmount || '0';

      // Calculate total
      this.model.total =
        Number(this.model.portinFeeAmount) +
        Number(this.model.securityDeposit) +
        Number(this.model.wsd) +
        Number(this.model.sdAmount) +
        Number(this.model.lineRent) +
        Number(this.model.wlr) +
        Number(this.model.lrAmount);

    } catch (error) {
    //  console.error('Error fetching charges:', error);
      this.model.portinFeeAmount = '0';
      this.model.total = 0;
    }
  }

  async getDutyCal(isValidFranch: string) {

    try {
      this.lblMessage = '';

      // 🔹 Prepare parameters
      sessionStorage.removeItem('FRID');
      const frid = sessionStorage.getItem('FRID')?.trim() || '';
      const productCode = this.viewState.Product_code?.trim() || '';

      // 🔹 API call (SP: MNPMS_GET_Duty_Calculation_SP)
      const body = {
        FRID: frid,
        ProductCode: productCode,
        ExtraParam: ''
      };

      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequest/GetDutyCalculation`, {
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
        this.model.securityDeposit = Number(row.SECURITY_DEPOSIT || 0);
        this.model.sdAmount = this.model.securityDeposit;

        // ✅ Line Rent fix (if applicable)
        this.model.lineRent = Number(row.LINE_RENT || 0);
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
    //  console.error('DutyCal error', err);
      this.lblMessage = err.message || 'Error during duty calculation';
    }
  }

  async loadTariffPlanAndAccess() {
    const res = await fetch(`${environment.apiBaseUrl}/api/NPRequest/GetTariffData`);
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
   //   console.error('Error loading prefix', err);
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
   //   console.error('Error loading DMO', err);
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

      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequest/GetBaseLocation?mobile=${encodeURIComponent(mobile)}`);
      const json = await res.json();

      if (json?.success) {
        this.model.location = json.baseLocation || '';
        this.model.baseCode = json.baseCode || '';
        // this.showPopup('Base Location fetched successfully');
      } else {
        this.model.location = '';
        this.showPopup(json?.message || 'Failed to fetch base location', true);
      }
    } catch (err) {
   //   console.error('Base location error', err);
      this.showPopup('Error fetching base location', true);
    }
  }

  onSelectNIC() {
    // clear other id fields
    this.model.cnic = this.model.oldNIC = this.model.passport = this.model.otherID = '';
  }

  async onNewProductTypeChange() {
    
    try {
      const selectedText = this.lookups.newProductType.find(
        (x: any) => x.PROD_CODE === this.model.newProductType
      )?.PROD_DESC;

      if (!selectedText) {
      //  console.warn('No product type selected');
        return;
      }
      const res = await fetch(
        `${environment.apiBaseUrl}/api/NPRequest/GetProductTypeDesc?desc=${encodeURIComponent(selectedText)}`
      );
      const json = await res.json();

      if (json?.success && json.data?.length > 0) {
        const row = json.data[0];
        this.viewState.Product_code2 = row.PROD_CODE2;
        this.viewState.Product_code = row.PROD_CODE?.substring(0, 1);
      }

      // VB: updatevalues() - Yahan tariffPlans data load hota hai
      this.updateValues();
      setTimeout(() => {
        if (this.lookups.tariffPlans && this.lookups.tariffPlans.length > 0) {
          const firstTariffValue = this.lookups.tariffPlans[0].TARIFF11344;
          this.model.tariffPlans = firstTariffValue;
          if (this.tariffLov) {
            this.tariffLov.writeValue(this.model.tariffPlans);
          }
          this.onTariffPlanChange();
        } else {
          this.model.tariffPlans = null;
          if (this.tariffLov) {
            this.tariffLov.writeValue(null);
          }
        }
      }, 50);
      if (this.lookups.accessIds?.length > 0) {
        const firstItem = this.lookups.accessIds[0];

        // 1️⃣ ngModel assign
        this.model.accessId = firstItem.ACCID;

        // 2️⃣ internal selection for app-global-lov
        setTimeout(() => {
          if (this.accessLov?.setSelectedItem) {
            this.accessLov.setSelectedItem(firstItem); // ✅ argument pass karna zaruri
          }

          // 3️⃣ trigger change logic
          // this.onAccessIdChange({ target: { value: firstItem.ACCID } });
          this.onAccessIdChange(firstItem.ACCID);

        }, 50);
      }


    } catch (err) {
    //  console.error('Error in onNewProductTypeChange', err);
      this.showPopup('Error while changing product type', true);
    }
  }
  onTariffPlanChange() {
    const selectedTariff = this.model.tariffPlans; // <-- Correct way
    this._onTariffPlanChange(selectedTariff);
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
   //   console.error('Error in onTariffPlanChange', err);
      this.showPopup('Error processing tariff change', true);
    }
  }
  async loadHandsetCharges() {
    try {
      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequest/GetHandsetCharges`);
      const json = await res.json();

      if (json?.success) {
        this.handsetCharges = json.data;
        this.model.handsetCharges = json.data;
        this.model.hcAmount = 0;
      }
    } catch (err) {
   //   console.error("Error loading handset charges:", err);
    }
  }

  // 🔘 Radio Change Handlers
  onWithHSClick() {
    this.isWithHS = false;
    this.model.hcAmount = 0;

    this.model.withHandset = false;
    this.isImeiDisabled = true;
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
      // Safely convert all numeric fields
      const securityDeposit = Number(this.model.securityDeposit || 0);
      const wsd = Number(this.model.wsd || 0);
      const lineRent = Number(this.model.lineRent || 0);
      const wlr = Number(this.model.wlr || 0);
      const portFee = Number(this.model.portFeeAmount || 0);
      const handsetCharges = Number(this.model.hcAmount || 0);

      // 🔹 1. Security Deposit Calculation
      this.model.sdAmount = wsd > 0 ? Math.max(securityDeposit - wsd, 0) : securityDeposit;

      // 🔹 2. Line Rent Calculation
      this.model.lrAmount = wlr > 0 ? Math.max(lineRent - wlr, 0) : lineRent;

      // 🔹 3. Identify Product Type (R = Prepaid, else Postpaid)
      const isRType = (this.model.newProductType?.trim() === 'R');


      const includeHandset = this.model.withHandset === true;


      let total = 0;

      if (isRType) {

        total = portFee + (includeHandset ? handsetCharges : 0);
      } else {

        total = this.model.sdAmount + this.model.lrAmount + portFee;
        if (includeHandset) total += handsetCharges;
      }

      // 🔹 6. Final Total Assign
      this.model.total = total;



    } catch (err) {
    //  console.error('calc() error:', err);
    }
  }


  reset() {
    this.model = this.getEmptyModel();
    // this.lookups.accessIds = [];
    // this.lookups.tariffPlans = [];
    this.popupMessage = '';
    this.model.selectNIC = 'C';
    this.isImeiDisabled = true;
    this.loadLookups();
    this.uiState = {
      securityDeposit: true,
      lineRent: true,
      lrAmount: true,
      sdAmount: true,
      wsd: true,
      wlr: true,
      showSecurity: true,
      showWLR: true,
      showWSD: true,
      showSDAmount: true,
      showLRAmount: true
    };
    this.isWithHS = false;
    this.initializeFranchiseCsr();

  }

  validateBeforeSubmit(): { ok: boolean; msg?: string } {
    const m = this.model;

    // Required checks
    if (!m.OMO) return { ok: false, msg: 'Select Owner Operator' };
    if (!m.mobile || m.mobile.toString().length < 7) return { ok: false, msg: 'Mobile is required' };
    if (!m.dmos) return { ok: false, msg: 'Select Donor Operator' };
    if (!m.oldICCID) return { ok: false, msg: 'Select Old IMSI' };
    if (!m.registerName) return { ok: false, msg: 'Register Name is required' };
    if (!m.userName) return { ok: false, msg: 'User Name is required' };
    if (!m.selectNIC) return { ok: false, msg: 'Select ID Category' };
    if (!m.address1) return { ok: false, msg: 'Address1 is required' };
    if (!m.city) return { ok: false, msg: 'City is required' };


    // ID specific checks
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

    // Default values
    this.isErrorPopup = isError;
    this.showSuccessPopup = true;

    // Database return check
    if (message && message.trim().startsWith('0;')) {
      this.isErrorPopup = true;   // Red
    }
    else if (message && message.trim().startsWith('1;')) {
      this.isErrorPopup = false;  // Green
    }

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 3000);
  }

  async onSubmit(form: any) {
    const dateParts = (document.getElementById('dob') as HTMLInputElement).value;
    const v = this.validateBeforeSubmit();
    if (!v.ok) {
      this.showPopup(v.msg || 'Validation failed', true);
      return;
    }

    // 🔹 Payload
    const payload: any = {

      p_LOC: this.model.baseLocation || '',
      p_REGNAM: this.model.registerName || '',
      p_OOPERATOR: this.model.OMO_ID || '',
      p_OOPERATORID: String(this.model.OMO_NAME || ''),
      p_DOPERATOR: this.model.DMO_ID || '',
      p_DOPERATORID: String(this.model.DMO_NAME || ''),
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
      p_COMPANY_FLAG: this.model.customertype || '',
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

   // console.log('Submitting payload:', payload);

    try {
      const res = await fetch(`${environment.apiBaseUrl}/api/NPRequest/SubmitPortRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const textResponse = await res.text();
    //  console.log('Raw Response:', textResponse);

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
       //   console.log('✅ Extracted NPR No:', nprNo);
        }
      } else {
        message = textResponse.trim();
        isError = true;
      }


      if (isError && nprNo) {
      //  console.log('✅ Redirecting to invoice page...');
        setTimeout(() => {
          window.location.href = `/app-npr-invoice?nprNo=${nprNo}`;
        }, 1000);
        return; // stop further execution
      }
      this.showPopup(message, isError);

    } catch (err: any) {
   //   console.error('Submit error:', err);
      this.showPopup('Submit error — network ya CORS issue', true);
    }
  }
}