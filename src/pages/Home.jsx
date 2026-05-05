import { useNavigate } from 'react-router-dom'

const COURSES = [
  {
    path: '/clf-terms',
    emoji: '📚',
    badge: 'STEP 1',
    badgeColor: '#6366f1',
    title: 'IT用語マスターコース',
    subtitle: 'AWS CLF 前提知識',
    desc: 'ネットワーク・サーバー・セキュリティ・DBなど6カテゴリ44用語をクイズ付きで習得',
    tags: ['ネットワーク', 'サーバー', 'セキュリティ', 'データベース', 'クラウド', 'DevOps'],
    color: '#6366f1',
    dark: '#4338ca',
    light: '#eef2ff',
    time: '約2〜3時間',
    level: '⭐☆☆ 初心者',
  },
  {
    path: '/beginner',
    emoji: '🚀',
    badge: 'STEP 2',
    badgeColor: '#0ea5e9',
    title: 'VPC→EC2→nginx Hello World',
    subtitle: 'AWS初心者ハンズオン',
    desc: 'VPC作成からEC2起動・nginxでHello World表示まで。AWS操作の基礎を体で覚える',
    tags: ['VPC', 'EC2', 'セキュリティグループ', 'nginx', 'SSH', 'Elastic IP'],
    color: '#0ea5e9',
    dark: '#0369a1',
    light: '#f0f9ff',
    time: '約45分',
    level: '⭐☆☆ 初心者',
  },
  {
    path: '/advanced',
    emoji: '🏗️',
    badge: 'STEP 3',
    badgeColor: '#10b981',
    title: 'S3 / IAM / ECS / CloudFront',
    subtitle: 'AWS中級ハンズオン',
    desc: 'S3静的ホスティング・IAMロール/ポリシー・ECS/Fargate・CloudFront+Route53まで',
    tags: ['S3', 'IAM', 'ECS', 'Fargate', 'CloudFront', 'ACM', 'Route 53'],
    color: '#10b981',
    dark: '#047857',
    light: '#f0fdf4',
    time: '約3〜4時間',
    level: '⭐⭐☆ 中級',
  },
  {
    path: '/bastion',
    emoji: '🔐',
    badge: 'STEP 4',
    badgeColor: '#f97316',
    title: '踏み台サーバー接続マスター',
    subtitle: '4つの接続パターン',
    desc: '従来SSH・Session Manager・JIT Node Access(2025年新機能)・EC2 Instance Connectを網羅',
    tags: ['SSH', 'SSM', 'JIT Node Access', 'EC2 Instance Connect', 'EICE', 'セキュリティ'],
    color: '#f97316',
    dark: '#c2410c',
    light: '#fff7ed',
    time: '約2時間',
    level: '⭐⭐☆ 中級',
  },
  {
    path: '/spot',
    emoji: '⚡',
    badge: 'STEP 5',
    badgeColor: '#a855f7',
    title: 'Spot Instance マスターコース',
    subtitle: 'コスト最適化',
    desc: '価格分析・フリート設定・Auto Scaling統合・中断ハンドラー実装まで。最大90%コスト削減',
    tags: ['Spot Instance', 'EC2フリート', 'Auto Scaling', 'Capacity Rebalancing', 'SQS', 'CloudWatch'],
    color: '#a855f7',
    dark: '#7c3aed',
    light: '#faf5ff',
    time: '約3.5時間',
    level: '⭐⭐⭐ 上級',
  },
]

