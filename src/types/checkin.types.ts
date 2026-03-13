export interface AddressData {
  street: string;
  extra: string;
  country: string;
  city: string;
  postalCode: string;
}

export interface GuestData {
  firstName: string;
  lastName: string;
  idType: 'DNI' | 'Passport' | 'NIE';
  idNumber: string;
  idIssueDate: string;
  birthDate: string;
  nationality: string;
  email: string;
  phone: string;
  address: AddressData;
  saveData: boolean;
}
