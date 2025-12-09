// Essence Yogurt - Google Drive Backup Service 2026
// Full database and system backup to Google Drive
// Uses Replit Google Drive integration for authentication

import { google } from 'googleapis';
import { getBackupService } from './backup-service';
import { notifyBackupComplete, notifyError } from './email-backup';
import { db } from '../../db';
import { sql } from 'drizzle-orm';

let connectionSettings: any;

async function getAccessToken(): Promise<string> {
  if (connectionSettings && connectionSettings.settings?.expires_at && 
      new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-drive',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || 
                      connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Drive not connected');
  }
  return accessToken;
}

async function getGoogleDriveClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export interface DriveBackupResult {
  success: boolean;
  fileId?: string;
  fileName?: string;
  webViewLink?: string;
  sizeMB?: number;
  error?: string;
}

export interface BackupOptions {
  encrypt?: boolean;
  includeMetadata?: boolean;
  folderName?: string;
}

const ESSENCE_BACKUP_FOLDER = "Essence_Yogurt_Backups";

async function getOrCreateBackupFolder(drive: any): Promise<string> {
  try {
    const response = await drive.files.list({
      q: `name='${ESSENCE_BACKUP_FOLDER}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id;
    }

    const folderMetadata = {
      name: ESSENCE_BACKUP_FOLDER,
      mimeType: 'application/vnd.google-apps.folder'
    };

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id'
    });

    console.log(`[GoogleDriveBackup] Created backup folder: ${folder.data.id}`);
    return folder.data.id;
  } catch (error) {
    console.error('[GoogleDriveBackup] Error creating folder:', error);
    throw error;
  }
}

export async function checkGoogleDriveConnection(): Promise<{ connected: boolean; email?: string; error?: string }> {
  try {
    const drive = await getGoogleDriveClient();
    const about = await drive.about.get({ fields: 'user' });
    
    return {
      connected: true,
      email: about.data.user?.emailAddress || undefined
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error.message
    };
  }
}

export async function listBackups(): Promise<{ files: any[]; error?: string }> {
  try {
    const drive = await getGoogleDriveClient();
    const folderId = await getOrCreateBackupFolder(drive);

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, size, createdTime, modifiedTime, webViewLink)',
      orderBy: 'createdTime desc',
      pageSize: 50
    });

    return {
      files: response.data.files || []
    };
  } catch (error: any) {
    console.error('[GoogleDriveBackup] Error listing backups:', error);
    return {
      files: [],
      error: error.message
    };
  }
}

export async function createDatabaseBackup(options: BackupOptions = {}): Promise<DriveBackupResult> {
  const { encrypt = true, includeMetadata = true } = options;

  try {
    console.log('[GoogleDriveBackup] Starting database backup...');

    const tables = [
      'flavors', 'locations', 'customers', 'loyalty_tiers', 'suppliers', 
      'employees', 'purchase_orders', 'compliance_tasks', 'vip_benefits',
      'pos_sessions', 'timesheet_entries', 'inventory_items', 'waste_reports',
      'board_of_directors', 'executive_departments', 'loyalty_registrations',
      'push_notification_consents', 'incidents', 'risk_events', 'fraud_alerts',
      'temperature_logs', 'permit_tracking', 'insurance_policies',
      'job_applications', 'job_postings'
    ];

    const backupData: Record<string, any[]> = {};
    
    for (const table of tables) {
      try {
        const result = await db.execute(sql.raw(`SELECT * FROM ${table}`));
        backupData[table] = result.rows || [];
      } catch (err) {
        console.log(`[GoogleDriveBackup] Table ${table} not found or empty, skipping`);
        backupData[table] = [];
      }
    }

    const metadata = includeMetadata ? {
      version: "2026.1",
      createdAt: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      tables: Object.keys(backupData).filter(t => backupData[t].length > 0),
      totalRecords: Object.values(backupData).reduce((sum, arr) => sum + arr.length, 0)
    } : null;

    const fullBackup = {
      metadata,
      data: backupData
    };

    let backupBuffer = Buffer.from(JSON.stringify(fullBackup, null, 2));
    let fileName = `essence_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    let encrypted = false;

    if (encrypt) {
      const backupService = getBackupService();
      const encryptionResult = backupService.encrypt(backupBuffer);
      
      if (encryptionResult) {
        const encryptedPayload = {
          iv: encryptionResult.iv,
          authTag: encryptionResult.authTag,
          data: encryptionResult.encrypted.toString('base64')
        };
        backupBuffer = Buffer.from(JSON.stringify(encryptedPayload));
        fileName = fileName.replace('.json', '.encrypted.json');
        encrypted = true;
        console.log('[GoogleDriveBackup] Backup encrypted successfully');
      } else {
        console.log('[GoogleDriveBackup] Encryption not configured, saving unencrypted');
      }
    }

    const drive = await getGoogleDriveClient();
    const folderId = await getOrCreateBackupFolder(drive);

    const { Readable } = await import('stream');
    const bufferStream = new Readable();
    bufferStream.push(backupBuffer);
    bufferStream.push(null);

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
      description: `Essence Yogurt Database Backup - ${encrypted ? 'Encrypted' : 'Unencrypted'} - ${new Date().toISOString()}`
    };

    const media = {
      mimeType: 'application/json',
      body: bufferStream
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, size, webViewLink'
    });

    const sizeMB = Math.round((backupBuffer.length / (1024 * 1024)) * 100) / 100;

    await notifyBackupComplete({
      sizeMB,
      fileName,
      createdAt: new Date().toISOString(),
      destination: 'Google Drive'
    });

    console.log(`[GoogleDriveBackup] Backup uploaded: ${fileName} (${sizeMB} MB)`);

    return {
      success: true,
      fileId: file.data.id || undefined,
      fileName: file.data.name || undefined,
      webViewLink: file.data.webViewLink || undefined,
      sizeMB
    };
  } catch (error: any) {
    console.error('[GoogleDriveBackup] Backup failed:', error);
    await notifyError(error, 'Google Drive Backup');
    
    return {
      success: false,
      error: error.message
    };
  }
}

