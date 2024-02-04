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
                <div>
                    <Button className="w-half mr-16">
                        <svg
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="mr-2"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
                        </svg>
                        Google Login
                    </Button>
                    <Button className="w-half mr-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="20"
                            fill="currentColor"
                            className="mr-2"
                            viewBox="0 0 1792 1792"
                        >
                            <path
                                d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                        </svg>
                        GitHub Login
                    </Button>
                </div>
            </form>
        </SlimLayout>
    )
}