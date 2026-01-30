# Déployer sur GitLab

Pour pousser le projet (ou le dossier convertisseur) vers GitLab :

## 1. Remplacer l’URL par la vôtre

L’URL donnée est un exemple : `https://gitlab.com/TON-GROUPE/TON-PROJET.git`  
Remplacez **TON-GROUPE** et **TON-PROJET** par votre groupe et le nom de votre dépôt GitLab.

## 2. Depuis la racine du projet (behip-app)

```bash
cd "c:\Users\rafae\Desktop\Nouveau dossier (2)\behip-app"

# Initialiser Git si ce n’est pas déjà fait
git init

# Ajouter le remote GitLab (une seule fois)
git remote add origin https://gitlab.com/TON-GROUPE/TON-PROJET.git
# Si "origin" existe déjà et pointe ailleurs :
# git remote set-url origin https://gitlab.com/TON-GROUPE/TON-PROJET.git

# Ajouter tous les fichiers, committer, pousser
git add .
git commit -m "BeHip convertisseur-video-mpquality + admin publicité"
git push -u origin main
```

Si votre branche par défaut s’appelle `master` au lieu de `main` :

```bash
git push -u origin master
```

## 3. Déployer uniquement le convertisseur

Si vous voulez un dépôt GitLab qui ne contient que le convertisseur :

1. Créez un nouveau projet sur GitLab (vide).
2. Dans un dossier à part, copiez tout le contenu de `convertisseur/`.
3. Dans ce dossier :

```bash
git init
git remote add origin https://gitlab.com/VOTRE-GROUPE/convertisseur-video.git
git add .
git commit -m "BeHip convertisseur-video-mpquality + admin"
git push -u origin main
```

## Authentification GitLab

- **HTTPS :** Git vous demandera votre identifiant GitLab et un token (ou mot de passe).
- **SSH :** Utilisez l’URL SSH du dépôt : `git@gitlab.com:TON-GROUPE/TON-PROJET.git` si vous avez une clé SSH configurée.
