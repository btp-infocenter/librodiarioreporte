sap.ui.define([
"sap/m/MessageBox"
], function (MessageBox) {
    'use strict';

    const grabarLibroHelper = {
        _controller: null,
        _lastFY: null,
        _lastCoCd: null,
        _lastDateFrom: null,
        _lastDateTo: null,
        _bulkFileName: null,

        grabarLibroDiario: function (_oEvent) {
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
                        onClose: function (_sAction) {
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
                        if (sAction !== MessageBox.Action.OK) {
                            return;
                        }
                        try {
                            // Si la cabecera del adjunto no queda grabada no tiene
                            // sentido numerar: los asientos apuntarían a un PDF inexistente.
                            const bAdjuntoOk = await grabarLibroHelper.grabarLibroDiarioAdjunto();
                            if (!bAdjuntoOk) {
                                return;
                            }
                            await grabarLibroHelper.onCrearGrabarNumeradorMasivos();
                        } catch (e) {
                            MessageBox.error(grabarLibroHelper._errorText(e));
                        }
                    }
                }
            );
        },

        // Grupo de batch propio para el adjunto. Si lo comparte con la grabación
        // masiva, un POST fallido acá queda pendiente y el modelo lo reintenta
        // dentro del batch del otro flujo, bloqueándolo.
        _ATT_GROUP: "attHeader",

        // Devuelve true si la cabecera quedó grabada (creada o actualizada).
        grabarLibroDiarioAdjunto: async function () {
            const oAttHeaderModel = this._controller.getOwnerComponent().getModel("oAttHeaderModel");
            const oAttData = (oAttHeaderModel && oAttHeaderModel.getData) ? oAttHeaderModel.getData() : {};
            const oModel = this._controller.getOwnerComponent().getModel();
            const sGroup = this._ATT_GROUP;

            this._bulkFileName = oAttData.filename;

            const oPayload = {
                Fiscalyear: oAttData.fiscalYear,
                Companycode: oAttData.companyCode,
                DateFrom: oAttData.dateLow,
                DateTo: oAttData.dateHigh,
                Comments: oAttData.comments,
                Mimetype: oAttData.mimetype,
                Filename: oAttData.filename
            };

            try {
                // Empezar limpio, sin reventar si quedó un batch en vuelo.
                this._safeResetChanges(oModel, sGroup);

                // Pre-chequeo por clave (Fiscalyear, Companycode, DateFrom, DateTo).
                // Sin esto, re-grabar el mismo período devuelve 400 "The key value
                // is already in use" y el create fallido se reintenta solo.
                const oExisting = await this._readAttHeader(oModel, oPayload, sGroup);

                if (oExisting) {
                    await this._actualizarAttHeader(oModel, oExisting, oPayload, sGroup);
                    return true;
                }

                const oList = oModel.bindList("/LibroDiarioAttHeader", null, null, null, {
                    $$updateGroupId: sGroup
                });
                const oCtx = oList.create(oPayload);

                // created() se engancha antes del submit para no dejar un rechazo
                // sin manejar si el POST falla.
                const pCreated = oCtx.created();
                pCreated.catch(function () { /* se maneja en el catch de abajo */ });

                await oModel.submitBatch(sGroup);
                await pCreated;
                return true;

            } catch (e) {
                // Un create fallido queda transitorio y el modelo lo repite en cada
                // submitBatch del grupo. Hay que descartarlo o contamina todo lo que siga.
                this._safeResetChanges(oModel, sGroup);
                MessageBox.error("Error al grabar el adjunto: " + this._errorText(e));
                return false;
            }
        },

        // Lee la cabecera por su clave completa. Devuelve el Context o null.
        _readAttHeader: async function (oModel, oKey, sGroup) {
            const Filter = sap.ui.model.Filter;
            const EQ = sap.ui.model.FilterOperator.EQ;

            const aFilters = [new Filter([
                new Filter("Fiscalyear", EQ, oKey.Fiscalyear),
                new Filter("Companycode", EQ, oKey.Companycode),
                new Filter("DateFrom", EQ, oKey.DateFrom),
                new Filter("DateTo", EQ, oKey.DateTo)
            ], true)];

            const oList = oModel.bindList("/LibroDiarioAttHeader", null, null, aFilters, {
                $$updateGroupId: sGroup,
                $select: "Fiscalyear,Companycode,DateFrom,DateTo"
            });

            const aCtx = await oList.requestContexts(0, 1);
            return aCtx.length ? aCtx[0] : null;
        },

        // La cabecera del período ya existía: PATCH de los campos no clave.
        _actualizarAttHeader: async function (oModel, oCtx, oPayload, sGroup) {
            const aKeyProps = ["Fiscalyear", "Companycode", "DateFrom", "DateTo"];

            const aPromises = Object.keys(oPayload)
                .filter(k => aKeyProps.indexOf(k) === -1 && oPayload[k] !== undefined)
                .map(k => oCtx.setProperty(k, oPayload[k], sGroup));

            if (!aPromises.length) {
                return;
            }
            await oModel.submitBatch(sGroup);
            await Promise.all(aPromises);
        },

        // resetChanges lanza excepción si el batch del grupo está en vuelo.
        _safeResetChanges: function (oModel, sGroup) {
            try {
                if (oModel.hasPendingChanges(sGroup)) {
                    oModel.resetChanges(sGroup);
                }
            } catch (e) {
                console.warn("No se pudieron descartar los cambios pendientes del grupo '" + sGroup + "':", e);
            }
        },

        _errorText: function (e) {
            if (!e) { return "Error desconocido."; }
            return e.message ? e.message : String(e);
        },

        onCrearGrabarNumeradorMasivos: async function () {
            const oButton = sap.ui.getCore().byId(
                "info.infocenter.librodiarioreporte::LibroDiarioNumeradoList--fe::table::LibroDiarioNumerado::LineItem::CustomAction::grabarLibroDiario"
            );
            if (!oButton) throw new Error("No se encontró el botón CustomAction.");

            const oComponent = sap.ui.core.Component.getOwnerComponentFor(oButton);
            const oModel = oComponent.getModel();
            const sGroup = "submitBatch";        // grupo diferido para los POST
            const sReactGroup = "reactivarNum";  // grupo diferido para los PATCH de reactivacion
            const oBusy = this._busyDialog || new sap.m.BusyDialog({
                title: "Procesando...",
                text: "Grabando numeradores, por favor espere."
            });
            this._busyDialog = oBusy;

            try {
                // A) Validar que haya datos en la tabla
                const oTable = sap.ui.getCore().byId("info.infocenter.librodiarioreporte::LibroDiarioNumeradoList--fe::table::LibroDiarioNumerado::LineItem-innerTable");
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
                //    (separando vigentes de anuladas: las anuladas se reactivan)
                const aFiltersExisting = this._buildFiltersForExisting();
                const oExisting = await this._readExistingKeys(oModel, aFiltersExisting);

                // D) Mapear payloads y dividir en nuevos / ya-existentes (skip) /
                //    anulados (reactivar vía PATCH de Numerador)
                const aPayloads = aRows.map(this._mapToGrabarPayload.bind(this));
                const aToCreate = [];
                const aSkippedExists = [];
                const aToReactivate = [];
                // La tabla puede traer varios items con la misma clave (mismo
                // documento + misma cuenta). Dos POST con clave identica dentro
                // del mismo changeset revientan el $batch en el backend (500),
                // asi que hay que quedarse con uno solo.
                const seenCreate = new Set();
                let iDupCreate = 0;

                for (const p of aPayloads) {
                    const keyStr = this._keyString(p);
                    if (oExisting.anuladas.has(keyStr)) {
                        aToReactivate.push({ payload: p, ctxs: oExisting.anuladas.get(keyStr), keyStr: keyStr });
                    } else if (oExisting.vigentes.has(keyStr)) {
                        aSkippedExists.push(p);
                    } else if (seenCreate.has(keyStr)) {
                        iDupCreate++;
                    } else {
                        seenCreate.add(keyStr);
                        aToCreate.push(p);
                    }
                }

                if (!aToCreate.length && !aToReactivate.length) {
                    sap.m.MessageToast.show(`Nada para grabar. ${aSkippedExists.length} ya existían.`);
                    return;
                }

                // 2 - 1) Empezar “limpio” por click: si quedó algo pendiente de un
                // intento anterior, el modelo lo reenvía solo y vuelve a fallar.
                this._safeResetChanges(oModel, sGroup);
                this._safeResetChanges(oModel, sReactGroup);

                // E/F/G) Crear en lotes. Un changeset con cientos de POST hace que
                // un solo registro malo tumbe el $batch entero (500) y deja todos
                // los POST pendientes, que el modelo reintenta indefinidamente.
                const ok = [];
                const failed = [];
                const CHUNK = 100;

                for (let i = 0; i < aToCreate.length; i += CHUNK) {
                    const aChunk = aToCreate.slice(i, i + CHUNK);

                    // $$updateGroupId (no $$groupId): $$groupId solo afecta lecturas,
                    // con lo cual los create se iban a "$auto" y se enviaban antes
                    // del submitBatch, fuera de todo control.
                    const oList = oModel.bindList("/GrabarNumeradorAsiento", undefined, undefined, undefined, {
                        $$updateGroupId: sGroup
                    });

                    const aCtx = aChunk.map(p => oList.create(p));
                    // Enganchar created() antes del submit para no dejar rechazos sin manejar.
                    const aCreated = aCtx.map(ctx => {
                        const pCreated = ctx.created();
                        pCreated.catch(function () { /* se evalúa con allSettled */ });
                        return pCreated;
                    });

                    let oBatchError = null;
                    try {
                        await oModel.submitBatch(sGroup);
                    } catch (e) {
                        oBatchError = e;
                        console.error("Falló el $batch del lote " + (i / CHUNK + 1) + ":", e);
                    }

                    // Lo que sigue pendiente es lo que falló. Hay que descartarlo
                    // antes de esperar las promesas: un POST fallido queda "para
                    // reintentar" y created() nunca se resuelve hasta el reset.
                    this._safeResetChanges(oModel, sGroup);

                    const aSettled = await Promise.allSettled(aCreated);
                    aSettled.forEach((s, idx) => {
                        if (s.status === "fulfilled") {
                            ok.push(aChunk[idx]);
                        } else {
                            failed.push({ payload: aChunk[idx], error: s.reason || oBatchError });
                        }
                    });
                }

                // F-2) Reactivar filas anuladas: el PATCH de Numerador dispara la
                // determinación ReactivarAlNumerar en el backend (anulado = '')
                const seenReactivate = new Set();
                const aReactPromises = [];
                for (const r of aToReactivate) {
                    if (seenReactivate.has(r.keyStr)) continue;
                    seenReactivate.add(r.keyStr);
                    for (const ctx of r.ctxs) {
                        aReactPromises.push(ctx.setProperty("Numerador", r.payload.Numerador, sReactGroup));
                        aReactPromises.push(ctx.setProperty("Glaccountname", r.payload.Glaccountname || "", sReactGroup));
                    }
                }

                // G-2) Enviar y confirmar reactivaciones en su propio grupo, para que
                // un error acá no arrastre a los create ni al revés.
                const reactivated = seenReactivate.size;
                let reactivateErrors = 0;
                if (aReactPromises.length) {
                    try {
                        await oModel.submitBatch(sReactGroup);
                    } catch (e) {
                        console.error("Falló el $batch de reactivaciones:", e);
                    }
                    this._safeResetChanges(oModel, sReactGroup);

                    const aSettled = await Promise.allSettled(aReactPromises);
                    reactivateErrors = aSettled.filter(s => s.status === "rejected").length;
                    if (reactivateErrors) {
                        console.warn("Reactivaciones fallidas:", aSettled.filter(s => s.status === "rejected").slice(0, 10));
                    }
                }

                    // I) Resumen
                    const total = aRows.length;
                    const created = ok.length;
                    const skipped = aSkippedExists.length;
                    const errors = failed.length;

                    // Desglose por mes de los asientos generados (documentos
                    // distintos: una fila es documento+item+cuenta, un asiento
                    // puede tener varias filas)
                    const oAsientosPorMes = new Map();
                    for (const p of ok) {
                        const sMes = this._monthKey(p.Documentdate);
                        if (!oAsientosPorMes.has(sMes)) {
                            oAsientosPorMes.set(sMes, new Set());
                        }
                        oAsientosPorMes.get(sMes).add(p.Accountingdocument);
                    }
                    const aMeses = Array.from(oAsientosPorMes.keys()).sort();
                    let sDesglose = "";
                    if (aMeses.length) {
                        sDesglose = "\nAsientos generados por mes:\n" +
                            aMeses.map(sMes => `  ${this._formatMes(sMes)}: ${oAsientosPorMes.get(sMes).size}`).join("\n");
                    }

                    const msg =
                        `Procesadas ${total} filas.\n` +
                        `Creadas: ${created}\n` +
                        `Reactivadas (estaban anuladas): ${reactivated}` +
                        (reactivateErrors ? ` (${reactivateErrors} errores)` : ``) + `\n` +
                        `Omitidas (ya existían): ${skipped}\n` +
                        (iDupCreate ? `Omitidas (clave repetida en la tabla): ${iDupCreate}\n` : ``) +
                        `Fallidas: ${errors}` +
                        sDesglose;

                // Si querés listar algunas fallidas:
                if (errors) {
                    console.warn("Fallidas (primeras 10):", failed.slice(0, 10));
                    // Podrías enrutar al MessageManager también
                }

                if (errors) {
                    sap.m.MessageBox.warning(msg + "\n\n" + this._errorText(failed[0].error));
                } else {
                    sap.m.MessageBox.information(msg);
                }

            } catch (e) {
                console.error("Error en grabación masiva:", e);
                sap.m.MessageBox.error(e?.message || "Error en grabación masiva.");
            } finally {
                // Nada debe quedar pendiente: el modelo reenvía los cambios fallidos
                // en cualquier $batch posterior y vuelve a romper todo.
                this._safeResetChanges(oModel, sGroup);
                this._safeResetChanges(oModel, sReactGroup);
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
            // Solo select de las keys expuestas por GrabarNumeradorAsientoType
            // para minimizar payload y evitar selects de propiedades inexistentes.
            const oList = oModel.bindList("/GrabarNumeradorAsiento", undefined, undefined, aFilters, {
                $select: "Fiscalyear,Companycode,Accountingdocumenttype,Documentdate,Accountingdocument,Glaccount"
            });

            const PAGE = 400;
            let i = 0;
            const vigentes = new Set();
            const anuladas = new Map();

            while (true) {
                const aCtx = await oList.requestContexts(i, PAGE);
                if (!aCtx.length) break;
                for (const c of aCtx) {
                    const o = c.getObject();
                    const keyStr = this._keyString(o); // misma serialización que usarás para payloads
                    vigentes.add(keyStr);
                }
                i += aCtx.length;
                if (aCtx.length < PAGE) break;
            }
            return { vigentes: vigentes, anuladas: anuladas };
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

        // "2026-01-15" (o Date) → "2026-01"
        _monthKey: function (d) {
            if (d instanceof Date && !Number.isNaN(d.getTime())) {
                return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
            }
            const s = String(d || "");
            return s.length >= 7 ? s.substring(0, 7) : "sin fecha";
        },

        // "2026-01" → "01/2026"
        _formatMes: function (sMes) {
            const a = sMes.split("-");
            return a.length === 2 ? `${a[1]}/${a[0]}` : sMes;
        },

    };

    return grabarLibroHelper;
});
