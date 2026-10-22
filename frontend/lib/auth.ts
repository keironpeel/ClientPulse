"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "./api";

export async function logout() {
  // Best-effort: revoke the token on the backend. Swallow failures (e.g. already
  // invalid) but never let them block the local sign-out.
  await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);

  const store = await cookies();
  store.delete("__Host-auth_token");

  redirect("/login");
}