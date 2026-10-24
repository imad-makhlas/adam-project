# NOIRÂME Catalog Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static perfume catalog with a Cloudflare D1-backed catalog and add a single-administrator interface for creating, editing, hiding, deleting, and illustrating products through Cloudinary.

**Architecture:** Keep the React 19/Vite storefront and add a Cloudflare Worker in the same deployment. The Worker owns all D1 and Cloudinary-secret operations; the browser reads products through same-origin JSON endpoints and uploads signed images directly to Cloudinary. Cloudflare Access protects `/admin` and `/api/admin/*` in production, while local development stays usable without an account login.

**Tech Stack:** React 19, TypeScript, Vite, Cloudflare Vite plugin, Cloudflare Workers, D1, Cloudinary signed uploads, TanStack React Query, React Hook Form, Zod, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-23-noirame-catalog-admin-design.md`

## Global Constraints

- Do not run Git commands or create commits; the owner will manage Git manually.
- Do not place Cloudinary secrets in frontend code, checked-in files, tests, or browser responses.
- Preserve the current French-only storefront, WhatsApp checkout, square-corner visual language, and responsive behavior.
- Use D1 as the runtime source of truth. Static product data may remain only as migration seed data until the migration is complete.
- Admin writes are same-origin and protected by Cloudflare Access in production. Local development is intentionally open only on the developer machine.
- Perform schema validation at both the form boundary and Worker boundary; never trust browser input.

## Review Focus

The final review must explicitly verify these highest-risk behaviors:

1. A deleted or unavailable product already present in local storage is removed before checkout and never appears in the WhatsApp message.
2. Duplicate slugs return a stable `409` response and do not partially modify D1.
3. Product creation/editing rejects invalid prices, missing fields, malformed notes, and invalid image metadata on both client and server.
4. Replacing an image saves the new product state before deleting the old Cloudinary asset; a cleanup failure is reported without losing the product update.
5. Production admin endpoints fail closed behind Cloudflare Access, while no Cloudinary secret reaches client bundles or API responses.

---

## File Structure

### Runtime and data

- `wrangler.jsonc` — Worker entry point, static asset SPA settings, D1 binding, environment markers.
- `worker/index.ts` — request router and JSON error boundary.
- `worker/env.ts` — typed Worker bindings.
- `worker/http.ts` — JSON response helpers and route parsing.
- `worker/auth.ts` — production Access-header guard for admin endpoints.
- `worker/products/repository.ts` — prepared D1 statements and row-to-product mapping.
- `worker/products/routes.ts` — public and admin product endpoint handlers.
- `worker/cloudinary/signature.ts` — deterministic Cloudinary signing helpers.
- `worker/cloudinary/routes.ts` — signature and asset-destruction handlers.
- `migrations/0001_products.sql` — schema, indexes, constraints, and six initial products.
- `.dev.vars.example` — secret names only, never real values.

### Shared catalog and storefront

- `src/features/catalog/product-schema.ts` — `Product`, create/update inputs, and Zod schemas shared by browser and Worker.
- `src/features/catalog/api.ts` — typed public/admin HTTP calls.
- `src/features/catalog/queries.ts` — React Query keys, public query, admin queries, and mutation hooks.
- `src/features/cart/cart.ts` — persisted-line parsing and catalog reconciliation.
- `src/features/cart/CartContext.tsx` — dynamic available-product enforcement.
- `src/features/cart/cart-context.ts` — expose catalog reconciliation.
- `src/App.tsx` — select storefront or admin shell and render loading/error states.
- `src/components/CollectionSection.tsx` — accept fetched products.
- `src/components/BagDrawer.tsx` — resolve lines and prices from fetched products.
- `src/data/products.ts` — remove after D1 seed and shared type migration are complete.

### Admin UI

- `src/admin/AdminApp.tsx` — admin page orchestration.
- `src/admin/ProductList.tsx` — compact catalog list and actions.
- `src/admin/ProductForm.tsx` — shared create/edit form and image preview.
- `src/admin/cloudinary-upload.ts` — signed browser upload and typed result.
- `src/admin/admin.css` — square-corner responsive admin styles.

### Tests and configuration

- `vitest.config.ts` — retain browser/component test project.
- `vitest.worker.config.ts` — isolated Cloudflare Worker/D1 test project.
- `worker/products/repository.test.ts` — real local D1 CRUD and conflict coverage.
- `worker/index.test.ts` — route, validation, auth-boundary, and cleanup-result coverage.
- `worker/cloudinary/signature.test.ts` — deterministic signing tests.
- `src/features/catalog/product-schema.test.ts` — shared validation coverage.
- `src/features/catalog/api.test.ts` — response/error mapping.
- `src/admin/AdminApp.test.tsx` — admin create/edit/delete flows.
- `src/App.test.tsx` — fetched storefront and loading/error behavior.
- `src/features/cart/cart.test.ts` — stale/unavailable line reconciliation.

---

### Task 1: Add the Cloudflare runtime and shared product contract

**Files:**

- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Modify: `.gitignore`
- Create: `wrangler.jsonc`
- Create: `.dev.vars.example`
- Create: `worker/env.ts`
- Create: `src/features/catalog/product-schema.ts`
- Create: `src/features/catalog/product-schema.test.ts`

**Interfaces:**

```ts
export const audienceSchema: z.ZodEnum<['femme', 'homme']>
export const productInputSchema: z.ZodObject<...>
export const productSchema: z.ZodObject<...>
export type Product = z.infer<typeof productSchema>
export type ProductInput = z.infer<typeof productInputSchema>

