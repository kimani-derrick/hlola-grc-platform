export default function FeaturesSection() {
  const features = [
    {
      icon: "🕹️",
      title: "Gamified onboarding",
      description: "Turn frameworks into streaks, badges, and collaborative missions that teams actually enjoy completing."
    },
    {
      icon: "📊",
      title: "Single source of truth",
      description: "All policies, controls, risk registers, and attestation evidence in one glassmorphism hub."
    },
    {
      icon: "🤝",
      title: "Vendor risk automation",
      description: "Proactively chase vendor SOC reports, DPIAs, and questionnaires with automated reminders."
    },
    {
      icon: "⚙️",
      title: "African-first templates",
      description: "POPIA, NDPA, and GDPR templates tailored to African markets and regulators."
    },
    {
      icon: "💬",
      title: "Board-ready insights",
      description: "Executive dashboards translate operational effort into business-friendly language."
    },
    {
      icon: "🔐",
      title: "Enterprise-grade security",
      description: "Granular permissions, encryption in transit and at rest, and full audit trails."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#41c3d6] mb-4">Why hlola wins</p>
          <h2 className="text-4xl font-bold text-[#26558e] mb-4">Give every compliance champion superpowers</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            hlola combines behavioural design with automation so your organisation moves from reactive compliance to proactive trust-building.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 hover-lift">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#26558e] mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
