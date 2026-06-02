import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { publicAPI } from '../../api/services'
import PublicLayout from '../../components/public/PublicLayout'
import { SearchInput } from '../../components/ui'
import { aluminiumProfiles } from '../../data/aluminiumProfiles'

function formatDimension(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  return Number.isInteger(number) ? number.toFixed(0) : number.toString()
}

function AluminiumProfileCard({ profile }) {
  return (
    <article className="product-card">
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-white">
        <img
          src={profile.image}
          alt={profile.nom || profile.reference}
          className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = '/assets/logo/c2a-logo.jpg'
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white shadow-sm">
          Ref. {profile.reference}
        </span>
      </div>
      <div className="p-5">
        <p className="badge-info">{profile.categorie || 'Aluminium'}</p>
        <h2 className="mt-3 font-bold text-slate-950">{profile.nom}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-500">Largeur</p>
            <p className="font-black text-slate-950">{formatDimension(profile.largeur)} mm</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-slate-500">Hauteur</p>
            <p className="font-black text-slate-950">{formatDimension(profile.hauteur)} mm</p>
          </div>
        </div>
        <Link to={`/catalogue-aluminium/${profile.id}`} className="btn-primary mt-5 w-full">
          Voir details
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}

export default function AluminiumCataloguePage() {
  const [profiles, setProfiles] = useState(aluminiumProfiles)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    publicAPI.getCatalogueAluminium()
      .then(response => {
        if (!active) return
        setProfiles(response.data?.length ? response.data : aluminiumProfiles)
      })
      .catch(() => {
        if (active) setProfiles(aluminiumProfiles)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return profiles
    return profiles.filter(profile => profile.reference?.toLowerCase().includes(query))
  }, [profiles, search])

  return (
    <PublicLayout>
      <main className="min-h-[70vh] bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="section-eyebrow">Catalogue technique</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Catalogue Aluminium</h1>
            <p className="section-muted">
              Profilés aluminium issus du catalogue technique C2A, avec référence, dimensions et fiche détail.
            </p>
            <div className="mt-6 max-w-md">
              <SearchInput value={search} onChange={setSearch} placeholder="Rechercher par reference..." />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="loading-spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="card border-dashed text-center text-slate-500">
              Aucun profilé trouvé pour cette référence.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(profile => <AluminiumProfileCard key={profile.id} profile={profile} />)}
            </div>
          )}
        </section>
      </main>
    </PublicLayout>
  )
}
