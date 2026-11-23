# Resumen del R4.2 (estado al 22/11/2026)

**R4.2:** «Implementación de la propuesta de rediseño validada como aplicación SAP Fiori con datos de prueba».

## Qué se hizo

- Proyecto generado con el generador oficial de SAP Fiori tools (`@sap/generator-fiori` 1.34.0, plantilla Basic, sin data source, vista `Inicio`, sin virtual endpoints), SAPUI5 **1.136.24** (mantenimiento a largo plazo), app id `pe.pucp.tesis.migodcu`, en `C:\tesis\fiori\migodcu`.
- Las **14 pantallas** del Anexo K con el código del Anexo A de la guía: P00, P101-01, P101-01-E, P101-02, P101-02-E, P101-03, P101-04, P261-01, P261-01-E, P261-02, P261-02-E, P261-03, P261-04 y P261-05. No se crearon pantallas nuevas; los diálogos, popovers y botones agregados van dentro de ellas.
- Correcciones del R4.1 integradas en cada pantalla al construirla, **un commit por corrección EH** (ver `correcciones_R4.1.md`).
- Los dos flujos y todos los caminos de error del paso 6.4 probados en el navegador a 1440×900 (`autoprueba_H1.md`). `npm run lint` sin errores antes de cada commit.
- Publicación preparada en local: `scripts/pages.js`, script `npm run pages` y carpeta `docs/` (SAPUI5 desde `https://ui5.sap.com/1.136/`), probada con un servidor estático.
- Evidencias: 28 capturas de pantalla + copias por EH en `evidencias/capturas/` (script `npm run capturas`, Playwright 1440×900), `trazabilidad.md`, `autoprueba_H1.md`, plantilla `datos_prueba.xlsx`, tabla `datos_PUCP_vs_app.md`, `historial_git.txt` y `etiquetas.txt`.
- La app no se conecta a ningún sistema SAP: solo simula la contabilización con datos de prueba en memoria.

## Versiones y etiquetas

| Versión | Etiqueta | Contenido |
|---|---|---|
| 0.1 | `v0.1` | Proyecto base (SAP Fiori tools, plantilla Basic, SAPUI5 1.136) |
| 1.0 | `v1.0` | Flujo de entrada por compras (P00, P101-01 a P101-04) |
| 1.1 | `v1.1` | Flujo de salida por producción (P261-01 a P261-05) |
| 1.2 | — | Pendiente: datos reales de la PUCP en `datosPrueba.json` |

Todo está **solo en local** (no se ha hecho `git push`).

## Correcciones EH

| EH | Estado | EH | Estado |
|---|---|---|---|
| 01 | Confirmado (sin cambio) | 13 | Hecho |
| 02 | Hecho | 14 | Hecho |
| 03 | Hecho | 15 | Ya resuelto en la guía |
| 04 | Hecho | 16 | Hecho (medido; ajuste de anchos) |
| 05 | Hecho | 17 | Hecho |
| 06 | Confirmado (sin cambio) | 18 | Confirmado (sin cambio) |
| 07 | Hecho (términos por confirmar con K1) | 19 | **Pendiente: falta la Tabla K1** |
| 08 | **Pendiente: falta la Tabla K1** | 20 | Ya resuelto en la guía |
| 09 | Ya resuelto en la guía | 21 | Hecho (verificado en help.sap.com) |
| 10 | Hecho | 22 | Hecho |
| 11 | Hecho | 23 | Hecho |
| 12 | Hecho | | |

21 de 23 cerrados; EH-08 y EH-19 esperan la Tabla K1.

## Enlaces

- Repositorio de GitHub: **pendiente** (aún no creado).
- GitHub Pages: **pendiente** (`https://<usuario>.github.io/migo-dcu-fiori/` cuando se active).

## Lo que falta

1. **Tabla K1**: poner el Word `20216427_RicardoAngulo_E3_R41_limpio.docx` en `guia/` para corregir EH-08 y EH-19 y confirmar los términos de EH-07 (Conforme / Excluida).
2. **Datos de la PUCP** (Ricardo): crear los documentos (ME21N, CO01 con una orden sin liberar, MIGO 561 o MMBE, MMRV), llenar `datos_prueba.xlsx`, copiarlos a `datosPrueba.json` → **v1.2**; luego `npm run capturas` y `npm run pages`.
3. **GitHub**: crear el repositorio `migo-dcu-fiori`, `git push --follow-tags` y activar Pages (Settings → Pages → rama `main`, carpeta `/docs`). Recorrer los dos flujos en la URL publicada en una ventana privada.
4. Capturas «antes» de cada EH (Figma, Anexo K) para ponerlas junto a las de «después».
5. Validar con el especialista en HCI los textos nuevos (ayuda, aviso de pérdida de datos, placeholder del buscador) y con el especialista en SAP el texto de anulación (EH-21).
6. Actas del especialista en SAP y del especialista en HCI → v1.3 y v1.4.
7. Repetir la autoprueba H1 con los datos de la PUCP y regenerar `historial_git.txt` y `etiquetas.txt` antes de entregar.
