"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { RegisterState } from "./page";

type Action = (
  prev: RegisterState,
  formData: FormData
) => Promise<RegisterState>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Registering…" : "Register"}
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

export default function RegisterForm({ action }: { action: Action }) {
  const [state, formAction] = useActionState(action, {});

  const fieldError = (name: string) => state.errors?.[name]?.[0];

  return (
    <form action={formAction}>
      {state.message && (
        <p role="alert" style={{ color: "red" }}>
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          aria-invalid={!!fieldError("name")}
          aria-describedby="name-error"
        />
        <FieldError id="name-error" message={fieldError("name")} />
      </div>

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

      <div>
        <label htmlFor="password_confirmation">Password Confirmation</label>
        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          aria-invalid={!!fieldError("password_confirmation")}
          aria-describedby="password_confirmation-error"
        />
        <FieldError
          id="password_confirmation-error"
          message={fieldError("password_confirmation")}
        />
      </div>

      <SubmitButton />
    </form>
  );
}