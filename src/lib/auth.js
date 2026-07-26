const SESSION_KEY = 'cleanconnect-session';

export const roles = {
  CLEANER: 'cleaner',
  ROSTER: 'roster'
};

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function signIn(role) {
  const session = {
    user: role === roles.ROSTER
      ? { name: 'Roster Manager', initials: 'RM', role }
      : { name: 'Jordan Smith', initials: 'JS', role },
    signedInAt: new Date().toISOString()
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY);
}
