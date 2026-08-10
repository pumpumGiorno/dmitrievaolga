'use client'

import { useEffect, useState } from 'react'

function SkylineSilhouette({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 220"
      className={`h-40 w-auto text-primary-foreground/25 md:h-56 ${mirrored ? '-scale-x-100' : ''}`}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Vector city block silhouette */}
      <rect x="10" y="90" width="42" height="130" />
      <rect x="18" y="70" width="26" height="20" />
      <rect x="62" y="120" width="34" height="100" />
      <rect x="104" y="50" width="48" height="170" />
      <rect x="118" y="30" width="20" height="20" />
      <rect x="160" y="100" width="30" height="120" />
      <rect x="198" y="20" width="54" height="200" />
      <rect x="214" y="4" width="22" height="16" />
      <rect x="260" y="80" width="38" height="140" />
      <rect x="306" y="110" width="30" height="110" />
      <rect x="344" y="60" width="46" height="160" />
      {/* windows */}
      <g className="text-primary/60" fill="currentColor">
        <rect x="206" y="36" width="8" height="10" />
        <rect x="222" y="36" width="8" height="10" />
        <rect x="238" y="36" width="8" height="10" />
        <rect x="206" y="60" width="8" height="10" />
        <rect x="222" y="60" width="8" height="10" />
        <rect x="238" y="60" width="8" height="10" />
        <rect x="112" y="66" width="8" height="10" />
        <rect x="128" y="66" width="8" height="10" />
        <rect x="112" y="90" width="8" height="10" />
        <rect x="128" y="90" width="8" height="10" />
        <rect x="352" y="76" width="8" height="10" />
        <rect x="368" y="76" width="8" height="10" />
        <rect x="352" y="100" width="8" height="10" />
        <rect x="368" y="100" width="8" height="10" />
      </g>
    </svg>
  )
}

export function Preloader() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const openTimer = setTimeout(() => setOpen(true), 1600)
    const doneTimer = setTimeout(() => {
      setDone(true)
      document.body.style.overflow = ''
    }, 2600)
    return () => {
      clearTimeout(openTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = ''
    }
  }, [])

  if (done) return null

  return (
    <div className="fixed inset-0 z-100 flex" role="status" aria-label="Загрузка сайта">
      {/* Left panel */}
      <div
        className={`preloader-panel-left flex w-1/2 items-end justify-end overflow-hidden bg-primary pb-16 ${open ? 'preloader-open' : ''}`}
      >
        <div className="preloader-skyline">
          <SkylineSilhouette />
        </div>
      </div>
      {/* Right panel */}
      <div
        className={`preloader-panel-right flex w-1/2 items-end justify-start overflow-hidden bg-primary pb-16 ${open ? 'preloader-open' : ''}`}
      >
        <div className="preloader-skyline" style={{ animationDelay: '0.15s' }}>
          <SkylineSilhouette mirrored />
        </div>
      </div>
      {/* Center brand */}
      <div
        className={`preloader-center absolute inset-0 flex flex-col items-center justify-center gap-4 ${open ? 'preloader-open' : ''}`}
      >
        <p className="font-serif text-2xl tracking-wide text-primary-foreground md:text-3xl">
          Дмитриева Ольга
        </p>
        <div className="h-px w-40 bg-gold/70 preloader-line" />
        <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/70">
          Эксперт по недвижимости
        </p>
      </div>
    </div>
  )
}
