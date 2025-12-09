import React, { useState, useMemo, useEffect, useCallback } from "react";

const EssenceTheme = {
  colors: {
    background: "#FFFFFF",
    gold: "#D4AF37",
    goldSoft: "#E9D7A2",
    blackVelvet: "#050505",
    softGray: "#F5F5F5",
    borderSoft: "#E5E5E5",
    textPrimary: "#121212",
    textSecondary: "#707070",
    accentBlue: "#3B82F6",
  },
  shadows: {
    card: "0 12px 30px rgba(0,0,0,0.08)",
    glowGold: "0 0 32px rgba(212,175,55,0.35)",
  },
  font: {
    main: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    title: "'Poppins', system-ui, sans-serif",
  },
};

type Tier = "Classic" | "Gold" | "Diamond" | "BlackSignature";

interface InboxMessage {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  category: "Offer" | "System" | "Concierge";
}

interface EGift {
  id: string;
  label: string;
  value: number;
  currency: "USD" | "AED" | "SAR" | "EUR" | "ILS" | "AUD";
  expiresAt: string;
  redeemed: boolean;
  oneTime: boolean;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  region: "USA" | "UAE" | "SAUDI" | "EU" | "ISRAEL" | "GLOBAL";
  points: number;
  tier: Tier;
  walletBalance: number;
  gifts: EGift[];
  preferredLanguage: keyof typeof strings;
  pushEnabled: boolean;
  inbox: InboxMessage[];
  avatarInitials: string;
}

