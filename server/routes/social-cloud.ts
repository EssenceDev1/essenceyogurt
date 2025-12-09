import { Router } from "express";
import { db } from "../../db/index";
import { eq, desc, and, sql, inArray, gte, lte } from "drizzle-orm";
import {
  socialProfiles, socialFollows, socialPosts, socialMedia, socialHashtags,
  socialPostHashtags, socialLikes, socialComments, socialChatRooms, socialChatMembers,
  socialMessages, photoContests, photoContestEntries, photoContestVotes,
  loyaltyLeaderboard, socialNotifications, socialReports, memberInbox,
  insertSocialProfileSchema, insertSocialPostSchema, insertSocialMediaSchema,
  insertSocialCommentSchema, insertSocialChatRoomSchema, insertSocialMessageSchema,
  insertPhotoContestSchema, insertPhotoContestEntrySchema, insertPhotoContestVoteSchema,
  insertSocialReportSchema, insertMemberInboxSchema
} from "@shared/schema";
import { moderateContent } from "../services/content-moderation";

const router = Router();

// ==================== SOCIAL PROFILES ====================

router.get("/profiles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await db.select().from(socialProfiles).where(eq(socialProfiles.userId, userId)).limit(1);
    
    if (profile.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    res.json(profile[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.post("/profiles", async (req, res) => {
  try {
    const validatedData = insertSocialProfileSchema.parse(req.body);
    const profile = await db.insert(socialProfiles).values(validatedData).returning();
    res.status(201).json(profile[0]);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(400).json({ error: "Failed to create profile" });
  }
});

router.put("/profiles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    const profile = await db.update(socialProfiles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(socialProfiles.userId, userId))
      .returning();
    
    if (profile.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    res.json(profile[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(400).json({ error: "Failed to update profile" });
  }
});

// ==================== SOCIAL FEED/POSTS ====================

router.get("/feed", async (req, res) => {
  try {
    const { page = "1", limit = "20", hashtag, authorId, type } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    let query = db.select().from(socialPosts)
      .where(eq(socialPosts.moderationStatus, "approved"))
      .orderBy(desc(socialPosts.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);
    
    const posts = await query;
    
    const postsWithMedia = await Promise.all(posts.map(async (post) => {
      const media = await db.select().from(socialMedia)
        .where(eq(socialMedia.postId, post.id))
        .orderBy(socialMedia.displayOrder);
      
      const hashtagJoins = await db.select().from(socialPostHashtags)
        .where(eq(socialPostHashtags.postId, post.id));
      
      const hashtagIds = hashtagJoins.map(h => h.hashtagId);
      let hashtags: { tag: string }[] = [];
      if (hashtagIds.length > 0) {
        hashtags = await db.select({ tag: socialHashtags.tag })
          .from(socialHashtags)
          .where(inArray(socialHashtags.id, hashtagIds));
      }
      
      const author = await db.select().from(socialProfiles)
        .where(eq(socialProfiles.userId, post.authorId))
        .limit(1);
      
      return {
        ...post,
        media,
        hashtags: hashtags.map(h => h.tag),
        author: author[0] || { displayName: "Unknown", avatarUrl: null },
      };
    }));
    
    res.json(postsWithMedia);
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await db.select().from(socialPosts).where(eq(socialPosts.id, postId)).limit(1);
    
    if (post.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    const media = await db.select().from(socialMedia)
      .where(eq(socialMedia.postId, postId))
      .orderBy(socialMedia.displayOrder);
    
    const hashtagJoins = await db.select().from(socialPostHashtags)
      .where(eq(socialPostHashtags.postId, postId));
    
    const hashtagIds = hashtagJoins.map(h => h.hashtagId);
    let hashtags: { tag: string }[] = [];
    if (hashtagIds.length > 0) {
      hashtags = await db.select({ tag: socialHashtags.tag })
        .from(socialHashtags)
        .where(inArray(socialHashtags.id, hashtagIds));
    }
    
    const author = await db.select().from(socialProfiles)
      .where(eq(socialProfiles.userId, post[0].authorId))
      .limit(1);
    
    res.json({
      ...post[0],
      media,
      hashtags: hashtags.map(h => h.tag),
      author: author[0] || { displayName: "Unknown", avatarUrl: null },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.post("/posts", async (req, res) => {
  try {
    const { content, postType, visibility, locationName, locationId, eventDate, eventTitle, eventVenue, contestId, media, hashtags } = req.body;
    const authorId = req.body.authorId;
    
    const moderation = await moderateContent(content || "");
    if (!moderation.isApproved) {
      return res.status(400).json({
        error: "Content not approved",
        violations: moderation.violations,
        flaggedCategories: moderation.flaggedCategories,
        severity: moderation.severity,
        message: "Your post contains content that violates our community guidelines. Please revise and try again."
      });
    }
    
    const post = await db.insert(socialPosts).values({
      authorId,
      content,
      postType: postType || "post",
      visibility: visibility || "public",
      locationName,
      locationId,
      eventDate,
      eventTitle,
      eventVenue,
      contestId,
    }).returning();
    
    if (media && Array.isArray(media)) {
      for (let i = 0; i < media.length; i++) {
        await db.insert(socialMedia).values({
          postId: post[0].id,
          mediaType: media[i].mediaType,
          mediaUrl: media[i].mediaUrl,
          thumbnailUrl: media[i].thumbnailUrl,
          width: media[i].width,
          height: media[i].height,
          duration: media[i].duration,
          altText: media[i].altText,
          displayOrder: i,
        });
      }
    }
    
    if (hashtags && Array.isArray(hashtags)) {
      for (const tag of hashtags) {
        const normalizedTag = tag.replace(/^#/, "").toLowerCase();
        
        let hashtagRecord = await db.select().from(socialHashtags)
          .where(eq(socialHashtags.tag, normalizedTag))
          .limit(1);
        
        if (hashtagRecord.length === 0) {
          hashtagRecord = await db.insert(socialHashtags).values({
            tag: normalizedTag,
            usageCount: 1,
          }).returning();
        } else {
          await db.update(socialHashtags)
            .set({ usageCount: sql`${socialHashtags.usageCount} + 1` })
            .where(eq(socialHashtags.id, hashtagRecord[0].id));
        }
        
        await db.insert(socialPostHashtags).values({
          postId: post[0].id,
          hashtagId: hashtagRecord[0].id,
        });
      }
    }
    
    await db.update(socialProfiles)
      .set({ postsCount: sql`${socialProfiles.postsCount} + 1` })
      .where(eq(socialProfiles.userId, authorId));
    
    res.status(201).json(post[0]);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({ error: "Failed to create post" });
  }
});

// ==================== LIKES ====================

router.post("/posts/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    
    const existingLike = await db.select().from(socialLikes)
      .where(and(eq(socialLikes.postId, postId), eq(socialLikes.userId, userId)))
      .limit(1);
    
    if (existingLike.length > 0) {
      await db.delete(socialLikes).where(eq(socialLikes.id, existingLike[0].id));
      await db.update(socialPosts)
        .set({ likesCount: sql`${socialPosts.likesCount} - 1` })
        .where(eq(socialPosts.id, postId));
      return res.json({ liked: false });
    }
    
    await db.insert(socialLikes).values({ postId, userId });
    await db.update(socialPosts)
      .set({ likesCount: sql`${socialPosts.likesCount} + 1` })
      .where(eq(socialPosts.id, postId));
    
    res.json({ liked: true });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(400).json({ error: "Failed to toggle like" });
  }
});

// ==================== COMMENTS ====================

router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await db.select().from(socialComments)
      .where(eq(socialComments.postId, postId))
      .orderBy(desc(socialComments.createdAt));
    
    const commentsWithAuthors = await Promise.all(comments.map(async (comment) => {
      const author = await db.select().from(socialProfiles)
        .where(eq(socialProfiles.userId, comment.authorId))
        .limit(1);
      return {
        ...comment,
        author: author[0] || { displayName: "Unknown", avatarUrl: null },
      };
    }));
    
    res.json(commentsWithAuthors);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { authorId, content, parentCommentId } = req.body;
    
    const comment = await db.insert(socialComments).values({
      postId,
      authorId,
      content,
      parentCommentId,
    }).returning();
    
    await db.update(socialPosts)
      .set({ commentsCount: sql`${socialPosts.commentsCount} + 1` })
      .where(eq(socialPosts.id, postId));
    
    if (parentCommentId) {
      await db.update(socialComments)
        .set({ repliesCount: sql`${socialComments.repliesCount} + 1` })
        .where(eq(socialComments.id, parentCommentId));
    }
    
    res.status(201).json(comment[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(400).json({ error: "Failed to create comment" });
  }
});

// ==================== FOLLOWS ====================

router.post("/follow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    
    const existingFollow = await db.select().from(socialFollows)
      .where(and(eq(socialFollows.followerId, followerId), eq(socialFollows.followingId, followingId)))
      .limit(1);
    
    if (existingFollow.length > 0) {
      await db.delete(socialFollows).where(eq(socialFollows.id, existingFollow[0].id));
      await db.update(socialProfiles)
        .set({ followersCount: sql`${socialProfiles.followersCount} - 1` })
        .where(eq(socialProfiles.userId, followingId));
      await db.update(socialProfiles)
        .set({ followingCount: sql`${socialProfiles.followingCount} - 1` })
        .where(eq(socialProfiles.userId, followerId));
      return res.json({ following: false });
    }
    
    await db.insert(socialFollows).values({ followerId, followingId });
    await db.update(socialProfiles)
      .set({ followersCount: sql`${socialProfiles.followersCount} + 1` })
      .where(eq(socialProfiles.userId, followingId));
    await db.update(socialProfiles)
      .set({ followingCount: sql`${socialProfiles.followingCount} + 1` })
      .where(eq(socialProfiles.userId, followerId));
    
    res.json({ following: true });
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(400).json({ error: "Failed to toggle follow" });
  }
});

// ==================== HASHTAGS ====================

router.get("/hashtags/trending", async (req, res) => {
  try {
    const trending = await db.select().from(socialHashtags)
      .where(eq(socialHashtags.isTrending, true))
      .orderBy(desc(socialHashtags.usageCount))
      .limit(10);
    res.json(trending);
  } catch (error) {
    console.error("Error fetching trending hashtags:", error);
    res.status(500).json({ error: "Failed to fetch trending hashtags" });
  }
});

router.get("/hashtags/:tag", async (req, res) => {
  try {
    const { tag } = req.params;
    const hashtag = await db.select().from(socialHashtags)
      .where(eq(socialHashtags.tag, tag.toLowerCase()))
      .limit(1);
    
    if (hashtag.length === 0) {
      return res.status(404).json({ error: "Hashtag not found" });
    }
    
    const postHashtags = await db.select().from(socialPostHashtags)
      .where(eq(socialPostHashtags.hashtagId, hashtag[0].id));
    
    const postIds = postHashtags.map(ph => ph.postId);
    let posts: any[] = [];
    if (postIds.length > 0) {
      posts = await db.select().from(socialPosts)
        .where(inArray(socialPosts.id, postIds))
        .orderBy(desc(socialPosts.createdAt));
    }
    
    res.json({ hashtag: hashtag[0], posts });
  } catch (error) {
    console.error("Error fetching hashtag:", error);
    res.status(500).json({ error: "Failed to fetch hashtag" });
  }
});

// ==================== CHAT ====================

router.get("/chat/rooms", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    const memberships = await db.select().from(socialChatMembers)
      .where(eq(socialChatMembers.userId, userId));
    
    const roomIds = memberships.map(m => m.roomId);
    let rooms: any[] = [];
    if (roomIds.length > 0) {
      rooms = await db.select().from(socialChatRooms)
        .where(inArray(socialChatRooms.id, roomIds))
        .orderBy(desc(socialChatRooms.lastMessageAt));
    }
    
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ error: "Failed to fetch chat rooms" });
  }
});

router.get("/chat/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = "1", limit = "50" } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const messages = await db.select().from(socialMessages)
      .where(eq(socialMessages.roomId, roomId))
      .orderBy(desc(socialMessages.createdAt))
      .limit(parseInt(limit as string))
      .offset(offset);
    
    const messagesWithSenders = await Promise.all(messages.map(async (msg) => {
      const sender = await db.select().from(socialProfiles)
        .where(eq(socialProfiles.userId, msg.senderId))
        .limit(1);
      return {
        ...msg,
        sender: sender[0] || { displayName: "Unknown", avatarUrl: null },
      };
    }));
    
    res.json(messagesWithSenders.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/chat/rooms", async (req, res) => {
  try {
    const { roomType, name, createdById, memberIds } = req.body;
    
    const room = await db.insert(socialChatRooms).values({
      roomType: roomType || "direct",
      name,
      createdById,
      memberCount: memberIds?.length || 2,
    }).returning();
    
    if (memberIds && Array.isArray(memberIds)) {
      for (const memberId of memberIds) {
        await db.insert(socialChatMembers).values({
          roomId: room[0].id,
          userId: memberId,
          role: memberId === createdById ? "admin" : "member",
        });
      }
    }
    
    res.status(201).json(room[0]);
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(400).json({ error: "Failed to create chat room" });
  }
});

router.post("/chat/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { senderId, content, messageType, mediaUrl, thumbnailUrl, replyToMessageId } = req.body;
    
    const message = await db.insert(socialMessages).values({
      roomId,
      senderId,
      content,
      messageType: messageType || "text",
      mediaUrl,
      thumbnailUrl,
      replyToMessageId,
    }).returning();
    
    await db.update(socialChatRooms)
      .set({
        lastMessageAt: new Date(),
        lastMessagePreview: content?.substring(0, 100) || "[Media]",
        updatedAt: new Date(),
      })
      .where(eq(socialChatRooms.id, roomId));
    
    res.status(201).json(message[0]);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(400).json({ error: "Failed to send message" });
  }
});

// ==================== PHOTO CONTESTS ====================

router.get("/contests", async (req, res) => {
  try {
    const { status } = req.query;
    
    let contests;
    if (status) {
      contests = await db.select().from(photoContests)
        .where(eq(photoContests.status, status as string))
        .orderBy(desc(photoContests.startDate));
    } else {
      contests = await db.select().from(photoContests)
        .where(eq(photoContests.isActive, true))
        .orderBy(desc(photoContests.startDate));
    }
    
    res.json(contests);
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
});

router.get("/contests/:contestId", async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await db.select().from(photoContests)
      .where(eq(photoContests.id, contestId))
      .limit(1);
    
    if (contest.length === 0) {
      return res.status(404).json({ error: "Contest not found" });
    }
    
    const entries = await db.select().from(photoContestEntries)
      .where(eq(photoContestEntries.contestId, contestId))
      .orderBy(desc(photoContestEntries.votesCount))
      .limit(10);
    
    const entriesWithPosts = await Promise.all(entries.map(async (entry) => {
      const post = await db.select().from(socialPosts)
        .where(eq(socialPosts.id, entry.postId))
        .limit(1);
      const media = await db.select().from(socialMedia)
        .where(eq(socialMedia.postId, entry.postId))
        .limit(1);
      const author = await db.select().from(socialProfiles)
        .where(eq(socialProfiles.userId, entry.userId))
        .limit(1);
      return {
        ...entry,
        post: post[0],
        media: media[0],
        author: author[0],
      };
    }));
    
    res.json({ ...contest[0], topEntries: entriesWithPosts });
  } catch (error) {
    console.error("Error fetching contest:", error);
    res.status(500).json({ error: "Failed to fetch contest" });
  }
});

router.post("/contests/:contestId/enter", async (req, res) => {
  try {
    const { contestId } = req.params;
    const { postId, userId } = req.body;
    
    const existingEntry = await db.select().from(photoContestEntries)
      .where(and(eq(photoContestEntries.contestId, contestId), eq(photoContestEntries.userId, userId)))
      .limit(1);
    
    if (existingEntry.length > 0) {
      return res.status(400).json({ error: "You have already entered this contest" });
    }
    
    const entry = await db.insert(photoContestEntries).values({
      contestId,
      postId,
      userId,
    }).returning();
    
    await db.update(photoContests)
      .set({ entriesCount: sql`${photoContests.entriesCount} + 1` })
      .where(eq(photoContests.id, contestId));
    
    res.status(201).json(entry[0]);
  } catch (error) {
    console.error("Error entering contest:", error);
    res.status(400).json({ error: "Failed to enter contest" });
  }
});

router.post("/contests/:contestId/vote", async (req, res) => {
  try {
    const { contestId } = req.params;
    const { entryId, voterId } = req.body;
    
    const existingVote = await db.select().from(photoContestVotes)
      .where(and(
        eq(photoContestVotes.contestId, contestId),
        eq(photoContestVotes.voterId, voterId)
      ))
      .limit(1);
    
    if (existingVote.length > 0) {
      return res.status(400).json({ error: "You have already voted in this contest" });
    }
    
    await db.insert(photoContestVotes).values({
      contestId,
      entryId,
      voterId,
    });
    
    await db.update(photoContestEntries)
      .set({ votesCount: sql`${photoContestEntries.votesCount} + 1` })
      .where(eq(photoContestEntries.id, entryId));
    
    await db.update(photoContests)
      .set({ votesCount: sql`${photoContests.votesCount} + 1` })
      .where(eq(photoContests.id, contestId));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(400).json({ error: "Failed to vote" });
  }
});

// ==================== LEADERBOARD ====================

router.get("/leaderboard", async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    
    const leaderboard = await db.select().from(loyaltyLeaderboard)
      .where(eq(loyaltyLeaderboard.period, period as string))
      .orderBy(loyaltyLeaderboard.rank)
      .limit(50);
    
    const leaderboardWithProfiles = await Promise.all(leaderboard.map(async (entry) => {
      const profile = await db.select().from(socialProfiles)
        .where(eq(socialProfiles.userId, entry.userId))
        .limit(1);
      return {
        ...entry,
        profile: profile[0] || { displayName: "Unknown", avatarUrl: null },
      };
    }));
    
    res.json(leaderboardWithProfiles);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// ==================== NOTIFICATIONS ====================

router.get("/notifications", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    const notifications = await db.select().from(socialNotifications)
      .where(eq(socialNotifications.userId, userId))
      .orderBy(desc(socialNotifications.createdAt))
      .limit(50);
    
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.put("/notifications/:notificationId/read", async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await db.update(socialNotifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(socialNotifications.id, notificationId));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(400).json({ error: "Failed to mark notification as read" });
  }
});

router.post("/reports", async (req, res) => {
  try {
    const validatedData = insertSocialReportSchema.parse(req.body);
    const report = await db.insert(socialReports).values(validatedData).returning();
    
    await db.insert(memberInbox).values({
      userId: validatedData.reporterId,
      senderType: "system",
      subject: "Your report has been received",
      body: `Thank you for helping keep Essence Social Cloud safe. We have received your report regarding ${validatedData.reportType}. Our moderation team will review it within 24 hours. We take all reports seriously and will take appropriate action if violations are confirmed.`,
      category: "moderation",
      priority: "normal",
    });
    
    res.status(201).json({ 
      success: true, 
      reportId: report[0].id,
      message: "Your report has been submitted. Thank you for helping keep our community safe."
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(400).json({ error: "Failed to submit report" });
  }
});

router.get("/reports", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    let reports;
    if (userId) {
      reports = await db.select().from(socialReports)
        .where(eq(socialReports.reporterId, userId))
        .orderBy(desc(socialReports.createdAt))
        .limit(50);
    } else {
      reports = await db.select().from(socialReports)
        .orderBy(desc(socialReports.createdAt))
        .limit(50);
    }
    
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

router.get("/inbox", async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    
    const inbox = await db.select().from(memberInbox)
      .where(and(
        eq(memberInbox.userId, userId),
        eq(memberInbox.isArchived, false)
      ))
      .orderBy(desc(memberInbox.createdAt))
      .limit(50);
    
    const unreadCount = inbox.filter(m => !m.isRead).length;
    
    res.json({ messages: inbox, unreadCount });
  } catch (error) {
    console.error("Error fetching inbox:", error);
    res.status(500).json({ error: "Failed to fetch inbox" });
  }
});

router.put("/inbox/:messageId/read", async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await db.update(memberInbox)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(memberInbox.id, messageId));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(400).json({ error: "Failed to mark message as read" });
  }
});

router.put("/inbox/:messageId/archive", async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await db.update(memberInbox)
      .set({ isArchived: true, archivedAt: new Date() })
      .where(eq(memberInbox.id, messageId));
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error archiving message:", error);
    res.status(400).json({ error: "Failed to archive message" });
  }
});

router.post("/inbox/send", async (req, res) => {
  try {
    const { recipientId, subject, body, category, priority } = req.body;
    const senderId = req.body.senderId;
    
    const moderation = await moderateContent(body || "");
    if (!moderation.isApproved) {
      return res.status(400).json({
        error: "Message content not approved",
        violations: moderation.violations,
        message: "Your message contains content that violates our community guidelines."
      });
    }
    
    const message = await db.insert(memberInbox).values({
      userId: recipientId,
      senderId,
      senderType: "member",
      subject,
      body,
      category: category || "general",
      priority: priority || "normal",
    }).returning();
    
    res.status(201).json(message[0]);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(400).json({ error: "Failed to send message" });
  }
});

export default router;