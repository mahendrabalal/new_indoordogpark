import { DogPark } from '@/types/dog-park';

export type ParkStatus = 'open' | 'closed' | '24/7' | 'unknown';

export interface ParkStatusInfo {
  status: ParkStatus;
  nextChange?: string; // When the status will change next (e.g., "Closes at 6:00 PM")
}

/**
 * Parses a time string like "6:00 AM" or "18:00" into minutes since midnight
 */
function parseTime(timeStr: string): number | null {
  const trimmed = timeStr.trim().toUpperCase();
  
  // Handle 12-hour format (e.g., "6:00 AM", "6:30 PM")
  const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (amPmMatch) {
    let hours = parseInt(amPmMatch[1], 10);
    const minutes = parseInt(amPmMatch[2], 10);
    const period = amPmMatch[3];
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  }
  
  // Handle 24-hour format (e.g., "18:00", "6:00")
  const hourMinMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (hourMinMatch) {
    const hours = parseInt(hourMinMatch[1], 10);
    const minutes = parseInt(hourMinMatch[2], 10);
    return hours * 60 + minutes;
  }
  
  return null;
}

/**
 * Parses hours string like "6:00 AM - 6:00 PM" or "11:00 AM – 9:30 PM" into open and close times
 * Handles various separators: hyphen (-), en-dash (–), em-dash (—), and "to"
 */
function parseHours(hoursStr: string): { open: number; close: number } | null {
  // Normalize the string and handle different separators
  let parts: string[] = [];
  
  // Try en-dash first (common in formatted text)
  if (hoursStr.includes('–')) {
    parts = hoursStr.split('–').map(s => s.trim());
  }
  // Try em-dash
  else if (hoursStr.includes('—')) {
    parts = hoursStr.split('—').map(s => s.trim());
  }
  // Try "to" separator
  else if (hoursStr.toLowerCase().includes(' to ')) {
    parts = hoursStr.split(/to/i).map(s => s.trim());
  }
  // Default to regular hyphen
  else {
    parts = hoursStr.split('-').map(s => s.trim());
  }
  
  if (parts.length !== 2) return null;
  
  const openTime = parseTime(parts[0]);
  const closeTime = parseTime(parts[1]);
  
  if (openTime === null || closeTime === null) return null;
  
  return { open: openTime, close: closeTime };
}

/**
 * Gets the timezone for a park based on its state/location
 * Returns IANA timezone identifier (e.g., 'America/New_York')
 */
function getParkTimezone(park: { state?: string; latitude?: number; longitude?: number }): string {
  // Map US states to their primary timezones
  const stateTimezones: Record<string, string> = {
    // Eastern Time
    'Alabama': 'America/New_York',
    'Connecticut': 'America/New_York',
    'Delaware': 'America/New_York',
    'Florida': 'America/New_York', // Most of Florida is ET, panhandle is CT
    'Georgia': 'America/New_York',
    'Indiana': 'America/Indiana/Indianapolis', // Most of Indiana
    'Kentucky': 'America/New_York', // Eastern part
    'Maine': 'America/New_York',
    'Maryland': 'America/New_York',
    'Massachusetts': 'America/New_York',
    'Michigan': 'America/Detroit',
    'New Hampshire': 'America/New_York',
    'New Jersey': 'America/New_York',
    'New York': 'America/New_York',
    'North Carolina': 'America/New_York',
    'Ohio': 'America/New_York',
    'Pennsylvania': 'America/New_York',
    'Rhode Island': 'America/New_York',
    'South Carolina': 'America/New_York',
    'Tennessee': 'America/New_York', // Eastern part
    'Vermont': 'America/New_York',
    'Virginia': 'America/New_York',
    'West Virginia': 'America/New_York',
    'District of Columbia': 'America/New_York',
    'DC': 'America/New_York',
    'Washington DC': 'America/New_York',
    // Central Time
    'Arkansas': 'America/Chicago',
    'Illinois': 'America/Chicago',
    'Iowa': 'America/Chicago',
    'Kansas': 'America/Chicago',
    'Louisiana': 'America/Chicago',
    'Minnesota': 'America/Chicago',
    'Mississippi': 'America/Chicago',
    'Missouri': 'America/Chicago',
    'Nebraska': 'America/Chicago',
    'North Dakota': 'America/Chicago',
    'Oklahoma': 'America/Chicago',
    'South Dakota': 'America/Chicago',
    'Texas': 'America/Chicago', // Most of Texas
    'Wisconsin': 'America/Chicago',
    // Mountain Time
    'Arizona': 'America/Phoenix',
    'Colorado': 'America/Denver',
    'Idaho': 'America/Denver', // Most of Idaho
    'Montana': 'America/Denver',
    'New Mexico': 'America/Denver',
    'Utah': 'America/Denver',
    'Wyoming': 'America/Denver',
    // Pacific Time
    'California': 'America/Los_Angeles',
    'Nevada': 'America/Los_Angeles', // Most of Nevada
    'Oregon': 'America/Los_Angeles', // Most of Oregon
    'Washington': 'America/Los_Angeles',
    // Alaska and Hawaii
    'Alaska': 'America/Anchorage',
    'Hawaii': 'Pacific/Honolulu',
  };

  // Check for DC/Washington DC first (before Washington state)
  if (park.state) {
    const normalizedState = park.state.trim();
    const stateUpper = normalizedState.toUpperCase();
    
    // Check for DC variations
    if (stateUpper === 'DC' || stateUpper === 'D.C.' || normalizedState.toLowerCase().includes('district of columbia') || normalizedState.toLowerCase() === 'washington dc') {
      return 'America/New_York';
    }
    
    // Check full state name
    if (stateTimezones[normalizedState]) {
      return stateTimezones[normalizedState];
    }
    
    // Try abbreviation (but exclude DC since we already checked)
    if (stateUpper.length === 2 && stateUpper !== 'DC' && stateTimezones[stateUpper]) {
      return stateTimezones[stateUpper];
    }
  }

  // Default to Eastern Time if we can't determine
  return 'America/New_York';
}

