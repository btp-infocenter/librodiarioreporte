sap.ui.define([
  "sap/fe/core/controllerextensions/ControllerExtension"
], function (ControllerExtension) {
  "use strict";

  return ControllerExtension.extend("info.agrobay.librodiarioreporte.ext.controller.ListController", {
    override: {
      onInitPageExtension: function () {
        // Esto debería aparecer en la consola
        console.log("✅ [DEBUG] CARGÓ ListController.controller.js desde onInitPageExtension");
      }
    }
  });
});








