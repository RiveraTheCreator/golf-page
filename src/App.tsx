import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { GrainOverlay, ScrollProgressLine } from './components/motion/MotionPrimitives';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CourseTicker } from './components/CourseTicker';
import { ManifestoSection } from './components/ManifestoSection';
import { SignatureHoleStage } from './components/SignatureHoleStage';
import { CinemaReelSection } from './components/CinemaReelSection';
import { PillarsSection } from './components/PillarsSection';
import { TelemetrySection } from './components/TelemetrySection';
import { PatronageSection } from './components/PatronageSection';
import { Footer } from './components/Footer';
import { InquiryModal } from './components/InquiryModal';
import { EstateFilmModal } from './components/EstateFilmModal';

export function App() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [filmModalState, setFilmModalState] = useState<{
    open: boolean;
    chapter: number;
  }>({ open: false, chapter: 0 });

  const openFilm = (chapter = 0) => setFilmModalState({ open: true, chapter });

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgressLine />
      <GrainOverlay />
      <Navbar
        onApplyClick={() => setIsInquiryOpen(true)}
        onWatchFilmClick={() => openFilm(0)}
      />

      <main>
        <HeroSection
          onApplyClick={() => setIsInquiryOpen(true)}
          onWatchFilmClick={() => openFilm(0)}
        />
        <CourseTicker />
        <ManifestoSection />
        <SignatureHoleStage />
        <CinemaReelSection onExpandClick={(chapterIdx) => openFilm(chapterIdx)} />
        <PillarsSection />
        <TelemetrySection />
        <PatronageSection onApplyClick={() => setIsInquiryOpen(true)} />
      </main>

      <Footer />

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />

      <EstateFilmModal
        isOpen={filmModalState.open}
        initialChapter={filmModalState.chapter}
        onClose={() => setFilmModalState((s) => ({ ...s, open: false }))}
        onApplyClick={() => setIsInquiryOpen(true)}
      />
    </MotionConfig>
  );
}

export default App;