const STATS = [
  { num: '5', label: 'コース' },
  { num: '44', label: 'IT用語' },
  { num: '50+', label: 'ハンズオン\nステップ' },
  { num: '13h+', label: '総学習時間' },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', fontFamily: "'Hiragino Kaku Gothic ProN','Meiryo',sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg,#0a0e1a 0%,#0f1e38 50%,#1a0a2e 100%)',
        padding: '60px 20px 50px',
        textAlign: 'center',
        borderBottom: '1px solid #1e3a5f',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        {[
          { w: 300, h: 300, top: -100, left: -100, color: '#1e3a8a' },
          { w: 200, h: 200, top: -50, right: -50, color: '#7c3aed20' },
          { w: 400, h: 400, bottom: -200, right: '20%', color: '#0e7490' + '15' },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', border: `1px solid ${c.color}`,
            width: c.w, height: c.h, top: c.top, left: c.left, right: c.right, bottom: c.bottom,
            opacity: 0.3, pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 20,
            background: '#1e3a5f', border: '1px solid #2563eb',
            fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: 3,
            marginBottom: 20, textTransform: 'uppercase',
          }}>
            ☁️ AWS Learning Platform
          </div>
          <h1 style={{
            margin: '0 0 16px', fontSize: 'clamp(28px,5vw,52px)',
            fontWeight: 900, letterSpacing: -1,
            background: 'linear-gradient(135deg,#ffffff 0%,#60a5fa 50%,#a78bfa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1.15,
          }}>
            AWS CLF 完全攻略<br />ハンズオンカリキュラム
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.8 }}>
            IT用語の基礎から、VPC・EC2・S3・IAM・ECS・CloudFront・<br />
            スポットインスタンスまで。実務で使えるAWS力を身につける。
          </p>

          {/* stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#60a5fa', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 4, whiteSpace: 'pre' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COURSES GRID ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 16px 60px' }}>
        <div style={{ fontSize: 11, color: '#334866', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 28 }}>
          — カリキュラム一覧 —
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
          {COURSES.map((c) => (
            <div
              key={c.path}
              onClick={() => navigate(c.path)}
              style={{
                background: '#0d1525',
                border: `1px solid #1e3a5f`,
                borderRadius: 16, padding: '22px',
                cursor: 'pointer',
                transition: 'all 0.25s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid ${c.color}`
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 12px 32px ${c.color}30`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '1px solid #1e3a5f'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* glow bg */}
              <div style={{
                position: 'absolute', top: -40, right: -40, width: 120, height: 120,
                borderRadius: '50%', background: `${c.color}12`, pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{
                  fontSize: 10, padding: '3px 10px', borderRadius: 20,
                  background: `${c.badgeColor}20`, color: c.badgeColor,
                  border: `1px solid ${c.badgeColor}40`, fontWeight: 800, letterSpacing: 1,
                }}>{c.badge}</span>
                <span style={{ fontSize: 28 }}>{c.emoji}</span>
              </div>

              <div style={{ fontSize: 11, color: '#334866', marginBottom: 4 }}>{c.subtitle}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#e8f0ff', marginBottom: 8, lineHeight: 1.3 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: '#4a6580', lineHeight: 1.7, marginBottom: 14 }}>{c.desc}</div>

              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                {c.tags.slice(0, 4).map(t => (
                  <span key={t} style={{
                    fontSize: 9, padding: '2px 7px', borderRadius: 6,
                    background: `${c.color}12`, color: c.color,
                    border: `1px solid ${c.color}30`, fontWeight: 600,
                  }}>{t}</span>
                ))}
                {c.tags.length > 4 && <span style={{ fontSize: 9, color: '#334866' }}>+{c.tags.length - 4}</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#334866' }}>⏱ {c.time}</div>
                  <div style={{ fontSize: 10, color: '#334866', marginTop: 2 }}>{c.level}</div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: c.color,
                  padding: '6px 14px', borderRadius: 8,
                  background: `${c.color}15`, border: `1px solid ${c.color}30`,
                }}>
                  開始する →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* learning path */}
        <div style={{ marginTop: 50, background: '#0d1525', border: '1px solid #1e3a5f', borderRadius: 16, padding: '24px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', marginBottom: 16, letterSpacing: 2 }}>📍 推奨学習順序</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {COURSES.map((c, i) => (
              <div key={c.path} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  onClick={() => navigate(c.path)}
                  style={{
                    padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                    background: `${c.color}15`, border: `1px solid ${c.color}40`,
                    color: c.color, fontSize: 12, fontWeight: 700,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${c.color}30`}
                  onMouseLeave={e => e.currentTarget.style.background = `${c.color}15`}
                >
                  {c.emoji} {c.badge}
                </div>
                {i < COURSES.length - 1 && <span style={{ color: '#1e3a5f', fontSize: 18 }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ borderTop: '1px solid #0f1e33', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: '#1e3a5f' }}>
          AWS CLF ハンズオンカリキュラム — Built with React + Vite — Hosted on GitHub Pages
        </div>
      </div>
    </div>
  )
}
