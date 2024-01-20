import React from 'react'
import Nav from '../components/nav'

import styles from "./page.module.css"

function ProjectDisplay() {
  return (
    <>
      <div className={styles.projectDisplay}>
        <h1>Project Title</h1>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh viverra non semper suscipit posuere a pede.</p>
        <img src='https://picsum.photos/200/300'></img>
      </div>
    </>
  )
}

export default function ProjectPage() {
  return (
    <>
      <Nav />
      <div>ProjectPage</div>

      <div className={styles.projectGrid}>
        <ProjectDisplay />
        <ProjectDisplay />
        <ProjectDisplay />
      </div>
    </>
  )
}
