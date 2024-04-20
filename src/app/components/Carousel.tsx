"use client"

import { useState, useEffect } from "react"
import styles from '../page.module.css';
import { Div } from "../types/div";
import Image from "next/image";

export default function Carousel() {
  const [images, setImages] = useState<any[]>([]);
  const [divs, setDivs] = useState<Div[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false); // Flag to indicate transition state

  useEffect(()=>{
    const queryData = {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 'home',
          limit: 1000,
          offset: 0,
        })
    }
    async function getImgs() {
        try {
            const res = await fetch("/api/images/getimages", queryData);

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data.images)) {
                throw new Error('Unexpected data format');
            }

            setImages(data.images);
        } catch (error) {
            console.error(error);
        } 
    }
    async function getDivs() {
      try {
          const res = await fetch("/api/divs/getdivs", queryData);

          if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const data = await res.json();

          if (!Array.isArray(data.divs)) {
              throw new Error('Unexpected data format');
          }

          setDivs(data.divs);
      } catch (error) {
          console.error(error);
      } 
  }

    getImgs();
    getDivs();
  }, [])

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
      if (isTransitioning) return; // Prevent further action if transitioning
      
      const currentSlide = track.querySelector(`.${styles.currentSlide}`);
      const targetSlide = slides[targetIndex] as HTMLElement;
      const currentRect = rectNav.querySelector(`.${styles.currentSlide}`);
      const targetRect = rectangles[targetIndex] as HTMLElement;

      if (!currentSlide || !targetSlide || !currentRect || !targetRect) {
        return;
      }

      // Update current slide index
      setCurrentSlideIndex(targetIndex);

      // Update carousel indicators
      currentRect.classList.remove(styles.currentSlide);
      targetRect.classList.add(styles.currentSlide);

      // Set transitioning flag
      setIsTransitioning(true);

      // Perform slide transition
      track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
      currentSlide.classList.remove(styles.currentSlide);
      targetSlide.classList.add(styles.currentSlide);

      // Reset transitioning flag after transition
      setTimeout(() => setIsTransitioning(false), 300);
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

    prevButton.addEventListener('click', () => {
      if (!isTransitioning) {
        let prevIndex = currentSlideIndex - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        moveToSlide(prevIndex);
        updateRectangles(prevIndex);
      }
    });

    nextButton.addEventListener('click', () => {
      if (!isTransitioning) {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex === slides.length) nextIndex = 0;
        moveToSlide(nextIndex);
        updateRectangles(nextIndex);
      }
    });

    rectNav.addEventListener('click', (e) => {
      const targetIndex = rectangles.findIndex((rectangle, index) => {
        // Check if the clicked element matches the current rectangle or its child button
        return rectangle === e.target || rectangle.contains(e.target as HTMLElement);
      });

      if (targetIndex !== -1) {
        moveToSlide(targetIndex);
        updateRectangles(targetIndex);
      }
    });
  }, [currentSlideIndex, isTransitioning]);

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
      <div className={styles.carousel}>
          <div className={styles.carouselTrackContainer}>
          <ul className={styles.carouselTrack}>
            <li className={`${styles.carouselSlide} ${currentSlideIndex === 0 ? styles.currentSlide : ''}`}>
              {images && <Image className={styles.carouselImages} src={getItem('Slideshow1', true)?.url} alt="" width={1000} height={1000}/>}
            </li>
            <li className={`${styles.carouselSlide} ${currentSlideIndex === 1 ? styles.currentSlide : ''}`}>
              {images && <Image className={styles.carouselImages} src={getItem('Slideshow2', true)?.url} alt="" width={1000} height={1000}/>}
            </li>
            <li className={`${styles.carouselSlide} ${currentSlideIndex === 2 ? styles.currentSlide : ''}`}>
              {images && <Image className={styles.carouselImages} src={getItem('Slideshow3', true)?.url} alt="" width={1000} height={1000}/>}
            </li>
          </ul>
          </div>

          <div className={styles.carouselButtons}>
            <button className={`${styles.carouselButton} ${styles.carouselButtonLeft}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
          </button>
          <button className={`${styles.carouselButton} ${styles.carouselButtonRight}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </button>
          </div>

          <div className={styles.carouselNav}>
            <div><button className={`${styles.carouselIndicator} ${styles.carouselIndicatorLeft} ${currentSlideIndex === 0 && styles.currentSlide}`}></button></div>
            <div><button className={`${styles.carouselIndicator} ${styles.carouselIndicatorMiddle} ${currentSlideIndex === 1 && styles.currentSlide}`}></button></div>
            <div> <button className={`${styles.carouselIndicator} ${styles.carouselIndicatorRight} ${currentSlideIndex === 2 && styles.currentSlide}`}></button></div>
          </div>
        </div>
    )
}