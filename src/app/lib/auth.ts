import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"

import { TypeORMAdapter } from "@auth/typeorm-adapter";
import { DataSourceOptions } from "typeorm";

const dataSourceOptions: DataSourceOptions = {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT!),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    driver: "mariadb"
}


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
            name: 'Credentials',

            credentials: {
              username: { label: "Username", type: "text", placeholder: "jsmith" },
              password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                const res = await fetch("/api/the/login", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })
                const user = await res.json()
            
                if (res.ok && user) {
                    return user
                }

                return null
                }
            })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async redirect() {
          return "/";
        }
    },
    adapter: TypeORMAdapter(dataSourceOptions)
};