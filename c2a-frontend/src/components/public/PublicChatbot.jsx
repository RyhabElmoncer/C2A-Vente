import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { companyInfo } from '../../data/companyInfo'

const welcomeMessage = {
  id: 'welcome',
  from: 'bot',
  text: 'Bonjour, je suis l’assistant C2A. Comment puis-je vous aider ?',
}

const agencyText = companyInfo.branches
  .map(branch => `${branch.city} : ${branch.address} - Tél. ${branch.phone}`)
  .join(' | ')

const quickQuestions = [
  {
    label: 'Voir les produits',
    answer: `Vous pouvez consulter le catalogue public ${companyInfo.shortName} pour voir les produits disponibles, leurs prix et le stock affiché.`,
    actions: [{ label: 'Ouvrir le catalogue', to: '/catalogue' }],
  },
  {
    label: 'Comment demander un achat ?',
    answer: 'Pour demander un achat, créez un compte client ou connectez-vous, puis choisissez un produit et envoyez votre demande depuis votre espace client.',
    actions: [
      { label: 'Créer un compte', to: '/register-client' },
      { label: 'Se connecter', to: '/login' },
    ],
  },
  {
    label: 'Quels sont vos contacts ?',
    answer: `${companyInfo.officialName}. Coordonnées visibles : ${agencyText}. Contact principal visible : ${companyInfo.primaryPhone}.`,
    actions: [{ label: 'Voir le site', to: '/' }],
  },
  {
    label: 'Comment créer un compte client ?',
    answer: 'Cliquez sur “Créer un compte”, remplissez vos informations client, puis connectez-vous avec votre email et votre mot de passe.',
    actions: [{ label: 'Inscription client', to: '/register-client' }],
  },
  {
    label: 'Quels produits vendez-vous ?',
    answer: `${companyInfo.officialName} est présenté comme un comptoir d’aluminium et acier. Le catalogue public affiche les produits disponibles dans l’application.`,
    actions: [{ label: 'Voir les produits', to: '/catalogue' }],
  },
]

function MessageBubble({ message }) {
  const isBot = message.from === 'bot'

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
          isBot
            ? 'border border-slate-200 bg-white text-slate-700 shadow-sm'
            : 'bg-blue-700 text-white shadow-lg shadow-blue-700/20'
        }`}
      >
        <p>{message.text}</p>
        {message.actions?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map(action => (
              <Link key={action.to} to={action.to} className="action-chip bg-blue-50 text-blue-800">
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PublicChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([welcomeMessage])

  const handleQuestion = (question) => {
    const time = Date.now()
    setMessages(current => [
      ...current,
      { id: `user-${time}`, from: 'user', text: question.label },
      { id: `bot-${time}`, from: 'bot', text: question.answer, actions: question.actions },
    ])
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <section className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-950/25 transition-all duration-200">
          <header className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black">Assistant C2A</p>
                <p className="text-xs text-slate-300">Réponses rapides client</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Fermer le chatbot"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </header>

          <div className="max-h-[26rem] overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Questions rapides</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map(question => (
                  <button
                    key={question.label}
                    type="button"
                    onClick={() => handleQuestion(question)}
                    className="action-chip"
                  >
                    {question.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <footer className="grid grid-cols-3 gap-2 border-t border-slate-200 bg-white px-3 py-3">
            <Link to="/catalogue" className="btn-secondary px-2 py-2 text-xs">Catalogue</Link>
            <Link to="/register-client" className="btn-primary px-2 py-2 text-xs">Inscription</Link>
            <Link to="/login" className="btn-secondary px-2 py-2 text-xs">Connexion</Link>
          </footer>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-2xl shadow-blue-900/30 transition-all duration-200 hover:-translate-y-1 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
        aria-label={open ? 'Fermer le chatbot C2A' : 'Ouvrir le chatbot C2A'}
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <ChatBubbleLeftRightIcon className="h-7 w-7 transition group-hover:scale-110" />}
      </button>
    </div>
  )
}
