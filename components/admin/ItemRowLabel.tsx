'use client'

import { Pill, useRowLabel } from '@payloadcms/ui'

type Props = {
  field: string
  fallbackField?: string
  singular: string
}

export default function ItemRowLabel({ field, fallbackField, singular }: Props) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const raw = data?.[field] ?? (fallbackField ? data?.[fallbackField] : undefined)
  const text = typeof raw === 'string' ? raw.trim() : ''
  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')

  return (
    <span className="unam-row-label">
      <Pill size="small" pillStyle="light-gray">
        {number}
      </Pill>
      <span className="unam-row-label__text">{text || `${singular} sin título`}</span>
    </span>
  )
}
