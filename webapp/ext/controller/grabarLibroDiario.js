sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageToast, MessageBox) {
    'use strict';

    const grabarLibroHelper = {
        _controller: null,
        _lastFY: null,
        _lastCoCd: null,
        _lastDateFrom: null,
        _lastDateTo: null,
        _bulkFileName: null,

        grabarLibroDiario: function (oEvent) {
            grabarLibroHelper._controller = this._controller;

            // Obtener el modelo y el blob
            var oModel = this._controller.getOwnerComponent().getModel("oAttHeaderModel");
            var oData = oModel && oModel.getData ? oModel.getData() : {};
            var oBlob = oData && oData.blob;

            if (!oBlob || !oBlob.size) {
                MessageBox.confirm(
                    "Necesita visualizar el PDF primero",
                    {
                        title: "Atención",
                        actions: [MessageBox.Action.OK],
                        emphasizedAction: MessageBox.Action.OK,
                        onClose: function (sAction) {
                            // Solo cerrar el MessageBox
                        }
                    }
                );
                return;
            }

            // (async () => {
            //     const oc = this._controller;
            //     const oModel = oc.getOwnerComponent().getModel();

            //     // 0) service root absoluto
            //     let base = oModel.getServiceUrl() || "";
            //     if (!/^https?:\/\//i.test(base)) base = window.location.origin.replace(/\/$/, "") + base;
            //     base = base.replace(/\/$/, "");

            //     // 1) datos adjunto
            //     const att = oc.getOwnerComponent().getModel("oAttHeaderModel")?.getData?.() || {};
            //     const blob = att.blob;
            //     const mimetype = att.mimetype || "application/pdf";
            //     const filename = att.filename || "Adjunto.pdf";
            //     if (!blob) throw new Error("Falta el blob del adjunto");

            //     // 2) claves
            //     const K = { Fiscalyear: "2025", Companycode: "1001", DateFrom: "2024-04-01", DateTo: "2024-04-02" };

            //     // Usa UNA de estas dos formas de fecha:
            //     // A) V4 puro (sin comillas)
            //     let key = `LibroDiarioAttHeader(Fiscalyear='${K.Fiscalyear}',Companycode='${K.Companycode}',DateFrom=${K.DateFrom},DateTo=${K.DateTo})`;
            //     // B) Si el parser sigue quejándose, cambia a:
            //     // key = `LibroDiarioAttHeader(Fiscalyear='${K.Fiscalyear}',Companycode='${K.Companycode}',DateFrom=date'${K.DateFrom}',DateTo=date'${K.DateTo}')`;

            //     // 3) CSRF
            //     async function fetchCsrf() {
            //         const r = await fetch(base + "/$metadata?sap-client=100", {
            //             headers: { "x-csrf-token": "Fetch", "Accept": "application/xml" },
            //             credentials: "include"
            //         });
            //         if (!r.ok) throw new Error("No se pudo obtener CSRF: " + r.status + " " + (await r.text()));
            //         return r.headers.get("x-csrf-token") || "";
            //     }
            //     const csrf = await fetchCsrf();

            //     // 4) ETag real (opcional). Si no hay, usamos "*"
            //     let etag = "*";
            //     try {
            //         const rE = await fetch(`${base}/${key}?$select=LocalLastChangedAt&sap-client=100`, {
            //             headers: { "Accept": "application/json" },
            //             credentials: "include"
            //         });
            //         if (rE.ok) etag = rE.headers.get("ETag") || rE.headers.get("etag") || "*";
            //     } catch { }

            //     // 5) boundaries
            //     const batchBoundary = "batch_" + Date.now();
            //     const changeBoundary = "changeset_" + Math.random().toString(36).slice(2);
            //     const CRLF = "\r\n";
            //     const enc = (s) => new TextEncoder().encode(s);

            //     // 6) request-lines internas — OJO: sin “/” inicial y sin ?sap-client
            //     const entityRel = `${key}`;                            // p.ej. LibroDiarioAttHeader(...)
            //     const streamRel1 = `${key}/Attachment/$value`;         // primer intento con $value
            //     const streamRel2 = `${key}/Attachment`;                // fallback sin $value

            //     // 7) Construcción del batch (primero intentamos con $value)
            //     function buildBatch(streamRel) {
            //         const batchStart =
            //             `--${batchBoundary}` + CRLF +
            //             `Content-Type: multipart/mixed; boundary=${changeBoundary}` + CRLF + CRLF;

            //         const patchStart =
            //             `--${changeBoundary}` + CRLF +
            //             `Content-Type: application/http` + CRLF +
            //             `Content-Transfer-Encoding: binary` + CRLF +
            //             `Content-ID: 1` + CRLF + CRLF +
            //             // SIN "/" inicial y SIN ?sap-client
            //             `PATCH ${entityRel} HTTP/1.1` + CRLF +
            //             `Content-Type: application/json` + CRLF +
            //             `Accept: application/json` + CRLF +
            //             `If-Match: ${etag}` + CRLF + CRLF;

            //         const patchBody = JSON.stringify({ Mimetype: mimetype, Filename: filename }) + CRLF + CRLF;

            //         const putStart =
            //             `--${changeBoundary}` + CRLF +
            //             `Content-Type: application/http` + CRLF +
            //             `Content-Transfer-Encoding: binary` + CRLF +
            //             `Content-ID: 2` + CRLF + CRLF +
            //             // SIN "/" inicial y SIN ?sap-client
            //             `PUT ${streamRel} HTTP/1.1` + CRLF +
            //             `Content-Type: ${mimetype}` + CRLF +
            //             `If-Match: ${etag}` + CRLF + CRLF;

            //         const putEnd = CRLF + CRLF;
            //         const changeEnd = `--${changeBoundary}--` + CRLF;
            //         const batchEnd = `--${batchBoundary}--` + CRLF;

            //         return new Blob([
            //             enc(batchStart),
            //             enc(patchStart), enc(patchBody),
            //             enc(putStart), blob, enc(putEnd),
            //             enc(changeEnd),
            //             enc(batchEnd)
            //         ], { type: `multipart/mixed; boundary=${batchBoundary}` });
            //     }

            //     async function postBatch(body) {
            //         const resp = await fetch(`${base}/$batch`, {
            //             method: "POST",
            //             headers: {
            //                 "x-csrf-token": csrf,
            //                 "Content-Type": `multipart/mixed; boundary=${batchBoundary}`,
            //                 "Accept": "multipart/mixed",            // <= clave para evitar el 406
            //                 "OData-Version": "4.0",                 // recomendado
            //                 "OData-MaxVersion": "4.0"               // recomendado
            //             },
            //             body,
            //             credentials: "include"
            //         });
            //         return resp;
            //     }

            //     // 8) Intento 1: stream con $value
            //     let resp = await postBatch(buildBatch(streamRel1));
            //     if (!resp.ok) {
            //         const t = await resp.text().catch(() => "");
            //         console.warn("Batch con $value falló:", resp.status, t);

            //         // Si es un error de parser/URI, probá sin $value
            //         resp = await postBatch(buildBatch(streamRel2));
            //         if (!resp.ok) {
            //             const t2 = await resp.text().catch(() => "");
            //             throw new Error("Batch failed (sin $value también): " + resp.status + " " + t2);
            //         }
            //     }

            //     sap.m.MessageToast.show("Adjunto subido vía $batch correctamente.");
            // })().catch((e) => {
            //     sap.m.MessageBox.error("Error en $batch: " + (e && e.message ? e.message : e));
            // });


            MessageBox.confirm(
                "¿Está seguro que desea ejecutar la grabación real?",
                {
                    title: "Confirmación",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: async function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            // Ejecuta la función del controlador
                            await grabarLibroHelper.grabarLibroDiarioAdjunto()
                            console.log("ya termino")
                            grabarLibroHelper.onCrearGrabarNumeradorMasivos();
                        }
                    }
                }
            );
        },

        grabarLibroDiarioAdjunto: async function () {
            try {
                // 1) Obtener datos del modelo oAttHeaderModel
                var oAttHeaderModel = this._controller.getOwnerComponent().getModel("oAttHeaderModel");
                var oAttData = oAttHeaderModel && oAttHeaderModel.getData ? oAttHeaderModel.getData() : {};

                this._bulkFileName = oAttData.filename;

                // 2) Obtener el modelo OData V4 (default)
                var oModel = this._controller.getOwnerComponent().getModel();

                // 2 - 1) Empezar “limpio” por click:
                oModel.resetChanges("submitBatch")
                // 3) Crear la entidad en LibroDiarioAttHeader
                const list = oModel.bindList("/LibroDiarioAttHeader", null, null, null, { $$updateGroupId: "submitBatch" });

                const ctx = list.create({
                    Fiscalyear: oAttData.fiscalYear,
                    Companycode: oAttData.companyCode,
                    DateFrom: oAttData.dateLow,
                    DateTo: oAttData.dateHigh,
                    Comments: oAttData.comments,
                    zmoneda: oAttData.zmoneda,
                    total_periodo: oAttData.total_periodo.toFixed(2),
                    Mimetype: oAttData.mimetype,
                    Filename: oAttData.filename
                });

                // 1) Enviar el POST del create en el $batch del grupo
                await oModel.submitBatch("submitBatch");

                await ctx.created(); // evita “The binding must be deferred”

            } catch (e) {
                MessageBox.error("Error al grabar el adjunto: " + (e && e.message ? e.message : e));
                return;
            }
        },

        onCrearGrabarNumeradorMasivos: async function () {
            const oButton = sap.ui.getCore().byId(
                "info.agrobay.librodiarioreporte::LibroDiarioNumeradoList--fe::table::LibroDiarioNumerado::LineItem::CustomAction::grabarLibroDiario"
            );
            if (!oButton) throw new Error("No se encontró el botón CustomAction.");

            const oComponent = sap.ui.core.Component.getOwnerComponentFor(oButton);
            const oModel = oComponent.getModel();
            const sGroup = "submitBatch"; // tu grupo diferido de escrituras
            const oBusy = this._busyDialog || new sap.m.BusyDialog({
                title: "Procesando...",
                text: "Grabando numeradores, por favor espere."
            });
            this._busyDialog = oBusy;

            try {
                // A) Validar que haya datos en la tabla
                const oTable = sap.ui.getCore().byId("info.agrobay.librodiarioreporte::LibroDiarioNumeradoList--fe::table::LibroDiarioNumerado::LineItem-innerTable");
                const oBinding = oTable?.getBinding("rows");

                if (!oBinding || oBinding.getLength() === 0) {
                    sap.m.MessageToast.show("No hay datos para grabar.");
                    return;
                }

                oBusy.open();

                // B) Traer lo cargado +1000 (opcional, o solo lo cargado)
                const aRows = await grabarLibroHelper._pullPlus1000(oBinding);
                if (!aRows.length) {
                    sap.m.MessageToast.show("No hay filas para grabar.");
                    return;
                }

                // C) Pre-chequeo: leer claves ya existentes con los mismos filtros
                const aFiltersExisting = this._buildFiltersForExisting();
                const existingKeySet = await this._readExistingKeys(oModel, aFiltersExisting);

                // D) Mapear payloads y dividir en nuevos vs ya-existentes (skip)
                const aPayloads = aRows.map(this._mapToGrabarPayload.bind(this));
                const aToCreate = [];
                const aSkippedExists = [];

                for (const p of aPayloads) {
                    const keyStr = this._keyString(p);
                    if (existingKeySet.has(keyStr)) {
                        aSkippedExists.push(p);
                    } else {
                        aToCreate.push(p);
                    }
                }

                if (!aToCreate.length) {
                    sap.m.MessageToast.show(`Nada para grabar. ${aSkippedExists.length} ya existían.`);
                    return;
                }

                // 2 - 1) Empezar “limpio” por click:
                oModel.resetChanges("submitBatch")

                // E) Bind a la colección destino
                const oList = oModel.bindList("/GrabarNumeradorAsiento", undefined, undefined, undefined, { $$groupId: sGroup });

                // F) Crear contextos
                const aCtx = aToCreate.map(p => oList.create(p));

                // G) Enviar batch
                await oModel.submitBatch(sGroup);

                // H) Confirmar cada create y capturar errores (409, etc.)
                const ok = [];
                const failed = [];
                await Promise.all(aCtx.map(async (ctx, idx) => {
                    try {
                        await ctx.created();
                        ok.push(aToCreate[idx]);
                    } catch (e) {
                        // Duplicado / conflicto → lo contamos como no grabado
                        failed.push({ payload: aToCreate[idx], error: e });
                    }
                }));

                // I) Resumen
                const total = aRows.length;
                const created = ok.length;
                const skipped = aSkippedExists.length;
                const errors = failed.length;

                const msg =
                    `Procesadas ${total} filas.\n` +
                    `Creadas: ${created}\n` +
                    `Omitidas (ya existían): ${skipped}\n` +
                    `Fallidas: ${errors}`;

                // Si querés listar algunas fallidas:
                if (errors) {
                    console.warn("Fallidas (primeras 10):", failed.slice(0, 10));
                    // Podrías enrutar al MessageManager también
                }

                sap.m.MessageBox.information(msg);

            } catch (e) {
                console.error("Error en grabación masiva:", e);
                sap.m.MessageBox.error(e?.message || "Error en grabación masiva.");
            } finally {
                oBusy.close();
            }
        },

        // Pide lo ya cargado + 1000 más (si existen)
        _pullPlus1000: async function (oBinding) {
            let aItems = oBinding.getCurrentContexts().map(c => c.getObject());

            const TARGET = aItems.length + 1000;
            const PAGE = 200;
            let iStart = aItems.length;

            while (aItems.length < TARGET) {
                const need = Math.min(PAGE, TARGET - aItems.length);
                const aMore = await oBinding.requestContexts(iStart, need);

                if (!aMore.length) break;               // no hay más en backend
                aItems.push(...aMore.map(c => c.getObject()));
                iStart += aMore.length;

                if (aMore.length < need) break;         // última página incompleta
            }
            return aItems;
        },

        // Devuelve un Filter compuesto (AND) o undefined si no hay filtros
        _buildFiltersForExisting: function () {
            // Filtros desde la cabecera
            const filterBarConditions = grabarLibroHelper._controller?.filterBarConditions;

            const fiscalYear = filterBarConditions?.FiscalYear?.[0]?.values?.[0];
            const companyCode = filterBarConditions?.CompanyCode?.[0]?.values?.[0];
            const dateLow = filterBarConditions?.DocumentDate?.[0]?.values?.[0]; // YYYY-MM-DD o Date
            const dateHigh = filterBarConditions?.DocumentDate?.[0]?.values?.[1];

            this._lastFY = fiscalYear;
            this._lastCoCd = companyCode;
            this._lastDateFrom = dateLow;
            this._lastDateTo = dateHigh;

            // Sub-filtros según nombres de la entidad GrabarNumeradorAsiento
            const subs = [];
            if (fiscalYear) subs.push(new sap.ui.model.Filter("Fiscalyear", sap.ui.model.FilterOperator.EQ, fiscalYear));
            if (companyCode) subs.push(new sap.ui.model.Filter("Companycode", sap.ui.model.FilterOperator.EQ, companyCode));
            if (dateLow) subs.push(new sap.ui.model.Filter("Documentdate", sap.ui.model.FilterOperator.GE, dateLow));
            if (dateHigh) subs.push(new sap.ui.model.Filter("Documentdate", sap.ui.model.FilterOperator.LE, dateHigh));

            if (!subs.length) return [];                // mismo contrato: devolver array

            // Forzamos AND y lo devolvemos envuelto en array para no cambiar el uso
            return [new sap.ui.model.Filter(subs, true)];
        },



        //Chequear keys
        _readExistingKeys: async function (oModel, aFilters) {
            // Solo select de las keys para minimizar payload
            const oList = oModel.bindList("/GrabarNumeradorAsiento", undefined, undefined, aFilters, {
                $select: "Fiscalyear,Companycode,Accountingdocumenttype,Documentdate,Accountingdocument,Glaccount"
            });

            const PAGE = 400;
            let i = 0;
            const keySet = new Set();

            while (true) {
                const aCtx = await oList.requestContexts(i, PAGE);
                if (!aCtx.length) break;
                for (const c of aCtx) {
                    const o = c.getObject();
                    keySet.add(this._keyString(o)); // misma serialización que usarás para payloads
                }
                i += aCtx.length;
                if (aCtx.length < PAGE) break;
            }
            return keySet;
        },

        // Serializador consistente de la “composite key”
        // OJO: Edm.Date sin comillas, formato YYYY-MM-DD
        _keyString: function (o) {
            return [
                `Fiscalyear='${o.Fiscalyear || o.FiscalYear}'`,
                `Companycode='${o.Companycode || o.CompanyCode}'`,
                `Accountingdocumenttype='${o.Accountingdocumenttype || o.AccountingDocumentType}'`,
                `Documentdate=${(o.Documentdate || o.DocumentDate)}`,
                `Accountingdocument='${o.Accountingdocument || o.AccountingDocument}'`,
                `Glaccount='${o.Glaccount || o.GLAccount}'`
            ].join(",");
        },

        // 2) Mapear de LibroDiarioNumerado → GrabarNumeradorAsiento
        _mapToGrabarPayload: function (oRow) {
            // oRow viene con estas claves de la tabla:
            // FiscalYear, CompanyCode, AccountingDocumentType, DocumentDate,
            // AccountingDocument, GLAccount, GLAccountName, Numerador, etc.
            return {
                Fiscalyear: oRow.FiscalYear,
                Companycode: oRow.CompanyCode,
                Accountingdocumenttype: oRow.AccountingDocumentType,
                Documentdate: oRow.DocumentDate,        // "YYYY-MM-DD"
                Accountingdocument: oRow.AccountingDocument,
                Glaccount: oRow.GLAccount,
                Glaccountname: oRow.GLAccountName || "", // requerido en el servicio
                FileName: this._bulkFileName || "bulk-numerador.json", // requerido
                Numerador: oRow.Numerador            // tu numeración calculada
            };
        },

    };

    return grabarLibroHelper;
});
