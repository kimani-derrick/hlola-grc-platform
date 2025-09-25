export default function FeaturesSection() {
  const features = [
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
  ];

  return (
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
