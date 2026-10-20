const BASE = '/biblioteca'

export default function AdminLogo() {
  return (
    <span className="unam-admin-logo">
      <img
        className="unam-admin-logo__light"
        src={`${BASE}/logos/logo.png`}
        alt="Universidad del Atlántico Medio"
        width={300}
        height={150}
      />
      <img
        className="unam-admin-logo__dark"
        src={`${BASE}/logos/logo_white.png`}
        alt="Universidad del Atlántico Medio"
        width={300}
        height={150}
      />
    </span>
  )
}
