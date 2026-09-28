sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    "use strict";

    var Journey = {
        run: function() {
            QUnit.module("First journey");

            opaTest("Start application", function (Given, When, Then) {
                Given.iStartMyApp();

                Then.onTheLibroDiarioNumeradoList.iSeeThisPage();

            });


            opaTest("Navigate to Gestión de Numeración", function (Given, When, Then) {
                // El botón custom del reporte principal navega a la ruta nueva
                When.onTheLibroDiarioNumeradoList.onTable().iExecuteAction("gestionNumeracion");
                Then.onThePeriodoNumeradoList.iSeeThisPage();

                When.onTheShell.iNavigateBack();
                Then.onTheLibroDiarioNumeradoList.iSeeThisPage();
            });

            opaTest("Navigate to ObjectPage", function (Given, When, Then) {
                // Note: this test will fail if the ListReport page doesn't show any data
                
                When.onTheLibroDiarioNumeradoList.onFilterBar().iExecuteSearch();
                
                Then.onTheLibroDiarioNumeradoList.onTable().iCheckRows();

                When.onTheLibroDiarioNumeradoList.onTable().iPressRow(0);
                Then.onTheLibroDiarioNumeradoObjectPage.iSeeThisPage();

            });

            opaTest("Teardown", function (Given, When, Then) { 
                // Cleanup
                Given.iTearDownMyApp();
            });
        }
    }

    return Journey;
});