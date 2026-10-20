'use client'

import { useAuth } from '@payloadcms/ui'

export default function ViewerBanner() {
  const { user } = useAuth()
  if (!user || (user as any).collection !== 'users' || (user as any).role !== 'viewer') return null

  return (
    <div className="unam-viewer-banner" role="status">
      <strong>Modo solo lectura.</strong> Tienes acceso de solo lectura: puedes consultar el contenido, pero no
      guardar cambios. Pide a un administrador que te dé permisos de editor.
    </div>
  )
}
