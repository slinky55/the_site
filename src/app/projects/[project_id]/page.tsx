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

  useEffect(() => {
      const queryData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: params.project_id,
        }),
      }

      async function getProject() {
        try {
            const res = await fetch(`/api/projects/getproject`, queryData);

            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setProject(data.projects[0]);
        } catch (error) {
            setError('Failed to load data');
        } finally {
          setLoading(false);
        }
      }

      getProject();
    }, []); 

    useEffect(()=> {
      // Parse gallery
      console.log(project?.gallery);
      const urls = project?.gallery.slice(1, -1).split(',');
      setGallery(urls?.map(url => url.trim().slice(1, -1)));
    }, [project])

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
              <div className={styles.galleryContainer}>
                {gallery.map(img => (
                  <img 
                  key={img} 
                  src={img} 
                  alt="Gallery Image"
                  className={styles.galleryImg} />
                ))}
              </div>
            ) : (
              <span>Loading gallery...</span>
            )}

            </div>
          </div>
        ) :
        (
          <span>Project failed to load.</span>
        )
        }
      </div>
  );
};

export default ProjectPage;