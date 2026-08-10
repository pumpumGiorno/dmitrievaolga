'use client'

import { useContact } from '@/components/contact-provider'

export function ContactButton({
  subject,
  service,
  children,
  variant = 'primary',
  className = '',
}: {
  subject?: string
  service?: string
  children: React.ReactNode
  variant?: 'primary' | 'gold' | 'outline'
  className?: string
}) {
  const { openContact } = useContact()

  const styles = {
    primary:
      'bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg',
    gold: 'bg-gold text-gold-foreground hover:bg-gold/90 hover:shadow-lg',
    outline:
      'border border-primary/30 text-primary hover:border-gold hover:bg-secondary',
  }[variant]

  return (
    <button
      type="button"
      onClick={() => openContact({ subject, service })}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-medium transition-all active:scale-[0.98] ${styles} ${className}`}
    >
      {children}
    </button>
  )
}
