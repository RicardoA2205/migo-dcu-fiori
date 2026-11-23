# Correcciones de la evaluación heurística del R4.1 (Tabla L3) en la app

Las 23 recomendaciones de la Tabla L3 (leída del Word de la tesis) se corrigieron **solo en la app** (las pantallas de Figma del R3.2 no se tocaron). Capturas a 1440×900 en `evidencias/capturas/` (por ahora con datos de ejemplo; se vuelven a generar con los datos de la PUCP en v1.2 con `npm run capturas`). Falta poner al lado cada captura «antes» (Figma, Anexo K).

| EH | Sev. | Estado | Cambio hecho en la app | Commit(s) | Captura «después» |
|---|---|---|---|---|---|
| EH-01 | 2 | Confirmado (sin cambio) | Cada `Page` usa el título completo del i18n | — | `EH-01_despues.png` |
| EH-02 | 1 | Hecho | «Paso n de 3 · …» en el `subHeader` (`OverflowToolbar design="Info"`) de P101-01, P101-02, P261-01 y P261-02; «Paso 3 de 3» en los resúmenes | `93e1933`, `7b2b834`, `ab01495`, `94c3b1e` | `EH-02_despues.png` |
| EH-03 | 2 | Hecho | Botón «Cancelar» en el pie de P101-01 y P261-01 que vuelve al Inicio | `33d9799`, `d18f24a` | `EH-03_despues.png` |
| EH-04 | 2 | Hecho | `MessageBox` de pérdida de datos al cancelar el registro si hubo cambios (evento `propertyChange` del modelo `reg`); dice a qué pantalla vuelve. Sin cambios vuelve directo | `a54e802`, `fbc640b` | `EH-04_despues.png` |
| EH-05 | 3 | Hecho | Campos `sap.m` estándar (Horizon). Botón «Mensajes» con ícono `sap-icon://message-error` y contador (fragmento `BotonMensajes`, patrón `MessagePopover`), que solo aparece si hay mensajes (SAP Fiori Design Guidelines, Message Popover) | `da0376d`, `5e27995` | `EH-05_despues.png` |
| EH-06 | 2 | Confirmado (sin cambio) | `valueState="Error"` con el estilo del tema Horizon | — | `EH-06_despues.png` |
| EH-07 | 3 | Hecho | Sin `CheckBox` Conforme: la columna muestra un `ObjectStatus` (Conforme / Excluida) que cambia con los botones de la barra; queda una sola casilla, la de selección | `60a12f9`, `402850b` | `EH-07_despues.png` |
| EH-08 | 2 | Hecho | Un solo término: las posiciones que se registran son «conformes» y su opuesto, «excluidas». Botón «Marcar como conformes» (como en la Tabla K1); el resumen dice «n posiciones conformes se registrarán»; enlaces «Ir al campo» / «Ir a la posición» y «Ver alternativas» de la Tabla K1 en el detalle de cada mensaje | `402850b` | `EH-08_despues.png`, `EH-11_despues.png` |
| EH-09 | 2 | Ya resuelto en la guía | `OverflowToolbar` | — | — |
| EH-10 | 3 | Hecho | `liveChange` en la cantidad recibida: agrega o quita el mensaje de la fila en `sap/ui/core/Messaging`; el campo queda en Error al instante y el contador se actualiza | `fbe615c` | `EH-10_despues.png` |
| EH-11 | 2 | Hecho | `errCantidadMayorDesc` agrega «Ingrese como máximo {1} {2}.» | `8ffafe1` | `EH-11_despues.png` |
| EH-12 | 2 | Hecho | Densidad compacta en escritorio (`getContentDensityClass`, Walkthrough paso 36) y `SearchField` que filtra por pos., material y descripción | `19b10f3`, `96c775a` | `EH-12_despues.png` |
| EH-13 | 2 | Hecho | Título «Posiciones (n)» y `sticky="HeaderToolbar,ColumnHeaders"` en la tabla de los dos resúmenes | `1b68796`, `7378117` | `EH-13_despues.png` |
| EH-14 | 2 | Hecho | Plural: «en los almacenes ALM1, ALM2» (singular si es uno) | `3538a77` | `EH-14_despues.png` |
| EH-15 | 3 | Ya resuelto en la guía | «Continuar» solo se habilita si la orden está liberada | — | `P261-01-E_Orden_no_liberada.png` |
| EH-16 | 3 | Hecho | Medido a 1440×900 compacto: las 12 columnas caben (1376 de 1376 px, sin desplazamiento); se fija el ancho de Código de material y Conforme para que el código no se parta | `c7febb4` | `EH-16_despues.png` |
| EH-17 | 1 | Hecho | En la 261, Centro antes que Almacén de origen (columnas y celdas), como en la 101 | `d5da577` | `EH-17_despues.png` |
| EH-18 | 2 | Hecho | El lote arranca vacío (sin texto que parezca dato) y se marca como obligatorio (asterisco en el encabezado y `required` en el campo) solo para materiales por lotes | `ef76807` | `EH-18_despues.png` |
| EH-19 | 2 | Hecho | Los mensajes de stock y P261-03 identifican el componente con los mismos datos de la tabla: posición, código de material, descripción y almacén | `4d11dda` | `EH-19_despues.png` |
| EH-20 | 2 | Ya resuelto en la guía | «Aplicar» se habilita con `op1 \|\| op2` | — | `P261-03_Stock_insuficiente.png` |
| EH-21 | 1 | Hecho | El aviso del resumen y la pantalla de resultado dicen cómo se anula: documento de anulación con el número y el año del documento de material (transacción MBST o función de anulación de la MIGO). Verificado en help.sap.com | `395866b` | `EH-21_despues.png` |
| EH-22 | 1 | Hecho | Botón `sap-icon://sys-help` en el `headerContent` de las 6 vistas, que abre un `Popover` con la ayuda de la pantalla, y ayuda contextual (ícono con tooltip) en «Texto de cabecera» y «Lote», como pide la Tabla L3 | `c96d03d`, `d903414` | `EH-22_despues.png`, `P261-02_Registro_de_la_salida.png` |
| EH-23 | 1 | Hecho | Sin buscadores decorativos: el único es el de la tabla (EH-12), y filtra | `96c775a` | `EH-12_despues.png` |

