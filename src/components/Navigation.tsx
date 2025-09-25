'use client';

import Image from "next/image";
import { useState } from "react";

interface NavigationProps {
  scrollY: number;
}

export default function Navigation({ scrollY }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrollY > 50 ? 'glass-nav' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              src="/brand/Hlola Full Color.svg"
              alt="hlola"
              width={120}
              height={36}
              priority
              className="h-8 w-auto"
            />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#product" className="text-gray-700 hover:text-[#26558e] transition-colors">Product</a>
              <a href="#solutions" className="text-gray-700 hover:text-[#26558e] transition-colors">Solutions</a>
              <a href="#resources" className="text-gray-700 hover:text-[#26558e] transition-colors">Resources</a>
              <a href="#pricing" className="text-gray-700 hover:text-[#26558e] transition-colors">Pricing</a>
            </div>
          </div>

          <div className="hidden md:block">
            <button className="bg-[#26558e] text-white px-6 py-2 rounded-lg hover:bg-[#1e4470] transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass-button p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-card rounded-lg mt-2 p-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#product" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Product</a>
              <a href="#solutions" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Solutions</a>
              <a href="#resources" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Resources</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Pricing</a>
              <button className="w-full text-left bg-[#26558e] text-white px-3 py-2 rounded-lg mt-4">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
