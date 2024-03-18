import { type Metadata } from 'next'
import ClientContent from './client'

export const metadata: Metadata = {
    title: 'Sign Up',
}

export default function Register() {
    return <ClientContent />
}