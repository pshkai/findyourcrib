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