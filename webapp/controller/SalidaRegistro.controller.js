sap.ui.define(["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"], (BaseController, JSONModel, MessageToast) => {
    "use strict";

    return BaseController.extend("pe.pucp.tesis.migodcu.controller.SalidaRegistro", {

        onInit() {
            const oReg = new JSONModel();
            this.getView().setModel(oReg, "reg");
            this.vigilarCambios(oReg);                       // EH-04
            this.prepararMensajes();
            this.getRouter().getRoute("salidaRegistro").attachPatternMatched(this._alEntrar, this);
        },

        async _alEntrar(oEvent) {
            this.limpiarMensajes();
            const sNumero = oEvent.getParameter("arguments").orden;
            const oDatos = await this.esperarDatos();
            const oOrden = oDatos.ordenesProduccion.find((o) => o.numero === sNumero && o.estado === "LIB");
            if (!oOrden) { this.getRouter().navTo("salidaOrden"); return; }
            const sHoy = this.hoyISO();
            const aPos = oOrden.componentes.map((c) => this._nuevaFila(c.pos, c.material, c.cantidadNecesaria,
                c.cantidadNecesaria, c.centro, c.almacen, c.lote, false));
            this.getModel("reg").setData({
                orden: {
                    numero: oOrden.numero, descripcion: oOrden.descripcion, centro: oOrden.componentes[0] ? oOrden.componentes[0].centro : "",
                    materialTexto: oOrden.material + " – " + oOrden.descripcion + " · " + oOrden.cantidad + " " + oOrden.unidad,
                    fechaInicio: this.fechaCorta(oOrden.fechaInicio)
                },
                cabecera: { fechaDocumento: sHoy, fechaContabilizacion: sHoy, textoCabecera: "" },
                posiciones: aPos, columnas: { tipoStock: false },
                textos: { tituloOrden: this.getText("tituloOrdenProduccion", [oOrden.numero]) }
            });
            this._actualizarTitulo();
            this.reiniciarCambios();
        },

        // Arma una fila de la tabla con su stock disponible y faltante (HU-10)
        _nuevaFila(nPos, sMaterial, nNecesaria, nEntregar, sCentro, sAlmacen, sLote, bNoPlanificado) {
            const oMat = this.material(sMaterial) || { descripcion: "", unidad: "", lote: false };
            const oFila = {
                pos: nPos, material: sMaterial, descripcion: oMat.descripcion, unidad: oMat.unidad,
                cantidadNecesaria: nNecesaria, cantidadEntregar: String(nEntregar), centro: sCentro, almacen: sAlmacen,
                lote: sLote || "", manejaLote: !!oMat.lote, tipoStock: "Libre utilización",
                conforme: true, noPlanificado: bNoPlanificado, entregaParcial: false
            };
            this._calcularStock(oFila);
            return oFila;
        },
        _calcularStock(oFila) {
            oFila.stock = this.stockLibre(oFila.material, oFila.centro, oFila.almacen, oFila.manejaLote ? oFila.lote : "");
            oFila.faltante = Math.max(0, Number(oFila.cantidadEntregar) - oFila.stock);
            oFila.stockTexto = oFila.faltante > 0 ? this.getText("stockFaltan", [oFila.stock, oFila.faltante]) : String(oFila.stock);
        },
        // Recalcula el stock de una fila y actualiza solo esa fila (no usar refresh(true): borra los mensajes)
        _actualizarFila(iFila, mCambios) {
            const oReg = this.getModel("reg");
            const sRuta = `/posiciones/${iFila}`;
            const oFila = Object.assign({}, oReg.getProperty(sRuta), mCambios || {});
            this._calcularStock(oFila);
            Object.keys(oFila).forEach((k) => oReg.setProperty(`${sRuta}/${k}`, oFila[k]));
        },
        onCambioFila(oEvent) {
            const sRuta = oEvent.getSource().getBindingContext("reg").getPath();
            this._actualizarFila(Number(sRuta.split("/")[2]));
        },
        _actualizarTitulo() {
            const oReg = this.getModel("reg");
            oReg.setProperty("/textos/tituloPosiciones", this.getText("posicionesTitulo", [oReg.getProperty("/posiciones").length]));
        },

        async onColumnas(oEvent) {
            if (!this._pColumnas) {
                this._pColumnas = this.loadFragment({ name: "pe.pucp.tesis.migodcu.view.fragment.Columnas" });
            }
            (await this._pColumnas).openBy(oEvent.getSource());
        },

        // ---------- componente no planificado ----------
        async onNoPlanificado() {
            this.getModel("reg").setProperty("/nuevo", { material: "", cantidad: "", almacen: "", estado: "None", estadoTexto: "" });
            if (!this._pNoPlan) {
                this._pNoPlan = this.loadFragment({ name: "pe.pucp.tesis.migodcu.view.fragment.NoPlanificado" });
            }
            (await this._pNoPlan).open();
        },
        onCancelarNoPlanificado() { this.byId("dlgNoPlanificado").close(); },
        onAgregarNoPlanificado() {
            const oReg = this.getModel("reg");
            const n = oReg.getProperty("/nuevo");
            const sMat = (n.material || "").trim();
            if (!this.material(sMat)) {
                oReg.setProperty("/nuevo/estado", "Error");
                oReg.setProperty("/nuevo/estadoTexto", this.getText("npMaterialNoExiste", [sMat]));
                return;
            }
            const aPos = oReg.getProperty("/posiciones");
            const nPos = (aPos.length ? Math.max(...aPos.map((p) => p.pos)) : 0) + 10;
            oReg.setProperty("/posiciones", aPos.concat([this._nuevaFila(nPos, sMat, 0, Number(n.cantidad) || 0,
                oReg.getProperty("/orden/centro"), (n.almacen || "").trim(), "", true)]));
            this._actualizarTitulo();
            this.marcarModificado();
            this.byId("dlgNoPlanificado").close();
        },

        // ---------- verificación (HU-05, HU-13, HU-14) ----------
        _validar() {
            const oReg = this.getModel("reg");
            const d = oReg.getData();
            const oCfg = this.datos().getProperty("/config");
            const err = (sTarget, sTitulo, sDesc, sCodigo) => this.agregarError(oReg, sTarget, sTitulo, sDesc, sCodigo);
            d.posiciones.forEach((p, i) => this._actualizarFila(i));   // primero se recalcula el stock de cada fila
            this.limpiarMensajes();
            this.validarFechas(oReg, d.cabecera, oCfg);
            if (!d.posiciones.some((p) => p.conforme)) {
                err(null, this.getText("errSinConformes"), this.getText("errSinConformesDesc"));
            }
            d.posiciones.forEach((p, i) => {
                if (!p.conforme) { return; }
                const nCant = Number(p.cantidadEntregar);
                if (!(nCant > 0)) {
                    err(`/posiciones/${i}/cantidadEntregar`, this.getText("errCantidadCero", [p.pos]), this.getText("errCantidadCeroDesc", [p.pos]));
                }
                if (!this.almacenExiste(p.centro, p.almacen)) {
                    err(`/posiciones/${i}/almacen`, this.getText("errAlmacen", [p.pos, p.almacen, p.centro]),
                        this.getText("errAlmacenDesc", [p.pos, p.almacen, p.centro]));
                }
                if (p.manejaLote && !p.lote) {
                    err(`/posiciones/${i}/lote`, this.getText("errLote", [p.pos]), this.getText("errLoteDesc", [p.pos, p.material]));
                }
                if (p.faltante > 0) {
                    err(`/posiciones/${i}/cantidadEntregar`, this.getText("errStock", [p.pos]),
                        this.getText("errStockDesc", [p.pos, p.descripcion, nCant, p.unidad, p.stock, p.almacen, p.faltante, p.material]), "STOCK");
                }
            });
            return this.getModel("message").getData().length === 0;
        },

        onVerificar() {
            if (this._validar()) { MessageToast.show(this.getText("sinVerificacion")); }
            else { this.abrirMensajes(); }                  // P261-02-E
        },

        // ---------- stock insuficiente: alternativas (P261-03) ----------
        onVerAlternativasMensaje() {
            // El enlace del detalle no tiene contexto: se usa el mensaje elegido o, si hay uno solo, ese
            const aStock = this.getModel("message").getData().filter((m) => m.getCode() === "STOCK");
            const oActual = this._oMensajeActual;
            const oMensaje = oActual && oActual.getCode() === "STOCK" ? oActual : aStock[0];
            const iFila = Number(oMensaje.getTargets()[0].split("/")[2]);
            this._pMensajes.then((oPopover) => oPopover.close());
            this._abrirAlternativas(iFila);
        },
        onVerAlternativasFila(oEvent) {
            const sPath = oEvent.getSource().getBindingContext("reg").getPath();
            this._abrirAlternativas(Number(sPath.split("/")[2]));
        },
        async _abrirAlternativas(iFila) {
            const oReg = this.getModel("reg");
            const p = oReg.getProperty(`/posiciones/${iFila}`);
            const nNec = Number(p.cantidadEntregar);
            oReg.setProperty("/alternativa", {
                fila: iFila, op1: false, op2: false,
                linea: this.getText("stockLinea", [p.descripcion, p.material, p.pos]),
                necesario: nNec + " " + p.unidad,
                lblDisponible: this.getText("stockDisponible", [p.almacen]),
                disponible: p.stock + " " + p.unidad,
                faltan: (nNec - p.stock) + " " + p.unidad,
                opcion1: this.getText("stockOpcion1", [p.stock, p.unidad]),
                opcion1Desc: this.getText("stockOpcion1Desc", [p.stock, p.unidad, nNec - p.stock])
            });
            if (!this._pStock) {
                this._pStock = this.loadFragment({ name: "pe.pucp.tesis.migodcu.view.fragment.StockInsuficiente" });
            }
            (await this._pStock).open();
        },
        onCancelarAlternativa() { this.byId("dlgStock").close(); },
        onAplicarAlternativa() {
            const oReg = this.getModel("reg");
            const a = oReg.getProperty("/alternativa");
            const p = oReg.getProperty(`/posiciones/${a.fila}`);
            this._actualizarFila(a.fila, a.op1
                ? { entregaParcial: true, cantidadEntregar: String(p.stock) }   // entregar lo disponible
                : { conforme: false });                                          // excluir el componente
            this.marcarModificado();
            this.byId("dlgStock").close();
            this._validar();
        },

        // ---------- contabilización con resumen previo (HU-15) ----------
        async onContabilizar() {
            if (!this._validar()) { this.abrirMensajes(); return; }
            const oReg = this.getModel("reg");
            const d = oReg.getData();
            const aReg = d.posiciones.filter((p) => p.conforme);
            const aParc = aReg.filter((p) => p.entregaParcial).map((p) =>
                this.getText("resumenParcial", [p.pos, p.cantidadEntregar, p.cantidadNecesaria, p.unidad]));
            oReg.setProperty("/resumen", {
                posiciones: aReg,
                tituloPosiciones: this.getText("posicionesTitulo", [aReg.length]),     // EH-13
                lineaOrden: this.getText("resumenLineaOrdenProd", [d.orden.numero, d.orden.descripcion]),
                lineaFecha: this.getText("resumenFecha", [this.fechaCorta(d.cabecera.fechaContabilizacion)]),
                aRegistrar: this.getText("resumenARegistrarSalida", [aReg.length, aReg.filter((p) => p.noPlanificado).length]),
                parciales: aParc.join(" "),
                aviso: this.getText("resumenAvisoSalida", [d.orden.numero])
            });
            if (!this._pResumen) {
                this._pResumen = this.loadFragment({ name: "pe.pucp.tesis.migodcu.view.fragment.ResumenSalida" });
            }
            (await this._pResumen).open();                  // P261-04
        },
        onVolverCorregir() { this.byId("dlgResumenSalida").close(); },

        onConfirmar() {
            const oDatos = this.datos();
            const d = this.getModel("reg").getData();
            const aReg = d.posiciones.filter((p) => p.conforme);
            aReg.forEach((p) => {
                let nPorDescontar = Number(p.cantidadEntregar);
                oDatos.getProperty("/stock")
                    .filter((s) => s.material === p.material && s.centro === p.centro && s.almacen === p.almacen && (!p.manejaLote || s.lote === p.lote))
                    .forEach((s) => { const n = Math.min(s.libre, nPorDescontar); s.libre -= n; nPorDescontar -= n; });
            });
            const nDoc = oDatos.getProperty("/config/siguienteDocSalida");
            oDatos.setProperty("/config/siguienteDocSalida", nDoc + 1);
            oDatos.refresh(true);
            this.getOwnerComponent().getModel("resultado").setData({
                flujo: "salida",
                titulo: this.getText("salidaRegistrada"),
                documento: String(nDoc),
                anio: d.cabecera.fechaContabilizacion.slice(0, 4),
                detalle: this.getText("detalleSalida", [d.cabecera.fechaContabilizacion.slice(0, 4), d.orden.numero,
                    aReg.length, this.fechaCorta(d.cabecera.fechaContabilizacion)]),
                textoOtra: this.getText("btnOtraSalida")
            });
            this.byId("dlgResumenSalida").close();
            this.limpiarMensajes();
            this.reiniciarCambios();
            this.getRouter().navTo("resultado", { flujo: "salida", documento: String(nDoc) }); // P261-05
        },

        // EH-04: si hay cambios, avisa que se perderán y a qué pantalla vuelve
        onCancelar() {
            this.salirConAviso(this.getText("lblOrdenProduccion"), () => {
                this.limpiarMensajes();
                this.getRouter().navTo("salidaOrden");
            });
        }
    });
});
