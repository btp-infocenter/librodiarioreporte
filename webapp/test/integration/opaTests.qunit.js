sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'info/agrobay/librodiarioreporte/test/integration/FirstJourney',
		'info/agrobay/librodiarioreporte/test/integration/pages/LibroDiarioNumeradoList',
		'info/agrobay/librodiarioreporte/test/integration/pages/LibroDiarioNumeradoObjectPage'
    ],
    function(JourneyRunner, opaJourney, LibroDiarioNumeradoList, LibroDiarioNumeradoObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('info/agrobay/librodiarioreporte') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheLibroDiarioNumeradoList: LibroDiarioNumeradoList,
					onTheLibroDiarioNumeradoObjectPage: LibroDiarioNumeradoObjectPage
                }
            },
            opaJourney.run
        );
    }
);