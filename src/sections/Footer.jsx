import { INK, MUTED, BRONZE, SAND } from '../theme.js'
import Hoverable from '../components/Hoverable.jsx'
import useReveal from '../components/useReveal.js'

const COLUMNS = [
  {
    title: 'Programs',
    links: [
      { label: 'Strength', href: '#programs' },
      { label: 'Fat Loss', href: '#programs' },
      { label: 'Mobility & Yoga', href: '#programs' },
      { label: 'Home', href: '#programs' },
    ],
  },
  {
    title: 'Club',
    links: [
      { label: 'The method', href: '#method' },
      { label: 'Stories', href: '#stories' },
      { label: 'Belief', href: '#belief' },
      { label: 'Join', href: '#join' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/1percentlifeclub', external: true },
      { label: 'YouTube', href: 'https://youtube.com/@1percentlifeclub', external: true },
      { label: 'Newsletter', href: '#join' },
      { label: 'Contact', href: 'mailto:members@1percentlifeclub.com' },
    ],
  },
]

const footerLink = {
  fontSize: '14px',
  color: SAND,
  textDecoration: 'none',
  transition: 'color .3s',
}

export default function Footer() {
  const { ref, reveal } = useReveal()

  return (
    <footer style={{ background: INK, color: '#fff', padding: 'clamp(56px,6vw,92px) clamp(20px,5vw,64px) clamp(32px,4vw,48px)' }}>
      <div ref={ref} style={{ maxWidth: '1340px', margin: '0 auto', ...reveal(0, 'translateY(22px)') }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(180px,100%),1fr))', gap: 'clamp(36px,4vw,64px)', paddingBottom: 'clamp(44px,5vw,64px)', borderBottom: '1px solid rgba(255,255,255,.14)' }}>
          <div style={{ gridColumn: '1 / -1', maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '18px' }}>
              <span style={{ fontWeight: 900, fontSize: '24px', letterSpacing: '-.02em' }}>1%</span>
              <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '.06em' }}>LIFE CLUB</span>
            </div>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.65, color: BRONZE, maxWidth: '340px' }}>
              A private members' club for people who compound — one percent, every single day. Membership by application.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: '12px', letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED, marginBottom: '18px' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map((link, i) => (
                  <Hoverable
                    key={`${link.label}-${i}`}
                    as="a"
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    style={footerLink}
                    hoverStyle={{ color: '#fff' }}
                  >
                    {link.label}
                  </Hoverable>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '28px' }}>
          <span style={{ fontSize: '13px', color: MUTED }}>© 2026 1% Life Club. All rights reserved.</span>
          <span style={{ fontSize: '13px', color: MUTED }}>Progress over perfection.</span>
        </div>
      </div>
    </footer>
  )
}
