const benefits = [
  {
    title: 'Automated evidence collection',
    description: 'Link policies, controls, and tasks so audits are ready in hours — not months.',
    outcome: 'Save 30+ hours every audit cycle'
  },
  {
    title: 'AI guidance for African regulations',
    description: 'POPIA, NDPA, and GDPR mapped into clear readiness checklists for each business unit.',
    outcome: 'Launch compliant processes in days'
  },
  {
    title: 'All teams aligned in one workspace',
    description: 'Track vendor risks, policy attestation, and incident response on a shared timeline.',
    outcome: 'Zero missed renewals or escalations'
  }
];

export default function ProblemSolutionSection() {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#41c3d6] mb-4">Why leaders switch to hlola</p>
          <h2 className="text-4xl font-bold text-[#26558e] mb-4">
            Build trust faster by focusing on tangible outcomes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We translate complex privacy frameworks into an enjoyable experience for your team and a trustworthy signal for your customers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover-lift">
              <span className="inline-flex items-center px-3 py-1 bg-[#41c3d6]/10 text-[#26558e] text-xs font-semibold rounded-full w-max uppercase tracking-wide">
                Result
              </span>
              <h3 className="text-xl font-bold text-[#26558e]">{benefit.title}</h3>
              <p className="text-gray-600 flex-1">{benefit.description}</p>
              <div className="text-sm font-semibold text-[#41c3d6] flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.296-7.293a1 1 0 011.408 0z" clipRule="evenodd" />
                </svg>
                {benefit.outcome}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
