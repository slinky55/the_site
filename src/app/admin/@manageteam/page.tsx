'use client'
import { useEffect, useState } from 'react';
import styles from '../@manageprojects/page.module.css';
import Image from "next/image";

export default function Page() {
  const [teamLeaders, setTeamLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch("/api/teamleaders/getteamleaders");

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.leaders)) {
                    throw new Error('Unexpected data format');
                }

                setTeamLeaders(data.leaders);
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
      <div className={styles.header}>Manage Team Members</div>
          <hr/>
      <div className={styles.container}> 
      {teamLeaders ? (
        teamLeaders.map((teamLeader, key) => (
          <div className={styles.subContainer} key={key}>
            <Image className={styles.thumbnail} src={teamLeader.image_src} alt=""/>
            <div className={styles.title}>
              {teamLeader.leader_name}
            </div>
            <div className={styles.role}>
              {teamLeader.team_role}
            </div>
            <button className={styles.btn}>
              View More
            </button>
        </div>
      ))) : (
        <span>No existing team members.</span>
      )} 
      </div>
      </>
    )
  }