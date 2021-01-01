export const getUserRole = (userRoles: string[], appName: string): string | null => {
  const role = userRoles.find(role => role.startsWith(appName));
  return role ? role.split('_')[1] : null;
};
