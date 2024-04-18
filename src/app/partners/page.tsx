'use client'
import styles from './page.module.css';
import { Partner } from '@/app/types/partner';
import React, { useEffect, useState } from 'react';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
        try {
            const res = await fetch("/api/partners/getpartners");

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            if (!Array.isArray(data.partners)) {
                throw new Error('Unexpected data format');
            }

            setPartners(data.partners);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    getData();
}, []);

  return (
    <>
      <div id={styles.redgraientsection}>
        <span style={{ width: "100vw" }}>Our Partners</span>
        <div id={styles.centerDisplayText}>
          <span>Introducing our partners who share our commitment to promoting health equity through technology and community engagement. Together, we strive to address disparities and empower underserved communities for a healthier tomorrow. Feel free to check them out below.</span>
        </div>
      </div>
      <div id={styles.partnerblock}>
      {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                {partners.map((partner, index) => (
                  <div id={styles.threeboxes} key={index}>
                    <img src={partner.logo} width={300} height={200} alt="Image" />
                    <span className={styles.paragraphHeader}>{partner.name}</span>
                    <span className={styles.paragraphContents}>{partner.description}</span>
                  </div>
                ))}
        </div>
      ))}
  </>
)}

      </div>
    </>
  );
}