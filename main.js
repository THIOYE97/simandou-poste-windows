// Poste de travail Windows (accès Bureau) — Module 2 Contrôle Accès & Sécurité.
//
// Encapsule l'application analyste web (React) dans une fenêtre Electron avec les
// "sécurités d'usage" attendues par le TDR :
//  - contextIsolation + désactivation de nodeIntegration (renderer sandboxé) ;
//  - navigation verrouillée sur l'origine autorisée (APP_URL) ;
//  - ouverture des liens externes dans le navigateur système, pas dans l'app ;
//  - blocage de l'ouverture de nouvelles fenêtres.
//
// L'URL de l'application est fournie par la variable d'environnement APP_URL
// (poste connecté au serveur BCRG). Défaut : instance de développement locale.

const { app, BrowserWindow, shell, Menu, session } = require("electron");

const APP_URL = process.env.APP_URL || "http://localhost:5173";
const APP_ORIGIN = new URL(APP_URL).origin;

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "BCRG LBC-FT",
    autoHideMenuBar: true,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  // Menu applicatif minimal (pas d'outils de dev en production).
  Menu.setApplicationMenu(null);

  mainWindow.loadURL(APP_URL);

  // Sécurité : bloquer toute navigation hors de l'origine autorisée.
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (new URL(url).origin !== APP_ORIGIN) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Sécurité : les window.open / target=_blank partent dans le navigateur système.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Durcissement : refuser toute demande de permission (caméra, géoloc, etc.).
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, callback) => callback(false));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Empêche l'ouverture de fenêtres supplémentaires par du contenu web.
app.on("web-contents-created", (_e, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
});
