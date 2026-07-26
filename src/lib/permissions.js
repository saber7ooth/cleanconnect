import { roles } from './auth';

export const permissions = {
  [roles.CLEANER]: ['availability:read', 'availability:write', 'profile:read', 'profile:write'],
  [roles.ROSTER]: ['availability:read', 'cleaners:read', 'assignments:read', 'assignments:write']
};

export function can(role, permission) {
  return permissions[role]?.includes(permission) ?? false;
}
