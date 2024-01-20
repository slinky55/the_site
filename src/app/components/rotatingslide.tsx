import React from 'react';
import styles from './nav.module.css';

export default function RotatingSlide() {
  return (
    <div className={styles.slideshow}>
      <div className={styles.slideContainer}>
        <div className={styles.slide}>
          <img src="https://img.freepik.com/free-photo/life-insurance-concept-with-paper-family_23-2149191410.jpg" width={"300px"} height={"300px"}  />
        </div>
        <div className={styles.slide}>
          <img src="https://images.everydayhealth.com/homepage/health-topics-2.jpg?sfvrsn=757370ae_2" width={"300px"}  height={"300px"} />
        </div>
        <div className={styles.slide}>
          <img src="https://ca.judsonu.edu/wp-content/uploads/2023/04/ShWqnigmaTOT-Health-insurance-clipart-1.jpg" width={"300px"}  height={"300px"} />
        </div>
        <div className={styles.slide}>
          <img src="https://img.freepik.com/free-photo/life-insurance-concept-with-paper-family_23-2149191410.jpg" width={"300px"} height={"300px"}  />
        </div>
        <div className={styles.slide}>
          <img src="https://images.everydayhealth.com/homepage/health-topics-2.jpg?sfvrsn=757370ae_2" width={"300px"}  height={"300px"} />
        </div>
        <div className={styles.slide}>
          <img src="https://ca.judsonu.edu/wp-content/uploads/2023/04/ShWqnigmaTOT-Health-insurance-clipart-1.jpg" width={"300px"}  height={"300px"} />
        </div>
      </div>
    </div>
  );
}
