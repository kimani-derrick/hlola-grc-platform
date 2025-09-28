const testimonials = [
  {
    quote: "hlola trimmed our audit prep from eight weeks down to eight days. The team now treats compliance like a shared mission, not a chore.",
    name: "Amanda Ofori",
    role: "Chief Risk Officer, TymeBank",
    rating: 5
  },
  {
    quote: "From POPIA to GDPR, hlola keeps us aligned. Board packs now include live dashboards instead of manual spreadsheets.",
    name: "Nathan Moyo",
    role: "Data Privacy Lead, Interswitch",
    rating: 5
  },
  {
    quote: "The automation workflows alone paid for the platform in month one. Vendors actually complete questionnaires on time.",
    name: "Lerato Naidoo",
    role: "Compliance Manager, Safaricom",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#41c3d6] mb-4">Loved by people worldwide</p>
          <h2 className="text-4xl font-bold text-[#26558e] mb-4">Compliance teams who switched can’t stop smiling</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We partner with African innovators to turn governance into a competitive edge.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover-lift">
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: testimonial.rating }).map((_, idx) => (
                  <svg key={idx} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.04 3.19a1 1 0 00.95.69h3.356c.969 0 1.371 1.24.588 1.81l-2.715 1.97a1 1 0 00-.364 1.118l1.04 3.19c.3.922-.755 1.688-1.54 1.118l-2.716-1.97a1 1 0 00-1.176 0l-2.716 1.97c-.784.57-1.838-.196-1.539-1.118l1.04-3.19a1 1 0 00-.364-1.118l-2.715-1.97c-.783-.57-.38-1.81.588-1.81h3.356a1 1 0 00.95-.69l1.04-3.19z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">“{testimonial.quote}”</p>
              <div className="mt-auto">
                <p className="font-semibold text-[#26558e]">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
