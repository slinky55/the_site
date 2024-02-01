import { getServerSession } from "next-auth";

export default async function Protected() {
    try {
        const session = await getServerSession();
        if (session != null) {
            
        }
    } catch (err) {
        return <h1>Failed to get server session</h1>
    }

    return <h1>Not signed in</h1>
}