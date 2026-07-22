// Preload sécurisé — expose une surface minimale et contrôlée au renderer.
// Aucune API Node n'est exposée directement (contextIsolation actif).
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("bcrgDesktop", {
  platform: process.platform,
  version: process.env.npm_package_version || "1.0.0",
  isDesktop: true,
});
