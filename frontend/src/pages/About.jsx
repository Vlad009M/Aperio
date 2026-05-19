export default function About() {
  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Hero */}
        <div style={s.hero}>
          <img src="/Aperio.png" alt="Aperio" style={s.logo} />
          <h1 style={s.title}>Aperio</h1>
          <p style={s.subtitle}>Розумний фінансовий трекер з AI-аналізом</p>
          <div style={s.version}>Версія 1.0 · 2026</div>
        </div>

        {/* Mission */}
        <div style={s.missionCard}>
          <div style={s.missionIcon}>💡</div>
          <div>
            <div style={s.missionTitle}>Наша місія</div>
            <p style={s.missionText}>
              Aperio створено з простою ідеєю — зробити особисті фінанси зрозумілими для кожного. Без складних таблиць, без нав'язливих банківських додатків. Просто чіткий облік, розумна аналітика та трохи ігрового азарту щоб не кидати.
            </p>
          </div>
        </div>

        {/* Features */}
        <h2 style={s.sectionTitle}>Що вміє Aperio</h2>
        <div style={s.featureGrid}>
          {[
            { icon: '📊', title: 'Облік витрат', desc: 'Категорії, пошук, фільтри по місяцях. Імпорт виписок з monobank одним кліком.' },
            { icon: '🤖', title: 'AI-аналіз', desc: 'Claude Sonnet аналізує ваші фінансові звички і дає персональні поради.' },
            { icon: '⚔️', title: 'Гейміфікація', desc: 'XP, рівні, ачівки та тижневі челенджі перетворюють нудний облік на пригоду.' },
            { icon: '💰', title: 'Бюджети', desc: 'Встановлюйте місячні ліміти по категоріях і отримуйте попередження при перевищенні.' },
            { icon: '🌙', title: 'Темна тема', desc: 'Зручний інтерфейс вдень і вночі з автоматичним збереженням налаштувань.' },
            { icon: '📱', title: 'PWA', desc: 'Встановіть Aperio на телефон як нативний додаток — працює навіть офлайн.' },
          ].map((f, i) => (
            <div key={i} style={s.featureCard}>
              <div style={s.featureIcon}>{f.icon}</div>
              <div style={s.featureTitle}>{f.title}</div>
              <div style={s.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Stack */}
        <h2 style={s.sectionTitle}>Технологічний стек</h2>
        <div style={s.stackGrid}>
          {[
            { name: 'React 19', type: 'Фронтенд' },
            { name: 'Node.js + Express', type: 'Бекенд' },
            { name: 'PostgreSQL', type: 'База даних' },
            { name: 'Prisma ORM', type: 'Доступ до даних' },
            { name: 'Supabase', type: 'Хостинг БД' },
            { name: 'Claude Sonnet', type: 'AI-аналіз' },
            { name: 'JWT + HttpOnly', type: 'Безпека' },
            { name: 'PWA', type: 'Мобільний додаток' },
          ].map((t, i) => (
            <div key={i} style={s.stackItem}>
              <div style={s.stackName}>{t.name}</div>
              <div style={s.stackType}>{t.type}</div>
            </div>
          ))}
        </div>

        {/* Author */}
        <div style={s.authorCard}>
          <div style={s.authorAvatar}>V</div>
          <div>
            <div style={s.authorName}>Vlad — розробник Aperio</div>
            <div style={s.authorDesc}>
              Aperio — індивідуальний проєкт, створений з нуля однією людиною. Від архітектури бази даних до UI/UX дизайну — кожен рядок коду написаний вручну.
            </div>
            <a href="mailto:matovkavlad@gmail.com" style={s.authorEmail}>
              matovkavlad@gmail.com
            </a>
          </div>
        </div>

        {/* Support */}
        <div style={s.supportCard}>
          <div style={s.supportText}>
            ☕ Якщо Aperio допомагає вам краще розуміти свої фінанси — підтримайте розробника
          </div>
          <a
            href="https://send.monobank.ua/jar/93HaeWmhhg"
            target="_blank"
            rel="noopener noreferrer"
            style={s.supportBtn}
          >
            ☕ Купити каву розробнику
          </a>
        </div>

        {/* Legal links */}
        <div style={s.legalLinks}>
          <a href="/privacy" style={s.legalLink}>Політика конфіденційності</a>
          <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>
          <a href="/terms" style={s.legalLink}>Умови використання</a>
          <span style={{ color: 'var(--color-text-tertiary)' }}>·</span>
          <a href="mailto:matovkavlad@gmail.com" style={s.legalLink}>Зв'язатися</a>
        </div>

      </div>
    </div>
  )
}

const s = {
  page: { background: 'var(--color-background-tertiary)', minHeight: '100vh', padding: '40px 20px' },
  container: { maxWidth: 760, margin: '0 auto' },
  hero: { textAlign: 'center', marginBottom: 40, padding: '40px 20px', background: 'var(--color-background-primary)', borderRadius: 16, border: '0.5px solid var(--color-border-tertiary)' },
  logo: { width: 72, height: 72, borderRadius: 16, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'var(--color-text-secondary)', marginBottom: 12 },
  version: { display: 'inline-block', background: '#EEEDFE', color: '#534AB7', fontSize: 12, padding: '4px 12px', borderRadius: 20 },
  missionCard: { display: 'flex', gap: 16, alignItems: 'flex-start', background: 'var(--color-background-primary)', borderRadius: 16, padding: '24px', border: '0.5px solid var(--color-border-tertiary)', marginBottom: 32 },
  missionIcon: { fontSize: 32, flexShrink: 0 },
  missionTitle: { fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 },
  missionText: { fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 },
  sectionTitle: { fontSize: 20, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 16, marginTop: 0 },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 },
  featureCard: { background: 'var(--color-background-primary)', borderRadius: 12, padding: 16, border: '0.5px solid var(--color-border-tertiary)' },
  featureIcon: { fontSize: 24, marginBottom: 8 },
  featureTitle: { fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 },
  featureDesc: { fontSize: 12, color: 'var(--color-text-tertiary)', lineHeight: 1.6 },
  stackGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 32 },
  stackItem: { background: 'var(--color-background-primary)', borderRadius: 10, padding: '12px 14px', border: '0.5px solid var(--color-border-tertiary)' },
  stackName: { fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 3 },
  stackType: { fontSize: 11, color: 'var(--color-text-tertiary)' },
  authorCard: { display: 'flex', gap: 16, background: 'var(--color-background-primary)', borderRadius: 16, padding: 24, border: '0.5px solid var(--color-border-tertiary)', marginBottom: 20 },
  authorAvatar: { width: 52, height: 52, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, color: '#534AB7', flexShrink: 0 },
  authorName: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 },
  authorDesc: { fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 },
  authorEmail: { fontSize: 13, color: '#534AB7', textDecoration: 'none' },
  supportCard: { background: 'linear-gradient(135deg, #534AB7, #7F77DD)', borderRadius: 16, padding: '24px', textAlign: 'center', marginBottom: 24 },
  supportText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 14, lineHeight: 1.5 },
  supportBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#fff', color: '#534AB7', borderRadius: 20, fontSize: 14, fontWeight: 600, textDecoration: 'none' },
  legalLinks: { display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', fontSize: 13, paddingBottom: 20 },
  legalLink: { color: 'var(--color-text-tertiary)', textDecoration: 'none' },
}