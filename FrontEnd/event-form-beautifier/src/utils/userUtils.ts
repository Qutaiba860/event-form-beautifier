
export const privilegedEmails = [
  "2023005883@aurak.ac.ae",
  "Imad.hoballah@aurak.ac.ae", 
  "qutaiba.raid@gmail.com",
  "admin@aurak.ac.ae"
];

export const normalUserEmails = [
  "lm1006500@gmail.com"
];

export const isPrivilegedUser = (email: string): boolean => {
  return privilegedEmails.includes(email);
};

export const isNormalUser = (email: string): boolean => {
  return normalUserEmails.includes(email);
};

export const getUserRole = (email: string): 'admin' | 'user' => {
  return isPrivilegedUser(email) ? 'admin' : 'user';
};
