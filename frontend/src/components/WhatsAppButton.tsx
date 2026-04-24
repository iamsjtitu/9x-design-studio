import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function WhatsAppButton() {
  const [show, setShow] = useState(false)
  const [tooltip, setTooltip] = useState(true)

  const phone = '917205930002' // +91 72059 30002
  const message = encodeURIComponent(
    "Hi 9x.design team! I'd like to discuss a project with you."
  )
  const href = `https://wa.me/${phone}?text=${message}`

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    onScroll()
    // Hide tooltip after 6 seconds
    const timer = setTimeout(() => setTooltip(false), 6000)
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 transition-all duration-500 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      data-testid="whatsapp-button-container"
    >
      {tooltip && show && (
        <div className="absolute bottom-16 right-0 bg-card border border-border/80 rounded-xl px-4 py-3 shadow-lg flex items-start gap-3 min-w-[220px] animate-fade-in-up">
          <button
            onClick={() => setTooltip(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Close tooltip"
            data-testid="whatsapp-tooltip-close"
          >
            <X size={13} />
          </button>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Need a quick quote?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Message us on WhatsApp — we reply in minutes.
            </p>
          </div>
          {/* Arrow */}
          <div
            className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-card border-r border-b border-border/80"
          />
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        data-testid="whatsapp-button"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        style={{ background: '#25D366' }}
      >
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ background: '#25D366' }}
        />
        <MessageCircle size={26} className="relative text-white" strokeWidth={2.2} />
      </a>
    </div>
  )
}
