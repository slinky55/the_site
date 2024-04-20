import styles from './page.module.css';
import Carousel from "@/app/components/Carousel"
import executeQuery from './lib/db';
import { Div } from './types/div';
import Image from 'next/image';

export default async function Home() {

  const res = await executeQuery({
    query: 'SELECT * FROM Images WHERE page=\'home\'',
    values: '',
  }) as any[];

  const images = res.map((img: any) => {
    return { ...img }
  });

  const res2 = await executeQuery({
    query: 'SELECT * FROM Divs WHERE page=\'home\'',
    values: '',
  }) as Div[];

  const divs = res2.map((div: Div) => {
    return { ...div }
  });

  function getItem(l: string, img: boolean) {
    if(img) {
      for(let i = 0; i < images.length; i++) {
        if(images[i].label===l) {
          return images[i]
        }
      }
    }
    else {
      for(let i = 0; i < divs.length; i++) {
        if(divs[i].label===l) {
          return divs[i]
        }
      }
    }
  }

  return (
    
    <main>
      <Carousel/>

      <div className={styles.smallDivide} style={{ height: '5px', backgroundColor: '#e40000' }}></div>

      <div className={styles.whoWeAre}>
        <div className={styles.whoWeAreSummary}>
          <center>
            <h1 className={styles.whoWeAreHeader} style={{ color: '#e40000', paddingTop: '20px', paddingBottom: '0px', marginBottom: '0' }}>Who We Are</h1>
            <Image src={getItem('WhoWeAre', true)?.url} style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: '20px'}} alt="" width={600} height={500}/>
          </center>
          <p className={styles.whoWeAreParagraph}>{getItem('WhoWeAre1', false)?.content}</p>
          <p className={styles.whoWeAreParagraph}>{getItem('WhoWeAre2', false)?.content}</p>
        </div>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.theSpotlight} style={{backgroundImage: `url('${getItem('bg', true)?.url}')`}}>
        <center><h2 style={{ color: '#fff', paddingTop: '40px', paddingBottom: '10px', fontSize: 'xx-large' }}>T.H.E Spotlight</h2></center>
        <div className={styles.spotlightContainer}>
          <div className={styles.spotlightItem}>
            <div className={styles.image}>
              <Image src={getItem('Spotlight1', true)?.url} alt="" width={500} height={500}/>
              <div className={styles.content}>
                <p>{getItem('Spotlight1', false)?.content}</p>
              </div>
            </div>
          </div>
          <div className={styles.spotlightItem}>
            <div className={styles.image}>
              <Image src={getItem('Spotlight2', true)?.url} alt="" width={500} height={500} />
              <div className={styles.content}>
                <p>{getItem('Spotlight2', false)?.content}</p>
              </div>
            </div>
          </div>
          <div className={styles.spotlightItem}>
            <div className={styles.image}>
              <Image src={getItem('Spotlight3', true)?.url} alt="" width={500} height={500} />
              <div className={styles.content}>
                <p>{getItem('Spotlight3', false)?.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
