sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (Component) {
        "use strict";

        function findActionsToolbar() {
            var actionTexts = ["Imprimir PDF", "Grabar Libro Diario"];
            var candidates = Array.prototype.slice.call(document.querySelectorAll("[role='toolbar'], .sapMTB, .sapMBar, .sapMIBar"));

            return candidates.find(function (element) {
                var text = element.textContent || "";

                return actionTexts.every(function (actionText) {
                    return text.includes(actionText);
                });
            });
        }

        function findTableContainer() {
            return document.querySelector("[id*='fe::table::LibroDiarioNumerado']") ||
                document.querySelector(".sapUiTable") ||
                document.querySelector(".sapMListTbl") ||
                document.body;
        }

        function placeRecordCountBadge(badge) {
            var toolbar = findActionsToolbar();

            if (toolbar) {
                badge.style.margin = "0 auto 0 0";
                badge.style.flex = "0 0 auto";

                if (badge.parentNode !== toolbar) {
                    toolbar.insertBefore(badge, toolbar.firstChild);
                }
                return;
            }

            var container = findTableContainer();
            badge.style.margin = "0 0 0.75rem 0";

            if (container && badge.parentNode !== container.parentNode) {
                container.parentNode.insertBefore(badge, container);
            }
        }

        function ensureRecordCountBadge() {
            var badge = document.getElementById("libroDiarioRecordCountBadge");

            if (!badge) {
                badge = document.createElement("div");
                badge.id = "libroDiarioRecordCountBadge";
                badge.setAttribute("role", "status");
                badge.style.display = "none";
                badge.style.alignItems = "center";
                badge.style.width = "fit-content";
                badge.style.maxWidth = "18rem";
                badge.style.height = "auto";
                badge.style.minHeight = "auto";
                badge.style.padding = "0.375rem 0.75rem";
                badge.style.borderRadius = "999px";
                badge.style.fontSize = "0.875rem";
                badge.style.lineHeight = "1.25";
                badge.style.fontWeight = "700";
                badge.style.whiteSpace = "nowrap";
                badge.style.boxShadow = "none";
                badge.style.color = "#fff";
                badge.style.background = "#0a6ed1";
                badge.style.border = "1px solid #4db1ff";
                badge.textContent = "";
                document.body.appendChild(badge);
            }

            placeRecordCountBadge(badge);
            return badge;
        }

        function updateRecordCountBadge(count) {
            if (typeof count !== "number") {
                return;
            }

            var badge = ensureRecordCountBadge();
            badge.textContent = "Registros recuperados: " + count.toLocaleString();
            badge.style.display = "inline-flex";
        }

        function extractLibroDiarioCount(responseText) {
            if (!responseText || !responseText.includes("LibroDiarioNumerado")) {
                return undefined;
            }

            // El backend puede serializar el count como numero o como string (Edm.Int64).
            var countMatch = responseText.match(/"@odata\.count"\s*:\s*"?(\d+)"?/);

            if (countMatch) {
                return Number(countMatch[1]);
            }

            try {
                var payload = JSON.parse(responseText);

                if (typeof payload["@odata.count"] === "number" || /^\d+$/.test(payload["@odata.count"])) {
                    return Number(payload["@odata.count"]);
                }

                if (Array.isArray(payload.value)) {
                    return payload.value.length;
                }
            } catch {
                // Batch responses are multipart text, not direct JSON.
            }

            return undefined;
        }

        function handleLibroDiarioResponse(responseText) {
            var count = extractLibroDiarioCount(responseText);
            updateRecordCountBadge(count);
        }

        function installRecordCountInterceptor() {
            if (window.__libroDiarioRecordCountInterceptorInstalled) {
                ensureRecordCountBadge();
                return;
            }

            window.__libroDiarioRecordCountInterceptorInstalled = true;

            var originalOpen = window.XMLHttpRequest.prototype.open;
            var originalSend = window.XMLHttpRequest.prototype.send;

            window.XMLHttpRequest.prototype.open = function (_method, url) {
                this.__libroDiarioUrl = url;
                return originalOpen.apply(this, arguments);
            };

            window.XMLHttpRequest.prototype.send = function () {
                this.addEventListener("load", function () {
                    handleLibroDiarioResponse(this.responseText);
                });

                return originalSend.apply(this, arguments);
            };

            if (window.fetch) {
                var originalFetch = window.fetch;

                window.fetch = function () {
                    return originalFetch.apply(this, arguments).then(function (response) {
                        response.clone().text().then(handleLibroDiarioResponse).catch(function () {
                            // Ignore non-text responses.
                        });
                        return response;
                    });
                };
            }
        }

        return Component.extend("info.infocenter.librodiarioreporte.Component", {
            metadata: {
                manifest: "json"
            },

            init: function () {
                installRecordCountInterceptor();
                Component.prototype.init.apply(this, arguments);
            }
        });
    }
);
