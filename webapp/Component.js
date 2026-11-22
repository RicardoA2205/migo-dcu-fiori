sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "pe/pucp/tesis/migodcu/model/models"
], (UIComponent, Device, models) => {
    "use strict";

    return UIComponent.extend("pe.pucp.tesis.migodcu.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        },

        // Densidad compacta en escritorio y cómoda en pantallas táctiles (Walkthrough, paso «Content Density»; EH-12)
        getContentDensityClass() {
            return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
        }
    });
});
