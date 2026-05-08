import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import { CTASection, Footer } from '@/components/landing/CTASection';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