const strings = {
  en: {
    welcome: "Welcome back",
    vipStatus: "Your VIP status",
    points: "Points",
    wallet: "Wallet",
    egift: "E-gifts",
    inbox: "Inbox",
    viewAll: "View all",
    scanToEarn: "Scan to earn and redeem",
    scanNow: "Open scanner",
    aiConciergeTitle: "Essence Concierge",
    aiPlaceholder: "Ask about offers, flavors, your points...",
    aiSend: "Ask",
    tierProgress: "Progress to next tier",
    latestRewards: "Latest rewards",
    activeOffers: "Active offers",
    myProfile: "My profile",
    logout: "Log out",
    language: "Language",
    refreshCode: "Refresh code",
    scanInstructions: "Show this at the cashier. They scan, you earn.",
    qrDescription: "This QR is unique to your account and updates with each visit.",
    nonTransferable: "Non transferable - one time use",
    available: "Available",
    used: "Used",
    expires: "Expires",
    newMessages: "new",
    lifetime: "Lifetime",
    current: "Current",
    next: "Next",
    conciergeWelcome: "I am your Essence Concierge. You can ask me about your points, offers, flavors and VIP benefits.",
    pts: "pts",
  },
  ar: {
    welcome: "مرحبا بعودتك",
    vipStatus: "حالة العضوية",
    points: "نقاط",
    wallet: "المحفظة",
    egift: "بطاقات الهدايا",
    inbox: "صندوق الرسائل",
    viewAll: "عرض الكل",
    scanToEarn: "امسح لتحصل على النقاط وتستخدمها",
    scanNow: "افتح الماسح",
    aiConciergeTitle: "كونسييرج ايسنس",
    aiPlaceholder: "اسأل عن العروض والنكهات ونقاطك...",
    aiSend: "إرسال",
    tierProgress: "التقدم للمرحلة التالية",
    latestRewards: "أحدث المكافآت",
    activeOffers: "العروض الفعالة",
    myProfile: "ملفي الشخصي",
    logout: "تسجيل الخروج",
    language: "اللغة",
    refreshCode: "تحديث الرمز",
    scanInstructions: "اعرض هذا على الكاشير. يمسحون، وتحصل على النقاط.",
    qrDescription: "هذا الرمز فريد لحسابك ويتم تحديثه مع كل زيارة.",
    nonTransferable: "غير قابل للتحويل - للاستخدام مرة واحدة",
    available: "متاح",
    used: "مستخدم",
    expires: "ينتهي",
    newMessages: "جديد",
    lifetime: "مدى الحياة",
    current: "الحالي",
    next: "التالي",
    conciergeWelcome: "أنا كونسييرج إيسنس الخاص بك. يمكنك سؤالي عن نقاطك والعروض والنكهات ومزايا VIP.",
    pts: "نقطة",
  },
  fr: {
    welcome: "Bon retour",
    vipStatus: "Votre statut VIP",
    points: "Points",
    wallet: "Portefeuille",
    egift: "Cartes cadeaux",
    inbox: "Messages",
    viewAll: "Tout afficher",
    scanToEarn: "Scannez pour gagner et utiliser",
    scanNow: "Ouvrir le scanner",
    aiConciergeTitle: "Concierge Essence",
    aiPlaceholder: "Demandez les offres, parfums, vos points...",
    aiSend: "Envoyer",
    tierProgress: "Progrès vers le prochain niveau",
    latestRewards: "Dernières récompenses",
    activeOffers: "Offres actives",
    myProfile: "Mon profil",
    logout: "Déconnexion",
    language: "Langue",
    refreshCode: "Actualiser le code",
    scanInstructions: "Montrez ceci au caissier. Ils scannent, vous gagnez.",
    qrDescription: "Ce QR est unique à votre compte et se met à jour à chaque visite.",
    nonTransferable: "Non transférable - usage unique",
    available: "Disponible",
    used: "Utilisé",
    expires: "Expire le",
    newMessages: "nouveau",
    lifetime: "À vie",
    current: "Actuel",
    next: "Suivant",
    conciergeWelcome: "Je suis votre Concierge Essence. Vous pouvez me poser des questions sur vos points, offres, parfums et avantages VIP.",
    pts: "pts",
  },
  es: {
    welcome: "Bienvenido de nuevo",
    vipStatus: "Tu estado VIP",
    points: "Puntos",
    wallet: "Billetera",
    egift: "E-gifts",
    inbox: "Bandeja",
    viewAll: "Ver todo",
    scanToEarn: "Escanea para ganar y canjear",
    scanNow: "Abrir escáner",
    aiConciergeTitle: "Conserje Essence",
    aiPlaceholder: "Pregunta por ofertas, sabores, puntos...",
    aiSend: "Preguntar",
    tierProgress: "Progreso al siguiente nivel",
    latestRewards: "Últimas recompensas",
    activeOffers: "Ofertas activas",
    myProfile: "Mi perfil",
    logout: "Cerrar sesión",
    language: "Idioma",
    refreshCode: "Actualizar código",
    scanInstructions: "Muestra esto al cajero. Escanean y ganas.",
    qrDescription: "Este QR es único para tu cuenta y se actualiza con cada visita.",
    nonTransferable: "No transferible - uso único",
    available: "Disponible",
    used: "Usado",
    expires: "Expira",
    newMessages: "nuevo",
    lifetime: "De por vida",
    current: "Actual",
    next: "Siguiente",
    conciergeWelcome: "Soy tu Conserje Essence. Puedes preguntarme sobre tus puntos, ofertas, sabores y beneficios VIP.",
    pts: "pts",
  },
  de: {
    welcome: "Willkommen zurück",
    vipStatus: "Ihr VIP Status",
    points: "Punkte",
    wallet: "Wallet",
    egift: "E-Geschenke",
    inbox: "Postfach",
    viewAll: "Alle anzeigen",
    scanToEarn: "Scannen zum sammeln und einlösen",
    scanNow: "Scanner öffnen",
    aiConciergeTitle: "Essence Concierge",
    aiPlaceholder: "Fragen Sie nach Angeboten, Sorten, Punkten...",
    aiSend: "Senden",
    tierProgress: "Fortschritt zur nächsten Stufe",
    latestRewards: "Neueste Prämien",
    activeOffers: "Aktive Angebote",
    myProfile: "Mein Profil",
    logout: "Abmelden",
    language: "Sprache",
    refreshCode: "Code aktualisieren",
    scanInstructions: "Zeigen Sie dies an der Kasse. Sie scannen, Sie sammeln.",
    qrDescription: "Dieser QR-Code ist einzigartig für Ihr Konto und wird bei jedem Besuch aktualisiert.",
    nonTransferable: "Nicht übertragbar - einmalige Nutzung",
    available: "Verfügbar",
    used: "Eingelöst",
    expires: "Läuft ab",
    newMessages: "neu",
    lifetime: "Lebenslang",
    current: "Aktuell",
    next: "Nächste",
    conciergeWelcome: "Ich bin Ihr Essence Concierge. Sie können mich nach Ihren Punkten, Angeboten, Sorten und VIP-Vorteilen fragen.",
    pts: "Pkt",
  },
  zh: {
    welcome: "欢迎回来",
    vipStatus: "您的贵宾等级",
    points: "积分",
    wallet: "钱包",
    egift: "礼品卡",
    inbox: "消息",
    viewAll: "查看全部",
    scanToEarn: "扫码积累和使用积分",
    scanNow: "打开扫码器",
    aiConciergeTitle: "Essence 礼宾",
    aiPlaceholder: "询问优惠, 口味, 积分...",
    aiSend: "发送",
    tierProgress: "升级进度",
    latestRewards: "最新奖励",
    activeOffers: "当前优惠",
    myProfile: "我的资料",
    logout: "退出登录",
    language: "语言",
    refreshCode: "刷新二维码",
    scanInstructions: "向收银员展示此码。他们扫描，您获得积分。",
    qrDescription: "此二维码是您账户专属，每次访问都会更新。",
    nonTransferable: "不可转让 - 仅限一次使用",
    available: "可用",
    used: "已使用",
    expires: "到期",
    newMessages: "新",
    lifetime: "终身",
    current: "当前",
    next: "下一个",
    conciergeWelcome: "我是您的Essence礼宾。您可以询问我关于积分、优惠、口味和VIP权益的问题。",
    pts: "分",
  },
};