export interface Env {
  DB: D1Database
  ASSETS: Fetcher
  ENVIRONMENT: 'development' | 'production'
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
}
```

- [ ] Add failing schema tests for a valid product, exactly three trimmed notes, positive integer MAD price, allowed audience, valid HTTPS/local image URL, and rejected unknown fields.
- [ ] Run `npm test -- src/features/catalog/product-schema.test.ts` and confirm the missing schema causes failure.
- [ ] Implement the shared Zod schemas and export inferred types. Keep public products shaped as `{ id, slug, name, audience, size, price, description, notes, image, cloudinaryPublicId, available, sortOrder }`.
- [ ] Run the schema test and confirm it passes.
- [ ] Install `@cloudflare/vite-plugin`, `wrangler`, `@cloudflare/workers-types`, and the Cloudflare Vitest pool as development dependencies.
- [ ] Configure the Cloudflare Vite plugin, Worker type inclusion, SPA asset fallback, `DB` binding placeholder, and a non-secret `.dev.vars.example`.
- [ ] Add `.dev.vars` and Wrangler local-state folders to `.gitignore`.
- [ ] Run `npm run typecheck` and `npm run build`; resolve configuration errors before continuing.

### Task 2: Create and seed the D1 product database

**Files:**

- Create: `migrations/0001_products.sql`
- Create: `worker/products/repository.ts`
- Create: `worker/products/repository.test.ts`
- Create: `vitest.worker.config.ts`
- Modify: `package.json`

**Interfaces:**

```ts
export type ProductRow = {
  id: string
  slug: string
  name: string
  audience: 'femme' | 'homme'
  size: string
  price_mad: number
  description: string
  notes_json: string
  image_url: string
  cloudinary_public_id: string | null
  available: 0 | 1
  sort_order: number
  created_at: string
  updated_at: string
}

