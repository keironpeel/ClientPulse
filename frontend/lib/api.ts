import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE = process.env.API_URL ?? "http://localhost:8000";

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export async function apiFetch(path: string, init?: RequestInit) {
  const token = (await cookies()).get("__Host-auth_token")?.value;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    const store = await cookies();
    store.delete("__Host-auth_token");
    redirect("/login");
  }
  return res;
}

export async function getUser() {
  const res = await apiFetch("/api/user");
  if (!res.ok) return null;
  const json = await res.json();
  return (json?.data ?? json) as User | null;
}
