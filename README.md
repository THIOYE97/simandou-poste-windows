# Poste de travail Windows — Solution LBC/FT BCRG

Wrapper **Electron** encapsulant l'application analyste (React) pour un accès
**Bureau Windows**, en complément de l'accès Web (TDR §VII — Module Contrôle
Accès et Sécurité : « l'accès aux différentes fonctionnalités sera aussi bien
via WEB que via un Bureau Windows avec les sécurités d'usage »).

## Sécurités d'usage implémentées
- Renderer **sandboxé** : `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
- **Navigation verrouillée** sur l'origine autorisée (`APP_URL`) ; tout lien externe s'ouvre dans le navigateur système.
- Blocage de l'ouverture de nouvelles fenêtres par le contenu web.
- Refus systématique des demandes de permissions natives (caméra, géoloc…).
- Menu de développement désactivé en production.

## Configuration
L'URL de l'application (serveur BCRG) est fournie par la variable d'environnement `APP_URL` :

```bash
APP_URL="https://lbcft.bcrg-guinee.org" npm start
```
Défaut : `http://localhost:5173` (instance de développement).

## Développement
```bash
npm install
npm start
```

## Build Windows (.exe)

> **Construire sous Linux ne suffit pas.** Le packaging aboutit — un exécutable
> `PE32+` valide est produit dans `release/win-unpacked/` — mais la signature et
> l'installeur NSIS échouent faute de `wine`. La construction officielle passe
> donc par l'exécuteur Windows de l'intégration continue
> (`.github/workflows/build-desktop-windows.yml`), déclenchable à la demande
> avec l'URL du serveur visé.

```bash
npm install
npm run dist:win            # installeur NSIS (release/BCRG-LBCFT-Setup-<version>.exe)
npm run dist:win-portable   # version portable
```

> Authentification, habilitations (RBAC) et sécurité des données sont gérées
> côté application/serveur ; ce wrapper ajoute la couche « poste Windows » et son
> durcissement. Le déploiement sur les 3 environnements (Test/Prod/Backup) suit
> l'`APP_URL` correspondante.
