export default function TrustSection() {
  const partners = [
    'Flutterwave',
    'Safaricom',
    'Nigerian Breweries',
    'TymeBank',
    'Interswitch',
    'UBA',
    'MFS Africa',
    'Sterling Bank'
  ];

  return (
    <section id="partners" className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#41c3d6] mb-6">Trusted by compliance teams</p>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {partners.map((partner) => (
            <span key={partner} className="text-sm sm:text-base text-gray-500 uppercase tracking-wide">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
