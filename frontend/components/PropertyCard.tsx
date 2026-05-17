import Link from "next/link";

interface PropertyCardProps {
  id: number;
  title: string;
  price: number;
  township: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  image?: string;
}

export default function PropertyCard({
  id,
  title,
  price,
  township,
  propertyType,
  bedrooms,
  bathrooms,
  image,
}: PropertyCardProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div
        className="h-64 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            image ||
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
          })`,
        }}
      />

      <div className="p-6">
        <p className="text-sm font-medium text-blue-600">{propertyType}</p>

        <h3 className="mt-2 text-2xl font-bold text-gray-900">{title}</h3>

        <p className="mt-2 text-gray-600">{township}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span>{bedrooms} Beds</span>
          <span>{bathrooms} Baths</span>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xl font-bold text-gray-900">
            ฿{price.toLocaleString()}/mo
          </p>

          <Link
            href={`/properties/${id}`}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}