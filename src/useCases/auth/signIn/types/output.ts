export type SignInOutput = {
  token: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  refreshToken: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
};
