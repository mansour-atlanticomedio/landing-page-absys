'use client'

import { useCallback, useMemo, useRef } from 'react'
import { FieldDescription, FieldError, FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import type { SelectFieldClientProps } from 'payload'
import { PREVIEWS } from '../previews'

type VisualOption = { value: string; title: string; description: string }

type Props = SelectFieldClientProps & {
  preview: string
  options: VisualOption[]
  contentFields?: Record<string, string>
  previewCaption?: string
}

function resolvePath(path: string, target: string) {
  if (!target.startsWith('./')) return target
  const parent = path.includes('.') ? path.slice(0, path.lastIndexOf('.') + 1) : ''
  return parent + target.slice(2)
}

export default function VisualSelectField(props: Props) {
  const { field, path, readOnly, preview, options, contentFields, previewCaption } = props
  const entry = PREVIEWS[preview]
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  const paths = useMemo(
    () => Object.fromEntries(Object.entries(contentFields ?? {}).map(([key, target]) => [key, resolvePath(path, target)])),
    [contentFields, path],
  )
  const rawContent = useFormFields(([fields]) =>
    JSON.stringify(Object.fromEntries(Object.entries(paths).map(([key, p]) => [key, String(fields?.[p]?.value ?? '')]))),
  )
  const content = useMemo(() => JSON.parse(rawContent) as Record<string, string>, [rawContent])

  const effective = value ?? options[0]?.value
  const selected = options.find((o) => o.value === effective)
  const checkedIndex = options.findIndex((o) => o.value === value)
  const tabbable = checkedIndex >= 0 ? checkedIndex : Math.max(0, options.findIndex((o) => o.value === effective))

  const choose = useCallback(
    (index: number) => {
      if (readOnly) return
      const option = options[index]
      if (!option) return
      setValue(option.value)
      refs.current[index]?.focus()
    },
    [options, readOnly, setValue],
  )

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = options.length - 1
    let next = -1
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next >= 0) {
      event.preventDefault()
      choose(next)
    }
  }

  if (!entry) return null
  const { Thumb, Preview } = entry
  const labelId = `${path}-visual-label`
  const description = field.admin?.description
  const showUnsetNote = value === undefined || value === null || value === ''

  return (
    <div className={`field-type select unam-vs${showError ? ' error' : ''}`}>
      <div id={labelId}>
        <FieldLabel label={field.label} localized={field.localized} path={path} required={field.required} />
      </div>
      <div className="unam-vs__grid" role="radiogroup" aria-labelledby={labelId} aria-required={field.required || undefined} aria-disabled={readOnly || undefined}>
        {options.map((option, index) => {
          const checked = option.value === value
          return (
            <button
              key={option.value}
              ref={(el) => {
                refs.current[index] = el
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-disabled={readOnly || undefined}
              tabIndex={index === tabbable ? 0 : -1}
              className={`unam-vs__card${checked ? ' unam-vs__card--selected' : ''}`}
              onClick={() => choose(index)}
              onKeyDown={(e) => onKeyDown(e, index)}
            >
              <span className="unam-vs__thumb">
                <Thumb value={option.value} />
              </span>
              <span className="unam-vs__title">{option.title}</span>
              <span className="unam-vs__desc">{option.description}</span>
              {checked ? <span className="unam-vs__check" aria-hidden="true">✓</span> : null}
            </button>
          )
        })}
      </div>
      <FieldError path={path} showError={showError} message={errorMessage} />
      {description ? <FieldDescription description={description} path={path} /> : null}
      {selected ? (
        <div className="unam-vs__preview" aria-live="polite">
          <div className="unam-vs__preview-head">
            <strong>Vista previa</strong>
            <span>{selected.title}</span>
          </div>
          <div className="unam-vs__preview-body">
            <Preview value={selected.value} content={content} />
          </div>
          <p className="unam-vs__preview-note">
            {showUnsetNote ? `Aún no has elegido un estilo: se muestra el estilo por defecto. ` : ''}
            {previewCaption ?? 'Es una maqueta con contenido de ejemplo; la web usa tus textos e imágenes reales.'}
          </p>
        </div>
      ) : null}
    </div>
  )
}
