import Image from "next/image";

export default function Footer() {
  const footerSections = {
    Product: [
      { name: "Privacy Suite", href: "#" },
      { name: "Risk Management", href: "#" },
      { name: "Integrations", href: "#" }
    ],
    Company: [
      { name: "About", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" }
    ],
    Resources: [
      { name: "Documentation", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Support", href: "#" }
    ]
  };

  return (
    <footer className="bg-[#26558e] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/brand/Hlola Full White.svg"
              alt="hlola"
              width={120}
              height={36}
              className="h-8 w-auto mb-4"
            />
            <p className="text-blue-100">
              Making compliance accessible, intuitive, and surprisingly fun for African businesses.
            </p>
          </div>
          
          {Object.entries(footerSections).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2 text-blue-100">
                {links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-blue-400 mt-8 pt-8 text-center text-blue-100">
          <p>&copy; 2025 hlola. Making compliance accessible across Africa and beyond.</p>
        </div>
      </div>
    </footer>
  );
}