function t(lang: keyof typeof strings, key: keyof (typeof strings)["en"]) {
  return strings[lang][key] || strings.en[key] || key;
}

const vipRules: Record<
  Tier,
  {
    min: number;
    label: string;
    description: string;
    gradient: string;
  }
> = {
  Classic: {
    min: 0,
    label: "Classic",
    description: "Entry level for new Essence members.",
    gradient: "linear-gradient(135deg,#F3F4F6,#E5E7EB)",
  },
  Gold: {
    min: 500,
    label: "Gold",
    description: "Priority access for gold tier members.",
    gradient: "linear-gradient(135deg,#FDE68A,#D4AF37)",
  },
  Diamond: {
    min: 1500,
    label: "Diamond",
    description: "Premium support and priority notifications.",
    gradient: "linear-gradient(135deg,#E0F2FE,#38BDF8)",
  },
  BlackSignature: {
    min: 4000,
    label: "Black Signature",
    description:
      "Personal concierge and early access to new flavors.",
    gradient: "linear-gradient(135deg,#111827,#000000)",
  },
};

function generateQrPayload(userId: string): string {
  return `ESSENCE-${userId}-${Date.now()}`;
}

const mockUser: User = {
  id: "user_123",
  email: "vip@essenceyogurt.com",
  displayName: "VIP Member",
  phone: "+1 310 000 000",
  region: "USA",
  points: 2120,
  tier: "Diamond",
  walletBalance: 145.4,
  gifts: [
    {
      id: "g1",
      label: "Essence Gold - 25 USD",
      value: 25,
      currency: "USD",
      expiresAt: "2025-12-31",
      redeemed: false,
      oneTime: true,
    },
    {
      id: "g2",
      label: "Airport Lounge Treat - 15 USD",
      value: 15,
      currency: "USD",
      expiresAt: "2025-06-30",
      redeemed: true,
      oneTime: true,
    },
  ],
  preferredLanguage: "en",
  pushEnabled: true,
  inbox: [
    {
      id: "m1",
      title: "Diamond VIP - Double points weekend",
      body: "This Friday to Sunday, earn double points at all Essence locations in the USA.",
      createdAt: "2025-03-01T12:00:00Z",
      read: false,
      category: "Offer",
    },
    {
      id: "m2",
      title: "Your personal concierge is live",
      body: "Ask the Essence Concierge anything about your VIP status, flavors or upcoming events.",
      createdAt: "2025-02-27T10:00:00Z",
      read: true,
      category: "Concierge",
    },
  ],
  avatarInitials: "VM",
};

