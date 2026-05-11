export interface Property {
  id: number;
  image: string;
  title: string;
  price: string;
  township: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  availability: "Available" | "Rented" | "Sold";
}

export const properties: Property[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    title: "Modern Apartment in Thamel",
    price: "$500/month",
    township: "Kathmandu",
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Apartment",
    availability: "Available",
  },

  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
    title: "Luxury Family House",
    price: "$1200/month",
    township: "Lalitpur",
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "House",
    availability: "Available",
  },

  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858",
    title: "Minimal Studio Room",
    price: "$300/month",
    township: "Bhaktapur",
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Studio",
    availability: "Rented",
  },

  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    title: "Modern Condo with Balcony",
    price: "$850/month",
    township: "Pokhara",
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Condo",
    availability: "Available",
  },

  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118",
    title: "Cozy Single Room",
    price: "$200/month",
    township: "Chitwan",
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Room",
    availability: "Sold",
  },

  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    title: "Premium Villa Residence",
    price: "$2500/month",
    township: "Butwal",
    bedrooms: 5,
    bathrooms: 4,
    propertyType: "Villa",
    availability: "Available",
  },
];