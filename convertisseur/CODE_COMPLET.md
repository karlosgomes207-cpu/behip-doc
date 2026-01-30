# BeHip convertisseur-video-mpquality — Code complet

Tout le code du projet en un seul fichier. Structure à respecter :

```
convertisseur/
├── index.html
├── admin.html
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── app.js
│   └── admin.js
└── assets/
    └── logo.png  (optionnel)
```

---

## 1. index.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BeHip convertisseur-video-mpquality</title>
  <link rel="stylesheet" href="css/style.css">
  <!-- ffmpeg.wasm -->
  <script src="https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/ffmpeg.min.js"></script>
</head>
<body>
  <div class="app">
    <!-- Barre de recherche -->
    <header class="header">
      <div class="logo-wrap">
        <img src="assets/logo.png" alt="BeHip" class="logo-img" width="64" height="64" />
        <h1 class="logo">BeHip convertisseur-video-mpquality</h1>
      </div>
      <p class="tagline">Convertisseur vidéo en ligne</p>
      <div class="search-wrap">
        <input
          type="url"
          id="urlInput"
          class="search-input"
          placeholder="Collez un lien (YouTube, TikTok, Vimeo, Instagram…)"
          autocomplete="url"
        />
        <button type="button" id="btnLoad" class="btn btn-load" aria-label="Charger la vidéo">
          Charger
        </button>
      </div>
      <p id="urlError" class="url-error" aria-live="polite"></p>
    </header>

    <!-- Zone preview (iframe ou thumbnail) -->
    <section class="preview-section" id="previewSection">
      <div class="preview-container" id="previewContainer">
        <div class="preview-placeholder" id="previewPlaceholder">
          <span class="placeholder-icon">▶</span>
          <p>Collez une URL et cliquez sur « Charger » pour afficher la prévisualisation.</p>
        </div>
        <iframe id="previewIframe" class="preview-iframe" title="Aperçu vidéo" hidden></iframe>
      </div>

      <!-- Flèche téléchargement (s'affiche quand la vidéo est prête) -->
      <div class="download-arrow-wrap" id="downloadArrowWrap" aria-hidden="true">
        <button type="button" id="btnDownload" class="download-arrow" aria-label="Convertir et télécharger">
          <span class="arrow-icon">↓</span>
        </button>
        <span class="arrow-label">Convertir et télécharger</span>
      </div>
    </section>

    <!-- Options : format + qualité -->
    <section class="options-section">
      <div class="option-group">
        <label for="formatSelect">Format</label>
        <select id="formatSelect" class="select">
          <option value="mp3">MP3 (audio seul)</option>
          <option value="mp4">MP4 (vidéo)</option>
          <option value="avi">AVI (vidéo)</option>
        </select>
      </div>
      <div class="option-group">
        <label for="qualitySelect">Qualité</label>
        <select id="qualitySelect" class="select">
          <option value="low">Basse (96 kbps / 480p)</option>
          <option value="medium">Moyenne (128 kbps / 720p)</option>
          <option value="high">Haute (192 kbps / 1080p)</option>
        </select>
      </div>
    </section>

    <!-- Barre de progression + Annuler -->
    <section class="progress-section" id="progressSection" hidden>
      <div class="progress-bar-wrap">
        <div class="progress-bar" id="progressBar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <p class="progress-text" id="progressText">Préparation…</p>
      <button type="button" id="btnCancel" class="btn btn-cancel">Annuler</button>
    </section>

    <!-- Bandeau AdSense (300x100) – visible jusqu'au téléchargement -->
    <aside class="adsense-wrap" id="adsenseWrap">
      <div class="adsense-placeholder" id="adsensePlaceholder">
        <span>Publicité 300×100</span>
        <small>Powered by AdSense</small>
      </div>
    </aside>

    <!-- Footer -->
    <footer class="footer">
      <p>
        Convertisseur gratuit – Suivez-moi sur TikTok :
        <a href="https://tiktok.com/@7l_lux" target="_blank" rel="noopener noreferrer">@7l_lux</a>
      </p>
      <p class="footer-powered">Powered by AdSense · <a href="admin.html" class="footer-admin">Admin pub</a></p>
    </footer>
  </div>

  <script src="js/app.js"></script>
</body>
</html>
```

---

## 2. admin.html

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin – Gestionnaire de publicité | BeHip convertisseur-video-mpquality</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/admin.css">
</head>
<body>
  <div class="app admin-app" id="adminApp">
    <!-- Écran de connexion -->
    <section class="admin-login" id="adminLogin">
      <div class="admin-login-box">
        <h1>Administration publicité</h1>
        <p class="admin-login-desc">BeHip convertisseur-video-mpquality – Gestion des offres marketing</p>
        <form id="loginForm" class="admin-form">
          <label for="adminPassword">Mot de passe admin</label>
          <input type="password" id="adminPassword" class="search-input" placeholder="Mot de passe" autocomplete="current-password" required />
          <button type="submit" class="btn btn-load">Accéder</button>
        </form>
        <p id="loginError" class="url-error" aria-live="polite"></p>
      </div>
    </section>

    <!-- Tableau de bord (après connexion) -->
    <main class="admin-dashboard" id="adminDashboard" hidden>
      <header class="admin-header">
        <div class="logo-wrap">
          <a href="index.html" class="logo-link">
            <span class="logo">BeHip convertisseur-video-mpquality</span>
          </a>
        </div>
        <nav class="admin-nav">
          <a href="index.html">← Retour convertisseur</a>
          <button type="button" id="btnLogout" class="btn btn-cancel">Déconnexion</button>
        </nav>
      </header>

      <section class="admin-section">
        <h2>Offres marketing</h2>
        <p class="admin-desc">Suivez et négociez les offres publicitaires (contacts, statut, notes).</p>
        <form id="offerForm" class="admin-form offer-form">
          <div class="form-row">
            <div class="form-group">
              <label for="offerContact">Contact / Nom</label>
              <input type="text" id="offerContact" class="search-input" placeholder="Nom ou email" required />
            </div>
            <div class="form-group">
              <label for="offerCompany">Société</label>
              <input type="text" id="offerCompany" class="search-input" placeholder="Entreprise" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="offerDescription">Offre / Description</label>
              <input type="text" id="offerDescription" class="search-input" placeholder="Type d'offre, budget, durée…" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="offerStatus">Statut</label>
              <select id="offerStatus" class="select">
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
              </select>
            </div>
            <div class="form-group form-actions">
              <button type="submit" class="btn btn-load">Ajouter l'offre</button>
            </div>
          </div>
        </form>
        <div class="offers-table-wrap">
          <table class="offers-table" id="offersTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Contact</th>
                <th>Société</th>
                <th>Offre</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="offersBody"></tbody>
          </table>
        </div>
      </section>

      <section class="admin-section">
        <h2>Emplacements publicitaires</h2>
        <p class="admin-desc">Slots disponibles pour la négociation (format, statut, notes).</p>
        <div class="slots-list" id="slotsList"></div>
        <form id="slotForm" class="admin-form slot-form">
          <div class="form-row">
            <div class="form-group">
              <label for="slotName">Nom du slot</label>
              <input type="text" id="slotName" class="search-input" placeholder="Ex. Bandeau bas 300×100" />
            </div>
            <div class="form-group">
              <label for="slotSize">Dimensions</label>
              <input type="text" id="slotSize" class="search-input" placeholder="300×100" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="slotStatus">Statut</label>
              <select id="slotStatus" class="select">
                <option value="disponible">Disponible</option>
                <option value="reserve">Réservé</option>
                <option value="actif">Actif</option>
              </select>
            </div>
            <div class="form-group">
              <label for="slotNotes">Notes</label>
              <input type="text" id="slotNotes" class="search-input" placeholder="Notes négociation" />
            </div>
            <div class="form-group form-actions">
              <button type="submit" class="btn btn-load">Ajouter le slot</button>
            </div>
          </div>
        </form>
      </section>

      <section class="admin-section">
        <h2>Paramètres</h2>
        <div class="admin-form">
          <div class="form-row">
            <div class="form-group">
              <label for="newAdminPassword">Nouveau mot de passe admin</label>
              <input type="password" id="newAdminPassword" class="search-input" placeholder="Laisser vide pour ne pas changer" autocomplete="new-password" />
            </div>
            <div class="form-group form-actions">
              <button type="button" id="btnSavePassword" class="btn btn-load">Enregistrer</button>
            </div>
          </div>
        </div>
        <p>
          <button type="button" id="btnExport" class="btn btn-cancel">Exporter les données (JSON)</button>
        </p>
      </section>

      <footer class="footer">
        <p><a href="index.html">BeHip convertisseur-video-mpquality</a> – Admin publicité</p>
      </footer>
    </main>
  </div>

  <script src="js/admin.js"></script>
</body>
</html>
```

---

## 3. css/style.css

Crée le fichier `css/style.css` et colle le contenu ci-dessous (ou copie depuis le projet).

<details>
<summary>Voir le code CSS (style.css)</summary>

Le fichier fait 422 lignes. Contenu principal :
- `:root` — variables (magenta, accent vert, radius, shadow)
- `body`, `.app` — mise en page
- `.header`, `.logo-wrap`, `.logo-img`, `.logo`, `.tagline`
- `.search-wrap`, `.search-input`, `.btn`, `.btn-load`, `.btn-cancel`
- `.preview-section`, `.preview-container`, `.preview-placeholder`, `.preview-iframe`
- `.download-arrow-wrap`, `.download-arrow`, `.arrow-icon`, `.arrow-label`
- `.options-section`, `.option-group`, `.select`
- `.progress-section`, `.progress-bar-wrap`, `.progress-bar`, `.progress-text`
- `.adsense-wrap`, `.adsense-placeholder`
- `.footer`, `.footer-powered`, `.footer-admin`
- `@media (max-width: 480px)` — responsive

**Pour avoir le code exact :** ouvre `convertisseur/css/style.css` dans le projet.

</details>

---

## 4. css/admin.css

Crée le fichier `css/admin.css` et colle le contenu (ou copie depuis le projet).

<details>
<summary>Voir le code CSS (admin.css)</summary>

Le fichier fait 271 lignes. Contenu principal :
- `.admin-app`, `.admin-login`, `.admin-login-box`
- `.admin-dashboard`, `.admin-header`, `.admin-nav`
- `.admin-section`, `.admin-desc`, `.admin-form`
- `.offers-table-wrap`, `.offers-table`, `.status-badge`, `.btn-delete`
- `.slots-list`, `.slot-card`, `.btn-delete-slot`
- `@media (max-width: 640px)`

**Pour avoir le code exact :** ouvre `convertisseur/css/admin.css` dans le projet.

</details>

---

## 5. js/app.js

Crée le fichier `js/app.js` et colle le contenu (ou copie depuis le projet).

<details>
<summary>Voir le code JS (app.js)</summary>

Le fichier fait 322 lignes. Fonctions principales :
- `parseVideoUrl(url)` — détecte YouTube, Vimeo, TikTok, Instagram et retourne `embedUrl`
- `showPreview(embedUrl)`, `hidePreview()`
- `onLoad()` — charge la preview à partir de l’URL
- `fetchVideoBlob(url, format)` — appelle `/api/get-video` (POST)
- `loadFfmpeg()` — charge ffmpeg.wasm (FFmpegWASM)
- `convertWithFfmpeg(sourceBlob, format, quality)` — MP3/MP4/AVI + qualité
- `downloadBlob(blob, filename)`
- `onDownload()` — récupération → conversion → téléchargement
- `onCancel()`, `resetAll()`

**Pour avoir le code exact :** ouvre `convertisseur/js/app.js` dans le projet.

</details>

---

## 6. js/admin.js

Crée le fichier `js/admin.js` et colle le contenu (ou copie depuis le projet).

<details>
<summary>Voir le code JS (admin.js)</summary>

Le fichier fait 241 lignes. Constantes et fonctions :
- `STORAGE_OFFERS`, `STORAGE_SLOTS`, `STORAGE_PASSWORD`, `SESSION_AUTH`, `DEFAULT_PASSWORD` = `'behip2025'`
- `getPassword()`, `setPassword()`, `isAuthenticated()`, `setAuthenticated()`, `checkAuth()`
- `getOffers()`, `saveOffers()`, `loadOffers()` — offres en localStorage
- `getSlots()`, `saveSlots()`, `loadSlots()` — slots en localStorage
- `escapeHtml(s)` — échappement HTML
- Export JSON, changement mot de passe admin

**Pour avoir le code exact :** ouvre `convertisseur/js/admin.js` dans le projet.

</details>

---

## Récapitulatif

| Fichier        | Rôle |
|----------------|------|
| **index.html** | Page convertisseur (recherche, preview, conversion, téléchargement) |
| **admin.html** | Page admin (connexion `behip2025`, offres, slots, export) |
| **css/style.css** | Styles app (thème magenta, responsive) — 422 lignes |
| **css/admin.css** | Styles admin — 271 lignes |
| **js/app.js**  | Logique convertisseur (URL, ffmpeg, téléchargement) — 322 lignes |
| **js/admin.js** | Logique admin (auth, offres, slots, export) — 241 lignes |

Tous ces fichiers sont déjà présents dans le dossier **convertisseur** du projet. Pour dupliquer le site : copie tout le dossier **convertisseur** (ou **convert**) ; le code complet y est.
