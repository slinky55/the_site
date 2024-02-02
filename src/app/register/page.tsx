import Link from 'next/link'

import { Button } from '@/app/components/Button'
import { TextField } from '@/app/components/Fields'
import { SlimLayout } from '@/app/components/SlimLayout'
import { type Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up',
}

export default function Register() {
    return (
        <SlimLayout>
            <h2 className="mt-20 text-lg font-semibold text-gray-900">
                Get started for free
            </h2>
            <p className="mt-2 text-sm text-gray-700">
                Already registered?{' '}
                <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Sign in
                </Link>{' '}
                to your account.
            </p>
            <form
                action="#"
                className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
            >
                <TextField
                    label="First name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="John"
                    required
                />
                <TextField
                    label="Last name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Doe"
                    required
                />
                <TextField
                    className="col-span-full"
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="abc@example.com"
                    required
                />
                <TextField
                    className="col-span-full"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                />
                <div className="col-span-full">
                    <Button className="w-full">
            <span>
              Sign up <span aria-hidden="true">&rarr;</span>
            </span>
                    </Button>
                </div>
            </form>
        </SlimLayout>
    )
}