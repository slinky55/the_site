import styles from './page.module.css';

import groupOfDoctors from "./istockphoto-1347476924-612x612.jpg";
import aiMedicalStock from "./ai-medical-background-concept-155234616-ezgif.com-webp-to-jpg-converter.jpg";
import redBackground from "./istockphoto-1267149438-612x612.jpg";

import Carousel from "@/app/components/Carousel"

export default function Home() {
  return (
    <main>
      <Carousel />

      <div className={styles.smallDivide} style={{ height: '5px', backgroundColor: '#e40000' }}></div>

      <div className={styles.whoWeAre}>
        <div className={styles.whoWeAreSummary}>
          <center>
            <h1 className={styles.whoWeAreHeader} style={{ color: '#e40000', paddingTop: '20px', paddingBottom: '0px', marginBottom: '0' }}>Who We Are</h1>
            <img src={groupOfDoctors.src} style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: '20px'}} />
          </center>
          <p className={styles.whoWeAreParagraph}>The Technology Health and Equity (THE) Workgroup, led by Dr. Delores C.S. James, is a dedicated research, education, and advocacy group committed to advancing health equity through the innovative use of technology. Rooted in the values of Respect, Empowerment, Advocacy, and Partnership (REAP), we strive to create a lasting impact on health outcomes, particularly among underserved communities. Our research focuses on digital health technologies, online health communities, social media engagement, and AI ethics, aiming to bridge gaps and empower individuals to take control of their health.</p>
          <p className={styles.whoWeAreParagraph}>Driven by our vision of leaving a legacy of health for future generations, THE Workgroup is on a mission to conduct impactful research, deliver accessible health education, and develop community partnerships. Our goals include promoting health equity through research, disseminating health information via social media and emerging technologies, empowering communities through education, and nurturing the next generation of health professionals. Through collaborative efforts and a commitment to inclusivity, we aspire to make tangible strides towards a healthier and more equitable future for all.</p>
        </div>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.theSpotlight} style={{backgroundImage: `url('${redBackground.src}')`}}>
        <center><h2 style={{ color: '#fff', paddingTop: '40px', paddingBottom: '10px', fontSize: 'xx-large' }}>T.H.E Spotlight</h2></center>
        <div className={styles.spotlightContainer}>
          <div className={styles.spotlightItem}>
            <div className={styles.image}>
              <img src={aiMedicalStock.src} alt="" />
              <div className={styles.content}>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis, architecto sit quidem quo, quibusdam animi magnam deserunt quasi autem necessitatibus accusamus! Facere blanditiis laborum, repudiandae laboriosam ipsam itaque omnis maiores.</p>
              </div>
            </div>
          </div>
          <div className={styles.spotlightItem}></div>
          <div className={styles.spotlightItem}></div>
        </div>
      </div>
    </main>
  )
}
