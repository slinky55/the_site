import { Button } from '@/app/components/Button'
import { SlimLayout } from '@/app/components/SlimLayout'
import { Header } from '@/app/components/Header'

export default function NotFound() {
  return (
    <SlimLayout>
      <p className="mt-20 text-sm font-medium text-gray-700">404</p>
      <h1 className="mt-3 text-lg font-semibold text-gray-900">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-gray-700">
        Sorry, I think you&apos;re lost.
      </p>
      <Button href="/" className="mt-10">
        Go back home
      </Button>
    </SlimLayout>
  )
}