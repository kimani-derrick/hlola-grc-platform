export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$99',
      cadence: '/month',
      description: 'For small teams getting their first compliance wins.',
      features: [
        'POPIA + GDPR starter templates',
        'Unlimited policy pages',
        'Email reminders for evidence'
      ],
      highlighted: false
    },
    {
      name: 'Growth',
      price: '$199',
      cadence: '/month',
      description: 'Scale your governance program with automation and analytics.',
      features: [
        'Everything in Starter',
        'Vendor risk workflows',
        'Board-ready dashboards',
        'Slack + Teams integrations'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      cadence: ' pricing',
      description: 'Tailored roll-outs for banks, telcos, and enterprises.',
      features: [
        'Dedicated compliance strategist',
        'Advanced SSO & SCIM',
        'Custom data residency',
        '24/7 premium support'
      ],
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#41c3d6] mb-4">Pricing · Why it helps</p>
          <h2 className="text-4xl font-bold text-[#26558e] mb-4">Choose the plan that keeps your auditors smiling</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent, flexible pricing designed for African businesses of every size. Cancel any time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 flex flex-col gap-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.highlighted
                  ? 'bg-white shadow-2xl ring-2 ring-[#41c3d6]/60'
                  : 'bg-white/95 backdrop-blur border border-white/60 shadow-lg'
              }`}
            >
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-[#41c3d6]">{plan.name}</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#26558e]">{plan.price}</span>
                  <span className="text-gray-500">{plan.cadence}</span>
                </div>
                <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 text-sm text-gray-700 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#41c3d6] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.296-7.293a1 1 0 011.408 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`inline-flex justify-center items-center px-6 py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlighted ? 'bg-[#26558e] text-white hover:bg-[#1e4470]' : 'bg-[#e2f3f9] text-[#26558e] hover:bg-[#c9e8f2]'
                }`}
              >
                {plan.highlighted ? 'Start 14-day trial' : 'Talk to sales'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
