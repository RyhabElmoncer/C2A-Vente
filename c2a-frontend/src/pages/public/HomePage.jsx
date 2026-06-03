import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { publicAPI } from '../../api/services'
import BrandLogo from '../../components/brand/BrandLogo'
import PublicLayout from '../../components/public/PublicLayout'
import { companyInfo } from '../../data/companyInfo'
import {
  ArrowRightIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
  CubeIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'

const services = [
  { title: 'Catalogue aluminium et acier', text: 'Consultation des produits aluminium, acier et accessoires disponibles.', icon: CubeIcon },
  { title: 'Demandes d’achat en ligne', text: 'Les clients peuvent créer un compte et transmettre leurs demandes à l’équipe C2A.', icon: ClipboardDocumentCheckIcon },
  { title: 'Agences C2A', text: 'Présence visible à Sfax, Gabes et Djerba selon les informations officielles de la page.', icon: BuildingStorefrontIcon },
  { title: 'Suivi stock et livraison', text: 'Les demandes sont traitées par l’équipe commerciale et les gestionnaires habilités.', icon: TruckIcon },
]

function ProductMiniCard({ produit }) {
  return (
    <article className="product-card">
      <div className="flex h-28 items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{produit.categorie || 'Produit'}</p>
          <p className="font-mono text-sm font-bold text-blue-700">{produit.reference}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-bold text-slate-950">{produit.designation}</h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-blue-700">{(produit.prixVente || 0).toFixed(3)} TND</span>
          <span className="text-slate-500">{produit.stockActuel} {produit.unite}</span>
        </div>
      </div>
    </article>
  )
}

function BranchCard({ branch }) {
  return (
    <div className="card">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <MapPinIcon className="h-6 w-6" />
      </div>
      <h3 className="font-black text-slate-950">{branch.city}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{branch.address}</p>
      <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
        <PhoneIcon className="h-4 w-4" />
        {branch.phone}
      </p>
    </div>
  )
}

export default function HomePage() {
  const [produits, setProduits] = useState([])

  useEffect(() => {
    publicAPI.getProduits().then(r => setProduits(r.data)).catch(() => setProduits([]))
  }, [])

  const featured = useMemo(() => produits.slice(0, 4), [produits])

  return (
    <PublicLayout>
      <main>
        <section className="relative flex min-h-[620px] items-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/68" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl text-white">
              <BrandLogo className="mb-6 h-24 w-80 rounded-3xl bg-white/95 p-2 shadow-2xl shadow-slate-950/30 sm:w-96" />
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-blue-300" />
                {companyInfo.category}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                {companyInfo.officialName}
              </h1>
              <p className="mt-5 text-lg text-blue-50 max-w-2xl">
                Comptoir d’aluminium et acier avec agences visibles à Sfax, Gabes et Djerba. Consultez les produits disponibles, créez votre compte client et envoyez une demande d’achat à l’équipe C2A.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" className="btn-primary inline-flex items-center gap-2 py-3">
                  Se connecter <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link to="/register-client" className="btn-secondary border-white bg-white py-3">
                  Créer un compte client
                </Link>
                <Link to="/catalogue" className="inline-flex items-center justify-center rounded-xl border border-white/70 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                  Voir les produits
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="section-eyebrow">Services</p>
              <h2 className="section-title">Une présence C2A entre Sfax, Gabes et Djerba</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(({ title, text, icon: Icon }) => (
                <div key={title} className="card">
                  <Icon className="w-8 h-8 text-blue-700" />
                  <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <p className="section-eyebrow">Agences</p>
              <h2 className="section-title">Coordonnées officielles visibles</h2>
              <p className="section-muted">Informations reprises depuis la page Facebook officielle fournie.</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {companyInfo.branches.map(branch => <BranchCard key={branch.city} branch={branch} />)}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="section-eyebrow">Produits</p>
                <h2 className="section-title">Produits disponibles</h2>
              </div>
              <Link to="/catalogue" className="btn-secondary inline-flex items-center gap-2">
                Voir tout le catalogue <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.length > 0 ? featured.map(p => <ProductMiniCard key={p.id} produit={p} />) : (
                <div className="card border-dashed text-center text-slate-500 lg:col-span-4">
                  Aucun produit public disponible pour le moment.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  )
}
