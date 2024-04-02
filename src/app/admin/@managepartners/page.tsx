'use client'
import { useEffect, useState } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Partner } from '@/app/types/partner';

export default function Page() {
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
      <div className={styles.header}>Manage Partners</div>
          <hr/>
      <div className={styles.container}> 
      {partners ? (
        partners.map((partner) => (
          <div className={styles.subContainer}>
            <img className={styles.thumbnail} src={partner.logo}/>
            <div className={styles.title}>
              {partner.name}
            </div>
            <div className={styles.lead}>
              {partner.website_link}
            </div>
            <div className={styles.lead}>
              {partner.partnership_formed}
            </div>
            <button className={styles.btn}>
              View More
            </button>
        </div>
      ))) : (
        <span>No existing partners.</span>
      )} 
      </div>
      </>
    )
  }