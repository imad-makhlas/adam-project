# NOIRÂME — Catalogue administrable

## Objectif

Transformer le catalogue React actuellement statique en catalogue administrable par une seule personne. L’administrateur pourra ajouter, modifier, masquer et supprimer un parfum, ainsi que téléverser ou remplacer son image. Le panier local et la commande WhatsApp restent inchangés pour les visiteurs.

Le développement doit fonctionner localement avant que les comptes Cloudflare et Cloudinary du client soient disponibles. Aucun déploiement, achat de domaine ou changement Git n’entre dans cette étape.

## Architecture retenue

- React 19 + Vite reste l’interface publique et administrative.
- Le plugin Vite officiel Cloudflare permet de livrer le SPA et un Worker API dans le même projet.
- Cloudflare D1 devient la source de vérité du catalogue.
- Cloudinary stocke et transforme les images produits.
- TanStack Query charge et invalide le catalogue côté React.
- Zod valide les données dans le formulaire et dans le Worker.
- Cloudflare Access protégera `/admin` et `/api/admin/*` en production pour l’unique adresse e-mail du client.

En local, l’administration est disponible uniquement dans le serveur de développement. Aucun mot de passe temporaire ou secret de production ne sera codé dans le dépôt.

## Modèle de données

Table `products` :

- `id` : identifiant texte stable utilisé par le panier.
- `slug` : identifiant lisible et unique.
- `name` : nom commercial.
- `audience` : `femme` ou `homme`.
- `size` : format affiché, par exemple `50 ml`.
- `price_mad` : prix entier en dirhams.
- `description` : description courte.
- `notes_json` : tableau JSON de trois notes.
- `image_url` : URL de livraison Cloudinary ou chemin local initial.
- `cloudinary_public_id` : identifiant nécessaire au remplacement et à la suppression de l’image, nullable pour les images initiales.
- `available` : disponibilité commerciale.
- `sort_order` : ordre d’affichage.
- `created_at` et `updated_at` : dates ISO.

Une migration D1 crée la table et insère les six parfums actuels. Les identifiants restent inchangés afin que les paniers enregistrés continuent de fonctionner.

## API

API publique :

- `GET /api/products` retourne uniquement les produits destinés au catalogue, triés par audience puis par `sort_order`.

API administrateur :

- `GET /api/admin/products` retourne tous les produits.
- `POST /api/admin/products` crée un produit.
- `PUT /api/admin/products/:id` modifie un produit.
- `DELETE /api/admin/products/:id` supprime le produit après confirmation.
- `POST /api/admin/cloudinary/signature` retourne les paramètres d’un upload signé.
- `DELETE /api/admin/cloudinary/:publicId` supprime une image inutilisée.

Toutes les écritures sont validées côté Worker. Les requêtes SQL utilisent des paramètres préparés. Les secrets Cloudinary restent exclusivement dans les secrets Cloudflare.

## Gestion des images

Le navigateur demande d’abord une signature au Worker, puis envoie directement le fichier à Cloudinary. Après succès, l’interface enregistre `secure_url` et `public_id` dans D1.

Lors d’un remplacement, la nouvelle image est enregistrée avant la suppression de l’ancienne afin d’éviter un produit sans image en cas d’échec. Lors de la suppression d’un produit, l’enregistrement D1 est supprimé puis l’image Cloudinary associée est invalidée. Une erreur Cloudinary ne restaure pas le produit : elle est signalée dans l’administration pour permettre un nettoyage ultérieur.

## Interface administrateur

La route `/admin` contient :

- une liste compacte des produits avec image, nom, prix, disponibilité et actions ;
- un formulaire partagé pour l’ajout et la modification ;
- un aperçu de la nouvelle image ;
- une confirmation explicite avant suppression ;
- des états de chargement, succès et erreur visibles.

Le formulaire contient : nom, audience, format, prix, description, trois notes, disponibilité, ordre d’affichage et image. Les angles restent droits et le langage visuel reprend le site public.

## Flux public et panier

Le catalogue public ne dépend plus de `src/data/products.ts` à l’exécution. Un hook TanStack Query charge `/api/products`. Un écran d’erreur avec bouton de nouvelle tentative remplace silencieusement les données absentes ; aucune fausse donnée n’est affichée en production.

Le panier conserve des lignes `{ productId, quantity }`. Les détails et prix sont résolus depuis le catalogue chargé. Un produit supprimé ou indisponible est retiré du panier local avant le passage à WhatsApp.

## Erreurs et sécurité

- Réponses API JSON cohérentes avec codes HTTP appropriés.
- Limite de taille et contrôle de type pour les images avant upload.
- Validation Zod côté client et serveur.
- Secrets Cloudinary absents du bundle React et des fichiers suivis.
- Protection Cloudflare Access exigée en production pour toute route administrative.
- Confirmation obligatoire pour les suppressions destructives.

## Vérification

- Tests unitaires du schéma produit et de la transformation D1.
- Tests API CRUD avec D1 local.
- Tests React du chargement public, du formulaire administrateur et de la suppression.
- Test du panier lorsqu’un produit a été supprimé ou rendu indisponible.
- ESLint, TypeScript et build Cloudflare/Vite.

## Ordre de réalisation

1. Ajouter le runtime Cloudflare local, D1, la migration et le seed.
2. Créer l’API publique et brancher le catalogue React.
3. Créer l’API CRUD et l’interface `/admin`.
4. Ajouter le flux Cloudinary signé et la gestion du remplacement/suppression.
5. Configurer les comptes du client, Cloudflare Access, les secrets, le domaine et le déploiement.

Les étapes 1 à 3 sont réalisables sans comptes externes. L’étape 4 peut être développée avec des variables d’environnement factices, mais sa validation réelle nécessite les identifiants Cloudinary. L’étape 5 nécessite les comptes et l’adresse e-mail définitive du client.
