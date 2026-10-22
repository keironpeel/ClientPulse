import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export const instant = false;

export type LoginState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function loginUser(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  "use server";

  const BASE = process.env.API_URL ?? "http://localhost:8000";
  const body = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  let res: Response;
  try {
    res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { message: "Network error. Please try again." };
  }

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    return {
      errors: json.errors ?? {},
      message: json.message ?? "Login failed.",
    };
  }

  const json = await res.json();
  const store = await cookies();
  store.set("__Host-auth_token", json.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const callbackUrl = (formData.get("callbackUrl") as string) || "/";
  redirect(callbackUrl);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return (
    <div>
      <h1>Login</h1>
      <LoginForm action={loginUser} callbackUrl={callbackUrl} />
    </div>
  );
}