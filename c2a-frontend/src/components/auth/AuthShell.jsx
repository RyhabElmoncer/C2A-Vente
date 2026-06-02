import { Link } from 'react-router-dom'
import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  CubeIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import BrandLogo from '../brand/BrandLogo'
import PublicChatbot from '../public/PublicChatbot'
import { companyInfo } from '../../data/companyInfo'

const metrics = [
  { label: 'Commandes', value: '1.2k', icon: ClipboardDocumentCheckIcon },
  { label: 'Clients', value: '430+', icon: UsersIcon },
  { label: 'Produits', value: '980+', icon: CubeIcon },
]

export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-slate-950 min-h-[360px] lg:min-h-screen">
          <img
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1500&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/82 to-blue-950/72" />

          <div className="relative z-10 flex min-h-full flex-col justify-between px-6 py-8 sm:px-10 lg:px-14">
            <Link to="/" className="inline-flex w-fit items-center gap-3 text-white">
              <BrandLogo className="h-16 w-56 rounded-2xl bg-white p-1.5 shadow-xl" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">{companyInfo.officialName}</p>
                <p className="text-xs text-slate-300">{companyInfo.category}</p>
              </div>
            </Link>

            <div className="my-10 max-w-2xl lg:my-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-blue-50 backdrop-blur">
                <ShieldCheckIcon className="h-4 w-4" />
                Plateforme sécurisée aluminium & acier
              </div>
              <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                {companyInfo.officialName}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-200">
                Espace digital de {companyInfo.officialName} pour consulter les produits, créer une demande client et suivre les opérations commerciales.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {metrics.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-white/12 bg-white/10 p-4 shadow-xl backdrop-blur">
                    <Icon className="h-5 w-5 text-blue-200" />
                    <p className="mt-3 text-2xl font-black text-white">{value}</p>
                    <p className="text-xs font-medium text-slate-300">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-5 shadow-2xl backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Activité commerciale</p>
                    <p className="text-xs text-slate-300">Vue synthétique temps réel</p>
                  </div>
                  <ArrowTrendingUpIcon className="h-6 w-6 text-blue-200" />
                </div>
                <div className="flex h-28 items-end gap-2">
                  {[38, 52, 47, 64, 58, 76, 82, 70, 88, 94].map((height, index) => (
                    <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-slate-100/90" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/12 bg-slate-900/60 p-5 shadow-2xl backdrop-blur">
                <ChartBarIcon className="h-7 w-7 text-blue-200" />
                <p className="mt-4 text-sm font-semibold text-white">Workflow ERP</p>
                <div className="mt-4 space-y-3 text-xs text-slate-300">
                  {['Client', 'Commande', 'Stock', 'Facture'].map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white">{index + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{eyebrow}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-300/60 sm:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
      <PublicChatbot />
    </div>
  )
}
