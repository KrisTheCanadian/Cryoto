interface IAddress {
  additionalInfo?: string;
  apartment?: string;
  city: string;
  country: string;
  id: number;
  isDefault?: boolean;
  // oId: string;
  postalCode: string;
  province: string;
  street: string;
  streetNumber: string;
  // userProfile: any;
}

export interface IUpdateAddress {
  streetNumber?: string;
  street?: string;
  apartment?: string;
  additionalInfo?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  isDefault?: true;
}

export default IAddress;
