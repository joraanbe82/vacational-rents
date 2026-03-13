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


export const RENTAL_PROPERTIES = [
  {
    id: "1",
    title: "Serene Lakeside Retreat",
    location: "Lake Como, Italy",
    price: 450,
    description: "Experience the ultimate tranquility in this architectural masterpiece. This home features floor-to-ceiling windows with panoramic lake views, a private infinity pool, and minimalist interiors designed for relaxation.",
    specs: { guests: 6, bedrooms: 3, bathrooms: 3.5 },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=2000",
    ],
  },
  {
    id: "2",
    title: "Modern Desert Oasis",
    location: "Palm Springs, California",
    price: 600,
    description: "A stunning mid-century modern gem in the heart of the desert. Enjoy the seamless indoor-outdoor living experience with a private courtyard and breathtaking mountain views.",
    specs: { guests: 4, bedrooms: 2, bathrooms: 2 },
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600607688960-e095ff83135f?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80&w=2000",
    ],
  },
  {
    id: "3",
    title: "Minimalist Forest Sanctuary",
    location: "Black Forest, Germany",
    price: 380,
    description: "Tucked away in the dense woods, this sanctuary offers a unique connection with nature. Minimalist design meets rustic charm in this eco-friendly wooden retreat.",
    specs: { guests: 2, bedrooms: 1, bathrooms: 1 },
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600566752229-250ed79470e6?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&q=80&w=2000",
    ],
  },
  {
    id: "4",
    title: "Contemporary Coastal Villa",
    location: "Malibu, California",
    price: 850,
    description: "Perched on a cliff overlooking the Pacific, this villa is the epitome of coastal luxury. Modern architecture and sea breezes make this a world-class destination.",
    specs: { guests: 8, bedrooms: 4, bathrooms: 5 },
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=2000",
    ],
  },
];
