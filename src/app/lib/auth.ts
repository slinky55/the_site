import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import executeQuery, { sequelize } from "./db";

import SequelizeAdapter, {models} from "@next-auth/sequelize-adapter";
import { DataTypes } from "sequelize";

import argon2 from "argon2";

export const authConfig = {
    providers: [    
        GithubProvider({      
            clientId: process.env.GITHUB_ID!,      
            clientSecret: process.env.GITHUB_SECRET!,    
        }),  
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'credentials',

            credentials: {
              email: { label: "Email", type: "text", placeholder: "jsmith@email.com" },
              password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                if (!credentials) {
                    console.log("no credentials recieved")
                    return null;
                }

                const {email, password} = credentials;
                
                try {
                    const rows = await executeQuery({query: "SELECT id, passwordHash FROM users WHERE email = ? LIMIT 1", values: [email]}) as User[];
                    
                    if (rows.length < 1) {
                        // create user
                        console.log("user does not exist")
                        return null
                    }

                    const userData = rows[0];

                    const passCorrect = await argon2.verify(userData.passwordHash, password, {
                        secret: Buffer.from(process.env.HASH_SECRET!),
                    })

                    if (!passCorrect) {
                        return null;
                    }

                    return {
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        image: userData.image,
                        privilegeLevel: userData.privilegeLevel,
                    };
                } catch (err) {
                    console.log(err)
                    return null
                }
            },
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async redirect({url, baseUrl}: any) {
          return "/";
        },

        async session({session, token, user}: any) {
            session.privilegeLevel = user.privilegeLevel;

            console.log(session)

            return session;
        }
    },
    adapter: SequelizeAdapter(sequelize, {
        models: {
            User: sequelize.define("user", {
                ...models.User,
                passwordHash: DataTypes.STRING,
                privilegeLevel: DataTypes.STRING,
            })
        }
    }),
};