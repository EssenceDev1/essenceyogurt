// EssenceYogurtDashboard.tsx
// Luxury dashboard + loyalty program for Essence Yogurt
// Drop into a React or Next app and wire real APIs later.

// Imports
import React, { useState } from "react";
import { IceCream } from "lucide-react";

// Types
type Currency = "AED" | "USD" | "AUD" | "EUR" | "GBP" | "SAR" | "ILS";

type LoyaltyTierId = "member" | "silver" | "gold" | "black";

interface LoyaltyTier {
  id: LoyaltyTierId;
  name: string;
  minPoints: number;
  benefits: string[];
  highlight?: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  country: string;
  city?: string;
  points: number;
  tierId: LoyaltyTierId;
  birthday?: string;
  totalSpend: number;
  lastVisit: string;
  preferredCurrency: Currency;
}

interface Coupon {
  code: string;
  description: string;
  discountType: "percent" | "fixed";
  value: number;
  active: boolean;
  expiresAt?: string;
  usageCount: number;
  maxUsage?: number;
  scope: "all" | "vipOnly" | "firstOrder" | "blackFriday" | "birthday";
}

interface GiftCard {
  code: string;
  balance: number;
  currency: Currency;
  ownerName?: string;
  active: boolean;
  expiresAt?: string;
}

interface InboxMessage {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  tag: "promo" | "system" | "birthday" | "vip";
}

// Mock data - replace with real API calls later
const loyaltyTiers: LoyaltyTier[] = [
  {
    id: "member",
    name: "Essence Member",
    minPoints: 0,
    benefits: [
      "Access to member pricing",
      "Earn points on every purchase",
    ],
  },
  {
    id: "silver",
    name: "Silver Cloud",
    minPoints: 500,
    benefits: [
      "All Member benefits",
      "Priority support",
    ],
  },
  {
    id: "gold",
    name: "Gold Silk",
    minPoints: 1500,
    benefits: [
      "All Silver benefits",
      "Early access to new flavours",
    ],
    highlight: true,
  },
  {
    id: "black",
    name: "Black Signature",
    minPoints: 4000,
    benefits: [
      "All Gold benefits",
      "Invitations to launch events",
    ],
  },
];

const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Sara Al Maktoum",
    email: "sara@example.com",
    country: "UAE",
    city: "Dubai",
    points: 2100,
    tierId: "gold",
    birthday: "1994-03-21",
    totalSpend: 2875,
    lastVisit: "2025-11-28T18:32:00Z",
    preferredCurrency: "AED",
  },
  {
    id: "c2",
    name: "Michael Cohen",
    email: "michael@example.com",
    country: "Israel",
    city: "Tel Aviv",
    points: 4300,
    tierId: "black",
    birthday: "1988-07-10",
    totalSpend: 5120,
    lastVisit: "2025-11-29T11:05:00Z",
    preferredCurrency: "ILS",
  },
  {
    id: "c3",
    name: "Emily Johnson",
    email: "emily@example.com",
    country: "Australia",
    city: "Melbourne",
    points: 340,
    tierId: "member",
    birthday: "1999-01-05",
    totalSpend: 430,
    lastVisit: "2025-11-20T14:10:00Z",
    preferredCurrency: "AUD",
  },
];

const mockCoupons: Coupon[] = [
  {
    code: "WELCOME2025",
    description: "Welcome campaign for new members",
    discountType: "percent",
    value: 0,
    active: true,
    scope: "firstOrder",
    usageCount: 320,
  },
  {
    code: "BLACKFRIDAY24",
    description: "Black Friday campaign for members",
    discountType: "percent",
    value: 0,
    active: true,
    scope: "blackFriday",
    usageCount: 180,
    maxUsage: 2000,
  },
  {
    code: "BIRTHDAY2025",
    description: "Birthday notification for registered members",
    discountType: "fixed",
    value: 0,
    active: true,
    scope: "birthday",
    usageCount: 95,
  },
];

