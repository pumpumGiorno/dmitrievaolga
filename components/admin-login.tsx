'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { adminSignIn } from '@/app/actions/leads'

export function AdminLogin() {
  const router = useRouter()
  const [error, setError] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSending(true)
    setError(false)
    const result = await adminSignIn(String(data.get('password') ?? ''))
    setSending(false)
    if (!result.ok) {
      setError(true)
      return
    }
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-border bg-card p-8"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-gold/15">
        <Lock className="size-6 text-gold" aria-hidden="true" />
      </span>
      <h1 className="font-serif text-2xl text-primary">Вход для Ольги</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Введите пароль, чтобы посмотреть заявки с сайта.
      </p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
          Пароль
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={error}
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold aria-[invalid=true]:border-destructive"
        />
        {error && (
          <p role="alert" className="text-xs text-destructive">
            Неверный пароль
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-gold-foreground transition-all hover:bg-gold/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? 'Проверяем…' : 'Войти'}
      </button>
    </form>
  )
}
