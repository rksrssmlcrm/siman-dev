import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { MobileCtaBar } from '@/components/site/mobile-cta-bar'
import { Hero } from '@/components/sections/hero'
import { Mission } from '@/components/sections/mission'
import { Services } from '@/components/sections/services'
import { Works } from '@/components/sections/works'
import { Process } from '@/components/sections/process'
import { Pricing } from '@/components/sections/pricing'
import { Reviews } from '@/components/sections/reviews'
import { Faq } from '@/components/sections/faq'
import { Contact } from '@/components/sections/contact'

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Mission />
        <Services />
        <Works />
        <Process />
        <Pricing />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
