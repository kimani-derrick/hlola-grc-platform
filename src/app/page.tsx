'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-hlola-gradient relative overflow-hidden pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#41c3d6] rounded-full mix-blend-normal filter blur-3xl opacity-30 float-animation"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#26558e] rounded-full mix-blend-normal filter blur-3xl opacity-25 float-animation" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-[#41c3d6] rounded-full mix-blend-normal filter blur-2xl opacity-20 float-animation" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-20 right-20 w-60 h-60 bg-gradient-to-r from-[#41c3d6] to-[#26558e] rounded-full filter blur-2xl opacity-25 float-animation" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center hero-glow">
            <div className="glass-card rounded-3xl p-8 md:p-16 max-w-4xl mx-auto fade-in-up shadow-2xl">
              <h1 className="hero-title text-[#26558e] mb-6">
                Transform Compliance Into Your 
                <span className="text-[#41c3d6] font-bold"> Competitive Advantage</span>
              </h1>
              
              <p className="hero-subtitle text-gray-600 mb-4">
                <span className="font-semibold text-[#26558e]">hlola:</span> to see, inspect, examine, investigate
              </p>
              
              <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto font-medium">
                Make compliance accessible, intuitive, and surprisingly fun. 
                Transform complex governance into clear, actionable steps that grow your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-[#26558e] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#1e4470] transition-all hover-lift">
                  Start Your Free Trial
                </button>
                <button className="glass-button text-[#26558e] px-8 py-4 rounded-xl text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Demo
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white" id="solutions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#26558e] mb-4">
              From Compliance Chaos to Confident Control
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional compliance feels like navigating a maze. hlola transforms it into a clear, enjoyable journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                problem: "Complex Legal Jargon",
                solution: "Clear, Actionable Steps",
                icon: "📚",
                description: "Transform overwhelming regulations into bite-sized, achievable tasks"
              },
              {
                problem: "Manual Tracking",
                solution: "Automated Monitoring",
                icon: "⚡",
                description: "Real-time compliance tracking with intelligent alerts and insights"
              },
              {
                problem: "Expensive Consultants",
                solution: "Accessible Technology",
                icon: "💡",
                description: "Enterprise-level compliance for businesses of all sizes"
              }
            ].map((item, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 hover-lift">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-red-500 line-through mb-2 font-semibold">{item.problem}</div>
                <div className="text-[#26558e] text-xl font-bold mb-3">{item.solution}</div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-20 bg-hlola-gradient" id="product">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#26558e] mb-6">
                Meet hlola privacy suite
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                The most intuitive way to manage data privacy and compliance. 
                Built for the modern African business scaling globally.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Real-time compliance tracking",
                  "Automated privacy risk assessments", 
                  "Intelligent workflow automation",
                  "Actionable compliance insights",
                  "Seamless team collaboration"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[#41c3d6] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="bg-[#41c3d6] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#359bb0] transition-colors hover-lift">
                Explore Features
              </button>
            </div>
            
            <div className="glass-card rounded-2xl p-8 hover-lift">
              <div className="bg-gradient-to-br from-[#26558e] to-[#41c3d6] rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Dashboard Preview</h3>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span>Compliance Score</span>
                      <span className="text-2xl font-bold">94%</span>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="text-sm opacity-90">Recent Activity</div>
                    <div className="text-xs mt-1">✅ Data mapping completed</div>
                    <div className="text-xs">⚠️  Policy review due tomorrow</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-white/20 rounded p-2 text-center">
                      <div className="text-sm font-bold">12</div>
                      <div className="text-xs opacity-75">Active Policies</div>
                    </div>
                    <div className="bg-white/20 rounded p-2 text-center">
                      <div className="text-sm font-bold">3</div>
                      <div className="text-xs opacity-75">Pending Reviews</div>
                    </div>
                    <div className="bg-white/20 rounded p-2 text-center">
                      <div className="text-sm font-bold">0</div>
                      <div className="text-xs opacity-75">Violations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#26558e] mb-4">
              Why African Businesses Choose hlola
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built by Africans, for African businesses scaling globally. 
              Experience compliance that understands your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Accessible Design",
                description: "Transform complex compliance into simple, achievable steps everyone can follow"
              },
              {
                icon: "🎮",
                title: "Surprisingly Fun",
                description: "Gamified compliance with streaks, badges, and rewards that motivate your team"
              },
              {
                icon: "🌍",
                title: "African-Focused",
                description: "Regional insights and local expertise for businesses across the continent"
              },
              {
                icon: "🚀",
                title: "Scales With You",
                description: "From Lagos startup to global enterprise - hlola grows with your business"
              },
              {
                icon: "🤖",
                title: "AI-Powered",
                description: "Intelligent automation that learns and adapts to new regulations automatically"
              },
              {
                icon: "🔒",
                title: "Enterprise Security",
                description: "Bank-level security with SOC2 compliance and end-to-end encryption"
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 hover-lift">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#26558e] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-20 bg-hlola-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#26558e] mb-4">
              Trusted by 1000+ African Businesses
            </h2>
            <p className="text-xl text-gray-600">
              From startups in Accra to enterprises in Johannesburg
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass-card rounded-2xl p-8 text-center hover-lift">
              <div className="text-4xl font-bold text-[#26558e] mb-2">1000+</div>
              <div className="text-gray-600">African Businesses</div>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center hover-lift">
              <div className="text-4xl font-bold text-[#26558e] mb-2">99.9%</div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center hover-lift">
              <div className="text-4xl font-bold text-[#26558e] mb-2">24/7</div>
              <div className="text-gray-600">Expert Support</div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="glass-card px-6 py-3 rounded-lg">
              <div className="text-sm font-semibold text-[#26558e]">SOC 2 Certified</div>
            </div>
            <div className="glass-card px-6 py-3 rounded-lg">
              <div className="text-sm font-semibold text-[#26558e]">ISO 27001</div>
            </div>
            <div className="glass-card px-6 py-3 rounded-lg">
              <div className="text-sm font-semibold text-[#26558e]">GDPR Compliant</div>
            </div>
            <div className="glass-card px-6 py-3 rounded-lg">
              <div className="text-sm font-semibold text-[#26558e]">POPIA Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <h2 className="text-4xl font-bold text-[#26558e] mb-6">
              Ready to Transform Your Compliance Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 1000+ companies building trust through hlola. 
              Start your free trial today - no credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <input 
                type="email" 
                placeholder="Enter your work email"
                className="glass-input px-6 py-3 rounded-lg w-full sm:w-auto min-w-80 text-gray-700"
              />
              <button className="bg-[#26558e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e4470] transition-colors hover-lift whitespace-nowrap">
                Start Free Trial
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              ✓ Free 14-day trial ✓ No credit card required ✓ Setup in 5 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#26558e] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/brand/Hlola Full White.svg"
                alt="hlola"
                width={120}
                height={36}
                className="h-8 w-auto mb-4"
              />
              <p className="text-blue-100">
                Making compliance accessible, intuitive, and surprisingly fun for African businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Suite</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-400 mt-8 pt-8 text-center text-blue-100">
            <p>&copy; 2025 hlola. Making compliance accessible across Africa and beyond.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
