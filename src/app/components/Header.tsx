'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/app/components/Button'
import { Container } from '@/app/components/Container'
import { NavLink } from '@/app/components/NavLink'

function MobileNavLink({
                           href,
                           children,
                       }: {
    href: string
    children: React.ReactNode
}) {
    return (
        <Popover.Button as={Link} href={href} className="block w-full p-2">
            {children}
        </Popover.Button>
    )
}

function MobileNavIcon({ open }: { open: boolean }) {
    return (
        <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
        >
            <path
                className={clsx(
                    'origin-center transition',
                    open && 'scale-90 opacity-0',
                )}
            />
            <path
                d="M2 2L12 12M12 2L2 12"
                className={clsx(
                    'origin-center transition',
                    !open && 'scale-90 opacity-0',
                )}
            />
        </svg>
    )
}

function MobileNavigation() {
    return (
        <Popover>
            <Popover.Button
                className="relative z-10 flex h-8 w-8 items-center justify-center ui-not-focus-visible:outline-none"
                aria-label="Toggle Navigation"
            >
                {({ open }) => <MobileNavIcon open={open} />}
            </Popover.Button>
            <Transition.Root>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-150 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="duration-150 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        as="div"
                        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-slate-500 p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
                    >
                        <MobileNavLink href="/about-us">About Us</MobileNavLink>
                        <MobileNavLink href="/research-library">Research Library</MobileNavLink>
                        <MobileNavLink href="/news-and-events">News and Events</MobileNavLink>
                        <MobileNavLink href="/partners">Partners</MobileNavLink>
                        <MobileNavLink href="/projects">Projects</MobileNavLink>
                        <MobileNavLink href="/blog">Blog</MobileNavLink>
                        <MobileNavLink href="/contact">Contact Us</MobileNavLink>
                    </Popover.Panel>
                </Transition.Child>
            </Transition.Root>
        </Popover>
    )
}

export function Header() {
    return (
        <header>
            <Container className="">
                <nav className="relative z-50 flex justify-between bg-black col-span-12 px-32">
                    <div className="flex items-center md:gap-x-12">
                        <div className="hidden md:flex md:gap-x-6">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/about-us">About Us</NavLink>
                            <NavLink href="/research-library">Research Library</NavLink>
                            <NavLink href="/news-and-events">News and Events</NavLink>
                            <NavLink href="/partners">Partners</NavLink>
                            <NavLink href="/projects">Projects</NavLink>
                            <NavLink href="/blog">Blog</NavLink>
                            <NavLink href="/contact">Contact Us</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-5 md:gap-x-8">
                        <div className="hidden md:block">
                        </div>
                        <Button href="/login" color="red">
                <span>Sign In</span>
                        </Button>
                        <div className="-mr-1 md:hidden">
                            <MobileNavigation />
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    )
}