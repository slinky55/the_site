'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import styles from './page.module.css';
import { Button } from '@/app/components/Button'
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
        <div id={styles.toolbar}>
        <div>
          <a href="/" className={styles.navLink}>Home</a>
          <a href="/about-us" className={styles.navLink}>About Us</a>
          <a href="/research-library" className={styles.navLink}>Research Library</a>
          <a href="/news-and-events" className={styles.navLink}>News and Events</a>
          <a href="/partners" className={styles.navLink}>Partners</a>
          <a href="/projects" className={styles.navLink}>Projects</a>
          <a href="/blog" className={styles.navLink}>Blog</a>
          <a href="/contact" className={styles.navLink}>Contact Us</a>
        </div>
        <div>
          <a href="#link9" className={`${styles.signInButton}`}>Sign In</a>
        </div>
      </div>
    )
}