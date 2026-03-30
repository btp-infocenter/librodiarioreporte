sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/BusyDialog",
    "sap/ui/model/json/JSONModel"
], function (MessageToast, Filter, FilterOperator, BusyDialog, JSONModel) {
    "use strict";

    // Crear el modelo AttHeaderModel
    const oAttHeaderModel = new JSONModel({
        fiscalYear: null,
        companyCode: null,
        dateLow: null,
        dateHigh: null,
        comments: "sin comentarios",
        zmoneda: "PYG",
        total_periodo: null,   // decimal como string

        mimetype: null,
        filename: null,
        url: null,
        blob: null
    });

    const datosLibroDiario = [
        { nroAsiento: "1", fecha: "01.04.2021", cuenta: "1230001", descripcionCuenta: "Caja general", debe: "100000", haber: "0" },
        { nroAsiento: "1", fecha: "01.04.2021", cuenta: "1230002", descripcionCuenta: "Banco Nación", debe: "0", haber: "100000" },
        { nroAsiento: "2", fecha: "02.04.2021", cuenta: "1230003", descripcionCuenta: "Clientes", debe: "50000", haber: "0" },
        { nroAsiento: "2", fecha: "02.04.2021", cuenta: "1230004", descripcionCuenta: "Ventas", debe: "0", haber: "50000" },
        { nroAsiento: "2", fecha: "02.04.2021", cuenta: "1230004", descripcionCuenta: "Ventas", debe: "0", haber: "50000" },
        { nroAsiento: "2", fecha: "02.04.2021", cuenta: "1230004", descripcionCuenta: "Ventas", debe: "0", haber: "50000" },
        { nroAsiento: "2", fecha: "02.04.2021", cuenta: "1230004", descripcionCuenta: "Ventas", debe: "0", haber: "50000" },
        { nroAsiento: "2", fecha: "02.04.2021", cuenta: "1230004", descripcionCuenta: "Ventas", debe: "0", haber: "50000" },
        { nroAsiento: "3", fecha: "03.04.2021", cuenta: "1230005", descripcionCuenta: "Proveedores", debe: "0", haber: "70000" },
        { nroAsiento: "3", fecha: "03.04.2021", cuenta: "1230006", descripcionCuenta: "Compras", debe: "70000", haber: "0" },
        { nroAsiento: "4", fecha: "04.04.2021", cuenta: "1230007", descripcionCuenta: "Sueldo a pagar", debe: "0", haber: "90000" },
        { nroAsiento: "4", fecha: "04.04.2021", cuenta: "1230008", descripcionCuenta: "Gastos de personal", debe: "90000", haber: "0" },
        { nroAsiento: "4", fecha: "04.04.2021", cuenta: "1230008", descripcionCuenta: "Gastos de personal", debe: "90000", haber: "0" },
        { nroAsiento: "4", fecha: "04.04.2021", cuenta: "1230008", descripcionCuenta: "Gastos de personal", debe: "90000", haber: "0" },
        { nroAsiento: "4", fecha: "04.04.2021", cuenta: "1230008", descripcionCuenta: "Gastos de personal", debe: "90000", haber: "0" },
        { nroAsiento: "5", fecha: "05.04.2021", cuenta: "1230009", descripcionCuenta: "Muebles y útiles", debe: "20000", haber: "0" },
        { nroAsiento: "5", fecha: "05.04.2021", cuenta: "1230010", descripcionCuenta: "Proveedores", debe: "0", haber: "20000" },
        { nroAsiento: "6", fecha: "06.04.2021", cuenta: "1230011", descripcionCuenta: "Impuestos a pagar", debe: "0", haber: "30000" },
        { nroAsiento: "6", fecha: "06.04.2021", cuenta: "1230011", descripcionCuenta: "Impuestos a pagar", debe: "0", haber: "30000" },
        { nroAsiento: "6", fecha: "06.04.2021", cuenta: "1230011", descripcionCuenta: "Impuestos a pagar", debe: "0", haber: "30000" },
        { nroAsiento: "6", fecha: "06.04.2021", cuenta: "1230011", descripcionCuenta: "Impuestos a pagar", debe: "0", haber: "30000" },
        { nroAsiento: "6", fecha: "06.04.2021", cuenta: "1230011", descripcionCuenta: "Impuestos a pagar", debe: "0", haber: "30000" },
        { nroAsiento: "6", fecha: "06.04.2021", cuenta: "1230012", descripcionCuenta: "Impuestos", debe: "30000", haber: "0" },
        { nroAsiento: "7", fecha: "07.04.2021", cuenta: "1230013", descripcionCuenta: "Gastos generales", debe: "15000", haber: "0" },
        { nroAsiento: "7", fecha: "07.04.2021", cuenta: "1230014", descripcionCuenta: "Caja general", debe: "0", haber: "15000" },
        { nroAsiento: "7", fecha: "07.04.2021", cuenta: "1230014", descripcionCuenta: "Caja general", debe: "0", haber: "15000" },
        { nroAsiento: "7", fecha: "07.04.2021", cuenta: "1230014", descripcionCuenta: "Caja general", debe: "0", haber: "15000" },
        { nroAsiento: "8", fecha: "08.04.2021", cuenta: "1230015", descripcionCuenta: "Banco Nación", debe: "20000", haber: "0" },
        { nroAsiento: "8", fecha: "08.04.2021", cuenta: "1230016", descripcionCuenta: "Clientes", debe: "0", haber: "20000" },
        { nroAsiento: "9", fecha: "09.04.2021", cuenta: "1230017", descripcionCuenta: "Servicios Públicos", debe: "8000", haber: "0" },
        { nroAsiento: "9", fecha: "09.04.2021", cuenta: "1230018", descripcionCuenta: "Banco Nación", debe: "0", haber: "8000" },
        { nroAsiento: "9", fecha: "09.04.2021", cuenta: "1230018", descripcionCuenta: "Banco Nación", debe: "0", haber: "8000" },
        { nroAsiento: "9", fecha: "09.04.2021", cuenta: "1230018", descripcionCuenta: "Banco Nación", debe: "0", haber: "8000" },
        { nroAsiento: "9", fecha: "09.04.2021", cuenta: "1230018", descripcionCuenta: "Banco Nación", debe: "0", haber: "8000" },
        { nroAsiento: "10", fecha: "10.04.2021", cuenta: "1230019", descripcionCuenta: "Caja general", debe: "12000", haber: "0" },
        { nroAsiento: "10", fecha: "10.04.2021", cuenta: "1230020", descripcionCuenta: "Ventas", debe: "0", haber: "12000" },
        { nroAsiento: "11", fecha: "11.04.2021", cuenta: "1230021", descripcionCuenta: "Clientes", debe: "40000", haber: "0" },
        { nroAsiento: "11", fecha: "11.04.2021", cuenta: "1230022", descripcionCuenta: "Ventas", debe: "0", haber: "40000" },
        { nroAsiento: "12", fecha: "12.04.2021", cuenta: "1230023", descripcionCuenta: "Banco Nación", debe: "35000", haber: "0" },
        { nroAsiento: "12", fecha: "12.04.2021", cuenta: "1230024", descripcionCuenta: "Proveedores", debe: "0", haber: "35000" },
        { nroAsiento: "13", fecha: "13.04.2021", cuenta: "1230025", descripcionCuenta: "Gastos de administración", debe: "6000", haber: "0" },
        { nroAsiento: "13", fecha: "13.04.2021", cuenta: "1230026", descripcionCuenta: "Caja general", debe: "0", haber: "6000" },
        { nroAsiento: "14", fecha: "14.04.2021", cuenta: "1230027", descripcionCuenta: "Compras", debe: "25000", haber: "0" },
        { nroAsiento: "14", fecha: "14.04.2021", cuenta: "1230028", descripcionCuenta: "Proveedores", debe: "0", haber: "25000" },
        { nroAsiento: "15", fecha: "15.04.2021", cuenta: "1230029", descripcionCuenta: "Banco Nación", debe: "15000", haber: "0" },
        { nroAsiento: "15", fecha: "15.04.2021", cuenta: "1230030", descripcionCuenta: "Clientes", debe: "0", haber: "15000" },
        { nroAsiento: "16", fecha: "16.04.2021", cuenta: "1230031", descripcionCuenta: "Caja general", debe: "10000", haber: "0" },
        { nroAsiento: "16", fecha: "16.04.2021", cuenta: "1230032", descripcionCuenta: "Ventas", debe: "0", haber: "10000" },
        { nroAsiento: "17", fecha: "17.04.2021", cuenta: "1230033", descripcionCuenta: "Clientes", debe: "30000", haber: "0" },
        { nroAsiento: "17", fecha: "17.04.2021", cuenta: "1230034", descripcionCuenta: "Ventas", debe: "0", haber: "30000" },
        { nroAsiento: "18", fecha: "18.04.2021", cuenta: "1230035", descripcionCuenta: "Servicios Públicos", debe: "7000", haber: "0" },
        { nroAsiento: "18", fecha: "18.04.2021", cuenta: "1230036", descripcionCuenta: "Banco Nación", debe: "0", haber: "7000" },
        { nroAsiento: "19", fecha: "19.04.2021", cuenta: "1230037", descripcionCuenta: "Caja general", debe: "11000", haber: "0" }
    ];

    const oBusyDialog = new BusyDialog({
        title: "Por favor espere",
        text: "Creando PDF..."
    });
    function parsearNumeroFormateado(str) {
        if (!str || str === "0") return 0;
        // Remover puntos (separador de miles) y reemplazar coma por punto (decimal)
        return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
    }
    //Armar el content del PDF con salto de página si no entra
    function generarLibroDiario(datosLibroDiario) {
        const alturaHoja = 742;
        const alturaCabezera = 39;
        const alturaDescripcionTotal = 32;
        const alturaTransporte = 16;
        const alturaFila = 15;
        const alturaMaxima = alturaHoja - alturaCabezera;
        const limiteGruposPorHoja = 705;

        const agrupados = [];
        datosLibroDiario.forEach((registro) => {
            let grupo = agrupados.find(g => g.nroAsiento === registro.nroAsiento);
            if (!grupo) {
                grupo = {
                    nroAsiento: registro.nroAsiento,
                    fecha: registro.fecha,
                    registros: [],
                    totalDebe: 0,
                    totalHaber: 0,
                    descripcionAsiento: `${registro.tipoAsiento} - ${registro.textoTipoAsiento}`
                };
                agrupados.push(grupo);
            }
            grupo.registros.push(registro);
            grupo.totalDebe += parsearNumeroFormateado(registro.debe);
            grupo.totalHaber += parsearNumeroFormateado(registro.haber);
        });

        const content = [];
        let alturaAcumulada = 0;
        let transporteDebe = 0;
        let transporteHaber = 0;

        for (let i = 0; i < agrupados.length; i++) {
            const grupo = agrupados[i];
            // Altura completa del grupo: líneas + descripción + total + márgenes
            const alturaGrupo = (grupo.registros.length * alturaFila) + alturaDescripcionTotal + 10;

            // Verificar si el grupo es demasiado grande para cualquier página
            if (alturaGrupo > limiteGruposPorHoja) {
                console.warn(`Asiento ${grupo.nroAsiento} es muy grande (${grupo.registros.length} registros), dividiendo en múltiples páginas`);

                // Si hay contenido acumulado, hacer salto de página primero
                if (alturaAcumulada > alturaDescripcionTotal) { // Cambio aquí: verificar que hay contenido real
                    content.push(
                        {
                            columns: [
                                { text: "Transporte", width: "70%", bold: true, alignment: "center", fontSize: 10, margin: [5, 5, 0, 0] },
                                { text: transporteDebe.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", bold: true, margin: [0, 5, 0, 0] },
                                { text: transporteHaber.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", bold: true, margin: [0, 5, 5, 0] }
                            ]
                        },
                        { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8 }], margin: [0, 2, 0, 0] },
                        { text: "", pageBreak: "after" }
                    );

                    alturaAcumulada = 0;
                    i--;
                    continue; // Volver a procesar este grupo en la nueva página
                }

                // Dividir el grupo grande en sub-grupos
                const maxRegistrosPorPagina = Math.floor((limiteGruposPorHoja - alturaDescripcionTotal) / alturaFila);
                const subGrupos = [];

                for (let j = 0; j < grupo.registros.length; j += maxRegistrosPorPagina) {
                    const subRegistros = grupo.registros.slice(j, j + maxRegistrosPorPagina);
                    const esUltimoSubGrupo = j + maxRegistrosPorPagina >= grupo.registros.length;

                    subGrupos.push({
                        registros: subRegistros,
                        esUltimoSubGrupo: esUltimoSubGrupo,
                        esPrimerSubGrupo: j === 0
                    });
                }

                // Procesar cada sub-grupo
                subGrupos.forEach((subGrupo, subIndex) => {
                    subGrupo.registros.forEach((registro, index) => {
                        const isFirst = index === 0 && subGrupo.esPrimerSubGrupo;
                        const mostrarNumeroAsiento = isFirst;
                        const mostrarFecha = isFirst;

                        content.push({
                            columns: [
                                { text: mostrarNumeroAsiento ? grupo.nroAsiento.toString() : "", width: "15%", fontSize: 8, margin: [5, 0, 0, 0] },
                                { text: mostrarFecha ? grupo.fecha : "", width: "15%", fontSize: 8 },
                                { text: registro.cuenta, width: "15%", fontSize: 8 },
                                { text: registro.descripcionCuenta, width: "25%", fontSize: 8 },
                                { text: registro.debe, width: "15%", fontSize: 8, alignment: "right" },
                                { text: registro.haber, width: "15%", fontSize: 8, alignment: "right", margin: [0, 0, 5, 0] }
                            ],
                            margin: [0, 5, 0, 2]
                        });
                    });

                    // Solo mostrar descripción y total en el último sub-grupo
                    if (subGrupo.esUltimoSubGrupo) {
                        content.push(
                            { text: grupo.descripcionAsiento, bold: true, fontSize: 8, margin: [5, 2, 0, 2] },
                            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8 }], margin: [0, 2, 0, 0] },
                            {
                                columns: [
                                    { text: "Total Asiento", width: "70%", bold: true, fontSize: 8, margin: [5, 5, 0, 0] },
                                    { text: grupo.totalDebe.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", margin: [0, 5, 0, 0] },
                                    { text: grupo.totalHaber.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", margin: [0, 5, 5, 0] }
                                ]
                            },
                            { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8 }], margin: [0, 2, 0, 2] }
                        );
                    }

                    // Salto de página después de cada sub-grupo (excepto el último)
                    if (!subGrupo.esUltimoSubGrupo) {
                        content.push({ text: "", pageBreak: "after" });
                    }
                });

                // ⭐ CRÍTICO: Después del grupo grande, calcular altura del último subGrupo
                const ultimoSubGrupo = subGrupos[subGrupos.length - 1];
                const alturaUltimoSubGrupo = ultimoSubGrupo.registros.length * alturaFila + alturaDescripcionTotal;
                alturaAcumulada = alturaUltimoSubGrupo;

                transporteDebe += grupo.totalDebe;
                transporteHaber += grupo.totalHaber;

            } else if (alturaAcumulada + alturaGrupo + alturaTransporte <= limiteGruposPorHoja) {
                // Grupo normal que cabe en la página actual
                grupo.registros.forEach((registro, index) => {
                    const isFirst = index === 0;
                    content.push({
                        columns: [
                            { text: isFirst ? grupo.nroAsiento.toString() : "", width: "15%", fontSize: 8, margin: [5, 0, 0, 0] },
                            { text: isFirst ? grupo.fecha : "", width: "15%", fontSize: 8 },
                            { text: registro.cuenta, width: "15%", fontSize: 8 },
                            { text: registro.descripcionCuenta, width: "25%", fontSize: 8 },
                            { text: registro.debe, width: "15%", fontSize: 8, alignment: "right" },
                            { text: registro.haber, width: "15%", fontSize: 8, alignment: "right", margin: [0, 0, 5, 0] }
                        ],
                        margin: [0, 5, 0, 2]
                    });
                });

                content.push(
                    { text: grupo.descripcionAsiento, bold: true, fontSize: 8, margin: [5, 2, 0, 2] },
                    { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8 }], margin: [0, 2, 0, 0] },
                    {
                        columns: [
                            { text: "Total Asiento", width: "70%", bold: true, fontSize: 8, margin: [5, 5, 0, 0] },
                            { text: grupo.totalDebe.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", margin: [0, 5, 0, 0] },
                            { text: grupo.totalHaber.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", margin: [0, 5, 5, 0] }
                        ]
                    },
                    { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8 }], margin: [0, 2, 0, 2] }
                );

                alturaAcumulada += alturaGrupo;
                transporteDebe += grupo.totalDebe;
                transporteHaber += grupo.totalHaber;
            } else {
                // Grupo normal que no cabe - salto de página estándar
                console.log(`➕ Agregando Transporte - alturaAcumulada=${alturaAcumulada}, grupo actual=${grupo.nroAsiento}`);

                content.push(
                    {
                        columns: [
                            { text: "Transporte", width: "70%", bold: true, alignment: "center", fontSize: 10, margin: [5, 5, 0, 0] },
                            { text: transporteDebe.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", bold: true, margin: [0, 5, 0, 0] },
                            { text: transporteHaber.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", bold: true, margin: [0, 5, 5, 0] }
                        ],
                        noPageBreakBefore: true  // ← Flag para evitar salto antes del Transporte
                    },
                    { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8 }], margin: [0, 2, 0, 0], noPageBreakBefore: true },
                    { text: "", pageBreak: "after" }
                );

                alturaAcumulada = 0;
                i--;
            }
        }

        // ⭐ Solo agregar transporte final si NO terminamos con un pageBreak
        // (es decir, si hay contenido acumulado)
        if (alturaAcumulada > 0) {
            content.push(
                {
                    columns: [
                        { text: "Transporte", width: "70%", bold: true, alignment: "center", fontSize: 10, margin: [5, 5, 0, 0] },
                        { text: transporteDebe.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", bold: true, margin: [0, 5, 0, 0] },
                        { text: transporteHaber.toLocaleString("de-DE"), width: "15%", fontSize: 8, alignment: "right", bold: true, margin: [0, 5, 5, 0] }
                    ]
                },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8 }], margin: [0, 2, 0, 0] }
            );
        }

        //Grabamos el total y la moneda
        const oOwnerComponent = PdfHelper._controller?.getOwnerComponent && PdfHelper._controller.getOwnerComponent();
        const oAttModel = oOwnerComponent.getModel("oAttHeaderModel")
        if (oAttModel) {
            oAttHeaderModel.setProperty("/total_periodo", transporteDebe);
        }
        // Al final de generarLibroDiario, antes del return:
        console.log('=== RESUMEN DE CONTENT GENERADO ===');
        let pageBreakCount = 0;
        let transporteCount = 0;
        content.forEach((item, idx) => {
            if (item.pageBreak === 'after') {
                pageBreakCount++;
                console.log(`[${idx}] PageBreak #${pageBreakCount}`);
                // ⭐ Verificar si el anterior también fue pageBreak
                if (idx > 0 && content[idx - 1].pageBreak === 'after') {
                    console.error(`❌ PROBLEMA: PageBreak doble en índices ${idx - 1} y ${idx}`);
                }
            }
            if (item.columns && item.columns[0]?.text === 'Transporte') {
                transporteCount++;
                console.log(`[${idx}] Transporte #${transporteCount} - Debe: ${item.columns[1].text}, Haber: ${item.columns[2].text}`);
            }
        });
        console.log(`Total PageBreaks: ${pageBreakCount}, Total Transportes: ${transporteCount}`);
        console.log('====================================');
        return content;
    }
    // Agregar esta función antes de buildLibroDiarioPDF
    function limpiarContentArray(content) {
        const cleaned = [];
        let lastWasPageBreak = false;

        for (let i = 0; i < content.length; i++) {
            const item = content[i];
            const isPageBreak = item.pageBreak === 'after';

            // ⭐ No agregar pageBreak si el anterior también lo fue
            if (isPageBreak && lastWasPageBreak) {
                console.warn(`PageBreak doble detectado en índice ${i}, omitiendo...`);
                continue;
            }

            // ⭐ No agregar pageBreak si es el último elemento
            if (isPageBreak && i === content.length - 1) {
                console.warn(`PageBreak al final del documento, omitiendo...`);
                continue;
            }

            cleaned.push(item);
            lastWasPageBreak = isPageBreak;
        }

        console.log(`Content limpiado: ${content.length} → ${cleaned.length} elementos`);
        return cleaned;
    }
    function buildCabeceraHoja(titulo, columnas) {
        return [
            {
                text: titulo,
                alignment: "center",
                bold: true,
                fontSize: 10,
                margin: [0, 0, 0, 10]
            },
            {
                canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
                margin: [0, 0, 0, 5]
            },
            {
                columns: columnas.map((col, i) => {
                    const base = {
                        text: col,
                        bold: true,
                        fontSize: 8
                    };

                    if (i === 0) return { ...base, width: "15%", margin: [5, 0, 0, 0] };
                    if (i === 3) return { ...base, width: "25%" };
                    if (i === 4 || i === 5) {
                        return {
                            ...base,
                            width: "15%",
                            alignment: "right",
                            margin: i === 5 ? [0, 0, 5, 0] : undefined
                        };
                    }

                    return { ...base, width: "15%" };
                }),
                margin: [0, 2, 0, 2]
            },
            {
                canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.8 }]
            }
        ];
    }

    const transformarDatos = (aDatos) => {
        return aDatos.map((item) => {
            // Corregir fecha
            let fecha = item.DocumentDate;
            if (fecha.startsWith("0205")) {
                fecha = fecha.replace("0205", "2025");
            }

            // Asegurar formato DD.MM.YYYY
            const fechaFormateada = fecha.includes("-")
                ? fecha.split("-").reverse().join(".")
                : fecha;

            return {
                nroAsiento: String(item.Numerador),
                fecha: fechaFormateada,
                cuenta: item.GLAccount || "",
                descripcionCuenta: item.GLAccountName || "",
                debe: Math.abs(Number(item.Debe)).toLocaleString("de-DE"),
                haber: Math.abs(Number(item.Haber)).toLocaleString("de-DE"),
                tipoAsiento: item.AccountingDocumentType || "",
                textoTipoAsiento: item.AccountingDocumentTypeText || ""
            };
        });
    };

    function splitIntoChunks(array, chunkSize) {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    }

    // Convert pdfMake docDefinition to jsPDF with autoTable
    // function convertToJsPDF(docDefinition) {
    //     const { jsPDF } = window.jspdf;
    //     const doc = new jsPDF('p', 'pt', 'a4');

    //     let currentY = 60;
    //     let currentPage = 1;

    //     // Process content
    //     docDefinition.content.forEach((item, index) => {
    //         if (typeof item === 'object') {
    //             if (item.text && item.alignment === 'center' && item.bold) {
    //                 // Title
    //                 doc.setFontSize(item.fontSize || 10);
    //                 doc.setFont('helvetica', 'bold');
    //                 doc.text(item.text, doc.internal.pageSize.width / 2, currentY, { align: 'center' });
    //                 currentY += item.margin ? item.margin[3] + 10 : 20;
    //             } else if (item.canvas) {
    //                 // Line
    //                 const line = item.canvas[0];
    //                 doc.setLineWidth(line.lineWidth || 0.8);
    //                 doc.line(40, currentY, 555, currentY);
    //                 currentY += item.margin ? item.margin[3] + 5 : 10;
    //             } else if (item.columns) {
    //                 // Table row or header
    //                 if (item.columns.every(col => col.bold) && item.columns.length === 6) {
    //                     // Header row
    //                     doc.setFontSize(8);
    //                     doc.setFont('helvetica', 'bold');

    //                     const headers = item.columns.map(col => col.text);
    //                     const colWidths = [75, 75, 75, 125, 75, 75]; // Adjusted widths
    //                     let xPos = 40;

    //                     headers.forEach((header, i) => {
    //                         const alignment = item.columns[i].alignment === 'right' ? 'right' : 'left';
    //                         const x = alignment === 'right' ? xPos + colWidths[i] - 5 : xPos + 5;
    //                         doc.text(header, x, currentY, { align: alignment });
    //                         xPos += colWidths[i];
    //                     });
    //                     currentY += 15;
    //                 } else if (item.columns.length === 3) {
    //                     // Total row (3 columns: Total text, Debe, Haber)
    //                     // Add small spacing before total row
    //                     currentY += 3;

    //                     doc.setFontSize(8);
    //                     const isBold = item.columns.some(col => col.bold);
    //                     doc.setFont('helvetica', isBold ? 'bold' : 'normal');

    //                     const colWidths = [75, 75, 75, 125, 75, 75]; // Base column widths

    //                     // Total text (spans first 4 columns)
    //                     const totalText = item.columns[0].text || '';
    //                     const alignment0 = item.columns[0].alignment === 'center' ? 'center' : 'left';
    //                     const x0 = alignment0 === 'center' ? 40 + (colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]) / 2 : 45;
    //                     doc.text(totalText, x0, currentY, { align: alignment0 });

    //                     // Debe value (column 5)
    //                     const debeText = item.columns[1].text || '';
    //                     const xDebe = 40 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] - 5;
    //                     doc.text(debeText, xDebe, currentY, { align: 'right' });

    //                     // Haber value (column 6)
    //                     const haberText = item.columns[2].text || '';
    //                     const xHaber = 40 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] - 5;
    //                     doc.text(haberText, xHaber, currentY, { align: 'right' });

    //                     currentY += 8;
    //                 } else {
    //                     // Regular data row (6 columns)
    //                     // Add small spacing before data rows so they don't touch lines above
    //                     currentY += 2;

    //                     doc.setFontSize(8);
    //                     const isBold = item.columns.some(col => col.bold);
    //                     doc.setFont('helvetica', isBold ? 'bold' : 'normal');

    //                     const colWidths = [75, 75, 75, 125, 75, 75];
    //                     let xPos = 40;

    //                     item.columns.forEach((col, i) => {
    //                         const alignment = col.alignment === 'right' ? 'right' :
    //                             col.alignment === 'center' ? 'center' : 'left';
    //                         const x = alignment === 'right' ? xPos + colWidths[i] - 5 :
    //                             alignment === 'center' ? xPos + colWidths[i] / 2 : xPos + 5;
    //                         doc.text(col.text || '', x, currentY, { align: alignment });
    //                         xPos += colWidths[i];
    //                     });
    //                     currentY += 10; // Reduced from 12 to 10
    //                 }
    //             } else if (item.text && item.bold && !item.alignment) {
    //                 // Description text
    //                 doc.setFontSize(8);
    //                 doc.setFont('helvetica', 'bold');
    //                 doc.text(item.text, 45, currentY);
    //                 currentY += 6; // Reduced from 12 to 6
    //             } else if (item.pageBreak === 'after') {
    //                 // Page break
    //                 doc.addPage();
    //                 currentY = 60;
    //                 currentPage++;

    //                 // Re-add header for new page
    //                 doc.setFontSize(10);
    //                 doc.setFont('helvetica', 'bold');
    //                 doc.text("Libro Diario", doc.internal.pageSize.width / 2, currentY, { align: 'center' });
    //                 currentY += 20;

    //                 // Add header line
    //                 doc.setLineWidth(1);
    //                 doc.line(40, currentY, 555, currentY);
    //                 currentY += 10;

    //                 // Add column headers
    //                 doc.setFontSize(8);
    //                 doc.setFont('helvetica', 'bold');
    //                 const headers = ["Nro Asiento", "Fecha", "Cuenta", "Descripción de Cuenta", "Debe", "Haber"];
    //                 const colWidths = [75, 75, 75, 125, 75, 75];
    //                 let xPos = 40;

    //                 headers.forEach((header, i) => {
    //                     const alignment = (i === 4 || i === 5) ? 'right' : 'left';
    //                     const x = alignment === 'right' ? xPos + colWidths[i] - 5 : xPos + 5;
    //                     doc.text(header, x, currentY, { align: alignment });
    //                     xPos += colWidths[i];
    //                 });
    //                 currentY += 15;

    //                 // Add header line
    //                 doc.setLineWidth(0.8);
    //                 doc.line(40, currentY, 555, currentY);
    //                 currentY += 10;
    //             }

    //             // Check if we need a new page
    //             if (currentY > doc.internal.pageSize.height - 100 && item.pageBreak !== 'after') {
    //                 doc.addPage();
    //                 currentY = 60;
    //                 currentPage++;

    //                 // Re-add header for new page
    //                 doc.setFontSize(10);
    //                 doc.setFont('helvetica', 'bold');
    //                 doc.text("Libro Diario", doc.internal.pageSize.width / 2, currentY, { align: 'center' });
    //                 currentY += 20;

    //                 // Add header line
    //                 doc.setLineWidth(1);
    //                 doc.line(40, currentY, 555, currentY);
    //                 currentY += 10;

    //                 // Add column headers
    //                 doc.setFontSize(8);
    //                 doc.setFont('helvetica', 'bold');
    //                 const headers = ["Nro Asiento", "Fecha", "Cuenta", "Descripción de Cuenta", "Debe", "Haber"];
    //                 const colWidths = [75, 75, 75, 125, 75, 75];
    //                 let xPos = 40;

    //                 headers.forEach((header, i) => {
    //                     const alignment = (i === 4 || i === 5) ? 'right' : 'left';
    //                     const x = alignment === 'right' ? xPos + colWidths[i] - 5 : xPos + 5;
    //                     doc.text(header, x, currentY, { align: alignment });
    //                     xPos += colWidths[i];
    //                 });
    //                 currentY += 15;

    //                 // Add header line
    //                 doc.setLineWidth(0.8);
    //                 doc.line(40, currentY, 555, currentY);
    //                 currentY += 10;
    //             }
    //         }
    //     });

    //     // Add page numbers
    //     const pageCount = doc.internal.getNumberOfPages();
    //     for (let i = 1; i <= pageCount; i++) {
    //         doc.setPage(i);
    //         doc.setFontSize(8);
    //         doc.setFont('helvetica', 'normal');
    //         doc.text(
    //             `Página ${i} de ${pageCount}`,
    //             doc.internal.pageSize.width / 2,
    //             doc.internal.pageSize.height - 20,
    //             { align: 'center' }
    //         );
    //     }

    //     return doc;
    // }

    const PdfHelper = {
        _jsPDFLoaded: false,
        _autoTableLoaded: false,
        _controller: null,
        cargarMetadata: async function (oTableBinding) {
            try {
                // Usar el binding existente de la tabla - más eficiente
                const iLength = oTableBinding.getLength();

                if (iLength === 0) {
                    throw new Error("No hay datos en la tabla para exportar.");
                }

                // Obtener todos los contextos cargados en la tabla
                const aContexts = [];

                // Si hay más de 1000 registros, usar paginación
                const iMaxContexts = Math.min(iLength, 5000); // Límite máximo
                const iChunkSize = 1000; // Tamaño de chunk para paginación

                for (let i = 0; i < iMaxContexts; i += iChunkSize) {
                    const iEnd = Math.min(i + iChunkSize, iMaxContexts);
                    const aChunkContexts = await oTableBinding.requestContexts(i, iEnd - i);
                    aContexts.push(...aChunkContexts);
                }

                // Extraer datos de los contextos
                const aDatos = aContexts.map(oContext => oContext.getObject());

                console.log(`PDF: Procesando ${aDatos.length} registros del binding existente`);
                return aDatos;

            } catch (error) {
                console.error("Error obteniendo datos del binding:", error);
                throw new Error("No se pudieron obtener los datos de la tabla.");
            }
        },

        cargarMetadataChunked: async function (oTableBinding, totalRecords) {
            try {
                const allData = [];
                const chunkSize = 500; // Chunks más pequeños para evitar crashes
                const maxRecords = Math.min(totalRecords, 10000); // Límite absoluto

                for (let i = 0; i < maxRecords; i += chunkSize) {
                    const end = Math.min(i + chunkSize, maxRecords);

                    // Actualizar progreso
                    oBusyDialog.setText(`Cargando datos: ${end}/${maxRecords} registros...`);

                    // Procesar chunk con delay para evitar freeze del UI
                    const contexts = await oTableBinding.requestContexts(i, end - i);
                    const chunkData = contexts.map(ctx => ctx.getObject());
                    allData.push(...chunkData);

                    // Pequeño delay para permitir que el UI responda
                    await new Promise(resolve => setTimeout(resolve, 10));
                }

                console.log(`PDF: Procesados ${allData.length} registros en chunks`);
                return allData;

            } catch (error) {
                console.error("Error en carga chunked:", error);
                throw new Error(`Error cargando datos: ${error.message}`);
            }
        },

        convertToJsPDFOptimized: async function (docDefinition, totalRecords) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');

            let currentY = 60;
            let currentPage = 1;

            const content = docDefinition.content;
            const chunkSize = totalRecords > 1000 ? 50 : 100;

            for (let i = 0; i < content.length; i += chunkSize) {
                const chunk = content.slice(i, i + chunkSize);

                const progress = Math.round((i / content.length) * 100);
                oBusyDialog.setText(`Generando PDF: ${progress}%`);

                chunk.forEach((item) => {
                    let skipPageCheck = false;

                    if (typeof item === 'object') {
                        if (item.text && item.alignment === 'center' && item.bold) {
                            // Title
                            doc.setFontSize(item.fontSize || 10);
                            doc.setFont('helvetica', 'bold');
                            doc.text(item.text, doc.internal.pageSize.width / 2, currentY, { align: 'center' });
                            currentY += item.margin ? item.margin[3] + 10 : 20;
                        } else if (item.canvas) {
                            // Line - NO verificar altura, confiar en generarLibroDiario
                            const line = item.canvas[0];
                            doc.setLineWidth(line.lineWidth || 0.8);
                            doc.line(40, currentY, 555, currentY);
                            currentY += item.margin ? item.margin[3] + 5 : 10;
                            skipPageCheck = true; // No verificar después de líneas
                        } else if (item.columns) {
                            if (item.columns.every(col => col.bold) && item.columns.length === 6) {
                                // Header row
                                doc.setFontSize(8);
                                doc.setFont('helvetica', 'bold');

                                const headers = item.columns.map(col => col.text);
                                const colWidths = [75, 75, 75, 125, 75, 75];
                                let xPos = 40;

                                headers.forEach((header, idx) => {
                                    const alignment = item.columns[idx].alignment === 'right' ? 'right' : 'left';
                                    const x = alignment === 'right' ? xPos + colWidths[idx] - 5 : xPos + 5;
                                    doc.text(header, x, currentY, { align: alignment });
                                    xPos += colWidths[idx];
                                });
                                currentY += 15;
                            } else if (item.columns.length === 3) {
                                // Total row o Transporte - NO hacer pageBreak automático aquí
                                currentY += 6;

                                doc.setFontSize(8);
                                const isBold = item.columns.some(col => col.bold);
                                doc.setFont('helvetica', isBold ? 'bold' : 'normal');

                                const colWidths = [75, 75, 75, 125, 75, 75];

                                const totalText = item.columns[0].text || '';
                                const alignment0 = item.columns[0].alignment === 'center' ? 'center' : 'left';
                                const x0 = alignment0 === 'center' ? 40 + (colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]) / 2 : 45;
                                doc.text(totalText, x0, currentY, { align: alignment0 });

                                const debeText = item.columns[1].text || '';
                                const xDebe = 40 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] - 5;
                                doc.text(debeText, xDebe, currentY, { align: 'right' });

                                const haberText = item.columns[2].text || '';
                                const xHaber = 40 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] - 5;
                                doc.text(haberText, xHaber, currentY, { align: 'right' });

                                currentY += 8;
                                skipPageCheck = true; // No verificar después de totales/transporte
                            } else {
                                // Regular data row (6 columns) - ÚNICO lugar donde verificar altura
                                const alturaFila = 13;
                                if (currentY + alturaFila > doc.internal.pageSize.height - 60) {
                                    doc.addPage();
                                    currentY = 60;
                                    currentPage++;
                                    this._addPageHeader(doc, currentY);
                                    currentY += 55;
                                }

                                currentY += 3;

                                doc.setFontSize(8);
                                const isBold = item.columns.some(col => col.bold);
                                doc.setFont('helvetica', isBold ? 'bold' : 'normal');

                                const colWidths = [75, 75, 75, 125, 75, 75];
                                let xPos = 40;

                                item.columns.forEach((col, idx) => {
                                    const alignment = col.alignment === 'right' ? 'right' :
                                        col.alignment === 'center' ? 'center' : 'left';
                                    const x = alignment === 'right' ? xPos + colWidths[idx] - 5 :
                                        alignment === 'center' ? xPos + colWidths[idx] / 2 : xPos + 5;
                                    doc.text(col.text || '', x, currentY, { align: alignment });
                                    xPos += colWidths[idx];
                                });
                                currentY += 10;
                                skipPageCheck = true; // Ya verificamos arriba
                            }
                        } else if (item.text && item.bold && !item.alignment) {
                            // Description text - NO hacer pageBreak automático
                            currentY += 5;
                            doc.setFontSize(8);
                            doc.setFont('helvetica', 'bold');
                            doc.text(item.text, 45, currentY);
                            currentY += 6;
                            skipPageCheck = true;
                        } else if (item.pageBreak === 'after') {
                            // PageBreak explícito - SIEMPRE procesarlo
                            doc.addPage();
                            currentY = 60;
                            currentPage++;
                            this._addPageHeader(doc, currentY);
                            currentY += 55;
                            skipPageCheck = true;
                        }

                        // ⭐ ELIMINADO: Ya no hay verificación de altura al final
                        // Confiamos completamente en generarLibroDiario para la paginación
                    }
                });

                await new Promise(resolve => setTimeout(resolve, 5));
            }

            this._addPageNumbers(doc);
            return doc;
        },

        _addPageHeader: function (doc, startY) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text("Libro Diario", doc.internal.pageSize.width / 2, startY, { align: 'center' });

            // Add header line
            doc.setLineWidth(1);
            doc.line(40, startY + 15, 555, startY + 15);

            // Add column headers
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            const headers = ["Nro Asiento", "Fecha", "Cuenta", "Descripción de Cuenta", "Debe", "Haber"];
            const colWidths = [75, 75, 75, 125, 75, 75];
            let xPos = 40;

            headers.forEach((header, i) => {
                const alignment = (i === 4 || i === 5) ? 'right' : 'left';
                const x = alignment === 'right' ? xPos + colWidths[i] - 5 : xPos + 5;
                doc.text(header, x, startY + 35, { align: alignment });
                xPos += colWidths[i];
            });

            // Add header line
            doc.setLineWidth(0.8);
            doc.line(40, startY + 45, 555, startY + 45);
        },

        _addPageNumbers: function (doc) {
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.text(
                    `Página ${i} de ${pageCount}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 20,
                    { align: 'center' }
                );
            }
        },

        imprimirPDF: async function () {
            oBusyDialog.open();
            try {
                // Obtener tabla y su binding existente - más eficiente
                const oTable = sap.ui.getCore().byId("info.infocenter.librodiarioreporte::LibroDiarioNumeradoList--fe::table::LibroDiarioNumerado::LineItem-innerTable");
                const oBinding = oTable?.getBinding("rows");

                if (!oBinding || oBinding.getLength() === 0) {
                    sap.m.MessageToast.show("No hay datos para imprimir.");
                    return;
                }

                const totalRecords = oBinding.getLength();

                // Verificar si excede límites y avisar al usuario
                if (totalRecords > 2000) {
                    const proceed = confirm(`Se van a procesar ${totalRecords} registros. Esto puede tomar varios minutos. ¿Desea continuar?`);
                    if (!proceed) return;
                }

                PdfHelper._controller = this._controller;
                const filterBarConditions = PdfHelper._controller?.filterBarConditions;

                // Obtener parámetros para metadata del archivo
                const fiscalYear = filterBarConditions?.FiscalYear?.[0]?.values?.[0];
                const companyCode = filterBarConditions?.CompanyCode?.[0]?.values?.[0];
                const dateLow = filterBarConditions?.DocumentDate?.[0]?.values?.[0];
                const dateHigh = filterBarConditions?.DocumentDate?.[0]?.values?.[1];

                await PdfHelper._loadJsPDF();

                // Vincular modelo al owner component
                const oOwnerComponent = this._controller?.getOwnerComponent && this._controller.getOwnerComponent();
                if (oOwnerComponent) {
                    oOwnerComponent.setModel(oAttHeaderModel, "oAttHeaderModel");
                }

                // Configurar metadata del header
                if (oAttHeaderModel) {
                    oAttHeaderModel.setProperty("/fiscalYear", fiscalYear);
                    oAttHeaderModel.setProperty("/companyCode", companyCode);
                    oAttHeaderModel.setProperty("/dateLow", dateLow);
                    oAttHeaderModel.setProperty("/dateHigh", dateHigh);
                }

                // Actualizar progress en busy dialog
                oBusyDialog.setText("Cargando datos...");

                // Usar procesamiento por chunks para evitar crashes
                const datosCrudos = await PdfHelper.cargarMetadataChunked(oBinding, totalRecords);

                oBusyDialog.setText("Transformando datos...");
                const datosTransformados = transformarDatos(datosCrudos);

                oBusyDialog.setText("Generando PDF...");
                const datosClonados = JSON.parse(JSON.stringify(datosTransformados));

                const docDefinition = PdfHelper._buildLibroDiarioPDF(datosClonados);

                // Procesamiento optimizado para documentos grandes
                const doc = await PdfHelper.convertToJsPDFOptimized(docDefinition, totalRecords);

                oBusyDialog.setText("Finalizando...");
                const pdfBlob = doc.output('blob');
                const url = URL.createObjectURL(pdfBlob);
                // window.open(url, "_blank");

                // Guardar metadata
                oAttHeaderModel?.setProperty("/mimetype", pdfBlob.type || "application/pdf");
                oAttHeaderModel?.setProperty("/url", url);
                oAttHeaderModel.setProperty("/blob", pdfBlob);

                const nombreArchivo = `Libro_Diario_${fiscalYear}_${companyCode}`;
                oAttHeaderModel?.setProperty("/filename", nombreArchivo + ".pdf");
                doc.save(nombreArchivo);
                MessageToast.show(`PDF generado exitosamente con ${totalRecords} registros.`);

            } catch (error) {
                console.error("Error generando PDF:", error);
                MessageToast.show(`Error: ${error.message || 'No se pudo generar el PDF.'}`);
            } finally {
                oBusyDialog.close();
            }
        },

        _loadJsPDF: function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                // Check if both libraries are already loaded
                if (that._jsPDFLoaded && that._autoTableLoaded) {
                    resolve();
                    return;
                }
                // Load jsPDF first
                that._loadScript('jspdf', [
                    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                    'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js'
                ]).then(function () {
                    that._jsPDFLoaded = true;
                    // Then load jspdf-autotable
                    return that._loadScript('autoTable', [
                        'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
                        'https://unpkg.com/jspdf-autotable@latest/dist/jspdf.plugin.autotable.js'
                    ]);
                }).then(function () {
                    that._autoTableLoaded = true;
                    resolve();
                }).catch(function (error) {
                    reject(error);
                });
            });
        },

        _loadScript: function (id, urls) {
            return new Promise(function (resolve, reject) {
                if (document.getElementById(id)) {
                    resolve();
                    return;
                }

                function tryLoad(urlIndex) {
                    if (urlIndex >= urls.length) {
                        reject(new Error(`Failed to load script ${id} from all URLs`));
                        return;
                    }

                    var script = document.createElement("script");
                    script.id = id;
                    script.src = urls[urlIndex];
                    script.onload = resolve;
                    script.onerror = function () {
                        document.head.removeChild(script);
                        tryLoad(urlIndex + 1);
                    };
                    document.head.appendChild(script);
                }

                tryLoad(0);
            });
        },
        _buildLibroDiarioPDF: function (datosLibroDiario) {
            const columnas = ["Nro Asiento", "Fecha", "Cuenta", "Descripción de Cuenta", "Debe", "Haber"];
            const cabecera = buildCabeceraHoja("Libro Diario", columnas);
            const contenido = generarLibroDiario(datosLibroDiario);

            // ⭐ Limpiar content array antes de usarlo
            const contenidoLimpio = limpiarContentArray(contenido);

            return {
                pageSize: "A4",
                pageMargins: [40, 60, 40, 60],
                footer: function (currentPage, pageCount) {
                    return {
                        stack: [
                            {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                                alignment: 'center',
                                fontSize: 8,
                                margin: [0, 10, 0, 0]
                            }
                        ]
                    };
                },
                content: [
                    ...cabecera,
                    ...contenidoLimpio, // ← Usar contenido limpio
                ]
            };
        }
    };

    return PdfHelper;
});