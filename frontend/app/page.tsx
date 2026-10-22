import { redirect } from "next/navigation";
import { getUser } from "@/lib/api";
import { logout } from "@/lib/auth";

export const instant = false;

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <p>Welcome, {user.name} ({user.email})</p>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}