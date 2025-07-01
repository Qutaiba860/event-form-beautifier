
export const privilegedEmails = [
  "2023005883@aurak.ac.ae",
  "Imad.hoballah@aurak.ac.ae", 
  "qutaiba.raid@gmail.com",
  "admin@aurak.ac.ae"
];

export const isPrivilegedUser = (email: string): boolean => {
  return privilegedEmails.includes(email);
};

export const getUserRole = (email: string): 'admin' | 'user' => {
  return isPrivilegedUser(email) ? 'admin' : 'user';
};
