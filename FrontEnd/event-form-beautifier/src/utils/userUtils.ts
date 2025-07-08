
export const privilegedEmails = [
  "2023005883@aurak.ac.ae",
  "Imad.hoballah@aurak.ac.ae",
  "qutaiba.raid@gmail.com",
  "admin@aurak.ac.ae",
  "Imadhoballah@gmail.com",

];

export const normalUserEmails = [
  "lm1006500@gmail.com",
  "ganajad412@iridales.com",
  
];

// Department-specific admin mappings
export const departmentAdmins = {
  "fayez.moutassem@aurak.ac.ae": "Department of Civil and infrastructure Engineering",
  "sara.tasfy@aurak.ac.ae": "Department of chemical and petroleum Engineering",
  "khouloud.salameh@aurak.ac.ae": "Department of Computer Science and Engineering",
  "ali.ataby@aurak.ac.ae": "Department of Electrical and electronic Engineering",
  "khaled.hossin@aurak.ac.ae": "Department of Mechanical Engineering",
  "buthayna.eilouti@aurak.ac.ae": "Department of architecture",
  "rawad.hodeify@aurak.ac.ae": "Department of Biotechnology",
  "alexandria.proff@aurak.ac.ae": "Department of Humanities and Social Sciences",
  "hamid.berriche@aurak.ac.ae": "Department of Mathematics and physics",
  "abdelfatah.arman@aurak.ac.ae": "Department of Management",
  // "hazimabukallub@gmail.com": "Department of Accounting and Finance"
};

// Ultimate authority admins who can view all events
export const ultimateAdmins = [
  "student.life@aurak.ac.ae",
  "qutaiba.raid@gmail.com",
  "hazimabukallub@gmail.com"

];

export const isPrivilegedUser = (email: string): boolean => {
  return privilegedEmails.includes(email);
};

export const isNormalUser = (email: string): boolean => {
  return normalUserEmails.includes(email);
};

export const isDepartmentAdmin = (email: string): boolean => {
  return email in departmentAdmins;
};

export const isUltimateAdmin = (email: string): boolean => {
  return ultimateAdmins.includes(email);
};

export const getDepartmentForAdmin = (email: string): string | null => {
  return departmentAdmins[email] || null;
};

export const getUserRole = (email: string): 'admin' | 'user' | 'department-admin' | 'ultimate-admin' => {
  if (isUltimateAdmin(email)) return 'ultimate-admin';
  if (isDepartmentAdmin(email)) return 'department-admin';
  if (isPrivilegedUser(email)) return 'admin';
  return 'user';
};
