// Essence Yogurt - Backup Service 2026
// Encrypted backup management for database and system snapshots
// Uses AES-256 encryption with BACKUP_KEY

import crypto from "crypto";
import { notifyBackupComplete, notifyError } from "./email-backup";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export interface BackupMetadata {
  id: string;
  fileName: string;
  sizeMB: number;
  createdAt: string;
  encrypted: boolean;
  checksum: string;
}

export class EssenceBackupService {
  private backupKey: Buffer | null = null;
  private isConfigured: boolean;

  constructor() {
    const key = process.env.BACKUP_KEY;
    this.isConfigured = Boolean(key && key.length >= 32);
    
    if (this.isConfigured && key) {
      this.backupKey = crypto.scryptSync(key, "essence-salt-2026", 32);
    }
  }

  getStatus(): { configured: boolean; algorithm: string } {
    return {
      configured: this.isConfigured,
      algorithm: ALGORITHM,
    };
  }

  encrypt(data: Buffer): { encrypted: Buffer; iv: string; authTag: string } | null {
    if (!this.isConfigured || !this.backupKey) {
      console.log("[EssenceBackupService] Encryption not configured - returning unencrypted");
      return null;
    }

    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, this.backupKey, iv);
      
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      const authTag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
      };
    } catch (error) {
      console.error("[EssenceBackupService] Encryption error:", error);
      return null;
    }
  }

  decrypt(encryptedData: Buffer, iv: string, authTag: string): Buffer | null {
    if (!this.isConfigured || !this.backupKey) {
      console.log("[EssenceBackupService] Decryption not configured");
      return null;
    }

    try {
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        this.backupKey,
        Buffer.from(iv, "hex")
      );
      decipher.setAuthTag(Buffer.from(authTag, "hex"));

      const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]);

      return decrypted;
    } catch (error) {
      console.error("[EssenceBackupService] Decryption error:", error);
      return null;
    }
  }

  generateChecksum(data: Buffer): string {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  async createBackupMetadata(
    fileName: string,
    data: Buffer,
    encrypted: boolean
  ): Promise<BackupMetadata> {
    const metadata: BackupMetadata = {
      id: crypto.randomUUID(),
      fileName,
      sizeMB: Math.round((data.length / (1024 * 1024)) * 100) / 100,
      createdAt: new Date().toISOString(),
      encrypted,
      checksum: this.generateChecksum(data),
    };

    await notifyBackupComplete({
      sizeMB: metadata.sizeMB,
      fileName: metadata.fileName,
      createdAt: metadata.createdAt,
    });

    console.log(`[EssenceBackupService] Backup created: ${fileName} (${metadata.sizeMB} MB)`);
    return metadata;
  }

  async handleBackupError(error: any, context: string): Promise<void> {
    console.error(`[EssenceBackupService] Error in ${context}:`, error);
    await notifyError(error, `Backup Service - ${context}`);
  }
}

let backupService: EssenceBackupService | null = null;

export function getBackupService(): EssenceBackupService {
  if (!backupService) {
    backupService = new EssenceBackupService();
  }
  return backupService;
}

export function generateBackupKey(): string {
  return crypto.randomBytes(32).toString("hex");
}
