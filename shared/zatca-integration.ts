/**
 * ESSENCE YOGURT - ZATCA E-INVOICING INTEGRATION
 * Saudi Arabia FATOORA Phase 2 Compliance Module
 * 
 * IMPORTANT: ZATCA is mandatory - no Google alternative exists.
 * This module handles B2C simplified invoices for self-serve kiosks.
 */

/* ============================================================================
   ZATCA COMPLIANCE OVERVIEW
   ========================================================================== */

export const ZatcaComplianceInfo = {
  authority: "Zakat, Tax and Customs Authority (ZATCA)",
  platform: "FATOORA",
  phase: "Phase 2 - Integration",
  
  deadlines: {
    wave23: { date: "2026-01-01", threshold: "SAR 750,000+ revenue in 2022/2023/2024" },
    wave24: { date: "2026-06-30", threshold: "SAR 375,000+ revenue in 2022-2024" }
  },
  
  penalties: {
    nonCompliance: "SAR 5,000 - 50,000 per violation",
    missingQrCode: "Up to SAR 10,000 per invoice",
    delayedReporting: "Additional penalties + possible VAT suspension"
  },
  
  resources: {
    portal: "https://zatca.gov.sa/en/E-Invoicing/Pages/default.aspx",
    guidelines: "https://zatca.gov.sa/en/E-Invoicing/Introduction/Guidelines/Documents/E-Invoicing_Detailed__Guideline.pdf",
    solutionProviders: "https://zatca.gov.sa/en/E-Invoicing/SolutionProviders/Pages/SolutionProvidersDirectory.aspx"
  }
};

/* ============================================================================
   INVOICE TYPES
   ========================================================================== */

export type InvoiceType = "SIMPLIFIED" | "STANDARD";
export type InvoiceSubType = "01" | "02" | "03" | "04"; // Tax, Simplified, Debit, Credit

export const InvoiceTypeConfig = {
  SIMPLIFIED: {
    code: "0200000",
    description: "B2C - Customer receipts (self-serve kiosk)",
    requiresBuyerInfo: false,
    clearanceMode: "REPORTING", // Report within 24 hours
    qrCodeRequired: true,
    offlineAllowed: true,
    maxOfflineHours: 24
  },
  STANDARD: {
    code: "0100000",
    description: "B2B - Corporate/business invoices",
    requiresBuyerInfo: true,
    clearanceMode: "CLEARANCE", // Real-time clearance required
    qrCodeRequired: false, // Optional
    offlineAllowed: false,
    maxOfflineHours: 0
  }
};

/* ============================================================================
   SELLER CONFIGURATION (Essence Yogurt)
   ========================================================================== */

export const EssenceSaudiSeller = {
  name: "Essence Yogurt Saudi Arabia LLC",
  nameAr: "إيسنس يوغرت المملكة العربية السعودية ذ.م.م",
  vatNumber: "31XXXXXXXXXX03", // Replace with actual TRN
  crNumber: "10XXXXXXXXXX", // Commercial Registration
  
  headquarters: {
    buildingNumber: "1234",
    street: "King Fahd Road",
    district: "Al Olaya",
    city: "Riyadh",
    cityAr: "الرياض",
    postalCode: "12345",
    additionalNumber: "5678",
    country: "SA"
  },
  
  freeZoneLocations: {
    "KAEC": { name: "King Abdullah Economic City", vatRate: 0 },
    "NEOM": { name: "NEOM", vatRate: 0 },
    "JAZAN": { name: "Jazan City for Primary and Downstream Industries", vatRate: 0 }
  }
};

/* ============================================================================
   QR CODE GENERATION (TLV Format)
   ========================================================================== */

export interface QrCodeTlvData {
  sellerName: string;
  vatNumber: string;
  timestamp: string; // ISO 8601
  invoiceTotal: string;
  vatAmount: string;
  invoiceHash?: string;
  ecdsaSignature?: string;
  publicKey?: string;
}

export const QrCodeTlvTags = {
  SELLER_NAME: 1,
  VAT_NUMBER: 2,
  TIMESTAMP: 3,
  INVOICE_TOTAL: 4,
  VAT_AMOUNT: 5,
  INVOICE_HASH: 6,
  ECDSA_SIGNATURE: 7,
  ECDSA_PUBLIC_KEY: 8
};

