import { getServerSession } from "next-auth"
import { authConfig } from "../lib/auth";
import {redirect} from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect("/login")
  }

  if (!session.user) {
    redirect("/login")
  }

  if (session.privilegeLevel != "admin") {
    redirect("/login")
  }

  return (
    <>
    </>
  )
}
