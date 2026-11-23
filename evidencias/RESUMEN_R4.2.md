# Resumen del R4.2 (estado al 22/11/2026)

**R4.2:** «Implementación de la propuesta de rediseño validada como aplicación SAP Fiori con datos de prueba».

## Qué se hizo

- Proyecto generado con el generador oficial de SAP Fiori tools (`@sap/generator-fiori` 1.34.0, plantilla Basic, sin data source, vista `Inicio`, sin virtual endpoints), SAPUI5 **1.136.24** (mantenimiento a largo plazo), app id `pe.pucp.tesis.migodcu`, en `C:\tesis\fiori\migodcu`.
- Las **14 pantallas** del Anexo K con el código del Anexo A de la guía: P00, P101-01, P101-01-E, P101-02, P101-02-E, P101-03, P101-04, P261-01, P261-01-E, P261-02, P261-02-E, P261-03, P261-04 y P261-05. No se crearon pantallas nuevas; los diálogos, popovers y botones agregados van dentro de ellas.
- Correcciones del R4.1 integradas en cada pantalla al construirla, **un commit por corrección EH** (ver `correcciones_R4.1.md`).
- Los dos flujos y todos los caminos de error del paso 6.4 probados en el navegador a 1440×900 (`autoprueba_H1.md`). `npm run lint` sin errores antes de cada commit.
- Publicación preparada en local: `scripts/pages.js`, script `npm run pages` y carpeta `docs/` (SAPUI5 desde `https://ui5.sap.com/1.136/`), probada con un servidor estático.
- Evidencias: 28 capturas de pantalla + copias por EH (41 archivos) en `evidencias/capturas/` (script `npm run capturas`, Playwright 1440×900), `trazabilidad.md`, `autoprueba_H1.md`, plantilla `datos_prueba.xlsx`, tabla `datos_PUCP_vs_app.md`, `historial_git.txt` y `etiquetas.txt`.
- La app no se conecta a ningún sistema SAP: solo simula la contabilización con datos de prueba en memoria.

## Versiones y etiquetas

| Versión | Etiqueta | Contenido |
|---|---|---|
| 0.1 | `v0.1` | Proyecto base (SAP Fiori tools, plantilla Basic, SAPUI5 1.136) |
| 1.0 | `v1.0` | Flujo de entrada por compras (P00, P101-01 a P101-04) |
| 1.1 | `v1.1` | Flujo de salida por producción (P261-01 a P261-05) |
| 1.2 | `v1.2` | Complementos de EH-05, EH-08, EH-18, EH-19 y EH-22 (Tablas K1 y L3) y publicación en GitHub Pages; versión que validan los especialistas |

Código en GitHub (rama `main` y etiquetas v0.1, v1.0, v1.1 y v1.2) y app publicada en GitHub Pages.

## Correcciones EH

| EH | Estado | EH | Estado |
|---|---|---|---|
| 01 | Confirmado (sin cambio) | 13 | Hecho |
| 02 | Hecho | 14 | Hecho |
| 03 | Hecho | 15 | Ya resuelto en la guía |
| 04 | Hecho | 16 | Hecho (medido; ajuste de anchos) |
| 05 | Hecho | 17 | Hecho |
| 06 | Confirmado (sin cambio) | 18 | Hecho (lote obligatorio) |
| 07 | Hecho | 19 | Hecho (según la Tabla L3) |
| 08 | Hecho (Tabla K1) | 20 | Ya resuelto en la guía |
| 09 | Ya resuelto en la guía | 21 | Hecho (verificado en help.sap.com) |
| 10 | Hecho | 22 | Hecho |
| 11 | Hecho | 23 | Hecho |
| 12 | Hecho | | |

Los 23 cerrados. Con las Tablas K1 y L3 del Word se corrigieron EH-08 y EH-19 y se completaron EH-05, EH-18 y EH-22.

## Enlaces

- Repositorio de GitHub: https://github.com/RicardoA2205/migo-dcu-fiori
- GitHub Pages: https://ricardoa2205.github.io/migo-dcu-fiori/ (los dos flujos recorridos con un navegador limpio, a 1440×900; SAPUI5 1.136 desde el CDN de SAP).

## Lo que falta

1. Datos: por la decisión del 22/11/2026 no se replican los datos del sistema SAP de prueba de la PUCP; la app usa sus propios datos de prueba (Anexo B). `datos_prueba.xlsx` y `datos_PUCP_vs_app.md` quedan solo como referencia.
2. Capturas «antes» de cada EH (Figma, Anexo K) para ponerlas junto a las de «después».
3. Validar con el especialista en HCI los textos nuevos (ayuda, aviso de pérdida de datos, placeholder del buscador, ayuda de «Texto de cabecera» y «Lote», términos conformes / excluidas) y con el especialista en SAP el texto de anulación (EH-21).
4. Actas del especialista en SAP y del especialista en HCI → v1.3 y v1.4.
5. Regenerar `historial_git.txt` y `etiquetas.txt` si hay nuevas versiones (v1.3, v1.4).
