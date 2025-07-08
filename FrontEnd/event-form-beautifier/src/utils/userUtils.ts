
export const privilegedEmails = [
  "2023005883@aurak.ac.ae",
  "Imad.hoballah@aurak.ac.ae",
  "qutaiba.raid@gmail.com",
  "admin@aurak.ac.ae",
  "Imadhoballah@gmail.com",

];

export const normalUserEmails = [
  "lm1006500@gmail.com",
  "hitomi7569@iamtile.com",
  "hazimabukallub@gmail.com"
  
];
const normalizeDepartment = (dept: string): string => {
  return dept
    .toLowerCase()
    .replace(/&/g, 'and') // replace ampersand with 'and'
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
};
// Department-specific admin mappings
export const departmentAdmins = {
  // "fayez.moutassem@aurak.ac.ae": "Department of Civil and infrastructure Engineering",
  // "sara.tasfy@aurak.ac.ae": "Department of chemical and petroleum Engineering",
  // "khouloud.salameh@aurak.ac.ae": "Department of Computer Science and Engineering",
  // "ali.ataby@aurak.ac.ae": "Department of Electrical and electronic Engineering",
  // "khaled.hossin@aurak.ac.ae": "Department of Mechanical Engineering",
  // "buthayna.eilouti@aurak.ac.ae": "Department of architecture",
  // "rawad.hodeify@aurak.ac.ae": "Department of Biotechnology",
  // "alexandria.proff@aurak.ac.ae": "Department of Humanities and Social Sciences",
  // "hamid.berriche@aurak.ac.ae": "Department of Mathematics and physics",
  // "abdelfatah.arman@aurak.ac.ae": "Department of Management",
  // "hazimabukallub@gmail.com": "Department of Accounting and Finance"

  "placeholder@aurak.ac.ae": normalizeDepartment("Department of Civil and Infrastructure Engineering"),
  "placeholder2@aurak.ac.ae": normalizeDepartment("Department of Chemical and Petroleum Engineering"),
  "placeholder3@aurak.ac.ae": normalizeDepartment("Department of Computer Science and Engineering"),
  "placeholder4@aurak.ac.ae": normalizeDepartment("Department of Electrical and Electronic Engineering"),
  "placeholder5@aurak.ac.ae": normalizeDepartment("Department of Mechanical Engineering"),
  "placeholder6@aurak.ac.ae": normalizeDepartment("Department of Architecture"),
  "placeholder7@aurak.ac.ae": normalizeDepartment("Department of Biotechnology"),
  "placeholder8@aurak.ac.ae": normalizeDepartment("Department of Humanities and Social Sciences"),
  "placeholder9@aurak.ac.ae": normalizeDepartment("Department of Mathematics and Physics"),
  "placeholder10@aurak.ac.ae": normalizeDepartment("Department of Management"),
  "hazimgamer101@gmail.com": normalizeDepartment("Department of Accounting and Finance"),
};

// Ultimate authority admins who can view all events
export const ultimateAdmins = [
  "student.life@aurak.ac.ae",
  "qutaiba.raid@gmail.com",

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