const mockGiftCards: GiftCard[] = [
  {
    code: "GYT-GOLD-001",
    balance: 500,
    currency: "AED",
    ownerName: "Private Client",
    active: true,
  },
  {
    code: "ESS-VIP-IL-2024",
    balance: 250,
    currency: "ILS",
    ownerName: "VIP Member",
    active: true,
  },
];

const mockInboxMessages: InboxMessage[] = [
  {
    id: "m1",
    title: "Welcome to Essence Yogurt",
    preview: "Your member profile is now active.",
    createdAt: "2025-11-28T09:00:00Z",
    tag: "system",
  },
  {
    id: "m2",
    title: "Gold Silk member update",
    preview: "Thank you for being a valued member.",
    createdAt: "2025-11-29T10:22:00Z",
    tag: "vip",
  },
  {
    id: "m3",
    title: "Winter flavours arrive",
    preview: "Cinnamon cream, saffron silk and more have arrived.",
    createdAt: "2025-11-30T16:45:00Z",
    tag: "promo",
  },
];

type NavSection =
  | "overview"
  | "customers"
  | "loyalty"
  | "coupons"
  | "giftCards"
  | "inbox"
  | "settings";

// Utility
function formatCurrency(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toFixed(0)} ${currency}`;
  }
}

function getTier(id: LoyaltyTierId): LoyaltyTier {
  return loyaltyTiers.find((t) => t.id === id) || loyaltyTiers[0];
}

// Main component
export const EssenceYogurtDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    mockCustomers[0]
  );

  const totalMembers = mockCustomers.length;
  const vipMembers = mockCustomers.filter(
    (c) => c.tierId === "gold" || c.tierId === "black"
  ).length;

  const totalGiftCardBalance = mockGiftCards.reduce(
    (sum, gc) => sum + gc.balance,
    0
  );

  const totalCouponUsage = mockCoupons.reduce(
    (sum, c) => sum + c.usageCount,
    0
  );

  return (
    <div style={layout.page}>
      {/* Sidebar */}
      <aside style={layout.sidebar}>
        <div style={layout.brand}>
          <div style={layout.logoCircle}>
            <IceCream className="text-white" size={18} />
          </div>
          <div>
            <div style={layout.brandName}>Essence Yogurt</div>
            <div style={layout.brandTag}>Luxury Soft Serve</div>
          </div>
        </div>

        <nav style={layout.nav}>
          <SidebarItem
            label="Overview"
            active={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
          />
          <SidebarItem
            label="Customers"
            active={activeSection === "customers"}
            onClick={() => setActiveSection("customers")}
          />
          <SidebarItem
            label="Loyalty & Tiers"
            active={activeSection === "loyalty"}
            onClick={() => setActiveSection("loyalty")}
          />
          <SidebarItem
            label="Coupons"
            active={activeSection === "coupons"}
            onClick={() => setActiveSection("coupons")}
          />
          <SidebarItem
            label="Gift Cards"
            active={activeSection === "giftCards"}
            onClick={() => setActiveSection("giftCards")}
          />
          <SidebarItem
            label="Inbox preview"
            active={activeSection === "inbox"}
            onClick={() => setActiveSection("inbox")}
          />
          <SidebarItem
            label="Settings"
            active={activeSection === "settings"}
            onClick={() => setActiveSection("settings")}
          />
        </nav>

        <div style={layout.sidebarFoot}>
          <div style={layout.sidebarFootLabel}>Global admin</div>
          <div style={layout.sidebarFootUser}>Norray Holdings Pty Ltd</div>
        </div>
      </aside>

      {/* Main area */}
      <main style={layout.main}>
        <HeaderBar />

        {activeSection === "overview" && (
          <OverviewSection
            totalMembers={totalMembers}
            vipMembers={vipMembers}
            totalGiftCardBalance={totalGiftCardBalance}
            totalCouponUsage={totalCouponUsage}
          />
        )}

        {activeSection === "customers" && (
          <CustomersSection
            customers={mockCustomers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
          />
        )}

        {activeSection === "loyalty" && (
          <LoyaltySection
            tiersList={loyaltyTiers}
            customers={mockCustomers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
          />
        )}

        {activeSection === "coupons" && (
          <CouponsSection coupons={mockCoupons} />
        )}

        {activeSection === "giftCards" && (
          <GiftCardsSection giftCards={mockGiftCards} />
        )}

        {activeSection === "inbox" && (
          <InboxSection messages={mockInboxMessages} />
        )}

        {activeSection === "settings" && <SettingsSection />}
      </main>
    </div>
  );
};

// Header bar
const HeaderBar: React.FC = () => {
  return (
    <header style={header.bar}>
      <div>
        <div style={header.title}>Essence Yogurt Admin</div>
        <div style={header.subtitle}>
          Luxury dashboard for loyalty, members and offers
        </div>
      </div>
      <div style={header.right}>
        <button style={header.whiteButton}>Preview customer app</button>
        <div style={header.userBadge}>
          <div style={header.userCircle}>AD</div>
          <div>
            <div style={header.userName}>Admin</div>
            <div style={header.userRole}>System Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar item
interface SidebarItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  active,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      ...sidebarItem.base,
      ...(active ? sidebarItem.active : {}),
    }}
  >
    <span>{label}</span>
    {active && <span style={sidebarItem.dot} />}
  </button>
);

// Sections

interface OverviewProps {
  totalMembers: number;
  vipMembers: number;
  totalGiftCardBalance: number;
  totalCouponUsage: number;
}

const OverviewSection: React.FC<OverviewProps> = ({
  totalMembers,
  vipMembers,
  totalGiftCardBalance,
  totalCouponUsage,
}) => {
  return (
    <section>
      <div style={section.titleRow}>
        <h1 style={section.title}>Overview</h1>
        <span style={section.badge}>Live</span>
      </div>

      <div style={cards.grid}>
        <StatCard
          label="Total loyalty members"
          value={totalMembers.toString()}
          hint="Registered in the Essence database"
        />
        <StatCard
          label="VIP members"
          value={vipMembers.toString()}
          hint="Gold Silk and Black Signature"
        />
        <StatCard
          label="Gift card float"
          value={formatCurrency(totalGiftCardBalance, "AED")}
          hint="Outstanding balance across active cards"
        />
        <StatCard
          label="Total coupon uses"
          value={totalCouponUsage.toString()}
          hint="All campaigns combined"
        />
      </div>

      <div style={cards.row}>
        <div style={{ ...cards.block, flex: 2 }}>
          <div style={cards.blockTitleRow}>
            <h2 style={cards.blockTitle}>Loyalty tiers snapshot</h2>
          </div>
          <div style={tierStyles.grid}>
            {loyaltyTiers.map((tier) => (
              <div
                key={tier.id}
                style={{
                  ...tierStyles.card,
                  ...(tier.highlight ? tierStyles.highlightCard : {}),
                }}
              >
                <div style={tierStyles.name}>{tier.name}</div>
                <div style={tierStyles.points}>
                  From {tier.minPoints.toLocaleString()} points
                </div>
                <ul style={tierStyles.benefits}>
                  {tier.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cards.block, flex: 1 }}>
          <div style={cards.blockTitleRow}>
            <h2 style={cards.blockTitle}>Active campaigns</h2>
          </div>
          <ul style={campaign.list}>
            <li style={campaign.item}>
              <div>
                <div style={campaign.name}>Welcome10</div>
                <div style={campaign.desc}>
                  First purchase discount for registered members
                </div>
              </div>
              <span style={campaign.pill}>Always on</span>
            </li>
            <li style={campaign.item}>
              <div>
                <div style={campaign.name}>Birthday gift</div>
                <div style={campaign.desc}>
                  Birthday surprise reward inside personal inbox
                </div>
              </div>
              <span style={campaign.pill}>Targeted</span>
            </li>
            <li style={campaign.item}>
              <div>
                <div style={campaign.name}>VIP private offers</div>
                <div style={campaign.desc}>
                  For Gold Silk and Black Signature members
                </div>
              </div>
              <span style={campaign.pill}>VIP only</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

interface CustomersProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (c: Customer) => void;
}

const CustomersSection: React.FC<CustomersProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
}) => {
  return (
    <section>
      <div style={section.titleRow}>
        <h1 style={section.title}>Customers</h1>
        <div style={section.actions}>
          <button style={section.actionButton}>Export list</button>
          <button style={section.actionButtonSecondary}>Add customer</button>
        </div>
      </div>

      <div style={cards.row}>
        <div style={{ ...cards.block, flex: 2.2 }}>
          <table style={table.base}>
            <thead>
              <tr>
                <th style={table.headCell}>Name</th>
                <th style={table.headCell}>Email</th>
                <th style={table.headCell}>Country</th>
                <th style={table.headCell}>Tier</th>
                <th style={table.headCell}>Points</th>
                <th style={table.headCell}>Last visit</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const tier = getTier(c.tierId);
                const isSelected = selectedCustomer?.id === c.id;
                return (
                  <tr
                    key={c.id}
                    style={{
                      ...table.row,
                      ...(isSelected ? table.rowSelected : {}),
                    }}
                    onClick={() => onSelectCustomer(c)}
                  >
                    <td style={table.cell}>{c.name}</td>
                    <td style={table.cellSub}>{c.email}</td>
                    <td style={table.cell}>{c.country}</td>
                    <td style={table.cellTier}>{tier.name}</td>
                    <td style={table.cell}>{c.points.toLocaleString()}</td>
                    <td style={table.cellSub}>
                      {new Date(c.lastVisit).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ ...cards.block, flex: 1 }}>
          <h2 style={cards.blockTitle}>Customer profile</h2>
          {selectedCustomer ? (
            <CustomerProfileCard customer={selectedCustomer} />
          ) : (
            <div style={empty.state}>
              Select a customer row to view profile details
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const CustomerProfileCard: React.FC<{ customer: Customer }> = ({ customer }) => {
  const tier = getTier(customer.tierId);
  return (
    <div>
      <div style={profile.header}>
        <div style={profile.avatar}>{customer.name[0]}</div>
        <div>
          <div style={profile.name}>{customer.name}</div>
          <div style={profile.email}>{customer.email}</div>
        </div>
      </div>

      <div style={profile.statsRow}>
        <div style={profile.stat}>
          <div style={profile.statLabel}>Tier</div>
          <div style={profile.statValue}>{tier.name}</div>
        </div>
        <div style={profile.stat}>
          <div style={profile.statLabel}>Points</div>
          <div style={profile.statValue}>
            {customer.points.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={profile.statsRow}>
        <div style={profile.stat}>
          <div style={profile.statLabel}>Total spend</div>
          <div style={profile.statValue}>
            {formatCurrency(customer.totalSpend, customer.preferredCurrency)}
          </div>
        </div>
        <div style={profile.stat}>
          <div style={profile.statLabel}>Last visit</div>
          <div style={profile.statValueSmall}>
            {new Date(customer.lastVisit).toLocaleString()}
          </div>
        </div>
      </div>

      <div style={profile.sectionTitle}>Flags</div>
      <ul style={profile.flags}>
        <li>Send birthday surprise if birthday is this month.</li>
        <li>Invite to new flavour launch if VIP.</li>
      </ul>

      <button style={profile.actionButton}>
        Open full personal inbox preview
      </button>
    </div>
  );
};

interface LoyaltySectionProps {
  tiersList: LoyaltyTier[];
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (c: Customer) => void;
}

const LoyaltySection: React.FC<LoyaltySectionProps> = ({
  tiersList,
  customers,
  selectedCustomer,
  onSelectCustomer,
}) => {
  return (
    <section>
      <div style={section.titleRow}>
        <h1 style={section.title}>Loyalty and tiers</h1>
        <div style={section.actions}>
          <button style={section.actionButton}>Edit tier rules</button>
        </div>
      </div>

      <div style={cards.row}>
        <div style={{ ...cards.block, flex: 1.4 }}>
          <h2 style={cards.blockTitle}>Tiers structure</h2>
          <div style={tierStyles.grid}>
            {tiersList.map((tier) => (
              <div
                key={tier.id}
                style={{
                  ...tierStyles.card,
                  ...(tier.highlight ? tierStyles.highlightCard : {}),
                }}
              >
                <div style={tierStyles.name}>{tier.name}</div>
                <div style={tierStyles.points}>
                  From {tier.minPoints.toLocaleString()} points
                </div>
                <ul style={tierStyles.benefits}>
                  {tier.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cards.block, flex: 1.2 }}>
          <h2 style={cards.blockTitle}>Selected member</h2>
          {selectedCustomer ? (
            <CustomerProfileCard customer={selectedCustomer} />
          ) : (
            <div style={empty.state}>
              Select a customer in the list below to adjust tier or points
            </div>
          )}
        </div>
      </div>

      <div style={{ ...cards.block, marginTop: 24 }}>
        <h2 style={cards.blockTitle}>Members list</h2>
        <table style={table.base}>
          <thead>
            <tr>
              <th style={table.headCell}>Name</th>
              <th style={table.headCell}>Tier</th>
              <th style={table.headCell}>Points</th>
              <th style={table.headCell}>Country</th>
              <th style={table.headCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const tier = getTier(c.tierId);
              return (
                <tr key={c.id} style={table.row}>
                  <td style={table.cell}>{c.name}</td>
                  <td style={table.cellTier}>{tier.name}</td>
                  <td style={table.cell}>{c.points.toLocaleString()}</td>
                  <td style={table.cell}>{c.country}</td>
                  <td style={table.cell}>
                    <button
                      style={table.linkButton}
                      type="button"
                      onClick={() => onSelectCustomer(c)}
                    >
                      Open profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={section.note}>
          In real system this table connects to Firestore or Postgres and
          supports search, filter and bulk actions.
        </div>
      </div>
    </section>
  );
};

const CouponsSection: React.FC<{ coupons: Coupon[] }> = ({ coupons }) => {
  return (
    <section>
      <div style={section.titleRow}>
        <h1 style={section.title}>Coupons</h1>
        <div style={section.actions}>
          <button style={section.actionButton}>Create coupon</button>
        </div>
      </div>

      <div style={cards.block}>
        <table style={table.base}>
          <thead>
            <tr>
              <th style={table.headCell}>Code</th>
              <th style={table.headCell}>Description</th>
              <th style={table.headCell}>Type</th>
              <th style={table.headCell}>Value</th>
              <th style={table.headCell}>Status</th>
              <th style={table.headCell}>Scope</th>
              <th style={table.headCell}>Usage</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.code} style={table.row}>
                <td style={table.cellStrong}>{c.code}</td>
                <td style={table.cell}>{c.description}</td>
                <td style={table.cell}>{c.discountType}</td>
                <td style={table.cell}>
                  {c.discountType === "percent"
                    ? `${c.value}%`
                    : formatCurrency(c.value, "AED")}
                </td>
                <td style={table.cell}>
                  <span
                    style={{
                      ...pill.base,
                      ...(c.active ? pill.active : pill.inactive),
                    }}
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={table.cell}>{c.scope}</td>
                <td style={table.cell}>
                  {c.usageCount}
                  {c.maxUsage ? ` / ${c.maxUsage}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={section.note}>
          In real system you also add date ranges, segments, stores and
          integration with payment gateway and Nayax style terminals.
        </div>
      </div>
    </section>
  );
};

