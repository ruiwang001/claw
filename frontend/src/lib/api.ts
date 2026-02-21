const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function apiForm<T>(path: string, body: URLSearchParams): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
