# BeHip convertisseur-video-mpquality

Convertisseur vidéo en ligne (YouTube, TikTok, Vimeo, Instagram) avec options MP3/MP4/AVI et qualité basse/moyenne/haute.

**Liste détaillée du dossier :** voir [CONTENU_DOSSIER.md](CONTENU_DOSSIER.md).

## Contenu

- **index.html** – Page principale (recherche URL, preview, conversion, téléchargement)
- **admin.html** – Gestionnaire de publicité (offres marketing, emplacements publicitaires)

## Admin publicité

- **Accès :** [admin.html](admin.html) ou lien « Admin pub » en bas de la page convertisseur
- **Mot de passe par défaut :** `behip2025` (modifiable dans Admin → Paramètres)
- **Fonctions :**
  - **Offres marketing** : ajouter des contacts (nom, société, offre, statut) pour négocier avec des partenaires
  - **Emplacements publicitaires** : gérer les slots (nom, dimensions, statut, notes)
  - **Export JSON** : sauvegarder les données (offres + slots)
  - **Changer le mot de passe admin** dans Paramètres

Les données sont stockées dans le navigateur (localStorage). Pour une sauvegarde pérenne, utiliser régulièrement « Exporter les données (JSON) ».

## Test local

1. Ouvrir `index.html` dans un navigateur (double-clic ou `file:///.../convertisseur/index.html`)
2. Pour tester l’admin : ouvrir `admin.html`, mot de passe `behip2025`
3. Si CORS bloque les requêtes (API get-video), lancer un serveur local (ex. `npx serve .` dans le dossier convertisseur) ou déployer sur Vercel

## Déploiement (Vercel)

- Déployer le dossier **convertisseur** (ou le projet avec `convertisseur` en racine)
- Les fonctions serverless se trouvent dans `api/get-video.js` (à créer si besoin pour l’extraction vidéo)
