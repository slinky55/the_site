import { type Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import ClientContent from './client';
import { authConfig } from '../lib/auth';

export const metadata: Metadata = {
    title: 'Sign In',
}

export default async function Login() {
    try {   
        const session = await getServerSession(authConfig);
        if (session == null) {
            return <ClientContent />
        }
    } catch (err) {
        console.log(err)
        return <ClientContent />
    }

    redirect("/")
}