/**
 * Gets the current day name in the park's timezone (e.g., "Monday", "Tuesday")
 */
function getCurrentDay(park: { state?: string; latitude?: number; longitude?: number }): string {
  const timezone = getParkTimezone(park);
  const now = new Date();
  const dayInTimezone = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    timeZone: timezone 
  }).format(now);
  return dayInTimezone;
}

/**
 * Gets current time in minutes since midnight in the park's timezone
 */
function getCurrentTimeInMinutes(park: { state?: string; latitude?: number; longitude?: number }): number {
  const timezone = getParkTimezone(park);
  const now = new Date();
  const timeString = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: timezone
  }).format(now);
  
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Formats minutes since midnight into a readable time string
 */
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Checks if a park is currently open based on its operating hours
 */
export function getParkStatus(park: DogPark): ParkStatusInfo {
  // If park is open 24/7
  if (park.hours24x7) {
    return { status: '24/7' };
  }
  
  // If no operating hours data, return unknown
  if (!park.openingHours || Object.keys(park.openingHours).length === 0) {
    return { status: 'unknown' };
  }
  
  const currentDay = getCurrentDay(park);
  const currentTime = getCurrentTimeInMinutes(park);
  
  // Get today's hours
  const todayHours = park.openingHours[currentDay];
  
  // If no hours for today, check if it's closed
  // Ensure todayHours is a string before calling toLowerCase
  const todayHoursStr = typeof todayHours === 'string' ? todayHours : String(todayHours || '');
  if (!todayHours || todayHoursStr.toLowerCase().includes('closed')) {
    // Find next open day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayIndex = days.indexOf(currentDay);
    
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7;
      const nextDay = days[nextDayIndex];
      const nextDayHours = park.openingHours[nextDay];
      
      const nextDayHoursStr = typeof nextDayHours === 'string' ? nextDayHours : String(nextDayHours || '');
      if (nextDayHours && !nextDayHoursStr.toLowerCase().includes('closed')) {
        const parsed = parseHours(nextDayHoursStr);
        if (parsed) {
          return {
            status: 'closed',
            nextChange: `Opens ${nextDay} at ${formatTime(parsed.open)}`
          };
        }
      }
    }
    
    return { status: 'closed' };
  }
  
  // Parse today's hours (use the string version)
  const parsed = parseHours(todayHoursStr);
  if (!parsed) {
    return { status: 'unknown' };
  }
  
  // Handle case where close time is next day (e.g., closes at 2:00 AM)
  const { open, close } = parsed;
  const isOvernight = close < open;
  
  if (isOvernight) {
    // If we're past open time, we're open until close time tomorrow
    if (currentTime >= open) {
      return {
        status: 'open',
        nextChange: `Closes tomorrow at ${formatTime(close)}`
      };
    }
    // If we're before open time, check if we're still in yesterday's hours
    if (currentTime < close) {
      return {
        status: 'open',
        nextChange: `Closes at ${formatTime(close)}`
      };
    }
    return {
      status: 'closed',
      nextChange: `Opens at ${formatTime(open)}`
    };
  }
  
  // Normal hours (same day)
  if (currentTime >= open && currentTime < close) {
    return {
      status: 'open',
      nextChange: `Closes at ${formatTime(close)}`
    };
  }
  
  if (currentTime < open) {
    return {
      status: 'closed',
      nextChange: `Opens at ${formatTime(open)}`
    };
  }
  
  // Closed for today, find next open time
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = days.indexOf(currentDay);
  
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDay = days[nextDayIndex];
    const nextDayHours = park.openingHours[nextDay];
    
    const nextDayHoursStr = typeof nextDayHours === 'string' ? nextDayHours : String(nextDayHours || '');
    if (nextDayHours && !nextDayHoursStr.toLowerCase().includes('closed')) {
      const nextParsed = parseHours(nextDayHoursStr);
      if (nextParsed) {
        const dayLabel = i === 1 ? 'tomorrow' : nextDay;
        return {
          status: 'closed',
          nextChange: `Opens ${dayLabel} at ${formatTime(nextParsed.open)}`
        };
      }
    }
  }
  
  return { status: 'closed' };
}

