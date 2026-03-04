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
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1513584684374-8bdb7489feef?auto=format&fit=crop&q=80&w=2000",
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
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1449156001935-d28bc3df72a5?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&q=80&w=2000",
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
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000",
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
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000",
    ],
  },
];
