"use server"

import { z } from "zod";
import executeQuery from "./db";

import argon2 from "argon2";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

import { sql } from "@vercel/postgres";

const SignUpSchema = z.object({
    firstName: z.string().max(36, { message: "First name is too long"} ),
    lastName: z.string().max(36, { message: "First name is too long"} ),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password is too short" }),
});

export async function signUpWithEmail(formData: FormData) {
    const rawForm = {
        firstName: formData.get("first_name"),
        lastName: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const parse = SignUpSchema.safeParse(rawForm);
    if (!parse.success) {
        console.log("error parsing")
        return;
    }

    const data = parse.data;

    try {
        const query = await executeQuery({query: "SELECT id FROM users WHERE email = ?", values: [data.email]}) as User[];
        if (query.length > 0) {
            console.log("query failed")
            return;
        }
        
        const uuid = randomUUID();
        console.log(uuid);
        const name = data.firstName + " " + data.lastName;
        const hash = await argon2.hash(data.password, {
            secret: Buffer.from(process.env.HASH_SECRET!),
        });
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const priv = "default"

        await sql`INSERT INTO users (id, name, email, "passwordHash", "privilegeLevel", "createdAt", "updatedAt") VALUES (${uuid}, ${name}, ${data.email}, ${hash}, ${priv}, NOW(), NOW())`
    } catch (err) {
        console.log(err)
        return;
    }

    redirect("/")
}