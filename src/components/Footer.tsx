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
    <footer className="bg-[#26558e] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-12" />
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
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
        
        <div className="border-t border-blue-400 mt-8 pt-8 text-center text-blue-100 space-y-2 text-sm">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#status" className="hover:text-white transition-colors">Status</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>
          <p>&copy; {new Date().getFullYear()} hlola. Building trust across Africa and beyond.</p>
        </div>
      </div>
    </footer>
  );
}
