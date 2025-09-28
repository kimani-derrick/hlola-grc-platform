const steps = [
  {
    title: 'Connect your sources',
    description: 'Plug in HRIS, ticketing, and cloud infrastructure in minutes with secure integrations.'
  },
  {
    title: 'Map controls & policies',
    description: 'Use built-in templates or import existing frameworks. Assign owners and deadlines instantly.'
  },
  {
    title: 'Automate reviews & evidence',
    description: 'Trigger workflows, collect attestations, and export audit-ready reports on demand.'
  }
];

export default function ProductShowcaseSection() {
  return (
    <section id="how-it-works" className="relative py-20 bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9ff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#41c3d6] mb-4">Implementation in days</p>
          <h2 className="text-4xl font-bold text-[#26558e] mb-4">How hlola works in three simple steps</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Guided onboarding gets your compliance operating system live fast so regulators, auditors, and customers see instant trust.
          </p>
        </div>
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="glass-card rounded-2xl p-6 text-left h-full bg-white/90 backdrop-blur border border-white shadow-xl"
            >
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-[#41c3d6]/15 text-[#26558e] text-lg font-bold mb-4">
                0{index + 1}
              </span>
              <h3 className="text-xl font-semibold text-[#26558e] mb-3">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
