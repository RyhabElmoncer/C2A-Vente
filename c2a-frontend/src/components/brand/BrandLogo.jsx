const logoSrc = '/assets/logo/c2a-logo.jpg'

export default function BrandLogo({ className = '', imageClassName = '' }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={logoSrc}
        alt="Comptoir D'aluminium et Acier C2A"
        className={`h-full w-full object-contain ${imageClassName}`}
      />
    </div>
  )
}
