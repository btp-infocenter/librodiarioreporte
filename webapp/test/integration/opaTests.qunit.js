sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'info/casatua/librodiarioreporte/test/integration/FirstJourney',
		'info/casatua/librodiarioreporte/test/integration/pages/LibroDiarioNumeradoList',
		'info/casatua/librodiarioreporte/test/integration/pages/LibroDiarioNumeradoObjectPage'
    ],
    function(JourneyRunner, opaJourney, LibroDiarioNumeradoList, LibroDiarioNumeradoObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('info/casatua/librodiarioreporte') + '/index.html'
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