const GiftCardsSection: React.FC<{ giftCards: GiftCard[] }> = ({
  giftCards,
}) => {
  return (
    <section>
      <div style={section.titleRow}>
        <h1 style={section.title}>Gift cards</h1>
        <div style={section.actions}>
          <button style={section.actionButton}>Issue gift card</button>
        </div>
      </div>

      <div style={cards.block}>
        <table style={table.base}>
          <thead>
            <tr>
              <th style={table.headCell}>Code</th>
              <th style={table.headCell}>Owner</th>
              <th style={table.headCell}>Balance</th>
              <th style={table.headCell}>Currency</th>
              <th style={table.headCell}>Status</th>
              <th style={table.headCell}>Expires</th>
            </tr>
          </thead>
          <tbody>
            {giftCards.map((g) => (
              <tr key={g.code} style={table.row}>
                <td style={table.cellStrong}>{g.code}</td>
                <td style={table.cell}>{g.ownerName || "Unassigned"}</td>
                <td style={table.cell}>{g.balance.toFixed(0)}</td>
                <td style={table.cell}>{g.currency}</td>
                <td style={table.cell}>
                  <span
                    style={{
                      ...pill.base,
                      ...(g.active ? pill.active : pill.inactive),
                    }}
                  >
                    {g.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={table.cell}>{g.expiresAt || "No expiry"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={section.note}>
          Real system will support direct purchase on website or app, plus
          in-store sale that links card to a loyalty account.
        </div>
      </div>
    </section>
  );
};

const InboxSection: React.FC<{ messages: InboxMessage[] }> = ({
  messages,
}) => {
  return (
    <section>
      <div style={section.titleRow}>
        <h1 style={section.title}>Personal inbox preview</h1>
        <div style={section.actions}>
          <button style={section.actionButton}>Create message</button>
        </div>
      </div>

      <div style={cards.block}>
        <ul style={inbox.list}>
          {messages.map((m) => (
            <li key={m.id} style={inbox.item}>
              <div style={inbox.meta}>
                <span style={inbox.tag(m.tag)}>{m.tag}</span>
                <span style={inbox.date}>
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <div style={inbox.title}>{m.title}</div>
              <div style={inbox.preview}>{m.preview}</div>
            </li>
          ))}
        </ul>
        <div style={section.note}>
          Customers will see this inside their account on mobile or web in their
          own language and currency.
        </div>
      </div>
    </section>
  );
};

const SettingsSection: React.FC = () => {
  return (
    <section>
      <div style={section.titleRow}>
        <h1 style={section.title}>Settings</h1>
      </div>

      <div style={cards.grid}>
        <div style={cards.block}>
          <h2 style={cards.blockTitle}>Brand and visuals</h2>
          <ul style={settings.list}>
            <li>Logo: Essence Yogurt white and gold only.</li>
            <li>Background: pure white.</li>
            <li>Accent: warm gold, no strong neon colors.</li>
            <li>Font: clean modern Gucci style, no cartoon style.</li>
          </ul>
        </div>

        <div style={cards.block}>
          <h2 style={cards.blockTitle}>Legal and receipts</h2>
          <ul style={settings.list}>
            <li>E receipt must include all legal lines per region.</li>
            <li>No refund policy, except if law requires otherwise.</li>
            <li>Support email: support@essenceyogurt.com (example).</li>
          </ul>
        </div>

        <div style={cards.block}>
          <h2 style={cards.blockTitle}>Loyalty rules</h2>
          <ul style={settings.list}>
            <li>Points per currency unit spent.</li>
            <li>Tier upgrade when crossing thresholds.</li>
            <li>Extra boosts on events like Black Friday or Ramadan.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

// Inline styles for luxury white and gold look

const layout = {
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f7f4f0",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
    color: "#1f1b18",
  } as React.CSSProperties,
  sidebar: {
    width: 260,
    backgroundColor: "#faf7f3",
    borderRight: "1px solid rgba(0,0,0,0.05)",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  } as React.CSSProperties,
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  } as React.CSSProperties,
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    background:
      "radial-gradient(circle at 30% 30%, #ffffff 0, #f4e6ce 40%, #e1c991 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
  } as React.CSSProperties,
  brandName: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.4,
  } as React.CSSProperties,
  brandTag: {
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: 1.4,
    color: "#9a8c7b",
  },
  nav: {
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  } as React.CSSProperties,
  sidebarFoot: {
    paddingTop: 16,
    borderTop: "1px solid rgba(0,0,0,0.05)",
  } as React.CSSProperties,
  sidebarFootLabel: {
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: 1.4,
    color: "#9a8c7b",
  },
  sidebarFootUser: {
    marginTop: 4,
    fontSize: 13,
    color: "#564635",
  },
  main: {
    flex: 1,
    padding: "24px 32px 40px",
    overflow: "auto",
  } as React.CSSProperties,
};

const header = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  } as React.CSSProperties,
  title: {
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: 0.2,
  } as React.CSSProperties,
  subtitle: {
    fontSize: 13,
    color: "#8b7a68",
    marginTop: 4,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  } as React.CSSProperties,
  whiteButton: {
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.06)",
    backgroundColor: "#ffffff",
    padding: "8px 16px",
    fontSize: 13,
    cursor: "pointer",
  } as React.CSSProperties,
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 10px",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.85)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  } as React.CSSProperties,
  userCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    background:
      "radial-gradient(circle at 30% 20%, #ffffff 0, #f3e1c5 40%, #cfa970 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 600,
  } as React.CSSProperties,
  userName: {
    fontSize: 13,
    fontWeight: 500,
  },
  userRole: {
    fontSize: 11,
    color: "#8b7a68",
  },
};

