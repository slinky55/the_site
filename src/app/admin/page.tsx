import { getServerSession } from "next-auth"
import { authConfig } from "../lib/auth";


export default async function AdminPage() {
  const session = await getServerSession(authConfig);

  return (
    <>
    </>
  )
}
