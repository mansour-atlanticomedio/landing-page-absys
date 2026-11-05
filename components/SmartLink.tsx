import Link from 'next/link'
import { cleanHref } from '@/lib/href'

type Props = {
  href?: string | null
  className?: string
  fallbackClassName?: string
  children: React.ReactNode
  'aria-label'?: string
}

export default function SmartLink({ href, className, fallbackClassName, children, ...rest }: Props) {
  const link = cleanHref(href)
  if (!link) return <span className={fallbackClassName ?? className}>{children}</span>
  if (link.external) {
    return (
      <a href={link.href} className={className} {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={link.href} className={className} {...rest}>
      {children}
    </Link>
  )
}