const sidebarItem = {
  base: {
    border: "none",
    background: "transparent",
    padding: "8px 10px",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#675746",
    cursor: "pointer",
  } as React.CSSProperties,
  active: {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,223,198,0.9))",
    color: "#3b2c1c",
    boxShadow: "0 5px 14px rgba(0,0,0,0.10)",
  } as React.CSSProperties,
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    background:
      "radial-gradient(circle at 30% 30%, #ffffff 0, #e4c88f 40%, #c1914c 100%)",
  } as React.CSSProperties,
};

const section = {
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  } as React.CSSProperties,
  title: {
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: 0.2,
  } as React.CSSProperties,
  badge: {
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.06)",
    backgroundColor: "#ffffff",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: "#8b7a68",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,
  actionButton: {
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, #f8e9cd, #d5b176, #b2843a, #f7e1bc)",
    color: "#3b2f1f",
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
  } as React.CSSProperties,
  actionButtonSecondary: {
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.06)",
    backgroundColor: "#ffffff",
    padding: "8px 16px",
    fontSize: 13,
    cursor: "pointer",
  } as React.CSSProperties,
  note: {
    marginTop: 10,
    fontSize: 12,
    color: "#8b7a68",
  },
};

const cards = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginBottom: 16,
  } as React.CSSProperties,
  row: {
    display: "flex",
    gap: 14,
    marginTop: 18,
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: "14px 16px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  } as React.CSSProperties,
  label: {
    fontSize: 11,
    color: "#8b7a68",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  value: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: 600,
  } as React.CSSProperties,
  hint: {
    marginTop: 4,
    fontSize: 12,
    color: "#9c8b79",
  },
  block: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
    minWidth: 0,
  } as React.CSSProperties,
  blockTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  } as React.CSSProperties,
  blockTitle: {
    fontSize: 15,
    fontWeight: 600,
  } as React.CSSProperties,
};

