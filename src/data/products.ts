import type { Audience } from '../features/catalog/catalog'

export type Product = {
  id: string
  name: string
  audience: Audience
  size: string
  price: number
  description: string
  notes: [string, string, string]
  image: string
  available: boolean
  imageTone: 'soft' | 'light' | 'dark' | 'deep' | 'warm' | 'cool'
}

export const products: Product[] = [
  {
    id: 'ame-blanche',
    name: 'Âme Blanche',
    audience: 'femme',
    size: '50 ml',
    price: 690,
    description: 'Une lumière douce, propre et enveloppante.',
    notes: ['Bergamote', 'Iris', 'Musc blanc'],
    image: '/assets/parfum-femme.png',
    available: true,
    imageTone: 'soft',
  },
  {
    id: 'fleur-de-minuit',
    name: 'Fleur de Minuit',
    audience: 'femme',
    size: '50 ml',
    price: 760,
    description: 'Floral sombre, sensuel et inoubliable.',
    notes: ['Rose noire', 'Jasmin', 'Vanille'],
    image: '/assets/parfum-femme.png',
    available: true,
    imageTone: 'warm',
  },
  {
    id: 'velours-iris',
    name: 'Velours Iris',
    audience: 'femme',
    size: '50 ml',
    price: 720,
    description: 'Une signature poudrée au sillage feutré.',
    notes: ['Poire', 'Iris', 'Santal'],
    image: '/assets/parfum-femme.png',
    available: true,
    imageTone: 'light',
  },
  {
    id: 'bois-noir',
    name: 'Bois Noir',
    audience: 'homme',
    size: '75 ml',
    price: 740,
    description: 'Boisé, précis et profondément moderne.',
    notes: ['Poivre noir', 'Cèdre', 'Vétiver'],
    image: '/assets/parfum-homme.png',
    available: true,
    imageTone: 'dark',
  },
  {
    id: 'ombre',
    name: 'Ombre',
    audience: 'homme',
    size: '75 ml',
    price: 790,
    description: 'Une présence fumée qui reste sur la peau.',
    notes: ['Encens', 'Cuir', 'Ambre'],
    image: '/assets/parfum-homme.png',
    available: true,
    imageTone: 'deep',
  },
  {
    id: 'atlas',
    name: 'Atlas',
    audience: 'homme',
    size: '75 ml',
    price: 710,
    description: 'Frais au départ, minéral dans son sillage.',
    notes: ['Citron', 'Cyprès', 'Musc'],
    image: '/assets/parfum-homme.png',
    available: true,
    imageTone: 'cool',
  },
]
