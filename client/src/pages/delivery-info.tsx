import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Download, Truck, Heart, Newspaper, Smartphone, AlertTriangle, Shield, Globe } from "lucide-react";

export default function DeliveryInfoPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNav />
      
      <style>{`
        .ess-section {
          max-width: 960px;
          margin: 60px auto;
          padding: 0 18px;
        }
        .ess-title {
          font-family: "Playfair Display", "Times New Roman", serif;
          font-size: 28px;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
        }
        .ess-subtitle {
          font-family: "Playfair Display", "Times New Roman", serif;
          font-size: 20px;
          margin-top: 26px;
          margin-bottom: 10px;
        }
        .ess-subtitle.small {
          font-size: 17px;
        }
        .ess-lead {
          font-size: 15px;
          line-height: 1.7;
          max-width: 640px;
          margin-bottom: 18px;
          color: #444;
        }
        .ess-list {
          list-style: disc;
          padding-left: 20px;
          font-size: 14px;
          line-height: 1.7;
          color: #333;
        }
        .ess-list.ordered {
          list-style: decimal;
        }
        .ess-list li {
          margin-bottom: 6px;
        }
        .ess-note {
          font-size: 13px;
          color: rgba(0,0,0,0.7);
          margin-top: 10px;
        }
        .ess-warning {
          font-size: 13px;
          color: #b06a36;
          border-left: 3px solid #b06a36;
          padding-left: 10px;
          margin-top: 12px;
          background: rgba(176, 106, 54, 0.05);
          padding: 12px 14px;
          border-radius: 0 8px 8px 0;
        }
        .ess-warning.strong {
          font-weight: 600;
          background: rgba(176, 106, 54, 0.08);
        }
        .ess-downloads {
          list-style: none;
          padding-left: 0;
        }
        .ess-downloads li + li {
          margin-top: 8px;
        }
        .ess-downloads a {
          font-size: 14px;
          text-decoration: none;
          border-bottom: 1px solid rgba(180,139,59,0.6);
          color: #333;
          transition: color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .ess-downloads a:hover {
          color: #b48b3b;
        }
        .ess-nutrition-table-wrapper {
          overflow-x: auto;
          margin-top: 10px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.08);
        }
        .ess-nutrition-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .ess-nutrition-table th {
          background: #fafafa;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.05em;
        }
        .ess-nutrition-table th,
        .ess-nutrition-table td {
          border: 1px solid rgba(0,0,0,0.08);
          padding: 10px 12px;
          text-align: left;
        }
        .ess-nutrition-table tbody tr:hover {
          background: rgba(212, 175, 55, 0.04);
        }
        .ess-delivery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 26px;
          margin-top: 18px;
        }
        .ess-delivery-column {
          background: #fafafa;
          border-radius: 18px;
          padding: 24px;
          border: 1px solid rgba(0,0,0,0.06);
        }
        .ess-delivery-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;
        }
        .ess-delivery-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.16);
          font-size: 13px;
          text-decoration: none;
          color: #333;
          background: white;
          transition: all 0.2s ease;
          font-family: "Playfair Display", serif;
        }
        .ess-delivery-btn:hover {
          border-color: #b48b3b;
          color: #b48b3b;
        }
        .ess-delivery-btn.primary {
          border-color: #b48b3b;
          background: linear-gradient(135deg, #d4af37 0%, #b48b3b 100%);
          color: white;
        }
        .ess-delivery-btn.primary:hover {
          opacity: 0.9;
          color: white;
        }
        .ess-charity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 18px;
        }
        .ess-charity-card {
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.08);
          padding: 22px;
          background: white;
        }
        .ess-news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-top: 18px;
        }
        .ess-news-item {
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.08);
          padding: 20px;
          background: white;
          transition: border-color 0.2s ease;
        }
        .ess-news-item:hover {
          border-color: rgba(180, 139, 59, 0.3);
        }
        .ess-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent);
          margin: 50px 0;
        }
        .ess-icon-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .ess-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 139, 59, 0.1) 100%);
          color: #b48b3b;
        }
      `}</style>

      <main className="flex-1 mt-8">
        
        {/* 1. ALLERGY & NUTRITION SECTION */}
        <section id="allergy" className="ess-section" data-testid="section-allergy">
          <div className="ess-icon-header">
            <div className="ess-icon-circle">
              <Shield size={20} />
            </div>
            <h1 className="ess-title" style={{ marginBottom: 0 }}>Allergy &amp; Nutrition Information</h1>
          </div>

          <p className="ess-lead">
            Your safety is a priority. Our frozen yogurt and toppings may contain or come into
            contact with common allergens. Please read this information carefully and always
            speak with a team member before ordering if you have any allergy or medical condition.
          </p>

          <h2 className="ess-subtitle">Key Allergens</h2>
          <p className="text-sm text-neutral-600 mb-3">
            Our products and toppings may contain or come into contact with:
          </p>
          <ul className="ess-list">
            <li>Milk and dairy</li>
            <li>Nuts and peanuts</li>
            <li>Gluten and wheat</li>
            <li>Soy</li>
            <li>Eggs</li>
            <li>Sesame</li>
            <li>Coconut and other tree nuts</li>
          </ul>

          <p className="ess-note">
            We follow strict hygiene procedures, but we cannot guarantee that any item is completely
            free from traces of allergens.
          </p>

          <h2 className="ess-subtitle">How to Order Safely</h2>
          <ol className="ess-list ordered">
            <li>Always tell our staff about your allergies before you choose a flavour or toppings.</li>
            <li>Ask to see the latest allergen and ingredient sheet for your location.</li>
            <li>If you are highly sensitive or have a history of anaphylaxis, do not use self-serve areas. Ask staff for assistance and consider avoiding consumption if you are unsure.</li>
            <li>If you are unsure whether an item is safe for you, please do not consume it.</li>
          </ol>

          <h2 className="ess-subtitle">Downloadable Guides</h2>
          <ul className="ess-downloads">
            <li>
              <a href="/docs/allergen-guide-en.pdf" target="_blank" data-testid="download-allergen-en">
                <Download size={16} />
                Allergen &amp; Ingredient Guide - English (PDF)
              </a>
            </li>
            <li>
              <a href="/docs/allergen-guide-ar.pdf" target="_blank" data-testid="download-allergen-ar">
                <Download size={16} />
                دليل مسببات الحساسية - العربية (PDF)
              </a>
            </li>
            <li>
              <a href="/docs/nutrition-guide-en.pdf" target="_blank" data-testid="download-nutrition-en">
                <Download size={16} />
                Nutrition Facts by Flavour - English (PDF)
              </a>
            </li>
            <li>
              <a href="/docs/nutrition-guide-ar.pdf" target="_blank" data-testid="download-nutrition-ar">
                <Download size={16} />
                جدول المعلومات الغذائية حسب النكهة - العربية (PDF)
              </a>
            </li>
          </ul>

          <h2 className="ess-subtitle">Important Warnings</h2>
          <p className="ess-warning">
            <strong>Cross contamination can occur.</strong> Ingredients may change and suppliers may vary by country.
            We make every reasonable effort to provide accurate and up to date allergen information,
            but we cannot guarantee the complete absence of allergens.
          </p>

          <p className="ess-warning strong">
            <AlertTriangle size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            If you have a life-threatening allergy or a history of anaphylaxis, do not use the
            self-serve machines or shared toppings stations. Speak with our staff first and
            follow the advice of your medical professional.
          </p>
        </section>

        {/* 2. NUTRITION TABLE PREVIEW */}
        <section id="nutrition-preview" className="ess-section" data-testid="section-nutrition">
          <h2 className="ess-subtitle" style={{ marginTop: 0 }}>Example Nutrition Information per 100g</h2>

          <div className="ess-nutrition-table-wrapper">
            <table className="ess-nutrition-table">
              <thead>
                <tr>
                  <th>Flavour</th>
                  <th>Energy (kcal)</th>
                  <th>Protein (g)</th>
                  <th>Fat (g)</th>
                  <th>Carbohydrates (g)</th>
                  <th>Sugars (g)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Coconut Cloud</td>
                  <td>120</td>
                  <td>3.0</td>
                  <td>3.5</td>
                  <td>19.0</td>
                  <td>16.0</td>
                </tr>
                <tr>
                  <td>Pure Mango</td>
                  <td>110</td>
                  <td>2.8</td>
                  <td>2.0</td>
                  <td>21.0</td>
                  <td>18.0</td>
                </tr>
                <tr>
                  <td>Açai Dream</td>
                  <td>115</td>
                  <td>2.6</td>
                  <td>3.0</td>
                  <td>20.0</td>
                  <td>17.0</td>
                </tr>
                <tr>
                  <td>Pistachio Delight</td>
                  <td>125</td>
                  <td>3.2</td>
                  <td>4.0</td>
                  <td>18.0</td>
                  <td>15.0</td>
                </tr>
                <tr>
                  <td>Classic Vanilla</td>
                  <td>105</td>
                  <td>2.9</td>
                  <td>2.5</td>
                  <td>18.5</td>
                  <td>16.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="ess-note">
            Values are examples only. Each country will update this table with local lab-tested values
            and keep the downloadable PDF in sync with current recipes.
          </p>
        </section>

        <div className="ess-divider" style={{ maxWidth: 960, margin: '50px auto' }}></div>

        {/* 3. DELIVERY PLATFORM SECTION */}
        <section id="delivery" className="ess-section" data-testid="section-delivery">
          <div className="ess-icon-header">
            <div className="ess-icon-circle">
              <Truck size={20} />
            </div>
            <h1 className="ess-title" style={{ marginBottom: 0 }}>Order From Home</h1>
          </div>
          <p className="ess-lead">
            Enjoy our frozen yogurt at home through selected delivery partners in each region.
            Availability and menus may vary by location.
          </p>

          <div className="ess-delivery-grid">
            <div className="ess-delivery-column">
              <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>United Arab Emirates</h2>
              <p className="ess-note" style={{ marginTop: 0 }}>Dubai and selected Emirates</p>
              <div className="ess-delivery-buttons">
                <a href="#" className="ess-delivery-btn primary" data-testid="btn-deliveroo">
                  Deliveroo
                </a>
                <a href="#" className="ess-delivery-btn" data-testid="btn-talabat">
                  Talabat
                </a>
                <a href="#" className="ess-delivery-btn" data-testid="btn-careem">
                  Careem Food
                </a>
              </div>
            </div>

            <div className="ess-delivery-column">
              <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>Saudi Arabia</h2>
              <p className="ess-note" style={{ marginTop: 0 }}>Riyadh, Jeddah and selected cities</p>
              <div className="ess-delivery-buttons">
                <a href="#" className="ess-delivery-btn primary" data-testid="btn-chefz">
                  The Chefz
                </a>
                <a href="#" className="ess-delivery-btn" data-testid="btn-hungerstation">
                  HungerStation
                </a>
                <a href="#" className="ess-delivery-btn" data-testid="btn-jahez">
                  Jahez
                </a>
              </div>
            </div>
          </div>

          <p className="ess-note" style={{ marginTop: 20 }}>
            Links will be activated as each partner goes live. Delivery fees, order minimums and
            promotions are set by the delivery platforms.
          </p>
        </section>

        <div className="ess-divider" style={{ maxWidth: 960, margin: '50px auto' }}></div>

        {/* TAKE HOME TUBS SECTION */}
        <section id="take-home" className="ess-section" data-testid="section-takehome">
          <div className="ess-icon-header">
            <div className="ess-icon-circle">
              <Globe size={20} />
            </div>
            <h1 className="ess-title" style={{ marginBottom: 0 }}>Take Home Tubs</h1>
          </div>
          <p className="ess-lead">
            Enjoy the Essence experience at home. Our premium Greek-style frozen yogurt is available 
            in smooth, scoopable tubs — perfect for desserts, smoothie bowls, or a luxurious treat.
          </p>

          {/* Tub Size Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 24 }}>
            
            {/* 500ml Tub */}
            <div style={{ 
              background: 'white', 
              borderRadius: 16, 
              border: '1px solid rgba(0,0,0,0.08)', 
              padding: 20,
              transition: 'all 0.2s ease'
            }} className="hover:border-[#b48b3b]/30">
              <div style={{ 
                width: 48, height: 48, 
                borderRadius: 12, 
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 139, 59, 0.1) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
                fontSize: 20, fontWeight: 600, color: '#b48b3b'
              }}>
                500
              </div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, marginBottom: 6 }}>500ml Tub</h3>
              <p className="ess-note" style={{ marginTop: 0, marginBottom: 10 }}>Personal size — 3-4 servings</p>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                <strong>Choose 1 flavour:</strong><br />
                Original Tart, Mango, Wild Berry, Coconut Cloud, Pistachio, Vanilla Bean
              </div>
              <div style={{ 
                marginTop: 12, 
                padding: '8px 12px', 
                background: '#fafafa', 
                borderRadius: 8, 
                fontSize: 11, 
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Coming to retail
              </div>
            </div>

            {/* 1kg Tub */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, white 100%)', 
              borderRadius: 16, 
              border: '2px solid #b48b3b', 
              padding: 20,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: -10, right: 16,
                background: 'linear-gradient(135deg, #d4af37 0%, #b48b3b 100%)',
                color: 'white', fontSize: 9, fontWeight: 600,
                padding: '4px 10px', borderRadius: 999,
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                Popular
              </div>
              <div style={{ 
                width: 48, height: 48, 
                borderRadius: 12, 
                background: 'linear-gradient(135deg, #d4af37 0%, #b48b3b 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
                fontSize: 18, fontWeight: 600, color: 'white'
              }}>
                1kg
              </div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, marginBottom: 6 }}>1 Kilo Tub</h3>
              <p className="ess-note" style={{ marginTop: 0, marginBottom: 10 }}>Party size — 8-10 servings</p>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                <strong>Choose 1-2 flavours:</strong><br />
                All signature flavours available + limited editions
              </div>
              <div style={{ 
                marginTop: 12, 
                padding: '8px 12px', 
                background: 'rgba(180, 139, 59, 0.1)', 
                borderRadius: 8, 
                fontSize: 11, 
                color: '#b48b3b',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Order via delivery apps
              </div>
            </div>

            {/* 2.5L Tub */}
            <div style={{ 
              background: 'white', 
              borderRadius: 16, 
              border: '1px solid rgba(0,0,0,0.08)', 
              padding: 20 
            }} className="hover:border-[#b48b3b]/30">
              <div style={{ 
                width: 48, height: 48, 
                borderRadius: 12, 
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 139, 59, 0.1) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
                fontSize: 16, fontWeight: 600, color: '#b48b3b'
              }}>
                2.5L
              </div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, marginBottom: 6 }}>2.5 Litre Tub</h3>
              <p className="ess-note" style={{ marginTop: 0, marginBottom: 10 }}>Family size — 20-25 servings</p>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                <strong>Choose up to 3 flavours:</strong><br />
                Mix your favourites for the whole family
              </div>
              <div style={{ 
                marginTop: 12, 
                padding: '8px 12px', 
                background: '#fafafa', 
                borderRadius: 8, 
                fontSize: 11, 
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Minimum 2 tubs
              </div>
            </div>

            {/* 5L Catering */}
            <div style={{ 
              background: 'white', 
              borderRadius: 16, 
              border: '1px solid rgba(0,0,0,0.08)', 
              padding: 20 
            }} className="hover:border-[#b48b3b]/30">
              <div style={{ 
                width: 48, height: 48, 
                borderRadius: 12, 
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 139, 59, 0.1) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
                fontSize: 18, fontWeight: 600, color: '#b48b3b'
              }}>
                5L
              </div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, marginBottom: 6 }}>5 Litre Catering</h3>
              <p className="ess-note" style={{ marginTop: 0, marginBottom: 10 }}>Event size — 40-50 servings</p>
              <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                <strong>Choose up to 4 flavours:</strong><br />
                Perfect for weddings, corporate, and large events
              </div>
              <div style={{ 
                marginTop: 12, 
                padding: '8px 12px', 
                background: '#fafafa', 
                borderRadius: 8, 
                fontSize: 11, 
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                48h advance order
              </div>
            </div>
          </div>

          {/* Available Flavours */}
          <div style={{ marginTop: 30, padding: 24, background: '#fafafa', borderRadius: 18, border: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>Available Flavours for Take Home</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginTop: 14 }}>
              {[
                { name: 'Original Tart', tag: 'Classic' },
                { name: 'Mango', tag: 'Tropical' },
                { name: 'Wild Berry', tag: 'Fruity' },
                { name: 'Coconut Cloud', tag: 'Vegan' },
                { name: 'Pistachio', tag: 'Premium' },
                { name: 'Vanilla Bean', tag: 'Classic' },
                { name: 'Salted Caramel', tag: 'Indulgent' },
                { name: 'Chocolate', tag: 'Rich' },
              ].map((flavour) => (
                <div key={flavour.name} style={{ 
                  padding: '10px 14px', 
                  background: 'white', 
                  borderRadius: 10, 
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontSize: 13
                }}>
                  <span style={{ fontWeight: 500 }}>{flavour.name}</span>
                  <span style={{ 
                    display: 'block', 
                    fontSize: 10, 
                    color: '#b48b3b', 
                    marginTop: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>{flavour.tag}</span>
                </div>
              ))}
            </div>
            <p className="ess-note" style={{ marginTop: 14 }}>
              Seasonal and limited edition flavours available. All tubs are scoopable Greek-style frozen yogurt.
            </p>
          </div>

          {/* Corporate & Bulk Orders */}
          <div style={{ marginTop: 24, padding: 24, background: 'white', borderRadius: 18, border: '2px solid rgba(180, 139, 59, 0.2)' }}>
            <h2 className="ess-subtitle small" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ 
                padding: '3px 8px', 
                background: 'linear-gradient(135deg, #d4af37 0%, #b48b3b 100%)',
                color: 'white',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Corporate</span>
              Bulk Orders &amp; Recurring Delivery
            </h2>
            <p className="text-sm text-neutral-600 mb-3">
              Perfect for offices, hotels, restaurants, and regular home delivery. Set up automatic 
              weekly or monthly orders with preferred flavours and quantities.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 14 }}>
              <div style={{ padding: 12, background: '#fafafa', borderRadius: 10, fontSize: 13 }}>
                <strong style={{ color: '#333' }}>Hotels &amp; Restaurants</strong>
                <p style={{ fontSize: 11, color: '#888', marginTop: 4, marginBottom: 0 }}>Wholesale pricing available</p>
              </div>
              <div style={{ padding: 12, background: '#fafafa', borderRadius: 10, fontSize: 13 }}>
                <strong style={{ color: '#333' }}>Office Accounts</strong>
                <p style={{ fontSize: 11, color: '#888', marginTop: 4, marginBottom: 0 }}>Monthly billing &amp; delivery</p>
              </div>
              <div style={{ padding: 12, background: '#fafafa', borderRadius: 10, fontSize: 13 }}>
                <strong style={{ color: '#333' }}>Events &amp; Weddings</strong>
                <p style={{ fontSize: 11, color: '#888', marginTop: 4, marginBottom: 0 }}>Custom flavour selection</p>
              </div>
            </div>
            <p className="ess-note" style={{ marginTop: 14 }}>
              Contact <a href="mailto:orders@essenceyogurt.com" className="text-[#b48b3b] hover:underline font-medium">orders@essenceyogurt.com</a> for corporate pricing and recurring delivery setup.
            </p>
          </div>
        </section>

        <div className="ess-divider" style={{ maxWidth: 960, margin: '50px auto' }}></div>

        {/* 4. GLOBAL CHARITY - PETS & HUMANS */}
        <section id="charity" className="ess-section" data-testid="section-charity">
          <div className="ess-icon-header">
            <div className="ess-icon-circle">
              <Heart size={20} />
            </div>
            <h1 className="ess-title" style={{ marginBottom: 0 }}>Essence Cares</h1>
          </div>
          <p className="ess-lead">
            Essence Cares is our long-term commitment to supporting people, animals and the
            communities around our stores.
          </p>

          <div className="ess-charity-grid">
            <div className="ess-charity-card">
              <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>Humans</h2>
              <ul className="ess-list">
                <li>Partnering with local charities that support children, families and education.</li>
                <li>Supporting wellness and sport initiatives for youth where possible.</li>
                <li>Occasional campaigns during Ramadan and other key seasons in collaboration with approved partners.</li>
              </ul>
            </div>
            <div className="ess-charity-card">
              <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>Pets</h2>
              <ul className="ess-list">
                <li>Exploring collaborations with registered animal welfare organisations.</li>
                <li>Awareness campaigns that encourage kind and responsible treatment of animals.</li>
                <li>Selected projects that support shelter adoptions and veterinary care through approved partners.</li>
              </ul>
            </div>
          </div>

          <p className="ess-note" style={{ marginTop: 16 }}>
            All initiatives are subject to local regulations and will be announced on our News &amp; Updates page.
            We do not collect donations directly from customers without clear communication and approvals.
          </p>
        </section>

        <div className="ess-divider" style={{ maxWidth: 960, margin: '50px auto' }}></div>

        {/* 5. NEWS & UPDATES */}
        <section id="news" className="ess-section" data-testid="section-news">
          <div className="ess-icon-header">
            <div className="ess-icon-circle">
              <Newspaper size={20} />
            </div>
            <h1 className="ess-title" style={{ marginBottom: 0 }}>News &amp; Updates</h1>
          </div>
          <p className="ess-lead">
            Follow our journey as we open new locations, launch seasonal collections and
            collaborate with airports, malls and partners around the world.
          </p>

          <div className="ess-news-grid">
            <article className="ess-news-item">
              <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>Store Openings</h2>
              <p className="ess-note" style={{ marginTop: 6 }}>
                Announcements for new locations in airports, malls and city districts. Each post includes
                photos, maps and local language details.
              </p>
            </article>

            <article className="ess-news-item">
              <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>Seasonal Flavours</h2>
              <p className="ess-note" style={{ marginTop: 6 }}>
                Limited collections for occasions such as Ramadan, Eid, summer launches and
                local holidays, with clear dates and availability.
              </p>
            </article>

            <article className="ess-news-item">
              <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>Airport &amp; Mall Partnerships</h2>
              <p className="ess-note" style={{ marginTop: 6 }}>
                News about new airport terminals, concourse locations and premium mall spaces where
                our concept is introduced.
              </p>
            </article>

            <article className="ess-news-item">
              <h2 className="ess-subtitle small" style={{ marginTop: 0 }}>Press &amp; Awards</h2>
              <p className="ess-note" style={{ marginTop: 6 }}>
                Coverage from media, interviews with the founder and any awards or recognitions
                the brand receives.
              </p>
            </article>
          </div>
        </section>

        <div className="ess-divider" style={{ maxWidth: 960, margin: '50px auto' }}></div>

        {/* 6. FUTURE NATIVE APP TEASER */}
        <section id="app" className="ess-section" data-testid="section-app" style={{ marginBottom: 80 }}>
          <div className="ess-icon-header">
            <div className="ess-icon-circle">
              <Smartphone size={20} />
            </div>
            <h1 className="ess-title" style={{ marginBottom: 0 }}>Mobile App — Coming Soon</h1>
          </div>
          <p className="ess-lead">
            Our dedicated mobile app is in development. It will bring together loyalty, wallet cards,
            receipts and personalised offers in one luxury experience.
          </p>

          <ul className="ess-list">
            <li>Digital membership card with Apple Wallet and Google Wallet support</li>
            <li>QR-based loyalty for all locations, with cross-country points logic</li>
            <li>Multi-language and multi-currency support</li>
            <li>Store finder with live opening hours and airport terminal information</li>
            <li>Secure profile with order history and receipts</li>
            <li>Optional push notifications for product launches and local events</li>
          </ul>

          <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ 
              padding: '12px 20px', 
              background: '#000', 
              color: '#fff', 
              borderRadius: 10, 
              fontSize: 13,
              fontFamily: '"Playfair Display", serif',
              opacity: 0.5
            }}>
              App Store — Coming Soon
            </div>
            <div style={{ 
              padding: '12px 20px', 
              background: '#000', 
              color: '#fff', 
              borderRadius: 10, 
              fontSize: 13,
              fontFamily: '"Playfair Display", serif',
              opacity: 0.5
            }}>
              Google Play — Coming Soon
            </div>
          </div>

          <p className="ess-note" style={{ marginTop: 16 }}>
            Exact launch dates and countries will be announced on our News &amp; Updates page and
            through our official channels.
          </p>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
