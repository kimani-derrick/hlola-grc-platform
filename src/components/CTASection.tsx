export default function CTASection() {
  return (
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 w-full">
            <input 
              type="email" 
              placeholder="Enter your work email"
              className="glass-input px-6 py-3 rounded-lg w-full sm:w-auto sm:min-w-[20rem] text-gray-700"
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
  );
}