export function generateTlvBuffer(data: QrCodeTlvData): string {
  const tlvParts: Buffer[] = [];
  
  const addTlv = (tag: number, value: string) => {
    const valueBytes = Buffer.from(value, 'utf8');
    const tlv = Buffer.alloc(2 + valueBytes.length);
    tlv.writeUInt8(tag, 0);
    tlv.writeUInt8(valueBytes.length, 1);
    valueBytes.copy(tlv, 2);
    tlvParts.push(tlv);
  };
  
  addTlv(QrCodeTlvTags.SELLER_NAME, data.sellerName);
  addTlv(QrCodeTlvTags.VAT_NUMBER, data.vatNumber);
  addTlv(QrCodeTlvTags.TIMESTAMP, data.timestamp);
  addTlv(QrCodeTlvTags.INVOICE_TOTAL, data.invoiceTotal);
  addTlv(QrCodeTlvTags.VAT_AMOUNT, data.vatAmount);
  
  if (data.invoiceHash) addTlv(QrCodeTlvTags.INVOICE_HASH, data.invoiceHash);
  if (data.ecdsaSignature) addTlv(QrCodeTlvTags.ECDSA_SIGNATURE, data.ecdsaSignature);
  if (data.publicKey) addTlv(QrCodeTlvTags.ECDSA_PUBLIC_KEY, data.publicKey);
  
  return Buffer.concat(tlvParts).toString('base64');
}

/* ============================================================================
   XML INVOICE GENERATION (UBL 2.1)
   ========================================================================== */

export interface InvoiceLineItem {
  lineNumber: number;
  itemName: string;
  itemCode?: string;
  quantity: number;
  unitCode: "GRM" | "KGM" | "EA"; // Grams, Kilograms, Each
  unitPrice: number;
  discountAmount?: number;
  vatRate: number;
}

export interface SimplifiedInvoiceData {
  invoiceNumber: string;
  uuid: string;
  issueDate: string; // YYYY-MM-DD
  issueTime: string; // HH:MM:SS
  invoiceCounterValue: number;
  previousInvoiceHash: string;
  
  seller: typeof EssenceSaudiSeller;
  items: InvoiceLineItem[];
  
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  vatAmount: number;
  totalAmount: number;
  
  paymentMethod: "CASH" | "CARD" | "WALLET";
  currency: string;
}

