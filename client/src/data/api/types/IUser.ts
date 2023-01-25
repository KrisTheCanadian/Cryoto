interface IUser {
  oId: string;
  name: string;
  email: string;
  language: string;
  role: string[];
  businessTitle: string;
  city: string;
  timeZone: string;
  managerReference: string;
  recognitionsReceived: number;
  recognitionsSent: number;
  startDate: string;
  birthday: string;
}

export interface IUserProfile {
  // addresses?: string[];
  bio?: string;
  businessTitle?: string;
  // company?: string;
  // countryReference?: string;
  // countryReferenceTwoLetter?: string;
  email: string;
  emailNotifications: boolean;
  // fax?: string;
  language: string;
  // managerReference?: string;
  // mobile?: number;
  name: string;
  oId: string;
  postalCode?: string;
  // primaryWorkTelephone?: string;
  // roles: string[];
  // supervisoryOrganization?: string;
  // wallets?: any;
}

export interface IUpdateUserProfile {
  name?: string;
  businessTitle?: string;
  language?: string;
  bio?: string;
  emailNotifications?: boolean;
}

export default IUser;
