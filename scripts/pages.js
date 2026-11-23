// Copia el build (dist) a docs/ para GitHub Pages y carga SAPUI5 desde el CDN de SAP
const fs = require("fs");
const CDN = "https://ui5.sap.com/1.136/resources/sap-ui-core.js";
fs.rmSync("docs", { recursive: true, force: true });
fs.cpSync("dist", "docs", { recursive: true });
const archivo = "docs/index.html";
const html = fs.readFileSync(archivo, "utf8");
if (!html.includes('src="resources/sap-ui-core.js"')) {
    throw new Error("No se encontró src=\"resources/sap-ui-core.js\" en docs/index.html");
}
fs.writeFileSync(archivo, html.replace('src="resources/sap-ui-core.js"', `src="${CDN}"`));
fs.writeFileSync("docs/.nojekyll", "");
console.log("docs/ listo para GitHub Pages");
