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

            // guarda una copia de los datos de prueba tal como se cargan, para poder volver a ellos
            const oDatos = this.getModel("datos");
            oDatos.dataLoaded().then(() => { this._sDatosIniciales = JSON.stringify(oDatos.getData()); });

            // enable routing
            this.getRouter().initialize();
        },

        // Vuelve a los datos de prueba iniciales: la contabilización es simulada y cada registro
        // nuevo parte de las mismas órdenes, stocks y numeración
        restaurarDatos() {
            if (this._sDatosIniciales) { this.getModel("datos").setData(JSON.parse(this._sDatosIniciales)); }
        },

        // Densidad compacta en escritorio y cómoda en pantallas táctiles (Walkthrough, paso «Content Density»; EH-12)
        getContentDensityClass() {
            return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
        }
    });
});
