import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

async function fetchApi(endpoint: string, options?: RequestInit) {
  const res = await fetch(`/api/social-cloud${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

const SocialTheme = {
  colors: {
    background: "#FFFFFF",
    pureWhite: "#FFFFFF",
    gold: "#D4AF37",
    goldMetallic: "linear-gradient(135deg, #D4AF37 0%, #F5D572 25%, #D4AF37 50%, #8B7355 75%, #D4AF37 100%)",
    goldShimmer: "linear-gradient(90deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)",
    goldSoft: "#F5E6C4",
    goldLight: "rgba(212, 175, 55, 0.08)",
    platinumMetallic: "linear-gradient(135deg, #E5E4E2 0%, #FFFFFF 25%, #E5E4E2 50%, #A9A9A9 75%, #E5E4E2 100%)",
    roseGoldMetallic: "linear-gradient(135deg, #B76E79 0%, #E8B4BC 25%, #B76E79 50%, #8B5A5A 75%, #B76E79 100%)",
    blackVelvet: "#050505",
    softGray: "#FAFAFA",
    borderSoft: "#F0F0F0",
    textPrimary: "#1A1A1A",
    textSecondary: "#666666",
    accentEmerald: "#047857",
    accentBlue: "#047857",
    success: "#059669",
    warning: "#D97706",
    error: "#DC2626",
  },
  shadows: {
    card: "0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
    cardHover: "0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
    glowGold: "0 0 60px rgba(212,175,55,0.2), 0 0 20px rgba(212,175,55,0.1)",
    glowGoldIntense: "0 0 80px rgba(212,175,55,0.35), 0 0 30px rgba(212,175,55,0.2)",
    luxuryElevation: "0 20px 60px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)",
  },
  font: {
    main: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    display: "'Playfair Display', Georgia, serif",
    elegant: "'Cormorant Garamond', Georgia, serif",
  },
};

const LuxuryIcons = {
  feed: "◈",
  chat: "◆",
  contests: "❖",
  leaderboard: "✦",
  heart: "♡",
  heartFilled: "♥",
  comment: "◇",
  share: "⬡",
  star: "★",
  crown: "♛",
  diamond: "◆",
  verified: "✓",
  trending: "↗",
  photo: "◐",
  video: "▶",
  location: "◎",
  time: "○",
  send: "➤",
  plus: "+",
  flag: "⚐",
  inbox: "▣",
};

const DEMO_HASHTAGS = [
  { id: "1", tag: "EssenceYogurt", usageCount: 15420, isTrending: true, isOfficial: true },
  { id: "2", tag: "EssenceMoments", usageCount: 8930, isTrending: true, isOfficial: true },
  { id: "3", tag: "SoftServeHeaven", usageCount: 4521, isTrending: true, isOfficial: false },
  { id: "4", tag: "EssenceParty", usageCount: 3102, isTrending: true, isOfficial: true },
  { id: "5", tag: "GoldenSwirl", usageCount: 2890, isTrending: false, isOfficial: true },
  { id: "6", tag: "EssenceLifestyle", usageCount: 2456, isTrending: false, isOfficial: true },
];

const DEMO_POSTS = [
  {
    id: "1",
    author: { id: "1", displayName: "Sarah Johnson", avatarUrl: null, isVerified: true, tier: "DIAMOND" },
    content: "Just discovered the new Pistachio Rose flavor at the Dubai Mall location. The blend of Mediterranean pistachio with delicate rose water is absolutely divine. This is what luxury tastes like.",
    postType: "post",
    locationName: "Essence Yogurt - Dubai Mall",
    likesCount: 342,
    commentsCount: 48,
    sharesCount: 15,
    media: [{ id: "1", mediaType: "image", mediaUrl: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&h=600&fit=crop" }],
    hashtags: ["EssenceYogurt", "PistachioRose", "DubaiMall"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isLiked: false,
  },
  {
    id: "2",
    author: { id: "2", displayName: "Essence Yogurt", avatarUrl: null, isVerified: true, isOfficial: true },
    content: "PHOTO OF THE MONTH WINNER\n\nCongratulations to @MichaelChen for this stunning capture at our Tel Aviv Marina location. The golden hour lighting perfectly complements our signature gold aesthetic.\n\nPrize: 5,000 bonus points + VIP Diamond status for 3 months.\n\nWant to win? Tag your Essence moments with #EssenceMoments",
    postType: "announcement",
    likesCount: 1204,
    commentsCount: 156,
    sharesCount: 89,
    media: [{ id: "2", mediaType: "image", mediaUrl: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=600&fit=crop" }],
    hashtags: ["EssenceMoments", "PhotoOfTheMonth", "Winner"],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isOfficial: true,
    isPinned: true,
    isLiked: true,
  },
  {
    id: "3",
    author: { id: "3", displayName: "Emma Wilson", avatarUrl: null, isVerified: false, tier: "GOLD" },
    content: "Birthday celebration at Essence. The team surprised me with a personalized gold card and complimentary toppings. Feeling so special right now.",
    postType: "post",
    locationName: "Essence Yogurt - Athens Syntagma",
    likesCount: 189,
    commentsCount: 32,
    sharesCount: 8,
    media: [
      { id: "3", mediaType: "image", mediaUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop" },
      { id: "4", mediaType: "image", mediaUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop" },
    ],
    hashtags: ["EssenceYogurt", "BirthdayTreat", "GoldMember"],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isLiked: false,
  },
  {
    id: "4",
    author: { id: "4", displayName: "David Park", avatarUrl: null, isVerified: true, tier: "PLATINUM" },
    content: "VIP tasting event was incredible. Got to try 5 upcoming flavors before anyone else. The Mango Saffron is going to be a game changer. Thank you Essence team for the exclusive experience.",
    postType: "event",
    eventTitle: "VIP Summer Tasting 2025",
    eventVenue: "Essence Yogurt - Riyadh Season",
    likesCount: 456,
    commentsCount: 67,
    sharesCount: 23,
    media: [],
    hashtags: ["EssenceVIP", "TastingEvent", "ComingSoon"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isLiked: true,
  },
];

const DEMO_CONTEST = {
  id: "dec-2025",
  title: "Winter Wonderland",
  description: "Capture the magic of winter with your Essence moments! Share your coziest soft-serve photos for a chance to win amazing prizes.",
  theme: "Winter & Holidays",
  hashtag: "#EssenceWinter",
  prizeDescription: "10,000 bonus points + 1 year VIP Diamond + $500 Essence credit",
  prizeValue: 500,
  bonusPoints: 10000,
  startDate: new Date("2025-12-01").toISOString(),
  endDate: new Date("2025-12-31").toISOString(),
  votingStartDate: new Date("2026-01-01").toISOString(),
  votingEndDate: new Date("2026-01-07").toISOString(),
  status: "active",
  entriesCount: 847,
  votesCount: 12340,
  topEntries: [
    { id: "e1", imageUrl: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&h=400&fit=crop", authorName: "Alexandra K.", votes: 234 },
    { id: "e2", imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop", authorName: "James T.", votes: 198 },
    { id: "e3", imageUrl: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&fit=crop", authorName: "Sofia M.", votes: 187 },
  ],
};

const DEMO_LEADERBOARD = [
  { rank: 1, displayName: "Victoria Chen", tier: "DIAMOND", totalSpend: 12450, totalPoints: 124500, badges: ["Top Spender", "Early Adopter", "Social Star"], avatarUrl: null },
  { rank: 2, displayName: "Mohammed Al-Rashid", tier: "DIAMOND", totalSpend: 9820, totalPoints: 98200, badges: ["VIP Host", "Flavor Explorer"], avatarUrl: null },
  { rank: 3, displayName: "Elena Papadopoulos", tier: "PLATINUM", totalSpend: 7650, totalPoints: 76500, badges: ["Community Leader"], avatarUrl: null },
  { rank: 4, displayName: "James Wilson", tier: "PLATINUM", totalSpend: 6340, totalPoints: 63400, badges: ["Photo Champion"], avatarUrl: null },
  { rank: 5, displayName: "Yuki Tanaka", tier: "GOLD", totalSpend: 5210, totalPoints: 52100, badges: ["Rising Star"], avatarUrl: null },
];

const DEMO_CHATS = [
  {
    id: "1",
    roomType: "direct",
    otherUser: { displayName: "Sarah Johnson", avatarUrl: null, isOnline: true },
    lastMessage: "See you at the Dubai Mall location tomorrow!",
    lastMessageAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    unreadCount: 2,
  },
  {
    id: "2",
    roomType: "group",
    name: "Essence VIP Club Dubai",
    avatarUrl: null,
    memberCount: 48,
    lastMessage: "The new winter menu is amazing!",
    lastMessageAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    unreadCount: 0,
  },
  {
    id: "3",
    roomType: "direct",
    otherUser: { displayName: "David Park", avatarUrl: null, isOnline: false },
    lastMessage: "Thanks for the recommendation!",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
  },
];

const DEMO_MESSAGES = [
  { id: "1", senderId: "other", senderName: "Sarah Johnson", content: "Hey! Have you tried the new Pistachio Rose flavor?", createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: "2", senderId: "me", senderName: "You", content: "Not yet! Is it as good as everyone says?", createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { id: "3", senderId: "other", senderName: "Sarah Johnson", content: "It's incredible! The rose water is so subtle and the pistachio is authentic Mediterranean quality", createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
  { id: "4", senderId: "me", senderName: "You", content: "That sounds amazing. I'm definitely trying it tomorrow!", createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: "5", senderId: "other", senderName: "Sarah Johnson", content: "See you at the Dubai Mall location tomorrow!", createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
];

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function Avatar({ name, size = 40, isVerified = false, isOnline = false, tier }: { name: string; size?: number; isVerified?: boolean; isOnline?: boolean; tier?: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const tierColors: Record<string, string> = {
    DIAMOND: "linear-gradient(135deg, #b9f2ff 0%, #69d0e0 100%)",
    PLATINUM: "linear-gradient(135deg, #e5e5e5 0%, #a0a0a0 100%)",
    GOLD: "linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)",
    PEARL: "linear-gradient(135deg, #FFF8F0 0%, #E8DDD0 100%)",
  };
  
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: tier ? tierColors[tier] || SocialTheme.colors.gold : SocialTheme.colors.gold,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.4,
          fontWeight: 600,
          color: tier === "PEARL" ? SocialTheme.colors.textPrimary : "#fff",
          textShadow: tier !== "PEARL" ? "0 1px 2px rgba(0,0,0,0.2)" : "none",
        }}
      >
        {initials}
      </div>
      {isVerified && (
        <div style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: "50%",
          background: SocialTheme.colors.accentBlue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid white",
        }}>
          <svg width={size * 0.2} height={size * 0.2} viewBox="0 0 24 24" fill="white">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
      )}
      {isOnline && (
        <div style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: "50%",
          background: SocialTheme.colors.success,
          border: "2px solid white",
        }} />
      )}
    </div>
  );
}

function HashtagPill({ tag, count, isTrending, isOfficial, onClick }: { tag: string; count?: number; isTrending?: boolean; isOfficial?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      data-testid={`hashtag-${tag}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 20,
        background: isOfficial ? "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)" : SocialTheme.colors.softGray,
        border: isOfficial ? `1px solid ${SocialTheme.colors.gold}` : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: SocialTheme.font.main,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = SocialTheme.shadows.card;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ color: SocialTheme.colors.gold, fontWeight: 600 }}>#</span>
      <span style={{ color: SocialTheme.colors.textPrimary, fontWeight: 500 }}>{tag}</span>
      {count !== undefined && (
        <span style={{ color: SocialTheme.colors.textSecondary, fontSize: 12 }}>{formatNumber(count)}</span>
      )}
      {isTrending && (
        <span style={{ fontSize: 12, color: SocialTheme.colors.gold }}>{LuxuryIcons.trending}</span>
      )}
    </button>
  );
}

