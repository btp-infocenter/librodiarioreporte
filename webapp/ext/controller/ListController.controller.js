sap.ui.define([
  "sap/fe/core/controllerextensions/ControllerExtension",
  "sap/base/Log",
  "sap/m/ObjectStatus",
  "sap/ui/core/format/NumberFormat"
], function (ControllerExtension, Log, ObjectStatus, NumberFormat) {
  "use strict";

  return ControllerExtension.extend("info.infocenter.librodiarioreporte.ext.controller.ListController", {
    override: {
      onInit: function () {
        this._initializeRecordCount();
      },

      onInitPageExtension: function () {
        this._initializeRecordCount();
      },

      onAfterRendering: function () {
        Log.debug("[LibroDiario] ListController after rendering");
        this._scheduleRecordCountUpdater();
      }
    },

    _initializeRecordCount: function () {
      this._oRecordCountFormatter = this._oRecordCountFormatter ||
        NumberFormat.getIntegerInstance({ groupingEnabled: true });
      Log.debug("[LibroDiario] ListController extension initialized");
      this._scheduleRecordCountUpdater();
    },

    _scheduleRecordCountUpdater: function () {
      if (this._iRecordCountTimer) {
        clearTimeout(this._iRecordCountTimer);
      }

      this._iRecordCountTimer = setTimeout(function () {
        this._attachRecordCountUpdater(0);
      }.bind(this), 250);
    },

    _attachRecordCountUpdater: function (iAttempt) {
      var oTable = this._findLibroDiarioTable();
      var oBinding = this._findLibroDiarioBinding();

      if (!oBinding && iAttempt < 20) {
        this._iRecordCountTimer = setTimeout(function () {
          this._attachRecordCountUpdater(iAttempt + 1);
        }.bind(this), 500);
        return;
      }

      if (!oBinding) {
        Log.warning("[LibroDiario] Binding not found yet");
        return;
      }

      if (oTable) {
        this._oRecordCountTable = oTable;
        this._ensureBaseTableHeader(oTable);
        this._ensureRecordCountIndicator(oTable);
      }

      this._syncRecordCountBinding(oBinding);
      this._updateRecordCountHeader();
    },

    _findLibroDiarioTable: function () {
      var oView = this.base.getView();
      var aTables = oView.findAggregatedObjects(true, function (oControl) {
        return oControl.isA && (
          oControl.isA("sap.ui.mdc.Table") ||
          oControl.isA("sap.ui.table.Table") ||
          oControl.isA("sap.m.Table")
        );
      });

      var aMatchingTables = aTables.filter(function (oTable) {
        return this._isLibroDiarioTable(oTable);
      }.bind(this));

      return aMatchingTables.find(function (oTable) {
        return oTable.isA("sap.ui.mdc.Table");
      }) || aMatchingTables[0];
    },

    _isLibroDiarioTable: function (oTable) {
      var sId = oTable.getId && oTable.getId();

      if (sId && sId.includes("LibroDiarioNumerado")) {
        return true;
      }

      var oBinding = this._getTableRowBinding(oTable);
      var sPath = oBinding && oBinding.getPath && oBinding.getPath();

      return !!(sPath && sPath.includes("LibroDiarioNumerado"));
    },

    _findLibroDiarioBinding: function () {
      var oView = this.base.getView();
      var aControls = oView.findAggregatedObjects(true);

      for (var i = 0; i < aControls.length; i++) {
        var oBinding = this._getTableRowBinding(aControls[i]);
        var sPath = oBinding && oBinding.getPath && oBinding.getPath();

        if (sPath && sPath.includes("LibroDiarioNumerado")) {
          return oBinding;
        }
      }

      return null;
    },

    _syncRecordCountBinding: function (oBinding) {
      if (!oBinding || oBinding === this._oRecordCountBinding) {
        return;
      }

      this._detachRecordCountBinding();
      this._oRecordCountBinding = oBinding;
      this._fnUpdateRecordCountHeader = this._fnUpdateRecordCountHeader || this._updateRecordCountHeader.bind(this);

      if (oBinding.attachChange) {
        oBinding.attachChange(this._fnUpdateRecordCountHeader);
      }
      if (oBinding.attachDataReceived) {
        oBinding.attachDataReceived(this._fnUpdateRecordCountHeader);
      }
      if (oBinding.attachRefresh) {
        oBinding.attachRefresh(this._fnUpdateRecordCountHeader);
      }
    },

    _detachRecordCountBinding: function () {
      if (!this._oRecordCountBinding || !this._fnUpdateRecordCountHeader) {
        return;
      }

      if (this._oRecordCountBinding.detachChange) {
        this._oRecordCountBinding.detachChange(this._fnUpdateRecordCountHeader);
      }
      if (this._oRecordCountBinding.detachDataReceived) {
        this._oRecordCountBinding.detachDataReceived(this._fnUpdateRecordCountHeader);
      }
      if (this._oRecordCountBinding.detachRefresh) {
        this._oRecordCountBinding.detachRefresh(this._fnUpdateRecordCountHeader);
      }
    },

    _getTableRowBinding: function (oTable) {
      var aControls = [oTable];

      if (oTable.findAggregatedObjects) {
        aControls = aControls.concat(oTable.findAggregatedObjects(true));
      }

      for (var i = 0; i < aControls.length; i++) {
        var oControl = aControls[i];
        var oBinding = oControl.getRowBinding && oControl.getRowBinding();

        if (oBinding) {
          return oBinding;
        }

        oBinding = oControl.getBinding && (oControl.getBinding("rows") || oControl.getBinding("items"));

        if (oBinding) {
          return oBinding;
        }
      }

      return null;
    },

    _ensureBaseTableHeader: function (oTable) {
      if (this._sRecordCountBaseHeader !== undefined) {
        return;
      }

      this._sRecordCountBaseHeader = this._readTableHeader(oTable) || "Libro Diario";
      this._sRecordCountBaseHeader = this._stripRecordCountSuffix(this._sRecordCountBaseHeader);
    },

    _ensureRecordCountIndicator: function (oTable) {
      if (this._oRecordCountIndicator) {
        return;
      }

      this._oRecordCountIndicator = new ObjectStatus({
        text: "Registros recuperados: 0",
        state: "Information"
      }).addStyleClass("sapUiTinyMarginBegin");

      var oActionTable = this._findTableWithActions(oTable);

      if (oActionTable) {
        oActionTable.addAction(this._oRecordCountIndicator);
      }
    },

    _findTableWithActions: function (oControl) {
      var oCandidate = oControl;

      while (oCandidate) {
        if (oCandidate.addAction) {
          return oCandidate;
        }
        oCandidate = oCandidate.getParent && oCandidate.getParent();
      }

      return null;
    },

    _updateRecordCountBanner: function (sCount) {
      var oViewDom = this.base.getView().getDomRef && this.base.getView().getDomRef();

      if (!oViewDom) {
        Log.warning("[LibroDiario] View DOM not available for record count banner");
        return;
      }

      if (!this._oRecordCountBannerDom || !this._oRecordCountBannerDom.parentNode) {
        this._oRecordCountBannerDom = document.createElement("div");
        this._oRecordCountBannerDom.id = "libroDiarioRecordCountBanner";
        this._oRecordCountBannerDom.setAttribute("role", "status");
        this._oRecordCountBannerDom.style.margin = "0 3rem 0.75rem 3rem";
        this._oRecordCountBannerDom.style.padding = "0.75rem 1rem";
        this._oRecordCountBannerDom.style.borderRadius = "0.75rem";
        this._oRecordCountBannerDom.style.fontSize = "1rem";
        this._oRecordCountBannerDom.style.fontWeight = "700";
        this._oRecordCountBannerDom.style.color = "var(--sapTextColor)";
        this._oRecordCountBannerDom.style.background = "var(--sapInformativeBackground)";
        this._oRecordCountBannerDom.style.border = "1px solid var(--sapInformativeBorderColor)";

        var oTableDom = this._oRecordCountTable && this._oRecordCountTable.getDomRef &&
          this._oRecordCountTable.getDomRef();
        var oTargetParent = oTableDom && oTableDom.parentNode;

        if (oTargetParent) {
          oTargetParent.insertBefore(this._oRecordCountBannerDom, oTableDom);
        } else {
          oViewDom.insertBefore(this._oRecordCountBannerDom, oViewDom.firstChild);
        }
      }

      this._oRecordCountBannerDom.textContent = "Registros recuperados: " + sCount;
      Log.debug("[LibroDiario] Record count updated", sCount);
    },

    _updateRecordCountHeader: function () {
      var oBinding = this._oRecordCountBinding;

      if (!oBinding) {
        return;
      }

      var iCount = oBinding.getLength && oBinding.getLength();

      if (typeof iCount !== "number" || iCount < 0) {
        return;
      }

      var bIsFinal = !oBinding.isLengthFinal || oBinding.isLengthFinal();
      var sCount = this._oRecordCountFormatter.format(iCount) + (bIsFinal ? "" : "+");
      var sCountText = sCount + " registros recuperados";
      var sHeader = this._sRecordCountBaseHeader + " (" + sCountText + ")";

      if (this._oRecordCountIndicator) {
        this._oRecordCountIndicator.setText("Registros recuperados: " + sCount);
      }

      this._updateRecordCountBanner(sCount);

      if (this._oRecordCountTable) {
        this._writeTableHeader(this._oRecordCountTable, sHeader);
      }
    },

    _readTableHeader: function (oTable) {
      if (oTable.getHeader) {
        return oTable.getHeader();
      }
      if (oTable.getTitle) {
        return oTable.getTitle();
      }
      return "";
    },

    _writeTableHeader: function (oTable, sHeader) {
      if (oTable.setHeader) {
        oTable.setHeader(sHeader);
        return;
      }
      if (oTable.setTitle && typeof oTable.getTitle() === "string") {
        oTable.setTitle(sHeader);
      }
    },

    _stripRecordCountSuffix: function (sHeader) {
      return sHeader.replace(/\s*\([\d.,]+\+? registros recuperados\)$/, "");
    }
  });
});
