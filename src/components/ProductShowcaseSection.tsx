export default function ProductShowcaseSection() {
  const features = [
    "Real-time compliance tracking",
    "Automated privacy risk assessments", 
    "Intelligent workflow automation",
    "Actionable compliance insights",
    "Seamless team collaboration"
  ];

  return (
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
              {features.map((feature, index) => (
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
  );
}