const StatCard: React.FC<{
  label: string;
  value: string;
  hint?: string;
}> = ({ label, value, hint }) => (
  <div style={cards.card}>
    <div style={cards.label}>{label}</div>
    <div style={cards.value}>{value}</div>
    {hint && <div style={cards.hint}>{hint}</div>}
  </div>
);

const tierStyles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginTop: 6,
  } as React.CSSProperties,
  card: {
    borderRadius: 18,
    padding: 12,
    border: "1px solid rgba(0,0,0,0.04)",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(249,242,231,0.9))",
  } as React.CSSProperties,
  highlightCard: {
    border: "1px solid rgba(177,129,50,0.7)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  } as React.CSSProperties,
  name: {
    fontSize: 14,
    fontWeight: 600,
  } as React.CSSProperties,
  points: {
    fontSize: 12,
    color: "#8b7a68",
    marginTop: 4,
  },
  benefits: {
    marginTop: 8,
    paddingLeft: 16,
    fontSize: 12,
    color: "#5a4b3b",
  } as React.CSSProperties,
};

const campaign = {
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  } as React.CSSProperties,
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: 12,
    backgroundColor: "#f8f3eb",
  } as React.CSSProperties,
  name: {
    fontSize: 13,
    fontWeight: 500,
  },
  desc: {
    fontSize: 12,
    color: "#8b7a68",
    marginTop: 2,
  },
  pill: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    backgroundColor: "#ffffff",
    border: "1px solid rgba(0,0,0,0.06)",
    color: "#8b7a68",
  } as React.CSSProperties,
};

