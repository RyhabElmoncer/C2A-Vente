import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { publicAPI } from '../../api/services'
import PublicLayout from '../../components/public/PublicLayout'
import { SearchInput } from '../../components/ui'
import { companyInfo } from '../../data/companyInfo'

function PublicProductCard({ produit }) {
  const imageSrc = produit.emplacement || '/assets/logo/c2a-logo.jpg'
  const price = Number(produit.prixVente || 0).toFixed(3)

  return (
    <article className="product-card">
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <img
          src={imageSrc}
          alt={produit.designation || produit.reference}
          className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-105"
          onError={(event) => {
            if (event.currentTarget.src.includes('/assets/logo/c2a-logo.jpg')) return
            event.currentTarget.src = '/assets/logo/c2a-logo.jpg'
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600 shadow-sm">
          {produit.categorie || 'Catalogue'}
        </span>
      </div>
      <div className="p-5">
        <h2 className="font-bold text-slate-950">{produit.designation}</h2>
        <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
          {produit.description || 'Produit C2A disponible dans le catalogue public.'}
        </p>
        <p className="mt-3 font-mono text-xs font-bold uppercase tracking-wide text-blue-700">
          Ref. {produit.reference}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-slate-500">Prix</p>
            <p className="font-bold text-blue-700">{price} TND</p>
          </div>
          <div>
            <p className="text-slate-500">Stock</p>
            <p className="font-bold text-slate-900">{produit.stockActuel} {produit.unite}</p>
          </div>
        </div>
        <Link to="/register-client" className="btn-primary mt-5 w-full inline-flex justify-center">
          Demander achat
        </Link>
      </div>
    </article>
  )
}

export default function ProductCatalogPage() {
  const [produits, setProduits] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicAPI.getProduits()
      .then(r => setProduits(r.data))
      .catch(() => setProduits([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => produits.filter(p =>
    p.designation?.toLowerCase().includes(search.toLowerCase()) ||
    p.reference?.toLowerCase().includes(search.toLowerCase()) ||
    p.categorie?.toLowerCase().includes(search.toLowerCase())
  ), [produits, search])

  return (
    <PublicLayout>
      <main className="min-h-[70vh] bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="section-eyebrow">Catalogue public</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Catalogue {companyInfo.shortName}</h1>
            <p className="section-muted">
              Consultez les produits disponibles de {companyInfo.officialName}. Pour envoyer une demande d’achat, créez un compte client ou connectez-vous à votre espace.
            </p>
            <div className="mt-6 max-w-md">
              <SearchInput value={search} onChange={setSearch} placeholder="Référence, désignation, catégorie..." />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="loading-spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="card border-dashed text-center text-slate-500">
              Aucun produit disponible.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(p => <PublicProductCard key={p.id} produit={p} />)}
            </div>
          )}
        </section>
      </main>
    </PublicLayout>
  )
}
