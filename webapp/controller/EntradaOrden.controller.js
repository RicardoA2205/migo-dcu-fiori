sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel"], (BaseController, JSONModel) => {
    "use strict";
    const vacio = () => ({ numero: "", orden: null, estado: "None", estadoTexto: "" });

    return BaseController.extend("pe.pucp.tesis.migodcu.controller.EntradaOrden", {
        onInit() {
            this.getView().setModel(new JSONModel(vacio()), "vista");
            this.getRouter().getRoute("entradaOrden").attachPatternMatched(this._alEntrar, this);
        },
        _alEntrar() { this.getModel("vista").setData(vacio()); },

        onCambioNumero() {
            const oVista = this.getModel("vista");
            oVista.setProperty("/orden", null);
            oVista.setProperty("/estado", "None");
        },

        async onBuscar() {
            const oVista = this.getModel("vista");
            const sNumero = (oVista.getProperty("/numero") || "").trim();
            const oDatos = await this.esperarDatos();
            const oOrden = oDatos.ordenesCompra.find((o) => o.numero === sNumero);
            if (!oOrden) {                                   // P101-01-E
                oVista.setProperty("/orden", null);
                oVista.setProperty("/estado", "Error");
                oVista.setProperty("/estadoTexto", this.getText("errOrdenCompraNoExiste", [sNumero]));
                this.byId("inpOrdenCompra").focus();
                return;
            }
            oVista.setProperty("/estado", "None");          // P101-01 con los datos de la orden
            oVista.setProperty("/orden", {
                numero: oOrden.numero,
                proveedor: oOrden.proveedor,
                fecha: this.fechaCorta(oOrden.fecha),
                pendientes: oOrden.posiciones.filter((p) => p.cantidadPendiente > 0).length
            });
        },

        onContinuar() {
            this.getRouter().navTo("entradaRegistro", { orden: this.getModel("vista").getProperty("/orden/numero") });
        }
    });
});
