sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("pe.pucp.tesis.migodcu.controller.App", {
        onInit() {
            // EH-12: densidad según el dispositivo (compacta en escritorio)
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }
    });
});
