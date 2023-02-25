interface IAddress {
  id: number;
  streetNumber: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  additionalInfo?: string;
  apartment?: string;
  isDefault?: boolean;
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
