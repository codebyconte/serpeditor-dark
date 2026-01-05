import type { Metadata } from 'next'
import { FormRegister } from './form-register'

export const metadata: Metadata = {
  title: 'Inscription sur Serpeditor | Outil SEO et analyse de mots-clés',
  description:
    'Créez votre compte Serpeditor pour accéder à nos outils SEO puissants. Analysez vos mots-clés, suivez vos positions et améliorez votre trafic dès aujourd’hui.',
}

export default function RegisterPage() {
  return <FormRegister />
}
