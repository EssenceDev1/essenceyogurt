// Essence Yogurt - Google Calendar Service 2026
// Manages scheduling for shifts, maintenance, executive meetings
// Uses Replit Google Calendar integration

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
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-calendar',
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
    throw new Error('Google Calendar not connected');
  }
  return accessToken;
}

async function getCalendarClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: { email: string }[];
  colorId?: string;
}

export interface EssenceShift {
  employeeEmail: string;
  employeeName: string;
  locationName: string;
  shiftStart: Date;
  shiftEnd: Date;
  role: string;
}

export interface MaintenanceEvent {
  locationName: string;
  equipmentId: string;
  maintenanceType: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  technicianEmail?: string;
}

export async function checkCalendarConnection(): Promise<{ connected: boolean; email?: string; error?: string }> {
  try {
    const calendar = await getCalendarClient();
    const response = await calendar.calendarList.list({ maxResults: 1 });
    
    return {
      connected: true,
      email: response.data.items?.[0]?.id || undefined
    };
  } catch (error: any) {
    return {
      connected: false,
      error: error.message
    };
  }
}

export async function listCalendars(): Promise<{ calendars: any[]; error?: string }> {
  try {
    const calendar = await getCalendarClient();
    const response = await calendar.calendarList.list();
    
    return {
      calendars: response.data.items || []
    };
  } catch (error: any) {
    return {
      calendars: [],
      error: error.message
    };
  }
}

export async function getUpcomingEvents(calendarId: string = 'primary', maxResults: number = 10): Promise<{ events: any[]; error?: string }> {
  try {
    const calendar = await getCalendarClient();
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    return {
      events: response.data.items || []
    };
  } catch (error: any) {
    return {
      events: [],
      error: error.message
    };
  }
}

export async function createEvent(event: CalendarEvent, calendarId: string = 'primary'): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const calendar = await getCalendarClient();
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event
    });
    
    console.log(`[GoogleCalendar] Event created: ${response.data.id}`);
    return {
      success: true,
      eventId: response.data.id || undefined
    };
  } catch (error: any) {
    console.error('[GoogleCalendar] Create event error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function createShiftEvent(shift: EssenceShift): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const event: CalendarEvent = {
    summary: `${shift.role} Shift - ${shift.employeeName}`,
    description: `Essence Yogurt Shift\nEmployee: ${shift.employeeName}\nRole: ${shift.role}\nLocation: ${shift.locationName}`,
    location: shift.locationName,
    start: { 
      dateTime: shift.shiftStart.toISOString(),
      timeZone: 'UTC'
    },
    end: { 
      dateTime: shift.shiftEnd.toISOString(),
      timeZone: 'UTC'
    },
    attendees: [{ email: shift.employeeEmail }],
    colorId: '9' // Blue for shifts
  };
  
  return createEvent(event);
}

export async function createMaintenanceEvent(maintenance: MaintenanceEvent): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const event: CalendarEvent = {
    summary: `Maintenance: ${maintenance.maintenanceType} - ${maintenance.locationName}`,
    description: `Equipment Maintenance\nLocation: ${maintenance.locationName}\nEquipment ID: ${maintenance.equipmentId}\nType: ${maintenance.maintenanceType}`,
    location: maintenance.locationName,
    start: { 
      dateTime: maintenance.scheduledStart.toISOString(),
      timeZone: 'UTC'
    },
    end: { 
      dateTime: maintenance.scheduledEnd.toISOString(),
      timeZone: 'UTC'
    },
    attendees: maintenance.technicianEmail ? [{ email: maintenance.technicianEmail }] : undefined,
    colorId: '6' // Orange for maintenance
  };
  
  return createEvent(event);
}

export async function createDailyBackupEvent(): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const now = new Date();
  const backupTime = new Date(now);
  backupTime.setHours(2, 0, 0, 0); // 2 AM daily backup
  if (backupTime <= now) {
    backupTime.setDate(backupTime.getDate() + 1);
  }
  
  const endTime = new Date(backupTime);
  endTime.setMinutes(30);
  
  const event: CalendarEvent = {
    summary: 'Essence Yogurt - Daily Database Backup',
    description: 'Automated daily database backup to Google Drive\nEncrypted with AES-256-GCM\nOctopus Brain 2026',
    start: { 
      dateTime: backupTime.toISOString(),
      timeZone: 'UTC'
    },
    end: { 
      dateTime: endTime.toISOString(),
      timeZone: 'UTC'
    },
    colorId: '10' // Green for automated tasks
  };
  
  return createEvent(event);
}

export async function deleteEvent(eventId: string, calendarId: string = 'primary'): Promise<{ success: boolean; error?: string }> {
  try {
    const calendar = await getCalendarClient();
    await calendar.events.delete({
      calendarId,
      eventId
    });
    
    console.log(`[GoogleCalendar] Event deleted: ${eventId}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

export async function updateEvent(eventId: string, updates: Partial<CalendarEvent>, calendarId: string = 'primary'): Promise<{ success: boolean; error?: string }> {
  try {
    const calendar = await getCalendarClient();
    await calendar.events.patch({
      calendarId,
      eventId,
      requestBody: updates
    });
    
    console.log(`[GoogleCalendar] Event updated: ${eventId}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
