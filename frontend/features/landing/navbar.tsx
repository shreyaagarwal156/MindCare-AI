'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'About', href: '/about' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Chat', href: '/chat' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glassmorphism py-3 shadow-md border-b border-border/20'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo with Spin Animation */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300 border border-primary/5 group-hover:border-primary/20 shadow-sm"
            >
              <Brain className="h-6.5 w-6.5" />
            </motion.div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-text via-primary to-accent bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              MindCare AI
            </span>
          </Link>

          {/* Desktop Nav Links with Hover Underline Indicator */}
          <nav className="hidden md:flex space-x-10 relative">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.href)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={`text-sm font-semibold relative py-2 transition-colors duration-250 select-none ${
                    isActive ? 'text-primary' : 'text-text/75 hover:text-text'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  
                  {/* Underline sliding hover effect */}
                  {hoveredPath === link.href && (
                    <motion.span
                      layoutId="navHoverUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/60 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Active Page Indicator */}
                  {isActive && !hoveredPath && (
                    <motion.span
                      layoutId="navActiveUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl text-text hover:bg-muted/15 transition-all border border-border/40 hover:scale-105 active:scale-95 shadow-sm bg-card/40"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-warning" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-secondary" />
              )}
            </button>

            {/* Premium CTA Button */}
            <Link
              href="/chat"
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white bg-primary rounded-2xl overflow-hidden group transition-all duration-300 hover:bg-primary-hover hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-primary/10"
            >
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Actions Menu */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-text hover:bg-muted/15 border border-border/40 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-text hover:bg-muted/15 transition-colors"
              aria-label="Open Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glassmorphism border-b border-border/40 overflow-hidden"
          >
            <div className="px-6 pt-3 pb-8 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors hover:bg-muted/10 ${
                    pathname === link.href ? 'text-primary bg-primary/5' : 'text-text/75'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-4">
                <Link
                  href="/chat"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-3 text-base font-semibold text-white bg-primary rounded-xl hover:bg-primary-hover shadow-md"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
