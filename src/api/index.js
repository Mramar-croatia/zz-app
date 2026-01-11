const API_BASE = 'https://volunteering-app-109370863016.europe-west1.run.app';

/**
 * Fetch volunteers from the API
 * @returns {Promise<Array>} Array of volunteer objects
 */
export async function fetchVolunteers() {
  const response = await fetch(`${API_BASE}/api/names`);
  if (!response.ok) {
    throw new Error(`Failed to fetch volunteers: ${response.status}`);
  }
  const data = await response.json();
  return data.map(volunteer => ({
    ...volunteer,
    hours: parseInt(volunteer.hours, 10) || 0,
    locations: parseLocations(volunteer.location),
  }));
}

/**
 * Fetch attendance history (sessions) from the API
 * @returns {Promise<Array>} Array of session objects
 */
export async function fetchSessions() {
  const response = await fetch(`${API_BASE}/api/evidencija`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sessions: ${response.status}`);
  }
  const data = await response.json();
  return data.map(session => ({
    ...session,
    childrenCount: parseInt(session.childrenCount, 10) || 0,
    volunteerCount: parseInt(session.volunteerCount, 10) || 0,
    hours: parseFloat(session.hours) || 2, // Default 2 hours per session
    volunteersList: parseVolunteers(session.volunteers),
    parsedDate: parseDate(session.date),
  }));
}

/**
 * Submit attendance for a session
 * @param {Object} attendance - Attendance data
 * @returns {Promise<Object>} Response from server
 */
export async function submitAttendance(attendance) {
  const payload = {
    selectedDate: attendance.selectedDate, // YYYY-MM-DD format
    location: attendance.location,
    childrenCount: attendance.childrenCount,
    volunteerCount: attendance.volunteerCount,
    selected: attendance.selected, // Array of volunteer names
  };

  const response = await fetch(`${API_BASE}/api/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Handle duplicate entry
    if (response.status === 409 || data.error?.includes('duplicate')) {
      throw new Error('DUPLICATE_ENTRY');
    }
    throw new Error(data.error || `Failed to submit attendance: ${response.status}`);
  }

  return data;
}

// Helper functions

/**
 * Parse location string into array
 */
function parseLocations(locationStr) {
  if (!locationStr) return [];
  return locationStr.split(',').map(loc => loc.trim()).filter(Boolean);
}

/**
 * Parse volunteers string into array
 */
function parseVolunteers(volunteersStr) {
  if (!volunteersStr) return [];
  return volunteersStr.split(',').map(name => name.trim()).filter(Boolean);
}

/**
 * Parse Croatian date format (d.m.yyyy.) to Date object
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\./);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

// Export API base for reference
export { API_BASE };