export function generateSimplifiedInvoiceXml(data: SimplifiedInvoiceData): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
  <cbc:ID>${data.invoiceNumber}</cbc:ID>
  <cbc:UUID>${data.uuid}</cbc:UUID>
  <cbc:IssueDate>${data.issueDate}</cbc:IssueDate>
  <cbc:IssueTime>${data.issueTime}</cbc:IssueTime>
  <cbc:InvoiceTypeCode name="0200000">388</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>${data.currency}</cbc:DocumentCurrencyCode>
  
  <cac:AdditionalDocumentReference>
    <cbc:ID>ICV</cbc:ID>
    <cbc:UUID>${data.invoiceCounterValue}</cbc:UUID>
  </cac:AdditionalDocumentReference>
  
  <cac:AdditionalDocumentReference>
    <cbc:ID>PIH</cbc:ID>
    <cac:Attachment>
      <cbc:EmbeddedDocumentBinaryObject mimeCode="text/plain">${data.previousInvoiceHash}</cbc:EmbeddedDocumentBinaryObject>
    </cac:Attachment>
  </cac:AdditionalDocumentReference>
  
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="CRN">${data.seller.crNumber}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PostalAddress>
        <cbc:StreetName>${data.seller.headquarters.street}</cbc:StreetName>
        <cbc:BuildingNumber>${data.seller.headquarters.buildingNumber}</cbc:BuildingNumber>
        <cbc:CityName>${data.seller.headquarters.city}</cbc:CityName>
        <cbc:PostalZone>${data.seller.headquarters.postalCode}</cbc:PostalZone>
        <cac:Country>
          <cbc:IdentificationCode>${data.seller.headquarters.country}</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${data.seller.vatNumber}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${data.seller.name}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>
  
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="${data.currency}">${data.vatAmount.toFixed(2)}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="${data.currency}">${data.taxableAmount.toFixed(2)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="${data.currency}">${data.vatAmount.toFixed(2)}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>15.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
  
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="${data.currency}">${data.subtotal.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="${data.currency}">${data.taxableAmount.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${data.currency}">${data.totalAmount.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:AllowanceTotalAmount currencyID="${data.currency}">${data.discountTotal.toFixed(2)}</cbc:AllowanceTotalAmount>
    <cbc:PayableAmount currencyID="${data.currency}">${data.totalAmount.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  
${data.items.map(item => `  <cac:InvoiceLine>
    <cbc:ID>${item.lineNumber}</cbc:ID>
    <cbc:InvoicedQuantity unitCode="${item.unitCode}">${item.quantity}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="${data.currency}">${((item.quantity * item.unitPrice) - (item.discountAmount || 0)).toFixed(2)}</cbc:LineExtensionAmount>
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="${data.currency}">${(((item.quantity * item.unitPrice) - (item.discountAmount || 0)) * item.vatRate / 100).toFixed(2)}</cbc:TaxAmount>
      <cbc:RoundingAmount currencyID="${data.currency}">${(((item.quantity * item.unitPrice) - (item.discountAmount || 0)) * (1 + item.vatRate / 100)).toFixed(2)}</cbc:RoundingAmount>
    </cac:TaxTotal>
    <cac:Item>
      <cbc:Name>${item.itemName}</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>${item.vatRate.toFixed(2)}</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="${data.currency}">${item.unitPrice.toFixed(4)}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>`).join('\n')}
</Invoice>`;
  
  return xml;
}

/* ============================================================================
   API ROUTES SPECIFICATION
   ========================================================================== */

export const ZatcaApiRoutes = {
  devices: {
    register: { method: "POST", path: "/api/zatca/devices/register" },
    onboard: { method: "POST", path: "/api/zatca/devices/onboard" },
    list: { method: "GET", path: "/api/zatca/devices" },
    status: { method: "GET", path: "/api/zatca/devices/:id/status" }
  },
  
  invoices: {
    generate: { method: "POST", path: "/api/zatca/invoices/generate" },
    report: { method: "POST", path: "/api/zatca/invoices/report" },
    clear: { method: "POST", path: "/api/zatca/invoices/clear" },
    list: { method: "GET", path: "/api/zatca/invoices" },
    pending: { method: "GET", path: "/api/zatca/invoices/pending" },
    getXml: { method: "GET", path: "/api/zatca/invoices/:id/xml" },
    getPdf: { method: "GET", path: "/api/zatca/invoices/:id/pdf" }
  },
  
  sync: {
    reportOffline: { method: "POST", path: "/api/zatca/sync/report-offline" },
    status: { method: "GET", path: "/api/zatca/sync/status" }
  }
};

/* ============================================================================
   OFFLINE MODE CONFIGURATION
   ========================================================================== */

export const OfflineModeConfig = {
  enabled: true,
  maxOfflineHours: 24,
  autoSyncIntervalMinutes: 15,
  maxOfflineInvoices: 1000,
  
  alertThresholds: {
    warningHours: 20, // Alert when 20 hours offline
    criticalHours: 23, // Critical alert at 23 hours
    maxHours: 24 // Must report by 24 hours
  },
  
  retryConfig: {
    maxRetries: 5,
    backoffMultiplier: 2,
    initialDelayMs: 1000
  }
};

/* ============================================================================
   SELF-SERVE KIOSK FLOW
   ========================================================================== */

export const KioskInvoiceFlow = {
  step1: {
    action: "Customer completes self-serve",
    description: "Customer fills cup, adds toppings, proceeds to scale"
  },
  step2: {
    action: "Scale weighs product",
    description: "Digital scale captures weight in grams"
  },
  step3: {
    action: "POS calculates total",
    description: "Weight × price/kg + VAT (15%) = Total"
  },
  step4: {
    action: "Generate invoice offline",
    description: "Create UUID, QR code, XML - no internet required"
  },
  step5: {
    action: "Print receipt with QR",
    description: "Customer receives receipt with valid QR code"
  },
  step6: {
    action: "Queue for ZATCA reporting",
    description: "Invoice added to sync queue"
  },
  step7: {
    action: "Report to ZATCA within 24h",
    description: "Automatic background sync when online"
  }
};
