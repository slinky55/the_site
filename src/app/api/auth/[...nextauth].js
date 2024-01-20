import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = { 
    providers: [    
        GithubProvider({      
            clientId: process.env.GITHUB_ID,     // TODO: We'll need to actually set this up later, and add more providers
            clientSecret: process.env.GITHUB_SECRET,   
        }),    
    ],
}