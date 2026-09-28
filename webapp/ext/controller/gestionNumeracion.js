sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/BusyDialog"
], function (MessageToast, MessageBox, BusyDialog) {
    'use strict';

    const gestionNumeracionHelper = {
        _controller: null,

        _getBundle: function (oController) {
            return oController.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        // Botón "Gestión de Numeración" en el reporte principal: navega a la
        // segunda ruta (ListReport sobre /PeriodoNumerado)
        gestionNumeracion: function (oEvent) {
            gestionNumeracionHelper._controller = this._controller;
            const oController = gestionNumeracionHelper._controller;

            // En Fiori Elements, getOwnerComponent() desde el controlador de página
            // devuelve el componente del TEMPLATE (sin router), no el AppComponent.
            // 1) API oficial de routing del ExtensionAPI de FE
            if (this.routing && typeof this.routing.navigateToRoute === "function") {
                this.routing.navigateToRoute("GestionNumeracionList");
                return;
            }
            // 2) Fallback: router del AppComponent
            const oAppComponent = oController.getAppComponent
                ? oController.getAppComponent()
                : sap.ui.core.Component.getOwnerComponentFor(oController.getView());
            oAppComponent.getRouter().navTo("GestionNumeracionList");
        },

        // Botón "Anular Numeración" en Gestión de Numeración.
        // Firma de custom action FE V4: (oBindingContext, aSelectedContexts)
        anularNumeracion: async function (oBindingContext, aSelectedContexts) {
            gestionNumeracionHelper._controller = this._controller;
            const oController = gestionNumeracionHelper._controller;
            const oBundle = gestionNumeracionHelper._getBundle(oController);

            const aContexts = aSelectedContexts || [];
            if (!aContexts.length) {
                MessageToast.show(oBundle.getText("anularSinSeleccion"));
                return;
            }

            const oCtx = aContexts[0];

            // FE V4 solo hace $select de las columnas del LineItem. EsAnulable y
            // UltimoPeriodo no son columnas, así que getObject() los trae undefined.
            // requestProperty dispara un "late property request" para esta fila.
            try {
                await oCtx.requestProperty(["EsAnulable", "UltimoPeriodo", "CantidadAsientos"]);
            } catch (e) {
                MessageBox.error(oBundle.getText("anularError") + "\n" + (e && e.message ? e.message : e));
                return;
            }

            const oRow = oCtx.getObject();

            // Validación visual: la validación REAL vive en el backend
            // (acción AnularNumeracion de ZI_LD_GRABAR_NUM)
            if (oRow.EsAnulable !== "X") {
                MessageBox.warning(oBundle.getText("anularSoloUltimo", [oRow.UltimoPeriodo]));
                return;
            }

            MessageBox.confirm(
                oBundle.getText("anularConfirmText", [
                    oRow.Companycode,
                    oRow.Fiscalyear,
                    oRow.Periodo,
                    oRow.CantidadAsientos
                ]),
                {
                    title: oBundle.getText("anularConfirmTitle"),
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.CANCEL,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            gestionNumeracionHelper._ejecutarAnulacion(oRow, oCtx);
                        }
                    }
                }
            );
        },

        _ejecutarAnulacion: async function (oRow, oCtx) {
            const oController = gestionNumeracionHelper._controller;
            const oBundle = gestionNumeracionHelper._getBundle(oController);
            const oModel = oController.getOwnerComponent().getModel();

            const oBusy = this._busyDialog || new BusyDialog({
                title: oBundle.getText("anularBusyTitle"),
                text: oBundle.getText("anularBusyText")
            });
            this._busyDialog = oBusy;

            try {
                oBusy.open();

                // Acción estática (bound a la colección de GrabarNumeradorAsiento)
                const oAction = oModel.bindContext(
                    "/GrabarNumeradorAsiento/com.sap.gateway.srvd.zsd_ld6_numerados.v0001.AnularNumeracion(...)"
                );
                oAction.setParameter("Companycode", oRow.Companycode);
                oAction.setParameter("Fiscalyear", oRow.Fiscalyear);
                oAction.setParameter("Periodo", oRow.Periodo);

                await oAction.execute();

                MessageBox.success(
                    oBundle.getText("anularOk", [oRow.Periodo]),
                    {
                        onClose: function () {
                            // Refrescar la lista de períodos: el período anulado
                            // desaparece y el "último" baja solo
                            const oListBinding = oCtx.getBinding();
                            if (oListBinding && oListBinding.refresh) {
                                oListBinding.refresh();
                            }
                        }
                    }
                );

            } catch (e) {
                MessageBox.error(
                    oBundle.getText("anularError") + "\n" + (e && e.message ? e.message : e)
                );
            } finally {
                oBusy.close();
            }
        }
    };

    return gestionNumeracionHelper;
});
