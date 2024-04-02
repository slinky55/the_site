'use client'
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Project } from '@/app/types/project';

export default function Page() {
  const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch("/api/projects/getprojects");

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.projects)) {
                    throw new Error('Unexpected data format');
                }

                setProjects(data.projects);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, []);
    return (
      <>
      <div className={styles.header}>Manage Projects</div>
          <hr/>
      <div className={styles.container}> 
      {projects ? (
        projects.map((project) => (
          <div className={styles.subContainer}>
            <img className={styles.thumbnail} src={project.primary_image_src}/>
            <div className={styles.title}>
              {project.title}
            </div>
            <div className={styles.lead}>
              {project.project_lead}
            </div>
            <button className={styles.btn}>
              View More
            </button>
        </div>
      ))) : (
        <span>No existing projects.</span>
      )} 
      </div>
      </>
    )
  }