export function listProducts(db: D1Database, includeUnavailable?: boolean): Promise<Product[]>
export function createProduct(db: D1Database, input: ProductInput): Promise<Product>
export function updateProduct(db: D1Database, id: string, input: ProductInput): Promise<Product | null>
export function deleteProduct(db: D1Database, id: string): Promise<Product | null>
```

- [ ] Write the migration with constraints for audience, availability, non-negative ordering, positive price, unique slug, plus ordering and availability indexes.
- [ ] Seed the six current products with their current IDs, French copy, local image URLs, availability, and deterministic sort order.
- [ ] Add failing real-D1 tests for ordered public listing, full admin listing, creation, update, deletion, missing ID, and duplicate slug.
- [ ] Run `npm run test:worker -- worker/products/repository.test.ts` and confirm repository imports/behavior fail.
- [ ] Implement row mapping and CRUD with prepared statements and bound values only. Convert `notes_json`, `available`, and snake_case columns at the repository boundary.
- [ ] Translate D1 unique-constraint errors into a typed `ProductConflictError` so the route layer can return `409`.
- [ ] Run the repository tests and confirm all pass against the local migration.

### Task 3: Expose the public and admin product API

**Files:**

- Create: `worker/http.ts`
- Create: `worker/auth.ts`
- Create: `worker/products/routes.ts`
- Create: `worker/index.ts`
- Create: `worker/index.test.ts`
- Modify: `wrangler.jsonc`

**Interfaces:**

```ts
export type ApiError = { error: { code: string; message: string; fields?: Record<string, string[]> } }
export function requireAdminAccess(request: Request, env: Env): Response | null
export default { fetch(request: Request, env: Env): Promise<Response> }
```

- [ ] Add failing request tests for `GET /api/products`, admin list/create/update/delete, `400` validation details, `404`, `409`, unsupported methods, and production requests without the Access assertion header.
- [ ] Run the Worker test file and confirm routing is absent.
- [ ] Implement exact route matching for the approved endpoints and a JSON-only error boundary; never pass exception strings or SQL details to the browser.
- [ ] Validate JSON bodies with `productInputSchema`, return `201` for create, `200` for read/update/delete, `400` for malformed input, `404` for missing products, and `409` for slug conflicts.
- [ ] In production, reject `/api/admin/*` requests missing Cloudflare's Access assertion header; document that the edge Access policy remains the actual authentication boundary.
- [ ] Delegate non-API requests to `env.ASSETS.fetch(request)` so `/admin` receives the SPA entry point.
- [ ] Run Worker tests, then `npm run typecheck` and `npm run build`.

### Task 4: Load the storefront catalog from the API and reconcile the cart

**Files:**

- Create: `src/features/catalog/api.ts`
- Create: `src/features/catalog/api.test.ts`
- Create: `src/features/catalog/queries.ts`
- Modify: `src/features/cart/cart.ts`
- Modify: `src/features/cart/cart.test.ts`
- Modify: `src/features/cart/cart-context.ts`
- Modify: `src/features/cart/CartContext.tsx`
- Modify: `src/components/CollectionSection.tsx`
- Modify: `src/components/BagDrawer.tsx`
- Modify: `src/components/ProductCard.tsx`
- Modify: `src/components/ProductModal.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Delete: `src/data/products.ts`

**Interfaces:**

```ts
export async function fetchProducts(signal?: AbortSignal): Promise<Product[]>
export function useProducts(): UseQueryResult<Product[]>
export function reconcileBag(lines: BagLine[], availableIds: ReadonlySet<string>): BagLine[]

export type CartContextValue = {
  // existing members
  reconcile: (availableIds: ReadonlySet<string>) => void
}
```

- [ ] Add failing API tests for a valid product list, non-OK JSON errors, network failure, and malformed success payload.
- [ ] Add failing cart tests showing syntactically valid persisted lines load before the catalog, then deleted/unavailable IDs are removed after reconciliation.
- [ ] Update component tests to mock `/api/products`; add explicit loading, retryable error, successful collection, and stale-cart-to-WhatsApp cases.
- [ ] Run the targeted browser tests and confirm failures against the static catalog.
- [ ] Implement `fetchProducts`, stable React Query keys, and a public catalog query with bounded retry behavior.
- [ ] Refactor the cart to validate stored line shape independently, then reconcile against the fetched available IDs. Prevent `add()` for IDs outside the current available set.
- [ ] Pass fetched products explicitly into collection, modal, and bag components; calculate totals and WhatsApp details only from currently available fetched products.
- [ ] Show a French loading state and a French retry action on catalog failure. Do not fall back to fake product data.
- [ ] Remove `src/data/products.ts` only after every runtime import uses the shared schema type and fetched catalog.
- [ ] Run all browser tests, typecheck, lint, and build.

### Task 5: Build the single-admin product management page

**Files:**

- Create: `src/admin/AdminApp.tsx`
- Create: `src/admin/ProductList.tsx`
- Create: `src/admin/ProductForm.tsx`
- Create: `src/admin/AdminApp.test.tsx`
- Create: `src/admin/admin.css`
- Modify: `src/features/catalog/api.ts`
- Modify: `src/features/catalog/api.test.ts`
- Modify: `src/features/catalog/queries.ts`
- Modify: `src/App.tsx`

**Interfaces:**

```ts
export async function fetchAdminProducts(): Promise<Product[]>
export async function createAdminProduct(input: ProductInput): Promise<Product>
export async function updateAdminProduct(id: string, input: ProductInput): Promise<Product>
export async function deleteAdminProduct(id: string): Promise<{ product: Product; imageCleanupPending?: boolean }>
```

- [ ] Add failing admin API tests for create/update/delete success and normalized `400`/`404`/`409` errors.
- [ ] Add failing UI tests for listing unavailable products, opening a blank form, editing an existing product, field errors, save success, cancel, explicit delete confirmation, conflict feedback, and query invalidation.
- [ ] Run the targeted tests and confirm the admin UI is missing.
- [ ] Route `window.location.pathname === '/admin'` to `AdminApp`; keep the public path unchanged and avoid adding a router dependency for two entry states.
- [ ] Implement a compact square-corner list with availability status and actions. Use one accessible form for create/edit with name, slug, audience, size, MAD price, description, three notes, availability, order, and image metadata.
- [ ] Use React Hook Form plus the shared Zod input schema. Map server field errors back to their controls and show French success/error notices.
- [ ] Implement delete as an explicit in-page confirmation naming the product; disable duplicate submissions during pending mutations.
- [ ] Invalidate both admin and public product query keys after successful mutations.
- [ ] Verify keyboard focus, labels, mobile/tablet layout, and no rounded visual treatment.
- [ ] Run admin tests, all browser tests, lint, typecheck, and build.

### Task 6: Add signed Cloudinary upload and safe image cleanup

**Files:**

- Create: `worker/cloudinary/signature.ts`
- Create: `worker/cloudinary/signature.test.ts`
- Create: `worker/cloudinary/routes.ts`
- Create: `src/admin/cloudinary-upload.ts`
- Modify: `worker/index.ts`
- Modify: `worker/index.test.ts`
- Modify: `src/admin/ProductForm.tsx`
- Modify: `src/admin/AdminApp.test.tsx`
- Modify: `.dev.vars.example`

**Interfaces:**

```ts
export type CloudinarySignatureResponse = {
  cloudName: string
  apiKey: string
  timestamp: number
  folder: 'noirame/products'
  signature: string
}

export function signCloudinaryParameters(
  parameters: Record<string, string | number | boolean>,
  apiSecret: string,
): Promise<string>

export async function uploadProductImage(file: File): Promise<{
  imageUrl: string
  publicId: string
}>
```

- [ ] Add failing deterministic signature tests using a fixed timestamp and sorted Cloudinary parameters.
- [ ] Add failing Worker tests proving the signature response omits `apiSecret`, destruction is signed server-side, encoded public IDs are decoded safely, and Cloudinary failures return stable errors.
- [ ] Add failing UI tests for file type/size rejection, preview, upload progress state, upload failure, successful product save, image replacement ordering, and orphan-cleanup warning.
- [ ] Run targeted tests and confirm Cloudinary functions are absent.
- [ ] Implement short-lived signed upload parameters limited to the `noirame/products` folder; return only cloud name, API key, timestamp, folder, and signature.
- [ ] Upload the file directly from the browser to Cloudinary and validate the returned `secure_url` and `public_id` before placing them in the form.
- [ ] On replacement, save the product with the new image first and only then call the old-image delete endpoint. On failed product save, offer/attempt cleanup of the newly uploaded orphan and show a recoverable French warning.
- [ ] On product deletion, delete the D1 row first, then destroy the Cloudinary asset with invalidation. Return `imageCleanupPending: true` when database deletion succeeds but image cleanup fails.
- [ ] Confirm local placeholder images with `cloudinaryPublicId: null` are never sent to Cloudinary deletion.
- [ ] Run Cloudinary, Worker, admin, and complete test suites; then lint, typecheck, and build.

### Task 7: Validate the complete local flow and prepare production handoff

**Files:**

- Modify: `package.json`
- Modify: `wrangler.jsonc`
- Modify: `.dev.vars.example`
- Modify: `docs/superpowers/specs/2026-10-23-noirame-catalog-admin-design.md` only if implementation decisions require an approved correction

- [ ] Add scripts for local D1 migration, local Worker/Vite development, Worker tests, and a combined verification command.
- [ ] Start the local Cloudflare development server and apply the migration to the local D1 database.
- [ ] Manually verify, in order: public catalog load; add to cart; admin create; public refresh; admin edit; unavailable removal from cart; image upload with test credentials when available; product delete; WhatsApp message contents.
- [ ] Inspect the production client bundle and API fixtures for `CLOUDINARY_API_SECRET` and ensure it is absent.
- [ ] Run `npm test`, `npm run test:worker`, `npm run lint`, `npm run typecheck`, and `npm run build` from a clean process and record the results.
- [ ] Stop before production deployment. Request the buyer/admin email, Cloudflare D1 database ID, Cloudinary credentials through local secret entry, Access policy setup, and the selected domain only when the owner is ready for deployment.

---

## Plan Self-Review

- Spec coverage: D1 CRUD, a single admin, signed Cloudinary uploads/deletion, public catalog migration, stale cart handling, Access boundary, local-first development, and production handoff are all mapped to tasks.
- Dependency order: shared schema precedes D1; D1 precedes routes; public API precedes admin UI; CRUD precedes Cloudinary lifecycle; deployment configuration is last.
- Type consistency: `Product` and `ProductInput` have one Zod-derived definition consumed by Worker, queries, storefront, cart, and admin.
- Risk coverage: every item in **Review Focus** has an explicit automated or manual verification step.
- Scope control: no router, custom authentication database, payment provider, order database, multi-admin roles, or deployment is introduced.
