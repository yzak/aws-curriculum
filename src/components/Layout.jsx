import { useNavigate, useLocation } from 'react-router-dom'

const ROUTE_META = {
  '/clf-terms': { title: 'IT用語マスターコース', emoji: '📚', color: '#6366f1' },
  '/beginner':  { title: 'VPC→EC2→nginx', emoji: '🚀', color: '#0ea5e9' },
  '/advanced':  { title: 'S3 / IAM / ECS / CloudFront', emoji: '🏗️', color: '#10b981' },
  '/bastion':   { title: '踏み台サーバー接続', emoji: '🔐', color: '#f97316' },
  '/spot':      { title: 'Spot Instance', emoji: '⚡', color: '#a855f7' },
}

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const meta = ROUTE_META[pathname]
  if (!meta) return children   // home has no layout bar

  return (
    <div>
      {/* top nav bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 999,
        background: 'rgba(10,14,26,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${meta.color}40`,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '6px 12px', borderRadius: 8,
            border: '1px solid #1e3a5f', background: 'transparent',
            color: '#60a5fa', cursor: 'pointer', fontSize: 12, fontWeight: 700,
            fontFamily: 'inherit', whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#1e3a5f'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          ← ホーム
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{meta.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{meta.title}</span>
        </div>
      </div>
      {children}
    </div>
  )
}
