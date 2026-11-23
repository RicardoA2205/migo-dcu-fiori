sap.ui.define(["./BaseController"], (BaseController) => {
    "use strict";
    return BaseController.extend("pe.pucp.tesis.migodcu.controller.Inicio", {
        onIrEntrada() { this.getRouter().navTo("entradaOrden"); },
        onIrSalida() { this.getRouter().navTo("salidaOrden"); }
    });
});
