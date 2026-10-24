import { expect, test } from '@playwright/test'

test('presents the collection and prepares a WhatsApp order', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Votre présence, avant les mots.' })).toBeVisible()
  await page.getByRole('button', { name: 'Ajouter Âme Blanche au panier' }).click()
  await page.getByRole('button', { name: 'Ouvrir le panier, 1 article' }).click()
  await page.getByLabel('Nom complet').fill('Sara Amrani')
  await page.getByLabel('Téléphone').fill('0612345678')
  await page.getByLabel('Ville').fill('Rabat')
  await page.getByRole('button', { name: 'Continuer sur WhatsApp' }).click()
  await expect(page.getByLabel('Message de commande')).toContainText('Âme Blanche')
})
