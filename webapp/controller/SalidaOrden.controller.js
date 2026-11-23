sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel"], (BaseController, JSONModel) => {
    "use strict";
    const vacio = () => ({ numero: "", orden: null, estado: "None", estadoTexto: "" });

    return BaseController.extend("pe.pucp.tesis.migodcu.controller.SalidaOrden", {
        onInit() {
            this.getView().setModel(new JSONModel(vacio()), "vista");
            this.getRouter().getRoute("salidaOrden").attachPatternMatched(this._alEntrar, this);
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
            const oOrden = oDatos.ordenesProduccion.find((o) => o.numero === sNumero);
            if (!oOrden) {
                oVista.setProperty("/orden", null);
                oVista.setProperty("/estado", "Error");
                oVista.setProperty("/estadoTexto", this.getText("errOrdenProdNoExiste", [sNumero]));
                this.byId("inpOrdenProduccion").focus();
                return;
            }
            const bLiberada = oOrden.estado === "LIB";  // P261-01 o P261-01-E
            oVista.setProperty("/estado", "None");
            oVista.setProperty("/orden", {
                numero: oOrden.numero,
                liberada: bLiberada,
                materialTexto: oOrden.material + " – " + oOrden.descripcion,
                cantidadTexto: oOrden.cantidad + " " + oOrden.unidad,
                fechaInicio: this.fechaCorta(oOrden.fechaInicio),
                componentesTexto: bLiberada ? String(oOrden.componentes.length) : this.getText("componentesNoCargan"),
                aviso: this.getText("errOrdenNoLiberada", [oOrden.numero])
            });
        },

        onContinuar() {
            this.getRouter().navTo("salidaRegistro", { orden: this.getModel("vista").getProperty("/orden/numero") });
        }
    });
});
