
import { type Metadata } from 'next'
import ClientContent from './client';
import { getAuthSession } from '../lib/actions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Sign Up',
}

export default async function Register() {
    try {
        const session = await getAuthSession();
        if (session == null) {
            return <ClientContent />
        }
    } catch (err) {
        console.log(err);
        return <ClientContent />
    }

    redirect("/");
}