import { Router } from "express";
import { getBackupService, generateBackupKey } from "../services/backup-service";
import {
  checkGoogleDriveConnection,
  listBackups,
  createDatabaseBackup,
  downloadBackup,
  deleteBackup,
  restoreFromBackup,
  createFullPlatformBackup
} from "../services/google-drive-backup";

const router = Router();

// =======================================================================
// LOCAL BACKUP STATUS
// =======================================================================

router.get("/status", async (req, res) => {
  const service = getBackupService();
  const localStatus = service.getStatus();
  
  const driveStatus = await checkGoogleDriveConnection();
  
  res.json({
    local: localStatus,
    googleDrive: driveStatus
  });
});

router.get("/generate-key", (req, res) => {
  const key = generateBackupKey();
  res.json({
    key,
    instructions: "Add this as BACKUP_KEY in your Replit Secrets. Keep it safe - you'll need it to decrypt backups.",
  });
});

router.post("/test-encryption", async (req, res) => {
  try {
    const service = getBackupService();
    const testData = Buffer.from("Essence Yogurt Test Backup 2026");
    
    const result = service.encrypt(testData);
    
    if (!result) {
      return res.json({
        ok: false,
        message: "Encryption not configured. Add BACKUP_KEY secret (minimum 32 characters).",
      });
    }

    const decrypted = service.decrypt(result.encrypted, result.iv, result.authTag);
    const success = decrypted?.toString() === testData.toString();

    res.json({
      ok: success,
      message: success ? "Encryption working correctly" : "Encryption/decryption mismatch",
      originalSize: testData.length,
      encryptedSize: result.encrypted.length,
    });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// =======================================================================
// GOOGLE DRIVE BACKUP ROUTES
// =======================================================================

router.get("/google-drive/connection", async (req, res) => {
  try {
    const status = await checkGoogleDriveConnection();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

router.get("/google-drive/list", async (req, res) => {
  try {
    const result = await listBackups();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ files: [], error: error.message });
  }
});

router.post("/google-drive/backup", async (req, res) => {
  try {
    const { encrypt = true, includeMetadata = true } = req.body;
    
    console.log("[BackupRoute] Starting Google Drive backup...");
    const result = await createDatabaseBackup({ encrypt, includeMetadata });
    
    if (result.success) {
      res.json({
        success: true,
        message: "Backup uploaded to Google Drive successfully",
        fileId: result.fileId,
        fileName: result.fileName,
        webViewLink: result.webViewLink,
        sizeMB: result.sizeMB
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    console.error("[BackupRoute] Backup error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/google-drive/download/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const result = await downloadBackup(fileId);
    
    if (result.data) {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=backup_${fileId}.json`);
      res.send(result.data);
    } else {
      res.status(404).json({ error: result.error || "File not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/google-drive/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const result = await deleteBackup(fileId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/google-drive/restore/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const result = await restoreFromBackup(fileId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/google-drive/backup-now", async (req, res) => {
  try {
    console.log("[BackupRoute] Manual backup triggered");
    const result = await createDatabaseBackup({ encrypt: true, includeMetadata: true });
    
    res.json({
      ...result,
      message: result.success ? "Backup completed and uploaded to Google Drive" : "Backup failed"
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =======================================================================
// FULL PLATFORM BACKUP - All source code + database + configs
// =======================================================================

router.post("/google-drive/full-backup", async (req, res) => {
  try {
    console.log("[BackupRoute] 🚀 FULL PLATFORM BACKUP triggered");
    res.setHeader('Content-Type', 'application/json');
    
    const result = await createFullPlatformBackup();
    
    if (result.success) {
      res.json({
        success: true,
        message: "FULL PLATFORM BACKUP completed and uploaded to Google Drive",
        fileId: result.fileId,
        fileName: result.fileName,
        webViewLink: result.webViewLink,
        sizeMB: result.sizeMB,
        fileCount: result.fileCount,
        includes: result.includes
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    console.error("[BackupRoute] Full backup error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
