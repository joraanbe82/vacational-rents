export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  specs: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
  };
  images: string[];
}

export interface PropertyProps {
  id: string;
  title: string;
  images: string[];
}
