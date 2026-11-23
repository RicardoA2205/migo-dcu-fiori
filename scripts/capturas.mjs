// Capturas de evidencia del R4.2 a 1440x900 (pantallas del Anexo K, caminos de error y EH corregidos).
// Uso: con `npm start` corriendo en otra terminal, ejecutar `npm run capturas`.
// Usa el Chrome instalado (playwright-core, canal "chrome"); no descarga navegadores.
// Al pasar a los datos de la PUCP (v1.2) solo hay que cambiar DATOS.
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const DATOS = {
    pedido: "PEDIDO-P1",            // pedido de compra con varias posiciones pendientes
    pedidoInexistente: "9999999999",
    ordenLiberada: "ORDEN-P1",      // con un componente con faltante y uno por lotes
    ordenSinLiberar: "ORDEN-SIN-LIBERAR",
    lote: "LOTE-1",                 // lote del componente que se maneja por lotes
    materialInexistente: "NO-EXISTE",
    almacenInexistente: "ALM9",
    fechaPeriodoCerrado: "2026-09-15"
};

const BASE = process.env.URL_APP || "http://localhost:8080/test/flpSandbox.html?sap-ui-xx-viewCache=false#pepucptesismigodcu-display";
const SALIDA = path.resolve("evidencias/capturas");
fs.mkdirSync(SALIDA, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: "es-PE" });
const pausa = (ms) => page.waitForTimeout(ms);

async function foto(nombre, ...copias) {
    await pausa(700);
    const archivo = path.join(SALIDA, nombre + ".png");
    await page.screenshot({ path: archivo });
    copias.forEach((c) => fs.copyFileSync(archivo, path.join(SALIDA, c + ".png")));
    console.log("✔", nombre, copias.length ? "(+ " + copias.join(", ") + ")" : "");
}
async function abrir(ruta, vista) {
    await page.goto(BASE + (ruta ? "&/" + ruta : ""));
    await page.waitForFunction((v) => {
        const E = window.sap && sap.ui.core && sap.ui.core.Element;
        return !!(E && E.getElementById("application-pepucptesismigodcu-display-component---" + v));
    }, vista, { timeout: 60000 });
    await pausa(1500);
}
// Ejecuta código en el controlador de una vista
function ctrl(vista, fn, arg) {
    return page.evaluate(async ([v, sFn, a]) => {
        const c = sap.ui.core.Element.getElementById("application-pepucptesismigodcu-display-component---" + v).getController();
        return await new Function("c", "a", "return (async () => {" + sFn + "})()")(c, a);
    }, [vista, fn, arg]);
}
const campo = (id) => page.locator(`[id$="--${id}-inner"]`);
const boton = (texto) => page.locator(".sapMBtn:visible", { hasText: texto }).last();

// ---------- P00 ----------
await abrir("", "Inicio");
await foto("P00_Inicio");
await page.locator('[id$="--btnAyudaInicio"]').click();
await foto("EH-22_despues");
await page.keyboard.press("Escape");

// ---------- P101-01 ----------
await abrir("entrada", "EntradaOrden");
await campo("inpOrdenCompra").fill(DATOS.pedidoInexistente);
await campo("inpOrdenCompra").press("Enter");
await foto("P101-01-E_Orden_inexistente");
await campo("inpOrdenCompra").fill(DATOS.pedido);
await campo("inpOrdenCompra").press("Enter");
await foto("P101-01_Orden_de_compra", "EH-02_despues", "EH-03_despues");

// ---------- P101-02 ----------
await page.locator('[id$="--btnContinuarEntrada"]').click();
await page.waitForFunction(() => !!sap.ui.core.Element.getElementById("application-pepucptesismigodcu-display-component---EntradaRegistro"));
await pausa(1500);
await foto("P101-02_Registro_de_la_entrada", "EH-01_despues");

await page.locator('[id$="--sfPosiciones-I"]').fill("material-3");
await foto("EH-12_despues");
await page.locator('[id$="--sfPosiciones-I"]').fill("");
await page.locator('[id$="--sfPosiciones-I"]').press("Enter");