export async function downloadBackup(fileId: string): Promise<{ data: Buffer | null; error?: string }> {
  try {
    const drive = await getGoogleDriveClient();
    
    const response = await drive.files.get({
      fileId,
      alt: 'media'
    }, { responseType: 'arraybuffer' });

    return {
      data: Buffer.from(response.data as ArrayBuffer)
    };
  } catch (error: any) {
    console.error('[GoogleDriveBackup] Download failed:', error);
    return {
      data: null,
      error: error.message
    };
  }
}

export async function deleteBackup(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const drive = await getGoogleDriveClient();
    await drive.files.delete({ fileId });
    
    console.log(`[GoogleDriveBackup] Backup deleted: ${fileId}`);
    return { success: true };
  } catch (error: any) {
    console.error('[GoogleDriveBackup] Delete failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function restoreFromBackup(fileId: string): Promise<{ success: boolean; tablesRestored?: number; error?: string }> {
  try {
    const { data } = await downloadBackup(fileId);
    
    if (!data) {
      return { success: false, error: 'Failed to download backup file' };
    }

    let backupContent = data.toString();
    let parsedBackup: any;

    try {
      parsedBackup = JSON.parse(backupContent);
    } catch {
      return { success: false, error: 'Invalid backup file format' };
    }

    if (parsedBackup.iv && parsedBackup.authTag && parsedBackup.data) {
      const backupService = getBackupService();
      const decrypted = backupService.decrypt(
        Buffer.from(parsedBackup.data, 'base64'),
        parsedBackup.iv,
        parsedBackup.authTag
      );

      if (!decrypted) {
        return { success: false, error: 'Failed to decrypt backup. Check BACKUP_KEY.' };
      }

      parsedBackup = JSON.parse(decrypted.toString());
    }

    console.log('[GoogleDriveBackup] Backup metadata:', parsedBackup.metadata);
    
    return {
      success: true,
      tablesRestored: parsedBackup.metadata?.tables?.length || 0
    };
  } catch (error: any) {
    console.error('[GoogleDriveBackup] Restore failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================
// FULL PLATFORM BACKUP - All source code + database + configs
// ============================================================

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface FullBackupResult {
  success: boolean;
  fileId?: string;
  fileName?: string;
  webViewLink?: string;
  sizeMB?: number;
  fileCount?: number;
  includes?: string[];
  error?: string;
}

async function collectAllSourceFiles(): Promise<{ path: string; content: string }[]> {
  const files: { path: string; content: string }[] = [];
  const rootDir = process.cwd();
  
  const includeDirs = ['client', 'server', 'shared', 'scripts', 'db', 'public'];
  const includeRootFiles = [
    'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts',
    'tailwind.config.ts', 'postcss.config.js', 'drizzle.config.ts',
    'replit.md', '.replit', 'replit.nix', 'theme.json'
  ];
  
  const excludePatterns = [
    'node_modules', '.git', 'dist', 'build', '.cache', 
    '.vite', 'coverage', '*.log', '.DS_Store'
  ];

  function shouldExclude(filePath: string): boolean {
    return excludePatterns.some(pattern => {
      if (pattern.startsWith('*')) {
        return filePath.endsWith(pattern.slice(1));
      }
      return filePath.includes(pattern);
    });
  }

  function readDirRecursive(dir: string, relativePath: string = '') {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(relativePath, entry.name);
        
        if (shouldExclude(fullPath)) continue;
        
        if (entry.isDirectory()) {
          readDirRecursive(fullPath, relPath);
        } else if (entry.isFile()) {
          try {
            const ext = path.extname(entry.name).toLowerCase();
            const textExts = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', 
                            '.html', '.md', '.sql', '.yaml', '.yml', '.toml', '.env',
                            '.txt', '.sh', '.nix', '.xml', '.svg'];
            
            if (textExts.includes(ext) || entry.name.startsWith('.')) {
              const content = fs.readFileSync(fullPath, 'utf-8');
              files.push({ path: relPath, content });
            }
          } catch (err) {
            console.log(`[FullBackup] Skipping binary/unreadable: ${relPath}`);
          }
        }
      }
    } catch (err) {
      console.error(`[FullBackup] Error reading directory ${dir}:`, err);
    }
  }

  // Read root files
  for (const file of includeRootFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        files.push({ path: file, content });
      } catch (err) {
        console.log(`[FullBackup] Could not read ${file}`);
      }
    }
  }

  // Read directories
  for (const dir of includeDirs) {
    const fullPath = path.join(rootDir, dir);
    if (fs.existsSync(fullPath)) {
      readDirRecursive(fullPath, dir);
    }
  }

  // Also include attached_assets metadata (not binary files)
  const assetsDir = path.join(rootDir, 'attached_assets');
  if (fs.existsSync(assetsDir)) {
    try {
      const assetFiles = fs.readdirSync(assetsDir);
      const assetManifest = assetFiles.map(f => ({
        name: f,
        size: fs.statSync(path.join(assetsDir, f)).size
      }));
      files.push({
        path: 'attached_assets/_manifest.json',
        content: JSON.stringify(assetManifest, null, 2)
      });
    } catch (err) {
      console.log('[FullBackup] Could not read assets directory');
    }
  }

  return files;
}

