import { Gift, Cake, Tag, Snowflake, Sparkles, Star } from "lucide-react";

export type CampaignType = "welcome" | "birthday" | "black-friday" | "seasonal" | "lapsed" | "vip";

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  description: string;
  badge: string;
  discountPercent?: number;
  extraPoints?: number;
  code?: string;
  startDate: string;
  endDate: string;
  isPersonal: boolean;
}

const campaignIcons: Record<CampaignType, React.ReactNode> = {
  welcome: <Sparkles size={16} />,
  birthday: <Cake size={16} />,
  "black-friday": <Tag size={16} />,
  seasonal: <Snowflake size={16} />,
  lapsed: <Gift size={16} />,
  vip: <Star size={16} />,
};

const campaignColors: Record<CampaignType, string> = {
  welcome: "from-green-500 to-emerald-600",
  birthday: "from-pink-500 to-rose-600",
  "black-friday": "from-neutral-800 to-neutral-900",
  seasonal: "from-blue-500 to-cyan-600",
  lapsed: "from-purple-500 to-violet-600",
  vip: "from-[#d4af37] to-[#a07c10]",
};

interface CampaignBadgeProps {
  campaign: Campaign;
  compact?: boolean;
}

export function CampaignBadge({ campaign, compact = false }: CampaignBadgeProps) {
  const icon = campaignIcons[campaign.type];
  const colorClass = campaignColors[campaign.type];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${colorClass} text-white text-xs font-semibold`}
        data-testid={`badge-campaign-${campaign.id}`}
      >
        {icon}
        {campaign.badge}
      </span>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-gradient-to-r ${colorClass} p-4 text-white`}
      data-testid={`card-campaign-${campaign.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{campaign.name}</h4>
            <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              {campaign.badge}
            </span>
          </div>
          <p className="text-sm text-white/80 mb-2">{campaign.description}</p>
          <div className="flex flex-wrap gap-3 text-xs">
            {campaign.discountPercent && (
              <span className="bg-white/20 px-2 py-1 rounded-full">
                {campaign.discountPercent}% OFF
              </span>
            )}
            {campaign.extraPoints && (
              <span className="bg-white/20 px-2 py-1 rounded-full">
                +{campaign.extraPoints} Points
              </span>
            )}
            {campaign.code && (
              <span className="bg-white/30 px-2 py-1 rounded-full font-mono">
                {campaign.code}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActiveCampaignsProps {
  campaigns: Campaign[];
  title?: string;
}

export function ActiveCampaigns({ campaigns, title = "Your Active Offers" }: ActiveCampaignsProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <Gift size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No active campaigns right now</p>
        <p className="text-xs">Check back soon for exclusive offers!</p>
      </div>
    );
  }

  return (
    <div data-testid="active-campaigns">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <CampaignBadge key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}

export const sampleCampaigns: Campaign[] = [
  {
    id: "welcome-100",
    name: "Welcome to Essence",
    type: "welcome",
    description: "Thank you for joining Essence Circle.",
    badge: "Welcome",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    isPersonal: true,
  },
  {
    id: "birthday-gold",
    name: "Birthday Celebration",
    type: "birthday",
    description: "Wishing you a wonderful birthday month.",
    badge: "Birthday",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    isPersonal: true,
  },
  {
    id: "black-friday-elite",
    name: "Black Friday Event",
    type: "black-friday",
    description: "Special member event during Black Friday weekend.",
    badge: "Black Friday",
    startDate: "2025-11-27",
    endDate: "2025-11-30",
    isPersonal: false,
  },
  {
    id: "winter-luxe",
    name: "Winter Evenings",
    type: "seasonal",
    description: "Seasonal promotion at participating locations.",
    badge: "Seasonal",
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    isPersonal: false,
  },
  {
    id: "vip-exclusive",
    name: "VIP Early Access",
    type: "vip",
    description: "Early access to new flavours for VIP members.",
    badge: "VIP Only",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    isPersonal: true,
  },
];

export function isCampaignActive(campaign: Campaign): boolean {
  const now = new Date();
  const start = new Date(campaign.startDate);
  const end = new Date(campaign.endDate);
  return now >= start && now <= end;
}

export function getActiveCampaigns(campaigns: Campaign[]): Campaign[] {
  return campaigns.filter(isCampaignActive);
}
