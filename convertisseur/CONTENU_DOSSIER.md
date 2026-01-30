# BeHip convertisseur-video-mpquality — Contenu du dossier

Dossier complet du projet : convertisseur vidéo en ligne + administration publicité.

---

## Structure des fichiers

```
convertisseur/
├── index.html              # Page principale (recherche URL, preview, conversion, téléchargement)
├── admin.html              # Gestionnaire de publicité (offres marketing, slots)
├── css/
│   ├── style.css           # Styles de l’application (thème magenta, responsive)
│   └── admin.css           # Styles de la page admin (tableaux, formulaires)
├── js/
│   ├── app.js              # Logique convertisseur (URL, preview, ffmpeg, téléchargement)
│   └── admin.js            # Logique admin (connexion, offres, slots, export)
├── assets/
│   ├── .gitkeep            # Placeholder (placer logo.png ici pour le header)
│   └── logo.png            # Logo BeHip (à ajouter si vous l’avez)
├── README.md               # Présentation du projet et accès admin
├── DEPLOY_GITLAB.md        # Instructions pour pousser le projet sur GitLab
└── CONTENU_DOSSIER.md      # Ce fichier — liste du contenu du dossier
```

---

## Rôle des fichiers

| Fichier | Rôle |
|---------|------|
| **index.html** | Page d’accueil : barre de recherche (URL YouTube, TikTok, Vimeo, Instagram), zone preview (iframe), flèche de téléchargement, options format/qualité, progression, bandeau pub, footer avec lien Admin. |
| **admin.html** | Page admin : connexion par mot de passe (`behip2025` par défaut), gestion des offres marketing (contacts, statut), gestion des emplacements publicitaires (slots), export JSON, changement de mot de passe. |
| **css/style.css** | Thème magenta, mise en page responsive, styles des boutons, preview, flèche verte, options, barre de progression, footer. |
| **css/admin.css** | Styles de l’admin : formulaire de connexion, tableaux d’offres, cartes de slots, formulaires. |
| **js/app.js** | Détection d’URL (YouTube, Vimeo, TikTok, Instagram), affichage de la preview (iframe), appel API get-video, conversion ffmpeg.wasm (MP3/MP4/AVI, qualité), téléchargement, annulation. |
| **js/admin.js** | Authentification (localStorage/sessionStorage), CRUD offres et slots (localStorage), export JSON, changement de mot de passe admin. |
| **assets/** | Dossier pour les images (logo BeHip en `logo.png` pour le header). |

---

## Documentation

| Fichier | Contenu |
|---------|---------|
| **README.md** | Description du projet, accès admin (mot de passe, fonctions), test local, déploiement Vercel. |
| **DEPLOY_GITLAB.md** | Commandes pour ajouter le remote GitLab, committer et pousser (remplacer TON-GROUPE / TON-PROJET par vos valeurs). |

---

## Utilisation rapide

1. **Ouvrir le convertisseur** : double-clic sur `index.html` ou ouvrir via un serveur local.
2. **Accéder à l’admin** : ouvrir `admin.html` ou cliquer sur « Admin pub » en bas de la page convertisseur → mot de passe `behip2025`.
3. **Logo** : placer le fichier `logo.png` (logo BeHip) dans le dossier `assets/` pour l’afficher dans le header.

---

## Déploiement

- **GitLab** : suivre les instructions dans `DEPLOY_GITLAB.md` (remplacer l’URL du dépôt).
- **Vercel** : déployer le dossier `convertisseur` en racine du projet ; prévoir une API (ex. `api/get-video.js`) pour l’extraction vidéo si besoin.

---

*Dossier prêt à l’emploi — BeHip convertisseur-video-mpquality*