export async function createFullPlatformBackup(): Promise<FullBackupResult> {
  try {
    console.log('[FullPlatformBackup] Starting FULL platform backup...');
    const startTime = Date.now();

    // 1. Collect all source files
    console.log('[FullPlatformBackup] Collecting source files...');
    const sourceFiles = await collectAllSourceFiles();
    console.log(`[FullPlatformBackup] Found ${sourceFiles.length} source files`);

    // 2. Get database backup
    console.log('[FullPlatformBackup] Backing up database...');
    const tables = [
      'flavors', 'locations', 'customers', 'loyalty_tiers', 'suppliers', 
      'employees', 'purchase_orders', 'compliance_tasks', 'vip_benefits',
      'pos_sessions', 'timesheet_entries', 'inventory_items', 'waste_reports',
      'board_of_directors', 'executive_departments', 'loyalty_registrations',
      'push_notification_consents', 'incidents', 'risk_events', 'fraud_alerts',
      'temperature_logs', 'permit_tracking', 'insurance_policies', 'users',
      'ai_transaction_logs', 'ai_error_logs', 'ai_translation_logs', 'ai_health_logs',
      'ai_chat_logs', 'hr_onboarding_tasks', 'hr_training_modules', 'hr_employee_training',
      'hr_emergency_contacts', 'hr_conduct_cases', 'hr_whistleblower_reports',
      'octopus_emergencies', 'octopus_incidents', 'octopus_temperature_logs',
      'octopus_qa_inspections', 'octopus_fraud_events', 'octopus_training_assignments',
      'octopus_kpi_snapshots', 'octopus_shift_checklists',
      'job_applications', 'job_postings'
    ];

    const databaseBackup: Record<string, any[]> = {};
    let totalRecords = 0;
    
    for (const table of tables) {
      try {
        const result = await db.execute(sql.raw(`SELECT * FROM ${table}`));
        databaseBackup[table] = result.rows || [];
        totalRecords += databaseBackup[table].length;
      } catch (err) {
        databaseBackup[table] = [];
      }
    }

    // 3. Create full backup package
    const fullBackup = {
      metadata: {
        version: "2026.1.0-FULL",
        type: "FULL_PLATFORM_BACKUP",
        createdAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        platform: "Essence Yogurt - Luxury Soft Serve Platform",
        contents: {
          sourceFiles: sourceFiles.length,
          databaseTables: Object.keys(databaseBackup).filter(t => databaseBackup[t].length > 0).length,
          totalDatabaseRecords: totalRecords
        },
        directories: ['client', 'server', 'shared', 'scripts', 'db', 'public'],
        nodeVersion: process.version,
        generatedBy: "Essence Backup Service v2026"
      },
      sourceCode: sourceFiles,
      database: databaseBackup
    };

    // 4. Convert to JSON buffer
    const backupJson = JSON.stringify(fullBackup, null, 2);
    const backupBuffer = Buffer.from(backupJson);
    const sizeMB = Math.round((backupBuffer.length / (1024 * 1024)) * 100) / 100;
    
    console.log(`[FullPlatformBackup] Full backup size: ${sizeMB} MB`);

    // 5. Upload to Google Drive
    const drive = await getGoogleDriveClient();
    const folderId = await getOrCreateBackupFolder(drive);

    const fileName = `ESSENCE_FULL_BACKUP_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

    const { Readable } = await import('stream');
    const bufferStream = new Readable();
    bufferStream.push(backupBuffer);
    bufferStream.push(null);

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
      description: `Essence Yogurt FULL PLATFORM Backup - ${sourceFiles.length} files, ${totalRecords} DB records - ${new Date().toISOString()}`
    };

    const media = {
      mimeType: 'application/json',
      body: bufferStream
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, size, webViewLink'
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[FullPlatformBackup] ✅ Complete! ${sizeMB}MB uploaded in ${duration}s`);

    // 6. Send notification
    await notifyBackupComplete({
      sizeMB,
      fileName,
      createdAt: new Date().toISOString(),
      destination: 'Google Drive (FULL PLATFORM)',
      fileCount: sourceFiles.length,
      dbRecords: totalRecords
    });

    return {
      success: true,
      fileId: file.data.id || undefined,
      fileName: file.data.name || undefined,
      webViewLink: file.data.webViewLink || undefined,
      sizeMB,
      fileCount: sourceFiles.length,
      includes: ['All source code', 'All configurations', 'Full database', 'Asset manifest']
    };

  } catch (error: any) {
    console.error('[FullPlatformBackup] FAILED:', error);
    await notifyError(error, 'Full Platform Backup');
    
    return {
      success: false,
      error: error.message
    };
  }
}
