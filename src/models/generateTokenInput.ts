export interface GenerateTokenInput {
  email: string;
  password: string;
  appName: string; // appName is the prefix letters for apps like IED from IED_ADMIN.
}

export interface CreateTokenData {
  id: string;
  email: string;
  role: string;
}
