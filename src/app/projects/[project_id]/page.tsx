'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Project } from '@/app/types/project';

interface ProjectPageProps {
  params: {
    project_id: string;
  };
}

const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[] | undefined>(undefined);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: { key: string; }) => {
        if (currentImage !== null) {
            if (event.key === 'ArrowRight') {
                nextImage();
            } else if (event.key === 'ArrowLeft') {
                prevImage();
            }
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
}, [currentImage]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/projects/getproject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: params.project_id,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setProject(data.projects[0]);
        setLoading(false);
      } catch (error) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [params.project_id]);

  useEffect(() => {
    if (project?.gallery) {
      const urls = project.gallery.slice(1, -1).split(',');
      setGallery(urls.map(url => url.trim().slice(1, -1)));
    }
  }, [project]);
  
  const openFullImg = (pic: string, index: number) => {
    const fullImgBox = document.querySelector(`.${styles.fullImgBox}`) as HTMLElement;
    const fullImg = document.querySelector(`.${styles.fullImg}`) as HTMLImageElement;;
    if (fullImgBox && fullImg) {
      fullImgBox.style.display = "flex";
      setCurrentImage(pic);
      setCurrentImageIndex(index);
      document.body.style.overflow = 'hidden';
    }
  };

  const nextImage = () => {
    if (gallery && currentImageIndex !== null) {
      const nextIndex = currentImageIndex === gallery.length - 1 ? 0 : currentImageIndex + 1;
      setCurrentImage(gallery[nextIndex]);
      setCurrentImageIndex(nextIndex);
    }
  };
  
  const prevImage = () => {
    if (gallery && currentImageIndex !== null) {
      const prevIndex = currentImageIndex === 0 ? gallery.length - 1 : currentImageIndex - 1;
      setCurrentImage(gallery[prevIndex]);
      setCurrentImageIndex(prevIndex);
    }
  };

  const closeFullImg = () => {
    const fullImgBox = document.querySelector(`.${styles.fullImgBox}`) as HTMLElement;;
    if (fullImgBox) {
      fullImgBox.style.display = "none";
      setCurrentImage(null);
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : project ? (
        <div className={styles.container}>
          <div className={styles.projectHeader}>
            <div className={styles.title}>{project.title}</div>
          </div>
          <div className={styles.projectBody}>
            <div className={styles.content}>{project.content}</div>
          </div>
          <div>
            {gallery ? (
              <>
                <div className={`${styles.fullImgContainer} ${styles.fullImgBox}`}>
                  <img src={currentImage!} className={styles.fullImg} />
                  <span className={styles.closeButton} onClick={() => closeFullImg()}>X</span>
                  <button className={styles.prevButton} onClick={prevImage}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><path d="M14.383 7.076a1 1 0 0 0-1.09.217l-4 4a1 1 0 0 0 0 1.414l4 4A1 1 0 0 0 15 16V8a1 1 0 0 0-.617-.924zM13 13.586 11.414 12 13 10.414z" style={{fill:'white'}} data-name="Left"/></svg></button>
                  <button className={styles.nextButton} onClick={nextImage}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><path d="m14.707 11.293-4-4A1 1 0 0 0 9 8v8a1 1 0 0 0 1.707.707l4-4a1 1 0 0 0 0-1.414zM11 13.586v-3.172L12.586 12z" style={{fill:'white'}} data-name="Right"/></svg></button>
                </div>
                <div className={styles.galleryContainer}>
                  {gallery.map((img, index) => (
                    <img
                      key={img}
                      src={img}
                      alt="Gallery Image"
                      className={styles.galleryImg}
                      onClick={() => openFullImg(img, index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <span>Loading gallery...</span>
            )}
          </div>
        </div>
      ) : (
        <span>Project failed to load.</span>
      )}
    </div>
  );
};

export default ProjectPage;
