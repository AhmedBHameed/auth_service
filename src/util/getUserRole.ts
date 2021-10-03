import {Maybe} from 'graphql/jsutils/Maybe';

export const getUserRole = (
  appName: string,
  userRoles?: Maybe<Maybe<string>[]>
): string | null => {
  if (!userRoles) return null;
  const role = userRoles.find((role) => role?.startsWith(appName));
  return role ? role.split('_')[1] : null;
};
