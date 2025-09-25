export default function TrustSection() {
  const stats = [
    { value: "1000+", label: "African Businesses" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "24/7", label: "Expert Support" }
  ];

  const badges = [
    "SOC 2 Certified",
    "ISO 27001",
    "GDPR Compliant",
    "POPIA Ready"
  ];

  return (
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
          {stats.map((stat, index) => (
            <div key={index} className="glass-card rounded-2xl p-8 text-center hover-lift">
              <div className="text-4xl font-bold text-[#26558e] mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {badges.map((badge, index) => (
            <div key={index} className="glass-card px-6 py-3 rounded-lg">
              <div className="text-sm font-semibold text-[#26558e]">{badge}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
