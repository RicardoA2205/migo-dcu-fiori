# Correcciones de la evaluación heurística del R4.1 (Tabla L3) en la app

Las 23 recomendaciones se corrigieron **solo en la app** (las pantallas de Figma del R3.2 no se tocaron). Capturas a 1440×900 en `evidencias/capturas/` (por ahora con datos de ejemplo; se vuelven a generar con los datos de la PUCP en v1.2 con `npm run capturas`). Falta poner al lado cada captura «antes» (Figma, Anexo K).

| EH | Sev. | Estado | Cambio hecho en la app | Commit(s) | Captura «después» |
|---|---|---|---|---|---|
| EH-01 | 2 | Confirmado (sin cambio) | Cada `Page` usa el título completo del i18n | — | `EH-01_despues.png` |
| EH-02 | 1 | Hecho | «Paso n de 3 · …» en el `subHeader` (`OverflowToolbar design="Info"`) de P101-01, P101-02, P261-01 y P261-02; «Paso 3 de 3» en los resúmenes | `93e1933`, `7b2b834`, `ab01495`, `94c3b1e` | `EH-02_despues.png` |
| EH-03 | 2 | Hecho | Botón «Cancelar» en el pie de P101-01 y P261-01 que vuelve al Inicio | `33d9799`, `d18f24a` | `EH-03_despues.png` |
| EH-04 | 2 | Hecho | `MessageBox` de pérdida de datos al cancelar el registro si hubo cambios (evento `propertyChange` del modelo `reg`); dice a qué pantalla vuelve. Sin cambios vuelve directo | `a54e802`, `fbc640b` | `EH-04_despues.png` |
| EH-05 | 3 | Hecho | Botón «Mensajes» con ícono `sap-icon://message-error` y contador (fragmento `BotonMensajes`, patrón `MessagePopover`) | `da0376d` | `EH-05_despues.png` |
| EH-06 | 2 | Confirmado (sin cambio) | `valueState="Error"` con el estilo del tema Horizon | — | `EH-06_despues.png` |
| EH-07 | 3 | Hecho | Sin `CheckBox` Conforme: la columna muestra un `ObjectStatus` (Conforme / Excluida) que cambia con los botones de la barra; queda una sola casilla, la de selección | `60a12f9` | `EH-07_despues.png` |
| EH-08 | 2 | **Pendiente** | Unificar términos y rótulos con la Tabla K1 | — | — |
| EH-09 | 2 | Ya resuelto en la guía | `OverflowToolbar` | — | — |
| EH-10 | 3 | Hecho | `liveChange` en la cantidad recibida: agrega o quita el mensaje de la fila en `sap/ui/core/Messaging`; el campo queda en Error al instante y el contador se actualiza | `fbe615c` | `EH-10_despues.png` |
| EH-11 | 2 | Hecho | `errCantidadMayorDesc` agrega «Ingrese como máximo {1} {2}.» | `8ffafe1` | `EH-11_despues.png` |
| EH-12 | 2 | Hecho | Densidad compacta en escritorio (`getContentDensityClass`, Walkthrough paso 36) y `SearchField` que filtra por pos., material y descripción | `19b10f3`, `96c775a` | `EH-12_despues.png` |
| EH-13 | 2 | Hecho | Título «Posiciones (n)» y `sticky="HeaderToolbar,ColumnHeaders"` en la tabla de los dos resúmenes | `1b68796`, `7378117` | `EH-13_despues.png` |
| EH-14 | 2 | Hecho | Plural: «en los almacenes ALM1, ALM2» (singular si es uno) | `3538a77` | `EH-14_despues.png` |
| EH-15 | 3 | Ya resuelto en la guía | «Continuar» solo se habilita si la orden está liberada | — | `P261-01-E_Orden_no_liberada.png` |
| EH-16 | 3 | Hecho | Medido a 1440×900 compacto: las 12 columnas caben (1376 de 1376 px, sin desplazamiento); se fija el ancho de Código de material y Conforme para que el código no se parta | `c7febb4` | `EH-16_despues.png` |
| EH-17 | 1 | Hecho | En la 261, Centro antes que Almacén de origen (columnas y celdas), como en la 101 | `d5da577` | `EH-17_despues.png` |
| EH-18 | 2 | Confirmado (sin cambio) | El lote arranca vacío | — | `EH-18_despues.png` |
| EH-19 | 2 | **Pendiente** | Códigos de mensaje de la tabla del prototipo | — | — |
| EH-20 | 2 | Ya resuelto en la guía | «Aplicar» se habilita con `op1 \|\| op2` | — | `P261-03_Stock_insuficiente.png` |
| EH-21 | 1 | Hecho | El aviso del resumen y la pantalla de resultado dicen cómo se anula: documento de anulación con el número y el año del documento de material (transacción MBST o función de anulación de la MIGO). Verificado en help.sap.com | `395866b` | `EH-21_despues.png` |
| EH-22 | 1 | Hecho | Botón `sap-icon://sys-help` en el `headerContent` de las 6 vistas, que abre un `Popover` con la ayuda de la pantalla | `c96d03d` (+ botón en cada vista al construirla) | `EH-22_despues.png` |
| EH-23 | 1 | Hecho | Sin buscadores decorativos: el único es el de la tabla (EH-12), y filtra | `96c775a` | `EH-12_despues.png` |

## Pendientes y por qué

- **EH-08 y EH-19**: requieren la Tabla K1 (Anexo K) del Word `20216427_RicardoAngulo_E3_R41_limpio.docx`, que no estaba en `guia/`. Según CLAUDE.md no se corrigen sin la tabla a la vista.
- **Términos de EH-07** («Conforme» / «Excluida»): se usaron los del ejemplo de CLAUDE.md; confirmarlos con la Tabla K1 junto con EH-08.

## Textos nuevos que conviene validar (especialista en HCI)

Salen de los textos de la guía y de las HU, pero no están literalmente en el prototipo:

- Ayuda de cada pantalla (EH-22): claves `ayuda*` del i18n.
- Aviso de pérdida de datos (EH-04): `perdidaDatosTitulo`, `perdidaDatos`, `btnDescartarVolver`.
- Placeholder del buscador (EH-12): `buscarPosiciones`.
- Anulación (EH-21): `anulacionDocumento` y la última frase de los avisos del resumen. Confirmar con el especialista en SAP cómo se llama la función de anulación de la MIGO en el sistema de la PUCP (idioma ES).

## Fuentes oficiales consultadas

- SAPUI5 1.136.24, Walkthrough, paso 36 «Content Density» (ui5.sap.com).
- help.sap.com, SAP ERP: «Cancelling a Material Document» y «Entering a Reversal Document with Reference to a Material Document».
- help.sap.com, SAP S/4HANA: «Cancellation of Goods Movements» (MBST y MIGO).
