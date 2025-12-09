import { Router } from "express";
import { z } from "zod";
import { db } from "../../db";
import { boardOfDirectors, executiveDepartments, insertBoardMemberSchema, insertDepartmentSchema } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

// =======================================================================
// BOARD OF DIRECTORS API
// =======================================================================

// Get all board members
router.get("/board", async (req, res) => {
  try {
    const members = await db.select().from(boardOfDirectors)
      .where(eq(boardOfDirectors.isActive, true))
      .orderBy(boardOfDirectors.displayOrder);
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single board member
router.get("/board/:id", async (req, res) => {
  try {
    const [member] = await db.select().from(boardOfDirectors)
      .where(eq(boardOfDirectors.id, req.params.id));
    if (!member) return res.status(404).json({ error: "Board member not found" });
    res.json(member);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create board member
router.post("/board", async (req, res) => {
  try {
    const validation = insertBoardMemberSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Validation failed", details: validation.error.flatten().fieldErrors });
    }
    const [member] = await db.insert(boardOfDirectors).values(validation.data).returning();
    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update board member (schema for partial updates)
const updateBoardMemberSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  department: z.string().optional(),
  region: z.string().optional(),
  isPrimary: z.boolean().optional(),
  appointmentDate: z.coerce.date().optional(),
  termEndDate: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional(),
  votingRights: z.boolean().optional(),
  committees: z.string().optional(),
  responsibilities: z.string().optional(),
  displayOrder: z.number().optional(),
});

router.put("/board/:id", async (req, res) => {
  try {
    const validation = updateBoardMemberSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Validation failed", details: validation.error.flatten().fieldErrors });
    }

    const [member] = await db.update(boardOfDirectors)
      .set({ ...validation.data, updatedAt: new Date() })
      .where(eq(boardOfDirectors.id, req.params.id))
      .returning();
    if (!member) return res.status(404).json({ error: "Board member not found" });
    res.json(member);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete board member (soft delete)
router.delete("/board/:id", async (req, res) => {
  try {
    const [member] = await db.update(boardOfDirectors)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(boardOfDirectors.id, req.params.id))
      .returning();
    if (!member) return res.status(404).json({ error: "Board member not found" });
    res.json({ success: true, message: "Board member deactivated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =======================================================================
// EXECUTIVE DEPARTMENTS API
// =======================================================================

// Get all departments
router.get("/departments", async (req, res) => {
  try {
    const departments = await db.select().from(executiveDepartments)
      .where(eq(executiveDepartments.isActive, true));
    res.json(departments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create department
router.post("/departments", async (req, res) => {
  try {
    const validation = insertDepartmentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Validation failed", details: validation.error.flatten().fieldErrors });
    }
    const [department] = await db.insert(executiveDepartments).values(validation.data).returning();
    res.status(201).json(department);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// =======================================================================
// SEED FOUNDER DATA (Nir Hadad)
// =======================================================================

router.post("/seed-founders", async (req, res) => {
  try {
    // Check if founder already exists
    const existing = await db.select().from(boardOfDirectors)
      .where(eq(boardOfDirectors.email, "nir.h@essenceyogurt.com"));
    
    if (existing.length > 0) {
      return res.json({ message: "Founders already seeded", members: existing });
    }

    // Seed Nir Hadad as Group Managing Director & Founder
    const founders = await db.insert(boardOfDirectors).values([
      {
        name: "Nir Hadad",
        title: "Group Managing Director & Founder",
        role: "FOUNDER",
        email: "nir.h@essenceyogurt.com",
        department: "EXECUTIVE",
        region: "Global",
        isPrimary: true,
        appointmentDate: new Date("2024-01-01"),
        votingRights: true,
        committees: JSON.stringify(["STRATEGY", "AUDIT", "COMPENSATION", "NOMINATION", "RISK"]),
        responsibilities: JSON.stringify([
          "Overall strategic direction and vision",
          "Board leadership and governance",
          "Major investment decisions",
          "Global expansion strategy",
          "Executive team leadership",
          "Stakeholder relations",
          "Brand and culture stewardship"
        ]),
        displayOrder: 1,
      }
    ]).returning();

    // Seed executive departments
    const departments = await db.insert(executiveDepartments).values([
      { name: "Executive Office", code: "EXEC", description: "Executive leadership and strategy", headId: founders[0].id },
      { name: "Operations", code: "OPS", description: "Global retail operations and supply chain" },
      { name: "Finance", code: "FIN", description: "Financial planning, reporting, and treasury" },
      { name: "Technology", code: "TECH", description: "IT infrastructure, software, and innovation" },
      { name: "Marketing", code: "MKT", description: "Brand, marketing, and customer experience" },
      { name: "Human Resources", code: "HR", description: "People, culture, and talent management" },
      { name: "Legal & Compliance", code: "LEGAL", description: "Legal affairs, compliance, and risk" },
      { name: "Quality Assurance", code: "QA", description: "Food safety, quality control, and standards" },
      { name: "Customer Success", code: "CS", description: "Customer support and loyalty programs" },
    ]).returning();

    res.status(201).json({
      message: "Founders and departments seeded successfully",
      founders,
      departments
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
