## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Sun Nov 22 2026 18:49:09 GMT-0500 (hora estándar de Perú)|
|**App Generator**<br>SAP Fiori Application Generator|
|**App Generator Version**<br>1.34.0|
|**Generation Platform**<br>CLI|
|**Template Used**<br>Basic|
|**Service Type**<br>None|
|**Service URL**<br>N/A|
|**Module Name**<br>migodcu|
|**Application Title**<br>Almacén|
|**Namespace**<br>pe.pucp.tesis|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.136.24|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>True, see https://www.npmjs.com/package/@sap-ux/eslint-plugin-fiori-tools#rules for the eslint rules.|

## migodcu

Rediseño de MIGO (101 y 261) con datos de prueba

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  To launch the generated application, run the following from the generated application root folder:

```
    npm start
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)



### Datos de prueba

La app no se conecta a ningún sistema SAP: simula los movimientos con los datos de prueba de `webapp/model/datosPrueba.json` (centro 1000 «Planta Lurín», almacenes 0001 «Materias primas» y 0002 «Repuestos y consumibles»).

| Caso | Valor |
|---|---|
| Orden de compra (40 posiciones) | 4500018732 – Suministros Industriales del Sur S.A.C. |
| Orden de compra (3 posiciones) | 4500018745 – Ferretería Industrial Lima S.A.C. |
| Orden de compra inexistente | 4500099999 |
| Guía de remisión (formato) | T001-00004587 |
| Orden de producción liberada | 1000452 – 20000310 Tablero eléctrico de distribución TD-12 600x400 mm, 10 UN |
| Orden de producción no liberada | 1000458 |
| Orden de producción inexistente | 1000999 |
| Stock insuficiente | Pos. 10 de la orden 1000452: 10000215, necesita 10 UN y hay 6 |
| Material por lotes | 10000740 Pintura epóxica gris RAL 7035, lote LP-261104 |
| Material inexistente | 99999999 |
| Almacén inexistente | 0099 |
| Periodos abiertos | 2026-11 y 2026-10 |
| Primer documento de material | Entrada 5000014820 · Salida 4900007315 |
