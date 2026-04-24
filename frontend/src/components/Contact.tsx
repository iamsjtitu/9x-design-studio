import { ArrowRight, Mail, Phone, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { submitContact } from '../lib/api'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'sales@9x.design', href: 'mailto:sales@9x.design' },
  { icon: Phone, label: 'Phone', value: '+91 72059 30002', href: 'tel:+917205930002' },
  { icon: MapPin, label: 'Location', value: 'India (Serving Worldwide)', href: null },
]

const budgetOptions = [
  { value: '', label: 'Select budget (optional)' },
  { value: '<50k', label: 'Less than ₹50,000' },
  { value: '50k-2L', label: '₹50,000 – ₹2,00,000' },
  { value: '2L-10L', label: '₹2,00,000 – ₹10,00,000' },
  { value: '10L+', label: '₹10,00,000+' },
  { value: 'unsure', label: 'Not sure yet' },
]

type FormState = {
  name: string
  email: string
  service: string
  message: string
  company: string
  budget: string
}

const initial: FormState = {
  name: '',
  email: '',
  service: '',
  message: '',
  company: '',
  budget: '',
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initial)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    // Minimal client-side validation
    if (form.name.trim().length < 2) {
      setError('Please enter your name')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (form.message.trim().length < 5) {
      setError('Tell us a bit more about your project (min 5 characters)')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        service: form.service || 'other',
        message: form.message.trim(),
        company: form.company.trim() || undefined,
        budget: form.budget || undefined,
      })
      setSent(true)
      toast.success("Thanks! We'll be in touch within 24 hours.")
    } catch (err: any) {
      let msg = 'Something went wrong. Please try again.'
      const detail = err?.response?.data?.detail
      if (typeof detail === 'string') {
        msg = detail
      } else if (Array.isArray(detail) && detail.length > 0) {
        // FastAPI 422 validation errors → format first issue for the user
        const first = detail[0]
        const field = Array.isArray(first?.loc) ? first.loc.slice(-1)[0] : 'field'
        msg = `${String(field).replace(/_/g, ' ')}: ${first?.msg || 'invalid value'}`
      } else if (err?.message) {
        msg = err.message
      }
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm(initial)
    setSent(false)
    setError(null)
  }

  return (
    <section id="contact" className="py-24" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* CTA Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-20 reveal">
          <div
            className="absolute inset-0"
            style={{ background: 'var(--gradient-primary)' }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10 text-center py-16 px-8">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.04em' }}
            >
              Ready to Build
              <br />
              Something Amazing?
            </h2>
            <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
              Let's turn your idea into a powerful digital product.
              Book a free discovery call today — no strings attached.
            </p>
            <a
              href="mailto:sales@9x.design"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-base hover:bg-white/90 transition-all hover:scale-105 hover:shadow-lg"
              data-testid="book-call-btn"
            >
              Book a Free Call
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Contact form + info */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
              Get In Touch
            </div>
            <h2
              className="text-4xl font-bold mb-5"
              style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.03em' }}
            >
              Start Your
              <br />
              <span className="gradient-text">Project Today</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-10">
              Tell us about your project and we'll get back to you within 24 hours
              with a tailored proposal.
            </p>

            <div className="flex flex-col gap-5">
              {contactInfo.map((item) => {
                const content = (
                  <>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'hsl(var(--primary) / 0.1)',
                        border: '1px solid hsl(var(--primary) / 0.2)',
                      }}
                    >
                      <item.icon size={18} style={{ color: 'hsl(var(--primary))' }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  </>
                )
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                    data-testid={`contact-${item.label.toLowerCase()}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="flex items-center gap-4">
                    {content}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right — Form */}
          <div className="service-card rounded-2xl p-8 reveal" data-testid="contact-form-card">
            {sent ? (
              <div className="text-center py-12" data-testid="contact-form-success">
                <div className="w-16 h-16 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Message Sent!
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Thanks {form.name || 'there'} — we'll get back to you within 24 hours at{' '}
                  <span className="text-foreground font-medium">{form.email}</span>.
                </p>
                <button
                  onClick={resetForm}
                  className="text-sm font-semibold text-primary hover:underline"
                  data-testid="send-another-btn"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" data-testid="contact-form">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      disabled={loading}
                      className="w-full bg-secondary border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      disabled={loading}
                      className="w-full bg-secondary border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Service Needed
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => update('service', e.target.value)}
                      disabled={loading}
                      className="w-full bg-secondary border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
                      data-testid="contact-service-select"
                    >
                      <option value="">Select a service</option>
                      <option value="web">Website Development</option>
                      <option value="software">Software Development</option>
                      <option value="mobile">Mobile App Development</option>
                      <option value="uiux">UI/UX Design</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Budget Range
                    </label>
                    <select
                      value={form.budget}
                      onChange={(e) => update('budget', e.target.value)}
                      disabled={loading}
                      className="w-full bg-secondary border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
                      data-testid="contact-budget-select"
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    disabled={loading}
                    className="w-full bg-secondary border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-60"
                    data-testid="contact-company-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Project Details
                  </label>
                  <textarea
                    required
                    minLength={5}
                    rows={4}
                    placeholder="Tell us about your project, goals, and timeline..."
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    disabled={loading}
                    className="w-full bg-secondary border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none disabled:opacity-60"
                    data-testid="contact-message-input"
                  />
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive"
                    data-testid="contact-form-error"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  data-testid="contact-submit-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-muted-foreground text-center">
                  By submitting, you agree to be contacted by 9x.design at the email above.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
