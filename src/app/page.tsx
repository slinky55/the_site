'use client'

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import workGroup1 from "./Workgroup1.jpg";
import workGroup2 from "./Workgroup2.jpg";
import workGroup6 from "./Workgroup6.jpg";
import groupOfDoctors from "./istockphoto-1347476924-612x612.jpg";
import aiMedicalStock from "./ai-medical-background-concept-155234616-ezgif.com-webp-to-jpg-converter.jpg";
import redBackground from "./istockphoto-1267149438-612x612.jpg";

export default function Home() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const track = document.querySelector<HTMLElement>(`.${styles.carouselTrack}`);
    const nextButton = document.querySelector(`.${styles.carouselButtonRight}`);
    const prevButton = document.querySelector(`.${styles.carouselButtonLeft}`);
    const rectNav = document.querySelector(`.${styles.carouselNav}`); 

    if (!track || !nextButton || !prevButton || !rectNav) {
      return;
    }
    
    const slides = Array.from(track!.children);
    const rectangles = Array.from(rectNav!.children);
    const slideWidth = slides[0]?.getBoundingClientRect().width;



    const setSlidePosition = (slide: HTMLElement, index: number) => {
        slide.style.left = (slideWidth * index) + 'px';
    };

    slides.forEach((slide, index) => setSlidePosition(slide as HTMLElement, index));

    const moveToSlide = (targetIndex: number) => {
        const currentSlide = track.querySelector(`.${styles.currentSlide}`);
        const targetSlide = slides[targetIndex] as HTMLElement;
        if (!currentSlide || !targetSlide) {
            return;
        }
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove(styles.currentSlide);
        targetSlide.classList.add(styles.currentSlide);
        setCurrentSlideIndex(targetIndex);
    };

    const updateRectangles = (targetIndex: number) => {
        const currentRect = rectNav.querySelector(`.${styles.currentSlide}`);
        const targetRect = rectangles[targetIndex] as HTMLElement;
        if (!currentRect || !targetRect) {
            return;
        }
        currentRect.classList.remove(styles.currentSlide);
        targetRect.classList.add(styles.currentSlide);
    };

    const automaticSlider = () => {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex === slides.length) nextIndex = 0;
        moveToSlide(nextIndex);
        updateRectangles(nextIndex);
    };

    const intervalId = setInterval(automaticSlider, 3000);

    prevButton.addEventListener('click', () => {
        let prevIndex = currentSlideIndex - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        moveToSlide(prevIndex);
        updateRectangles(prevIndex);
    });

    nextButton.addEventListener('click', () => {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex === slides.length) nextIndex = 0;
        moveToSlide(nextIndex);
        updateRectangles(nextIndex);
    });

    rectNav.addEventListener('click', (e) => {
        const targetIndex = rectangles.findIndex(rectangle => rectangle === e.target);
        if (targetIndex !== -1) {
            moveToSlide(targetIndex);
            updateRectangles(targetIndex);
        }
    });

    return () => clearInterval(intervalId); // Clear interval on unmount
}, [currentSlideIndex]);

  return (
    <main>
       <div className={styles.carousel}>
        <div className={styles.carouselTrackContainer}>
          <ul className={styles.carouselTrack}>
            <li className={`${styles.carouselSlide} ${currentSlideIndex === 0 && styles.currentSlide}`}>
              <img className={styles.carouselImages} src={workGroup6.src} alt="" />
            </li>
            <li className={styles.carouselSlide}>
              <img className={styles.carouselImages} src={workGroup2.src} alt="" />
            </li>
            <li className={styles.carouselSlide}>
              <img className={styles.carouselImages} src={workGroup1.src} alt="" />
            </li>
          </ul>
        </div>

        <button className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}>
			    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
		    </button>
		    <button className={`${styles.carouselButton} ${styles.carouselButtonRight}`}>
			    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
		    </button>

        <div className={styles.carouselNav}>
          <button className={`${styles.carouselIndicator} ${styles.carouselIndicatorLeft} ${currentSlideIndex === 0 && styles.currentSlide}`}></button>
          <button className={`${styles.carouselIndicator} ${styles.carouselIndicatorMiddle} ${currentSlideIndex === 1 && styles.currentSlide}`}></button>
          <button className={`${styles.carouselIndicator} ${styles.carouselIndicatorRight} ${currentSlideIndex === 2 && styles.currentSlide}`}></button>
        </div>
      </div>

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
