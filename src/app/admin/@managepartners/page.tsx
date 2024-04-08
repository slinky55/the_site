'use client'
import { useEffect, useState } from 'react';
import styles from '../@manageprojects/page.module.css';
import { Partner } from '@/app/types/partner';
import { Spinner } from "@/app/components/Spinner";
import Image from "next/image";

export default function Page() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagesLoaded, setPagesLoaded] = useState<number>(0);
    const limit = 10;

    useEffect(() => {
      const partnersData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: limit,
          offset: 0,
        })
      }
        async function getData() {
            try {
                const res = await fetch("/api/partners/getpartners", partnersData);

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
                setPagesLoaded(1);
            }
        }

        getData();
    }, []);

    async function loadMore() {
      setLoading(true);
      const queryData = {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: limit,
            offset: (pagesLoaded * limit) - 1,
          })
      }
      async function getData() {
          try {
              const res = await fetch("/api/partners/getpartners", queryData);

              if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();

              if (!Array.isArray(data.partners)) {
                  throw new Error('Unexpected data format');
              }

              setPartners(prevPartners => [...prevPartners, ...data.partners]);
          } catch (error) {
              console.error(error);
          } finally {
              setLoading(false);
              setPagesLoaded(pagesLoaded + 1);
          }
    }

    getData();
  }

    return (
      <>
      <div className={styles.header}>Manage Partners</div>
          <hr/>
      <div className={styles.container}> 
      {partners ? (
        partners.map((partner, key) => (
          <div className={styles.subContainer} key={key}>
            <Image className={styles.thumbnail} src={partner.logo} alt="key"/>
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
      <div
        className="flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3"
      >
        {!loading ? (
          <button onClick={loadMore}>Load more items...</button>
        ) : (
          <Spinner />
        )}
      </div>
      </>
    )
  }