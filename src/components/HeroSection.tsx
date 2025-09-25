export default function HeroSection() {
  return (
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
  );
}
