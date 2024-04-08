"use server"

import styles from './page.module.css'
import { TeamLeader } from '../types/teamleader';
import executeQuery from '../lib/db';
import Image from 'next/image';

async function getData() {
  try  {
    const result: TeamLeader[] = await executeQuery({
        query: 'SELECT * FROM TeamLeader',
        values: '',
    })

    if (result) {
      return result;
    } else {
      return null;
    }
  } catch ( error ) {
    throw error;
  }
}

export default async function AboutUs() {
  try {
    const leaders: TeamLeader[] | null = await getData();

    if (leaders == null || leaders.length == 0) {
      return (
        <>
          <div className={styles.container1}>
            <div className={styles.whoWeAre}>
              <h2 className={styles.aboutUsHeading}>Who We Are</h2>
              <p className={styles.aboutUs}>The Technology Health and Equity (THE) Workgroup stands at the forefront of research, education, and advocacy aimed at leveraging social media and emerging technologies to advance health equity. Rooted in our core values of Respect, Empowerment, Advocacy, and Partnership (REAP), we strive to create a legacy of health for the next generation. Led by Dr. James, a distinguished Associate Professor at the University of Florida, our multidisciplinary team is committed to conducting innovative research on digital health technologies, mobile health, and online health communities. We empower individuals, families, and neighborhoods to access and utilize health information and services, particularly among vulnerable populations. Through community-engaged research and partnerships with organizations like Gardenia Gardens and Gainesville Public Housing, we address systemic barriers to health and advocate for those who are underrepresented and marginalized. Our internship program, coordinated by David Thompson, provides invaluable opportunities for undergraduate and graduate health students to contribute to meaningful projects and develop essential skills in health promotion and technology. Together, we strive to foster a culture of health, inclusion, and empowerment in communities across the nation.</p>
            </div>
          </div>
          <div className={styles.container2}>
            <div className={styles.line}></div>
            <div className={styles.teamHeader}>Meet the Team</div>
          </div>

          <p>Sorry, no team leaders found!</p>
        </>
      )
    }

    return (
      <>
        <div className={styles.container1}>
          <div className={styles.whoWeAre}>
            <h2 className={styles.aboutUsHeading}>Who We Are</h2>
            <p className={styles.aboutUs}>The Technology Health and Equity (THE) Workgroup stands at the forefront of research, education, and advocacy aimed at leveraging social media and emerging technologies to advance health equity. Rooted in our core values of Respect, Empowerment, Advocacy, and Partnership (REAP), we strive to create a legacy of health for the next generation. Led by Dr. James, a distinguished Associate Professor at the University of Florida, our multidisciplinary team is committed to conducting innovative research on digital health technologies, mobile health, and online health communities. We empower individuals, families, and neighborhoods to access and utilize health information and services, particularly among vulnerable populations. Through community-engaged research and partnerships with organizations like Gardenia Gardens and Gainesville Public Housing, we address systemic barriers to health and advocate for those who are underrepresented and marginalized. Our internship program, coordinated by David Thompson, provides invaluable opportunities for undergraduate and graduate health students to contribute to meaningful projects and develop essential skills in health promotion and technology. Together, we strive to foster a culture of health, inclusion, and empowerment in communities across the nation.</p>
          </div>
        </div>
        <div className={styles.container2}>
          <div className={styles.line}></div>
          <div className={styles.teamHeader}>Meet the Team</div>
        </div>
  
        {leaders.map((leader: TeamLeader, key: any) => (
          <div className={styles.container3} key={key}>
            <div className={styles.person}>
              <Image src={leader.image_src} className={styles.imgPerson} alt="Maria Lopez" width={100} height={100}/> {/*width and height need to be changed */}
              <div className={styles.personText}>
                <p>{leader.leader_name}</p>
                <p className={styles.position}>{leader.team_role}</p>
                <p>{leader.about_me}</p>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  } catch (err: any) {
    return (
      <>
        <p>{err.message}</p>
      </>
    )
  }
}
