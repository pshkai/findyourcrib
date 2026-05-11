import {
  Bath,
  BedDouble,
  Heart,
  MapPin,
} from "lucide-react";

interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  township: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  availability: "Available" | "Rented" | "Sold";
}

export default function PropertyCard({
  image,
  title,
  price,
  township,
  bedrooms,
  bathrooms,
  propertyType,
  availability,
}: PropertyCardProps) {
  const statusColors = {
    Available:
      "bg-emerald-100 text-emerald-700 border border-emerald-200",

    Rented:
      "bg-amber-100 text-amber-700 border border-amber-200",

    Sold:
      "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

      {/* Image Wrapper */}
      <div className="relative overflow-hidden">

        {/* Image */}
        <img
          src={image}
          alt={title}
          className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

        {/* Top Controls */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">

          {/* Availability */}
          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${statusColors[availability]}`}
          >
            {availability}
          </div>

          {/* Favorite */}
          <button className="rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition hover:scale-110">
            <Heart
              size={18}
              className="text-gray-700 transition hover:text-red-500"
            />
          </button>
        </div>

        {/* Bottom Image Content */}
        <div className="absolute bottom-4 left-4 right-4 text-white">

          <p className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
            {propertyType}
          </p>

          <h3 className="line-clamp-1 text-2xl font-bold">
            {title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-200">
            <MapPin size={16} />
            <span>{township}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 p-6">

        {/* Features */}
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2 shadow-sm">
              <BedDouble size={18} />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Bedrooms
              </p>

              <p className="font-semibold text-gray-900">
                {bedrooms}
              </p>
            </div>
          </div>

          <div className="h-10 w-px bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white p-2 shadow-sm">
              <Bath size={18} />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Bathrooms
              </p>

              <p className="font-semibold text-gray-900">
                {bathrooms}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Starting From
            </p>

            <h4 className="text-3xl font-bold tracking-tight text-gray-900">
              {price}
            </h4>
          </div>

          <button className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}