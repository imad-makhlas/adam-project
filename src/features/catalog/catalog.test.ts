import { describe, expect, it } from 'vitest'
import { filterByAudience } from './catalog'

const products = [
  { id: 'f-1', audience: 'femme' as const, available: true },
  { id: 'f-2', audience: 'femme' as const, available: false },
  { id: 'h-1', audience: 'homme' as const, available: true },
]

describe('catalogue filtering', () => {
  it('keeps unavailable products visible for the requested audience', () => {
    expect(filterByAudience(products, 'femme').map((product) => product.id)).toEqual(['f-1', 'f-2'])
  })
})
