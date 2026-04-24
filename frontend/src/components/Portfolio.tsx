import { useEffect, useState } from 'react'
import { ArrowUpRight, X, TrendingUp, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

const projects = [
  {
    title: 'Rice Mill Management Software',
    category: 'SaaS Platform',
    description:
      'End-to-end Rice Mill management platform for 100+ rice mills across India — real-time heartbeats, WhatsApp alerts, online access, live weighbridge integration & many more.',
    image: '/projects/mill-main.jpg',
    gallery: [
      { src: '/projects/mill-main.jpg', caption: 'Mill entries · daily operations dashboard' },
      { src: '/projects/mill-weighbridge.jpg', caption: 'Live weighbridge + camera feeds — zero manual entry' },
      { src: '/projects/mill-license.jpg', caption: 'Cloud-issued license with remote access credentials' },
    ],
    tags: ['Node.js', 'Cloudflare Tunnels', 'WhatsApp API'],
    color: 'hsl(16 100% 50%)',
    client: 'MillEntry · Internal Product',
    duration: 'Ongoing · 8+ months',
    challenge:
      'Rice mill owners across India needed a unified system to replace scattered spreadsheets, manual billing, and disconnected weighbridge readings — plus a way for the owner to access their plant from anywhere without exposing the mill PC to the internet.',
    solution:
      'Built a full-stack platform: a Windows desktop app for on-site staff, a cloud command center for head office, live heartbeat monitoring, auto-provisioned per-customer Cloudflare Tunnels for secure remote access, weighbridge serial integration, and 360Messenger-powered WhatsApp alerts for licenses, renewals, and suspensions.',
    results: [
      { label: 'Active mills', value: '100+', sub: 'live across India' },
      { label: 'Heartbeat uptime', value: '99.9%', sub: 'observed SLA' },
      { label: 'Manual work cut', value: '~12hr', sub: 'per mill / week' },
    ],
    link: 'https://mill.9x.design',
  },
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description:
      'A full-featured online store with 10K+ products, custom CMS, and integrated payment gateway.',
    image:
      'https://images.unsplash.com/photo-1555209183-8facf96a4349?w=1200&auto=format&fit=crop&q=80',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    color: 'hsl(16 100% 50%)',
    client: 'KartZone',
    duration: '12 weeks',
    challenge:
      'The client needed to migrate from a legacy platform that could not handle flash sales. Page loads averaged 6+ seconds and checkouts failed during traffic spikes.',
    solution:
      'Rebuilt on a modern React + Node.js stack with a dedicated PostgreSQL cluster, a CDN-backed image pipeline, and a queued order system. Added a custom admin CMS for the merchandising team.',
    results: [
      { label: 'Page speed', value: '1.4s', sub: '↓ 76% faster' },
      { label: 'Conversion rate', value: '+41%', sub: 'vs legacy' },
      { label: 'Checkout success', value: '99.8%', sub: 'at peak' },
    ],
  },
  {
    title: 'Healthcare SaaS',
    category: 'Software Development',
    description:
      'Patient management system for clinics — appointments, records, billing, and analytics.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    tags: ['Next.js', 'TypeScript', 'AWS'],
    color: 'hsl(38 95% 55%)',
    client: 'HealthBridge',
    duration: '5 months',
    challenge:
      'Multi-location clinic needed a HIPAA-ready platform to unify patient records, scheduling and billing across 12 branches — replacing four disconnected tools.',
    solution:
      'Built a secure multi-tenant SaaS on Next.js + AWS (RDS, S3, Cognito) with role-based access, audit logs, and a real-time analytics dashboard for clinic admins.',
    results: [
      { label: 'Active users', value: '5,000+', sub: 'daily' },
      { label: 'Admin time saved', value: '12 hrs', sub: 'per week' },
      { label: 'Patient NPS', value: '+62', sub: 'post-launch' },
    ],
  },
  {
    title: 'Food Delivery App',
    category: 'Mobile App',
    description:
      'iOS & Android app with real-time tracking, restaurant discovery, and seamless UX.',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80',
    tags: ['React Native', 'Firebase', 'Maps API'],
    color: 'hsl(200 80% 55%)',
    client: 'FoodFleet',
    duration: '4 months',
    challenge:
      'A D2C cloud kitchen brand wanted to move from a web-only ordering experience to native apps — with real-time order tracking and restaurant discovery across 3 cities.',
    solution:
      'Delivered a React Native app for iOS + Android with Firebase for auth, FCM push, Firestore-backed live order updates, and Google Maps directions baked in.',
    results: [
      { label: 'App Store rating', value: '4.9★', sub: 'iOS + Android' },
      { label: 'Repeat orders', value: '+58%', sub: 'vs web' },
      { label: 'Tracking CSAT', value: '94%', sub: 'users happy' },
    ],
  },
  {
    title: 'Real Estate Portal',
    category: 'Web Development',
    description:
      'Property listing platform with AI-powered search, virtual tours, and lead management.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80',
    tags: ['Vue.js', 'Python', 'AI/ML'],
    color: 'hsl(16 100% 50%)',
    client: 'Nexus Realty',
    duration: '3 months',
    challenge:
      'Broker network wanted to move beyond spreadsheets — they needed a searchable portal with virtual tours and a lead CRM their agents could actually use.',
    solution:
      'Built a Vue 3 portal with a Python/FastAPI backend, vector-based semantic search for property matching, 360° virtual tours, and a lightweight agent CRM.',
    results: [
      { label: 'Qualified leads', value: '3.2x', sub: 'per month' },
      { label: 'Time on site', value: '+120%', sub: 'after launch' },
      { label: 'Agent adoption', value: '92%', sub: 'in 30 days' },
    ],
  },
  {
    title: 'FinTech Dashboard',
    category: 'Software Development',
    description:
      'Financial analytics platform for investment portfolios with real-time market data.',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    tags: ['React', 'D3.js', 'WebSocket'],
    color: 'hsl(38 95% 55%)',
    client: 'FinForge',
    duration: '6 months',
    challenge:
      'Wealth management firm was paying for three separate tools to track portfolios, risk, and market moves — and still exporting to Excel to build client reports.',
    solution:
      'Single-pane dashboard using React + D3 with real-time WebSocket feeds, automated risk scoring, and one-click PDF client reports. Integrated with 5 broker APIs.',
    results: [
      { label: 'Data latency', value: '<200ms', sub: 'live feeds' },
      { label: 'Reports per week', value: '5x', sub: 'throughput' },
      { label: 'Tool consolidation', value: '3→1', sub: 'stack' },
    ],
  },
  {
    title: 'Fitness Tracker App',
    category: 'Mobile App',
    description:
      'Cross-platform fitness app with workout plans, nutrition tracking, and progress analytics.',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
    tags: ['Flutter', 'Dart', 'Health APIs'],
    color: 'hsl(200 80% 55%)',
    client: 'PulseFit',
    duration: '4 months',
    challenge:
      'A fitness coach wanted to scale her 1:1 practice into a mobile experience — workout plans, habit tracking, and a private community in one app.',
    solution:
      'Flutter app for iOS + Android with Apple Health / Google Fit integration, personalised workout plans, nutrition logging, and a gated community feed.',
    results: [
      { label: 'Paid subscribers', value: '8,500+', sub: 'in 6 months' },
      { label: 'Day-30 retention', value: '64%', sub: 'industry avg 40%' },
      { label: 'User rating', value: '4.8★', sub: 'both stores' },
    ],
  },
]

