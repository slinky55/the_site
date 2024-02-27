'use client'
import React, { useState } from 'react';
import styles from './page.module.css';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Header } from '../components/Header';
import Link from 'next/link';


export default function ContactPage() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');

  async function createInquiry() {
        const postData = {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inquiry_id: uuidv4(),
              user_id: uuidv4(), // Larry please fix this to be the id of the currently signed in user
              subject: subject,
              email: email,
              content: msg
            })
        }

        await fetch('/api/inquiries/createinquiry', postData);
    }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Contact Us</h1>
        <div className={styles.instruction}>Use the form below to directly contact a group administrator. We'll respond as soon as we can!</div>
        <div className={styles.contactBox}>
          <div className={styles.contactLeft}>
            <form>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Name</label>
                  <input 
                  className={styles.input} 
                  type="text" 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='John Doe'
                  required />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input 
                  className={styles.input} 
                  type="text" 
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder='+1 XXX-XXX-XXXX'
                  required />
                </div>

              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input 
                  className={styles.input} 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='************@ufl.edu'
                  required />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Subject</label>
                  <input 
                  className={styles.input} 
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required />
                </div>

              </div>

              <label className={styles.label}>Message</label>
              <textarea 
              className={styles.messageTextArea}
              id="msg"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required></textarea>
              <button onClick={createInquiry}>Submit</button>
            </form>
          </div>
          <div className={styles.contactRight}>
            <div className={styles.contactRightBody}>Follow us on social media to keep in touch with the Technology, Health, and Equity Workgroup's latest updates.</div>
            <div className={styles.socialsLinks}>
              <Link href="instagram.com">
                <FontAwesomeIcon className={styles.socialsLink} icon={faInstagram}/>
              </Link>
              <Link href="facebook.com">
                <FontAwesomeIcon className={styles.socialsLink} icon={faFacebook} />
              </Link>
              <Link href="twitter.com">
                <FontAwesomeIcon className={styles.socialsLink} icon={faTwitter} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}