await ctrl("EntradaRegistro", `
    const t = c.byId("tblPosiciones");
    [0, 1, 2].forEach((i) => t.getItems()[i].setSelected(true)); c.onSeleccion(); c.onMarcarConforme();
    t.getItems()[3].setSelected(true); c.onSeleccion(); c.onExcluir();`);
await foto("EH-07_despues", "EH-08_despues");

// cantidad mayor a la pendiente: aviso al escribir (EH-10)
const cantidad2 = page.locator('[id$="--tblPosiciones"] tbody tr').nth(1).locator("input[type='number']").first();
await cantidad2.fill("");
await cantidad2.pressSequentially("999");
await foto("P101-02-E_Cantidad_mayor_al_escribir", "EH-10_despues");

// guía con formato no válido: aviso inmediato
await campo("inpGuia").pressSequentially("T01-123");
await foto("P101-02_Guia_formato_no_valido");

await boton("Verificar").click();
await foto("P101-02-E_Registro_con_errores", "EH-05_despues", "EH-06_despues");
// se abre el detalle del mensaje (clic en la flecha de la fila; el título lleva al campo)
const itemCantidad = page.locator(".sapMMsgPopover li", { hasText: "cantidad mayor" }).first();
const caja = await itemCantidad.boundingBox();
await itemCantidad.click({ position: { x: caja.width - 12, y: caja.height / 2 } });
await foto("EH-11_despues");
await page.keyboard.press("Escape");

await boton("Cancelar").click();
await foto("EH-04_despues");
await page.locator(".sapMMessageBox .sapMBtn", { hasText: "Cancelar" }).click();

// fechas incoherentes / periodo cerrado / almacén / sin conformes
await ctrl("EntradaRegistro", `
    const m = c.getModel("reg"); const p = m.getProperty("/posiciones");
    m.setProperty("/cabecera/guiaRemision", c.datos().getProperty("/config/ejemploGuia"));
    m.setProperty("/posiciones/1/cantidadRecibida", String(p[1].cantidadPendiente));
    const h = new Date(); const d = (n) => new Date(h.getFullYear(), h.getMonth(), h.getDate() + n);
    const iso = (f) => f.getFullYear() + "-" + String(f.getMonth() + 1).padStart(2, "0") + "-" + String(f.getDate()).padStart(2, "0");
    m.setProperty("/cabecera/fechaDocumento", iso(d(1))); m.setProperty("/cabecera/fechaContabilizacion", iso(d(0)));
    c.onVerificar();`);
await foto("P101-02-E_Fechas_incoherentes");
await page.keyboard.press("Escape");
await ctrl("EntradaRegistro", `
    const m = c.getModel("reg");
    m.setProperty("/cabecera/fechaDocumento", a); m.setProperty("/cabecera/fechaContabilizacion", a);
    c.onVerificar();`, DATOS.fechaPeriodoCerrado);
await foto("P101-02-E_Periodo_cerrado");
await page.keyboard.press("Escape");
await ctrl("EntradaRegistro", `
    const m = c.getModel("reg"); const hoy = c.hoyISO();
    m.setProperty("/cabecera/fechaDocumento", hoy); m.setProperty("/cabecera/fechaContabilizacion", hoy);
    m.setProperty("/posiciones/0/almacen", a); c.onVerificar();`, DATOS.almacenInexistente);
await foto("P101-02-E_Almacen_inexistente");
await page.keyboard.press("Escape");
await ctrl("EntradaRegistro", `
    const m = c.getModel("reg"); const alm = c.datos().getProperty("/ordenesCompra").find((o) => o.numero === m.getProperty("/orden/numero")).posiciones[0].almacen;
    m.setProperty("/posiciones/0/almacen", alm);
    m.getProperty("/posiciones").forEach((p, i) => { m.setProperty("/posiciones/" + i + "/conforme", false); m.setProperty("/posiciones/" + i + "/marca", ""); });
    c.onVerificar();`);
