import { getServerSession } from "next-auth"
import { authConfig } from "../lib/auth";
import {redirect} from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/")
  }

  const user = session.user;
  if (!user) {
    redirect("/")
  }

  if (session.privilegeLevel != "admin") {
    redirect("/")
  }

  return (
    <>
    </>
  )
}
