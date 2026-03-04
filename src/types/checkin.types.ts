export interface GuestData {
  firstName: string;
  lastName: string;
  idType: 'DNI' | 'Passport' | 'NIE';
  idNumber: string;
  idIssueDate: string;
  birthDate: string;
  nationality: string;
  email: string;
  saveData: boolean;
}
