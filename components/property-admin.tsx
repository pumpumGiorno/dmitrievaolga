'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Check, ImagePlus, LogOut, Pencil, Plus, Star, Trash2, X } from 'lucide-react'
import { adminSignOut } from '@/app/actions/leads'
import { deleteProperty, deletePropertyPhoto, saveProperty, updatePhotoOrder, type PropertyInput } from '@/app/actions/properties'
import type { Listing } from '@/lib/listing-types'

type AdminPhoto = { id: number; propertyId: string; pathname: string; displayOrder: number; isCover: boolean; url: string }

const EMPTY: PropertyInput = {
  slug: '', title: '', category: 'Квартира', location: 'Чебоксары', address: null,
  externalUrl: null, price: null, priceOnRequest: true, areaValue: null, rooms: null,
  floor: null, floors: null, landArea: null, landCategory: null, shortDescription: null,
  description: '', attributes: [], status: 'Активно', publicationStatus: 'draft',
  seoTitle: null, seoDescription: null, displayOrder: 0,
}

function slugify(value: string) {
  const map: Record<string, string> = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' }
  return value.toLowerCase().split('').map((char) => map[char] ?? char).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function toInput(listing: Listing): PropertyInput {
  return { id: listing.id, slug: listing.slug, title: listing.title, category: listing.category, location: listing.location, address: listing.address, externalUrl: listing.url || null, price: listing.price, priceOnRequest: listing.priceOnRequest, areaValue: listing.areaValue, rooms: listing.rooms, floor: listing.floor, floors: listing.floors, landArea: listing.landArea, landCategory: listing.landCategory, shortDescription: listing.shortDescription, description: listing.description, attributes: listing.attributes, status: listing.status, publicationStatus: listing.publicationStatus, seoTitle: listing.seoTitle, seoDescription: listing.seoDescription, displayOrder: listing.displayOrder }
}

export function PropertyAdmin({ initialListings, initialPhotos }: { initialListings: Listing[]; initialPhotos: AdminPhoto[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<PropertyInput | null>(null)
  const [photos, setPhotos] = useState(initialPhotos)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const selectedPhotos = useMemo(() => photos.filter((photo) => photo.propertyId === selected?.id).sort((a, b) => a.displayOrder - b.displayOrder), [photos, selected?.id])

  function update<K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) {
    setSelected((current) => current ? { ...current, [key]: value } : current)
  }

  async function handleSave() {
    if (!selected) return
    const result = await saveProperty(selected)
    setMessage(result.ok ? 'Объект сохранён' : result.error)
    if (result.ok) {
      setSelected({ ...selected, id: result.id })
      startTransition(() => router.refresh())
    }
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length || !selected?.id) return
    setUploading(true); setMessage('')
    const data = new FormData(); data.set('propertyId', selected.id)
    Array.from(files).forEach((file) => data.append('files', file))
    const response = await fetch('/api/admin/property-images', { method: 'POST', body: data })
    const result = await response.json()
    setUploading(false)
    if (!response.ok) return setMessage(result.error ?? 'Ошибка загрузки')
    setPhotos((current) => [...current, ...result.photos])
    setMessage('Фотографии загружены')
    router.refresh()
  }

  async function movePhoto(index: number, direction: -1 | 1) {
    if (!selected?.id) return
    const next = [...selectedPhotos]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    const cover = next.find((photo) => photo.isCover)?.id ?? next[0].id
    await updatePhotoOrder(selected.id, next.map((photo) => photo.id), cover)
    setPhotos((current) => current.map((photo) => { const order = next.findIndex((item) => item.id === photo.id); return order >= 0 ? { ...photo, displayOrder: order } : photo }))
  }

  async function makeCover(photoId: number) {
    if (!selected?.id) return
    await updatePhotoOrder(selected.id, selectedPhotos.map((photo) => photo.id), photoId)
    setPhotos((current) => current.map((photo) => photo.propertyId === selected.id ? { ...photo, isCover: photo.id === photoId } : photo))
  }

  if (selected) return (
    <main className="min-h-screen bg-secondary px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={() => { setSelected(null); setMessage('') }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><X className="size-4" /> Закрыть редактор</button>
        <div className="mt-6 flex flex-col gap-6">
          <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-gold">Admin · Объект</p><h1 className="mt-2 font-serif text-3xl text-primary md:text-5xl">{selected.id ? 'Редактирование' : 'Новый объект'}</h1></div><button type="button" onClick={handleSave} disabled={isPending} className="inline-flex min-h-12 items-center gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Check className="size-4" /> Сохранить</button></header>
          {message ? <p role="status" className="border border-border bg-card px-4 py-3 text-sm text-primary">{message}</p> : null}
          <Section title="Основная информация"><Field label="Название"><input value={selected.title} onChange={(e) => { update('title', e.target.value); if (!selected.id && !selected.slug) update('slug', slugify(e.target.value)) }} /></Field><Field label="Тип"><select value={selected.category} onChange={(e) => update('category', e.target.value as PropertyInput['category'])}>{['Квартира','Дом','Участок','Комната','Другое'].map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="Город"><input value={selected.location} onChange={(e) => update('location', e.target.value)} /></Field><Field label="Адрес"><input value={selected.address ?? ''} onChange={(e) => update('address', e.target.value || null)} /></Field><Field label="Slug"><input value={selected.slug} onChange={(e) => update('slug', slugify(e.target.value))} /></Field><Field label="Ссылка на объявление"><input type="url" value={selected.externalUrl ?? ''} onChange={(e) => update('externalUrl', e.target.value || null)} /></Field></Section>
          <Section title="Цена и характеристики"><Field label="Цена, ₽"><input type="number" min="0" value={selected.price ?? ''} onChange={(e) => update('price', e.target.value ? Number(e.target.value) : null)} /></Field><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={selected.priceOnRequest} onChange={(e) => update('priceOnRequest', e.target.checked)} /> Цена по запросу</label><NumberField label="Площадь, м²" value={selected.areaValue} onChange={(v) => update('areaValue', v)} /><NumberField label="Комнат" value={selected.rooms} onChange={(v) => update('rooms', v)} /><NumberField label="Этаж" value={selected.floor} onChange={(v) => update('floor', v)} /><NumberField label="Этажей" value={selected.floors} onChange={(v) => update('floors', v)} /><NumberField label="Участок, сот." value={selected.landArea} onChange={(v) => update('landArea', v)} /><Field label="Категория земли"><input value={selected.landCategory ?? ''} onChange={(e) => update('landCategory', e.target.value || null)} /></Field><Field label="Характеристики через запятую"><input value={selected.attributes.join(', ')} onChange={(e) => update('attributes', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))} /></Field></Section>
          <Section title="Описание"><Field label="Короткое описание"><textarea rows={3} value={selected.shortDescription ?? ''} onChange={(e) => update('shortDescription', e.target.value || null)} /></Field><Field label="Полное описание"><textarea rows={8} value={selected.description} onChange={(e) => update('description', e.target.value)} /></Field></Section>
          <Section title="Статус"><Field label="Статус объекта"><select value={selected.status} onChange={(e) => update('status', e.target.value as PropertyInput['status'])}>{['Активно','Продано','Снято','Эксклюзив','Снижение цены'].map((v) => <option key={v}>{v}</option>)}</select></Field><Field label="Публикация"><select value={selected.publicationStatus} onChange={(e) => update('publicationStatus', e.target.value as 'draft' | 'published')}><option value="draft">Черновик</option><option value="published">Опубликован</option></select></Field><NumberField label="Порядок" value={selected.displayOrder} onChange={(v) => update('displayOrder', v ?? 0)} /></Section>
          <Section title="Фотографии"><label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border bg-background text-sm text-muted-foreground hover:border-gold"><ImagePlus className="size-5" />{selected.id ? (uploading ? 'Загрузка…' : 'Выбрать изображения') : 'Сначала сохраните объект'}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={!selected.id || uploading} onChange={(e) => handleUpload(e.target.files)} /></label><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{selectedPhotos.map((photo, index) => <div key={photo.id} className="border border-border bg-background p-2"><img src={photo.url} alt="" className="aspect-[4/3] w-full object-cover" /><div className="mt-2 flex items-center justify-between"><button type="button" onClick={() => makeCover(photo.id)} aria-label="Сделать главным"><Star className={`size-4 ${photo.isCover ? 'fill-gold text-gold' : ''}`} /></button><div className="flex gap-1"><button type="button" onClick={() => movePhoto(index,-1)} aria-label="Переместить выше"><ArrowUp className="size-4" /></button><button type="button" onClick={() => movePhoto(index,1)} aria-label="Переместить ниже"><ArrowDown className="size-4" /></button><button type="button" onClick={async () => { if (confirm('Удалить эту фотографию?')) { await deletePropertyPhoto(selected.id!, photo.id); setPhotos((p) => p.filter((x) => x.id !== photo.id)) } }} aria-label="Удалить фото"><Trash2 className="size-4" /></button></div></div></div>)}</div></Section>
          <Section title="SEO"><Field label="SEO title"><input value={selected.seoTitle ?? ''} onChange={(e) => update('seoTitle', e.target.value || null)} /></Field><Field label="SEO description"><textarea rows={3} value={selected.seoDescription ?? ''} onChange={(e) => update('seoDescription', e.target.value || null)} /></Field></Section>
        </div>
      </div>
    </main>
  )

  return <main className="min-h-screen bg-secondary px-4 py-10 md:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-8"><div><p className="text-xs uppercase tracking-widest text-gold">Управление недвижимостью</p><h1 className="mt-2 font-serif text-4xl text-primary md:text-6xl">Объекты</h1><p className="mt-2 text-muted-foreground">Всего: {initialListings.length}</p></div><div className="flex gap-2"><button type="button" onClick={() => setSelected({ ...EMPTY, displayOrder: initialListings.length })} className="inline-flex min-h-12 items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground"><Plus className="size-4" /> Добавить объект</button><button type="button" onClick={async () => { await adminSignOut(); router.refresh() }} className="inline-flex min-h-12 items-center gap-2 border border-border bg-card px-4 text-sm text-primary"><LogOut className="size-4" /> Выйти</button></div></header><div className="mt-8 grid gap-3">{initialListings.map((listing) => <article key={listing.id} className="flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row sm:items-center"><img src={listing.photos[0] || '/placeholder.svg'} alt="" className="aspect-[4/3] w-full object-cover sm:w-32" /><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider"><span className="bg-secondary px-2 py-1 text-primary">{listing.publicationStatus === 'published' ? 'Опубликован' : 'Черновик'}</span><span className="bg-secondary px-2 py-1 text-primary">{listing.status}</span></div><h2 className="mt-2 font-serif text-xl text-primary">{listing.title}</h2><p className="text-sm text-muted-foreground">{listing.location} · порядок {listing.displayOrder}</p></div><div className="flex gap-2"><button type="button" onClick={() => setSelected(toInput(listing))} className="inline-flex min-h-11 items-center gap-2 border border-border px-4 text-sm text-primary"><Pencil className="size-4" /> Изменить</button><button type="button" onClick={async () => { if (confirm(`Удалить объект «${listing.title}»?`)) { await deleteProperty(listing.id); router.refresh() } }} className="inline-flex min-h-11 items-center gap-2 border border-destructive/30 px-4 text-sm text-destructive"><Trash2 className="size-4" /> Удалить</button></div></article>)}</div></div></main>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="border border-border bg-card p-5 md:p-7"><h2 className="mb-5 font-serif text-2xl text-primary">{title}</h2><div className="grid gap-5 md:grid-cols-2">{children}</div></section> }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="flex flex-col gap-2 text-sm font-medium text-primary">{label}<span className="[&_input]:min-h-11 [&_input]:w-full [&_input]:border [&_input]:border-border [&_input]:bg-background [&_input]:px-3 [&_select]:min-h-11 [&_select]:w-full [&_select]:border [&_select]:border-border [&_select]:bg-background [&_select]:px-3 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-background [&_textarea]:p-3">{children}</span></label> }
function NumberField({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) { return <Field label={label}><input type="number" min="0" step="any" value={value ?? ''} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)} /></Field> }
