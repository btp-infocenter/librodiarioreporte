sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'info.casatua.librodiarioreporte',
            componentId: 'LibroDiarioNumeradoObjectPage',
            contextPath: '/LibroDiarioNumerado'
        },
        CustomPageDefinitions
    );
});