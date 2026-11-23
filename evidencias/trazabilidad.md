# Trazabilidad: pantalla → archivos → controles SAPUI5 → historias de usuario

App freestyle SAPUI5 1.136 (`pe.pucp.tesis.migodcu`). Lógica común en `controller/BaseController.js` (datos de prueba, stock, reglas de fechas HU-05, mensajes con `sap/ui/core/Messaging`, aviso de pérdida de datos y ayuda).

| Pantalla (Anexo K) | Archivos | Controles SAPUI5 principales | Historias de usuario | Correcciones EH |
|---|---|---|---|---|
| P00 Inicio | `view/Inicio.view.xml`, `controller/Inicio.controller.js` | `Page`, `GenericTile`, `TileContent`, `ImageContent` | HU-01 | EH-22 |
| P101-01 Orden de compra / P101-01-E | `view/EntradaOrden.view.xml`, `controller/EntradaOrden.controller.js` | `Input` con `valueState="Error"`, `Panel`, `ObjectAttribute`, `OverflowToolbar design="Info"` | HU-02, HU-03 | EH-02, EH-03, EH-22 |
| P101-02 Registro de la entrada / P101-02-E | `view/EntradaRegistro.view.xml`, `controller/EntradaRegistro.controller.js`, `fragment/Mensajes`, `fragment/BotonMensajes`, `fragment/Columnas` | `DatePicker`, `Select`, `Table mode="MultiSelect"` con `Input` en celdas, `SearchField`, `ObjectStatus`, `MessagePopover`, `ResponsivePopover`, `MessageBox` | HU-05, HU-06, HU-07, HU-08, HU-09, HU-11, HU-12, HU-13 | EH-02, EH-04, EH-05, EH-07, EH-10, EH-11, EH-12, EH-22 |
| P101-03 Resumen antes de contabilizar | `fragment/ResumenEntrada.fragment.xml` | `Dialog` con `subHeader`, `Table sticky`, `MessageStrip type="Warning"` | HU-15 | EH-02, EH-13, EH-14, EH-21 |
| P101-04 Entrada registrada | `view/Resultado.view.xml`, `controller/Resultado.controller.js` | `Title` H1, `Link` «Copiar número», `MessageStrip type="Information"` | HU-16 | EH-21, EH-22 |
| P261-01 Orden de producción / P261-01-E | `view/SalidaOrden.view.xml`, `controller/SalidaOrden.controller.js` | `ObjectStatus` (liberada / no liberada), `MessageStrip type="Error"`, `Input`, `Panel` | HU-02, HU-04 | EH-02, EH-03, EH-22 |
| P261-02 Registro de la salida / P261-02-E | `view/SalidaRegistro.view.xml`, `controller/SalidaRegistro.controller.js`, `fragment/NoPlanificado`, `fragment/Mensajes`, `fragment/BotonMensajes`, `fragment/Columnas` | `Table` con stock disponible (`ObjectStatus` activo con aviso), `highlight` de fila, `Input` en celdas, `MessagePopover`, `MessageBox` | HU-05, HU-07, HU-08, HU-10, HU-11, HU-13 | EH-02, EH-04, EH-05, EH-16, EH-17, EH-18, EH-22 |
| P261-03 Stock insuficiente | `fragment/StockInsuficiente.fragment.xml` | `Dialog state="Warning"`, `RadioButton` con descripción | HU-14 | EH-20 |
| P261-04 Resumen antes de contabilizar | `fragment/ResumenSalida.fragment.xml` | `Dialog` con `subHeader`, `Table sticky`, `MessageStrip` | HU-15 | EH-02, EH-13, EH-21 |
| P261-05 Salida registrada | `view/Resultado.view.xml` | igual que P101-04 | HU-16 | EH-21, EH-22 |

Transversales: `Component.js` y `controller/App.controller.js` (densidad compacta, EH-12), `fragment/Ayuda.fragment.xml` (EH-22), `i18n/i18n.properties` (textos), `model/datosPrueba.json` (datos de prueba), `manifest.json` (rutas, modelos, `fullWidth`).
