# Rapport (1–2 pages)

## Choix de modélisation
- Normalisation jusqu'en 3NF : séparation `ouvrages`, `categories`, `users`, etc.
- Contrainte `UNIQUE (client_id, ouvrage_id)` sur `avis` pour un avis par client/ouvrage.
- Index: `idx_ouvrages_titre`, `idx_ouvrages_categorie`, `idx_commandes_client`.

## Règles métier côté DB/API
- Recherche publique des ouvrages filtre `stock > 0` (SQL dans controller).
- Création commande **transactionnelle**: décrément `stock` pour chaque item; rollback si insuffisant.
- Avis: contrôle côté API que le client a au moins une `commande_items` sur l'`ouvrage_id`.
- Commentaires: `valide=false` par défaut; endpoint de validation réservé aux rôles éditeur/gestionnaire.

## Limites et améliorations
- Pas de vrai fournisseur de paiement (simulation).
- Pas de pagination/tri avancés pour `GET /api/ouvrages` (à ajouter).
- Manque de tests automatisés et de cache.
