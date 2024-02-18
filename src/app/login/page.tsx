import { type Metadata } from 'next'

import { getAuthSession } from '../lib/actions';
import ClientContent from './client';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Sign In',
}

export default async function Login() {
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