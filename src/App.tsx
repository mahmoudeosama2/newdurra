import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Properties from './components/Properties';
import About from './components/About';
import Location from './components/Location';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-900">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Hero />
        <Features />
        <Properties />
        <About />
        <Location />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </div>
    </LanguageProvider>
  );
}

export default App;