sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Messaging",
    "sap/ui/core/message/Message",
    "sap/ui/core/message/MessageType",
    "sap/ui/core/Element",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageBox"
], (Controller, UIComponent, Messaging, Message, MessageType, Element, DateFormat, MessageBox) => {
    "use strict";

    const oFechaCorta = DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });

    return Controller.extend("pe.pucp.tesis.migodcu.controller.BaseController", {

        getRouter() { return UIComponent.getRouterFor(this); },
        getModel(sNombre) { return this.getView().getModel(sNombre); },
        datos() { return this.getOwnerComponent().getModel("datos"); },
        getText(sClave, aArgs) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sClave, aArgs);
        },

        // ---------- datos de prueba ----------
        async esperarDatos() {
            await this.datos().dataLoaded();
            return this.datos().getData();
        },
        material(sMaterial) {
            return this.datos().getProperty("/materiales").find((m) => m.material === sMaterial);
        },
        stockLibre(sMaterial, sCentro, sAlmacen, sLote) {
            return this.datos().getProperty("/stock")
                .filter((s) => s.material === sMaterial && s.centro === sCentro && s.almacen === sAlmacen &&
                    (!sLote || s.lote === sLote))
                .reduce((n, s) => n + s.libre, 0);
        },
        almacenExiste(sCentro, sAlmacen) {
            return this.datos().getProperty("/almacenes").some((a) => a.centro === sCentro && a.almacen === sAlmacen);
        },
        hoyISO() {
            const d = new Date();
            return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
        },
        fechaCorta(sISO) {
            if (!sISO) { return ""; }
            const [a, m, d] = sISO.split("-").map(Number);
            return oFechaCorta.format(new Date(a, m - 1, d));
        },


        // Reglas de fechas comunes a ambos flujos (HU-05)
        validarFechas(oModelo, oCab, oCfg) {
            const sDoc = oCab.fechaDocumento;
            const sCont = oCab.fechaContabilizacion;
            const periodo = (sISO) => sISO.slice(5, 7) + "/" + sISO.slice(0, 4);
            if (!sDoc) {
                const s = this.getText("lblFechaDoc").toLowerCase();
                this.agregarError(oModelo, "/cabecera/fechaDocumento", this.getText("errFechaVacia", [s]), this.getText("errFechaVaciaDesc", [s]));
            }
            if (!sCont) {
                const s = this.getText("lblFechaCont").toLowerCase();
                this.agregarError(oModelo, "/cabecera/fechaContabilizacion", this.getText("errFechaVacia", [s]), this.getText("errFechaVaciaDesc", [s]));
                return;
            }
            if (sDoc && sDoc > sCont) {
                this.agregarError(oModelo, "/cabecera/fechaDocumento", this.getText("errFechasIncoherentes"),
                    this.getText("errFechasIncoherentesDesc", [this.fechaCorta(sCont)]));
            }
            if (!oCfg.periodosAbiertos.includes(sCont.slice(0, 7))) {
                this.agregarError(oModelo, "/cabecera/fechaContabilizacion", this.getText("errPeriodoCerrado", [periodo(sCont)]),
                    this.getText("errPeriodoCerradoDesc", [periodo(sCont), oCfg.periodosAbiertos.map((x) => periodo(x + "-01")).join(", ")]));
            }
        },

        // ---------- mensajes (MessagePopover) ----------
        prepararMensajes() {
            const oVista = this.getView();
            oVista.setModel(Messaging.getMessageModel(), "message");
            Messaging.registerObject(oVista, true);
        },
        limpiarMensajes() { Messaging.removeAllMessages(); },
        agregarError(oModelo, sTarget, sTitulo, sDescripcion, sCodigo) {
            Messaging.addMessages(new Message({
                message: sTitulo,
                description: sDescripcion,
                type: MessageType.Error,
                code: sCodigo || "",
                target: sTarget || undefined,
                processor: oModelo
            }));
        },
        async abrirMensajes(oBoton) {
            if (!this._pMensajes) {
                this._pMensajes = this.loadFragment({ name: "pe.pucp.tesis.migodcu.view.fragment.Mensajes" });
            }
            const oPopover = await this._pMensajes;
            this._oMensajeActual = null;
            oPopover.navigateBack();
            oPopover.openBy(oBoton || this.byId("btnMensajes"));
        },
        onMensajes(oEvent) { this.abrirMensajes(oEvent.getSource()); },
        onMensajeSeleccionado(oEvent) {
            const oCtx = oEvent.getParameter("item").getBindingContext("message");
            this._oMensajeActual = oCtx ? oCtx.getObject() : null;
        },
        onIrAlCampo(oEvent) {
            const oMensaje = oEvent.getParameter("item").getBindingContext("message").getObject();
            const sId = oMensaje.getControlIds()[0];
            const oControl = sId && Element.getElementById(sId);
            if (oControl) {
                this._pMensajes.then((oPopover) => oPopover.close());
                setTimeout(() => oControl.focus(), 0);
            }
        },

        onVerAlternativasMensaje() { /* solo se usa en la salida por producción */ },

        // ---------- aviso de pérdida de datos al cancelar (EH-04) ----------
        // propertyChange solo se dispara cuando el usuario cambia un valor en un control (binding de dos vías)
        vigilarCambios(oModelo) {
            this._bModificado = false;
            oModelo.attachPropertyChange(() => { this._bModificado = true; });
        },
        marcarModificado() { this._bModificado = true; },
        reiniciarCambios() { this._bModificado = false; },
        salirConAviso(sDestino, fnSalir) {
            if (!this._bModificado) { fnSalir(); return; }
            const sDescartar = this.getText("btnDescartarVolver");
            const sCancelar = this.getText("btnCancelar");
            MessageBox.warning(this.getText("perdidaDatos", [sDestino]), {
                title: this.getText("perdidaDatosTitulo"),
                actions: [sDescartar, sCancelar],
                emphasizedAction: sDescartar,
                initialFocus: sCancelar,
                onClose: (sAccion) => {
                    if (sAccion === sDescartar) {
                        this.reiniciarCambios();
                        fnSalir();
                    }
                }
            });
        },

        // ---------- ayuda de la pantalla (EH-22) ----------
        async onAyuda(oEvent) {
            const oBoton = oEvent.getSource();
            if (!this._pAyuda) {
                this._pAyuda = this.loadFragment({ name: "pe.pucp.tesis.migodcu.view.fragment.Ayuda" });
            }
            const oPopover = await this._pAyuda;
            const sPantalla = this.getView().getViewName().split(".").pop();
            const sGuia = this.datos().getProperty("/config/ejemploGuia");
            this.byId("txtAyuda").setText(this.getText("ayuda" + sPantalla, [sGuia]));
            oPopover.openBy(oBoton);
        },

        onVolverInicio() { this.getRouter().navTo("inicio"); }
    });
});
