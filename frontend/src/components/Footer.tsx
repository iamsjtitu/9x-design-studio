import { Twitter, Instagram, Facebook, ArrowUpRight } from 'lucide-react'

const socials = [
  { icon: Twitter, href: 'https://twitter.com/9xdesign', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/9x.design', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/9x.design', label: 'Facebook' },
]

const servicesLinks: { label: string; href: string }[] = [
  { label: 'Website Development', href: '#services' },
  { label: 'Software Development', href: '#services' },
  { label: 'Mobile App Development', href: '#services' },
  { label: 'UI/UX Design', href: '#services' },
]

const companyLinks: { label: string; href: string }[] = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const connectLinks: { label: string; href: string; external?: boolean }[] = [
  { label: 'sales@9x.design', href: 'mailto:sales@9x.design' },
  { label: '+91 72059 30002', href: 'tel:+917205930002' },
  { label: 'WhatsApp', href: 'https://wa.me/917205930002', external: true },
  { label: 'Book a Call', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/40" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center text-sm font-bold">
                9x
              </div>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
              >
                9x<span className="gradient-text">.</span>design
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              A full-service digital studio building websites, software, and mobile apps
              that help businesses grow 9x faster.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  data-testid={`social-${social.label.toLowerCase()}`}
                  className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-sm font-semibold mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {servicesLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-sm font-semibold mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4
              className="text-sm font-semibold mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Connect
            </h4>
            <ul className="flex flex-col gap-2.5">
              {connectLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 inline-flex items-center gap-1"
                    {...(item.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {item.label}
                    {item.external && <ArrowUpRight size={12} className="opacity-60" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} 9x.design. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
