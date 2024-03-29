import React from 'react';
import styles from './nav.module.css';
import Image from 'next/image';

export default function PartnersPage() {

  return (
    <>
      <div id={styles.toolbar}>
        <div>
          <a href="#link2" className={styles.navLink}>Home</a>
          <a href="#link3" className={styles.navLink}>About Us</a>
          <a href="#link2" className={styles.navLink}>Research Library</a>
          <a href="#link3" className={styles.navLink}>News and Events</a>
          <a href="#link2" className={styles.navLink}>Partners</a>
          <a href="#link3" className={styles.navLink}>Projects</a>
          <a href="#link3" className={styles.navLink}>Blog</a>
          <a href="#link3" className={styles.navLink}>Contact Us</a>
          </div>
      <div>
        <a href="#link9" className={`${styles.signInButton}`}>Sign In</a>
      </div>
      </div>
        <div id={styles.redgraientsection}>
            <span style={{width: "100vw"}}>Our Partners</span>
            <div id={styles.centerDisplayText}><span>Introducting our partenrs who share our commitment to promoting health equity through technology and community engagement. Together, we strive to address disparities and empower underserved communities for a healthier tomorrow. Feel free to check them out below.</span></div>
        </div>
        <div id={styles.partnerblock}>
            <div id={styles.threeboxes}>
                <Image src="/uflogo.png" width={"300"} height={"200"} alt="Image" />
                <span className={styles.paragraphHeader}>University of Florida</span>
                <span className={styles.paragraphContents}>The University of Florida is a renowned public research university located in Gainesville, Florida, offering a wide array of undergraduate, graduate, and professional degree programs in diverse fields.</span>
            </div>
            <div id={styles.threeboxes}>
                <Image src="/uflogo.png" width={"300"} height={"200"} alt="Image" />
                <span className={styles.paragraphHeader}>University of Florida</span>
                <span className={styles.paragraphContents}>The University of Florida is a renowned public research university located in Gainesville, Florida, offering a wide array of undergraduate, graduate, and professional degree programs in diverse fields.</span>
            </div>
            <div id={styles.threeboxes}>
                <Image src="/uflogo.png" width={"300"} height={"200"} alt="Image" />
                <span className={styles.paragraphHeader}>University of Florida</span>
                <span className={styles.paragraphContents}>The University of Florida is a renowned public research university located in Gainesville, Florida, offering a wide array of undergraduate, graduate, and professional degree programs in diverse fields.</span>
            </div>
        </div>
        <div id={`${styles.toolbar}`} style={{ justifyContent: 'center', color: 'white' }}>
          <span className={styles.connectWithUs} style={{ marginRight: '20px'}}>Connect With Us</span>
          <span className={styles.logo} style={{ marginRight: '20px'}}>Logo</span>
          <span className={styles.logo} style={{ marginRight: '20px'}}>Logo</span>
          <span className={styles.logo} style={{ marginRight: '20px'}}>Logo</span>
        </div>
    </>
  );
}
