"use server"

import { cookies } from 'next/headers';
import { RedirectType, redirect } from "next/navigation";

import { pool } from "./db";

import { z } from "zod";
import argon2 from "argon2";
import { getIronSession } from 'iron-session';

const registerSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
})

export async function register(prevState: any, formData: FormData) {
    const rawFormData = registerSchema.safeParse({
        firstName: formData.get("first_name"),
        lastName: formData.get("last_name"),
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (!rawFormData.success) {
        return { message: "One or more invalid fields" };
    }

    const data = rawFormData.data;

    try {
        const conn = await pool.getConnection();
        
        const existingRows: any[] = await conn.query("SELECT id FROM users WHERE email = ? LIMIT 1", [data.email]);
        
        if (existingRows.length > 0) {
            conn.end();
            return { success: false, message: "User with this email already exists" };
        }

        const hashedPassword = await argon2.hash(data.password, {
            secret: Buffer.from(process.env.PASSWORD_HASH_SECRET!),
        })

        const res = await conn.query("INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)", [data.firstName, data.lastName, data.email, hashedPassword])
        
        if (res.affectedRows < 1) {
            conn.end();
            return { success: false, message: "Registration failed, please try again" };
        }

        conn.end();
    } catch (err) {
        console.log(err);
        return { success: false, message: "Registration failed, please try again" };
    }

    redirect("/", RedirectType.replace);
}

const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
})

export async function login(prevState: any, formData: FormData) {
    const rawFormData = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    });

    if (!rawFormData.success) {
        return { message: "One or more invalid fields" };
    }

    const data = rawFormData.data;

    try {
        const conn = await pool.getConnection();
        const res = await conn.query("SELECT id, email, password_hash, is_admin FROM users WHERE email = ? LIMIT 1", [data.email]);
        
        if (res.length < 1) {
            conn.end()
            return { message: "Incorrect username or password" }
        }

        const rows = res[0];

        const authenticate = await argon2.verify(rows.password_hash, data.password, {
            secret: Buffer.from(process.env.PASSWORD_HASH_SECRET!),
        })

        if (!authenticate) {
            conn.end()
            return { message: "Incorrect username or password" }
        }

        const session: any = await getIronSession(cookies(), {
            password: process.env.SESSION_SECRET!,
            cookieName: "thew_session",
        });

        session.id = rows.id;
        session.email = rows.email;
        session.is_admin = rows.is_admin ? true : false;
        await session.save();

        conn.end()
    } catch (err) {
        console.log(err);
        return { message: "Failed to login, please try again" };
    }

    redirect("/")
}

export async function getAuthSession() {
    const session = await getIronSession(cookies(), {
        password: process.env.SESSION_SECRET!,
        cookieName: "thew_session",
    });

    return session;
}