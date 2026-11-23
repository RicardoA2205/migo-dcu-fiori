# Documento en el sistema SAP de prueba de la PUCP ↔ dato en la app

Se llena cuando los documentos estén creados (v1.2). Las capturas de ME23N, CO03 y MMBE las agrega Ricardo, con el usuario recortado.

| Dato | Transacción (PUCP) | Documento / valor en la PUCP | Clave en `datosPrueba.json` | Valor en la app | Captura |
|---|---|---|---|---|---|
| Pedido de compra (P1) | ME23N | | `ordenesCompra[].numero` | | |
| Posiciones pendientes del pedido | ME23N (Historial de pedido) | | `ordenesCompra[].posiciones[]` | | |
| Orden de producción liberada (P1) | CO03 | | `ordenesProduccion[].numero` (`estado: "LIB"`) | | |
| Orden de producción sin liberar | CO03 | | `ordenesProduccion[].numero` (`estado: "ABIE"`) | | |
| Stock del componente con faltante | MMBE | | `stock[].libre` | | |
| Periodos abiertos | MMRV | | `config.periodosAbiertos` | | |
| Número de pedido inexistente | ME23N | | (no está en el JSON) | | |
| Formato del número de documento | MIGO (prueba) | | `config.siguienteDocEntrada` / `siguienteDocSalida` | | |
