'use client'
import React, { useState } from 'react';
import styles from './page.module.css';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';


export default function ContactPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
              user_id: uuidv4(),
              content: msg,
              first_name: firstName,
              last_name: lastName,
              email: email,
              subj: subject,
            })
        }

        await fetch('/api/inquiries/createinquiry', postData);
    }

    return (
      <>
        <div className={styles.container}>
          <div className={styles.contactBox}>
            <div className={styles.contactLeft}>
            <center><h1 className={styles.title}>Contact Us</h1></center>
            <div className={styles.instruction}>Use the form below to directly contact a group administrator. We'll respond as soon as we can!</div>
              <form>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>First Name</label>
                    <input 
                    className={styles.input} 
                    type="text" 
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='John'
                    required />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Last Name</label>
                    <input 
                    className={styles.input} 
                    type="text" 
                    id="name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='Doe'
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
                maxLength={250}
                className={styles.messageTextArea}
                id="msg"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder='Max number of characters: 250'
                required></textarea>
                <center><button className={styles.submitButton} onClick={createInquiry}>Submit</button> </center>
              </form>
            </div>
            <div className={styles.contactRight}>
              <div className={styles.contactRightBody}>Follow us on social media to keep in touch with the Technology, Health, and Equity Workgroup's latest updates.</div>
              <div className={styles.socialsLinks}>
                <hr className={styles.customHR} />
                <Link href="instagram.com">
                  <FontAwesomeIcon className={styles.socialsLink} icon={faInstagram}/>
                </Link>
                <Link href="facebook.com">
                  <FontAwesomeIcon className={styles.socialsLink} icon={faFacebook} />
                </Link>
                <Link href="twitter.com">
                  <FontAwesomeIcon className={styles.socialsLink} icon={faTwitter} />
                </Link>
                <hr className={styles.customHR} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }