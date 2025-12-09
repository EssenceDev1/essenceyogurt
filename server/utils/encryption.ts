import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const key = process.env.BACKUP_KEY || process.env.SESSION_SECRET || 'essence-yogurt-hr-secure-key-2025';
  const salt = crypto.createHash('sha256').update('hr-playbook-salt').digest();
  return crypto.pbkdf2Sync(key, salt, 100000, KEY_LENGTH, 'sha512');
}

export function encryptSensitiveData(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptSensitiveData(encryptedText: string): string {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      return encryptedText;
    }
    
    const [ivHex, authTagHex, encrypted] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    return encryptedText;
  }
}

export function isEncrypted(text: string): boolean {
  if (!text) return false;
  const parts = text.split(':');
  if (parts.length !== 3) return false;
  return parts[0].length === 32 && parts[1].length === 32;
}

export function hashAnonymousId(identifier?: string): string {
  if (!identifier) {
    return crypto.randomBytes(16).toString('hex');
  }
  return crypto.createHash('sha256').update(identifier).digest('hex').substring(0, 32);
}

export function sanitizeSensitiveResponse<T extends Record<string, any>>(
  data: T, 
  sensitiveFields: string[]
): Record<string, any> {
  const sanitized: Record<string, any> = { ...data };
  for (const field of sensitiveFields) {
    if (sanitized[field] && isEncrypted(sanitized[field])) {
      sanitized[field] = decryptSensitiveData(sanitized[field]);
    }
  }
  return sanitized;
}

export function redactSensitiveResponse<T extends Record<string, any>>(
  data: T,
  redactFields: string[]
): Record<string, any> {
  const result: Record<string, any> = { ...data };
  for (const field of redactFields) {
    if (field in result) {
      result[field] = '[REDACTED]';
    }
  }
  return result;
}