function VIPBadge({ tier }: { tier: Tier }) {
  const color =
    tier === "BlackSignature"
      ? "#000000"
      : tier === "Diamond"
      ? "#38BDF8"
      : tier === "Gold"
      ? "#D4AF37"
      : "#9CA3AF";
  return (
    <span
      data-testid={`badge-vip-${tier.toLowerCase()}`}
      style={{
        background: color,
        color: "#FFFFFF",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {vipRules[tier].label}
    </span>
  );
}

function StatCard(props: {
  label: string;
  value: string;
  secondary?: string;
  testId?: string;
}) {
  return (
    <div
      data-testid={props.testId}
      className="rounded-2xl p-4 flex flex-col gap-1"
      style={{
        background: EssenceTheme.colors.softGray,
        boxShadow: EssenceTheme.shadows.card,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: EssenceTheme.colors.textSecondary,
        }}
      >
        {props.label}
      </span>
      <span
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: EssenceTheme.colors.textPrimary,
        }}
      >
        {props.value}
      </span>
      {props.secondary && (
        <span
          style={{
            fontSize: 11,
            color: EssenceTheme.colors.textSecondary,
          }}
        >
          {props.secondary}
        </span>
      )}
    </div>
  );
}

type Lang = keyof typeof strings;

function TierProgress({ user, lang }: { user: User; lang: Lang }) {
  const currentTier = user.tier;
  const tiersOrder: Tier[] = ["Classic", "Gold", "Diamond", "BlackSignature"];

  const nextTierIndex = Math.min(
    tiersOrder.indexOf(currentTier) + 1,
    tiersOrder.length - 1
  );
  const nextTier = tiersOrder[nextTierIndex];
  const currentRule = vipRules[currentTier];
  const nextRule = vipRules[nextTier];

  const progress = useMemo(() => {
    if (nextTier === currentTier) return 1;
    const minCurrent = currentRule.min;
    const minNext = nextRule.min;
    if (minNext === minCurrent) return 1;
    const ratio = (user.points - minCurrent) / (minNext - minCurrent);
    return Math.max(0, Math.min(1, ratio));
  }, [user.points, currentTier, currentRule, nextRule, nextTier]);

  return (
    <div data-testid="widget-tier-progress" className="mt-4 rounded-2xl p-4 bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span
          data-testid="text-tier-progress-label"
          style={{
            fontSize: 13,
            color: EssenceTheme.colors.textSecondary,
          }}
        >
          {t(lang, "tierProgress")}
        </span>
        <span
          data-testid="text-points-display"
          style={{
            fontSize: 11,
            color: EssenceTheme.colors.textSecondary,
          }}
        >
          {user.points} {t(lang, "pts")}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          data-testid="progress-bar-tier"
          className="h-full rounded-full"
          style={{
            width: `${progress * 100}%`,
            background:
              currentTier === "BlackSignature"
                ? "#000000"
                : currentTier === "Diamond"
                ? "#38BDF8"
                : currentTier === "Gold"
                ? "#D4AF37"
                : "#9CA3AF",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span
          data-testid="text-current-tier"
          style={{
            fontSize: 12,
            color: EssenceTheme.colors.textSecondary,
          }}
        >
          {t(lang, "current")}: {vipRules[currentTier].label}
        </span>
        <span
          data-testid="text-next-tier"
          style={{
            fontSize: 12,
            color: EssenceTheme.colors.textPrimary,
            fontWeight: 500,
          }}
        >
          {t(lang, "next")}: {vipRules[nextTier].label}
        </span>
      </div>
    </div>
  );
}

function QRWidget({ user, lang }: { user: User; lang: Lang }) {
  const [qrData, setQrData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQrCode = useCallback(async () => {
    setLoading(true);
    try {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;
      const res = await fetch("/api/loyalty/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customerId: user.id, 
          sessionId,
          deviceFingerprint: navigator.userAgent 
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setQrData(data.qrData || generateQrPayload(user.id));
      } else {
        setQrData(generateQrPayload(user.id));
      }
    } catch {
      setQrData(generateQrPayload(user.id));
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchQrCode();
  }, [fetchQrCode]);

  const refresh = () => {
    fetchQrCode();
  };

  const qrPayload = qrData || generateQrPayload(user.id);

  return (
    <div
      data-testid="widget-qr-code"
      className="rounded-2xl p-4 bg-white shadow-sm border border-gray-100 flex flex-col gap-3"
      style={{ marginTop: 16 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <div
            data-testid="text-qr-title"
            style={{
              fontSize: 13,
              color: EssenceTheme.colors.textSecondary,
            }}
          >
            {t(lang, "scanToEarn")}
          </div>
          <div
            data-testid="text-qr-instructions"
            style={{
              fontSize: 12,
              color: EssenceTheme.colors.textSecondary,
            }}
          >
            {t(lang, "scanInstructions")}
          </div>
        </div>
        <button
          data-testid="button-refresh-qr"
          onClick={refresh}
          disabled={loading}
          className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          {t(lang, "refreshCode")}
        </button>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div
          data-testid="qr-code-container"
          className="w-24 h-24 rounded-xl flex items-center justify-center text-[10px] text-gray-600 bg-gray-100"
          style={{ border: "1px solid #E5E7EB" }}
        >
          {loading ? (
            <div className="animate-pulse w-16 h-16 bg-gray-200 rounded" />
          ) : (
            <img 
              data-testid="img-qr-code"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(qrPayload)}`}
              alt="QR Code"
              className="w-full h-full rounded-xl"
            />
          )}
        </div>
        <div data-testid="text-qr-description" className="flex-1 text-xs text-gray-500">
          {t(lang, "qrDescription")}
        </div>
      </div>
    </div>
  );
}

function EGiftWallet({ user, lang }: { user: User; lang: Lang }) {
  return (
    <div
      data-testid="widget-egift-wallet"
      className="rounded-2xl p-4 bg-white shadow-sm border border-gray-100 flex flex-col gap-3 mt-4"
      style={{ boxShadow: EssenceTheme.shadows.card }}
    >
      <div className="flex justify-between items-center">
        <div
          data-testid="text-egift-title"
          style={{
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {t(lang, "egift")}
        </div>
        <div data-testid="text-egift-notice" className="text-xs text-gray-500">{t(lang, "nonTransferable")}</div>
      </div>
      <div className="flex flex-col gap-2">
        {user.gifts.map((g) => (
          <div
            key={g.id}
            data-testid={`card-egift-${g.id}`}
            className="rounded-xl px-3 py-2 flex justify-between items-center"
            style={{
              background: g.redeemed ? "#F3F4F6" : "#FEF3C7",
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex flex-col">
              <span
                data-testid={`text-egift-label-${g.id}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {g.label}
              </span>
              <span
                data-testid={`text-egift-value-${g.id}`}
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                }}
              >
                {g.currency} {g.value.toFixed(2)} - {t(lang, "expires")} {g.expiresAt}
              </span>
            </div>
            <span
              data-testid={`text-egift-status-${g.id}`}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: g.redeemed ? "#6B7280" : "#166534",
              }}
            >
              {g.redeemed ? t(lang, "used") : t(lang, "available")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InboxPreview({ user, lang }: { user: User; lang: Lang }) {
  const unread = user.inbox.filter((m) => !m.read);
  const latest = user.inbox.slice(0, 3);

  return (
    <div data-testid="widget-inbox" className="rounded-2xl p-4 bg-white shadow-sm border border-gray-100 mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span
            data-testid="text-inbox-title"
            style={{
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {t(lang, "inbox")}
          </span>
          {unread.length > 0 && (
            <span data-testid="badge-unread-count" className="text-xs px-2 py-1 bg-red-500 text-white rounded-full">
              {unread.length} {t(lang, "newMessages")}
            </span>
          )}
        </div>
        <button data-testid="button-view-all-inbox" className="text-xs text-blue-500 hover:underline">{t(lang, "viewAll")}</button>
      </div>
      <div className="flex flex-col gap-2">
        {latest.map((m) => (
          <div
            key={m.id}
            data-testid={`card-inbox-${m.id}`}
            className="rounded-xl px-3 py-2 border border-gray-200 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span
                data-testid={`text-inbox-msg-title-${m.id}`}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {m.title}
              </span>
              {!m.read && (
                <span data-testid={`indicator-unread-${m.id}`} className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
              )}
            </div>
            <div
              data-testid={`text-inbox-msg-body-${m.id}`}
              style={{
                fontSize: 11,
                color: "#6B7280",
                marginTop: 2,
              }}
            >
              {m.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiConciergePanel({ user, lang }: { user: User; lang: Lang }) {
  const [input, setInput] = useState("");
  const [log, setLog] = useState<
    { from: "user" | "ai"; text: string; ts: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLog([
      {
        from: "ai",
        text: `${t(lang, "welcome")} ${user.displayName}. ${t(lang, "conciergeWelcome")}`,
        ts: Date.now(),
      },
    ]);
  }, [lang, user.displayName]);

  async function send() {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");
    setLog((prev) => [...prev, { from: "user", text: userText, ts: Date.now() }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/loyalty-concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userText, 
          tier: user.tier,
          points: user.points,
          region: user.region 
        }),
      });
      const data = await res.json();
      const aiText = data.reply || t(lang, "conciergeWelcome");
      setLog((prev) => [...prev, { from: "ai", text: aiText, ts: Date.now() }]);
    } catch (e) {
      setLog((prev) => [
        ...prev,
        {
          from: "ai",
          text: t(lang, "conciergeWelcome"),
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-testid="widget-ai-concierge" className="rounded-2xl p-4 bg-white shadow-sm border border-gray-100 mt-4">
      <div className="flex justify-between items-center mb-2">
        <span
          data-testid="text-concierge-title"
          style={{
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {t(lang, "aiConciergeTitle")}
        </span>
        <VIPBadge tier={user.tier} />
      </div>
      <div data-testid="chat-log" className="h-40 overflow-y-auto border border-gray-100 rounded-xl p-2 mb-3 bg-gray-50">
        {log.map((m, idx) => (
          <div
            key={m.ts + "-" + idx}
            data-testid={`chat-message-${idx}`}
            className={`text-xs mb-2 ${
              m.from === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-2 py-1 rounded-xl ${
                m.from === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          data-testid="input-concierge-message"
          className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-full outline-none focus:border-[#D4AF37]"
          placeholder={t(lang, "aiPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && send()}
        />
        <button
          data-testid="button-send-message"
          onClick={send}
          disabled={loading}
          className="text-xs px-4 py-2 rounded-full text-white transition-all"
          style={{
            background: loading
              ? "#9CA3AF"
              : EssenceTheme.colors.blackVelvet,
          }}
        >
          {loading ? "..." : t(lang, "aiSend")}
        </button>
      </div>
    </div>
  );
}

function LanguageSelector({ lang, setLang }: { lang: keyof typeof strings; setLang: (l: keyof typeof strings) => void }) {
  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "de", label: "Deutsch" },
    { code: "zh", label: "中文" },
  ];

  return (
    <div data-testid="container-language-selector" className="flex gap-2 flex-wrap">
      {languages.map((l) => (
        <button
          key={l.code}
          data-testid={`button-lang-${l.code}`}
          onClick={() => setLang(l.code as keyof typeof strings)}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${
            lang === l.code
              ? "bg-[#D4AF37] text-white border-[#D4AF37]"
              : "bg-white text-gray-600 border-gray-300 hover:border-[#D4AF37]"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default function EssenceLoyaltyApp() {
  const [user] = useState<User>(mockUser);
  const [lang, setLang] = useState<keyof typeof strings>(user.preferredLanguage);

  const isRtl = lang === "ar";

  return (
    <div
      data-testid="page-loyalty-dashboard"
      style={{
        fontFamily: EssenceTheme.font.main,
        background: EssenceTheme.colors.background,
        minHeight: "100vh",
        direction: isRtl ? "rtl" : "ltr",
      }}
    >
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: EssenceTheme.colors.textPrimary,
              }}
            >
              {t(lang, "welcome")},
            </div>
            <div
              data-testid="text-user-name"
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: EssenceTheme.colors.gold,
              }}
            >
              {user.displayName}
            </div>
          </div>
          <div
            data-testid="avatar-user"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: EssenceTheme.colors.gold }}
          >
            {user.avatarInitials}
          </div>
        </div>

        <div className="mb-4">
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>

        <div
          data-testid="card-vip-status"
          className="rounded-2xl p-5 mb-4"
          style={{
            background: vipRules[user.tier].gradient,
            boxShadow: user.tier === "Gold" ? EssenceTheme.shadows.glowGold : EssenceTheme.shadows.card,
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: user.tier === "BlackSignature" ? "#9CA3AF" : "#6B7280",
                }}
              >
                {t(lang, "vipStatus")}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: user.tier === "BlackSignature" ? "#FFFFFF" : "#111827",
                }}
              >
                {vipRules[user.tier].label}
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                color: user.tier === "BlackSignature" ? "#9CA3AF" : "#6B7280",
                maxWidth: 160,
                textAlign: "right",
              }}
            >
              {vipRules[user.tier].description}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            testId="card-stat-points"
            label={t(lang, "points")}
            value={user.points.toLocaleString()}
            secondary={t(lang, "lifetime")}
          />
          <StatCard
            testId="card-stat-wallet"
            label={t(lang, "wallet")}
            value={`$${user.walletBalance.toFixed(2)}`}
            secondary="USD"
          />
          <StatCard
            testId="card-stat-egifts"
            label={t(lang, "egift")}
            value={user.gifts.filter((g) => !g.redeemed).length.toString()}
            secondary={t(lang, "available")}
          />
        </div>

        <TierProgress user={user} lang={lang} />
        <QRWidget user={user} lang={lang} />
        <EGiftWallet user={user} lang={lang} />
        <InboxPreview user={user} lang={lang} />
        <AiConciergePanel user={user} lang={lang} />

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <button
              data-testid="button-my-profile"
              className="text-sm text-gray-600 hover:text-[#D4AF37]"
            >
              {t(lang, "myProfile")}
            </button>
            <button
              data-testid="button-logout"
              className="text-sm text-red-500 hover:text-red-600"
            >
              {t(lang, "logout")}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: EssenceTheme.colors.gold,
            }}
          >
            ESSENCE YOGURT
          </div>
          <div
            style={{
              fontSize: 10,
              color: EssenceTheme.colors.textSecondary,
              marginTop: 4,
            }}
          >
            VIP Loyalty Dashboard 2025
          </div>
        </div>
      </div>
    </div>
  );
}
