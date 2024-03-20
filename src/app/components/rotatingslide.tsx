import React from 'react';
import styles from './nav.module.css';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';

const getImageDimensions = (imagePath: string | Uint8Array) => {
  const dimensions = sizeOf(imagePath);
  return dimensions;
};
export default function RotatingSlide() {
  // Get the dimensions for each image
  const computerdeviceDimensions = getImageDimensions(path.resolve('./public/computerdevice.jpg'));
  const bodyDimensions = getImageDimensions(path.resolve('./public/body.jpg'));
  const doctorDimensions = getImageDimensions(path.resolve('./public/doctor.jpg'));

  return (
    <>
      <div className={styles.functionalBody}>
        <div id={styles.toolbar}>
          <a href="#link2" className={styles.navLink}>About Us</a>
          <a href="#link3" className={styles.navLink}>Research Library</a>
          <a href="#link2" className={styles.navLink}>News and Events</a>
          <a href="#link3" className={styles.navLink}>Partners</a>
          <a href="#link2" className={styles.navLink}>Projects</a>
          <a href="#link3" className={styles.navLink}>Blog</a>
          <a href="#link3" className={styles.navLink}>Contact Us</a>
          <a href="#link9" className={`${styles.navLink} ${styles.signInButton}`}>Sign In</a>
        </div>
        <div id={styles.section1}>
          <div id={styles.bottomLeftButton}>
            <div className={styles.buttonBox}>View Projects</div>
            <div id={styles.inputContainer}>
              <input type="text" />
              <input type="text" />
              <input type="text" />
            </div>
          </div>
        </div>
        <div id={styles.section2}>
          <div id={styles.imageContainer}>
            <Image src="/computerdevice.jpg" width={computerdeviceDimensions.width} height={computerdeviceDimensions.height} alt="Science Image" />
          </div>
          <div id={styles.textContainer}>
            <p style={{ color: 'red', marginBottom: '30px' }}>The Technology Health and Equity Workgroup</p>
            <div id={styles.workgroupDescription}>The Technology Health and Equity (THE) Workgroup is a research, education, and advocacy group led by Dr. Delores C.S. James. THE Workgroup conducts research on how social media and current and emerging technologies can be used to promote health, improve health outcomes, and increase health equity</div>
            <div className={styles.buttonBox}>Learn More</div>
          </div>
        </div>
        <div id={styles.section3}>
          <div id={styles.spotlightTitle}>T.H.E. Spotlight</div>
          <div id={styles.imageRow}>
            <Image src="/body.jpg" width={bodyDimensions.width} height={bodyDimensions.height} alt="Image" />
            <Image src="/doctor.jpg" width={doctorDimensions.width} height={doctorDimensions.height} alt="Image" />
            <Image src="/computerdevice.jpg" width={computerdeviceDimensions.width} height={computerdeviceDimensions.height} alt="Image" />
          </div>
        </div>
        <div id={`${styles.toolbar}`} style={{ justifyContent: 'center', color: 'white' }}>
          <span className={styles.connectWithUs} style={{ marginRight: '20px', fontWeight: 'bold' }}>Connect With Us</span>
          <span className={styles.logo} style={{ marginRight: '20px', fontWeight: 'bold' }}>Logo</span>
          <span className={styles.logo} style={{ marginRight: '20px', fontWeight: 'bold' }}>Logo</span>
          <span className={styles.logo} style={{ marginRight: '20px', fontWeight: 'bold' }}>Logo</span>
        </div>
      </div>
    </>
  );
}