## Notas

- **EH-19**: CLAUDE.md lo describía como «códigos de mensaje»; la Tabla L3 pide que los mensajes usen los mismos códigos y descripciones que la tabla. Se corrigió según la Tabla L3.
- Con la Tabla L3 a la vista se completaron EH-05, EH-18 y EH-22 con lo que la recomendación pedía además de lo indicado en CLAUDE.md.
- No queda ningún EH pendiente.

## Textos nuevos que conviene validar (especialista en HCI)

Salen de los textos de la guía y de las HU, pero no están literalmente en el prototipo:

- Ayuda de cada pantalla (EH-22): claves `ayuda*` del i18n.
- Aviso de pérdida de datos (EH-04): `perdidaDatosTitulo`, `perdidaDatos`, `btnDescartarVolver`.
- Placeholder del buscador (EH-12): `buscarPosiciones`.
- Ayuda contextual de «Texto de cabecera» y «Lote» (EH-22): `ttTextoCabecera`, `ttLote` (también con el especialista en SAP).
- Términos «conformes» / «excluidas» (EH-08).
- Anulación (EH-21): `anulacionDocumento` y la última frase de los avisos del resumen. Confirmar con el especialista en SAP cómo se llama la función de anulación de la MIGO en el sistema de la PUCP (idioma ES).

## Fuentes oficiales consultadas

- SAP Fiori Design Guidelines v1.136, «Message Popover»: si no hay mensajes, no hay botón de mensajes.
- SAPUI5 1.136.24, API Reference: `sap.m.InputBase#required`, `sap.m.Label#required`.
- SAPUI5 1.136.24, Walkthrough, paso 36 «Content Density» (ui5.sap.com).
- help.sap.com, SAP ERP: «Cancelling a Material Document» y «Entering a Reversal Document with Reference to a Material Document».
- help.sap.com, SAP S/4HANA: «Cancellation of Goods Movements» (MBST y MIGO).
