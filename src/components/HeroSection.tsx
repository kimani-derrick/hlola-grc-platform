export default function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex items-center bg-hlola-gradient relative overflow-hidden pt-24 pb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#41c3d6] rounded-full mix-blend-normal filter blur-3xl opacity-30 float-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#26558e] rounded-full mix-blend-normal filter blur-3xl opacity-25 float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-[#41c3d6] rounded-full mix-blend-normal filter blur-2xl opacity-20 float-animation" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-20 right-20 w-60 h-60 bg-gradient-to-r from-[#41c3d6] to-[#26558e] rounded-full filter blur-2xl opacity-25 float-animation" style={{animationDelay: '1s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center hero-glow">
          <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 fade-in-up shadow-2xl max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-[#26558e] font-semibold">
              <span className="px-3 py-1 bg-white/70 rounded-full">GRC made joyful</span>
              <span className="flex items-center gap-1 text-yellow-500">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.04 3.19a1 1 0 00.95.69h3.356c.969 0 1.371 1.24.588 1.81l-2.715 1.97a1 1 0 00-.364 1.118l1.04 3.19c.3.922-.755 1.688-1.54 1.118l-2.716-1.97a1 1 0 00-1.176 0l-2.716 1.97c-.784.57-1.838-.196-1.539-1.118l1.04-3.19a1 1 0 00-.364-1.118l-2.715-1.97c-.783-.57-.38-1.81.588-1.81h3.356a1 1 0 00.95-.69l1.04-3.19z"/></svg>
                Rated 4.9/5 by compliance teams
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#26558e] mb-4 text-left leading-tight">
              Transform Compliance Into Your
              <span className="text-[#41c3d6] font-bold"> Competitive Advantage</span>
            </h1>
            <p className="text-base text-gray-600 mb-3 text-left">
              <span className="font-semibold text-[#26558e]">hlola:</span> to see, inspect, examine, investigate
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-6 font-medium text-left leading-relaxed">
              Tame regulations, automate evidence, and keep your team accountable inside one joyful workspace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a href="/onboarding" className="bg-[#26558e] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#1e4470] transition-all hover-lift">
                Getting Started
              </a>
              <button className="glass-button text-[#26558e] px-6 py-3 rounded-xl text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch 2-min demo
                </div>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, idx) => (
                  <span key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-[#26558e]/80" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-[#26558e] text-sm">12,000+ compliance leaders</p>
                <p className="text-xs text-gray-600">trust hlola across Africa</p>
              </div>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
              <div className="bg-gradient-to-br from-[#26558e] via-[#3a7dc2] to-[#41c3d6] rounded-2xl h-[380px] flex flex-col justify-between text-white p-6">
                <div className="flex items-center justify-between text-sm uppercase tracking-wide opacity-80">
                  <span>Live Compliance Snapshot</span>
                  <span>Secure</span>
                </div>
                <div>
                <h3 className="text-3xl font-bold mb-4">Overall Score: 89%</h3>
                <p className="text-xs text-white/80">AI assistance flags risks, recommends next actions, and keeps your board in the loop in real time.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/15 rounded-xl p-3">
                    <p className="uppercase text-xs text-white/60">Evidence tasks</p>
                    <p className="text-xl font-bold">42</p>
                    <p className="text-xs text-white/70">8 due this week</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-3">
                    <p className="uppercase text-xs text-white/60">Frameworks</p>
                    <p className="text-xl font-bold">GDPR</p>
                    <p className="text-xs text-white/70">POPIA, ISO 27001</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-3 col-span-2">
                    <p className="uppercase text-xs text-white/60">Automations running</p>
                    <p className="text-sm font-semibold">Vendor risk reminders, policy attestation, audit trails</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs uppercase tracking-wide opacity-75">
                  <span>Realtime • Web • Mobile</span>
                  <span>hlola platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}
