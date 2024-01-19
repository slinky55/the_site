import Link from 'next/link'
import React from 'react'
import styles from './nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.linkContainer}>
        <Link className={styles.link} href="/">Home</Link>
        <Link className={styles.link} href="/about-us">About Us</Link>
        <Link className={styles.link} href="/research-library">Research Library</Link>
        <Link className={styles.link} href="/news-and-events">News and Events</Link>
        <Link className={styles.link} href="/partners">Partners</Link>
        <Link className={styles.link} href="/projects">Projects</Link>
        <Link className={styles.link} href="/blog">Blog</Link>
        <Link className={styles.link} href="/contact">Contact Us</Link>
      </nav>
  )
}
