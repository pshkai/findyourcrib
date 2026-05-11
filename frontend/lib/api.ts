const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProperties() {
  const response = await fetch(
    `${API_URL}/properties`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  return response.json();
}

export async function getPropertyById(id: string) {
  const response = await fetch(
    `${API_URL}/properties/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch property");
  }

  return response.json();
}