type Project = (typeof projects)[number]

type GalleryItem = { src: string; caption?: string }

export default function Portfolio() {
  const [active, setActive] = useState<Project | null>(null)
  const [slide, setSlide] = useState(0)

  // Normalize gallery: use project.gallery if present, else fall back to single image
  const gallery: GalleryItem[] = active
    ? 'gallery' in active && Array.isArray((active as any).gallery)
      ? (active as any).gallery
      : [{ src: active.image }]
    : []

  const next = () => setSlide((s) => (s + 1) % gallery.length)
  const prev = () => setSlide((s) => (s - 1 + gallery.length) % gallery.length)

  useEffect(() => {
    if (!active) return
    setSlide(0)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <section id="work" className="py-24" data-testid="portfolio-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 reveal">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
              Our Work
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold leading-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
            >
              Projects That
              <br />
              <span className="gradient-text">Define Results</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm shrink-0"
            data-testid="portfolio-view-all"
          >
            See All Projects
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(project)}
              className="service-card rounded-2xl overflow-hidden reveal group cursor-pointer text-left"
              style={{ animationDelay: `${i * 0.08}s` }}
              data-testid={`portfolio-card-${i}`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <div
                  className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${project.color}20`,
                    color: project.color,
                    border: `1px solid ${project.color}30`,
                  }}
                >
                  {project.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3
                    className="text-lg font-bold leading-tight"
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                  />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span
                    className="text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    style={{ color: project.color }}
                  >
                    View case study
                    <ArrowUpRight size={13} />
                  </span>
                  <span className="text-[11px] text-muted-foreground">{project.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActive(null)}
          data-testid="portfolio-modal"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-card rounded-3xl border border-border shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              data-testid="portfolio-modal-close"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center hover:bg-background transition-colors"
            >
              <X size={18} />
            </button>

            {/* Hero gallery */}
            <div className="relative h-56 sm:h-80 overflow-hidden bg-black/40 group/hero">
              {gallery.map((g, i) => (
                <img
                  key={i}
                  src={g.src}
                  alt={`${active.title} — screen ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  style={{ opacity: i === slide ? 1 : 0 }}
                  data-testid={`portfolio-gallery-slide-${i}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent pointer-events-none" />

              {/* Arrows (only if more than 1 image) */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    data-testid="portfolio-gallery-prev"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border/60 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-background"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    data-testid="portfolio-gallery-next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border/60 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-background"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Slide indicator */}
                  <div className="absolute top-4 left-4 text-[11px] font-mono font-semibold px-2 py-1 rounded-md bg-background/80 backdrop-blur border border-border/60">
                    {slide + 1} / {gallery.length}
                  </div>
                </>
              )}

              <div className="absolute bottom-4 left-6 right-6">
                <div
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                  style={{
                    background: `${active.color}20`,
                    color: active.color,
                    border: `1px solid ${active.color}40`,
                  }}
                >
                  {active.category}
                </div>
                <h3
                  className="text-3xl sm:text-4xl font-bold"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {active.title}
                </h3>
              </div>
            </div>

            {/* Thumbnail strip + caption */}
            {gallery.length > 1 && (
              <div className="px-6 sm:px-8 pt-5 pb-1">
                {gallery[slide]?.caption && (
                  <p className="text-xs text-muted-foreground mb-3 text-center italic">
                    {gallery[slide].caption}
                  </p>
                )}
                <div className="flex gap-2 justify-center flex-wrap">
                  {gallery.map((g, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlide(i)}
                      data-testid={`portfolio-gallery-thumb-${i}`}
                      aria-label={`Go to image ${i + 1}`}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === slide
                          ? 'border-primary opacity-100 scale-105'
                          : 'border-border/60 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <img
                        src={g.src}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* Meta row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-6 mb-6 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-widest mb-1">
                    <Users size={12} /> Client
                  </div>
                  <div className="text-sm font-semibold">{active.client}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-widest mb-1">
                    <Clock size={12} /> Duration
                  </div>
                  <div className="text-sm font-semibold">{active.duration}</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-widest mb-1">
                    <TrendingUp size={12} /> Stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {active.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-full border border-border/60 text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Challenge & Solution */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    The Challenge
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {active.challenge}
                  </p>
                </div>
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: active.color }}
                  >
                    Our Solution
                  </div>
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {active.solution}
                  </p>
                </div>
              </div>

              {/* Results */}
              <div
                className="rounded-2xl p-5 sm:p-6 mb-6"
                style={{
                  background: `${active.color}08`,
                  border: `1px solid ${active.color}20`,
                }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: active.color }}
                >
                  Measurable Results
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {active.results.map((r) => (
                    <div key={r.label}>
                      <div
                        className="text-2xl sm:text-3xl font-black leading-none"
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          letterSpacing: '-0.03em',
                          color: active.color,
                        }}
                      >
                        {r.value}
                      </div>
                      <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-2">
                        {r.label}
                      </div>
                      <div className="text-xs text-foreground/70 mt-0.5">{r.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {active.link && (
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex-1 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2"
                    data-testid="portfolio-modal-visit"
                  >
                    Visit Live Site
                    <ArrowUpRight size={16} />
                  </a>
                )}
                <a
                  href="#contact"
                  onClick={() => setActive(null)}
                  className="btn-primary flex-1 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2"
                  data-testid="portfolio-modal-cta"
                >
                  Start a similar project
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
