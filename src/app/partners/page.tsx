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
    }) as Partner[];
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
        <div className="bg-white py-4 sm:py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Partners</h2>
                  <p className="mt-2 text-lg leading-8 text-gray-600">
                      Meet the T.H.E. Team{"'"}s partners!
                  </p>
              </div>
              <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                  {partners?.map((partner: Partner) => (
                    <a href={`${partner.website_link}`} key={partner.name} className="flex flex-col items-start justify-between">
                          <div className="relative w-full">
                              <Image src={partner.logo} alt="" className="object-cover w-full h-48 rounded-2xl" width={500} height={500} />
                              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                          </div>
                          <div className="max-w-xl">
                              <div className="group relative">
                                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                          <span className="absolute inset-0" />
                                          {partner.name}
                                  </h3>
                                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{partner.description}</p>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          </div>
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
