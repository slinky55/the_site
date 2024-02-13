
import { type Metadata } from 'next'
import { getServerSession } from 'next-auth';
import { authConfig } from '../lib/auth';
import ClientContent from './client';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Sign Up',
}

export default async function Register() {
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