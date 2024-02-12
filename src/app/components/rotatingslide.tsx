import React from 'react';
import styles from './nav.module.css';

export default function RotatingSlide() {
  return (
    <>
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
    <div id={styles.functionalBody}>
      <div id={styles.flexContentContainer}>
        <div className={styles.article}>
          <img className={styles.image} src="https://play-lh.googleusercontent.com/XKpIJApesGkiUv5uDoybpeq3-EAh53KYGRvxheJes7F0x0Qn_Bfqm7RI9jKoexo7UE8" />
          <p className={styles.paragraph}>
            <div className={styles.articleTitle}>Example Article Title Here</div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "1vh"}}>
              <div>John Doe</div>
              <div>1/11/2024</div>
            </div>
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
          </p>
        </div>
        <div className={styles.article}>
          <img className={styles.image} src="https://play-lh.googleusercontent.com/XKpIJApesGkiUv5uDoybpeq3-EAh53KYGRvxheJes7F0x0Qn_Bfqm7RI9jKoexo7UE8" />
          <p className={styles.paragraph}>
            <div className={styles.articleTitle}>Example Article Title Here</div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "1vh"}}>
              <div>John Doe</div>
              <div>1/11/2024</div>
            </div>
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
          </p>
        </div>
        <div className={styles.article}>
          <img className={styles.image} src="https://play-lh.googleusercontent.com/XKpIJApesGkiUv5uDoybpeq3-EAh53KYGRvxheJes7F0x0Qn_Bfqm7RI9jKoexo7UE8" />
          <p className={styles.paragraph}>
            <div className={styles.articleTitle}>Example Article Title Here</div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "1vh"}}>
              <div>John Doe</div>
              <div>1/11/2024</div>
            </div>
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
          </p>
        </div>
        <div className={styles.article}>
          <img className={styles.image} src="https://play-lh.googleusercontent.com/XKpIJApesGkiUv5uDoybpeq3-EAh53KYGRvxheJes7F0x0Qn_Bfqm7RI9jKoexo7UE8" />
          <p className={styles.paragraph}>
            <div className={styles.articleTitle}>Example Article Title Here</div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "1vh"}}>
              <div>John Doe</div>
              <div>1/11/2024</div>
            </div>
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
            This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph. This is a sample paragraph.
          </p>
        </div>
      </div>
    </div>
    </>
);
}
