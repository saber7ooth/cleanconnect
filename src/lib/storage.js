const STORAGE_KEY = 'cleanconnect-demo-state';

const defaultState = {
  profile: {
    name: 'Jordan Smith',
    role: 'Cleaner',
    email: 'jordan@example.com'
  },
  availability: {
    dates: ['2026-07-23', '2026-07-24', '2026-07-25', '2026-07-28', '2026-07-29'],
    location: 'Central London',
    sizes: ['Studio', '1 Bed', '2 Bed'],
    capacity: 4,
    teamType: 'Team of 2'
  },
  assignments: []
};

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState;
}
