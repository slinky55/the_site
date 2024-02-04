"use client"

import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const router = useRouter();
    getSession().then((s) => {
        if (s != null) {
            router.push("/");
        }
    }).catch((err) => {
        console.log(err);
    })

    const loginWithGoogle = async () => {
        try {
            await signIn("google");
        } catch (err) {
            console.log(err);
        }
        
    }

    const loginWithGithub = async () => {
        try {
            await signIn("github");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <button onClick={loginWithGoogle}>Login With Google</button>
            <button onClick={loginWithGithub}>Login With Github</button>
        </>
    )
}

