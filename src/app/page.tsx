import styles from "page.module.css";
import Nav from "./components/nav";
import RotatingSlide from "./components/rotatingslide";

export default function Home() {
  return (
    <main>
      <Nav/>
      <RotatingSlide/>
      <div>HomePage</div>
    </main>
  )
}
