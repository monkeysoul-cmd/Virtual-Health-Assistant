import { BackgroundMesh } from '@/components/layout/BackgroundMesh';
import { FloatingSideGutter } from '@/components/layout/FloatingSideGutter';
import { HeroSection } from '@/components/layout/HeroSection';
import { Footer } from '@/components/layout/Footer';
import { SymptomCheckerForm } from '@/components/features/symptom-checker';
import { DoctorDirectory } from '@/components/features/doctor-directory';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-slate-950">
      {/* Dynamic ambient background mesh & glowing orbs */}
      <BackgroundMesh />

      {/* Floating clinical equipment icons in side gutters */}
      <FloatingSideGutter />

      {/* Hero section */}
      <HeroSection />

      {/* Symptom Checker Section */}
      <section id="checker" className="relative w-full max-w-5xl mx-auto px-4 pb-12 z-10">
        <div className="animate-fade-in-up [animation-delay:80ms]">
          <SymptomCheckerForm />
        </div>
      </section>

      {/* Glowing divider */}
      <div className="w-full max-w-5xl mx-auto px-4 z-10">
        <div className="glow-divider" />
      </div>

      {/* Doctor Directory Section */}
      <section id="doctor-directory" className="relative w-full max-w-5xl mx-auto px-4 py-12 z-10">
        <div className="animate-fade-in-up [animation-delay:100ms]">
          <DoctorDirectory />
        </div>
      </section>

      {/* Clinical Disclaimer & Footer */}
      <Footer />
    </div>
  );
}
