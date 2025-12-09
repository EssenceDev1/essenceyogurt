// Essence Yogurt - Google Sheets Service 2026
// Manages form responses, data exports, and reporting
// Uses Replit Google Sheets integration

import { google } from 'googleapis';

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
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
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
    throw new Error('Google Sheets not connected');
  }
  return accessToken;
}

async function getSheetsClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.sheets({ version: 'v4', auth: oauth2Client });
}

async function getDriveClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth: oauth2Client });
}

export interface SheetData {
  range: string;
  values: any[][];
}

export async function checkSheetsConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const drive = await getDriveClient();
    await drive.about.get({ fields: 'user' });
    return { connected: true };
  } catch (error: any) {
    return {
      connected: false,
      error: error.message
    };
  }
}

export async function createSpreadsheet(title: string, sheetNames: string[] = ['Sheet1']): Promise<{ spreadsheetId?: string; spreadsheetUrl?: string; error?: string }> {
  try {
    const sheets = await getSheetsClient();
    
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title },
        sheets: sheetNames.map(name => ({
          properties: { title: name }
        }))
      }
    });
    
    console.log(`[GoogleSheets] Spreadsheet created: ${response.data.spreadsheetId}`);
    return {
      spreadsheetId: response.data.spreadsheetId || undefined,
      spreadsheetUrl: response.data.spreadsheetUrl || undefined
    };
  } catch (error: any) {
    console.error('[GoogleSheets] Create spreadsheet error:', error);
    return { error: error.message };
  }
}

export async function readSheet(spreadsheetId: string, range: string): Promise<{ values: any[][]; error?: string }> {
  try {
    const sheets = await getSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    });
    
    return {
      values: response.data.values || []
    };
  } catch (error: any) {
    return {
      values: [],
      error: error.message
    };
  }
}

export async function writeToSheet(spreadsheetId: string, range: string, values: any[][]): Promise<{ success: boolean; updatedCells?: number; error?: string }> {
  try {
    const sheets = await getSheetsClient();
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
    
    console.log(`[GoogleSheets] Updated ${response.data.updatedCells} cells`);
    return {
      success: true,
      updatedCells: response.data.updatedCells || 0
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function appendToSheet(spreadsheetId: string, range: string, values: any[][]): Promise<{ success: boolean; updatedRows?: number; error?: string }> {
  try {
    const sheets = await getSheetsClient();
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values }
    });
    
    console.log(`[GoogleSheets] Appended ${response.data.updates?.updatedRows} rows`);
    return {
      success: true,
      updatedRows: response.data.updates?.updatedRows || 0
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function createIncidentReportSheet(): Promise<{ spreadsheetId?: string; spreadsheetUrl?: string; error?: string }> {
  const result = await createSpreadsheet('Essence Yogurt - Incident Reports', ['Incidents', 'Summary']);
  
  if (result.spreadsheetId) {
    const headers = [
      ['Incident ID', 'Date', 'Location', 'Type', 'Severity', 'Description', 'Reported By', 'Status', 'Resolution']
    ];
    await writeToSheet(result.spreadsheetId, 'Incidents!A1:I1', headers);
  }
  
  return result;
}

export async function createDailySalesReportSheet(): Promise<{ spreadsheetId?: string; spreadsheetUrl?: string; error?: string }> {
  const result = await createSpreadsheet('Essence Yogurt - Daily Sales Report', ['Sales', 'By Location', 'By Product']);
  
  if (result.spreadsheetId) {
    const headers = [
      ['Date', 'Location', 'Total Sales', 'Transaction Count', 'Avg Transaction', 'Top Product', 'Notes']
    ];
    await writeToSheet(result.spreadsheetId, 'Sales!A1:G1', headers);
  }
  
  return result;
}

export async function logIncidentToSheet(spreadsheetId: string, incident: {
  id: string;
  date: string;
  location: string;
  type: string;
  severity: string;
  description: string;
  reportedBy: string;
  status: string;
  resolution?: string;
}): Promise<{ success: boolean; error?: string }> {
  const values = [[
    incident.id,
    incident.date,
    incident.location,
    incident.type,
    incident.severity,
    incident.description,
    incident.reportedBy,
    incident.status,
    incident.resolution || ''
  ]];
  
  return appendToSheet(spreadsheetId, 'Incidents!A:I', values);
}

export async function logDailySalesToSheet(spreadsheetId: string, sales: {
  date: string;
  location: string;
  totalSales: number;
  transactionCount: number;
  avgTransaction: number;
  topProduct: string;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const values = [[
    sales.date,
    sales.location,
    sales.totalSales,
    sales.transactionCount,
    sales.avgTransaction,
    sales.topProduct,
    sales.notes || ''
  ]];
  
  return appendToSheet(spreadsheetId, 'Sales!A:G', values);
}

export async function exportDataToSheet(data: Record<string, any>[], title: string): Promise<{ spreadsheetId?: string; spreadsheetUrl?: string; error?: string }> {
  if (!data.length) {
    return { error: 'No data to export' };
  }
  
  const result = await createSpreadsheet(`Essence Export - ${title} - ${new Date().toISOString().split('T')[0]}`);
  
  if (result.spreadsheetId) {
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => row[h]));
    
    await writeToSheet(result.spreadsheetId, 'Sheet1!A1', [headers, ...rows]);
  }
  
  return result;
}

export async function createFormResponseSheet(formName: string, fields: string[]): Promise<{ spreadsheetId?: string; spreadsheetUrl?: string; error?: string }> {
  const result = await createSpreadsheet(`Essence Form Responses - ${formName}`, ['Responses']);
  
  if (result.spreadsheetId) {
    const headers = [['Timestamp', ...fields]];
    await writeToSheet(result.spreadsheetId, 'Responses!A1', headers);
  }
  
  return result;
}

export async function logFormResponse(spreadsheetId: string, fields: string[], values: any[]): Promise<{ success: boolean; error?: string }> {
  const timestamp = new Date().toISOString();
  return appendToSheet(spreadsheetId, 'Responses!A:Z', [[timestamp, ...values]]);
}