const table = {
  base: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 12,
  } as React.CSSProperties,
  headCell: {
    textAlign: "left" as const,
    padding: "8px 8px",
    fontSize: 11,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: "#9c8b79",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  } as React.CSSProperties,
  row: {
    cursor: "pointer",
    borderBottom: "1px solid rgba(0,0,0,0.04)",
  } as React.CSSProperties,
  rowSelected: {
    backgroundColor: "rgba(245,231,206,0.5)",
  } as React.CSSProperties,
  cell: {
    padding: "7px 8px",
  } as React.CSSProperties,
  cellSub: {
    padding: "7px 8px",
    color: "#9c8b79",
    fontSize: 11,
  } as React.CSSProperties,
  cellTier: {
    padding: "7px 8px",
    fontSize: 12,
    color: "#725c46",
  } as React.CSSProperties,
  cellStrong: {
    padding: "7px 8px",
    fontWeight: 500,
  } as React.CSSProperties,
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#b1823e",
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
  } as React.CSSProperties,
};

const empty = {
  state: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#f8f3eb",
    fontSize: 12,
    color: "#8b7a68",
  } as React.CSSProperties,
};

const profile = {
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  } as React.CSSProperties,
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background:
      "radial-gradient(circle at 30% 20%, #ffffff 0, #f3e1c5 40%, #cfa970 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 600,
  } as React.CSSProperties,
  name: {
    fontSize: 15,
    fontWeight: 600,
  } as React.CSSProperties,
  email: {
    fontSize: 12,
    color: "#8b7a68",
  },
  statsRow: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  } as React.CSSProperties,
  stat: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    backgroundColor: "#f8f3eb",
  } as React.CSSProperties,
  statLabel: {
    fontSize: 11,
    color: "#8b7a68",
  },
  statValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 500,
  } as React.CSSProperties,
  statValueSmall: {
    marginTop: 4,
    fontSize: 12,
  } as React.CSSProperties,
  sectionTitle: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: 500,
    color: "#725c46",
  },
  flags: {
    marginTop: 6,
    paddingLeft: 18,
    fontSize: 12,
    color: "#5a4b3b",
  } as React.CSSProperties,
  actionButton: {
    marginTop: 12,
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, #f8e9cd, #d5b176, #b2843a, #f7e1bc)",
    color: "#3b2f1f",
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  } as React.CSSProperties,
};

