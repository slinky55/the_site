import Link from 'next/link'

import { Button } from '@/app/components/Button'
import { TextField } from '@/app/components/Fields'
import { SlimLayout } from '@/app/components/SlimLayout'
import { type Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In',
}

export default function Login() {
    return (
        <SlimLayout>
            <h2 className="mt-20 text-lg font-semibold text-gray-900">
                Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-700">
                Don’t have an account?{' '}
                <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Sign up
                </Link>{' '}
                today.
            </p>
            <form action="#" className="mt-10 grid grid-cols-1 gap-y-8">
                <TextField
                    label="Email address"
                    name="email"
                    type="email"
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    required
                />
                <div>
                    <Button className="w-full">
            <span>
              Sign in <span aria-hidden="true">&rarr;</span>
            </span>
                    </Button>
                </div>
            </form>
        </SlimLayout>
    )
}