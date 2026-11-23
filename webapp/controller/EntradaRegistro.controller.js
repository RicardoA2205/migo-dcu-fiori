sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"], (BaseController, JSONModel, MessageToast) => {
    "use strict";

    return BaseController.extend("pe.pucp.tesis.migodcu.controller.EntradaRegistro", {

        onInit() {
            const oReg = new JSONModel();
            this.getView().setModel(oReg, "reg");
            this.vigilarCambios(oReg);                       // EH-04
            this.prepararMensajes();
            this.getRouter().getRoute("entradaRegistro").attachPatternMatched(this._alEntrar, this);
        },

        // Carga la orden elegida en P101-01 y arma el modelo de la pantalla P101-02
        async _alEntrar(oEvent) {
            this.limpiarMensajes();
            const sNumero = oEvent.getParameter("arguments").orden;
            const oDatos = await this.esperarDatos();
            const oOrden = oDatos.ordenesCompra.find((o) => o.numero === sNumero);
            if (!oOrden) { this.getRouter().navTo("entradaOrden"); return; }
            const sHoy = this.hoyISO();
            const aPos = oOrden.posiciones.filter((p) => p.cantidadPendiente > 0).map((p) => ({
                pos: p.pos, material: p.material, descripcion: p.descripcion,
                cantidadPendiente: p.cantidadPendiente, cantidadRecibida: String(p.cantidadPendiente),
                unidad: p.unidad, centro: p.centro, almacen: p.almacen, tipoStock: p.tipoStock || "",
                conforme: false
            }));
            this.getModel("reg").setData({
                orden: { numero: oOrden.numero, proveedor: oOrden.proveedor, fecha: this.fechaCorta(oOrden.fecha) },
                cabecera: { fechaDocumento: sHoy, fechaContabilizacion: sHoy, guiaRemision: "", tipoVale: "1" },
                posiciones: aPos, seleccionadas: 0, columnas: { tipoStock: false },
                textos: {
                    tituloOrden: this.getText("tituloOrdenCompra", [oOrden.numero]),
                    tituloPosiciones: this.getText("posicionesTitulo", [aPos.length]),
                    seleccionadas: this.getText("seleccionadas", [0])
                }
            });
            this.byId("tblPosiciones").removeSelections(true);
            this.reiniciarCambios();
        },

        // ---------- acciones sobre varias posiciones (HU-12) ----------
        onSeleccion() {
            const n = this.byId("tblPosiciones").getSelectedItems().length;
            const oReg = this.getModel("reg");
            oReg.setProperty("/seleccionadas", n);
            oReg.setProperty("/textos/seleccionadas", this.getText("seleccionadas", [n]));
        },
        _marcarSeleccion(bConforme) {
            const oTabla = this.byId("tblPosiciones");
            oTabla.getSelectedContexts().forEach((oCtx) => oCtx.getModel().setProperty(oCtx.getPath() + "/conforme", bConforme));
            this.marcarModificado();
            oTabla.removeSelections(true);
            this.onSeleccion();
        },
        onMarcarConforme() { this._marcarSeleccion(true); },
        onExcluir() { this._marcarSeleccion(false); },

        async onColumnas(oEvent) {
            if (!this._pColumnas) {
                this._pColumnas = this.loadFragment({ name: "pe.pucp.tesis.migodcu.view.fragment.Columnas" });
            }
            (await this._pColumnas).openBy(oEvent.getSource());
        },

        // ---------- validación inmediata de la guía (HU-06) ----------
        onGuiaCambio(oEvent) {
            const oInput = oEvent.getSource();
            const sValor = oInput.getValue().trim();
            const oCfg = this.datos().getProperty("/config");
            if (sValor && !new RegExp(oCfg.formatoGuia).test(sValor)) {
                oInput.setValueState("Error");
                oInput.setValueStateText(this.getText("errGuiaFormatoDesc", [oCfg.ejemploGuia]));
            } else {
                oInput.setValueState("None");
            }
        },

        // ---------- verificación (HU-05, HU-06, HU-13) ----------
        _validar() {
            const oReg = this.getModel("reg");
            const d = oReg.getData();
            const oCfg = this.datos().getProperty("/config");
            const err = (sTarget, sTitulo, sDesc) => this.agregarError(oReg, sTarget, sTitulo, sDesc);
            this.limpiarMensajes();

            this.validarFechas(oReg, d.cabecera, oCfg);

            const sGuia = (d.cabecera.guiaRemision || "").trim();
            if (!sGuia) {
                err("/cabecera/guiaRemision", this.getText("errGuiaVacia"), this.getText("errGuiaVaciaDesc", [oCfg.ejemploGuia]));
            } else if (!new RegExp(oCfg.formatoGuia).test(sGuia)) {
                err("/cabecera/guiaRemision", this.getText("errGuiaFormato"), this.getText("errGuiaFormatoDesc", [oCfg.ejemploGuia]));
            }

            if (!d.posiciones.some((p) => p.conforme)) {
                err(null, this.getText("errSinConformes"), this.getText("errSinConformesDesc"));
            }
            d.posiciones.forEach((p, i) => {
                const nCant = Number(p.cantidadRecibida);
                if (nCant > p.cantidadPendiente) {
                    err(`/posiciones/${i}/cantidadRecibida`, this.getText("errCantidadMayor", [p.pos]),
                        this.getText("errCantidadMayorDesc", [p.pos, p.cantidadPendiente, p.unidad]));
                }
                if (!p.conforme) { return; }
                if (!(nCant > 0)) {
                    err(`/posiciones/${i}/cantidadRecibida`, this.getText("errCantidadCero", [p.pos]), this.getText("errCantidadCeroDesc", [p.pos]));
                }
                if (!this.almacenExiste(p.centro, p.almacen)) {
                    err(`/posiciones/${i}/almacen`, this.getText("errAlmacen", [p.pos, p.almacen, p.centro]),
                        this.getText("errAlmacenDesc", [p.pos, p.almacen, p.centro]));
                }
            });
            return this.getModel("message").getData().length === 0;
        },

        onVerificar() {
            if (this._validar()) {
                MessageToast.show(this.getText("sinVerificacion"));
            } else {
                this.abrirMensajes();                       // P101-02-E
            }
        },

        // ---------- contabilización con resumen previo (HU-15) ----------
        async onContabilizar() {
            if (!this._validar()) { this.abrirMensajes(); return; }
            const oReg = this.getModel("reg");
            const d = oReg.getData();
            const aReg = d.posiciones.filter((p) => p.conforme);
            const aAlm = [...new Set(aReg.map((p) => p.almacen))].join(", ");
            oReg.setProperty("/resumen", {
                posiciones: aReg,
                lineaOrden: this.getText("resumenLineaOrdenCompra", [d.orden.numero, d.orden.proveedor]),
                lineaFecha: this.getText("resumenFechaGuia", [this.fechaCorta(d.cabecera.fechaContabilizacion), d.cabecera.guiaRemision]),
                aRegistrar: this.getText("resumenARegistrar", [aReg.length]),
                noRegistradas: this.getText("resumenNoRegistradas", [d.posiciones.length - aReg.length]),
                aviso: this.getText("resumenAvisoEntrada", [aAlm])
            });
            if (!this._pResumen) {
                this._pResumen = this.loadFragment({ name: "pe.pucp.tesis.migodcu.view.fragment.ResumenEntrada" });
            }
            (await this._pResumen).open();                  // P101-03
        },
        onVolverCorregir() { this.byId("dlgResumenEntrada").close(); },

        // Simula la contabilización: actualiza los datos de prueba en memoria y genera el número de documento
        onConfirmar() {
            const oDatos = this.datos();
            const d = this.getModel("reg").getData();
            const aOrdenes = oDatos.getProperty("/ordenesCompra");
            const oOrden = aOrdenes.find((o) => o.numero === d.orden.numero);
            const aReg = d.posiciones.filter((p) => p.conforme);
            aReg.forEach((p) => {
                const oPosOrden = oOrden.posiciones.find((x) => x.pos === p.pos);
                oPosOrden.cantidadPendiente -= Number(p.cantidadRecibida);
                const aStock = oDatos.getProperty("/stock");
                const oStock = aStock.find((s) => s.material === p.material && s.centro === p.centro && s.almacen === p.almacen && !s.lote);
                if (oStock) { oStock.libre += Number(p.cantidadRecibida); }
                else { aStock.push({ material: p.material, centro: p.centro, almacen: p.almacen, lote: "", libre: Number(p.cantidadRecibida) }); }
            });
            const nDoc = oDatos.getProperty("/config/siguienteDocEntrada");
            oDatos.setProperty("/config/siguienteDocEntrada", nDoc + 1);
            oDatos.refresh(true);
            this.getOwnerComponent().getModel("resultado").setData({
                flujo: "entrada",
                titulo: this.getText("entradaRegistrada"),
                documento: String(nDoc),
                detalle: this.getText("detalleEntrada", [d.cabecera.fechaContabilizacion.slice(0, 4), d.orden.numero,
                    aReg.length, this.fechaCorta(d.cabecera.fechaContabilizacion)]),
                textoOtra: this.getText("btnOtraEntrada")
            });
            this.byId("dlgResumenEntrada").close();
            this.limpiarMensajes();
            this.reiniciarCambios();
            this.getRouter().navTo("resultado", { flujo: "entrada", documento: String(nDoc) }); // P101-04
        },

        // EH-04: si hay cambios, avisa que se perderán y a qué pantalla vuelve
        onCancelar() {
            this.salirConAviso(this.getText("lblOrdenCompra"), () => {
                this.limpiarMensajes();
                this.getRouter().navTo("entradaOrden");
            });
        }
    });
});
