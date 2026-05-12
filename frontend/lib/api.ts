const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProperties() {
  const response = await fetch(`${API_URL}/properties`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  const data = await response.json();

  return data.filter((property: any) => property.status !== "HIDDEN");
}

export async function getPropertyById(id: string) {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch property");
  }

  return response.json();
}

export async function createInquiry(
  propertyId: string,
  inquiryData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }
) {
  const response = await fetch(`${API_URL}/inquiries/${propertyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquiryData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Inquiry API error:", data);
    throw new Error(data.message || "Failed to send inquiry");
  }

  return data;
}

export async function registerUser(registerData: {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "AGENT";
}) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function loginUser(loginData: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function getMyDashboard(token: string) {
  const response = await fetch(`${API_URL}/properties/me/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard");
  }

  return data;
}

export async function getMyListings(token: string) {
  const response = await fetch(`${API_URL}/properties/me/listings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch listings");
  }

  return data;
}
export async function createProperty(
  token: string,
  propertyData: {
    title: string;
    description: string;
    price: number;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    sizeSqm: number;
    address: string;
    township: string;
    nearestStation: string;
    distanceToStation: number;
  }
) {
  const response = await fetch(`${API_URL}/properties`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(propertyData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create property");
  }

  return data;
}