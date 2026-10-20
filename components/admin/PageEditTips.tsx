import { Banner, ViewDescription } from '@payloadcms/ui'

type Props = {
  description?: string
  tips?: string
}

export default function PageEditTips({ description, tips }: Props) {
  return (
    <div className="unam-edit-tips">
      {description ? <ViewDescription description={description} /> : null}
      <Banner type="info">
        {tips ??
          'Los cambios no se ven en la web hasta que pulsas Guardar. Revisa la página pública después de guardar.'}
      </Banner>
    </div>
  )
}
