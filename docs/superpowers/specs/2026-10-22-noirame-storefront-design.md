# NOIRÂME One-Page Storefront Design

## Product intent

NOIRÂME is a French-language perfume storefront for the Moroccan market. Its purpose is to attract customers with a restrained luxury presentation, help them browse separate women’s and men’s collections, and convert interest into orders through WhatsApp.

The first release is intentionally frontend-only. It does not include customer accounts, online payments, a server application, or a database.

## Success criteria

- A visitor can understand the brand and reach the perfume collection immediately.
- Women’s and men’s perfumes are easy to distinguish and browse on one page.
- A visitor can add one or more perfumes to a shopping bag.
- The shopping bag creates a clear, pre-filled WhatsApp order containing the selected products and customer details.
- Prices and delivery messaging are appropriate for Morocco and use MAD.
- The experience is fast, responsive, accessible, and especially easy to use on mobile.

## Technical foundation

The project will reuse the frontend portion of the Casa de Perla stack:

- React 19
- Vite
- TypeScript with strict type checking
- Tailwind CSS
- TanStack React Query, reserved for future remote catalogue loading
- React Hook Form and Zod for the WhatsApp checkout form
- Vitest and Testing Library for component and domain tests
- Playwright for the critical storefront and checkout journey

Spring Boot, Java, PostgreSQL, and Flyway are explicitly excluded.

## Experience and visual direction

The page uses a monochrome luxury system: a white canvas, black typography and controls, high-quality product photography, generous whitespace, and subtle grey borders. Motion should be restrained and should never delay browsing or ordering.

Typography should pair an editorial display face for the NOIRÂME name and major headings with a highly legible sans-serif for prices, product details, forms, and controls. The interface remains French-only in the first release, while customer-facing copy is kept in a central content module to make future localization straightforward.

The design must avoid unnecessary brand-story and standalone olfactory sections. Essential scent information belongs directly on each perfume card or in its product detail panel.

## Page structure

### 1. Minimal header

The header contains the NOIRÂME wordmark, anchor links for `Femme` and `Homme`, and the shopping-bag control with its current item count. On mobile, it remains compact and avoids a full navigation menu.

### 2. Hero

The hero uses one strong perfume image, a short French headline, a concise supporting line, and one primary action: `Découvrir la collection`. The action scrolls to the first product collection.

### 3. Femme collection

A responsive product grid presents women’s perfumes. Each card contains:

- Product image and accessible alternative text
- Name
- Size
- Price in MAD
- Short one-line character description
- Up to three principal scent notes
- `Ajouter au panier` action
- Direct `Commander sur WhatsApp` action

### 4. Homme collection

The men’s collection uses the same product-card structure and interaction model as the women’s collection.

### 5. Reassurance strip

A concise strip communicates only the purchasing information customers need:

- Livraison partout au Maroc
- Paiement à la livraison
- Commande confirmée via WhatsApp

Claims must match the merchant’s real operating policy before launch.

### 6. Minimal footer

The footer contains WhatsApp and Instagram links, basic contact information, and buttons that open concise delivery and return-policy dialogs. It does not add a newsletter or other lead-capture feature in the first release.

## Shopping bag and WhatsApp checkout

The shopping bag opens as a side drawer on larger screens and a bottom sheet or full-height drawer on mobile. It shows selected products, quantities, line totals, and the total in MAD. Customers can increase, decrease, or remove items.

Checkout requests only the information required to prepare the WhatsApp message:

- Full name
- Moroccan phone number
- City
- Optional delivery note

React Hook Form manages field state and Zod validates the input. Submitting the form does not create an order in the application. It constructs a URL-encoded `wa.me` link containing:

- Customer name, phone number, city, and optional note
- Each selected perfume’s name, size, quantity, and displayed price
- Displayed total in MAD

The browser then opens WhatsApp. The interface must clearly state that the order is finalized only after confirmation with the merchant on WhatsApp.

