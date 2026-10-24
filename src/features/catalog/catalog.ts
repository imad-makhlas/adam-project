export type Audience = 'femme' | 'homme'

export type AudienceProduct = {
  id: string
  audience: Audience
  available: boolean
}

export function filterByAudience<T extends AudienceProduct>(
  products: T[],
  audience: Audience,
): T[] {
  return products.filter((product) => product.audience === audience)
}
