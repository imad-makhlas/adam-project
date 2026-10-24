import { expect, test } from '@playwright/test'

test('keeps the product card and its opened detail visibly gold', async ({ page }) => {
  await page.goto('/')

  const card = page.getByRole('heading', { name: 'Âme Blanche' }).locator('xpath=ancestor::article')
  const addButton = card.getByRole('button', { name: 'Ajouter Âme Blanche au panier' })

  await expect(card).toHaveCSS('background-color', 'rgb(247, 237, 216)')
  await expect(card).toHaveCSS('border-color', 'rgb(181, 138, 58)')
  await expect(addButton).toHaveCSS('background-color', 'rgb(181, 138, 58)')
  await expect(addButton).toHaveCSS('color', 'rgb(17, 17, 17)')

  await card.getByRole('button', { name: 'Voir Âme Blanche' }).click()

  const detail = page.getByRole('dialog', { name: 'Âme Blanche' })
  await expect(detail).toHaveCSS('background-color', 'rgb(247, 237, 216)')
  await expect(detail.getByRole('button', { name: 'Ajouter au panier' })).toHaveCSS('background-color', 'rgb(181, 138, 58)')
  await expect(detail.getByRole('button', { name: 'Commander avec paiement à la livraison' })).toHaveCSS('background-color', 'rgb(181, 138, 58)')
})
