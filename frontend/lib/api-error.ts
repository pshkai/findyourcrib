interface ApiErrorEnvelope {
  error?: {
    message?: string | string[];
    statusCode?: number;
  } | null;
}

export async function apiErrorMessage(response: Response, fallback: string) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await response.json()) as ApiErrorEnvelope;
      const message = body.error?.message;

      if (Array.isArray(message)) {
        return message.join("; ");
      }

      if (message) {
        return message;
      }
    } catch {
      return fallback;
    }
  }

  const text = await response.text();
  return text || fallback;
}

export async function throwApiError(response: Response, fallback: string): Promise<never> {
  throw new Error(await apiErrorMessage(response, fallback));
}
