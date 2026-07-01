export function PlankUniSection() {
  return (
    <section style={{ padding: '72px 0' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <span className="eyebrow" style={{ color: 'var(--jaune)' }}>Notre matière</span>
        <h2 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(28px,4vw,50px)',
          color: 'var(--jaune)',
          marginBottom: '18px',
        }}>
          Le bois, notre matière première
        </h2>
        <p style={{
          fontFamily: "'Khand', sans-serif",
          fontSize: '20px',
          color: 'rgba(255,255,255,.92)',
          fontWeight: 300,
          maxWidth: 620,
          margin: '0 auto',
          lineHeight: 1.55,
        }}>
          Des essences sélectionnées pour leur durabilité et leur beauté naturelle.
          Chaque pièce est travaillée avec soin dans notre atelier.
        </p>
      </div>
    </section>
  )
}
