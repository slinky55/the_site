"use client"

import { getSession } from "next-auth/react";

export default function Login() {
    async function loginWithGoogle(e: any) {
        try {
            const res = await fetch("/api/auth/signin/google", {
                method: "POST",
            });

            console.log(res);
            
            const session = await getSession();
            console.log(session);
        } catch (err) {
            console.log(err)
        }
    }

    async function loginWithGithub(e: any) {
        try {
            await fetch("/api/auth/signin/github", {
                method: "POST",
            });
            console.log("signed in");
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <button onClick={loginWithGoogle}>Login With Google</button>
            <button onClick={loginWithGithub}>Login With Github</button>
        </>
    )
}