const pill = {
  base: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
  } as React.CSSProperties,
  active: {
    backgroundColor: "rgba(201,151,78,0.12)",
    color: "#b1823e",
  } as React.CSSProperties,
  inactive: {
    backgroundColor: "rgba(0,0,0,0.04)",
    color: "#8b7a68",
  } as React.CSSProperties,
};

const inbox = {
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  } as React.CSSProperties,
  item: {
    padding: "10px 12px",
    borderRadius: 14,
    backgroundColor: "#f8f3eb",
  } as React.CSSProperties,
  meta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  } as React.CSSProperties,
  date: {
    fontSize: 11,
    color: "#9c8b79",
  },
  tag:
    (tag: InboxMessage["tag"]): React.CSSProperties =>
    ({
      display: "inline-block",
      fontSize: 11,
      padding: "3px 8px",
      borderRadius: 999,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      border: "1px solid rgba(0,0,0,0.06)",
      backgroundColor:
        tag === "promo"
          ? "#ffffff"
          : tag === "vip"
          ? "rgba(201,151,78,0.18)"
          : "rgba(0,0,0,0.03)",
      color:
        tag === "vip"
          ? "#b1823e"
          : tag === "promo"
          ? "#5a4b3b"
          : "#8b7a68",
    } as React.CSSProperties),
  title: {
    fontSize: 13,
    fontWeight: 500,
  } as React.CSSProperties,
  preview: {
    fontSize: 12,
    color: "#7a6a58",
    marginTop: 2,
  },
};

const settings = {
  list: {
    fontSize: 12,
    color: "#5a4b3b",
    paddingLeft: 18,
    marginTop: 6,
  } as React.CSSProperties,
};