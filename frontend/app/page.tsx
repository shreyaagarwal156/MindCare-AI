import React from 'react';
import { Navbar } from '@/features/landing/navbar';
import { Hero } from '@/features/landing/hero';
import { Features } from '@/features/landing/features';
import { Timeline } from '@/features/landing/timeline';
import { Benefits } from '@/features/landing/benefits';
import { Testimonials } from '@/features/landing/testimonials';
import { FAQ } from '@/features/landing/faq';
import { CallToAction } from '@/features/landing/cta';
import { Footer } from '@/features/landing/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative bg-background">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Page Blocks */}
      <main className="flex-grow">
        <Hero />
        <Features />
        <Timeline />
        <Benefits />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
