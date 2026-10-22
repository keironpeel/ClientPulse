"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { LoginState } from "./page";

type Action = (
  prev: LoginState,
  formData: FormData
) => Promise<LoginState>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Logging in…" : "Login"}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} role="alert" style={{ color: "red" }}>
      {message}
    </span>
  );
}

export default function LoginForm({
  action,
  callbackUrl,
}: {
  action: Action;
  callbackUrl?: string;
}) {
  const [state, formAction] = useActionState(action, {});

  const fieldError = (name: string) => state.errors?.[name]?.[0];

  return (
    <form action={formAction}>
      {callbackUrl && (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      )}
      {state.message && (
        <p role="alert" style={{ color: "red" }}>
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          aria-invalid={!!fieldError("email")}
          aria-describedby="email-error"
        />
        <FieldError id="email-error" message={fieldError("email")} />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          aria-invalid={!!fieldError("password")}
          aria-describedby="password-error"
        />
        <FieldError id="password-error" message={fieldError("password")} />
      </div>

      <SubmitButton />
    </form>
  );
}