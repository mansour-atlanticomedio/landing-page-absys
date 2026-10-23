'use client'

import { useAuth } from '@payloadcms/ui'
import { SECTIONS, writableSections } from '@/lib/permissions'

export default function ViewerBanner() {
  const { user } = useAuth()
  const u: any = user
  if (!u || u.collection !== 'users' || u.role === 'admin') return null

  const writable = writableSections(u)
  if (writable.length === SECTIONS.length) return null

  if (writable.length === 0) {
    return (
      <div className="unam-viewer-banner" role="status">
        <strong>Modo solo lectura.</strong> Tienes acceso de solo lectura: puedes consultar el contenido, pero no
        guardar cambios. Pide a un administrador que te dé permisos de editor.
      </div>
    )
  }

  const names = SECTIONS.filter((s) => writable.includes(s.key)).map((s) => s.label)
  return (
    <div className="unam-viewer-banner" role="status">
      <strong>Edición limitada.</strong> Solo puedes editar: {names.join(', ')}.
    </div>
  )
}
