// Navigation API Types
export interface NavigationItem {
  id: string
  label: string
  href: string
  visible: boolean
  protected: boolean
}

export interface NavigationData {
  items: NavigationItem[]
}

export interface NavigationResponse {
  success: boolean
  data?: NavigationData
  error?: string
}

// Contact API Types
export interface ContactInfo {
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  brandName: string
  copyright: string
}

export interface ContactResponse {
  success: boolean
  data?: ContactInfo
  error?: string
}

// Municipality API Types
export interface Municipality {
  id: string
  name: string
  createdAt: string
}

export interface MunicipalityResponse {
  success: boolean
  data?: Municipality | Municipality[]
  error?: string
}

export interface MunicipalityCreateRequest {
  name: string
}

export interface MunicipalityUpdateRequest {
  name: string
}

export interface GuestData {
  id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  issueDate: string;
  birthDate: string;
  nationality: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    extra: string;
    country: string;
    city: string;
    postalCode: string;
  };
}

export interface CheckinRecord {
  id: string;
  propertyId: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  guests: GuestData[];
  mainGuest: string;
}

export interface BookingRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  email: string;
  phone: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'rejected';
  checkinToken?: string;
  tokenExpiresAt?: string;
  checkinCompletedAt?: string;
}

// Page Content Types
export interface PageHero {
  title: string;
  subtitle: string;
  image: string;
}

export interface PageSection {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePosition: 'left' | 'right';
}

export interface PageCard {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface PageContact {
  enabled: boolean;
  email: string;
  phone: string;
  formTitle: string;
  formDescription: string;
}

export interface PageSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface PageContent {
  hero: PageHero;
  sections: PageSection[];
  cards: PageCard[];
  contact: PageContact;
  seo: PageSeo;
}

// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