function PostCard({ post, onLike, onComment, onReport }: { post: typeof DEMO_POSTS[0]; onLike: () => void; onComment: () => void; onReport?: (postId: string) => void }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid={`post-card-${post.id}`}
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: SocialTheme.shadows.card,
        overflow: "hidden",
        marginBottom: 20,
        border: post.isPinned ? `2px solid ${SocialTheme.colors.gold}` : "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {post.isPinned && (
        <div style={{
          background: SocialTheme.colors.goldMetallic,
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 600,
          color: SocialTheme.colors.textPrimary,
        }}>
          <span style={{ color: SocialTheme.colors.gold }}>{LuxuryIcons.star}</span> Pinned Post
        </div>
      )}
      
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <Avatar 
            name={post.author.displayName} 
            size={48} 
            isVerified={post.author.isVerified}
            tier={post.author.tier}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 600, color: SocialTheme.colors.textPrimary }}>{post.author.displayName}</span>
              {post.isOfficial && (
                <span style={{
                  background: SocialTheme.colors.gold,
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}>Official</span>
              )}
              {post.author.tier && (
                <span style={{
                  fontSize: 11,
                  color: SocialTheme.colors.textSecondary,
                  background: SocialTheme.colors.softGray,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}>{post.author.tier}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              <span style={{ fontSize: 13, color: SocialTheme.colors.textSecondary }}>{formatTimeAgo(post.createdAt)}</span>
              {post.locationName && (
                <>
                  <span style={{ color: SocialTheme.colors.textSecondary }}>•</span>
                  <span style={{ fontSize: 13, color: SocialTheme.colors.gold }}>{LuxuryIcons.location} {post.locationName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {post.eventTitle && (
          <div style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.02) 100%)",
            border: `1px solid ${SocialTheme.colors.gold}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18, color: SocialTheme.colors.gold }}>{LuxuryIcons.contests}</span>
              <span style={{ fontWeight: 600, color: SocialTheme.colors.textPrimary }}>{post.eventTitle}</span>
            </div>
            {post.eventVenue && (
              <div style={{ fontSize: 14, color: SocialTheme.colors.textSecondary }}>
                {LuxuryIcons.location} {post.eventVenue}
              </div>
            )}
          </div>
        )}

        <p style={{
          fontSize: 15,
          lineHeight: 1.6,
          color: SocialTheme.colors.textPrimary,
          marginBottom: 16,
          whiteSpace: "pre-wrap",
        }}>
          {post.content}
        </p>

        {post.hashtags && post.hashtags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {post.hashtags.map(tag => (
              <span
                key={tag}
                style={{
                  color: SocialTheme.colors.gold,
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.media && post.media.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: post.media.length === 1 ? "1fr" : "1fr 1fr",
            gap: 8,
            marginBottom: 16,
            borderRadius: 12,
            overflow: "hidden",
          }}>
            {post.media.map((media, index) => (
              <img
                key={media.id}
                src={media.mediaUrl}
                alt=""
                style={{
                  width: "100%",
                  height: post.media.length === 1 ? 400 : 200,
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 16,
          borderTop: `1px solid ${SocialTheme.colors.borderSoft}`,
        }}>
          <div style={{ display: "flex", gap: 24 }}>
            <button
              onClick={handleLike}
              data-testid={`like-btn-${post.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 8,
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 18, color: isLiked ? SocialTheme.colors.gold : SocialTheme.colors.textSecondary }}>{isLiked ? LuxuryIcons.heartFilled : LuxuryIcons.heart}</span>
              <span style={{ color: isLiked ? SocialTheme.colors.gold : SocialTheme.colors.textSecondary, fontWeight: 500 }}>
                {formatNumber(likesCount)}
              </span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              data-testid={`comment-btn-${post.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 18, color: SocialTheme.colors.textSecondary }}>{LuxuryIcons.comment}</span>
              <span style={{ color: SocialTheme.colors.textSecondary, fontWeight: 500 }}>
                {formatNumber(post.commentsCount)}
              </span>
            </button>
            <button
              data-testid={`share-btn-${post.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 18, color: SocialTheme.colors.textSecondary }}>{LuxuryIcons.share}</span>
              <span style={{ color: SocialTheme.colors.textSecondary, fontWeight: 500 }}>
                {formatNumber(post.sharesCount)}
              </span>
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, position: "relative" }}>
            <button
              onClick={() => setShowReportMenu(!showReportMenu)}
              data-testid={`report-btn-${post.id}`}
              title="Report this post"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                fontSize: 16,
                color: SocialTheme.colors.textSecondary,
                opacity: 0.6,
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
            >
              {LuxuryIcons.flag}
            </button>
            {showReportMenu && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "100%",
                background: "#fff",
                borderRadius: 12,
                boxShadow: SocialTheme.shadows.luxuryElevation,
                padding: 8,
                minWidth: 200,
                zIndex: 100,
                border: `1px solid ${SocialTheme.colors.borderSoft}`,
              }}>
                <div style={{ padding: "8px 12px", fontWeight: 600, fontSize: 13, color: SocialTheme.colors.textSecondary, borderBottom: `1px solid ${SocialTheme.colors.borderSoft}` }}>
                  Report this post
                </div>
                {["Inappropriate content", "Spam or scam", "Harassment", "False information", "Other"].map(reason => (
                  <button
                    key={reason}
                    onClick={() => {
                      onReport?.(post.id);
                      setShowReportMenu(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 12px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 14,
                      color: SocialTheme.colors.textPrimary,
                      borderRadius: 8,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = SocialTheme.colors.goldLight}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 8,
                fontSize: 16,
                color: SocialTheme.colors.textSecondary,
              }}
            >
              {LuxuryIcons.star}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ContestCard({ contest }: { contest: typeof DEMO_CONTEST }) {
  const daysLeft = Math.ceil((new Date(contest.endDate).getTime() - Date.now()) / 86400000);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      data-testid="photo-contest-card"
      style={{
        background: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
        borderRadius: 20,
        overflow: "hidden",
        color: "#fff",
        boxShadow: SocialTheme.shadows.glowGold,
      }}
    >
      <div style={{
        background: "linear-gradient(90deg, #D4AF37 0%, #F5E6C4 50%, #D4AF37 100%)",
        padding: "12px 24px",
        textAlign: "center",
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#050505", letterSpacing: 2, textTransform: "uppercase" }}>
          📸 Photo Prize of the Month
        </span>
      </div>
      
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{contest.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.5 }}>{contest.description}</p>
          </div>
          <div style={{
            background: SocialTheme.colors.gold,
            color: "#050505",
            padding: "8px 16px",
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 13,
          }}>
            {daysLeft} days left
          </div>
        </div>

        <div style={{
          background: "rgba(212,175,55,0.1)",
          border: "1px solid rgba(212,175,55,0.3)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, color: SocialTheme.colors.gold, marginBottom: 8 }}>USE HASHTAG</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: SocialTheme.colors.gold }}>{contest.hashtag}</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>🏆 PRIZE PACKAGE</div>
          <div style={{ fontSize: 16, lineHeight: 1.6 }}>{contest.prizeDescription}</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>TOP ENTRIES</span>
            <span style={{ color: SocialTheme.colors.gold, fontSize: 13, cursor: "pointer" }}>View all →</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {contest.topEntries.map((entry, index) => (
              <div key={entry.id} style={{ position: "relative", flex: 1 }}>
                <img
                  src={entry.imageUrl}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: 12,
                    border: index === 0 ? `2px solid ${SocialTheme.colors.gold}` : "none",
                  }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.8)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}>
                  <span>{entry.authorName}</span>
                  <span style={{ color: SocialTheme.colors.gold }}>❤️ {entry.votes}</span>
                </div>
                {index === 0 && (
                  <div style={{
                    position: "absolute",
                    top: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: SocialTheme.colors.gold,
                    color: "#050505",
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    #1
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <button
            data-testid="enter-contest-btn"
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #D4AF37 0%, #F5E6C4 100%)",
              color: "#050505",
              border: "none",
              padding: "16px 24px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Enter Contest
          </button>
          <button
            data-testid="vote-contest-btn"
            style={{
              flex: 1,
              background: "transparent",
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.3)",
              padding: "16px 24px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Vote Now
          </button>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 32,
          marginTop: 20,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: SocialTheme.colors.gold }}>{formatNumber(contest.entriesCount)}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Entries</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: SocialTheme.colors.gold }}>{formatNumber(contest.votesCount)}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Votes</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LeaderboardCard({ leaderboard }: { leaderboard: typeof DEMO_LEADERBOARD }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid="leaderboard-card"
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: SocialTheme.shadows.card,
        overflow: "hidden",
      }}
    >
      <div style={{
        background: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
        padding: "20px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🏆 Top Members</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>This Month's Leaders</p>
        </div>
        <div style={{
          background: SocialTheme.colors.gold,
          color: "#050505",
          padding: "8px 16px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
        }}>
          December 2025
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {leaderboard.map((member, index) => (
          <div
            key={member.rank}
            data-testid={`leaderboard-member-${member.rank}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              background: index === 0 ? "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.02) 100%)" : "transparent",
              borderRadius: 12,
              marginBottom: index < leaderboard.length - 1 ? 8 : 0,
              border: index === 0 ? `1px solid ${SocialTheme.colors.gold}` : "none",
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: index === 0 ? SocialTheme.colors.gold : index === 1 ? "#C0C0C0" : index === 2 ? "#CD7F32" : SocialTheme.colors.softGray,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              color: index < 3 ? "#fff" : SocialTheme.colors.textSecondary,
            }}>
              {member.rank}
            </div>
            <Avatar name={member.displayName} size={44} tier={member.tier} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: SocialTheme.colors.textPrimary }}>{member.displayName}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {member.badges.slice(0, 2).map(badge => (
                  <span
                    key={badge}
                    style={{
                      fontSize: 10,
                      background: SocialTheme.colors.goldLight,
                      color: SocialTheme.colors.gold,
                      padding: "2px 8px",
                      borderRadius: 10,
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: SocialTheme.colors.gold, fontSize: 16 }}>
                {formatNumber(member.totalPoints)} pts
              </div>
              <div style={{ fontSize: 12, color: SocialTheme.colors.textSecondary }}>
                ${formatNumber(member.totalSpend)} spent
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: "16px 24px",
        background: SocialTheme.colors.softGray,
        textAlign: "center",
      }}>
        <button
          data-testid="view-full-leaderboard-btn"
          style={{
            background: "none",
            border: "none",
            color: SocialTheme.colors.gold,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          View Full Leaderboard →
        </button>
      </div>
    </motion.div>
  );
}

function ChatSidebar({ chats, activeChat, onSelectChat }: { chats: typeof DEMO_CHATS; activeChat: string | null; onSelectChat: (id: string) => void }) {
  return (
    <div
      data-testid="chat-sidebar"
      style={{
        width: 320,
        background: "#fff",
        borderRight: `1px solid ${SocialTheme.colors.borderSoft}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{
        padding: 20,
        borderBottom: `1px solid ${SocialTheme.colors.borderSoft}`,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Messages</h2>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: SocialTheme.colors.softGray,
          borderRadius: 12,
          padding: "10px 14px",
        }}>
          <span style={{ color: SocialTheme.colors.textSecondary }}>🔍</span>
          <input
            type="text"
            placeholder="Search conversations..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        {chats.map(chat => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            data-testid={`chat-item-${chat.id}`}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 16,
              background: activeChat === chat.id ? SocialTheme.colors.goldLight : "transparent",
              border: "none",
              borderBottom: `1px solid ${SocialTheme.colors.borderSoft}`,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {chat.roomType === "direct" ? (
              <Avatar
                name={chat.otherUser!.displayName}
                size={48}
                isOnline={chat.otherUser!.isOnline}
              />
            ) : (
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #D4AF37 0%, #F5E6C4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}>
                👥
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: SocialTheme.colors.textPrimary }}>
                  {chat.roomType === "direct" ? chat.otherUser!.displayName : chat.name}
                </span>
                <span style={{ fontSize: 12, color: SocialTheme.colors.textSecondary }}>
                  {formatTimeAgo(chat.lastMessageAt)}
                </span>
              </div>
              <div style={{
                fontSize: 14,
                color: SocialTheme.colors.textSecondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {chat.lastMessage}
              </div>
            </div>
            {chat.unreadCount > 0 && (
              <div style={{
                background: SocialTheme.colors.gold,
                color: "#fff",
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
              }}>
                {chat.unreadCount}
              </div>
            )}
          </button>
        ))}
      </div>

      <div style={{
        padding: 16,
        borderTop: `1px solid ${SocialTheme.colors.borderSoft}`,
      }}>
        <button
          data-testid="new-chat-btn"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "linear-gradient(135deg, #D4AF37 0%, #F5E6C4 100%)",
            color: "#050505",
            border: "none",
            padding: "14px 20px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          ✨ New Message
        </button>
      </div>
    </div>
  );
}

function ChatWindow({ messages, chatName }: { messages: typeof DEMO_MESSAGES; chatName: string }) {
  const [newMessage, setNewMessage] = useState("");

  return (
    <div
      data-testid="chat-window"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: SocialTheme.colors.softGray,
      }}
    >
      <div style={{
        padding: 20,
        background: "#fff",
        borderBottom: `1px solid ${SocialTheme.colors.borderSoft}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={chatName} size={40} isOnline />
          <div>
            <div style={{ fontWeight: 600 }}>{chatName}</div>
            <div style={{ fontSize: 13, color: SocialTheme.colors.success }}>Online</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>📞</button>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>📹</button>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>ℹ️</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.senderId === "me" ? "flex-end" : "flex-start",
              marginBottom: 16,
            }}
          >
            <div style={{
              maxWidth: "70%",
              background: msg.senderId === "me" ? "linear-gradient(135deg, #D4AF37 0%, #F5E6C4 100%)" : "#fff",
              color: msg.senderId === "me" ? "#050505" : SocialTheme.colors.textPrimary,
              padding: "12px 16px",
              borderRadius: msg.senderId === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <p style={{ fontSize: 15, lineHeight: 1.5, margin: 0 }}>{msg.content}</p>
              <div style={{
                fontSize: 11,
                color: msg.senderId === "me" ? "rgba(0,0,0,0.5)" : SocialTheme.colors.textSecondary,
                marginTop: 6,
                textAlign: "right",
              }}>
                {formatTimeAgo(msg.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: 16,
        background: "#fff",
        borderTop: `1px solid ${SocialTheme.colors.borderSoft}`,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: SocialTheme.colors.softGray,
          borderRadius: 24,
          padding: "8px 16px",
        }}>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>📎</button>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>📷</button>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            data-testid="chat-input"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 15,
              outline: "none",
            }}
          />
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>😊</button>
          <button
            data-testid="send-message-btn"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: newMessage ? SocialTheme.colors.gold : SocialTheme.colors.borderSoft,
              border: "none",
              cursor: newMessage ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

type TabType = "feed" | "chat" | "contests" | "leaderboard" | "inbox";

export default function SocialCloud() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useFirebaseAuth();
  const currentUserId = user?.uid || "guest";
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { data: feedPosts = DEMO_POSTS, isLoading: feedLoading } = useQuery({
    queryKey: ["social", "feed"],
    queryFn: () => fetchApi("/feed"),
    staleTime: 30000,
    retry: 1,
  });

  const { data: trendingHashtags = DEMO_HASHTAGS } = useQuery({
    queryKey: ["social", "hashtags", "trending"],
    queryFn: () => fetchApi("/hashtags/trending"),
    staleTime: 60000,
    retry: 1,
  });

  const { data: contests = [] } = useQuery({
    queryKey: ["social", "contests"],
    queryFn: () => fetchApi("/contests"),
    staleTime: 60000,
    retry: 1,
  });

  const { data: leaderboard = DEMO_LEADERBOARD } = useQuery({
    queryKey: ["social", "leaderboard"],
    queryFn: () => fetchApi("/leaderboard?period=monthly"),
    staleTime: 60000,
    retry: 1,
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) =>
      fetchApi(`/posts/${postId}/like`, { method: "POST", body: JSON.stringify({ userId: currentUserId }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social", "feed"] }),
  });

  const { data: chatRooms = DEMO_CHATS } = useQuery({
    queryKey: ["social", "chat", "rooms", currentUserId],
    queryFn: () => fetchApi(`/chat/rooms?userId=${currentUserId}`),
    enabled: isAuthenticated && activeTab === "chat",
    staleTime: 30000,
    retry: 1,
  });

  const { data: chatMessages = DEMO_MESSAGES } = useQuery({
    queryKey: ["social", "chat", "messages", activeChat],
    queryFn: () => fetchApi(`/chat/rooms/${activeChat}/messages`),
    enabled: isAuthenticated && activeTab === "chat" && !!activeChat,
    staleTime: 10000,
    retry: 1,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ roomId, content }: { roomId: string; content: string }) =>
      fetchApi(`/chat/rooms/${roomId}/messages`, { 
        method: "POST", 
        body: JSON.stringify({ senderId: currentUserId, content }) 
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social", "chat"] }),
  });

  const contestVoteMutation = useMutation({
    mutationFn: ({ contestId, entryId }: { contestId: string; entryId: string }) =>
      fetchApi(`/contests/${contestId}/vote`, { 
        method: "POST", 
        body: JSON.stringify({ entryId, voterId: currentUserId }) 
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social", "contests"] }),
  });

  const { data: inboxData = { messages: [], unreadCount: 0 } } = useQuery({
    queryKey: ["social", "inbox", currentUserId],
    queryFn: () => fetchApi(`/inbox?userId=${currentUserId}`),
    enabled: isAuthenticated && activeTab === "inbox",
    staleTime: 30000,
    retry: 1,
  });

  const markInboxReadMutation = useMutation({
    mutationFn: (messageId: string) =>
      fetchApi(`/inbox/${messageId}/read`, { method: "PUT" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["social", "inbox"] }),
  });

  const reportMutation = useMutation({
    mutationFn: ({ postId, reason }: { postId: string; reason: string }) =>
      fetchApi(`/reports`, { 
        method: "POST", 
        body: JSON.stringify({ 
          reporterId: currentUserId,
          postId,
          reportType: "post",
          reason,
        }) 
      }),
    onSuccess: () => {
      alert("Thank you for your report. Our moderation team will review it.");
    },
  });

  const posts = feedPosts.length > 0 ? feedPosts : DEMO_POSTS;
  const hashtags = trendingHashtags.length > 0 ? trendingHashtags : DEMO_HASHTAGS;
  const activeContest = contests.find((c: any) => c.status === "active") || DEMO_CONTEST;
  const leaderboardData = leaderboard.length > 0 ? leaderboard : DEMO_LEADERBOARD;
  const chats = chatRooms.length > 0 ? chatRooms : DEMO_CHATS;
  const messages = chatMessages.length > 0 ? chatMessages : DEMO_MESSAGES;

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "feed", label: "Feed", icon: LuxuryIcons.feed },
    { id: "chat", label: "Chat", icon: LuxuryIcons.chat },
    { id: "contests", label: "Contests", icon: LuxuryIcons.contests },
    { id: "leaderboard", label: "Leaderboard", icon: LuxuryIcons.leaderboard },
    { id: "inbox", label: "Inbox", icon: LuxuryIcons.inbox },
  ];

  return (
    <div style={{ minHeight: "100vh", background: SocialTheme.colors.softGray }}>
      <MainNav />
      
      <div style={{
        background: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
        padding: "60px 20px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(212,175,55,0.15)",
            padding: "8px 20px",
            borderRadius: 24,
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 20 }}>☁️</span>
            <span style={{ color: SocialTheme.colors.gold, fontWeight: 600, fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>
              Essence Social Cloud
            </span>
          </div>
          <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 700, marginBottom: 12 }} data-testid="social-cloud-title">
            Connect with the <span style={{ color: SocialTheme.colors.gold }}>Essence</span> Community
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
            Share moments, chat with fellow members, win prizes, and climb the leaderboard
          </p>
        </motion.div>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 8,
        padding: "20px",
        background: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`tab-${tab.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 24,
              border: "none",
              background: activeTab === tab.id ? "linear-gradient(135deg, #D4AF37 0%, #F5E6C4 100%)" : "transparent",
              color: activeTab === tab.id ? "#050505" : SocialTheme.colors.textSecondary,
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: 15,
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "feed" && (
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: 24,
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 24,
            }}
          >
            <div>
              <div style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                boxShadow: SocialTheme.shadows.card,
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar name="You" size={44} tier="GOLD" />
                  <button
                    onClick={() => setShowCreatePost(true)}
                    data-testid="create-post-btn"
                    style={{
                      flex: 1,
                      background: SocialTheme.colors.softGray,
                      border: "none",
                      borderRadius: 24,
                      padding: "14px 20px",
                      textAlign: "left",
                      color: SocialTheme.colors.textSecondary,
                      cursor: "pointer",
                      fontSize: 15,
                    }}
                  >
                    Share your Essence moment...
                  </button>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: `1px solid ${SocialTheme.colors.borderSoft}`,
                }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: SocialTheme.colors.textSecondary }}>
                    📷 Photo
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: SocialTheme.colors.textSecondary }}>
                    🎬 Video
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: SocialTheme.colors.textSecondary }}>
                    🎉 Event
                  </button>
                </div>
              </div>

              {posts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => likeMutation.mutate(post.id)}
                  onComment={() => {}}
                  onReport={(postId) => reportMutation.mutate({ postId, reason: "Reported by user" })}
                />
              ))}
            </div>

            <div style={{ position: "sticky", top: 100, alignSelf: "flex-start" }}>
              <div style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                boxShadow: SocialTheme.shadows.card,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>🔥 Trending Hashtags</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {hashtags.filter((h: any) => h.isTrending).map((hashtag: any) => (
                    <HashtagPill
                      key={hashtag.id}
                      tag={hashtag.tag}
                      count={hashtag.usageCount}
                      isTrending={hashtag.isTrending}
                      isOfficial={hashtag.isOfficial}
                    />
                  ))}
                </div>
              </div>

              <div style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                boxShadow: SocialTheme.shadows.card,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>💫 Official Tags</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {hashtags.filter((h: any) => h.isOfficial).map((hashtag: any) => (
                    <HashtagPill
                      key={hashtag.id}
                      tag={hashtag.tag}
                      isOfficial
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              height: "calc(100vh - 280px)",
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: SocialTheme.shadows.card,
              marginTop: 24,
              marginBottom: 24,
            }}
          >
            <ChatSidebar
              chats={chats}
              activeChat={activeChat}
              onSelectChat={setActiveChat}
            />
            {activeChat && (
              <ChatWindow
                messages={messages}
                chatName={chats.find((c: any) => c.id === activeChat)?.otherUser?.displayName || chats.find((c: any) => c.id === activeChat)?.name || ""}
              />
            )}
          </motion.div>
        )}

        {activeTab === "contests" && (
          <motion.div
            key="contests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: 24,
            }}
          >
            <ContestCard contest={activeContest} />

            <div style={{
              marginTop: 32,
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              boxShadow: SocialTheme.shadows.card,
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>📜 Past Winners</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { month: "November 2025", winner: "Alexandra K.", theme: "Autumn Vibes", imageUrl: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=300&h=300&fit=crop" },
                  { month: "October 2025", winner: "James T.", theme: "Halloween Special", imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop" },
                  { month: "September 2025", winner: "Sofia M.", theme: "Back to School", imageUrl: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=300&h=300&fit=crop" },
                ].map(past => (
                  <div
                    key={past.month}
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      border: `1px solid ${SocialTheme.colors.borderSoft}`,
                    }}
                  >
                    <img src={past.imageUrl} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                    <div style={{ padding: 16 }}>
                      <div style={{ fontSize: 12, color: SocialTheme.colors.textSecondary, marginBottom: 4 }}>{past.month}</div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{past.winner}</div>
                      <div style={{ fontSize: 13, color: SocialTheme.colors.gold }}>{past.theme}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              maxWidth: 800,
              margin: "0 auto",
              padding: 24,
            }}
          >
            <LeaderboardCard leaderboard={leaderboardData} />

            <div style={{
              marginTop: 32,
              background: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
              borderRadius: 20,
              padding: 32,
              color: "#fff",
            }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
                <span style={{ color: SocialTheme.colors.gold }}>{LuxuryIcons.contests}</span> Top Member Perks
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { icon: LuxuryIcons.contests, title: "VIP Events", description: "Exclusive access to tasting events and parties" },
                  { icon: LuxuryIcons.diamond, title: "Double Points", description: "Earn 2x points on every purchase" },
                  { icon: LuxuryIcons.star, title: "Birthday Bonus", description: "Free premium cup on your birthday" },
                  { icon: LuxuryIcons.leaderboard, title: "Priority Access", description: "Be first to try new flavors" },
                  { icon: LuxuryIcons.crown, title: "Member Discounts", description: "Up to 25% off on select items" },
                  { icon: LuxuryIcons.feed, title: "Surprise Rewards", description: "Monthly surprise gifts and offers" },
                ].map(perk => (
                  <div
                    key={perk.title}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 16,
                      padding: 20,
                      textAlign: "center",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{perk.icon}</div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>{perk.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{perk.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "inbox" && (
          <motion.div
            key="inbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              maxWidth: 800,
              margin: "0 auto",
              padding: 24,
            }}
          >
            <div style={{
              background: SocialTheme.colors.pureWhite,
              borderRadius: 20,
              boxShadow: SocialTheme.shadows.card,
              overflow: "hidden",
            }}>
              <div style={{
                background: SocialTheme.colors.goldMetallic,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24, color: SocialTheme.colors.textPrimary }}>{LuxuryIcons.inbox}</span>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: SocialTheme.colors.textPrimary, margin: 0 }}>
                    My Inbox
                  </h2>
                </div>
                {inboxData.unreadCount > 0 && (
                  <span style={{
                    background: SocialTheme.colors.error,
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    {inboxData.unreadCount} unread
                  </span>
                )}
              </div>
              
              {inboxData.messages.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16, color: SocialTheme.colors.goldSoft }}>{LuxuryIcons.inbox}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: SocialTheme.colors.textPrimary }}>
                    Your inbox is empty
                  </h3>
                  <p style={{ color: SocialTheme.colors.textSecondary, fontSize: 14 }}>
                    Messages from Essence Yogurt and other members will appear here.
                  </p>
                </div>
              ) : (
                <div>
                  {inboxData.messages.map((message: any) => (
                    <div
                      key={message.id}
                      data-testid={`inbox-message-${message.id}`}
                      onClick={() => !message.isRead && markInboxReadMutation.mutate(message.id)}
                      style={{
                        padding: "16px 24px",
                        borderBottom: `1px solid ${SocialTheme.colors.borderSoft}`,
                        cursor: "pointer",
                        background: message.isRead ? SocialTheme.colors.pureWhite : SocialTheme.colors.goldLight,
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: message.senderType === "system" 
                            ? SocialTheme.colors.goldMetallic 
                            : SocialTheme.colors.softGray,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          color: SocialTheme.colors.gold,
                        }}>
                          {message.senderType === "system" ? LuxuryIcons.star : LuxuryIcons.chat}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ 
                              fontWeight: message.isRead ? 500 : 700, 
                              color: SocialTheme.colors.textPrimary,
                              fontSize: 15,
                            }}>
                              {message.subject}
                            </span>
                            <span style={{ fontSize: 12, color: SocialTheme.colors.textSecondary }}>
                              {formatTimeAgo(message.createdAt)}
                            </span>
                          </div>
                          <p style={{ 
                            fontSize: 14, 
                            color: SocialTheme.colors.textSecondary, 
                            margin: 0,
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}>
                            {message.body}
                          </p>
                          {message.category && (
                            <span style={{
                              display: "inline-block",
                              marginTop: 8,
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              background: SocialTheme.colors.goldLight,
                              color: SocialTheme.colors.gold,
                            }}>
                              {message.category}
                            </span>
                          )}
                        </div>
                        {!message.isRead && (
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: SocialTheme.colors.gold,
                          }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}