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

export default IUser;
