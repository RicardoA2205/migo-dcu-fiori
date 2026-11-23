# Autoprueba con los criterios de aceptación (Tabla H1)

Recorrida el 22/11/2026 con `npm start` (launchpad de prueba de SAP Fiori, SAPUI5 1.136), ventana de 1440×900 al 100 %, **con los datos de ejemplo del Anexo B**. Repetir con los datos de la PUCP (v1.2) antes de pasar la app a los especialistas.

- [x] HU-01: se entra a cada tarea desde su mosaico, sin código de transacción (P00).
- [x] HU-02: la clase de movimiento se ve con su descripción (101 y 261) en P101-01/02 y P261-01/02 y en los resúmenes.
- [x] HU-03: al buscar el pedido se ven proveedor y fecha antes de continuar; el número se puede corregir sin haber registrado nada (P101-01 / P101-01-E).
- [x] HU-04: al buscar la orden se ve su estado; si no está liberada, el mensaje dice por qué no hay componentes y «Continuar» queda deshabilitado (P261-01-E).
- [x] HU-05: fechas incoherentes y periodo cerrado se avisan antes de contabilizar e indican qué fecha revisar (P101-02-E, P261-02-E).
- [x] HU-06: la guía con mal formato se marca al escribirla y muestra el formato esperado.
- [x] HU-07 y HU-08: material, cantidad, centro y almacén visibles sin desplazamiento horizontal a 1440 px; rótulos completos; el engranaje muestra la columna oculta (Tipo de stock). En la 261, con las 12 columnas, la tabla ocupa 1376 de 1376 px.
- [x] HU-09: se ven 10 posiciones a la vez al abrir P101-02 (densidad compacta, 1440×900).
- [x] HU-10: cada componente muestra stock disponible y almacén de origen.
- [x] HU-11: la cantidad se edita en la misma fila; el centro tiene candado con explicación (tooltip).
- [x] HU-12: se seleccionan varias filas y se marcan como conformes o se excluyen con un clic; el buscador filtra las 40 posiciones.
- [x] HU-13: cada mensaje dice causa, lugar y acción, y al pulsar su título lleva al campo.
- [x] HU-14: con falta de stock se ve el faltante y se puede entregar lo disponible o excluir el componente (P261-03).
- [x] HU-15: el resumen muestra documento, posiciones, cantidades, almacenes y el efecto; sin confirmar no se contabiliza (P101-03, P261-04).
- [x] HU-16: el número de documento aparece grande en el centro de la pantalla (P101-04, P261-05).

## Caminos de error probados (paso 6.4)

| Camino | Resultado | Captura |
|---|---|---|
| Orden de compra inexistente | Campo en rojo con el mensaje | `P101-01-E_Orden_inexistente.png` |
| Orden de producción no liberada | Estado y aviso; «Continuar» deshabilitado | `P261-01-E_Orden_no_liberada.png` |
| Orden de producción inexistente | Campo en rojo con el mensaje | `P261-01-E_Orden_inexistente.png` |
| Fechas incoherentes | Mensaje y fecha de documento en rojo | `P101-02-E_Fechas_incoherentes.png` |
| Periodo cerrado | Mensaje con los periodos abiertos | `P101-02-E_Periodo_cerrado.png` |
| Guía con formato no válido | Aviso inmediato y en Verificar | `P101-02_Guia_formato_no_valido.png`, `P101-02-E_Registro_con_errores.png` |
| Cantidad mayor a la pendiente | Aviso al escribir (EH-10) | `P101-02-E_Cantidad_mayor_al_escribir.png` |
| Falta de stock | P261-02-E → P261-03 → Aplicar / Cancelar | `P261-02-E_Falta_de_stock_y_lote.png`, `P261-03_Stock_insuficiente.png` |
| Sin posiciones conformes | Mensaje | `P101-02-E_Sin_conformes.png` |
| Almacén inexistente | Mensaje y campo en rojo | `P101-02-E_Almacen_inexistente.png` |
| Lote faltante | Mensaje y campo en rojo | `P261-02-E_Falta_de_stock_y_lote.png` |
| No planificado con material inexistente | Campo en rojo en el diálogo | `P261-02-E_No_planificado_material_inexistente.png` |

También: Cancelar con y sin cambios (EH-04) en los dos flujos, búsqueda en 40 posiciones (EH-12), ayuda en las 6 vistas (EH-22).
