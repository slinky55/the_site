"use server"

import { z } from "zod";
import executeQuery from "./db";

import argon2 from "argon2";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

const SignUpSchema = z.object({
    firstName: z.string().max(36, { message: "First name is too long"} ),
    lastName: z.string().max(36, { message: "First name is too long"} ),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password is too short" }),
});

export async function signUpWithEmail(prevState: any, formData: FormData) {
    console.log("check")

    const rawForm = {
        firstName: formData.get("first_name"),
        lastName: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const parse = SignUpSchema.safeParse(rawForm);
    if (!parse.success) {
        return {
            message: "Error when signing up",
        }
    }

    const data = parse.data;

    try {
        const query = await executeQuery({query: "SELECT id FROM users WHERE email = ?", values: [data.email]}) as User[];
        if (query.length > 0) {
            return {
                message: "Email is already in use",
            }
        }
        
        const uuid = randomUUID();
        console.log(uuid);
        const name = data.firstName + " " + data.lastName;
        const hash = await argon2.hash(data.password, {
            secret: Buffer.from(process.env.HASH_SECRET!),
        });
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const insert = await executeQuery({
            query: "INSERT INTO users (id, name, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)", 
            values: [uuid, name, data.email, hash, date, date]
        });
        console.log(insert)

        redirect("/")
    } catch (err) {
        return {
            message: "Error when signing up",
        }
    }
}