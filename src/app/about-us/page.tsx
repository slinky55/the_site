import { Container } from '@/app/components/Container'
import styles from './page.module.css'
import femaleStock from "./istockphoto-1280113805-612x612.jpg";


export default function AboutUs() {
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
        <div className={styles.container3}>
          <div className={styles.person}>
            <img src={femaleStock.src} className={styles.imgPerson} alt="Maria Lopez" />
            <div className={styles.personText}>
              <p>Maria Lopez</p>
              <p className={styles.position}>Community Health Worker Coordinator</p>
              <p>Maria is a dedicated individual responsible for coordinating the cadre of community health workers at THE Workgroup. With a background in community organizing and health education, Maria works closely with neighborhood organizations and agencies to empower communities to access and utilize health information and services. She organizes training sessions and supervises the delivery of educational messages through social media and emerging technologies.</p>
            </div>
          </div>
        </div>
      </>
    )
}