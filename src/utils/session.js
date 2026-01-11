/**
 * Session utility functions
 */

/**
 * Check if a session is cancelled (has 0 volunteers AND 0 children)
 * These sessions represent scheduled events that didn't actually take place
 * @param {Object} session - Session object
 * @returns {boolean} True if session is cancelled
 */
export function isCancelledSession(session) {
  if (!session) return false;
  return (session.childrenCount === 0 || !session.childrenCount) &&
         (session.volunteerCount === 0 || !session.volunteerCount) &&
         (!session.volunteersList || session.volunteersList.length === 0);
}

/**
 * Get the status of a session
 * @param {Object} session - Session object
 * @returns {'cancelled' | 'active'} Session status
 */
export function getSessionStatus(session) {
  return isCancelledSession(session) ? 'cancelled' : 'active';
}

/**
 * Filter sessions by status
 * @param {Array} sessions - Array of sessions
 * @param {'all' | 'active' | 'cancelled'} status - Status to filter by
 * @returns {Array} Filtered sessions
 */
export function filterSessionsByStatus(sessions, status = 'all') {
  if (!sessions || status === 'all') return sessions;

  if (status === 'cancelled') {
    return sessions.filter(s => isCancelledSession(s));
  }

  // status === 'active'
  return sessions.filter(s => !isCancelledSession(s));
}

/**
 * Get session counts by status
 * @param {Array} sessions - Array of sessions
 * @returns {Object} Counts object { total, active, cancelled }
 */
export function getSessionCounts(sessions) {
  if (!sessions) return { total: 0, active: 0, cancelled: 0 };

  const cancelled = sessions.filter(s => isCancelledSession(s)).length;
  const active = sessions.length - cancelled;

  return {
    total: sessions.length,
    active,
    cancelled,
  };
}
