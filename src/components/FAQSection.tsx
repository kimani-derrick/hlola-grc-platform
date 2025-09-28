import { useState } from 'react';

const faqs = [
  {
    question: 'How long does it take to implement hlola?',
    answer: 'Most teams launch in under two weeks with our concierge onboarding. We import your existing controls, map them to our templates, and train your champions.'
  },
  {
    question: 'Can hlola work for multiple frameworks?',
    answer: 'Yes. POPIA, GDPR, NDPA, ISO 27001, SOC 2, and custom frameworks can run side by side with shared evidence and automation.'
  },
  {
    question: 'Do you support enterprise security requirements?',
    answer: 'Absolutely. hlola offers SSO/SCIM, granular permissions, audit logs, data residency options, and encryption in transit and at rest.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Every plan includes a 14-day full-featured trial. No credit card required. Cancel anytime.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#41c3d6]/30 to-transparent mb-12" />
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#41c3d6] mb-4">Frequently Asked Questions</p>
          <h2 className="text-4xl font-bold text-[#26558e] mb-4">Answers before your auditors even ask</h2>
          <p className="text-lg text-gray-600">
            Still curious? Chat with us and we’ll show you exactly how hlola fits your governance program.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="glass-card rounded-2xl p-4">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left text-[#26558e] font-semibold"
                >
                  {faq.question}
                  <span className="text-2xl">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
