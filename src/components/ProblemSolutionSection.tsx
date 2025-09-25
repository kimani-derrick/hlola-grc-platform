export default function ProblemSolutionSection() {
  const problems = [
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
  ];

  return (
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((item, index) => (
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
  );
}
