import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { GrainOverlay, ScrollProgressLine } from './components/motion/MotionPrimitives';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CourseTicker } from './components/CourseTicker';
import { ManifestoSection } from './components/ManifestoSection';
import { PillarsSection } from './components/PillarsSection';
import { TelemetrySection } from './components/TelemetrySection';
import { PatronageSection } from './components/PatronageSection';
import { Footer } from './components/Footer';
import { InquiryModal } from './components/InquiryModal';

export function App() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgressLine />
      <GrainOverlay />
      <Navbar onApplyClick={() => setIsInquiryOpen(true)} />

      <main>
        <HeroSection onApplyClick={() => setIsInquiryOpen(true)} />
        <CourseTicker />
        <ManifestoSection />
        <PillarsSection />
        <TelemetrySection />
        <PatronageSection onApplyClick={() => setIsInquiryOpen(true)} />
      </main>

      <Footer />

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </MotionConfig>
  );
}

export default App;
