import React from 'react';
import styles from './page.module.css';
import Image from 'next/image';

export default function PartnersPage() {
  return (
    <>
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
    </>
  );
}