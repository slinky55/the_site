"use client"

import { getSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Login() {
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
            <button onClick={() => {signOut()}}>Sign out</button>
        </>
    )
}