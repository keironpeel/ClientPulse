import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export type RegisterState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function registerUser(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  "use server";

  const BASE = process.env.API_URL ?? "http://localhost:8000";
  const body = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    password_confirmation: formData.get("password_confirmation") as string,
  };

  let res: Response;
  try {
    res = await fetch(`${BASE}/api/auth/register`, {
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
      message: json.message ?? "Registration failed.",
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

  redirect("/"); // throws NEXT_REDIRECT; Next handles navigation
}

export default function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm action={registerUser} />
    </div>
  );
}