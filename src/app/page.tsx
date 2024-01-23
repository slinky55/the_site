import { Header } from '@/app/components/Header'
import backgroundImage from '@/images/background-root.jpg'
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Header/>
        <Image
            className="absolute inset-0 h-full w-full object-cover"
            src={backgroundImage}
            alt=""
        />
    </main>
  )
}