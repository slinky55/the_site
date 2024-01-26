'use client'
import React, { useState } from 'react'
import styles from './page.module.css'
import { v4 as uuidv4 } from 'uuid';
import { Header } from '../components/Header'


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
            msg_id: uuidv4(),
            author_id: uuidv4(),
            msg: msg,
            author: name,
            phone: phoneNumber,
            email: email,
            msg_subject: subject,
            }),
        }

        await fetch('/api/inquiries/createinquiry', postData);
    }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>Contact Us</h1>
        <div className={styles.contactBox}>
          <div className={styles.contactLeft}>
            <h3>Sent your request</h3>
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
              <button onClick={createInquiry}></button>
            </form>
          </div>
          <div className={styles.contactRight}>
            <h3>Reach Us</h3>
          </div>
        </div>
      </div>
    </>
  )
}