The direct WhatsApp action on a product skips the bag and opens a shorter pre-filled enquiry containing that perfume’s name and size. Customer details are collected conversationally in WhatsApp for this direct path.

## State and data boundaries

### Catalogue

The initial catalogue lives in a typed local data module. Each product has a stable ID, audience (`femme` or `homme`), name, slug, size, price in MAD, short description, up to three notes, image references, featured state, and availability state.

TanStack React Query is not needed for static local data and should not wrap it artificially. It stays in the stack for a future move to a hosted catalogue API.

### Shopping bag

A focused React context and reducer own bag operations. The stored representation contains only product IDs and quantities; names and prices are resolved from the current catalogue. Bag state persists in `localStorage`, with invalid or unavailable product IDs discarded safely during restoration.

### Content and configuration

French interface copy, the WhatsApp destination number, Instagram URL, contact details, and delivery claims live in explicit configuration modules rather than being scattered across components.

## Component boundaries

- `AppShell`: global page structure and shared providers
- `Header`: anchor navigation and bag entry point
- `Hero`: campaign image, headline, and collection action
- `CollectionSection`: section heading and filtered product grid
- `ProductCard`: compact product presentation and purchase actions
- `BagDrawer`: selected items, quantity controls, and checkout entry
- `WhatsAppCheckoutForm`: customer details and validation feedback
- `OrderSummary`: reusable bag and WhatsApp-order summary
- `TrustStrip`: delivery and payment reassurance
- `Footer`: contact and policy access

Business logic for totals, bag updates, form validation, phone normalization, and WhatsApp-message generation remains in small framework-independent modules so it can be tested without rendering the page.

## Error handling and resilience

- Broken product images display a deliberate monochrome fallback rather than a browser error icon.
- An unavailable product cannot be added and is labeled `Indisponible`.
- Invalid persisted bag data is ignored without blocking the page.
- Form errors appear next to the relevant field in French and are announced accessibly.
- If WhatsApp cannot open, the generated order text remains visible with a copy action and the merchant’s phone number.
- The app never implies that opening WhatsApp alone has confirmed an order.

## Responsive and accessibility requirements

- Mobile-first layout with comfortable touch targets and a persistent, non-obstructive bag action.
- Product images reserve their dimensions to prevent layout shifts.
- Visible keyboard focus, semantic headings, meaningful button labels, and adequate black/white contrast.
- Reduced-motion preferences disable nonessential animation.
- The page remains usable at 320 px width and scales cleanly through tablet and desktop layouts.

## Testing strategy

### Unit tests

- Bag add, remove, quantity, total, and restoration behavior
- MAD price formatting
- Moroccan phone validation and normalization
- WhatsApp message content and URL encoding
- Catalogue filtering by audience and availability

### Component tests

- Product cards expose correct information and actions
- Bag drawer reflects updates and empty state
- Checkout form reports validation errors and generates the correct handoff
- Header bag count and anchor navigation remain accurate

### End-to-end tests

- Browse from the hero to the collection
- Add products from both Femme and Homme sections
- Edit quantities and remove an item
- Complete valid customer details and reach the WhatsApp handoff
- Verify the mobile layout and keyboard-accessible purchase flow

## Performance and launch requirements

- Serve appropriately sized WebP or AVIF product imagery with lazy loading below the fold.
- Keep the initial JavaScript bundle small; no animation framework is required for the first release.
- Add French metadata, Open Graph data, a favicon, and basic structured product data where accurate.
- Configure the real WhatsApp number, Instagram account, catalogue, delivery terms, and return policy before deployment.
- Run type checking, linting, unit tests, the production build, and the critical Playwright flow before launch.

## Explicitly out of scope

- Spring Boot or any other custom backend
- PostgreSQL, Flyway, or other database infrastructure
- Customer accounts and authentication
- Online card payments
- Admin dashboard or catalogue CMS
- Standalone brand-story section
- Standalone olfactory-family section
- Reviews, loyalty, newsletter, or promotional popups
- Arabic localization in the first release

