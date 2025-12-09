import { Router } from "express";
import { storage } from "../storage";
import { randomUUID } from "crypto";
import {
  createInvoice2025,
  renderMobile2025,
  renderA4_2025,
  renderPOS2025,
  TAX_2025,
  DEFAULT_SUPPLIER,
  toStoredInvoice,
  type CountryCode,
  type Party,
  type InvoiceItem,
  type Invoice2025,
} from "@shared/global-einvoice-engine-2025";
import { z } from "zod";

const router = Router();

function validateBuyerTaxId(country: CountryCode, buyer?: Party): { valid: boolean; error?: string } {
  const rule = TAX_2025[country];
  if (rule.buyerTaxIdRequired) {
    if (!buyer) {
      return { valid: false, error: `Buyer information is required for ${country} invoices` };
    }
    if (!buyer.taxId || buyer.taxId.trim() === "") {
      return { valid: false, error: `Buyer Tax ID is required for ${country} invoices per ${rule.legalNotes[0]}` };
    }
  }
  return { valid: true };
}

const invoiceItemSchema = z.object({
  sku: z.string(),
  description: z.string(),
  qty: z.number().positive(),
  price: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
});

const partySchema = z.object({
  name: z.string(),
  legalName: z.string().optional(),
  taxId: z.string().optional(),
  regId: z.string().optional(),
  address: z.object({
    line1: z.string(),
    city: z.string(),
    postal: z.string().optional(),
    country: z.string(),
  }),
});

const createInvoiceSchema = z.object({
  country: z.enum(["AU", "UAE", "KSA", "IL", "EU", "OTHER"]),
  supplier: partySchema.optional(),
  buyer: partySchema.optional(),
  items: z.array(invoiceItemSchema).min(1),
  channel: z.enum(["IN_STORE", "MOBILE", "KIOSK", "DELIVERY"]),
  customerId: z.string().optional(),
  locationId: z.string().optional(),
  employeeId: z.string().optional(),
  posSessionId: z.string().optional(),
  paymentMethod: z.enum(["card", "cash", "mobile", "points"]).optional(),
});

router.get("/tax-rules", (req, res) => {
  res.json({
    rules: TAX_2025,
    countries: Object.keys(TAX_2025),
  });
});

router.get("/tax-rules/:country", (req, res) => {
  const country = req.params.country.toUpperCase() as CountryCode;
  const rule = TAX_2025[country];
  
  if (!rule) {
    return res.status(404).json({ error: "Country not found" });
  }
  
  res.json({
    country,
    rule,
    supplier: DEFAULT_SUPPLIER[country],
  });
});

router.post("/create", async (req, res) => {
  try {
    const data = createInvoiceSchema.parse(req.body);
    
    const buyerValidation = validateBuyerTaxId(data.country, data.buyer);
    if (!buyerValidation.valid) {
      return res.status(400).json({ 
        error: "Compliance validation failed", 
        details: buyerValidation.error 
      });
    }
    
    const supplier = data.supplier || DEFAULT_SUPPLIER[data.country];
    const buyer = data.buyer;
    
    const invoice = createInvoice2025(
      data.country,
      supplier,
      buyer,
      data.items,
      data.channel
    );
    
    invoice.id = randomUUID();
    
    const stored = toStoredInvoice(invoice, {
      customerId: data.customerId,
      locationId: data.locationId,
      employeeId: data.employeeId,
      posSessionId: data.posSessionId,
      paymentMethod: data.paymentMethod,
      zatcaStatus: data.country === "KSA" ? "pending" : undefined,
    });
    
    res.json({
      invoice: stored,
      renders: {
        mobile: renderMobile2025(invoice),
        a4: renderA4_2025(invoice),
        pos: renderPOS2025(invoice),
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post("/preview", (req, res) => {
  try {
    const data = createInvoiceSchema.parse(req.body);
    
    const buyerValidation = validateBuyerTaxId(data.country, data.buyer);
    if (!buyerValidation.valid) {
      return res.status(400).json({ 
        error: "Compliance validation failed", 
        details: buyerValidation.error 
      });
    }
    
    const supplier = data.supplier || DEFAULT_SUPPLIER[data.country];
    const buyer = data.buyer;
    
    const invoice = createInvoice2025(
      data.country,
      supplier,
      buyer,
      data.items,
      data.channel
    );
    
    invoice.id = randomUUID();
    
    const format = req.query.format || "mobile";
    
    let html: string;
    switch (format) {
      case "a4":
        html = renderA4_2025(invoice);
        break;
      case "pos":
        res.setHeader("Content-Type", "text/plain");
        return res.send(renderPOS2025(invoice));
      default:
        html = renderMobile2025(invoice);
    }
    
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get("/suppliers", (req, res) => {
  res.json({
    suppliers: DEFAULT_SUPPLIER,
    countries: Object.keys(DEFAULT_SUPPLIER),
  });
});

router.get("/suppliers/:country", (req, res) => {
  const country = req.params.country.toUpperCase() as CountryCode;
  const supplier = DEFAULT_SUPPLIER[country];
  
  if (!supplier) {
    return res.status(404).json({ error: "Country not found" });
  }
  
  res.json({
    country,
    supplier,
    taxRule: TAX_2025[country],
  });
});

const quickInvoiceSchema = z.object({
  country: z.enum(["AU", "UAE", "KSA", "IL", "EU", "OTHER"]),
  items: z.array(z.object({
    description: z.string(),
    qty: z.number().positive(),
    price: z.number().positive(),
  })).min(1),
  channel: z.enum(["IN_STORE", "MOBILE", "KIOSK", "DELIVERY"]).default("KIOSK"),
});

router.post("/quick", (req, res) => {
  try {
    const data = quickInvoiceSchema.parse(req.body);
    
    const supplier = DEFAULT_SUPPLIER[data.country];
    const uniqueId = randomUUID();
    
    const items: InvoiceItem[] = data.items.map((item, index) => ({
      sku: `ITEM-${uniqueId.slice(0, 8)}-${index}`,
      description: item.description,
      qty: item.qty,
      price: item.price,
    }));
    
    const invoice = createInvoice2025(
      data.country,
      supplier,
      undefined,
      items,
      data.channel
    );
    
    invoice.id = uniqueId;
    
    res.json({
      invoice,
      receipt: renderMobile2025(invoice),
      thermal: renderPOS2025(invoice),
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
