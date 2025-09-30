'use client';

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface NavigationProps {
  scrollY: number;
}

export default function Navigation({ scrollY }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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
              width={100}
              height={30}
              priority
              className="h-6 w-auto"
            />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#benefits" className="text-gray-700 hover:text-[#26558e] transition-colors">Benefits</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#26558e] transition-colors">How it works</a>
              <a href="#pricing" className="text-gray-700 hover:text-[#26558e] transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#26558e] transition-colors">Testimonials</a>
              <a href="#faq" className="text-gray-700 hover:text-[#26558e] transition-colors">FAQ</a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-[#26558e] transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-[#26558e] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-[#26558e] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-[#26558e] transition-colors text-sm">
                  Login
                </Link>
                <a href="#cta" className="bg-[#26558e] text-white px-4 py-1.5 rounded-lg hover:bg-[#1e4470] transition-colors text-sm">
                  Get Started
                </a>
              </>
            )}
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
              <a href="#benefits" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Benefits</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">How it works</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Pricing</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Testimonials</a>
              <a href="#faq" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">FAQ</a>
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Dashboard</Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-[#26558e]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2 text-gray-700 hover:text-[#26558e]">Login</Link>
                  <a href="#cta" className="w-full inline-flex justify-center bg-[#26558e] text-white px-3 py-2 rounded-lg mt-4">Get Started</a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
