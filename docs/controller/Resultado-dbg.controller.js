sap.ui.define(["./BaseController", "sap/m/MessageToast"], (BaseController, MessageToast) => {
    "use strict";
    return BaseController.extend("pe.pucp.tesis.migodcu.controller.Resultado", {
        onInit() {
            this.getRouter().getRoute("resultado").attachPatternMatched(this._alEntrar, this);
        },
        _alEntrar(oEvent) {
            const oRes = this.getOwnerComponent().getModel("resultado");
            if (!oRes.getProperty("/documento")) { this.getRouter().navTo("inicio", {}, true); return; }
            const sDoc = oEvent.getParameter("arguments").documento;
            oRes.setProperty("/textoDocumento", this.getText("documentoMaterial", [sDoc]));
            oRes.setProperty("/textoAnulacion", this.getText("anulacionDocumento", [sDoc, oRes.getProperty("/anio")]));  // EH-21
        },
        onCopiar() {
            const sDoc = this.getOwnerComponent().getModel("resultado").getProperty("/documento");
            // eslint-disable-next-line @sap-ux/fiori-tools/sap-no-navigator -- UI5 no tiene API propia para el portapapeles
            navigator.clipboard.writeText(sDoc).then(() => MessageToast.show(this.getText("numeroCopiado")));
        },
        // Al salir del resultado se restauran los datos de prueba: la orden vuelve a salir completa
        onOtra() {
            const sFlujo = this.getOwnerComponent().getModel("resultado").getProperty("/flujo");
            this.getOwnerComponent().restaurarDatos();
            this.getRouter().navTo(sFlujo === "salida" ? "salidaOrden" : "entradaOrden");
        },
        onVolverInicio() {
            this.getOwnerComponent().restaurarDatos();
            this.getRouter().navTo("inicio");
        }
    });
});