await foto("P101-02-E_Sin_conformes");
await page.keyboard.press("Escape");

// ---------- P101-03 y P101-04 ----------
await ctrl("EntradaRegistro", `
    const m = c.getModel("reg");
    [0, 1, 2].forEach((i) => { m.setProperty("/posiciones/" + i + "/conforme", true); m.setProperty("/posiciones/" + i + "/marca", "conforme"); });
    await c.onContabilizar();`);
await foto("P101-03_Resumen_antes_de_contabilizar", "EH-13_despues", "EH-14_despues");
await page.locator('[id$="--btnConfirmarEntrada"]').click();
await page.waitForFunction(() => !!sap.ui.core.Element.getElementById("application-pepucptesismigodcu-display-component---Resultado"));
await pausa(1500);
await foto("P101-04_Entrada_registrada", "EH-21_despues");

// ---------- P261-01 ----------
await abrir("salida", "SalidaOrden");
await campo("inpOrdenProduccion").fill(DATOS.ordenSinLiberar);
await campo("inpOrdenProduccion").press("Enter");
await foto("P261-01-E_Orden_no_liberada");
await campo("inpOrdenProduccion").fill(DATOS.pedidoInexistente);
await campo("inpOrdenProduccion").press("Enter");
await foto("P261-01-E_Orden_inexistente");
await campo("inpOrdenProduccion").fill(DATOS.ordenLiberada);
await campo("inpOrdenProduccion").press("Enter");
await foto("P261-01_Orden_de_produccion");

// ---------- P261-02 ----------
await page.locator('[id$="--btnContinuarSalida"]').click();
await page.waitForFunction(() => !!sap.ui.core.Element.getElementById("application-pepucptesismigodcu-display-component---SalidaRegistro"));
await pausa(1500);
await foto("P261-02_Registro_de_la_salida", "EH-17_despues", "EH-18_despues");
await ctrl("SalidaRegistro", `c.getModel("reg").setProperty("/columnas/tipoStock", true);`);
await foto("EH-16_despues");
await ctrl("SalidaRegistro", `c.getModel("reg").setProperty("/columnas/tipoStock", false);`);

await boton("Verificar").click();
await foto("P261-02-E_Falta_de_stock_y_lote");
await page.keyboard.press("Escape");

// P261-03: alternativas para el primer componente con faltante
await ctrl("SalidaRegistro", `
    const i = c.getModel("reg").getProperty("/posiciones").findIndex((p) => p.faltante > 0);
    if (i >= 0) { await c._abrirAlternativas(i); }`);
await foto("P261-03_Stock_insuficiente", "EH-19_despues");
await page.locator('[id$="--rbOpcion1"]').click();
await page.locator('[id$="--btnAplicarAlternativa"]').click();
await pausa(500);
await page.keyboard.press("Escape");

// componente no planificado con material inexistente
await ctrl("SalidaRegistro", `await c.onNoPlanificado();`);
await pausa(500);
await campo("inpNpMaterial").fill(DATOS.materialInexistente);
await campo("inpNpCantidad").fill("1");
await page.locator('[id$="--btnAgregarNp"]').click();
await campo("inpNpMaterial").focus();
await foto("P261-02-E_No_planificado_material_inexistente");
await ctrl("SalidaRegistro", `c.onCancelarNoPlanificado();`);

// ---------- P261-04 y P261-05 ----------
await ctrl("SalidaRegistro", `
    const m = c.getModel("reg");
    m.getProperty("/posiciones").forEach((p, i) => { if (p.manejaLote && !p.lote) { m.setProperty("/posiciones/" + i + "/lote", a); } });
    await c.onContabilizar();`, DATOS.lote);
await foto("P261-04_Resumen_antes_de_contabilizar");
await page.locator('[id$="--btnConfirmarSalida"]').click();
await page.waitForFunction(() => location.hash.includes("resultado/salida"));
await pausa(1500);
await foto("P261-05_Salida_registrada");

await browser.close();
console.log("Capturas en", SALIDA);
