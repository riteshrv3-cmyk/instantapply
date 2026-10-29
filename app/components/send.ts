// Small fetch helper for forms: returns { data } or { error } with a readable message.
export async function send<T = unknown>(url: string, method: string, body?: unknown): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      method,
      headers: body instanceof FormData || body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (data as { error?: string }).error || "Something went wrong" };
    return { data: data as T };
  } catch {
    return { error: "Network problem. Check your connection and try again." };
  }
}
