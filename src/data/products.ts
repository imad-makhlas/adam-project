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

// Prix de démonstration en MAD : ils pourront être remplacés par les tarifs du propriétaire.
export const products: Product[] = [
  { id: 'miss-dior', name: 'Miss Dior', audience: 'femme', size: '100 ml', price: 899, description: 'Un bouquet floral lumineux à la douceur élégante.', notes: ['Iris', 'Pivoine', 'Muguet'], image: '/assets/miss-dior.jpeg', available: true, imageTone: 'soft' },
  { id: 'la-belle', name: 'La Belle', audience: 'femme', size: '100 ml', price: 849, description: 'Une sensualité fruitée, vanillée et généreuse.', notes: ['Poire', 'Bergamote', 'Vanille'], image: '/assets/la-belle.jpeg', available: true, imageTone: 'warm' },
  { id: 'ariana-cloud', name: 'Ariana Grande Cloud', audience: 'femme', size: '100 ml', price: 729, description: 'Un nuage gourmand, aérien et réconfortant.', notes: ['Lavande', 'Noix de coco', 'Musc'], image: '/assets/ariana-cloud.jpeg', available: true, imageTone: 'light' },
  { id: 'vanilla-base', name: 'Vanilla Base', audience: 'femme', size: '100 ml', price: 399, description: 'Une vanille moderne au fond chaud et enveloppant.', notes: ['Vanille', 'Ambre', 'Bois doux'], image: '/assets/vanilla-base.jpeg', available: true, imageTone: 'cool' },
  { id: 'lacoste-original', name: 'Lacoste Original', audience: 'homme', size: '100 ml', price: 649, description: 'Une fraîcheur aromatique nette et élégante.', notes: ['Bergamote', 'Lavande', 'Patchouli'], image: '/assets/lacoste-original.jpeg', available: true, imageTone: 'dark' },
  { id: 'mousuf', name: 'Mousuf', audience: 'homme', size: '100 ml', price: 449, description: 'Un sillage oriental riche, chaleureux et persistant.', notes: ['Oud', 'Ambre', 'Musc'], image: '/assets/mousuf.jpeg', available: true, imageTone: 'warm' },
  { id: 'lucky-intense', name: 'Lucky Intense', audience: 'homme', size: '50 ml', price: 349, description: 'Un accord boisé gourmand au caractère affirmé.', notes: ['Prune', 'Noisette', 'Cèdre'], image: '/assets/lucky-intense.jpeg', available: true, imageTone: 'deep' },
  { id: 'green-mood', name: 'Green Mood Fleur d’Oranger', audience: 'homme', size: '100 ml', price: 379, description: 'Une fraîcheur florale propre pour la maison et les textiles.', notes: ['Fleur d’oranger', 'Néroli', 'Musc blanc'], image: '/assets/green-mood.jpeg', available: true, imageTone: 'light' },
]
