import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { publicAPI } from '../../api/services'
import PublicLayout from '../../components/public/PublicLayout'
import { findAluminiumProfileById } from '../../data/aluminiumProfiles'

function formatDimension(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  return Number.isInteger(number) ? number.toFixed(0) : number.toString()
}

export default function AluminiumProfileDetailPage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(() => findAluminiumProfileById(id))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    publicAPI.getProfileAluminium(id)
      .then(response => {
        if (active) setProfile(response.data)
      })
      .catch(() => {
        if (active) setProfile(findAluminiumProfileById(id))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [id])

  return (
    <PublicLayout>
      <main className="min-h-[70vh] bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link to="/catalogue-aluminium" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Retour au catalogue
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="loading-spinner" />
            </div>
          ) : !profile ? (
            <div className="card border-dashed text-center text-slate-500">
              Profilé introuvable.
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80">
                <img
                  src={profile.image}
                  alt={profile.nom || profile.reference}
                  className="h-[420px] w-full object-contain p-6"
                  onError={(event) => {
                    event.currentTarget.src = '/assets/logo/c2a-logo.jpg'
                  }}
                />
              </div>

              <aside className="card h-fit">
                <p className="section-eyebrow">{profile.categorie || 'Aluminium'}</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{profile.nom}</h1>
                <p className="mt-3 font-mono text-lg font-black text-blue-700">Ref. {profile.reference}</p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Largeur</p>
                    <p className="text-xl font-black text-slate-950">{formatDimension(profile.largeur)} mm</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Hauteur</p>
                    <p className="text-xl font-black text-slate-950">{formatDimension(profile.hauteur)} mm</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <h2 className="font-black text-slate-950">Description</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {profile.description || 'Profilé aluminium du catalogue technique C2A.'}
                  </p>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>
    </PublicLayout>
  )
}
