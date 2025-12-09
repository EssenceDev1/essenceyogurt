/*
====================================================================
ESSENCE YOGURT GLOBAL LEGAL PROTECTION SUITE (2025)
One file for:
- Website
- Mobile app (iOS + Android)
- Kiosk
- POS system
- E gift portal
- Franchise portal
Pure white background requirement honored.
====================================================================
*/

export const EssenceLegalSuite = {

  allergyWarning: `Essence Yogurt serves products that may contain or come into contact with:
- Dairy
- Nuts (including peanuts, pistachio, almond and hazelnut)
- Soy
- Eggs
- Gluten
- Chocolate
- Coconut
- Fruit mixes with possible seeds

Cross contamination may occur even when ingredients are separated. Customers with allergies are responsible for checking ingredients before consuming. Essence Yogurt is not responsible for reactions caused by known or unknown allergies.`,

  foodSafetyDisclaimer: `All products are handled according to food safety regulations in the region of operation. Essence Yogurt follows strict hygiene and temperature control protocols however customers consume products at their own risk. Storage, topping selection and self serve actions are performed by the customer. Essence Yogurt does not accept responsibility for illness caused by mishandling of products by customers or third parties.`,

  selfServeResponsibility: `Essence Yogurt uses a self serve model. Customers are responsible for:
- Selecting yogurt and toppings
- Portion sizes
- Avoiding cross contamination
- Using clean cups
- Handling food safely

By using the self serve stations, customers accept full responsibility for their choices and actions.`,

  liabilityClause: `To the maximum extent permitted by applicable law, Essence Yogurt, its directors, employees, contractors and partners are not liable for:
- Allergic reactions
- Illness caused by third party ingredients
- Contamination caused by customer actions
- Accidental spillage or injury on premises
- Mobile app errors
- POS or payment failures
- Incorrect use of equipment

Liability is limited to the minimum required under local law in each operating country.`,

  refundPolicy: `All purchases are final. No refunds or exchanges are provided on yogurt, toppings or e gift cards unless required by law. Weight based purchases cannot be returned once dispensed. E gift cards are single use, non transferable and non refundable.`,

  privacyPolicy: `Essence Yogurt collects and processes data in accordance with:
- Saudi PDPL (2024)
- UAE Federal PDPL
- Israel PPL Amendment 13 (2025)
- EU GDPR
- Australian Privacy Act 2025 reforms

Data collected includes:
- Name, email, phone
- Payment confirmations
- Loyalty activity
- Device info
- Location (optional)

Data is stored securely on encrypted servers and used for:
- Loyalty functionality
- Order history
- Customer service
- AI based improvements

No personal data is sold. Customers may request data access or deletion in app.`,

  customerTerms: `By using Essence Yogurt stores, website or mobile app, customers agree to:
- Accurate information during sign up
- Lawful use of services
- Non transfer of e gift cards
- No misuse of loyalty points
- Respectful conduct on premises`,

  eGiftTerms: `Essence Yogurt e gift cards are:
- Single use only
- Not transferable
- Not redeemable for cash
- Valid only at participating locations
- Not replaceable if lost or stolen`,

  franchiseLegal: `Franchise opportunities are subject to approval. Submitting an inquiry does not guarantee approval. Essence Yogurt reserves the right to decline applicants without providing reasons. All franchise agreements require legal review and compliance with local regulations in the target country.`,

  websiteDisclaimer: `The content on essenceyogurt.com is provided for general information only. No warranty is provided for accuracy. Essence Yogurt is not responsible for loss caused by reliance on website content or technical errors.`,

  kioskDisclaimer: `At 24 hour self serve kiosks, customers are responsible for hygiene, food handling and product usage. Staff may not be available. Emergency numbers are displayed. By using the kiosk, the customer accepts full responsibility for their actions.`,

  paymentClause: `Essence Yogurt accepts digital payments through approved processors such as Checkout.com, Stripe, Apple Pay, Google Pay, Visa, Mastercard and Amex. Failed transactions are handled by the payment provider. Essence Yogurt does not store credit card numbers.`,

  intellectualProperty: `All logos, designs, images, brand marks and technology used by Essence Yogurt including the Octopus Brain system are protected intellectual property. Unauthorized use is prohibited.`,

  governingLaw: `Laws applicable depend on the location of the store. For online usage, laws of the customer's country may also apply.`,

  menuLinks: [
    { name: "Allergy Warning", path: "/legal/allergy" },
    { name: "Food Safety", path: "/legal/food-safety" },
    { name: "Terms and Conditions", path: "/legal/terms" },
    { name: "Privacy Policy", path: "/legal/privacy" },
    { name: "Refund Policy", path: "/legal/refunds" },
    { name: "E-Gift Terms", path: "/legal/egift-terms" },
    { name: "Franchise Legal", path: "/legal/franchise" },
    { name: "Disclaimer", path: "/legal/disclaimer" },
    { name: "Contact Support", path: "/contact" }
  ],

  regionSpecific: {
    saudiArabia: {
      dataProtection: "Saudi Personal Data Protection Law (PDPL 2024)",
      language: "Arabic version available",
      currency: "SAR"
    },
    uae: {
      dataProtection: "UAE Federal PDPL",
      language: "Arabic version available",
      currency: "AED"
    },
    israel: {
      dataProtection: "Israel Protection of Privacy Law (PPL) Amendment 13 (2025)",
      language: "Hebrew version available",
      currency: "ILS"
    },
    greece: {
      dataProtection: "EU GDPR",
      language: "Greek version available",
      currency: "EUR"
    },
    australia: {
      dataProtection: "Australian Privacy Act 2025 reforms",
      language: "English",
      currency: "AUD"
    }
  }
};

export type LegalSection = keyof typeof EssenceLegalSuite;
