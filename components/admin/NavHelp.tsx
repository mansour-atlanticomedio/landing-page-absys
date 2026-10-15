import { Button } from '@payloadcms/ui'

export default function NavHelp() {
  return (
    <div className="unam-nav-help">
      <Button
        el="anchor"
        url="/biblioteca"
        newTab
        buttonStyle="secondary"
        size="small"
        aria-label="Ver la web pública (se abre en una pestaña nueva)"
      >
        Ver la web
      </Button>
      <p className="unam-nav-help__text">
        Los cambios se publican al pulsar Guardar en cada página.
      </p>
    </div>
  )
}
