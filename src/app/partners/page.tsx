import Image from 'next/image';
import executeQuery from '../lib/db';
import { Div } from '../types/div';
import styles from './page.module.css';
import { Partner } from '@/app/types/partner';

async function getData() {
  try  {
    const result: Partner[] = await executeQuery({
        query: 'SELECT * FROM Partner',
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

export default async function PartnersPage() {

  try {
    const partners: Partner[] | null = await getData();

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
      <>
        <div id={styles.redgraientsection}>
          <span style={{ width: "100vw" }}>Our Partners</span>
          <div id={styles.centerDisplayText}>
            <span>{getItem('intro', false)?.content}</span>
          </div>
        </div>
        <div id={styles.partnerblock}>
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                {(partners || []).map((partner, index) => (
                  <div id={styles.threeboxes} key={index}>
                    <Image src={partner.logo} width={300} height={200} alt="Image" />
                    <span className={styles.paragraphHeader}>{partner.name}</span>
                    <span className={styles.paragraphContents}>{partner.description}</span>
                  </div>
                ))}
              </div>
            ))}
          </>
        </div>
      </>
    )
} catch (err: any) {
  return (
    <>
      <p>{err.message}</p>
    </>
  )}
}
