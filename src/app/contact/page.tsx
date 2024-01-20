import React from 'react'
import Nav from '../components/nav'
import styles from './page.module.css'



export default function ContactPage() {
  return (
    <>
      <Nav />
      <body className={styles.body}>
      <div className={styles.global}>
      <div className={styles.container}>
        <h1>Contact Us</h1>
        <div className={styles.contactBox}>
          <div className={styles.contactLeft}>
            <h3>Sent your request</h3>
            <form>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Name</label>
                  <input className={styles.input} type="text" placeholder='John Doe' />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input className={styles.input} type="text" placeholder='+1 XXX-XXX-XXXX' />
                </div>

              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input className={styles.input} type="email" placeholder='************@ufl.edu' />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Subject</label>
                  <input className={styles.input} type="text"/>
                </div>

              </div>

              <label className={styles.label}>Message</label>
              <textarea className={styles.messageTextArea} rows='5'></textarea>

            </form>
          </div>
          <div className={styles.contactRight}>
            <h3>Reach Us</h3>
          </div>
        </div>
      </div>
      </div>
      </body>
    </>
  )
}
