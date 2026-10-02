sap.ui.define([
    "sap/fe/core/controllerextensions/BaseControllerExtension",
    "sap/ui/mdc/enums/FilterBarValidationStatus"
], function (BaseControllerExtension, FilterBarValidationStatus) {
    "use strict";

    return BaseControllerExtension.extend("info.infocenter.librodiarioreporte.ext.controller.ListController", {
        override: {
            onInit: function () {
                this._scheduleDocumentDateValidation();
            },

            onAfterRendering: function () {
                this._scheduleDocumentDateValidation();
            },

            // Hook FE: corre al cambiar condiciones del FilterBar, antes del Go.
            onPendingFilters: function () {
                this._validateDocumentDateFilter();
            },

            onAfterClear: function () {
                this._scheduleDocumentDateValidation();
            }
        },

        _scheduleDocumentDateValidation: function (iAttempt) {
            var iRetry = iAttempt || 0;
            if (this._iDocumentDateValidationTimer) {
                clearTimeout(this._iDocumentDateValidationTimer);
            }
            this._iDocumentDateValidationTimer = setTimeout(function () {
                if (!this._validateDocumentDateFilter() && iRetry < 40) {
                    this._scheduleDocumentDateValidation(iRetry + 1);
                }
            }.bind(this), 250);
        },

        _getLibroDiarioFilterBar: function () {
            // ID estable verificado en runtime desde consola.
            var oFilterBar = sap.ui.getCore().byId(
                "info.infocenter.librodiarioreporte::LibroDiarioNumeradoList--fe::FilterBar::LibroDiarioNumerado"
            );
            if (oFilterBar && oFilterBar.isA && oFilterBar.isA("sap.ui.mdc.FilterBar")) {
                return oFilterBar;
            }
            var aFallback = this.base.getView().findAggregatedObjects(true, function (oControl) {
                return oControl.isA && oControl.isA("sap.ui.mdc.FilterBar");
            });
            return aFallback[0] || null;
        },

        _getDocumentDateField: function (oFilterBar) {
            var aFilterBars = oFilterBar ? [oFilterBar] : [this._getLibroDiarioFilterBar()];
            for (var i = 0; i < aFilterBars.length; i++) {
                if (!aFilterBars[i]) { continue; }
                var aItems = aFilterBars[i].getFilterItems();
                for (var j = 0; j < aItems.length; j++) {
                    if (aItems[j].getPropertyKey() === "DocumentDate") {
                        return aItems[j];
                    }
                }
            }
            return null;
        },

        _documentDateInvalidMessage: function (oField) {
            var aConditions = (oField && oField.getConditions) ? (oField.getConditions() || []) : [];
            var sMessage = "Fecha del Documento debe corresponder a un mes calendario completo.";
            if (aConditions.length === 1 && aConditions[0].values && aConditions[0].values.length === 2) {
                var sFrom = aConditions[0].values[0];
                var sTo = aConditions[0].values[1];
                var aFrom = typeof sFrom === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(sFrom);
                var aTo = typeof sTo === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(sTo);
                if (aFrom && aTo) {
                    var iYear = Number(aFrom[1]);
                    var iMonth = Number(aFrom[2]);
                    var iLastDay = new Date(iYear, iMonth, 0).getDate();
                    if (iMonth >= 1 && iMonth <= 12 && aFrom[3] === "01" &&
                        aFrom[1] === aTo[1] && aFrom[2] === aTo[2] && Number(aTo[3]) === iLastDay) {
                        sMessage = "";
                    }
                }
            }
            return sMessage;
        },

        _validateDocumentDateFilter: function () {
            var oFilterBar = this._getLibroDiarioFilterBar();
            var oField = this._getDocumentDateField(oFilterBar);
            if (!oField) {
                return false;
            }

            this._fnDocumentDateChanged = this._fnDocumentDateChanged || this._validateDocumentDateFilter.bind(this);

            if (oField !== this._oValidatedDocumentDateField) {
                if (this._oValidatedDocumentDateField) {
                    this._oValidatedDocumentDateField.detachChange(this._fnDocumentDateChanged);
                }
                this._oValidatedDocumentDateField = oField;
                oField.attachChange(this._fnDocumentDateChanged);
            }

            if (oFilterBar && oFilterBar !== this._oDocumentDateEventBar) {
                if (this._oDocumentDateEventBar && this._oDocumentDateEventBar.detachFiltersChanged) {
                    this._oDocumentDateEventBar.detachFiltersChanged(this._fnDocumentDateChanged);
                }
                this._oDocumentDateEventBar = oFilterBar;
                if (oFilterBar.attachFiltersChanged) {
                    oFilterBar.attachFiltersChanged(this._fnDocumentDateChanged);
                }
            }

            var sMessage = this._documentDateInvalidMessage(oField);
            oField.setValueState(sMessage ? "Error" : "None");
            oField.setValueStateText(sMessage);

            this._ensureFilterBarDelegateWrap(oFilterBar);
            return true;
        },

        // El pipeline de Go puede limpiar el ValueState.Error de un campo requerido
        // (FilterBarBase._handleAsyncValidation) antes del checkFilters final. El
        // delegate.determineValidationState corre siempre dentro de ese pipeline y
        // después de esa limpieza: re-afirmamos el error ahí para que el search no
        // se dispare nunca con un rango que no es un mes calendario completo.
        _ensureFilterBarDelegateWrap: function (oFilterBar) {
            var that = this;
            if (!oFilterBar || !oFilterBar.awaitControlDelegate || oFilterBar._bLibroDiarioMonthDelegateWrapped) {
                return;
            }
            oFilterBar._bLibroDiarioMonthDelegateWrapped = true;

            oFilterBar.awaitControlDelegate().then(function (oDelegate) {
                if (!oDelegate || typeof oDelegate.determineValidationState !== "function") {
                    return;
                }
                var fnOriginal = oDelegate.determineValidationState.bind(oDelegate);
                oDelegate.determineValidationState = function (oFB, vValidationResult) {
                    return Promise.resolve(fnOriginal(oFB, vValidationResult)).then(function (vStatus) {
                        var oField = that._getDocumentDateField(oFB);
                        if (oField) {
                            var sMessage = that._documentDateInvalidMessage(oField);
                            if (sMessage) {
                                oField.setValueState("Error");
                                oField.setValueStateText(sMessage);
                                return FilterBarValidationStatus.FieldInErrorState;
                            }
                        }
                        return vStatus;
                    });
                };
            });
        }
    });
});
