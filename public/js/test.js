/*
Wombat.js client-side rewriting engine for web archive replay
Copyright (C) 2014-2020 Webrecorder Software, Rhizome, and Contributors. Released under the GNU Affero General Public License.

This file is part of wombat.js, see https://github.com/webrecorder/wombat.js for the full source
Wombat.js is part of the Webrecorder project (https://github.com/webrecorder)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
(function () {
    function FuncMap() {
        this._map = []
    }
    function ensureNumber(maybeNumber) {
        try {
            switch (typeof maybeNumber) {
                case "number":
                case "bigint":
                    return maybeNumber;
            }
            var converted = Number(maybeNumber);
            return isNaN(converted) ? null : converted
        } catch (e) { }
        return null
    }
    function addToStringTagToClass(clazz, tag) {
        typeof self.Symbol !== "undefined" && typeof self.Symbol.toStringTag !== "undefined" && Object.defineProperty(clazz.prototype, self.Symbol.toStringTag, {
            value: tag,
            enumerable: false
        })
    }
    function autobind(clazz) {
        for (var prop, propValue, proto = clazz.__proto__ || clazz.constructor.prototype || clazz.prototype, clazzProps = Object.getOwnPropertyNames(proto), len = clazzProps.length, i = 0; i < len; i++)
            prop = clazzProps[i],
                propValue = clazz[prop],
                prop !== "constructor" && typeof propValue === "function" && (clazz[prop] = propValue.bind(clazz))
    }
    function Storage(wombat, proxying) {
        if (ThrowExceptions.yes)
            throw new TypeError("Illegal constructor");
        Object.defineProperties(this, {
            data: {
                enumerable: false,
                value: {}
            },
            wombat: {
                enumerable: false,
                value: wombat
            },
            proxying: {
                enumerable: false,
                value: proxying
            },
            _deleteItem: {
                enumerable: false,
                value: function (item) {
                    delete this.data[item]
                }
            }
        })
    }
    function WombatLocation(orig_loc, wombat) {
        for (var prop in Object.defineProperties(this, {
            _orig_loc: {
                configurable: true,
                enumerable: false,
                value: orig_loc
            },
            wombat: {
                configurable: true,
                enumerable: false,
                value: wombat
            },
            orig_getter: {
                enumerable: false,
                value: function (prop) {
                    return this._orig_loc[prop]
                }
            },
            orig_setter: {
                enumerable: false,
                value: function (prop, value) {
                    this._orig_loc[prop] = value
                }
            }
        }),
            wombat.initLocOverride(this, this.orig_setter, this.orig_getter),
            wombat.setLoc(this, orig_loc.href),
            orig_loc)
            this.hasOwnProperty(prop) || typeof orig_loc[prop] === "function" || (this[prop] = orig_loc[prop])
    }
    function AutoFetcher(wombat, config) {
        return this instanceof AutoFetcher ? void (this.elemSelector = "img[srcset], img[data-srcset], img[data-src], video[srcset], video[data-srcset], video[data-src], audio[srcset], audio[data-srcset], audio[data-src], picture > source[srcset], picture > source[data-srcset], picture > source[data-src], video > source[srcset], video > source[data-srcset], video > source[data-src], audio > source[srcset], audio > source[data-srcset], audio > source[data-src]",
            this.wombat = wombat,
            this.$wbwindow = wombat.$wbwindow,
            this.worker = null,
            autobind(this),
            this._initWorker(config)) : new AutoFetcher(wombat, config)
    }
    function wrapSameOriginEventListener(origListener, win) {
        return function wrappedSameOriginEventListener(event) {
            return window == win ? origListener(event) : void 0
        }
    }
    function wrapEventListener(origListener, obj, wombat) {
        var origListenerFunc;
        return origListenerFunc = typeof origListener === "function" ? origListener : typeof origListener === "object" ? origListener.handleEvent.bind(origListener) : function () { }
            ,
            function wrappedEventListener(event) {
                var ne;
                if (event.data && event.data.from && event.data.message) {
                    if (event.data.to_origin !== "*" && obj.WB_wombat_location && !wombat.startsWith(event.data.to_origin, obj.WB_wombat_location.origin))
                        return void console.warn("Skipping message event to " + event.data.to_origin + " doesn't start with origin " + obj.WB_wombat_location.origin);
                    var source = event.source;
                    event.data.from_top ? source = obj.__WB_top_frame : event.data.src_id && obj.__WB_win_id && obj.__WB_win_id[event.data.src_id] && (source = obj.__WB_win_id[event.data.src_id]),
                        ne = new MessageEvent("message", {
                            bubbles: event.bubbles,
                            cancelable: event.cancelable,
                            data: event.data.message,
                            origin: event.data.from,
                            lastEventId: event.lastEventId,
                            source: wombat.proxyToObj(source),
                            ports: event.ports
                        }),
                        ne._target = event.target,
                        ne._srcElement = event.srcElement,
                        ne._currentTarget = event.currentTarget,
                        ne._eventPhase = event.eventPhase,
                        ne._path = event.path
                } else
                    ne = event;
                return origListenerFunc(ne)
            }
    }
    function Wombat($wbwindow, wbinfo) {
        if (!(this instanceof Wombat))
            return new Wombat($wbwindow, wbinfo);
        this.debug_rw = false,
            this.$wbwindow = $wbwindow,
            this.HTTP_PREFIX = "http://",
            this.HTTPS_PREFIX = "https://",
            this.REL_PREFIX = "//",
            this.VALID_PREFIXES = [this.HTTP_PREFIX, this.HTTPS_PREFIX, this.REL_PREFIX],
            this.IGNORE_PREFIXES = ["#", "about:", "data:", "blob:", "mailto:", "javascript:", "{", "*"],
            "ignore_prefixes" in wbinfo && (this.IGNORE_PREFIXES = this.IGNORE_PREFIXES.concat(wbinfo.ignore_prefixes)),
            this.WB_CHECK_THIS_FUNC = "_____WB$wombat$check$this$function_____",
            this.WB_ASSIGN_FUNC = "_____WB$wombat$assign$function_____",
            this.wb_setAttribute = $wbwindow.Element.prototype.setAttribute,
            this.wb_getAttribute = $wbwindow.Element.prototype.getAttribute,
            this.wb_funToString = Function.prototype.toString,
            this.WBAutoFetchWorker = null,
            this.wbUseAFWorker = wbinfo.enable_auto_fetch && $wbwindow.Worker != null && wbinfo.is_live,
            this.wb_rel_prefix = "",
            this.wb_wombat_updating = false,
            this.message_listeners = new FuncMap,
            this.storage_listeners = new FuncMap,
            this.linkAsTypes = {
                script: "js_",
                worker: "js_",
                style: "cs_",
                image: "im_",
                document: "if_",
                fetch: "mp_",
                font: "oe_",
                audio: "oe_",
                video: "oe_",
                embed: "oe_",
                object: "oe_",
                track: "oe_",
                "": "mp_",
                null: "mp_",
                undefined: "mp_"
            },
            this.linkTagMods = {
                linkRelToAs: {
                    import: this.linkAsTypes,
                    preload: this.linkAsTypes
                },
                stylesheet: "cs_",
                null: "mp_",
                undefined: "mp_",
                "": "mp_"
            },
            this.tagToMod = {
                A: {
                    href: "mp_"
                },
                AREA: {
                    href: "mp_"
                },
                AUDIO: {
                    src: "oe_",
                    poster: "im_"
                },
                BASE: {
                    href: "mp_"
                },
                EMBED: {
                    src: "oe_"
                },
                FORM: {
                    action: "mp_"
                },
                FRAME: {
                    src: "fr_"
                },
                IFRAME: {
                    src: "if_"
                },
                IMAGE: {
                    href: "im_",
                    "xlink:href": "im_"
                },
                IMG: {
                    src: "im_",
                    srcset: "im_"
                },
                INPUT: {
                    src: "oe_"
                },
                INS: {
                    cite: "mp_"
                },
                META: {
                    content: "mp_"
                },
                OBJECT: {
                    data: "oe_",
                    codebase: "oe_"
                },
                Q: {
                    cite: "mp_"
                },
                SCRIPT: {
                    src: "js_",
                    "xlink:href": "js_"
                },
                SOURCE: {
                    src: "oe_",
                    srcset: "oe_"
                },
                TRACK: {
                    src: "oe_"
                },
                VIDEO: {
                    src: "oe_",
                    poster: "im_"
                },
                image: {
                    href: "im_",
                    "xlink:href": "im_"
                }
            },
            this.URL_PROPS = ["href", "hash", "pathname", "host", "hostname", "protocol", "origin", "search", "port"],
            this.wb_info = wbinfo,
            this.wb_opts = wbinfo.wombat_opts,
            this.wb_replay_prefix = wbinfo.prefix,
            this.wb_is_proxy = this.wb_info.proxy_magic || !this.wb_replay_prefix,
            this.wb_info.top_host = this.wb_info.top_host || "*",
            this.wb_curr_host = $wbwindow.location.protocol + "//" + $wbwindow.location.host,
            this.wb_info.wombat_opts = this.wb_info.wombat_opts || {},
            this.wb_orig_scheme = this.wb_info.wombat_scheme + "://",
            this.wb_orig_origin = this.wb_orig_scheme + this.wb_info.wombat_host,
            this.wb_abs_prefix = this.wb_replay_prefix,
            this.wb_capture_date_part = "",
            !this.wb_info.is_live && this.wb_info.wombat_ts && (this.wb_capture_date_part = "/" + this.wb_info.wombat_ts + "/"),
            this.BAD_PREFIXES = ["http:" + this.wb_replay_prefix, "https:" + this.wb_replay_prefix, "http:/" + this.wb_replay_prefix, "https:/" + this.wb_replay_prefix],
            this.hostnamePortRe = /^[\w-]+(\.[\w-_]+)+(:\d+)(\/|$)/,
            this.ipPortRe = /^\d+\.\d+\.\d+\.\d+(:\d+)?(\/|$)/,
            this.workerBlobRe = /__WB_pmw\(.*?\)\.(?=postMessage\()/g,
            this.rmCheckThisInjectRe = /_____WB\$wombat\$check\$this\$function_____\(.*?\)/g,
            this.STYLE_REGEX = /(url\s*\(\s*[\\"']*)([^)'"]+)([\\"']*\s*\))/gi,
            this.IMPORT_REGEX = /(@import\s*[\\"']*)([^)'";]+)([\\"']*\s*;?)/gi,
            this.no_wombatRe = /WB_wombat_/g,
            this.srcsetRe = /\s*(\S*\s+[\d.]+[wx]),|(?:\s*,(?:\s+|(?=https?:)))/,
            this.cookie_path_regex = /\bPath='?"?([^;'"\s]+)/i,
            this.cookie_domain_regex = /\bDomain=([^;'"\s]+)/i,
            this.cookie_expires_regex = /\bExpires=([^;'"]+)/gi,
            this.SetCookieRe = /,(?![|])/,
            this.IP_RX = /^(\d)+\.(\d)+\.(\d)+\.(\d)+$/,
            this.FullHTMLRegex = /^\s*<(?:html|head|body|!doctype html)/i,
            this.IsTagRegex = /^\s*</,
            this.DotPostMessageRe = /(.postMessage\s*\()/,
            this.extractPageUnderModiferRE = /\/(?:[0-9]{14})?([a-z]{2, 3}_)\//,
            this.write_buff = "";
        var eTargetProto = ($wbwindow.EventTarget || {}).prototype;
        this.utilFns = {
            cspViolationListener: function (e) {
                if (console.group("CSP Violation"),
                    console.log("Replayed Page URL", window.WB_wombat_location.href),
                    console.log("The documentURI", e.documentURI),
                    console.log("The blocked URL", e.blockedURI),
                    console.log("The directive violated", e.violatedDirective),
                    console.log("Our policy", e.originalPolicy),
                    e.sourceFile) {
                    var fileInfo = "File: " + e.sourceFile;
                    e.lineNumber && e.columnNumber ? fileInfo += " @ " + e.lineNumber + ":" + e.columnNumber : e.lineNumber && (fileInfo += " @ " + e.lineNumber),
                        console.log(fileInfo)
                }
                console.groupEnd()
            },
            addEventListener: eTargetProto.addEventListener,
            removeEventListener: eTargetProto.removeEventListener,
            objToString: Object.prototype.toString,
            wbSheetMediaQChecker: null,
            XHRopen: null,
            XHRsend: null
        },
            this.showCSPViolations = {
                yesNo: false,
                added: false
            },
            autobind(this)
    }
    FuncMap.prototype.set = function (fnKey, fnValue) {
        this._map.push([fnKey, fnValue])
    }
        ,
        FuncMap.prototype.get = function (fnKey) {
            for (var i = 0; i < this._map.length; i++)
                if (this._map[i][0] === fnKey)
                    return this._map[i][1];
            return null
        }
        ,
        FuncMap.prototype.find = function (fnKey) {
            for (var i = 0; i < this._map.length; i++)
                if (this._map[i][0] === fnKey)
                    return i;
            return -1
        }
        ,
        FuncMap.prototype.add_or_get = function (func, initter) {
            var fnValue = this.get(func);
            return fnValue || (fnValue = initter(),
                this.set(func, fnValue)),
                fnValue
        }
        ,
        FuncMap.prototype.remove = function (func) {
            var idx = this.find(func);
            if (idx >= 0) {
                var fnMapping = this._map.splice(idx, 1);
                return fnMapping[0][1]
            }
            return null
        }
        ,
        FuncMap.prototype.map = function (param) {
            for (var i = 0; i < this._map.length; i++)
                this._map[i][1](param)
        }
        ;
    var ThrowExceptions = {
        yes: false
    };
    Storage.prototype.getItem = function getItem(name) {
        return this.data.hasOwnProperty(name) ? this.data[name] : null
    }
        ,
        Storage.prototype.setItem = function setItem(name, value) {
            var sname = String(name)
                , svalue = String(value)
                , old = this.getItem(sname);
            return this.data[sname] = value,
                this.fireEvent(sname, old, svalue),
                undefined
        }
        ,
        Storage.prototype.removeItem = function removeItem(name) {
            var old = this.getItem(name);
            return this._deleteItem(name),
                this.fireEvent(name, old, null),
                undefined
        }
        ,
        Storage.prototype.clear = function clear() {
            return this.data = {},
                this.fireEvent(null, null, null),
                undefined
        }
        ,
        Storage.prototype.key = function key(index) {
            var n = ensureNumber(index);
            if (n == null || n < 0)
                return null;
            var keys = Object.keys(this.data);
            return n < keys.length ? keys[n] : null
        }
        ,
        Storage.prototype.fireEvent = function fireEvent(key, oldValue, newValue) {
            var sevent = new StorageEvent("storage", {
                key: key,
                newValue: newValue,
                oldValue: oldValue,
                url: this.wombat.$wbwindow.WB_wombat_location.href
            });
            Object.defineProperty(sevent, "storageArea", {
                value: this,
                writable: false,
                configurable: false
            }),
                sevent._storageArea = this,
                this.wombat.storage_listeners.map(sevent)
        }
        ,
        Storage.prototype.valueOf = function valueOf() {
            return this.wombat.$wbwindow[this.proxying]
        }
        ,
        Object.defineProperty(Storage.prototype, "length", {
            enumerable: false,
            get: function length() {
                return Object.keys(this.data).length
            }
        }),
        addToStringTagToClass(Storage, "Storage"),
        WombatLocation.prototype.replace = function replace(url) {
            var new_url = this.wombat.rewriteUrl(url)
                , orig = this.wombat.extractOriginalURL(new_url);
            return orig === this.href ? orig : this._orig_loc.replace(new_url)
        }
        ,
        WombatLocation.prototype.assign = function assign(url) {
            var new_url = this.wombat.rewriteUrl(url)
                , orig = this.wombat.extractOriginalURL(new_url);
            return orig === this.href ? orig : this._orig_loc.assign(new_url)
        }
        ,
        WombatLocation.prototype.reload = function reload(forcedReload) {
            return this._orig_loc.reload(forcedReload || false)
        }
        ,
        WombatLocation.prototype.toString = function toString() {
            return this.href
        }
        ,
        WombatLocation.prototype.valueOf = function valueOf() {
            return this
        }
        ,
        addToStringTagToClass(WombatLocation, "Location"),
        AutoFetcher.prototype._initWorker = function (config) {
            var wombat = this.wombat;
            if (config.isTop) {
                try {
                    this.worker = new Worker(config.workerURL, {
                        type: "classic",
                        credentials: "include"
                    })
                } catch (e) {
                    console.error("Failed to create auto fetch worker\n", e)
                }
                return
            }
            this.worker = {
                postMessage: function (msg) {
                    msg.wb_type || (msg = {
                        wb_type: "aaworker",
                        msg: msg
                    }),
                        wombat.$wbwindow.__WB_replay_top.__orig_postMessage(msg, "*")
                },
                terminate: function () { }
            }
        }
        ,
        AutoFetcher.prototype.extractMediaRulesFromSheet = function (sheet) {
            var rules, media = [];
            try {
                rules = sheet.cssRules || sheet.rules
            } catch (e) {
                return media
            }
            for (var rule, i = 0; i < rules.length; ++i)
                rule = rules[i],
                    rule.type === CSSRule.MEDIA_RULE && media.push(rule.cssText);
            return media
        }
        ,
        AutoFetcher.prototype.deferredSheetExtraction = function (sheet) {
            var afw = this;
            Promise.resolve().then(function () {
                var media = afw.extractMediaRulesFromSheet(sheet);
                media.length > 0 && afw.preserveMedia(media)
            })
        }
        ,
        AutoFetcher.prototype.terminate = function () {
            this.worker.terminate()
        }
        ,
        AutoFetcher.prototype.justFetch = function (urls) {
            this.worker.postMessage({
                type: "fetch-all",
                values: urls
            })
        }
        ,
        AutoFetcher.prototype.fetchAsPage = function (url, originalUrl, title) {
            if (url) {
                var headers = {
                    "X-Wombat-History-Page": originalUrl
                };
                if (title) {
                    var encodedTitle = encodeURIComponent(title.trim());
                    title && (headers["X-Wombat-History-Title"] = encodedTitle)
                }
                var fetchData = {
                    url: url,
                    options: {
                        headers: headers,
                        cache: "no-store"
                    }
                };
                this.justFetch([fetchData])
            }
        }
        ,
        AutoFetcher.prototype.postMessage = function (msg, deferred) {
            if (deferred) {
                var afWorker = this;
                return void Promise.resolve().then(function () {
                    afWorker.worker.postMessage(msg)
                })
            }
            this.worker.postMessage(msg)
        }
        ,
        AutoFetcher.prototype.preserveSrcset = function (srcset, mod) {
            this.postMessage({
                type: "values",
                srcset: {
                    value: srcset,
                    mod: mod,
                    presplit: true
                }
            }, true)
        }
        ,
        AutoFetcher.prototype.preserveDataSrcset = function (elem) {
            this.postMessage({
                type: "values",
                srcset: {
                    value: elem.dataset.srcset,
                    mod: this.rwMod(elem),
                    presplit: false
                }
            }, true)
        }
        ,
        AutoFetcher.prototype.preserveMedia = function (media) {
            this.postMessage({
                type: "values",
                media: media
            }, true)
        }
        ,
        AutoFetcher.prototype.getSrcset = function (elem) {
            return this.wombat.wb_getAttribute ? this.wombat.wb_getAttribute.call(elem, "srcset") : elem.getAttribute("srcset")
        }
        ,
        AutoFetcher.prototype.rwMod = function (elem) {
            switch (elem.tagName) {
                case "SOURCE":
                    return elem.parentElement && elem.parentElement.tagName === "PICTURE" ? "im_" : "oe_";
                case "IMG":
                    return "im_";
            }
            return "oe_"
        }
        ,
        AutoFetcher.prototype.extractFromLocalDoc = function () {
            var afw = this;
            Promise.resolve().then(function () {
                for (var msg = {
                    type: "values",
                    context: {
                        docBaseURI: document.baseURI
                    }
                }, media = [], i = 0, sheets = document.styleSheets; i < sheets.length; ++i)
                    media = media.concat(afw.extractMediaRulesFromSheet(sheets[i]));
                var elem, srcv, mod, elems = document.querySelectorAll(afw.elemSelector), srcset = {
                    values: [],
                    presplit: false
                }, src = {
                    values: []
                };
                for (i = 0; i < elems.length; ++i)
                    elem = elems[i],
                        srcv = elem.src ? elem.src : null,
                        mod = afw.rwMod(elem),
                        elem.srcset && srcset.values.push({
                            srcset: afw.getSrcset(elem),
                            mod: mod,
                            tagSrc: srcv
                        }),
                        elem.dataset.srcset && srcset.values.push({
                            srcset: elem.dataset.srcset,
                            mod: mod,
                            tagSrc: srcv
                        }),
                        elem.dataset.src && src.values.push({
                            src: elem.dataset.src,
                            mod: mod
                        }),
                        elem.tagName === "SOURCE" && srcv && src.values.push({
                            src: srcv,
                            mod: mod
                        });
                media.length && (msg.media = media),
                    srcset.values.length && (msg.srcset = srcset),
                    src.values.length && (msg.src = src),
                    (msg.media || msg.srcset || msg.src) && afw.postMessage(msg)
            })
        }
        ,
        Wombat.prototype._internalInit = function () {
            this.initTopFrame(this.$wbwindow),
                this.initWombatLoc(this.$wbwindow),
                this.initWombatTop(this.$wbwindow);
            var wb_origin = this.$wbwindow.__WB_replay_top.location.origin
                , wb_host = this.$wbwindow.__WB_replay_top.location.host
                , wb_proto = this.$wbwindow.__WB_replay_top.location.protocol;
            this.wb_rel_prefix = this.wb_replay_prefix && this.wb_replay_prefix.indexOf(wb_origin) === 0 ? this.wb_replay_prefix.substring(wb_origin.length) : this.wb_replay_prefix,
                this.wb_prefixes = [this.wb_abs_prefix, this.wb_rel_prefix];
            var rx = "((" + wb_proto + ")?//" + wb_host + ")?" + this.wb_rel_prefix + "[^/]+/";
            this.wb_unrewrite_rx = new RegExp(rx, "g"),
                this.wb_info.is_framed && this.wb_info.mod !== "bn_" && this.initTopFrameNotify(this.wb_info),
                this.initAutoFetchWorker()
        }
        ,
        Wombat.prototype._addRemoveCSPViolationListener = function (yesNo) {
            this.showCSPViolations.yesNo = yesNo,
                this.showCSPViolations.yesNo && !this.showCSPViolations.added ? (this.showCSPViolations.added = true,
                    this._addEventListener(document, "securitypolicyviolation", this.utilFns.cspViolationListener)) : (this.showCSPViolations.added = false,
                        this._removeEventListener(document, "securitypolicyviolation", this.utilFns.cspViolationListener))
        }
        ,
        Wombat.prototype._addEventListener = function (obj, event, fun) {
            return this.utilFns.addEventListener ? this.utilFns.addEventListener.call(obj, event, fun) : void obj.addEventListener(event, fun)
        }
        ,
        Wombat.prototype._removeEventListener = function (obj, event, fun) {
            return this.utilFns.removeEventListener ? this.utilFns.removeEventListener.call(obj, event, fun) : void obj.removeEventListener(event, fun)
        }
        ,
        Wombat.prototype.getPageUnderModifier = function () {
            try {
                var pageUnderModifier = this.extractPageUnderModiferRE.exec(location.pathname);
                if (pageUnderModifier && pageUnderModifier[1]) {
                    var mod = pageUnderModifier[1].trim();
                    return mod || "mp_"
                }
            } catch (e) { }
            return "mp_"
        }
        ,
        Wombat.prototype.isNativeFunction = function (funToTest) {
            if (!funToTest || typeof funToTest !== "function")
                return false;
            var str = this.wb_funToString.call(funToTest);
            return str.indexOf("[native code]") != -1 && (!(funToTest.__WB_is_native_func__ !== undefined) || !!funToTest.__WB_is_native_func__)
        }
        ,
        Wombat.prototype.isString = function (arg) {
            return arg != null && Object.getPrototypeOf(arg) === String.prototype
        }
        ,
        Wombat.prototype.isSavedSrcSrcset = function (elem) {
            switch (elem.tagName) {
                case "IMG":
                case "VIDEO":
                case "AUDIO":
                    return true;
                case "SOURCE":
                    if (!elem.parentElement)
                        return false;
                    switch (elem.parentElement.tagName) {
                        case "PICTURE":
                        case "VIDEO":
                        case "AUDIO":
                            return true;
                        default:
                            return false;
                    }
                default:
                    return false;
            }
        }
        ,
        Wombat.prototype.isSavedDataSrcSrcset = function (elem) {
            return !!(elem.dataset && elem.dataset.srcset != null) && this.isSavedSrcSrcset(elem)
        }
        ,
        Wombat.prototype.isHostUrl = function (str) {
            if (str.indexOf("www.") === 0)
                return true;
            var matches = str.match(this.hostnamePortRe);
            return !!(matches && matches[0].length < 64) || (matches = str.match(this.ipPortRe),
                !!matches && matches[0].length < 64)
        }
        ,
        Wombat.prototype.isArgumentsObj = function (maybeArgumentsObj) {
            if (!maybeArgumentsObj || typeof maybeArgumentsObj.toString !== "function")
                return false;
            try {
                return this.utilFns.objToString.call(maybeArgumentsObj) === "[object Arguments]"
            } catch (e) {
                return false
            }
        }
        ,
        Wombat.prototype.deproxyArrayHandlingArgumentsObj = function (maybeArgumentsObj) {
            if (!maybeArgumentsObj || maybeArgumentsObj instanceof NodeList || !maybeArgumentsObj.length)
                return maybeArgumentsObj;
            for (var args = this.isArgumentsObj(maybeArgumentsObj) ? new Array(maybeArgumentsObj.length) : maybeArgumentsObj, i = 0; i < maybeArgumentsObj.length; ++i) {
                const res = this.proxyToObj(maybeArgumentsObj[i]);
                res !== args[i] && (args[i] = res)
            }
            return args
        }
        ,
        Wombat.prototype.startsWith = function (string, prefix) {
            return string ? string.indexOf(prefix) === 0 ? prefix : undefined : undefined
        }
        ,
        Wombat.prototype.startsWithOneOf = function (string, prefixes) {
            if (!string)
                return undefined;
            for (var i = 0; i < prefixes.length; i++)
                if (string.indexOf(prefixes[i]) === 0)
                    return prefixes[i];
            return undefined
        }
        ,
        Wombat.prototype.endsWith = function (str, suffix) {
            return str ? str.indexOf(suffix, str.length - suffix.length) === -1 ? undefined : suffix : undefined
        }
        ,
        Wombat.prototype.shouldRewriteAttr = function (tagName, attr) {
            switch (attr) {
                case "href":
                case "src":
                case "xlink:href":
                    return true;
            }
            return !!(tagName && this.tagToMod[tagName] && this.tagToMod[tagName][attr] !== undefined) || tagName === "VIDEO" && attr === "poster" || tagName === "META" && attr === "content"
        }
        ,
        Wombat.prototype.skipWrapScriptBasedOnType = function (scriptType) {
            return !!scriptType && (!!(scriptType.indexOf("json") >= 0) || scriptType.indexOf("text/template") >= 0)
        }
        ,
        Wombat.prototype.skipWrapScriptTextBasedOnText = function (text) {
            if (!text || text.indexOf(this.WB_ASSIGN_FUNC) >= 0 || text.indexOf("<") === 0)
                return true;
            for (var override_props = ["window", "self", "document", "location", "top", "parent", "frames", "opener"], i = 0; i < override_props.length; i++)
                if (text.indexOf(override_props[i]) >= 0)
                    return false;
            return true
        }
        ,
        Wombat.prototype.nodeHasChildren = function (node) {
            if (!node)
                return false;
            if (typeof node.hasChildNodes === "function")
                return node.hasChildNodes();
            var kids = node.children || node.childNodes;
            return !!kids && kids.length > 0
        }
        ,
        Wombat.prototype.rwModForElement = function (elem, attrName) {
            if (!elem)
                return undefined;
            var mod = "mp_";
            if (!(elem.tagName === "LINK" && attrName === "href")) {
                var maybeMod = this.tagToMod[elem.tagName];
                maybeMod != null && (mod = maybeMod[attrName])
            } else if (elem.rel) {
                var relV = elem.rel.trim().toLowerCase()
                    , asV = this.wb_getAttribute.call(elem, "as");
                if (asV && this.linkTagMods.linkRelToAs[relV] != null) {
                    var asMods = this.linkTagMods.linkRelToAs[relV];
                    mod = asMods[asV.toLowerCase()]
                } else
                    this.linkTagMods[relV] != null && (mod = this.linkTagMods[relV])
            }
            return mod
        }
        ,
        Wombat.prototype.removeWBOSRC = function (elem) {
            elem.tagName !== "SCRIPT" || elem.__$removedWBOSRC$__ || (elem.hasAttribute("__wb_orig_src") && elem.removeAttribute("__wb_orig_src"),
                elem.__$removedWBOSRC$__ = true)
        }
        ,
        Wombat.prototype.retrieveWBOSRC = function (elem) {
            if (elem.tagName === "SCRIPT" && !elem.__$removedWBOSRC$__) {
                var maybeWBOSRC;
                return maybeWBOSRC = this.wb_getAttribute ? this.wb_getAttribute.call(elem, "__wb_orig_src") : elem.getAttribute("__wb_orig_src"),
                    maybeWBOSRC == null && (elem.__$removedWBOSRC$__ = true),
                    maybeWBOSRC
            }
            return undefined
        }
        ,
        Wombat.prototype.wrapScriptTextJsProxy = function (scriptText) {
            return "var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };\nif (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }\n{\nlet window = _____WB$wombat$assign$function_____(\"window\");\nlet self = _____WB$wombat$assign$function_____(\"self\");\nlet document = _____WB$wombat$assign$function_____(\"document\");\nlet location = _____WB$wombat$assign$function_____(\"location\");\nlet top = _____WB$wombat$assign$function_____(\"top\");\nlet parent = _____WB$wombat$assign$function_____(\"parent\");\nlet frames = _____WB$wombat$assign$function_____(\"frames\");\nlet opener = _____WB$wombat$assign$function_____(\"opener\");\n" + scriptText.replace(this.DotPostMessageRe, ".__WB_pmw(self.window)$1") + "\n\n}"
        }
        ,
        Wombat.prototype.watchElem = function (elem, func) {
            if (!this.$wbwindow.MutationObserver)
                return false;
            var m = new this.$wbwindow.MutationObserver(function (records, observer) {
                for (var r, i = 0; i < records.length; i++)
                    if (r = records[i],
                        r.type === "childList")
                        for (var j = 0; j < r.addedNodes.length; j++)
                            func(r.addedNodes[j])
            }
            );
            m.observe(elem, {
                childList: true,
                subtree: true
            })
        }
        ,
        Wombat.prototype.reconstructDocType = function (doctype) {
            return doctype == null ? "" : "<!doctype " + doctype.name + (doctype.publicId ? " PUBLIC \"" + doctype.publicId + "\"" : "") + (!doctype.publicId && doctype.systemId ? " SYSTEM" : "") + (doctype.systemId ? " \"" + doctype.systemId + "\"" : "") + ">"
        }
        ,
        Wombat.prototype.getFinalUrl = function (useRel, mod, url) {
            var prefix = useRel ? this.wb_rel_prefix : this.wb_abs_prefix;
            return mod == null && (mod = this.wb_info.mod),
                this.wb_info.is_live || (prefix += this.wb_info.wombat_ts),
                prefix += mod,
                prefix[prefix.length - 1] !== "/" && (prefix += "/"),
                prefix + url
        }
        ,
        Wombat.prototype.resolveRelUrl = function (url, doc) {
            var docObj = doc || this.$wbwindow.document
                , parser = this.makeParser(docObj.baseURI, docObj)
                , hash = parser.href.lastIndexOf("#")
                , href = hash >= 0 ? parser.href.substring(0, hash) : parser.href
                , lastslash = href.lastIndexOf("/");
            return parser.href = lastslash >= 0 && lastslash !== href.length - 1 ? href.substring(0, lastslash + 1) + url : href + url,
                parser.href
        }
        ,
        Wombat.prototype.extractOriginalURL = function (rewrittenUrl) {
            if (!rewrittenUrl)
                return "";
            if (this.wb_is_proxy)
                return rewrittenUrl;
            var rwURLString = rewrittenUrl.toString()
                , url = rwURLString;
            if (this.startsWithOneOf(url, this.IGNORE_PREFIXES))
                return url;
            var start;
            start = this.startsWith(url, this.wb_abs_prefix) ? this.wb_abs_prefix.length : this.wb_rel_prefix && this.startsWith(url, this.wb_rel_prefix) ? this.wb_rel_prefix.length : this.wb_rel_prefix ? 1 : 0;
            var index = url.indexOf("/http", start);
            return index < 0 && (index = url.indexOf("///", start)),
                index < 0 && (index = url.indexOf("/blob:", start)),
                index < 0 && (index = url.indexOf("/about:blank", start)),
                index >= 0 ? url = url.substr(index + 1) : (index = url.indexOf(this.wb_replay_prefix),
                    index >= 0 && (url = url.substr(index + this.wb_replay_prefix.length)),
                    url.length > 4 && url.charAt(2) === "_" && url.charAt(3) === "/" && (url = url.substr(4)),
                    url !== rwURLString && !this.startsWithOneOf(url, this.VALID_PREFIXES) && !this.startsWith(url, "blob:") && (url = this.wb_orig_scheme + url)),
                rwURLString.charAt(0) === "/" && rwURLString.charAt(1) !== "/" && this.startsWith(url, this.wb_orig_origin) && (url = url.substr(this.wb_orig_origin.length)),
                this.startsWith(url, this.REL_PREFIX) ? this.wb_info.wombat_scheme + ":" + url : url
        }
        ,
        Wombat.prototype.makeParser = function (maybeRewrittenURL, doc) {
            var originalURL = this.extractOriginalURL(maybeRewrittenURL)
                , docElem = doc;
            return doc || (this.$wbwindow.location.href === "about:blank" && this.$wbwindow.opener ? docElem = this.$wbwindow.opener.document : docElem = this.$wbwindow.document),
                this._makeURLParser(originalURL, docElem)
        }
        ,
        Wombat.prototype._makeURLParser = function (url, docElem) {
            try {
                return new this.$wbwindow.URL(url, docElem.baseURI)
            } catch (e) { }
            var p = docElem.createElement("a");
            return p._no_rewrite = true,
                p.href = url,
                p
        }
        ,
        Wombat.prototype.defProp = function (obj, prop, setFunc, getFunc, enumerable) {
            var existingDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
            if (existingDescriptor && !existingDescriptor.configurable)
                return false;
            if (!getFunc)
                return false;
            var descriptor = {
                configurable: true,
                enumerable: enumerable || false,
                get: getFunc
            };
            setFunc && (descriptor.set = setFunc);
            try {
                return Object.defineProperty(obj, prop, descriptor),
                    true
            } catch (e) {
                return console.warn("Failed to redefine property %s", prop, e.message),
                    false
            }
        }
        ,
        Wombat.prototype.defGetterProp = function (obj, prop, getFunc, enumerable) {
            var existingDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
            if (existingDescriptor && !existingDescriptor.configurable)
                return false;
            if (!getFunc)
                return false;
            try {
                return Object.defineProperty(obj, prop, {
                    configurable: true,
                    enumerable: enumerable || false,
                    get: getFunc
                }),
                    true
            } catch (e) {
                return console.warn("Failed to redefine property %s", prop, e.message),
                    false
            }
        }
        ,
        Wombat.prototype.getOrigGetter = function (obj, prop) {
            var orig_getter;
            if (obj.__lookupGetter__ && (orig_getter = obj.__lookupGetter__(prop)),
                !orig_getter && Object.getOwnPropertyDescriptor) {
                var props = Object.getOwnPropertyDescriptor(obj, prop);
                props && (orig_getter = props.get)
            }
            return orig_getter
        }
        ,
        Wombat.prototype.getOrigSetter = function (obj, prop) {
            var orig_setter;
            if (obj.__lookupSetter__ && (orig_setter = obj.__lookupSetter__(prop)),
                !orig_setter && Object.getOwnPropertyDescriptor) {
                var props = Object.getOwnPropertyDescriptor(obj, prop);
                props && (orig_setter = props.set)
            }
            return orig_setter
        }
        ,
        Wombat.prototype.getAllOwnProps = function (obj) {
            for (var ownProps = [], props = Object.getOwnPropertyNames(obj), i = 0; i < props.length; i++) {
                var prop = props[i];
                try {
                    obj[prop] && !obj[prop].prototype && ownProps.push(prop)
                } catch (e) { }
            }
            for (var traverseObj = Object.getPrototypeOf(obj); traverseObj;) {
                for (props = Object.getOwnPropertyNames(traverseObj),
                    i = 0; i < props.length; i++)
                    ownProps.push(props[i]);
                traverseObj = Object.getPrototypeOf(traverseObj)
            }
            return ownProps
        }
        ,
        Wombat.prototype.sendTopMessage = function (message, skipTopCheck, win) {
            win = win || this.$wbwindow;
            win.__WB_top_frame && (skipTopCheck || win == win.__WB_replay_top) && win.__WB_top_frame.postMessage(message, this.wb_info.top_host)
        }
        ,
        Wombat.prototype.sendHistoryUpdate = function (url, title, win) {
            this.sendTopMessage({
                url: url,
                ts: this.wb_info.timestamp,
                request_ts: this.wb_info.request_ts,
                is_live: this.wb_info.is_live,
                title: title,
                wb_type: "replace-url"
            }, false, win)
        }
        ,
        Wombat.prototype.updateLocation = function (reqHref, origHref, actualLocation) {
            if (reqHref && reqHref !== origHref) {
                var ext_orig = this.extractOriginalURL(origHref)
                    , ext_req = this.extractOriginalURL(reqHref);
                if (ext_orig && ext_orig !== ext_req) {
                    var final_href = this.rewriteUrl(reqHref);
                    console.log(actualLocation.href + " -> " + final_href),
                        actualLocation.href = final_href
                }
            }
        }
        ,
        Wombat.prototype.checkLocationChange = function (wombatLoc, isTop) {
            var locType = typeof wombatLoc
                , actual_location = isTop ? this.$wbwindow.__WB_replay_top.location : this.$wbwindow.location;
            locType === "string" ? this.updateLocation(wombatLoc, actual_location.href, actual_location) : locType === "object" && this.updateLocation(wombatLoc.href, wombatLoc._orig_href, actual_location)
        }
        ,
        Wombat.prototype.checkAllLocations = function () {
            return !this.wb_wombat_updating && void (this.wb_wombat_updating = true,
                this.checkLocationChange(this.$wbwindow.WB_wombat_location, false),
                this.$wbwindow.WB_wombat_location != this.$wbwindow.__WB_replay_top.WB_wombat_location && this.checkLocationChange(this.$wbwindow.__WB_replay_top.WB_wombat_location, true),
                this.wb_wombat_updating = false)
        }
        ,
        Wombat.prototype.proxyToObj = function (source) {
            if (source)
                try {
                    var proxyRealObj = source.__WBProxyRealObj__;
                    if (proxyRealObj)
                        return proxyRealObj
                } catch (e) { }
            return source
        }
        ,
        Wombat.prototype.objToProxy = function (obj) {
            if (obj)
                try {
                    var maybeWbProxy = obj._WB_wombat_obj_proxy;
                    if (maybeWbProxy)
                        return maybeWbProxy
                } catch (e) { }
            return obj
        }
        ,
        Wombat.prototype.defaultProxyGet = function (obj, prop, ownProps, fnCache) {
            switch (prop) {
                case "__WBProxyRealObj__":
                    return obj;
                case "location":
                case "WB_wombat_location":
                    return obj.WB_wombat_location;
                case "_WB_wombat_obj_proxy":
                    return obj._WB_wombat_obj_proxy;
                case "__WB_pmw":
                case "WB_wombat_eval":
                case this.WB_ASSIGN_FUNC:
                case this.WB_CHECK_THIS_FUNC:
                    return obj[prop];
                case "origin":
                    return obj.WB_wombat_location.origin;
                case "constructor":
                    if (obj.constructor === Window)
                        return obj.constructor;
            }
            var retVal = obj[prop]
                , type = typeof retVal;
            if (type === "function" && ownProps.indexOf(prop) !== -1) {
                switch (prop) {
                    case "requestAnimationFrame":
                    case "cancelAnimationFrame":
                        {
                            if (!this.isNativeFunction(retVal))
                                return retVal;
                            break
                        }
                }
                var cachedFN = fnCache[prop];
                return cachedFN && cachedFN.original === retVal || (cachedFN = {
                    original: retVal,
                    boundFn: retVal.bind(obj)
                },
                    fnCache[prop] = cachedFN),
                    cachedFN.boundFn
            }
            return type === "object" && retVal && retVal._WB_wombat_obj_proxy ? (retVal instanceof Window && this.initNewWindowWombat(retVal),
                retVal._WB_wombat_obj_proxy) : retVal
        }
        ,
        Wombat.prototype.setLoc = function (loc, originalURL) {
            var parser = this.makeParser(originalURL, loc.ownerDocument);
            loc._orig_href = originalURL,
                loc._parser = parser;
            var href = parser.href;
            loc._hash = parser.hash,
                loc._href = href,
                loc._host = parser.host,
                loc._hostname = parser.hostname,
                loc._origin = parser.origin ? parser.host ? parser.origin : "null" : parser.protocol + "//" + parser.hostname + (parser.port ? ":" + parser.port : ""),
                loc._pathname = parser.pathname,
                loc._port = parser.port,
                loc._protocol = parser.protocol,
                loc._search = parser.search,
                Object.defineProperty || (loc.href = href,
                    loc.hash = parser.hash,
                    loc.host = loc._host,
                    loc.hostname = loc._hostname,
                    loc.origin = loc._origin,
                    loc.pathname = loc._pathname,
                    loc.port = loc._port,
                    loc.protocol = loc._protocol,
                    loc.search = loc._search)
        }
        ,
        Wombat.prototype.makeGetLocProp = function (prop, origGetter) {
            var wombat = this;
            return function newGetLocProp() {
                if (this._no_rewrite)
                    return origGetter.call(this, prop);
                var curr_orig_href = origGetter.call(this, "href");
                return prop === "href" ? wombat.extractOriginalURL(curr_orig_href) : prop === "ancestorOrigins" ? [] : (this._orig_href !== curr_orig_href && wombat.setLoc(this, curr_orig_href),
                    this["_" + prop])
            }
        }
        ,
        Wombat.prototype.makeSetLocProp = function (prop, origSetter, origGetter) {
            var wombat = this;
            return function newSetLocProp(value) {
                if (this._no_rewrite)
                    return origSetter.call(this, prop, value);
                if (this["_" + prop] !== value) {
                    if (this["_" + prop] = value,
                        !this._parser) {
                        var href = origGetter.call(this);
                        this._parser = wombat.makeParser(href, this.ownerDocument)
                    }
                    var rel = false;
                    prop === "href" && typeof value === "string" && value && (value[0] === "." ? value = wombat.resolveRelUrl(value, this.ownerDocument) : value[0] === "/" && (value.length <= 1 || value[1] !== "/") && (rel = true,
                        value = WB_wombat_location.origin + value));
                    try {
                        this._parser[prop] = value
                    } catch (e) {
                        console.log("Error setting " + prop + " = " + value)
                    }
                    prop === "hash" ? (value = this._parser[prop],
                        origSetter.call(this, "hash", value)) : (rel = rel || value === this._parser.pathname,
                            value = wombat.rewriteUrl(this._parser.href, rel),
                            origSetter.call(this, "href", value))
                }
            }
        }
        ,
        Wombat.prototype.styleReplacer = function (match, n1, n2, n3, offset, string) {
            return n1 + this.rewriteUrl(n2) + n3
        }
        ,
        Wombat.prototype.domConstructorErrorChecker = function (thisObj, what, args, numRequiredArgs) {
            var errorMsg, needArgs = typeof numRequiredArgs === "number" ? numRequiredArgs : 1;
            if (thisObj instanceof Window ? errorMsg = "Failed to construct '" + what + "': Please use the 'new' operator, this DOM object constructor cannot be called as a function." : args && args.length < needArgs && (errorMsg = "Failed to construct '" + what + "': " + needArgs + " argument required, but only 0 present."),
                errorMsg)
                throw new TypeError(errorMsg)
        }
        ,
        Wombat.prototype.rewriteNodeFuncArgs = function (fnThis, originalFn, newNode, oldNode) {
            if (newNode)
                switch (newNode.nodeType) {
                    case Node.ELEMENT_NODE:
                        this.rewriteElemComplete(newNode);
                        break;
                    case Node.TEXT_NODE:
                        (fnThis.tagName === "STYLE" || newNode.parentNode && newNode.parentNode.tagName === "STYLE") && (newNode.textContent = this.rewriteStyle(newNode.textContent));
                        break;
                    case Node.DOCUMENT_FRAGMENT_NODE:
                        this.recurseRewriteElem(newNode);
                }
            var created = originalFn.call(fnThis, newNode, oldNode);
            return created && created.tagName === "IFRAME" && (created.allow = "autoplay 'self'; fullscreen 'self'",
                this.initIframeWombat(created)),
                created
        }
        ,
        Wombat.prototype.rewriteWSURL = function (originalURL) {
            if (!originalURL)
                return originalURL;
            var urltype_ = typeof originalURL
                , url = originalURL;
            if (urltype_ === "object")
                url = originalURL.toString();
            else if (urltype_ !== "string")
                return originalURL;
            if (!url)
                return url;
            var wsScheme = "ws://"
                , wssScheme = "wss://";
            if (this.wb_is_proxy)
                return this.wb_orig_scheme === this.HTTP_PREFIX && this.startsWith(url, wssScheme) ? "ws://" + url.substr(wssScheme.length) : this.wb_orig_scheme === this.HTTPS_PREFIX && this.startsWith(url, "ws://") ? wssScheme + url.substr(5) : url;
            var wbSecure = this.wb_abs_prefix.indexOf(this.HTTPS_PREFIX) === 0
                , wbPrefix = this.wb_abs_prefix.replace(wbSecure ? this.HTTPS_PREFIX : this.HTTP_PREFIX, wbSecure ? wssScheme : "ws://");
            return wbPrefix += this.wb_info.wombat_ts + "ws_",
                url[url.length - 1] !== "/" && (wbPrefix += "/"),
                wbPrefix + url.replace("WB_wombat_", "")
        }
        ,
        Wombat.prototype.rewriteUrl_ = function (originalURL, useRel, mod, doc) {
            if (!originalURL)
                return originalURL;
            var url, urltype_ = typeof originalURL;
            if (urltype_ === "object")
                url = originalURL.toString();
            else {
                if (urltype_ !== "string")
                    return originalURL;
                url = originalURL
            }
            if (!url)
                return url;
            if (this.wb_is_proxy)
                return this.wb_orig_scheme === this.HTTP_PREFIX && this.startsWith(url, this.HTTPS_PREFIX) ? this.HTTP_PREFIX + url.substr(this.HTTPS_PREFIX.length) : this.wb_orig_scheme === this.HTTPS_PREFIX && this.startsWith(url, this.HTTP_PREFIX) ? this.HTTPS_PREFIX + url.substr(this.HTTP_PREFIX.length) : url;
            if (url = url.replace("WB_wombat_", ""),
                mod === "if_" && this.wb_info.isSW && this.startsWith(url, "blob:"))
                return this.wb_info.prefix + this.wb_info.timestamp + "if_/" + url;
            if (this.startsWithOneOf(url.toLowerCase(), this.IGNORE_PREFIXES))
                return url;
            if (this.wb_opts.no_rewrite_prefixes && this.startsWithOneOf(url, this.wb_opts.no_rewrite_prefixes))
                return url;
            var check_url;
            check_url = url.indexOf("//") === 0 ? window.location.protocol + url : url;
            var originalLoc = this.$wbwindow.location;
            if (this.startsWith(check_url, this.wb_replay_prefix) || this.startsWith(check_url, originalLoc.origin + this.wb_replay_prefix))
                return url;
            if (originalLoc.host !== originalLoc.hostname && this.startsWith(url, originalLoc.protocol + "//" + originalLoc.hostname + "/"))
                return url.replace("/" + originalLoc.hostname + "/", "/" + originalLoc.host + "/");
            if (url.charAt(0) === "/" && !this.startsWith(url, this.REL_PREFIX)) {
                if (this.wb_capture_date_part && url.indexOf(this.wb_capture_date_part) >= 0)
                    return url;
                if (url.indexOf(this.wb_rel_prefix) === 0 && url.indexOf("http") > 1) {
                    var scheme_sep = url.indexOf(":/");
                    return scheme_sep > 0 && url[scheme_sep + 2] !== "/" ? url.substring(0, scheme_sep + 2) + "/" + url.substring(scheme_sep + 2) : url
                }
                return this.getFinalUrl(true, mod, this.wb_orig_origin + url)
            }
            url.charAt(0) === "." && (url = this.resolveRelUrl(url, doc));
            var prefix = this.startsWithOneOf(url.toLowerCase(), this.VALID_PREFIXES);
            if (prefix) {
                var orig_host = this.$wbwindow.__WB_replay_top.location.host
                    , orig_protocol = this.$wbwindow.__WB_replay_top.location.protocol
                    , prefix_host = prefix + orig_host + "/";
                if (this.startsWith(url, prefix_host)) {
                    if (this.startsWith(url, this.wb_replay_prefix))
                        return url;
                    var curr_scheme = orig_protocol + "//"
                        , path = url.substring(prefix_host.length)
                        , rebuild = false;
                    return path.indexOf(this.wb_rel_prefix) < 0 && url.indexOf("/static/") < 0 && (path = this.getFinalUrl(true, mod, WB_wombat_location.origin + "/" + path),
                        rebuild = true),
                        prefix !== curr_scheme && prefix !== this.REL_PREFIX && (rebuild = true),
                        rebuild && (url = useRel ? "" : curr_scheme + orig_host,
                            path && path[0] !== "/" && (url += "/"),
                            url += path),
                        url
                }
                return this.getFinalUrl(useRel, mod, url)
            }
            return prefix = this.startsWithOneOf(url, this.BAD_PREFIXES),
                prefix ? this.getFinalUrl(useRel, mod, this.extractOriginalURL(url)) : this.isHostUrl(url) && !this.startsWith(url, originalLoc.host + "/") ? this.getFinalUrl(useRel, mod, this.wb_orig_scheme + url) : url
        }
        ,
        Wombat.prototype.rewriteUrl = function (url, useRel, mod, doc) {
            var rewritten = this.rewriteUrl_(url, useRel, mod, doc);
            return this.debug_rw && (url === rewritten ? console.log("NOT REWRITTEN " + url) : console.log("REWRITE: " + url + " -> " + rewritten)),
                rewritten
        }
        ,
        Wombat.prototype.performAttributeRewrite = function (elem, name, value, absUrlOnly) {
            switch (name) {
                case "innerHTML":
                case "outerHTML":
                    return this.rewriteHtml(value);
                case "filter":
                    return this.rewriteInlineStyle(value);
                case "style":
                    return this.rewriteStyle(value);
                case "srcset":
                    return this.rewriteSrcset(value, elem);
            }
            if (absUrlOnly && !this.startsWithOneOf(value, this.VALID_PREFIXES))
                return value;
            var mod = this.rwModForElement(elem, name);
            return this.wbUseAFWorker && this.WBAutoFetchWorker && this.isSavedDataSrcSrcset(elem) && this.WBAutoFetchWorker.preserveDataSrcset(elem),
                this.rewriteUrl(value, false, mod, elem.ownerDocument)
        }
        ,
        Wombat.prototype.rewriteAttr = function (elem, name, absUrlOnly) {
            var changed = false;
            if (!elem || !elem.getAttribute || elem._no_rewrite || elem["_" + name])
                return changed;
            var value = this.wb_getAttribute.call(elem, name);
            if (!value || this.startsWith(value, "javascript:"))
                return changed;
            var new_value = this.performAttributeRewrite(elem, name, value, absUrlOnly);
            return new_value !== value && (this.removeWBOSRC(elem),
                this.wb_setAttribute.call(elem, name, new_value),
                changed = true),
                changed
        }
        ,
        Wombat.prototype.noExceptRewriteStyle = function (style) {
            try {
                return this.rewriteStyle(style)
            } catch (e) {
                return style
            }
        }
        ,
        Wombat.prototype.rewriteStyle = function (style) {
            if (!style)
                return style;
            var value = style;
            return typeof style === "object" && (value = style.toString()),
                typeof value === "string" ? value.replace(this.STYLE_REGEX, this.styleReplacer).replace(this.IMPORT_REGEX, this.styleReplacer).replace(this.no_wombatRe, "") : value
        }
        ,
        Wombat.prototype.rewriteSrcset = function (value, elem) {
            if (!value)
                return "";
            for (var split = value.split(this.srcsetRe), values = [], mod = this.rwModForElement(elem, "srcset"), i = 0; i < split.length; i++)
                if (split[i]) {
                    var trimmed = split[i].trim();
                    trimmed && values.push(this.rewriteUrl(trimmed, true, mod))
                }
            return this.wbUseAFWorker && this.WBAutoFetchWorker && this.isSavedSrcSrcset(elem) && this.WBAutoFetchWorker.preserveSrcset(values, this.WBAutoFetchWorker.rwMod(elem)),
                values.join(", ")
        }
        ,
        Wombat.prototype.rewriteFrameSrc = function (elem, attrName) {
            var new_value, value = this.wb_getAttribute.call(elem, attrName);
            if (this.startsWith(value, "javascript:") && value.indexOf("WB_wombat_") >= 0) {
                var JS = "javascript:";
                new_value = "javascript:window.parent._wb_wombat.initNewWindowWombat(window);" + value.substr(11)
            }
            return new_value || (new_value = this.rewriteUrl(value, false, this.rwModForElement(elem, attrName))),
                new_value !== value && (this.wb_setAttribute.call(elem, attrName, new_value),
                    true)
        }
        ,
        Wombat.prototype.rewriteScript = function (elem) {
            if (elem.hasAttribute("src") || !elem.textContent || !this.$wbwindow.Proxy)
                return this.rewriteAttr(elem, "src");
            if (this.skipWrapScriptBasedOnType(elem.type))
                return false;
            var text = elem.textContent.trim();
            return !this.skipWrapScriptTextBasedOnText(text) && (elem.textContent = this.wrapScriptTextJsProxy(text),
                true)
        }
        ,
        Wombat.prototype.rewriteSVGElem = function (elem) {
            var changed = this.rewriteAttr(elem, "filter");
            return changed = this.rewriteAttr(elem, "style") || changed,
                changed = this.rewriteAttr(elem, "xlink:href") || changed,
                changed = this.rewriteAttr(elem, "href") || changed,
                changed = this.rewriteAttr(elem, "src") || changed,
                changed
        }
        ,
        Wombat.prototype.rewriteElem = function (elem) {
            var changed = false;
            if (!elem)
                return changed;
            if (elem instanceof SVGElement)
                changed = this.rewriteSVGElem(elem);
            else
                switch (elem.tagName) {
                    case "META":
                        var maybeCSP = this.wb_getAttribute.call(elem, "http-equiv");
                        maybeCSP && maybeCSP.toLowerCase() === "content-security-policy" && (this.wb_setAttribute.call(elem, "http-equiv", "_" + maybeCSP),
                            changed = true);
                        break;
                    case "STYLE":
                        var new_content = this.rewriteStyle(elem.textContent);
                        elem.textContent !== new_content && (elem.textContent = new_content,
                            changed = true,
                            this.wbUseAFWorker && this.WBAutoFetchWorker && elem.sheet != null && this.WBAutoFetchWorker.deferredSheetExtraction(elem.sheet));
                        break;
                    case "LINK":
                        changed = this.rewriteAttr(elem, "href"),
                            this.wbUseAFWorker && elem.rel === "stylesheet" && this._addEventListener(elem, "load", this.utilFns.wbSheetMediaQChecker);
                        break;
                    case "IMG":
                        changed = this.rewriteAttr(elem, "src"),
                            changed = this.rewriteAttr(elem, "srcset") || changed,
                            changed = this.rewriteAttr(elem, "style") || changed,
                            this.wbUseAFWorker && this.WBAutoFetchWorker && elem.dataset.srcset && this.WBAutoFetchWorker.preserveDataSrcset(elem);
                        break;
                    case "OBJECT":
                        if (this.wb_info.isSW && elem.parentElement && elem.getAttribute("type") === "application/pdf") {
                            for (var iframe = this.$wbwindow.document.createElement("IFRAME"), i = 0; i < elem.attributes.length; i++) {
                                var attr = elem.attributes[i]
                                    , name = attr.name;
                                name === "data" && (name = "src"),
                                    this.wb_setAttribute.call(iframe, name, attr.value)
                            }
                            elem.parentElement.replaceChild(iframe, elem),
                                changed = true;
                            break
                        }
                        changed = this.rewriteAttr(elem, "data", true),
                            changed = this.rewriteAttr(elem, "style") || changed;
                        break;
                    case "FORM":
                        changed = this.rewriteAttr(elem, "poster"),
                            changed = this.rewriteAttr(elem, "action") || changed,
                            changed = this.rewriteAttr(elem, "style") || changed;
                        break;
                    case "IFRAME":
                        if (changed = this.rewriteFrameSrc(elem, "src"),
                            this.wb_info.isSW && !changed) {
                            var srcdoc = elem.getAttribute("srcdoc");
                            if (srcdoc)
                                elem.removeAttribute("srcdoc"),
                                    elem.src = this.wb_info.prefix + this.wb_info.timestamp + "id_/srcdoc:" + btoa(encodeURIComponent(srcdoc));
                            else {
                                var src = elem.getAttribute("src");
                                src && src !== "about:blank" || (!src && (elem.__WB_blank = true),
                                    elem.src = this.wb_info.prefix + this.wb_info.timestamp + "mp_/about:blank")
                            }
                        }
                        changed = this.rewriteAttr(elem, "style") || changed;
                        break;
                    case "FRAME":
                        changed = this.rewriteFrameSrc(elem, "src"),
                            changed = this.rewriteAttr(elem, "style") || changed;
                        break;
                    case "SCRIPT":
                        changed = this.rewriteScript(elem);
                        break;
                    default:
                        {
                            changed = this.rewriteAttr(elem, "src"),
                                changed = this.rewriteAttr(elem, "srcset") || changed,
                                changed = this.rewriteAttr(elem, "href") || changed,
                                changed = this.rewriteAttr(elem, "style") || changed,
                                changed = this.rewriteAttr(elem, "poster") || changed;
                            break
                        }
                }
            return elem.hasAttribute && elem.removeAttribute && (elem.hasAttribute("crossorigin") && (elem.removeAttribute("crossorigin"),
                changed = true),
                elem.hasAttribute("integrity") && (elem.removeAttribute("integrity"),
                    changed = true)),
                changed
        }
        ,
        Wombat.prototype.recurseRewriteElem = function (curr) {
            if (!this.nodeHasChildren(curr))
                return false;
            for (var changed = false, rewriteQ = [curr.children || curr.childNodes]; rewriteQ.length > 0;)
                for (var child, children = rewriteQ.shift(), i = 0; i < children.length; i++)
                    child = children[i],
                        child.nodeType === Node.ELEMENT_NODE && (changed = this.rewriteElem(child) || changed,
                            this.nodeHasChildren(child) && rewriteQ.push(child.children || child.childNodes));
            return changed
        }
        ,
        Wombat.prototype.rewriteElemComplete = function (elem) {
            if (!elem)
                return false;
            var changed = this.rewriteElem(elem)
                , changedRecursively = this.recurseRewriteElem(elem);
            return changed || changedRecursively
        }
        ,
        Wombat.prototype.rewriteElementsInArguments = function (originalArguments) {
            for (var argElem, argArr = new Array(originalArguments.length), i = 0; i < originalArguments.length; i++)
                argElem = originalArguments[i],
                    argElem instanceof Node ? (this.rewriteElemComplete(argElem),
                        argArr[i] = argElem) : typeof argElem === "string" ? argArr[i] = this.rewriteHtml(argElem) : argArr[i] = argElem;
            return argArr
        }
        ,
        Wombat.prototype.rewriteHtml = function (string, checkEndTag) {
            if (!string)
                return string;
            var rwString = string;
            if (typeof string !== "string" && (rwString = string.toString()),
                this.write_buff && (rwString = this.write_buff + rwString,
                    this.write_buff = ""),
                rwString.indexOf("<script") <= 0 && (rwString = rwString.replace(/((id|class)=".*)WB_wombat_([^"]+)/, "$1$3")),
                !this.$wbwindow.HTMLTemplateElement || this.FullHTMLRegex.test(rwString))
                return this.rewriteHtmlFull(rwString, checkEndTag);
            var inner_doc = new DOMParser().parseFromString("<template>" + rwString + "</template>", "text/html");
            if (!inner_doc || !this.nodeHasChildren(inner_doc.head) || !inner_doc.head.children[0].content)
                return rwString;
            var template = inner_doc.head.children[0];
            if (template._no_rewrite = true,
                this.recurseRewriteElem(template.content)) {
                var new_html = template.innerHTML;
                if (checkEndTag) {
                    var first_elem = template.content.children && template.content.children[0];
                    if (first_elem) {
                        var end_tag = "</" + first_elem.tagName.toLowerCase() + ">";
                        this.endsWith(new_html, end_tag) && !this.endsWith(rwString.toLowerCase(), end_tag) && (new_html = new_html.substring(0, new_html.length - end_tag.length))
                    } else if (rwString[0] !== "<" || rwString[rwString.length - 1] !== ">")
                        return this.write_buff += rwString,
                            undefined
                }
                return new_html
            }
            return rwString
        }
        ,
        Wombat.prototype.rewriteHtmlFull = function (string, checkEndTag) {
            var inner_doc = new DOMParser().parseFromString(string, "text/html");
            if (!inner_doc)
                return string;
            for (var changed = false, i = 0; i < inner_doc.all.length; i++)
                changed = this.rewriteElem(inner_doc.all[i]) || changed;
            if (changed) {
                var new_html;
                if (string && string.indexOf("<html") >= 0)
                    inner_doc.documentElement._no_rewrite = true,
                        new_html = this.reconstructDocType(inner_doc.doctype) + inner_doc.documentElement.outerHTML;
                else {
                    inner_doc.head._no_rewrite = true,
                        inner_doc.body._no_rewrite = true;
                    var headHasKids = this.nodeHasChildren(inner_doc.head)
                        , bodyHasKids = this.nodeHasChildren(inner_doc.body);
                    if (new_html = (headHasKids ? inner_doc.head.outerHTML : "") + (bodyHasKids ? inner_doc.body.outerHTML : ""),
                        checkEndTag)
                        if (inner_doc.all.length > 3) {
                            var end_tag = "</" + inner_doc.all[3].tagName.toLowerCase() + ">";
                            this.endsWith(new_html, end_tag) && !this.endsWith(string.toLowerCase(), end_tag) && (new_html = new_html.substring(0, new_html.length - end_tag.length))
                        } else if (string[0] !== "<" || string[string.length - 1] !== ">")
                            return void (this.write_buff += string);
                    new_html = this.reconstructDocType(inner_doc.doctype) + new_html
                }
                return new_html
            }
            return string
        }
        ,
        Wombat.prototype.rewriteInlineStyle = function (orig) {
            var decoded;
            try {
                decoded = decodeURIComponent(orig)
            } catch (e) {
                decoded = orig
            }
            if (decoded !== orig) {
                var parts = this.rewriteStyle(decoded).split(",", 2);
                return parts[0] + "," + encodeURIComponent(parts[1])
            }
            return this.rewriteStyle(orig)
        }
        ,
        Wombat.prototype.rewriteCookie = function (cookie) {
            var wombat = this
                , rwCookie = cookie.replace(this.wb_abs_prefix, "").replace(this.wb_rel_prefix, "");
            return rwCookie = rwCookie.replace(this.cookie_domain_regex, function (m, m1) {
                var message = {
                    domain: m1,
                    cookie: rwCookie,
                    wb_type: "cookie"
                };
                return wombat.sendTopMessage(message, true),
                    wombat.$wbwindow.location.hostname.indexOf(".") >= 0 && !wombat.IP_RX.test(wombat.$wbwindow.location.hostname) ? "Domain=." + wombat.$wbwindow.location.hostname : ""
            }).replace(this.cookie_path_regex, function (m, m1) {
                var rewritten = wombat.rewriteUrl(m1);
                return rewritten.indexOf(wombat.wb_curr_host) === 0 && (rewritten = rewritten.substring(wombat.wb_curr_host.length)),
                    "Path=" + rewritten
            }),
                wombat.$wbwindow.location.protocol !== "https:" && (rwCookie = rwCookie.replace("secure", "")),
                rwCookie.replace(",|", ",")
        }
        ,
        Wombat.prototype.rewriteWorker = function (workerUrl) {
            if (!workerUrl)
                return workerUrl;
            var isBlob = workerUrl.indexOf("blob:") === 0
                , isJS = workerUrl.indexOf("javascript:") === 0;
            if (!isBlob && !isJS) {
                if (!this.startsWithOneOf(workerUrl, this.VALID_PREFIXES) && !this.startsWith(workerUrl, "/") && !this.startsWithOneOf(workerUrl, this.BAD_PREFIXES)) {
                    var rurl = this.resolveRelUrl(workerUrl, this.$wbwindow.document);
                    return this.rewriteUrl(rurl, false, "wkr_", this.$wbwindow.document)
                }
                return this.rewriteUrl(workerUrl, false, "wkr_", this.$wbwindow.document)
            }
            var workerCode = isJS ? workerUrl.replace("javascript:", "") : null;
            if (isBlob) {
                var x = new XMLHttpRequest;
                this.utilFns.XHRopen.call(x, "GET", workerUrl, false),
                    this.utilFns.XHRsend.call(x),
                    workerCode = x.responseText.replace(this.workerBlobRe, "").replace(this.rmCheckThisInjectRe, "this")
            }
            if (this.wb_info.static_prefix || this.wb_info.ww_rw_script) {
                var originalURL = this.$wbwindow.document.baseURI
                    , ww_rw = this.wb_info.ww_rw_script || this.wb_info.static_prefix + "wombatWorkers.js"
                    , rw = "(function() { self.importScripts('" + ww_rw + "'); new WBWombat({'prefix': '" + this.wb_abs_prefix + "', 'prefixMod': '" + this.wb_abs_prefix + "wkrf_/', 'originalURL': '" + originalURL + "'}); })();";
                workerCode = rw + workerCode
            }
            var blob = new Blob([workerCode], {
                type: "application/javascript"
            });
            return URL.createObjectURL(blob)
        }
        ,
        Wombat.prototype.rewriteTextNodeFn = function (fnThis, originalFn, argsObj) {
            var args, deproxiedThis = this.proxyToObj(fnThis);
            if (argsObj.length > 0 && deproxiedThis.parentElement && deproxiedThis.parentElement.tagName === "STYLE") {
                args = new Array(argsObj.length);
                var dataIndex = argsObj.length - 1;
                dataIndex === 2 ? (args[0] = argsObj[0],
                    args[1] = argsObj[1]) : dataIndex === 1 && (args[0] = argsObj[0]),
                    args[dataIndex] = this.rewriteStyle(argsObj[dataIndex])
            } else
                args = argsObj;
            return originalFn.__WB_orig_apply ? originalFn.__WB_orig_apply(deproxiedThis, args) : originalFn.apply(deproxiedThis, args)
        }
        ,
        Wombat.prototype.rewriteDocWriteWriteln = function (fnThis, originalFn, argsObj) {
            var string, thisObj = this.proxyToObj(fnThis), argLen = argsObj.length;
            if (argLen === 0)
                return originalFn.call(thisObj);
            string = argLen === 1 ? argsObj[0] : Array.prototype.join.call(argsObj, "");
            var new_buff = this.rewriteHtml(string, true)
                , res = originalFn.call(thisObj, new_buff);
            return this.initNewWindowWombat(thisObj.defaultView),
                res
        }
        ,
        Wombat.prototype.rewriteChildNodeFn = function (fnThis, originalFn, argsObj) {
            var thisObj = this.proxyToObj(fnThis);
            if (argsObj.length === 0)
                return originalFn.call(thisObj);
            var newArgs = this.rewriteElementsInArguments(argsObj);
            return originalFn.__WB_orig_apply ? originalFn.__WB_orig_apply(thisObj, newArgs) : originalFn.apply(thisObj, newArgs)
        }
        ,
        Wombat.prototype.rewriteInsertAdjHTMLOrElemArgs = function (fnThis, originalFn, position, textOrElem, rwHTML) {
            var fnThisObj = this.proxyToObj(fnThis);
            return fnThisObj._no_rewrite ? originalFn.call(fnThisObj, position, textOrElem) : rwHTML ? originalFn.call(fnThisObj, position, this.rewriteHtml(textOrElem)) : (this.rewriteElemComplete(textOrElem),
                originalFn.call(fnThisObj, position, textOrElem))
        }
        ,
        Wombat.prototype.rewriteSetTimeoutInterval = function (fnThis, originalFn, argsObj) {
            var rw = this.isString(argsObj[0])
                , args = rw ? new Array(argsObj.length) : argsObj;
            if (rw) {
                args[0] = this.$wbwindow.Proxy ? this.wrapScriptTextJsProxy(argsObj[0]) : argsObj[0].replace(/\blocation\b/g, "WB_wombat_$&");
                for (var i = 1; i < argsObj.length; ++i)
                    args[i] = this.proxyToObj(argsObj[i])
            }
            var thisObj = this.proxyToObj(fnThis);
            return originalFn.__WB_orig_apply ? originalFn.__WB_orig_apply(thisObj, args) : originalFn.apply(thisObj, args)
        }
        ,
        Wombat.prototype.rewriteHTMLAssign = function (thisObj, oSetter, newValue) {
            var res = newValue
                , tagName = thisObj.tagName;
            thisObj._no_rewrite || thisObj instanceof this.$wbwindow.HTMLTemplateElement || (tagName === "STYLE" ? res = this.rewriteStyle(newValue) : tagName === "SCRIPT" ? (newValue && this.IsTagRegex.test(newValue) && (res = this.rewriteHtml(newValue)),
                res === newValue && !this.skipWrapScriptBasedOnType(thisObj.type) && !this.skipWrapScriptTextBasedOnText(newValue) && (res = this.wrapScriptTextJsProxy(res))) : res = this.rewriteHtml(newValue)),
                oSetter.call(thisObj, res),
                this.wbUseAFWorker && this.WBAutoFetchWorker && tagName === "STYLE" && thisObj.sheet != null && this.WBAutoFetchWorker.deferredSheetExtraction(thisObj.sheet)
        }
        ,
        Wombat.prototype.rewriteEvalArg = function (rawEvalOrWrapper, evalArg) {
            var toBeEvald = this.isString(evalArg) && !this.skipWrapScriptTextBasedOnText(evalArg) ? this.wrapScriptTextJsProxy(evalArg) : evalArg;
            return rawEvalOrWrapper(toBeEvald)
        }
        ,
        Wombat.prototype.addEventOverride = function (attr, eventProto) {
            var theProto = eventProto;
            eventProto || (theProto = this.$wbwindow.MessageEvent.prototype);
            var origGetter = this.getOrigGetter(theProto, attr);
            origGetter && this.defGetterProp(theProto, attr, function () {
                return this["_" + attr] == null ? origGetter.call(this) : this["_" + attr]
            })
        }
        ,
        Wombat.prototype.isAttrObjRewrite = function (attr) {
            if (!attr)
                return false;
            var tagName = attr.ownerElement && attr.ownerElement.tagName;
            return this.shouldRewriteAttr(tagName, attr.nodeName)
        }
        ,
        Wombat.prototype.newAttrObjGetSet = function (attrProto, prop) {
            var wombat = this
                , oGetter = this.getOrigGetter(attrProto, prop)
                , oSetter = this.getOrigSetter(attrProto, prop);
            this.defProp(attrProto, prop, function newAttrObjSetter(newValue) {
                var obj = wombat.proxyToObj(this)
                    , res = newValue;
                return wombat.isAttrObjRewrite(obj) && (res = wombat.performAttributeRewrite(obj.ownerElement, obj.name, newValue, false)),
                    oSetter.call(obj, res)
            }, function newAttrObjGetter() {
                var obj = wombat.proxyToObj(this)
                    , res = oGetter.call(obj);
                return wombat.isAttrObjRewrite(obj) ? wombat.extractOriginalURL(res) : res
            })
        }
        ,
        Wombat.prototype.overrideAttrProps = function () {
            var attrProto = this.$wbwindow.Attr.prototype;
            this.newAttrObjGetSet(attrProto, "value"),
                this.newAttrObjGetSet(attrProto, "nodeValue"),
                this.newAttrObjGetSet(attrProto, "textContent")
        }
        ,
        Wombat.prototype.overrideAttr = function (obj, attr, mod) {
            var orig_getter = this.getOrigGetter(obj, attr)
                , orig_setter = this.getOrigSetter(obj, attr)
                , wombat = this
                , setter = function newAttrPropSetter(orig) {
                    mod !== "js_" || this.__$removedWBOSRC$__ || wombat.removeWBOSRC(this);
                    var val = wombat.rewriteUrl(orig, false, mod);
                    if (orig_setter)
                        return orig_setter.call(this, val);
                    return wombat.wb_setAttribute ? wombat.wb_setAttribute.call(this, attr, val) : void 0
                }
                , getter = function newAttrPropGetter() {
                    var res;
                    return orig_getter ? res = orig_getter.call(this) : wombat.wb_getAttribute && (res = wombat.wb_getAttribute.call(this, attr)),
                        res = wombat.extractOriginalURL(res),
                        this.__WB_blank && res === "about:blank" ? "" : res
                };
            this.defProp(obj, attr, setter, getter)
        }
        ,
        Wombat.prototype.overridePropExtract = function (proto, prop, cond) {
            var orig_getter = this.getOrigGetter(proto, prop)
                , wombat = this;
            if (orig_getter) {
                var new_getter = function overridePropExtractNewGetter() {
                    var obj = wombat.proxyToObj(this)
                        , res = orig_getter.call(obj);
                    return !cond || cond(obj) ? wombat.extractOriginalURL(res) : res
                };
                this.defGetterProp(proto, prop, new_getter)
            }
        }
        ,
        Wombat.prototype.overrideReferrer = function ($document) {
            var orig_getter = this.getOrigGetter($document, "referrer")
                , wombat = this;
            if (orig_getter) {
                var new_getter = function overridePropExtractNewGetter() {
                    var obj = wombat.proxyToObj(this)
                        , $win = this.defaultView;
                    if ($win === $win.__WB_replay_top)
                        return "";
                    var res = orig_getter.call(obj);
                    return wombat.extractOriginalURL(res)
                };
                this.defGetterProp($document, "referrer", new_getter)
            }
        }
        ,
        Wombat.prototype.overridePropToProxy = function (proto, prop) {
            var orig_getter = this.getOrigGetter(proto, prop);
            if (orig_getter) {
                var wombat = this
                    , new_getter = function overridePropToProxyNewGetter() {
                        return wombat.objToProxy(orig_getter.call(this))
                    };
                this.defGetterProp(proto, prop, new_getter)
            }
        }
        ,
        Wombat.prototype.overrideHistoryFunc = function (funcName) {
            if (!this.$wbwindow.history)
                return undefined;
            var orig_func = this.$wbwindow.history[funcName];
            if (!orig_func)
                return undefined;
            this.$wbwindow.history["_orig_" + funcName] = orig_func,
                this.$wbwindow.history.___wb_ownWindow = this.$wbwindow;
            var wombat = this
                , rewrittenFunc = function histNewFunc(stateObj, title, url) {
                    var rewritten_url, resolvedURL, historyWin = this.___wb_ownWindow || wombat.$wbwindow, wombatLocation = historyWin.WB_wombat_location;
                    if (url) {
                        var parser = wombat._makeURLParser(url, historyWin.document);
                        if (resolvedURL = parser.href,
                            rewritten_url = wombat.rewriteUrl(resolvedURL),
                            resolvedURL !== wombatLocation.origin && wombatLocation.href !== "about:blank" && !wombat.startsWith(resolvedURL, wombatLocation.origin + "/"))
                            throw new DOMException("Invalid history change: " + resolvedURL)
                    } else
                        resolvedURL = wombatLocation.href;
                    orig_func.call(this, stateObj, title, rewritten_url);
                    var origTitle = historyWin.document.title;
                    wombat.WBAutoFetchWorker && historyWin.setTimeout(function () {
                        title || historyWin.document.title === origTitle || (title = historyWin.document.title),
                            wombat.WBAutoFetchWorker.fetchAsPage(rewritten_url, resolvedURL, title)
                    }, 100),
                        wombat.sendHistoryUpdate(resolvedURL, title, historyWin)
                };
            return this.$wbwindow.history[funcName] = rewrittenFunc,
                this.$wbwindow.History && this.$wbwindow.History.prototype && (this.$wbwindow.History.prototype[funcName] = rewrittenFunc),
                rewrittenFunc
        }
        ,
        Wombat.prototype.overrideStyleAttr = function (obj, attr, propName) {
            var orig_getter = this.getOrigGetter(obj, attr)
                , orig_setter = this.getOrigSetter(obj, attr)
                , wombat = this
                , setter = function overrideStyleAttrSetter(orig) {
                    var val = wombat.rewriteStyle(orig);
                    return orig_setter ? orig_setter.call(this, val) : this.setProperty(propName, val),
                        val
                }
                , getter = orig_getter;
            orig_getter || (getter = function overrideStyleAttrGetter() {
                return this.getPropertyValue(propName)
            }
            ),
                (orig_setter && orig_getter || propName) && this.defProp(obj, attr, setter, getter)
        }
        ,
        Wombat.prototype.overrideStyleSetProp = function (style_proto) {
            var orig_setProp = style_proto.setProperty
                , wombat = this;
            style_proto.setProperty = function rwSetProperty(name, value, priority) {
                var rwvalue = wombat.rewriteStyle(value);
                return orig_setProp.call(this, name, rwvalue, priority)
            }
        }
        ,
        Wombat.prototype.overrideAnchorAreaElem = function (whichObj) {
            if (whichObj && whichObj.prototype) {
                for (var prop, originalGetSets = {}, originalProto = whichObj.prototype, anchorAreaSetter = function anchorAreaSetter(prop, value) {
                    var func = originalGetSets["set_" + prop];
                    return func ? func.call(this, value) : ""
                }, anchorAreaGetter = function anchorAreaGetter(prop) {
                    var func = originalGetSets["get_" + prop];
                    return func ? func.call(this) : ""
                }, i = 0; i < this.URL_PROPS.length; i++)
                    prop = this.URL_PROPS[i],
                        originalGetSets["get_" + prop] = this.getOrigGetter(originalProto, prop),
                        originalGetSets["set_" + prop] = this.getOrigSetter(originalProto, prop),
                        Object.defineProperty && this.defProp(originalProto, prop, this.makeSetLocProp(prop, anchorAreaSetter, anchorAreaGetter), this.makeGetLocProp(prop, anchorAreaGetter), true);
                originalProto.toString = function toString() {
                    return this.href
                }
            }
        }
        ,
        Wombat.prototype.overrideHtmlAssign = function (elem, prop, rewriteGetter) {
            if (this.$wbwindow.DOMParser && elem && elem.prototype) {
                var obj = elem.prototype
                    , orig_getter = this.getOrigGetter(obj, prop)
                    , orig_setter = this.getOrigSetter(obj, prop);
                if (orig_setter) {
                    var rewriteFn = this.rewriteHTMLAssign
                        , setter = function overrideHTMLAssignSetter(orig) {
                            return rewriteFn(this, orig_setter, orig)
                        }
                        , wb_unrewrite_rx = this.wb_unrewrite_rx
                        , getter = function overrideHTMLAssignGetter() {
                            var res = orig_getter.call(this);
                            return this._no_rewrite ? res : res.replace(wb_unrewrite_rx, "")
                        };
                    this.defProp(obj, prop, setter, rewriteGetter ? getter : orig_getter)
                }
            }
        }
        ,
        Wombat.prototype.overrideIframeContentAccess = function (prop) {
            if (this.$wbwindow.HTMLIFrameElement && this.$wbwindow.HTMLIFrameElement.prototype) {
                var obj = this.$wbwindow.HTMLIFrameElement.prototype
                    , orig_getter = this.getOrigGetter(obj, prop);
                if (orig_getter) {
                    var orig_setter = this.getOrigSetter(obj, prop)
                        , wombat = this
                        , getter = function overrideIframeContentAccessGetter() {
                            return wombat.initIframeWombat(this),
                                wombat.objToProxy(orig_getter.call(this))
                        };
                    this.defProp(obj, prop, orig_setter, getter),
                        obj["_get_" + prop] = orig_getter
                }
            }
        }
        ,
        Wombat.prototype.overrideFramesAccess = function ($wbwindow) {
            if (!($wbwindow.Proxy && $wbwindow === $wbwindow.frames)) {
                $wbwindow.__wb_frames = $wbwindow.frames;
                var wombat = this
                    , getter = function overrideFramesAccessGetter() {
                        for (var i = 0; i < this.__wb_frames.length; i++)
                            try {
                                wombat.initNewWindowWombat(this.__wb_frames[i])
                            } catch (e) { }
                        return this.__wb_frames
                    };
                this.defGetterProp($wbwindow, "frames", getter),
                    this.defGetterProp($wbwindow.Window.prototype, "frames", getter)
            }
        }
        ,
        Wombat.prototype.overrideSWAccess = function ($wbwindow) {
            if ($wbwindow.navigator.serviceWorker && $wbwindow.navigator.serviceWorker.controller) {
                $wbwindow._WB_wombat_sw = $wbwindow.navigator.serviceWorker;
                var overrideSW = {
                    controller: null,
                    ready: Promise.resolve({
                        unregister: function () { }
                    }),
                    register: function () {
                        return Promise.reject()
                    },
                    addEventListener: function () { },
                    removeEventListener: function () { }
                };
                this.defGetterProp($wbwindow.navigator, "serviceWorker", function () {
                    return overrideSW
                })
            }
        }
        ,
        Wombat.prototype.overrideFuncThisProxyToObj = function (cls, method, obj) {
            if (cls) {
                var ovrObj = obj;
                if (!obj && cls.prototype && cls.prototype[method] ? ovrObj = cls.prototype : !obj && cls[method] && (ovrObj = cls),
                    !!ovrObj) {
                    var wombat = this
                        , orig = ovrObj[method];
                    ovrObj[method] = function deproxyThis() {
                        return orig.apply(wombat.proxyToObj(this), arguments)
                    }
                }
            }
        }
        ,
        Wombat.prototype.overrideFuncArgProxyToObj = function (cls, method, argumentIdx) {
            if (cls && cls.prototype) {
                var argIndex = argumentIdx || 0
                    , orig = cls.prototype[method];
                if (orig) {
                    var wombat = this;
                    cls.prototype[method] = function deproxyFnArg() {
                        for (var args = new Array(arguments.length), i = 0; i < args.length; i++)
                            args[i] = i === argIndex ? wombat.proxyToObj(arguments[i]) : arguments[i];
                        var thisObj = wombat.proxyToObj(this);
                        return orig.__WB_orig_apply ? orig.__WB_orig_apply(thisObj, args) : orig.apply(thisObj, args)
                    }
                }
            }
        }
        ,
        Wombat.prototype.overrideFunctionApply = function ($wbwindow) {
            if (!$wbwindow.Function.prototype.__WB_orig_apply) {
                var orig_apply = $wbwindow.Function.prototype.apply;
                $wbwindow.Function.prototype.__WB_orig_apply = orig_apply;
                var wombat = this;
                $wbwindow.Function.prototype.apply = function apply(obj, args) {
                    return wombat.isNativeFunction(this) && (obj = wombat.proxyToObj(obj),
                        args = wombat.deproxyArrayHandlingArgumentsObj(args)),
                        this.__WB_orig_apply(obj, args)
                }
                    ,
                    this.wb_funToString.apply = orig_apply
            }
        }
        ,
        Wombat.prototype.overrideFunctionBind = function ($wbwindow) {
            if (!$wbwindow.Function.prototype.__WB_orig_bind) {
                var orig_bind = $wbwindow.Function.prototype.bind;
                $wbwindow.Function.prototype.__WB_orig_bind = orig_bind;
                var wombat = this;
                $wbwindow.Function.prototype.bind = function bind(obj) {
                    var isNative = wombat.isNativeFunction(this)
                        , result = this.__WB_orig_bind.apply(this, arguments);
                    return result.__WB_is_native_func__ = isNative,
                        result
                }
            }
        }
        ,
        Wombat.prototype.overrideSrcsetAttr = function (obj, mod) {
            var prop = "srcset"
                , orig_getter = this.getOrigGetter(obj, "srcset")
                , orig_setter = this.getOrigSetter(obj, "srcset")
                , wombat = this
                , setter = function srcset(orig) {
                    var val = wombat.rewriteSrcset(orig, this);
                    if (orig_setter)
                        return orig_setter.call(this, val);
                    return wombat.wb_setAttribute ? wombat.wb_setAttribute.call(this, "srcset", val) : void 0
                }
                , getter = function srcset() {
                    var res;
                    return orig_getter ? res = orig_getter.call(this) : wombat.wb_getAttribute && (res = wombat.wb_getAttribute.call(this, "srcset")),
                        res = wombat.extractOriginalURL(res),
                        res
                };
            this.defProp(obj, "srcset", setter, getter)
        }
        ,
        Wombat.prototype.overrideHrefAttr = function (obj, mod) {
            var orig_getter = this.getOrigGetter(obj, "href")
                , orig_setter = this.getOrigSetter(obj, "href")
                , wombat = this
                , setter = function href(orig) {
                    var val;
                    return (val = mod === "cs_" && orig.indexOf("data:text/css") === 0 ? wombat.rewriteInlineStyle(orig) : this.tagName === "LINK" ? wombat.rewriteUrl(orig, false, wombat.rwModForElement(this, "href")) : wombat.rewriteUrl(orig, false, mod, this.ownerDocument),
                        orig_setter) ? orig_setter.call(this, val) : wombat.wb_setAttribute ? wombat.wb_setAttribute.call(this, "href", val) : void 0
                }
                , getter = function href() {
                    var res;
                    return orig_getter ? res = orig_getter.call(this) : wombat.wb_getAttribute && (res = wombat.wb_getAttribute.call(this, "href")),
                        this._no_rewrite ? res : wombat.extractOriginalURL(res)
                };
            this.defProp(obj, "href", setter, getter)
        }
        ,
        Wombat.prototype.overrideTextProtoGetSet = function (textProto, whichProp) {
            var setter, orig_getter = this.getOrigGetter(textProto, whichProp), wombat = this;
            if (whichProp === "data") {
                var orig_setter = this.getOrigSetter(textProto, whichProp);
                setter = function rwTextProtoSetter(orig) {
                    var res = orig;
                    return !this._no_rewrite && this.parentElement && this.parentElement.tagName === "STYLE" && (res = wombat.rewriteStyle(orig)),
                        orig_setter.call(this, res)
                }
            }
            var getter = function rwTextProtoGetter() {
                var res = orig_getter.call(this);
                return !this._no_rewrite && this.parentElement && this.parentElement.tagName === "STYLE" ? res.replace(wombat.wb_unrewrite_rx, "") : res
            };
            this.defProp(textProto, whichProp, setter, getter)
        }
        ,
        Wombat.prototype.overrideAnUIEvent = function (which) {
            var didOverrideKey = "__wb_" + which + "_overridden"
                , ConstructorFN = this.$wbwindow[which];
            if (ConstructorFN && ConstructorFN.prototype && !ConstructorFN.prototype[didOverrideKey]) {
                var wombat = this;
                this.overridePropToProxy(ConstructorFN.prototype, "view");
                var initFNKey = "init" + which;
                if (ConstructorFN.prototype[initFNKey]) {
                    var originalInitFn = ConstructorFN.prototype[initFNKey];
                    ConstructorFN.prototype[initFNKey] = function () {
                        var thisObj = wombat.proxyToObj(this);
                        if (arguments.length === 0 || arguments.length < 3)
                            return originalInitFn.__WB_orig_apply ? originalInitFn.__WB_orig_apply(thisObj, arguments) : originalInitFn.apply(thisObj, arguments);
                        for (var newArgs = new Array(arguments.length), i = 0; i < arguments.length; i++)
                            newArgs[i] = i === 3 ? wombat.proxyToObj(arguments[i]) : arguments[i];
                        return originalInitFn.__WB_orig_apply ? originalInitFn.__WB_orig_apply(thisObj, newArgs) : originalInitFn.apply(thisObj, newArgs)
                    }
                }
                this.$wbwindow[which] = function (EventConstructor) {
                    return function NewEventConstructor(type, init) {
                        return wombat.domConstructorErrorChecker(this, which, arguments),
                            init && (init.view != null && (init.view = wombat.proxyToObj(init.view)),
                                init.relatedTarget != null && (init.relatedTarget = wombat.proxyToObj(init.relatedTarget)),
                                init.target != null && (init.target = wombat.proxyToObj(init.target))),
                            new EventConstructor(type, init)
                    }
                }(ConstructorFN),
                    this.$wbwindow[which].prototype = ConstructorFN.prototype,
                    Object.defineProperty(this.$wbwindow[which].prototype, "constructor", {
                        value: this.$wbwindow[which]
                    }),
                    this.$wbwindow[which].prototype[didOverrideKey] = true
            }
        }
        ,
        Wombat.prototype.rewriteParentNodeFn = function (fnThis, originalFn, argsObj) {
            var argArr = this._no_rewrite ? argsObj : this.rewriteElementsInArguments(argsObj)
                , thisObj = this.proxyToObj(fnThis);
            return originalFn.__WB_orig_apply ? originalFn.__WB_orig_apply(thisObj, argArr) : originalFn.apply(thisObj, argArr)
        }
        ,
        Wombat.prototype.overrideParentNodeAppendPrepend = function (obj) {
            var rewriteParentNodeFn = this.rewriteParentNodeFn;
            if (obj.prototype.append) {
                var originalAppend = obj.prototype.append;
                obj.prototype.append = function append() {
                    return rewriteParentNodeFn(this, originalAppend, arguments)
                }
            }
            if (obj.prototype.prepend) {
                var originalPrepend = obj.prototype.prepend;
                obj.prototype.prepend = function prepend() {
                    return rewriteParentNodeFn(this, originalPrepend, arguments)
                }
            }
        }
        ,
        Wombat.prototype.overrideShadowDom = function () {
            this.$wbwindow.ShadowRoot && this.$wbwindow.ShadowRoot.prototype && (this.overrideHtmlAssign(this.$wbwindow.ShadowRoot, "innerHTML", true),
                this.overrideParentNodeAppendPrepend(this.$wbwindow.ShadowRoot))
        }
        ,
        Wombat.prototype.overrideChildNodeInterface = function (ifaceWithChildNode, textIface) {
            if (ifaceWithChildNode && ifaceWithChildNode.prototype) {
                var rewriteFn = textIface ? this.rewriteTextNodeFn : this.rewriteChildNodeFn;
                if (ifaceWithChildNode.prototype.before) {
                    var originalBefore = ifaceWithChildNode.prototype.before;
                    ifaceWithChildNode.prototype.before = function before() {
                        return rewriteFn(this, originalBefore, arguments)
                    }
                }
                if (ifaceWithChildNode.prototype.after) {
                    var originalAfter = ifaceWithChildNode.prototype.after;
                    ifaceWithChildNode.prototype.after = function after() {
                        return rewriteFn(this, originalAfter, arguments)
                    }
                }
                if (ifaceWithChildNode.prototype.replaceWith) {
                    var originalReplaceWith = ifaceWithChildNode.prototype.replaceWith;
                    ifaceWithChildNode.prototype.replaceWith = function replaceWith() {
                        return rewriteFn(this, originalReplaceWith, arguments)
                    }
                }
            }
        }
        ,
        Wombat.prototype.initTextNodeOverrides = function () {
            var Text = this.$wbwindow.Text;
            if (Text && Text.prototype) {
                var textProto = Text.prototype
                    , rewriteTextProtoFunction = this.rewriteTextNodeFn;
                if (textProto.appendData) {
                    var originalAppendData = textProto.appendData;
                    textProto.appendData = function appendData() {
                        return rewriteTextProtoFunction(this, originalAppendData, arguments)
                    }
                }
                if (textProto.insertData) {
                    var originalInsertData = textProto.insertData;
                    textProto.insertData = function insertData() {
                        return rewriteTextProtoFunction(this, originalInsertData, arguments)
                    }
                }
                if (textProto.replaceData) {
                    var originalReplaceData = textProto.replaceData;
                    textProto.replaceData = function replaceData() {
                        return rewriteTextProtoFunction(this, originalReplaceData, arguments)
                    }
                }
                this.overrideChildNodeInterface(Text, true),
                    this.overrideTextProtoGetSet(textProto, "data"),
                    this.overrideTextProtoGetSet(textProto, "wholeText")
            }
        }
        ,
        Wombat.prototype.initAttrOverrides = function () {
            this.overrideHrefAttr(this.$wbwindow.HTMLLinkElement.prototype, "cs_"),
                this.overrideHrefAttr(this.$wbwindow.CSSStyleSheet.prototype, "cs_"),
                this.overrideHrefAttr(this.$wbwindow.HTMLBaseElement.prototype, "mp_"),
                this.overrideSrcsetAttr(this.$wbwindow.HTMLImageElement.prototype, "im_"),
                this.overrideSrcsetAttr(this.$wbwindow.HTMLSourceElement.prototype, "oe_"),
                this.overrideAttr(this.$wbwindow.HTMLVideoElement.prototype, "poster", "im_"),
                this.overrideAttr(this.$wbwindow.HTMLAudioElement.prototype, "poster", "im_"),
                this.overrideAttr(this.$wbwindow.HTMLImageElement.prototype, "src", "im_"),
                this.overrideAttr(this.$wbwindow.HTMLInputElement.prototype, "src", "oe_"),
                this.overrideAttr(this.$wbwindow.HTMLEmbedElement.prototype, "src", "oe_"),
                this.overrideAttr(this.$wbwindow.HTMLVideoElement.prototype, "src", "oe_"),
                this.overrideAttr(this.$wbwindow.HTMLAudioElement.prototype, "src", "oe_"),
                this.overrideAttr(this.$wbwindow.HTMLSourceElement.prototype, "src", "oe_"),
                window.HTMLTrackElement && window.HTMLTrackElement.prototype && this.overrideAttr(this.$wbwindow.HTMLTrackElement.prototype, "src", "oe_"),
                this.overrideAttr(this.$wbwindow.HTMLIFrameElement.prototype, "src", "if_"),
                this.$wbwindow.HTMLFrameElement && this.$wbwindow.HTMLFrameElement.prototype && this.overrideAttr(this.$wbwindow.HTMLFrameElement.prototype, "src", "fr_"),
                this.overrideAttr(this.$wbwindow.HTMLScriptElement.prototype, "src", "js_"),
                this.overrideAttr(this.$wbwindow.HTMLObjectElement.prototype, "data", "oe_"),
                this.overrideAttr(this.$wbwindow.HTMLObjectElement.prototype, "codebase", "oe_"),
                this.overrideAttr(this.$wbwindow.HTMLMetaElement.prototype, "content", "mp_"),
                this.overrideAttr(this.$wbwindow.HTMLFormElement.prototype, "action", "mp_"),
                this.overrideAttr(this.$wbwindow.HTMLQuoteElement.prototype, "cite", "mp_"),
                this.overrideAttr(this.$wbwindow.HTMLModElement.prototype, "cite", "mp_"),
                this.overrideAnchorAreaElem(this.$wbwindow.HTMLAnchorElement),
                this.overrideAnchorAreaElem(this.$wbwindow.HTMLAreaElement);
            var style_proto = this.$wbwindow.CSSStyleDeclaration.prototype;
            if (this.$wbwindow.CSS2Properties && (style_proto = this.$wbwindow.CSS2Properties.prototype),
                this.overrideStyleAttr(style_proto, "cssText"),
                this.overrideStyleAttr(style_proto, "background", "background"),
                this.overrideStyleAttr(style_proto, "backgroundImage", "background-image"),
                this.overrideStyleAttr(style_proto, "cursor", "cursor"),
                this.overrideStyleAttr(style_proto, "listStyle", "list-style"),
                this.overrideStyleAttr(style_proto, "listStyleImage", "list-style-image"),
                this.overrideStyleAttr(style_proto, "border", "border"),
                this.overrideStyleAttr(style_proto, "borderImage", "border-image"),
                this.overrideStyleAttr(style_proto, "borderImageSource", "border-image-source"),
                this.overrideStyleAttr(style_proto, "maskImage", "mask-image"),
                this.overrideStyleSetProp(style_proto),
                this.$wbwindow.CSSStyleSheet && this.$wbwindow.CSSStyleSheet.prototype) {
                var wombat = this
                    , oInsertRule = this.$wbwindow.CSSStyleSheet.prototype.insertRule;
                this.$wbwindow.CSSStyleSheet.prototype.insertRule = function insertRule(ruleText, index) {
                    return oInsertRule.call(this, wombat.rewriteStyle(ruleText), index)
                }
            }
            this.$wbwindow.CSSRule && this.$wbwindow.CSSRule.prototype && this.overrideStyleAttr(this.$wbwindow.CSSRule.prototype, "cssText")
        }
        ,
        Wombat.prototype.initCSSOMOverrides = function () {
            var wombat = this;
            if (this.$wbwindow.CSSStyleValue) {
                var cssStyleValueOverride = function (CSSSV, which) {
                    var oFN = CSSSV[which];
                    CSSSV[which] = function parseOrParseAllOverride(property, cssText) {
                        if (cssText == null)
                            return oFN.call(this, property, cssText);
                        var rwCSSText = wombat.noExceptRewriteStyle(cssText);
                        return oFN.call(this, property, rwCSSText)
                    }
                };
                this.$wbwindow.CSSStyleValue.parse && this.$wbwindow.CSSStyleValue.parse.toString().indexOf("[native code]") > 0 && cssStyleValueOverride(this.$wbwindow.CSSStyleValue, "parse"),
                    this.$wbwindow.CSSStyleValue.parseAll && this.$wbwindow.CSSStyleValue.parseAll.toString().indexOf("[native code]") > 0 && cssStyleValueOverride(this.$wbwindow.CSSStyleValue, "parseAll")
            }
            if (this.$wbwindow.CSSKeywordValue && this.$wbwindow.CSSKeywordValue.prototype) {
                var oCSSKV = this.$wbwindow.CSSKeywordValue;
                this.$wbwindow.CSSKeywordValue = function (CSSKeywordValue_) {
                    return function CSSKeywordValue(cssValue) {
                        return wombat.domConstructorErrorChecker(this, "CSSKeywordValue", arguments),
                            new CSSKeywordValue_(wombat.rewriteStyle(cssValue))
                    }
                }(this.$wbwindow.CSSKeywordValue),
                    this.$wbwindow.CSSKeywordValue.prototype = oCSSKV.prototype,
                    Object.defineProperty(this.$wbwindow.CSSKeywordValue.prototype, "constructor", {
                        value: this.$wbwindow.CSSKeywordValue
                    }),
                    addToStringTagToClass(this.$wbwindow.CSSKeywordValue, "CSSKeywordValue")
            }
            if (this.$wbwindow.StylePropertyMap && this.$wbwindow.StylePropertyMap.prototype) {
                var originalSet = this.$wbwindow.StylePropertyMap.prototype.set;
                this.$wbwindow.StylePropertyMap.prototype.set = function set() {
                    if (arguments.length <= 1)
                        return originalSet.__WB_orig_apply ? originalSet.__WB_orig_apply(this, arguments) : originalSet.apply(this, arguments);
                    var newArgs = new Array(arguments.length);
                    newArgs[0] = arguments[0];
                    for (var i = 1; i < arguments.length; i++)
                        newArgs[i] = wombat.noExceptRewriteStyle(arguments[i]);
                    return originalSet.__WB_orig_apply ? originalSet.__WB_orig_apply(this, newArgs) : originalSet.apply(this, newArgs)
                }
                    ;
                var originalAppend = this.$wbwindow.StylePropertyMap.prototype.append;
                this.$wbwindow.StylePropertyMap.prototype.append = function append() {
                    if (arguments.length <= 1)
                        return originalSet.__WB_orig_apply ? originalAppend.__WB_orig_apply(this, arguments) : originalAppend.apply(this, arguments);
                    var newArgs = new Array(arguments.length);
                    newArgs[0] = arguments[0];
                    for (var i = 1; i < arguments.length; i++)
                        newArgs[i] = wombat.noExceptRewriteStyle(arguments[i]);
                    return originalAppend.__WB_orig_apply ? originalAppend.__WB_orig_apply(this, newArgs) : originalAppend.apply(this, newArgs)
                }
            }
        }
        ,
        Wombat.prototype.initAudioOverride = function () {
            if (this.$wbwindow.Audio) {
                var orig_audio = this.$wbwindow.Audio
                    , wombat = this;
                this.$wbwindow.Audio = function (Audio_) {
                    return function Audio(url) {
                        return wombat.domConstructorErrorChecker(this, "Audio"),
                            new Audio_(wombat.rewriteUrl(url, true, "oe_"))
                    }
                }(this.$wbwindow.Audio),
                    this.$wbwindow.Audio.prototype = orig_audio.prototype,
                    Object.defineProperty(this.$wbwindow.Audio.prototype, "constructor", {
                        value: this.$wbwindow.Audio
                    }),
                    addToStringTagToClass(this.$wbwindow.Audio, "HTMLAudioElement")
            }
        }
        ,
        Wombat.prototype.initBadPrefixes = function (prefix) {
            this.BAD_PREFIXES = ["http:" + prefix, "https:" + prefix, "http:/" + prefix, "https:/" + prefix]
        }
        ,
        Wombat.prototype.initCryptoRandom = function () {
            if (this.$wbwindow.crypto && this.$wbwindow.Crypto) {
                var wombat = this
                    , new_getrandom = function getRandomValues(array) {
                        for (var i = 0; i < array.length; i++)
                            array[i] = parseInt(wombat.$wbwindow.Math.random() * 4294967296);
                        return array
                    };
                this.$wbwindow.Crypto.prototype.getRandomValues = new_getrandom,
                    this.$wbwindow.crypto.getRandomValues = new_getrandom
            }
        }
        ,
        Wombat.prototype.initDateOverride = function (timestamp) {
            if (!this.$wbwindow.__wb_Date_now) {
                var newTimestamp = parseInt(timestamp) * 1e3
                    , timezone = 0
                    , start_now = this.$wbwindow.Date.now()
                    , timediff = start_now - (newTimestamp - timezone)
                    , orig_date = this.$wbwindow.Date
                    , orig_utc = this.$wbwindow.Date.UTC
                    , orig_parse = this.$wbwindow.Date.parse
                    , orig_now = this.$wbwindow.Date.now;
                this.$wbwindow.__wb_Date_now = orig_now,
                    this.$wbwindow.Date = function (Date_) {
                        return function Date(A, B, C, D, E, F, G) {
                            return A === undefined ? new Date_(orig_now() - timediff) : B === undefined ? new Date_(A) : C === undefined ? new Date_(A, B) : D === undefined ? new Date_(A, B, C) : E === undefined ? new Date_(A, B, C, D) : F === undefined ? new Date_(A, B, C, D, E) : G === undefined ? new Date_(A, B, C, D, E, F) : new Date_(A, B, C, D, E, F, G)
                        }
                    }(this.$wbwindow.Date),
                    this.$wbwindow.Date.prototype = orig_date.prototype,
                    this.$wbwindow.Date.now = function now() {
                        return orig_now() - timediff
                    }
                    ,
                    this.$wbwindow.Date.UTC = orig_utc,
                    this.$wbwindow.Date.parse = orig_parse,
                    this.$wbwindow.Date.__WB_timediff = timediff,
                    this.$wbwindow.Date.prototype.getTimezoneOffset = function () {
                        return 0
                    }
                    ;
                var orig_toString = this.$wbwindow.Date.prototype.toString;
                this.$wbwindow.Date.prototype.toString = function () {
                    var string = orig_toString.call(this).split(" GMT")[0];
                    return string + " GMT+0000 (Coordinated Universal Time)"
                }
                    ;
                var orig_toTimeString = this.$wbwindow.Date.prototype.toTimeString;
                this.$wbwindow.Date.prototype.toTimeString = function () {
                    var string = orig_toTimeString.call(this).split(" GMT")[0];
                    return string + " GMT+0000 (Coordinated Universal Time)"
                }
                    ,
                    Object.defineProperty(this.$wbwindow.Date.prototype, "constructor", {
                        value: this.$wbwindow.Date
                    })
            }
        }
        ,
        Wombat.prototype.initBlobOverride = function () {
            if (this.$wbwindow.Blob && !this.wb_info.isSW) {
                var orig_blob = this.$wbwindow.Blob
                    , wombat = this;
                this.$wbwindow.Blob = function (Blob_) {
                    return function Blob(array, options) {
                        return (options && options.type === "application/xhtml+xml" || options.type === "text/html") && array.length === 1 && typeof array[0] === "string" && wombat.startsWith(array[0], "<!DOCTYPE html>") && (array[0] = wombat.rewriteHtml(array[0]),
                            options.type = "text/html"),
                            new Blob_(array, options)
                    }
                }(this.$wbwindow.Blob),
                    this.$wbwindow.Blob.prototype = orig_blob.prototype
            }
        }
        ,
        Wombat.prototype.initDocTitleOverride = function () {
            var orig_get_title = this.getOrigGetter(this.$wbwindow.document, "title")
                , orig_set_title = this.getOrigSetter(this.$wbwindow.document, "title")
                , wombat = this
                , set_title = function title(value) {
                    var res = orig_set_title.call(this, value)
                        , message = {
                            wb_type: "title",
                            title: value
                        };
                    return wombat.sendTopMessage(message),
                        res
                };
            this.defProp(this.$wbwindow.document, "title", set_title, orig_get_title)
        }
        ,
        Wombat.prototype.initFontFaceOverride = function () {
            if (this.$wbwindow.FontFace) {
                var wombat = this
                    , origFontFace = this.$wbwindow.FontFace;
                this.$wbwindow.FontFace = function (FontFace_) {
                    return function FontFace(family, source, descriptors) {
                        wombat.domConstructorErrorChecker(this, "FontFace", arguments, 2);
                        var rwSource = source;
                        return source != null && (typeof source === "string" ? rwSource = wombat.rewriteInlineStyle(source) : rwSource = wombat.rewriteInlineStyle(source.toString())),
                            new FontFace_(family, rwSource, descriptors)
                    }
                }(this.$wbwindow.FontFace),
                    this.$wbwindow.FontFace.prototype = origFontFace.prototype,
                    Object.defineProperty(this.$wbwindow.FontFace.prototype, "constructor", {
                        value: this.$wbwindow.FontFace
                    }),
                    addToStringTagToClass(this.$wbwindow.FontFace, "FontFace")
            }
        }
        ,
        Wombat.prototype.initFixedRatio = function () {
            try {
                this.$wbwindow.devicePixelRatio = 1
            } catch (e) { }
            if (Object.defineProperty)
                try {
                    Object.defineProperty(this.$wbwindow, "devicePixelRatio", {
                        value: 1,
                        writable: false
                    })
                } catch (e) { }
        }
        ,
        Wombat.prototype.initPaths = function (wbinfo) {
            wbinfo.wombat_opts = wbinfo.wombat_opts || {},
                Object.assign(this.wb_info, wbinfo),
                this.wb_opts = wbinfo.wombat_opts,
                this.wb_replay_prefix = wbinfo.prefix,
                this.wb_is_proxy = wbinfo.proxy_magic || !this.wb_replay_prefix,
                this.wb_info.top_host = this.wb_info.top_host || "*",
                this.wb_curr_host = this.$wbwindow.location.protocol + "//" + this.$wbwindow.location.host,
                this.wb_info.wombat_opts = this.wb_info.wombat_opts || {},
                this.wb_orig_scheme = wbinfo.wombat_scheme + "://",
                this.wb_orig_origin = this.wb_orig_scheme + wbinfo.wombat_host,
                this.wb_abs_prefix = this.wb_replay_prefix,
                this.wb_capture_date_part = !wbinfo.is_live && wbinfo.wombat_ts ? "/" + wbinfo.wombat_ts + "/" : "",
                this.initBadPrefixes(this.wb_replay_prefix),
                this.initCookiePreset()
        }
        ,
        Wombat.prototype.initSeededRandom = function (seed) {
            this.$wbwindow.Math.seed = parseInt(seed);
            var wombat = this;
            this.$wbwindow.Math.random = function random() {
                return wombat.$wbwindow.Math.seed = (wombat.$wbwindow.Math.seed * 9301 + 49297) % 233280,
                    wombat.$wbwindow.Math.seed / 233280
            }
        }
        ,
        Wombat.prototype.initHistoryOverrides = function () {
            this.overrideHistoryFunc("pushState"),
                this.overrideHistoryFunc("replaceState");
            var wombat = this;
            this.$wbwindow.addEventListener("popstate", function (event) {
                wombat.sendHistoryUpdate(wombat.$wbwindow.WB_wombat_location.href, wombat.$wbwindow.document.title)
            })
        }
        ,
        Wombat.prototype.initCookiePreset = function () {
            if (this.wb_info.presetCookie)
                for (var splitCookies = this.wb_info.presetCookie.split(";"), i = 0; i < splitCookies.length; i++)
                    this.$wbwindow.document.cookie = splitCookies[i].trim()
        }
        ,
        Wombat.prototype.initHTTPOverrides = function () {
            var wombat = this;
            if (!this.wb_info.isSW && this.$wbwindow.XMLHttpRequest.prototype.open) {
                var origXMLHttpOpen = this.$wbwindow.XMLHttpRequest.prototype.open;
                this.utilFns.XHRopen = origXMLHttpOpen,
                    this.utilFns.XHRsend = this.$wbwindow.XMLHttpRequest.prototype.send,
                    this.$wbwindow.XMLHttpRequest.prototype.open = function open(method, url, async, user, password) {
                        var rwURL = this._no_rewrite ? url : wombat.rewriteUrl(url)
                            , openAsync = true;
                        async == null || async || (openAsync = false),
                            origXMLHttpOpen.call(this, method, rwURL, openAsync, user, password),
                            wombat.startsWith(rwURL, "data:") || this.setRequestHeader("X-Pywb-Requested-With", "XMLHttpRequest")
                    }
            }
            if (this.overridePropExtract(this.$wbwindow.XMLHttpRequest.prototype, "responseURL"),
                this.wb_info.isSW) {
                function jsonToQueryString(json) {
                    if (typeof json === "string")
                        try {
                            json = JSON.parse(json)
                        } catch (e) {
                            json = {}
                        }
                    var q = new URLSearchParams;
                    try {
                        JSON.stringify(json, function (k, v) {
                            return ["object", "function"].includes(typeof v) || q.set(k, v),
                                v
                        })
                    } catch (e) { }
                    return "__wb_post=1&" + q.toString()
                }
                function mfdToQueryString(mfd, contentType) {
                    var params = new URLSearchParams;
                    try {
                        for (var m, boundary = contentType.split("boundary=")[1], parts = mfd.split(new RegExp("-*" + boundary + "-*", "mi")), i = 0; i < parts.length; i++)
                            m = parts[i].trim().match(/name="([^"]+)"\r\n\r\n(.*)/mi),
                                m && params.set(m[1], m[2])
                    } catch (e) { }
                    return params.toString()
                }
                var origOpen = this.$wbwindow.XMLHttpRequest.prototype.open
                    , origSetRequestHeader = this.$wbwindow.XMLHttpRequest.prototype.setRequestHeader
                    , origSend = this.$wbwindow.XMLHttpRequest.prototype.send;
                this.utilFns.XHRopen = origOpen,
                    this.utilFns.XHRsend = origSend,
                    this.$wbwindow.XMLHttpRequest.prototype.open = function () {
                        this.__WB_xhr_open_arguments = arguments,
                            this.__WB_xhr_headers = new Headers
                    }
                    ,
                    this.$wbwindow.XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
                        this.__WB_xhr_headers.set(name, value)
                    }
                    ;
                var wombat = this;
                this.$wbwindow.XMLHttpRequest.prototype.send = function (value) {
                    if (this.__WB_xhr_open_arguments[0] === "POST") {
                        var contentType = this.__WB_xhr_headers.get("Content-Type");
                        typeof value === "string" && contentType === "application/x-www-form-urlencoded" || value instanceof URLSearchParams ? (this.__WB_xhr_open_arguments[0] = "GET",
                            this.__WB_xhr_open_arguments[1] += (this.__WB_xhr_open_arguments[1].indexOf("?") > 0 ? "&" : "?") + value.toString(),
                            value = null) : contentType === "application/json" || contentType === "text/plain" ? (this.__WB_xhr_open_arguments[0] = "GET",
                                this.__WB_xhr_open_arguments[1] += (this.__WB_xhr_open_arguments[1].indexOf("?") > 0 ? "&" : "?") + jsonToQueryString(value),
                                value = null) : wombat.startsWith(contentType, "multipart/form-data") && (this.__WB_xhr_open_arguments[0] = "GET",
                                    this.__WB_xhr_open_arguments[1] += (this.__WB_xhr_open_arguments[1].indexOf("?") > 0 ? "&" : "?") + mfdToQueryString(value, contentType))
                    }
                    if (this.__WB_xhr_open_arguments.length > 2 && (this.__WB_xhr_open_arguments[2] = true),
                        this._no_rewrite || (this.__WB_xhr_open_arguments[1] = wombat.rewriteUrl(this.__WB_xhr_open_arguments[1])),
                        origOpen.apply(this, this.__WB_xhr_open_arguments),
                        !wombat.startsWith(this.__WB_xhr_open_arguments[1], "data:")) {
                        for (const [name, value] of this.__WB_xhr_headers.entries())
                            origSetRequestHeader.call(this, name, value);
                        origSetRequestHeader.call(this, "X-Pywb-Requested-With", "XMLHttpRequest")
                    }
                    origSend.call(this, value)
                }
            }
            if (this.$wbwindow.fetch) {
                var orig_fetch = this.$wbwindow.fetch;
                this.$wbwindow.fetch = function fetch(input, init_opts) {
                    var rwInput = input
                        , inputType = typeof input;
                    if (inputType === "string")
                        rwInput = wombat.rewriteUrl(input);
                    else if (inputType === "object" && input.url) {
                        var new_url = wombat.rewriteUrl(input.url);
                        new_url !== input.url && (rwInput = new Request(new_url, init_opts))
                    } else
                        inputType === "object" && input.href && (rwInput = wombat.rewriteUrl(input.href));
                    if (init_opts || (init_opts = {}),
                        init_opts.credentials === undefined)
                        try {
                            init_opts.credentials = "include"
                        } catch (e) { }
                    return orig_fetch.call(wombat.proxyToObj(this), rwInput, init_opts)
                }
            }
            if (this.$wbwindow.Request && this.$wbwindow.Request.prototype) {
                var orig_request = this.$wbwindow.Request;
                this.$wbwindow.Request = function (Request_) {
                    return function Request(input, init_opts) {
                        wombat.domConstructorErrorChecker(this, "Request", arguments);
                        var newInitOpts = init_opts || {}
                            , newInput = input
                            , inputType = typeof input;
                        switch (inputType) {
                            case "string":
                                newInput = wombat.rewriteUrl(input);
                                break;
                            case "object":
                                if (newInput = input,
                                    input.url) {
                                    var new_url = wombat.rewriteUrl(input.url);
                                    new_url !== input.url && (newInput = new Request_(new_url, input))
                                } else
                                    input.href && (newInput = wombat.rewriteUrl(input.toString(), true));
                        }
                        return newInitOpts.credentials = "include",
                            new Request_(newInput, newInitOpts)
                    }
                }(this.$wbwindow.Request),
                    this.$wbwindow.Request.prototype = orig_request.prototype,
                    Object.defineProperty(this.$wbwindow.Request.prototype, "constructor", {
                        value: this.$wbwindow.Request
                    })
            }
            if (this.$wbwindow.Response && this.$wbwindow.Response.prototype) {
                var originalRedirect = this.$wbwindow.Response.prototype.redirect;
                this.$wbwindow.Response.prototype.redirect = function redirect(url, status) {
                    var rwURL = wombat.rewriteUrl(url, true, null, wombat.$wbwindow.document);
                    return originalRedirect.call(this, rwURL, status)
                }
            }
            if (this.$wbwindow.EventSource && this.$wbwindow.EventSource.prototype) {
                var origEventSource = this.$wbwindow.EventSource;
                this.$wbwindow.EventSource = function (EventSource_) {
                    return function EventSource(url, configuration) {
                        wombat.domConstructorErrorChecker(this, "EventSource", arguments);
                        var rwURL = url;
                        return url != null && (rwURL = wombat.rewriteUrl(url)),
                            new EventSource_(rwURL, configuration)
                    }
                }(this.$wbwindow.EventSource),
                    this.$wbwindow.EventSource.prototype = origEventSource.prototype,
                    Object.defineProperty(this.$wbwindow.EventSource.prototype, "constructor", {
                        value: this.$wbwindow.EventSource
                    }),
                    addToStringTagToClass(this.$wbwindow.EventSource, "EventSource")
            }
            if (this.$wbwindow.WebSocket && this.$wbwindow.WebSocket.prototype) {
                var origWebSocket = this.$wbwindow.WebSocket;
                this.$wbwindow.WebSocket = function (WebSocket_) {
                    return function WebSocket(url, configuration) {
                        wombat.domConstructorErrorChecker(this, "WebSocket", arguments);
                        var rwURL = url;
                        return url != null && (rwURL = wombat.rewriteWSURL(url)),
                            new WebSocket_(rwURL, configuration)
                    }
                }(this.$wbwindow.WebSocket),
                    this.$wbwindow.WebSocket.prototype = origWebSocket.prototype,
                    Object.defineProperty(this.$wbwindow.WebSocket.prototype, "constructor", {
                        value: this.$wbwindow.WebSocket
                    }),
                    addToStringTagToClass(this.$wbwindow.WebSocket, "WebSocket")
            }
        }
        ,
        Wombat.prototype.initElementGetSetAttributeOverride = function () {
            if (!this.wb_opts.skip_setAttribute && this.$wbwindow.Element && this.$wbwindow.Element.prototype) {
                var wombat = this
                    , ElementProto = this.$wbwindow.Element.prototype;
                if (ElementProto.setAttribute) {
                    var orig_setAttribute = ElementProto.setAttribute;
                    ElementProto._orig_setAttribute = orig_setAttribute,
                        ElementProto.setAttribute = function setAttribute(name, value) {
                            var rwValue = value;
                            if (name && typeof rwValue === "string") {
                                var lowername = name.toLowerCase();
                                if (this.tagName === "LINK" && lowername === "href" && rwValue.indexOf("data:text/css") === 0)
                                    rwValue = wombat.rewriteInlineStyle(value);
                                else if (lowername === "style")
                                    rwValue = wombat.rewriteStyle(value);
                                else if (lowername === "srcset")
                                    rwValue = wombat.rewriteSrcset(value, this);
                                else {
                                    var shouldRW = wombat.shouldRewriteAttr(this.tagName, lowername);
                                    shouldRW && (wombat.removeWBOSRC(this),
                                        !this._no_rewrite && (rwValue = wombat.rewriteUrl(value, false, wombat.rwModForElement(this, lowername))))
                                }
                            }
                            return orig_setAttribute.call(this, name, rwValue)
                        }
                }
                if (ElementProto.getAttribute) {
                    var orig_getAttribute = ElementProto.getAttribute;
                    this.wb_getAttribute = orig_getAttribute,
                        ElementProto.getAttribute = function getAttribute(name) {
                            var result = orig_getAttribute.call(this, name);
                            if (result === null)
                                return result;
                            var lowerName = name;
                            if (name && (lowerName = name.toLowerCase()),
                                wombat.shouldRewriteAttr(this.tagName, lowerName)) {
                                var maybeWBOSRC = wombat.retrieveWBOSRC(this);
                                return maybeWBOSRC ? maybeWBOSRC : wombat.extractOriginalURL(result)
                            }
                            return wombat.startsWith(lowerName, "data-") && wombat.startsWithOneOf(result, wombat.wb_prefixes) ? wombat.extractOriginalURL(result) : result
                        }
                }
            }
        }
        ,
        Wombat.prototype.initSvgImageOverrides = function () {
            if (this.$wbwindow.SVGImageElement) {
                var svgImgProto = this.$wbwindow.SVGImageElement.prototype
                    , orig_getAttr = svgImgProto.getAttribute
                    , orig_getAttrNS = svgImgProto.getAttributeNS
                    , orig_setAttr = svgImgProto.setAttribute
                    , orig_setAttrNS = svgImgProto.setAttributeNS
                    , wombat = this;
                svgImgProto.getAttribute = function getAttribute(name) {
                    var value = orig_getAttr.call(this, name);
                    return name.indexOf("xlink:href") >= 0 || name === "href" ? wombat.extractOriginalURL(value) : value
                }
                    ,
                    svgImgProto.getAttributeNS = function getAttributeNS(ns, name) {
                        var value = orig_getAttrNS.call(this, ns, name);
                        return name.indexOf("xlink:href") >= 0 || name === "href" ? wombat.extractOriginalURL(value) : value
                    }
                    ,
                    svgImgProto.setAttribute = function setAttribute(name, value) {
                        var rwValue = value;
                        return (name.indexOf("xlink:href") >= 0 || name === "href") && (rwValue = wombat.rewriteUrl(value)),
                            orig_setAttr.call(this, name, rwValue)
                    }
                    ,
                    svgImgProto.setAttributeNS = function setAttributeNS(ns, name, value) {
                        var rwValue = value;
                        return (name.indexOf("xlink:href") >= 0 || name === "href") && (rwValue = wombat.rewriteUrl(value)),
                            orig_setAttrNS.call(this, ns, name, rwValue)
                    }
            }
        }
        ,
        Wombat.prototype.initCreateElementNSFix = function () {
            if (this.$wbwindow.document.createElementNS && this.$wbwindow.Document.prototype.createElementNS) {
                var orig_createElementNS = this.$wbwindow.document.createElementNS
                    , wombat = this
                    , createElementNS = function createElementNS(namespaceURI, qualifiedName) {
                        return orig_createElementNS.call(wombat.proxyToObj(this), wombat.extractOriginalURL(namespaceURI), qualifiedName)
                    };
                this.$wbwindow.Document.prototype.createElementNS = createElementNS,
                    this.$wbwindow.document.createElementNS = createElementNS
            }
        }
        ,
        Wombat.prototype.initInsertAdjacentElementHTMLOverrides = function () {
            var Element = this.$wbwindow.Element;
            if (Element && Element.prototype) {
                var elementProto = Element.prototype
                    , rewriteFn = this.rewriteInsertAdjHTMLOrElemArgs;
                if (elementProto.insertAdjacentHTML) {
                    var origInsertAdjacentHTML = elementProto.insertAdjacentHTML;
                    elementProto.insertAdjacentHTML = function insertAdjacentHTML(position, text) {
                        return rewriteFn(this, origInsertAdjacentHTML, position, text, true)
                    }
                }
                if (elementProto.insertAdjacentElement) {
                    var origIAdjElem = elementProto.insertAdjacentElement;
                    elementProto.insertAdjacentElement = function insertAdjacentElement(position, element) {
                        return rewriteFn(this, origIAdjElem, position, element, false)
                    }
                }
            }
        }
        ,
        Wombat.prototype.initDomOverride = function () {
            var Node = this.$wbwindow.Node;
            if (Node && Node.prototype) {
                var rewriteFn = this.rewriteNodeFuncArgs;
                if (Node.prototype.appendChild) {
                    var originalAppendChild = Node.prototype.appendChild;
                    Node.prototype.appendChild = function appendChild(newNode, oldNode) {
                        return rewriteFn(this, originalAppendChild, newNode, oldNode)
                    }
                }
                if (Node.prototype.insertBefore) {
                    var originalInsertBefore = Node.prototype.insertBefore;
                    Node.prototype.insertBefore = function insertBefore(newNode, oldNode) {
                        return rewriteFn(this, originalInsertBefore, newNode, oldNode)
                    }
                }
                if (Node.prototype.replaceChild) {
                    var originalReplaceChild = Node.prototype.replaceChild;
                    Node.prototype.replaceChild = function replaceChild(newNode, oldNode) {
                        return rewriteFn(this, originalReplaceChild, newNode, oldNode)
                    }
                }
                this.overridePropToProxy(Node.prototype, "ownerDocument"),
                    this.overridePropToProxy(this.$wbwindow.HTMLHtmlElement.prototype, "parentNode"),
                    this.overridePropToProxy(this.$wbwindow.Event.prototype, "target")
            }
            this.$wbwindow.Element && this.$wbwindow.Element.prototype && (this.overrideParentNodeAppendPrepend(this.$wbwindow.Element),
                this.overrideChildNodeInterface(this.$wbwindow.Element, false)),
                this.$wbwindow.DocumentFragment && this.$wbwindow.DocumentFragment.prototype && this.overrideParentNodeAppendPrepend(this.$wbwindow.DocumentFragment)
        }
        ,
        Wombat.prototype.initDocOverrides = function ($document) {
            if (Object.defineProperty) {
                this.overrideReferrer($document),
                    this.defGetterProp($document, "origin", function origin() {
                        return this.WB_wombat_location.origin
                    }),
                    this.defGetterProp(this.$wbwindow, "origin", function origin() {
                        return this.WB_wombat_location.origin
                    });
                var wombat = this
                    , domain_setter = function domain(val) {
                        var loc = this.WB_wombat_location;
                        loc && wombat.endsWith(loc.hostname, val) && (this.__wb_domain = val)
                    }
                    , domain_getter = function domain() {
                        return this.__wb_domain || this.WB_wombat_location.hostname
                    };
                this.defProp($document, "domain", domain_setter, domain_getter)
            }
        }
        ,
        Wombat.prototype.initDocWriteOpenCloseOverride = function () {
            if (this.$wbwindow.DOMParser) {
                var DocumentProto = this.$wbwindow.Document.prototype
                    , $wbDocument = this.$wbwindow.document
                    , docWriteWritelnRWFn = this.rewriteDocWriteWriteln
                    , orig_doc_write = $wbDocument.write
                    , new_write = function write() {
                        return docWriteWritelnRWFn(this, orig_doc_write, arguments)
                    };
                $wbDocument.write = new_write,
                    DocumentProto.write = new_write;
                var orig_doc_writeln = $wbDocument.writeln
                    , new_writeln = function writeln() {
                        return docWriteWritelnRWFn(this, orig_doc_writeln, arguments)
                    };
                $wbDocument.writeln = new_writeln,
                    DocumentProto.writeln = new_writeln;
                var wombat = this
                    , orig_doc_open = $wbDocument.open
                    , new_open = function open() {
                        var res, thisObj = wombat.proxyToObj(this);
                        if (arguments.length === 3) {
                            var rwUrl = wombat.rewriteUrl(arguments[0], false, "mp_");
                            res = orig_doc_open.call(thisObj, rwUrl, arguments[1], arguments[2]),
                                wombat.initNewWindowWombat(res, arguments[0])
                        } else
                            res = orig_doc_open.call(thisObj),
                                wombat.initNewWindowWombat(thisObj.defaultView);
                        return res
                    };
                $wbDocument.open = new_open,
                    DocumentProto.open = new_open;
                var originalClose = $wbDocument.close
                    , newClose = function close() {
                        var thisObj = wombat.proxyToObj(this);
                        return wombat.initNewWindowWombat(thisObj.defaultView),
                            originalClose.__WB_orig_apply ? originalClose.__WB_orig_apply(thisObj, arguments) : originalClose.apply(thisObj, arguments)
                    };
                $wbDocument.close = newClose,
                    DocumentProto.close = newClose;
                var oBodyGetter = this.getOrigGetter(DocumentProto, "body")
                    , oBodySetter = this.getOrigSetter(DocumentProto, "body");
                oBodyGetter && oBodySetter && this.defProp(DocumentProto, "body", function body(newBody) {
                    return newBody && (newBody instanceof HTMLBodyElement || newBody instanceof HTMLFrameSetElement) && wombat.rewriteElemComplete(newBody),
                        oBodySetter.call(wombat.proxyToObj(this), newBody)
                }, oBodyGetter)
            }
        }
        ,
        Wombat.prototype.initIframeWombat = function (iframe) {
            var win;
            win = iframe._get_contentWindow ? iframe._get_contentWindow.call(iframe) : iframe.contentWindow;
            try {
                if (!win || win === this.$wbwindow || win._skip_wombat || win._wb_wombat)
                    return
            } catch (e) {
                return
            }
            var src = iframe.src;
            this.initNewWindowWombat(win, src)
        }
        ,
        Wombat.prototype.initNewWindowWombat = function (win, src) {
            var fullWombat = false;
            if (win && !win._wb_wombat) {
                if ((!src || src === "" || this.startsWithOneOf(src, ["about:blank", "javascript:"])) && (fullWombat = true),
                    !fullWombat && this.wb_info.isSW) {
                    var origURL = this.extractOriginalURL(src);
                    (origURL === "about:blank" || origURL.startsWith("srcdoc:") || origURL.startsWith("blob:")) && (fullWombat = true)
                }
                if (fullWombat) {
                    var newInfo = {};
                    Object.assign(newInfo, this.wb_info);
                    var wombat = new Wombat(win, newInfo);
                    win._wb_wombat = wombat.wombatInit()
                } else
                    this.initProtoPmOrigin(win),
                        this.initPostMessageOverride(win),
                        this.initMessageEventOverride(win),
                        this.initCheckThisFunc(win)
            }
        }
        ,
        Wombat.prototype.initTimeoutIntervalOverrides = function () {
            var rewriteFn = this.rewriteSetTimeoutInterval;
            if (this.$wbwindow.setTimeout && !this.$wbwindow.setTimeout.__$wbpatched$__) {
                var originalSetTimeout = this.$wbwindow.setTimeout;
                this.$wbwindow.setTimeout = function setTimeout() {
                    return rewriteFn(this, originalSetTimeout, arguments)
                }
                    ,
                    this.$wbwindow.setTimeout.__$wbpatched$__ = true
            }
            if (this.$wbwindow.setInterval && !this.$wbwindow.setInterval.__$wbpatched$__) {
                var originalSetInterval = this.$wbwindow.setInterval;
                this.$wbwindow.setInterval = function setInterval() {
                    return rewriteFn(this, originalSetInterval, arguments)
                }
                    ,
                    this.$wbwindow.setInterval.__$wbpatched$__ = true
            }
        }
        ,
        Wombat.prototype.initWorkerOverrides = function () {
            var wombat = this;
            if (this.$wbwindow.Worker && !this.$wbwindow.Worker._wb_worker_overriden) {
                var orig_worker = this.$wbwindow.Worker;
                this.$wbwindow.Worker = function (Worker_) {
                    return function Worker(url, options) {
                        return wombat.domConstructorErrorChecker(this, "Worker", arguments),
                            new Worker_(wombat.rewriteWorker(url), options)
                    }
                }(orig_worker),
                    this.$wbwindow.Worker.prototype = orig_worker.prototype,
                    Object.defineProperty(this.$wbwindow.Worker.prototype, "constructor", {
                        value: this.$wbwindow.Worker
                    }),
                    this.$wbwindow.Worker._wb_worker_overriden = true
            }
            if (this.$wbwindow.SharedWorker && !this.$wbwindow.SharedWorker.__wb_sharedWorker_overriden) {
                var oSharedWorker = this.$wbwindow.SharedWorker;
                this.$wbwindow.SharedWorker = function (SharedWorker_) {
                    return function SharedWorker(url, options) {
                        return wombat.domConstructorErrorChecker(this, "SharedWorker", arguments),
                            new SharedWorker_(wombat.rewriteWorker(url), options)
                    }
                }(oSharedWorker),
                    this.$wbwindow.SharedWorker.prototype = oSharedWorker.prototype,
                    Object.defineProperty(this.$wbwindow.SharedWorker.prototype, "constructor", {
                        value: this.$wbwindow.SharedWorker
                    }),
                    this.$wbwindow.SharedWorker.__wb_sharedWorker_overriden = true
            }
            if (this.$wbwindow.ServiceWorkerContainer && this.$wbwindow.ServiceWorkerContainer.prototype && this.$wbwindow.ServiceWorkerContainer.prototype.register) {
                var orig_register = this.$wbwindow.ServiceWorkerContainer.prototype.register;
                this.$wbwindow.ServiceWorkerContainer.prototype.register = function register(scriptURL, options) {
                    var newScriptURL = new URL(scriptURL, wombat.$wbwindow.document.baseURI).href
                        , mod = wombat.getPageUnderModifier();
                    return options && options.scope ? options.scope = wombat.rewriteUrl(options.scope, false, mod) : options = {
                        scope: wombat.rewriteUrl("/", false, mod)
                    },
                        orig_register.call(this, wombat.rewriteUrl(newScriptURL, false, "sw_"), options)
                }
            }
            if (this.$wbwindow.Worklet && this.$wbwindow.Worklet.prototype && this.$wbwindow.Worklet.prototype.addModule && !this.$wbwindow.Worklet.__wb_workerlet_overriden) {
                var oAddModule = this.$wbwindow.Worklet.prototype.addModule;
                this.$wbwindow.Worklet.prototype.addModule = function addModule(moduleURL, options) {
                    var rwModuleURL = wombat.rewriteUrl(moduleURL, false, "js_");
                    return oAddModule.call(this, rwModuleURL, options)
                }
                    ,
                    this.$wbwindow.Worklet.__wb_workerlet_overriden = true
            }
        }
        ,
        Wombat.prototype.initLocOverride = function (loc, oSetter, oGetter) {
            if (Object.defineProperty)
                for (var prop, i = 0; i < this.URL_PROPS.length; i++)
                    prop = this.URL_PROPS[i],
                        this.defProp(loc, prop, this.makeSetLocProp(prop, oSetter, oGetter), this.makeGetLocProp(prop, oGetter), true)
        }
        ,
        Wombat.prototype.initWombatLoc = function (win) {
            if (!(!win || win.WB_wombat_location && win.document.WB_wombat_location)) {
                var wombat_location = new WombatLocation(win.location, this)
                    , wombat = this;
                if (Object.defineProperty) {
                    var setter = function (value) {
                        var loc = this._WB_wombat_location || this.defaultView && this.defaultView._WB_wombat_location;
                        loc && (loc.href = value),
                            win.location = wombat.rewriteUrl(value)
                    }
                        , getter = function () {
                            return this._WB_wombat_location || this.defaultView && this.defaultView._WB_wombat_location || this.location
                        };
                    this.defProp(win.Object.prototype, "WB_wombat_location", setter, getter),
                        this.initProtoPmOrigin(win),
                        win._WB_wombat_location = wombat_location
                } else
                    win.WB_wombat_location = wombat_location,
                        setTimeout(this.checkAllLocations, 500),
                        setInterval(this.checkAllLocations, 500)
            }
        }
        ,
        Wombat.prototype.initProtoPmOrigin = function (win) {
            if (!win.Object.prototype.__WB_pmw) {
                var pm_origin = function pm_origin(origin_window) {
                    return this.__WB_source = origin_window,
                        this
                };
                try {
                    win.Object.defineProperty(win.Object.prototype, "__WB_pmw", {
                        get: function () {
                            return pm_origin
                        },
                        set: function () { },
                        configurable: true,
                        enumerable: false
                    })
                } catch (e) { }
                win.__WB_check_loc = function (loc) {
                    return loc instanceof Location || loc instanceof WombatLocation ? this.WB_wombat_location : {}
                }
            }
        }
        ,
        Wombat.prototype.initCheckThisFunc = function (win) {
            try {
                win.Object.prototype[this.WB_CHECK_THIS_FUNC] || win.Object.defineProperty(win.Object.prototype, this.WB_CHECK_THIS_FUNC, {
                    configutable: false,
                    enumerable: false,
                    value: function (thisObj) {
                        return thisObj && thisObj._WB_wombat_obj_proxy ? thisObj._WB_wombat_obj_proxy : thisObj
                    }
                })
            } catch (e) { }
        }
        ,
        Wombat.prototype.overrideGetOwnPropertyNames = function (win) {
            var orig_getOwnPropertyNames = win.Object.getOwnPropertyNames
                , removeProps = [this.WB_CHECK_THIS_FUNC, "WB_wombat_location", "__WB_pmw", "WB_wombat_top", "WB_wombat_eval", "WB_wombat_runEval"];
            try {
                win.Object.defineProperty(win.Object, "getOwnPropertyNames", {
                    value: function (object) {
                        for (var foundInx, props = orig_getOwnPropertyNames(object), i = 0; i < removeProps.length; i++)
                            foundInx = props.indexOf(removeProps[i]),
                                foundInx >= 0 && props.splice(foundInx, 1);
                        return props
                    }
                })
            } catch (e) {
                console.log(e)
            }
        }
        ,
        Wombat.prototype.initHashChange = function () {
            if (this.$wbwindow.__WB_top_frame) {
                var wombat = this
                    , receive_hash_change = function receive_hash_change(event) {
                        if (event.data && event.data.from_top) {
                            var message = event.data.message;
                            message.wb_type && (message.wb_type !== "outer_hashchange" || wombat.$wbwindow.location.hash == message.hash || (wombat.$wbwindow.location.hash = message.hash))
                        }
                    }
                    , send_hash_change = function send_hash_change() {
                        var message = {
                            wb_type: "hashchange",
                            hash: wombat.$wbwindow.location.hash
                        };
                        wombat.sendTopMessage(message)
                    };
                this.$wbwindow.addEventListener("message", receive_hash_change),
                    this.$wbwindow.addEventListener("hashchange", send_hash_change)
            }
        }
        ,
        Wombat.prototype.initPostMessageOverride = function ($wbwindow) {
            if ($wbwindow.postMessage && !$wbwindow.__orig_postMessage) {
                var orig = $wbwindow.postMessage
                    , wombat = this;
                $wbwindow.__orig_postMessage = orig;
                var postmessage_rewritten = function postMessage(message, targetOrigin, transfer, from_top) {
                    var from, src_id, this_obj = wombat.proxyToObj(this);
                    if (this_obj.__WB_source && this_obj.__WB_source.WB_wombat_location) {
                        var source = this_obj.__WB_source;
                        if (from = source.WB_wombat_location.origin,
                            this_obj.__WB_win_id || (this_obj.__WB_win_id = {},
                                this_obj.__WB_counter = 0),
                            !source.__WB_id) {
                            var id = this_obj.__WB_counter;
                            source.__WB_id = id + source.WB_wombat_location.href,
                                this_obj.__WB_counter += 1
                        }
                        this_obj.__WB_win_id[source.__WB_id] = source,
                            src_id = source.__WB_id,
                            this_obj.__WB_source = undefined
                    } else
                        from = window.WB_wombat_location.origin;
                    var to_origin = targetOrigin;
                    to_origin === this_obj.location.origin && (to_origin = from);
                    var new_message = {
                        from: from,
                        to_origin: to_origin,
                        src_id: src_id,
                        message: message,
                        from_top: from_top
                    };
                    if (targetOrigin !== "*") {
                        if (this_obj.location.origin === "null" || this_obj.location.origin === "")
                            return;
                        targetOrigin = this_obj.location.origin
                    }
                    return orig.call(this_obj, new_message, targetOrigin, transfer)
                };
                $wbwindow.postMessage = postmessage_rewritten,
                    $wbwindow.Window.prototype.postMessage = postmessage_rewritten;
                var eventTarget = null;
                eventTarget = $wbwindow.EventTarget && $wbwindow.EventTarget.prototype ? $wbwindow.EventTarget.prototype : $wbwindow;
                var _oAddEventListener = eventTarget.addEventListener;
                eventTarget.addEventListener = function addEventListener(type, listener, useCapture) {
                    var rwListener, obj = wombat.proxyToObj(this);
                    if (type === "message" ? rwListener = wombat.message_listeners.add_or_get(listener, function () {
                        return wrapEventListener(listener, obj, wombat)
                    }) : type === "storage" ? wombat.storage_listeners.add_or_get(listener, function () {
                        return wrapSameOriginEventListener(listener, obj)
                    }) : rwListener = listener,
                        rwListener)
                        return _oAddEventListener.call(obj, type, rwListener, useCapture)
                }
                    ;
                var _oRemoveEventListener = eventTarget.removeEventListener;
                eventTarget.removeEventListener = function removeEventListener(type, listener, useCapture) {
                    var rwListener, obj = wombat.proxyToObj(this);
                    if (type === "message" ? rwListener = wombat.message_listeners.remove(listener) : type === "storage" ? wombat.storage_listeners.remove(listener) : rwListener = listener,
                        rwListener)
                        return _oRemoveEventListener.call(obj, type, rwListener, useCapture)
                }
                    ;
                var override_on_prop = function (onevent, wrapperFN) {
                    var orig_setter = wombat.getOrigSetter($wbwindow, onevent)
                        , setter = function (value) {
                            this["__orig_" + onevent] = value;
                            var obj = wombat.proxyToObj(this)
                                , listener = value ? wrapperFN(value, obj, wombat) : value;
                            return orig_setter.call(obj, listener)
                        }
                        , getter = function () {
                            return this["__orig_" + onevent]
                        };
                    wombat.defProp($wbwindow, onevent, setter, getter)
                };
                override_on_prop("onmessage", wrapEventListener),
                    override_on_prop("onstorage", wrapSameOriginEventListener)
            }
        }
        ,
        Wombat.prototype.initMessageEventOverride = function ($wbwindow) {
            !$wbwindow.MessageEvent || $wbwindow.MessageEvent.prototype.__extended || (this.addEventOverride("target"),
                this.addEventOverride("srcElement"),
                this.addEventOverride("currentTarget"),
                this.addEventOverride("eventPhase"),
                this.addEventOverride("path"),
                this.overridePropToProxy($wbwindow.MessageEvent.prototype, "source"),
                $wbwindow.MessageEvent.prototype.__extended = true)
        }
        ,
        Wombat.prototype.initUIEventsOverrides = function () {
            this.overrideAnUIEvent("UIEvent"),
                this.overrideAnUIEvent("MouseEvent"),
                this.overrideAnUIEvent("TouchEvent"),
                this.overrideAnUIEvent("FocusEvent"),
                this.overrideAnUIEvent("KeyboardEvent"),
                this.overrideAnUIEvent("WheelEvent"),
                this.overrideAnUIEvent("InputEvent"),
                this.overrideAnUIEvent("CompositionEvent")
        }
        ,
        Wombat.prototype.initOpenOverride = function () {
            var orig = this.$wbwindow.open;
            this.$wbwindow.Window.prototype.open && (orig = this.$wbwindow.Window.prototype.open);
            var wombat = this
                , open_rewritten = function open(strUrl, strWindowName, strWindowFeatures) {
                    var rwStrUrl = wombat.rewriteUrl(strUrl, false, "")
                        , res = orig.call(wombat.proxyToObj(this), rwStrUrl, strWindowName, strWindowFeatures);
                    return wombat.initNewWindowWombat(res, strUrl),
                        res
                };
            this.$wbwindow.open = open_rewritten,
                this.$wbwindow.Window.prototype.open && (this.$wbwindow.Window.prototype.open = open_rewritten);
            for (var i = 0; i < this.$wbwindow.frames.length; i++)
                try {
                    this.$wbwindow.frames[i].open = open_rewritten
                } catch (e) {
                    console.log(e)
                }
        }
        ,
        Wombat.prototype.initCookiesOverride = function () {
            var orig_get_cookie = this.getOrigGetter(this.$wbwindow.document, "cookie")
                , orig_set_cookie = this.getOrigSetter(this.$wbwindow.document, "cookie");
            orig_get_cookie || (orig_get_cookie = this.getOrigGetter(this.$wbwindow.Document.prototype, "cookie")),
                orig_set_cookie || (orig_set_cookie = this.getOrigSetter(this.$wbwindow.Document.prototype, "cookie"));
            var rwCookieReplacer = function (m, d1) {
                var date = new Date(d1);
                if (isNaN(date.getTime()))
                    return "Expires=Thu,| 01 Jan 1970 00:00:00 GMT";
                var finalDate = new Date(date.getTime() + Date.__WB_timediff);
                return "Expires=" + finalDate.toUTCString().replace(",", ",|")
            }
                , wombat = this
                , set_cookie = function cookie(value) {
                    if (value) {
                        for (var newValue = value.replace(wombat.cookie_expires_regex, rwCookieReplacer), cookies = newValue.split(wombat.SetCookieRe), i = 0; i < cookies.length; i++)
                            cookies[i] = wombat.rewriteCookie(cookies[i]);
                        return orig_set_cookie.call(wombat.proxyToObj(this), cookies.join(","))
                    }
                }
                , get_cookie = function cookie() {
                    return orig_get_cookie.call(wombat.proxyToObj(this))
                };
            this.defProp(this.$wbwindow.document, "cookie", set_cookie, get_cookie)
        }
        ,
        Wombat.prototype.initRegisterUnRegPHOverride = function () {
            var wombat = this
                , winNavigator = this.$wbwindow.navigator;
            if (winNavigator.registerProtocolHandler) {
                var orig_registerPH = winNavigator.registerProtocolHandler;
                winNavigator.registerProtocolHandler = function registerProtocolHandler(protocol, uri, title) {
                    return orig_registerPH.call(this, protocol, wombat.rewriteUrl(uri), title)
                }
            }
            if (winNavigator.unregisterProtocolHandler) {
                var origUnregPH = winNavigator.unregisterProtocolHandler;
                winNavigator.unregisterProtocolHandler = function unregisterProtocolHandler(scheme, url) {
                    return origUnregPH.call(this, scheme, wombat.rewriteUrl(url))
                }
            }
        }
        ,
        Wombat.prototype.initBeaconOverride = function () {
            if (this.$wbwindow.navigator.sendBeacon) {
                var orig_sendBeacon = this.$wbwindow.navigator.sendBeacon
                    , wombat = this;
                this.$wbwindow.navigator.sendBeacon = function sendBeacon(url, data) {
                    try {
                        return orig_sendBeacon.call(this, wombat.rewriteUrl(url), data)
                    } catch (e) {
                        return true
                    }
                }
            }
        }
        ,
        Wombat.prototype.initPresentationRequestOverride = function () {
            if (this.$wbwindow.PresentationRequest && this.$wbwindow.PresentationRequest.prototype) {
                var wombat = this
                    , origPresentationRequest = this.$wbwindow.PresentationRequest;
                this.$wbwindow.PresentationRequest = function (PresentationRequest_) {
                    return function PresentationRequest(url) {
                        wombat.domConstructorErrorChecker(this, "PresentationRequest", arguments);
                        var rwURL = url;
                        if (url != null)
                            if (Array.isArray(rwURL))
                                for (var i = 0; i < rwURL.length; i++)
                                    rwURL[i] = wombat.rewriteUrl(rwURL[i], true, "mp_");
                            else
                                rwURL = wombat.rewriteUrl(url, true, "mp_");
                        return new PresentationRequest_(rwURL)
                    }
                }(this.$wbwindow.PresentationRequest),
                    this.$wbwindow.PresentationRequest.prototype = origPresentationRequest.prototype,
                    Object.defineProperty(this.$wbwindow.PresentationRequest.prototype, "constructor", {
                        value: this.$wbwindow.PresentationRequest
                    })
            }
        }
        ,
        Wombat.prototype.initDisableNotificationsGeoLocation = function () {
            window.Notification && (window.Notification.requestPermission = function requestPermission(callback) {
                return callback && callback("denied"),
                    Promise.resolve("denied")
            }
            );
            var applyOverride = function (on) {
                on && (on.getCurrentPosition && (on.getCurrentPosition = function getCurrentPosition(success, error, options) {
                    error && error({
                        code: 2,
                        message: "not available"
                    })
                }
                ),
                    on.watchPosition && (on.watchPosition = function watchPosition(success, error, options) {
                        error && error({
                            code: 2,
                            message: "not available"
                        })
                    }
                    ))
            };
            window.geolocation && applyOverride(window.geolocation),
                window.navigator.geolocation && applyOverride(window.navigator.geolocation)
        }
        ,
        Wombat.prototype.initStorageOverride = function () {
            this.addEventOverride("storageArea", this.$wbwindow.StorageEvent.prototype);
            var local, session, pLocal = "localStorage", pSession = "sessionStorage";
            if (ThrowExceptions.yes = false,
                this.$wbwindow.Proxy) {
                var storageProxyHandler = function () {
                    return {
                        get: function (target, prop) {
                            return prop in target ? target[prop] : target.data.hasOwnProperty(prop) ? target.getItem(prop) : undefined
                        },
                        set: function (target, prop, value) {
                            return !target.hasOwnProperty(prop) && (target.setItem(prop, value),
                                true)
                        },
                        getOwnPropertyDescriptor: function (target, prop) {
                            return Object.getOwnPropertyDescriptor(target, prop)
                        }
                    }
                };
                local = new this.$wbwindow.Proxy(new Storage(this, pLocal), storageProxyHandler()),
                    session = new this.$wbwindow.Proxy(new Storage(this, pSession), storageProxyHandler())
            } else
                local = new Storage(this, pLocal),
                    session = new Storage(this, pSession);
            this.defGetterProp(this.$wbwindow, pLocal, function localStorage() {
                return local
            }),
                this.defGetterProp(this.$wbwindow, pSession, function sessionStorage() {
                    return session
                }),
                this.$wbwindow.Storage = Storage,
                ThrowExceptions.yes = true
        }
        ,
        Wombat.prototype.initIndexedDBOverride = function () {
            if (this.$wbwindow.IDBFactory) {
                var proto = this.$wbwindow.IDBFactory.prototype
                    , prefix = "wb-" + this.wb_orig_origin + "-"
                    , orig_open = proto.open;
                proto.open = function (dbName, version) {
                    return orig_open.call(this, prefix + dbName, version)
                }
                    ;
                var orig_delete = proto.deleteDatabase;
                proto.delete = function (dbName) {
                    return orig_delete.call(this, prefix + dbName, options)
                }
                    ;
                var orig_databases = proto.databases;
                proto.databases = function () {
                    var func = this;
                    return new Promise(function (resolve, reject) {
                        orig_databases.call(func).then(function (dbList) {
                            for (var keys = [], i = 0; i < dbList.length; i++)
                                dbList[i].name.indexOf(prefix) === 0 && keys.push({
                                    name: dbList[i].name.substring(prefix.length),
                                    version: dbList[i].version
                                });
                            resolve(keys)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                    )
                }
            }
        }
        ,
        Wombat.prototype.initCachesOverride = function () {
            if (this.$wbwindow.CacheStorage) {
                this.$wbwindow.chrome && (this.$wbwindow.chrome = {});
                var proto = this.$wbwindow.CacheStorage.prototype
                    , prefix = "wb-" + this.wb_orig_origin + "-"
                    , orig_open = proto.open;
                proto.open = function (cacheName) {
                    return orig_open.call(this, prefix + cacheName)
                }
                    ;
                var orig_has = proto.has;
                proto.has = function (cacheName) {
                    return orig_has.call(this, prefix + cacheName)
                }
                    ;
                var orig_delete = proto.delete;
                proto.delete = function (cacheName) {
                    return orig_delete.call(this, prefix + cacheName)
                }
                    ;
                var orig_keys = proto.keys;
                proto.keys = function () {
                    var func = this;
                    return new Promise(function (resolve, reject) {
                        orig_keys.call(func).then(function (keyList) {
                            for (var keys = [], i = 0; i < keyList.length; i++)
                                keyList[i].indexOf(prefix) === 0 && keys.push(keyList[i].substring(prefix.length));
                            resolve(keys)
                        }).catch(function (err) {
                            reject(err)
                        })
                    }
                    )
                }
                    ;
                var orig_match = proto.match;
                proto.match = function match(request, opts) {
                    var caches = this;
                    return this.keys().then(function (cacheNames) {
                        var match;
                        return cacheNames.reduce(function (chain, cacheName) {
                            return chain.then(function () {
                                return match || caches.open(cacheName).then(function (cache) {
                                    return cache.match(request, opts)
                                }).then(function (response) {
                                    return match = response,
                                        match
                                })
                            })
                        }, Promise.resolve())
                    })
                }
            }
        }
        ,
        Wombat.prototype.initWindowObjProxy = function ($wbwindow) {
            if (!$wbwindow.Proxy)
                return undefined;
            var ownProps = this.getAllOwnProps($wbwindow)
                , funCache = {}
                , wombat = this
                , windowProxy = new $wbwindow.Proxy({}, {
                    get: function (target, prop) {
                        switch (prop) {
                            case "top":
                                return wombat.$wbwindow.WB_wombat_top._WB_wombat_obj_proxy;
                            case "parent":
                                if (wombat.$wbwindow === wombat.$wbwindow.WB_wombat_top)
                                    return wombat.$wbwindow.WB_wombat_top._WB_wombat_obj_proxy;
                                try {
                                    var parentProxy = wombat.$wbwindow.parent._WB_wombat_obj_proxy;
                                    if (parentProxy)
                                        return parentProxy
                                } catch (e) { }
                                return wombat.$wbwindow.WB_wombat_top._WB_wombat_obj_proxy;
                        }
                        return wombat.defaultProxyGet($wbwindow, prop, ownProps, funCache)
                    },
                    set: function (target, prop, value) {
                        switch (prop) {
                            case "location":
                                return $wbwindow.WB_wombat_location = value,
                                    true;
                            case "postMessage":
                            case "document":
                                return true;
                        }
                        try {
                            if (!Reflect.set(target, prop, value))
                                return false
                        } catch (e) { }
                        return Reflect.set($wbwindow, prop, value)
                    },
                    has: function (target, prop) {
                        return prop in $wbwindow
                    },
                    ownKeys: function (target) {
                        return Object.getOwnPropertyNames($wbwindow).concat(Object.getOwnPropertySymbols($wbwindow))
                    },
                    getOwnPropertyDescriptor: function (target, key) {
                        var descriptor = Object.getOwnPropertyDescriptor(target, key);
                        return descriptor || (descriptor = Object.getOwnPropertyDescriptor($wbwindow, key),
                            descriptor && (descriptor.configurable = true)),
                            descriptor
                    },
                    getPrototypeOf: function (target) {
                        return Object.getPrototypeOf($wbwindow)
                    },
                    setPrototypeOf: function (target, newProto) {
                        return false
                    },
                    isExtensible: function (target) {
                        return Object.isExtensible($wbwindow)
                    },
                    preventExtensions: function (target) {
                        return Object.preventExtensions($wbwindow),
                            true
                    },
                    deleteProperty: function (target, prop) {
                        var propDescriptor = Object.getOwnPropertyDescriptor($wbwindow, prop);
                        return propDescriptor === undefined || propDescriptor.configurable !== false && (delete target[prop],
                            delete $wbwindow[prop],
                            true)
                    },
                    defineProperty: function (target, prop, desc) {
                        var ndesc = desc || {};
                        return ndesc.value || ndesc.get || (ndesc.value = $wbwindow[prop]),
                            Reflect.defineProperty($wbwindow, prop, ndesc),
                            Reflect.defineProperty(target, prop, ndesc)
                    }
                });
            return $wbwindow._WB_wombat_obj_proxy = windowProxy,
                windowProxy
        }
        ,
        Wombat.prototype.initDocumentObjProxy = function ($document) {
            if (this.initDocOverrides($document),
                !this.$wbwindow.Proxy)
                return undefined;
            var funCache = {}
                , ownProps = this.getAllOwnProps($document)
                , wombat = this
                , documentProxy = new this.$wbwindow.Proxy($document, {
                    get: function (target, prop) {
                        return wombat.defaultProxyGet($document, prop, ownProps, funCache)
                    },
                    set: function (target, prop, value) {
                        return prop === "location" ? $document.WB_wombat_location = value : target[prop] = value,
                            true
                    }
                });
            return $document._WB_wombat_obj_proxy = documentProxy,
                documentProxy
        }
        ,
        Wombat.prototype.initAutoFetchWorker = function () {
            if (this.wbUseAFWorker) {
                var af = new AutoFetcher(this, {
                    isTop: this.$wbwindow === this.$wbwindow.__WB_replay_top,
                    workerURL: (this.wb_info.auto_fetch_worker_prefix || this.wb_info.static_prefix) + "autoFetchWorker.js?init=" + encodeURIComponent(JSON.stringify({
                        mod: this.wb_info.mod,
                        prefix: this.wb_abs_prefix,
                        rwRe: this.wb_unrewrite_rx.source
                    }))
                });
                this.WBAutoFetchWorker = af,
                    this.$wbwindow.$WBAutoFetchWorker$ = af;
                var wombat = this;
                this.utilFns.wbSheetMediaQChecker = function checkStyle() {
                    wombat._removeEventListener(this, "load", wombat.utilFns.wbSheetMediaQChecker),
                        this.sheet == null || wombat.WBAutoFetchWorker && wombat.WBAutoFetchWorker.deferredSheetExtraction(this.sheet)
                }
            }
        }
        ,
        Wombat.prototype.initTopFrameNotify = function (wbinfo) {
            var wombat = this
                , notify_top = function notify_top(event) {
                    if (!wombat.$wbwindow.__WB_top_frame) {
                        var hash = wombat.$wbwindow.location.hash;
                        return void wombat.$wbwindow.location.replace(wbinfo.top_url + hash)
                    }
                    if (wombat.$wbwindow.WB_wombat_location) {
                        var url = wombat.$wbwindow.WB_wombat_location.href;
                        if (typeof url === "string" && url !== "about:blank" && url.indexOf("javascript:") !== 0 && (wombat.$wbwindow.document.readyState === "complete" && wombat.wbUseAFWorker && wombat.WBAutoFetchWorker && wombat.WBAutoFetchWorker.extractFromLocalDoc(),
                            wombat.$wbwindow === wombat.$wbwindow.__WB_replay_top)) {
                            for (var hicon, icons = [], hicons = wombat.$wbwindow.document.querySelectorAll("link[rel*='icon']"), i = 0; i < hicons.length; i++)
                                hicon = hicons[i],
                                    icons.push({
                                        rel: hicon.rel,
                                        href: wombat.wb_getAttribute.call(hicon, "href")
                                    });
                            var message = {
                                icons: icons,
                                url: wombat.$wbwindow.WB_wombat_location.href,
                                ts: wombat.wb_info.timestamp,
                                request_ts: wombat.wb_info.request_ts,
                                is_live: wombat.wb_info.is_live,
                                title: wombat.$wbwindow.document ? wombat.$wbwindow.document.title : "",
                                readyState: wombat.$wbwindow.document.readyState,
                                wb_type: "load"
                            };
                            wombat.sendTopMessage(message)
                        }
                    }
                };
            this.$wbwindow.document.readyState === "complete" ? notify_top() : this.$wbwindow.addEventListener ? this.$wbwindow.document.addEventListener("readystatechange", notify_top) : this.$wbwindow.attachEvent && this.$wbwindow.document.attachEvent("onreadystatechange", notify_top)
        }
        ,
        Wombat.prototype.initTopFrame = function ($wbwindow) {
            if (this.wb_is_proxy)
                return $wbwindow.__WB_replay_top = $wbwindow.top,
                    void ($wbwindow.__WB_top_frame = undefined);
            for (var next_parent = function (win) {
                try {
                    return !!win && (win.wbinfo ? win.wbinfo.is_framed : win._wb_wombat != null)
                } catch (e) {
                    return false
                }
            }, replay_top = $wbwindow; replay_top.parent != replay_top && next_parent(replay_top.parent);)
                replay_top = replay_top.parent;
            $wbwindow.__WB_replay_top = replay_top;
            var real_parent = replay_top.parent;
            if (real_parent != $wbwindow && this.wb_info.is_framed || (real_parent = undefined),
                real_parent ? ($wbwindow.__WB_top_frame = real_parent,
                    this.initFrameElementOverride($wbwindow)) : $wbwindow.__WB_top_frame = undefined,
                !this.wb_opts.embedded && replay_top == $wbwindow && this.wbUseAFWorker) {
                var wombat = this;
                this.$wbwindow.addEventListener("message", function (event) {
                    event.data && event.data.wb_type === "aaworker" && wombat.WBAutoFetchWorker && wombat.WBAutoFetchWorker.postMessage(event.data.msg)
                }, false)
            }
        }
        ,
        Wombat.prototype.initFrameElementOverride = function ($wbwindow) {
            if (Object.defineProperty && this.proxyToObj($wbwindow.__WB_replay_top) == this.proxyToObj($wbwindow))
                try {
                    Object.defineProperty($wbwindow, "frameElement", {
                        value: null,
                        configurable: false
                    })
                } catch (e) { }
        }
        ,
        Wombat.prototype.initWombatTop = function ($wbwindow) {
            if (Object.defineProperty) {
                var isWindow = function isWindow(obj) {
                    return typeof window.constructor === "undefined" ? obj instanceof window.constructor : obj.window == obj
                }
                    , getter = function top() {
                        return this.__WB_replay_top ? this.__WB_replay_top : isWindow(this) ? this : this.top
                    }
                    , setter = function top(val) {
                        this.top = val
                    };
                this.defProp($wbwindow.Object.prototype, "WB_wombat_top", setter, getter)
            }
        }
        ,
        Wombat.prototype.initEvalOverride = function () {
            var rewriteEvalArg = this.rewriteEvalArg
                , setNoop = function () { }
                , wrappedEval = function wrappedEval(arg) {
                    return rewriteEvalArg(eval, arg)
                };
            this.defProp(this.$wbwindow.Object.prototype, "WB_wombat_eval", setNoop, function () {
                return wrappedEval
            });
            var runEval = function runEval(func) {
                return {
                    eval: function (arg) {
                        return rewriteEvalArg(func, arg)
                    }
                }
            };
            this.defProp(this.$wbwindow.Object.prototype, "WB_wombat_runEval", setNoop, function () {
                return runEval
            })
        }
        ,
        Wombat.prototype.wombatInit = function () {
            this._internalInit(),
                this.initCookiePreset(),
                this.initHistoryOverrides(),
                this.overrideFunctionApply(this.$wbwindow),
                this.overrideFunctionBind(this.$wbwindow),
                this.initDocTitleOverride(),
                this.initHashChange(),
                this.wb_opts.skip_postmessage || (this.initPostMessageOverride(this.$wbwindow),
                    this.initMessageEventOverride(this.$wbwindow)),
                this.initCheckThisFunc(this.$wbwindow),
                this.overrideGetOwnPropertyNames(this.$wbwindow),
                this.initUIEventsOverrides(),
                this.initDocWriteOpenCloseOverride(),
                this.initEvalOverride(),
                this.initHTTPOverrides(),
                this.initAudioOverride(),
                this.initFontFaceOverride(this.$wbwindow),
                this.initWorkerOverrides(),
                this.initTextNodeOverrides(),
                this.initCSSOMOverrides(),
                this.overrideHtmlAssign(this.$wbwindow.Element, "innerHTML", true),
                this.overrideHtmlAssign(this.$wbwindow.Element, "outerHTML", true),
                this.overrideHtmlAssign(this.$wbwindow.HTMLIFrameElement, "srcdoc", true),
                this.overrideHtmlAssign(this.$wbwindow.HTMLStyleElement, "textContent"),
                this.overrideShadowDom(),
                this.overridePropExtract(this.$wbwindow.Document.prototype, "URL"),
                this.overridePropExtract(this.$wbwindow.Document.prototype, "documentURI"),
                this.overridePropExtract(this.$wbwindow.Node.prototype, "baseURI"),
                this.overrideAttrProps(),
                this.initInsertAdjacentElementHTMLOverrides(),
                this.overrideIframeContentAccess("contentWindow"),
                this.overrideIframeContentAccess("contentDocument"),
                this.overrideFuncArgProxyToObj(this.$wbwindow.MutationObserver, "observe"),
                this.overrideFuncArgProxyToObj(this.$wbwindow.Node, "compareDocumentPosition"),
                this.overrideFuncArgProxyToObj(this.$wbwindow.Node, "contains"),
                this.overrideFuncArgProxyToObj(this.$wbwindow.Document, "createTreeWalker"),
                this.overrideFuncArgProxyToObj(this.$wbwindow.Document, "evaluate", 1),
                this.overrideFuncArgProxyToObj(this.$wbwindow.XSLTProcessor, "transformToFragment", 1),
                this.overrideFuncThisProxyToObj(this.$wbwindow, "getComputedStyle", this.$wbwindow),
                this.overrideFuncThisProxyToObj(this.$wbwindow, "clearTimeout"),
                this.overrideFuncThisProxyToObj(this.$wbwindow, "clearInterval"),
                this.overrideFuncThisProxyToObj(this.$wbwindow.EventTarget.prototype, "dispatchEvent"),
                this.initTimeoutIntervalOverrides(),
                this.overrideFramesAccess(this.$wbwindow),
                this.overrideSWAccess(this.$wbwindow),
                this.initElementGetSetAttributeOverride(),
                this.initSvgImageOverrides(),
                this.initAttrOverrides(),
                this.initCookiesOverride(),
                this.initCreateElementNSFix(),
                this.wb_opts.skip_dom || this.initDomOverride(),
                this.initRegisterUnRegPHOverride(),
                this.initPresentationRequestOverride(),
                this.initBeaconOverride(),
                this.initSeededRandom(this.wb_info.wombat_sec),
                this.initCryptoRandom(),
                this.initFixedRatio(),
                this.initDateOverride(this.wb_info.wombat_sec),
                this.initBlobOverride(),
                this.initOpenOverride(),
                this.initDisableNotificationsGeoLocation(),
                this.initStorageOverride(),
                this.initCachesOverride(),
                this.initIndexedDBOverride(),
                this.initWindowObjProxy(this.$wbwindow),
                this.initDocumentObjProxy(this.$wbwindow.document);
            var wombat = this;
            return {
                actual: false,
                extract_orig: this.extractOriginalURL,
                rewrite_url: this.rewriteUrl,
                watch_elem: this.watchElem,
                init_new_window_wombat: this.initNewWindowWombat,
                init_paths: this.initPaths,
                local_init: function (name) {
                    var res = wombat.$wbwindow._WB_wombat_obj_proxy[name];
                    return name === "document" && res && !res._WB_wombat_obj_proxy ? wombat.initDocumentObjProxy(res) || res : res
                },
                showCSPViolations: function (yesNo) {
                    wombat._addRemoveCSPViolationListener(yesNo)
                }
            }
        }
        ,
        window._WBWombat = Wombat,
        window._WBWombatInit = function (wbinfo) {
            if (!this._wb_wombat) {
                var wombat = new Wombat(this, wbinfo);
                this._wb_wombat = wombat.wombatInit()
            } else
                this._wb_wombat.init_paths(wbinfo)
        }
}
)();

var _____WB$wombat$assign$function_____ = function (name) { return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function (obj) { this.__WB_source = obj; return this; } }
{
    let window = _____WB$wombat$assign$function_____("window");
    let self = _____WB$wombat$assign$function_____("self");
    let document = _____WB$wombat$assign$function_____("document");
    let location = _____WB$wombat$assign$function_____("location");
    let top = _____WB$wombat$assign$function_____("top");
    let parent = _____WB$wombat$assign$function_____("parent");
    let frames = _____WB$wombat$assign$function_____("frames");
    let opener = _____WB$wombat$assign$function_____("opener");

    /*! jQuery v1.7.2 jquery.com | jquery.org/license */
    (function (a, b) {
        function cy(a) { return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1 } function cu(a) { if (!cj[a]) { var b = c.body, d = f("<" + a + ">").appendTo(b), e = d.css("display"); d.remove(); if (e === "none" || e === "") { ck || (ck = c.createElement("iframe"), ck.frameBorder = ck.width = ck.height = 0), b.appendChild(ck); if (!cl || !ck.createElement) cl = (ck.contentWindow || ck.contentDocument).document, cl.write((f.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), cl.close(); d = cl.createElement(a), cl.body.appendChild(d), e = f.css(d, "display"), b.removeChild(ck) } cj[a] = e } return cj[a] } function ct(a, b) { var c = {}; f.each(cp.concat.apply([], cp.slice(0, b)), function () { c[this] = a }); return c } function cs() { cq = b } function cr() { setTimeout(cs, 0); return cq = f.now() } function ci() { try { return new a.ActiveXObject("Microsoft.XMLHTTP") } catch (b) { } } function ch() { try { return new a.XMLHttpRequest } catch (b) { } } function cb(a, c) { a.dataFilter && (c = a.dataFilter(c, a.dataType)); var d = a.dataTypes, e = {}, g, h, i = d.length, j, k = d[0], l, m, n, o, p; for (g = 1; g < i; g++) { if (g === 1) for (h in a.converters) typeof h == "string" && (e[h.toLowerCase()] = a.converters[h]); l = k, k = d[g]; if (k === "*") k = l; else if (l !== "*" && l !== k) { m = l + " " + k, n = e[m] || e["* " + k]; if (!n) { p = b; for (o in e) { j = o.split(" "); if (j[0] === l || j[0] === "*") { p = e[j[1] + " " + k]; if (p) { o = e[o], o === !0 ? n = p : p === !0 && (n = o); break } } } } !n && !p && f.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c))) } } return c } function ca(a, c, d) { var e = a.contents, f = a.dataTypes, g = a.responseFields, h, i, j, k; for (i in g) i in d && (c[g[i]] = d[i]); while (f[0] === "*") f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type")); if (h) for (i in e) if (e[i] && e[i].test(h)) { f.unshift(i); break } if (f[0] in d) j = f[0]; else { for (i in d) { if (!f[0] || a.converters[i + " " + f[0]]) { j = i; break } k || (k = i) } j = j || k } if (j) { j !== f[0] && f.unshift(j); return d[j] } } function b_(a, b, c, d) { if (f.isArray(b)) f.each(b, function (b, e) { c || bD.test(a) ? d(a, e) : b_(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d) }); else if (!c && f.type(b) === "object") for (var e in b) b_(a + "[" + e + "]", b[e], c, d); else d(a, b) } function b$(a, c) { var d, e, g = f.ajaxSettings.flatOptions || {}; for (d in c) c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d]); e && f.extend(!0, a, e) } function bZ(a, c, d, e, f, g) { f = f || c.dataTypes[0], g = g || {}, g[f] = !0; var h = a[f], i = 0, j = h ? h.length : 0, k = a === bS, l; for (; i < j && (k || !l); i++)l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = bZ(a, c, d, e, l, g))); (k || !l) && !g["*"] && (l = bZ(a, c, d, e, "*", g)); return l } function bY(a) { return function (b, c) { typeof b != "string" && (c = b, b = "*"); if (f.isFunction(c)) { var d = b.toLowerCase().split(bO), e = 0, g = d.length, h, i, j; for (; e < g; e++)h = d[e], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c) } } } function bB(a, b, c) { var d = b === "width" ? a.offsetWidth : a.offsetHeight, e = b === "width" ? 1 : 0, g = 4; if (d > 0) { if (c !== "border") for (; e < g; e += 2)c || (d -= parseFloat(f.css(a, "padding" + bx[e])) || 0), c === "margin" ? d += parseFloat(f.css(a, c + bx[e])) || 0 : d -= parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0; return d + "px" } d = by(a, b); if (d < 0 || d == null) d = a.style[b]; if (bt.test(d)) return d; d = parseFloat(d) || 0; if (c) for (; e < g; e += 2)d += parseFloat(f.css(a, "padding" + bx[e])) || 0, c !== "padding" && (d += parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0), c === "margin" && (d += parseFloat(f.css(a, c + bx[e])) || 0); return d + "px" } function bo(a) { var b = c.createElement("div"); bh.appendChild(b), b.innerHTML = a.outerHTML; return b.firstChild } function bn(a) { var b = (a.nodeName || "").toLowerCase(); b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm) } function bm(a) { if (a.type === "checkbox" || a.type === "radio") a.defaultChecked = a.checked } function bl(a) { return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : [] } function bk(a, b) { var c; b.nodeType === 1 && (b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === "object" ? b.outerHTML = a.outerHTML : c !== "input" || a.type !== "checkbox" && a.type !== "radio" ? c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text) : (a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value)), b.removeAttribute(f.expando), b.removeAttribute("_submit_attached"), b.removeAttribute("_change_attached")) } function bj(a, b) { if (b.nodeType === 1 && !!f.hasData(a)) { var c, d, e, g = f._data(a), h = f._data(b, g), i = g.events; if (i) { delete h.handle, h.events = {}; for (c in i) for (d = 0, e = i[c].length; d < e; d++)f.event.add(b, c, i[c][d]) } h.data && (h.data = f.extend({}, h.data)) } } function bi(a, b) { return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a } function U(a) { var b = V.split("|"), c = a.createDocumentFragment(); if (c.createElement) while (b.length) c.createElement(b.pop()); return c } function T(a, b, c) { b = b || 0; if (f.isFunction(b)) return f.grep(a, function (a, d) { var e = !!b.call(a, d, a); return e === c }); if (b.nodeType) return f.grep(a, function (a, d) { return a === b === c }); if (typeof b == "string") { var d = f.grep(a, function (a) { return a.nodeType === 1 }); if (O.test(b)) return f.filter(b, d, !c); b = f.filter(b, d) } return f.grep(a, function (a, d) { return f.inArray(a, b) >= 0 === c }) } function S(a) { return !a || !a.parentNode || a.parentNode.nodeType === 11 } function K() { return !0 } function J() { return !1 } function n(a, b, c) { var d = b + "defer", e = b + "queue", g = b + "mark", h = f._data(a, d); h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function () { !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire()) }, 0) } function m(a) { for (var b in a) { if (b === "data" && f.isEmptyObject(a[b])) continue; if (b !== "toJSON") return !1 } return !0 } function l(a, c, d) { if (d === b && a.nodeType === 1) { var e = "data-" + c.replace(k, "-$1").toLowerCase(); d = a.getAttribute(e); if (typeof d == "string") { try { d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : f.isNumeric(d) ? +d : j.test(d) ? f.parseJSON(d) : d } catch (g) { } f.data(a, c, d) } else d = b } return d } function h(a) { var b = g[a] = {}, c, d; a = a.split(/\s+/); for (c = 0, d = a.length; c < d; c++)b[a[c]] = !0; return b } var c = a.document, d = a.navigator, e = a.location, f = function () { function J() { if (!e.isReady) { try { c.documentElement.doScroll("left") } catch (a) { setTimeout(J, 1); return } e.ready() } } var e = function (a, b) { return new e.fn.init(a, b, h) }, f = a.jQuery, g = a.$, h, i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, j = /\S/, k = /^\s+/, l = /\s+$/, m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, n = /^[\],:{}\s]*$/, o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, q = /(?:^|:|,)(?:\s*\[)+/g, r = /(webkit)[ \/]([\w.]+)/, s = /(opera)(?:.*version)?[ \/]([\w.]+)/, t = /(msie) ([\w.]+)/, u = /(mozilla)(?:.*? rv:([\w.]+))?/, v = /-([a-z]|[0-9])/ig, w = /^-ms-/, x = function (a, b) { return (b + "").toUpperCase() }, y = d.userAgent, z, A, B, C = Object.prototype.toString, D = Object.prototype.hasOwnProperty, E = Array.prototype.push, F = Array.prototype.slice, G = String.prototype.trim, H = Array.prototype.indexOf, I = {}; e.fn = e.prototype = { constructor: e, init: function (a, d, f) { var g, h, j, k; if (!a) return this; if (a.nodeType) { this.context = this[0] = a, this.length = 1; return this } if (a === "body" && !d && c.body) { this.context = c, this[0] = c.body, this.selector = a, this.length = 1; return this } if (typeof a == "string") { a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [null, a, null]; if (g && (g[1] || !d)) { if (g[1]) { d = d instanceof e ? d[0] : d, k = d ? d.ownerDocument || d : c, j = m.exec(a), j ? e.isPlainObject(d) ? (a = [c.createElement(j[1])], e.fn.attr.call(a, d, !0)) : a = [k.createElement(j[1])] : (j = e.buildFragment([g[1]], [k]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes); return e.merge(this, a) } h = c.getElementById(g[2]); if (h && h.parentNode) { if (h.id !== g[2]) return f.find(a); this.length = 1, this[0] = h } this.context = c, this.selector = a; return this } return !d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a) } if (e.isFunction(a)) return f.ready(a); a.selector !== b && (this.selector = a.selector, this.context = a.context); return e.makeArray(a, this) }, selector: "", jquery: "1.7.2", length: 0, size: function () { return this.length }, toArray: function () { return F.call(this, 0) }, get: function (a) { return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a] }, pushStack: function (a, b, c) { var d = this.constructor(); e.isArray(a) ? E.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"); return d }, each: function (a, b) { return e.each(this, a, b) }, ready: function (a) { e.bindReady(), A.add(a); return this }, eq: function (a) { a = +a; return a === -1 ? this.slice(a) : this.slice(a, a + 1) }, first: function () { return this.eq(0) }, last: function () { return this.eq(-1) }, slice: function () { return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(",")) }, map: function (a) { return this.pushStack(e.map(this, function (b, c) { return a.call(b, c, b) })) }, end: function () { return this.prevObject || this.constructor(null) }, push: E, sort: [].sort, splice: [].splice }, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function () { var a, c, d, f, g, h, i = arguments[0] || {}, j = 1, k = arguments.length, l = !1; typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j); for (; j < k; j++)if ((a = arguments[j]) != null) for (c in a) { d = i[c], f = a[c]; if (i === f) continue; l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f) } return i }, e.extend({ noConflict: function (b) { a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f); return e }, isReady: !1, readyWait: 1, holdReady: function (a) { a ? e.readyWait++ : e.ready(!0) }, ready: function (a) { if (a === !0 && !--e.readyWait || a !== !0 && !e.isReady) { if (!c.body) return setTimeout(e.ready, 1); e.isReady = !0; if (a !== !0 && --e.readyWait > 0) return; A.fireWith(c, [e]), e.fn.trigger && e(c).trigger("ready").off("ready") } }, bindReady: function () { if (!A) { A = e.Callbacks("once memory"); if (c.readyState === "complete") return setTimeout(e.ready, 1); if (c.addEventListener) c.addEventListener("DOMContentLoaded", B, !1), a.addEventListener("load", e.ready, !1); else if (c.attachEvent) { c.attachEvent("onreadystatechange", B), a.attachEvent("onload", e.ready); var b = !1; try { b = a.frameElement == null } catch (d) { } c.documentElement.doScroll && b && J() } } }, isFunction: function (a) { return e.type(a) === "function" }, isArray: Array.isArray || function (a) { return e.type(a) === "array" }, isWindow: function (a) { return a != null && a == a.window }, isNumeric: function (a) { return !isNaN(parseFloat(a)) && isFinite(a) }, type: function (a) { return a == null ? String(a) : I[C.call(a)] || "object" }, isPlainObject: function (a) { if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) return !1; try { if (a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) return !1 } catch (c) { return !1 } var d; for (d in a); return d === b || D.call(a, d) }, isEmptyObject: function (a) { for (var b in a) return !1; return !0 }, error: function (a) { throw new Error(a) }, parseJSON: function (b) { if (typeof b != "string" || !b) return null; b = e.trim(b); if (a.JSON && a.JSON.parse) return a.JSON.parse(b); if (n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) return (new Function("return " + b))(); e.error("Invalid JSON: " + b) }, parseXML: function (c) { if (typeof c != "string" || !c) return null; var d, f; try { a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c)) } catch (g) { d = b } (!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c); return d }, noop: function () { }, globalEval: function (b) { b && j.test(b) && (a.execScript || function (b) { a.eval.call(a, b) })(b) }, camelCase: function (a) { return a.replace(w, "ms-").replace(v, x) }, nodeName: function (a, b) { return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase() }, each: function (a, c, d) { var f, g = 0, h = a.length, i = h === b || e.isFunction(a); if (d) { if (i) { for (f in a) if (c.apply(a[f], d) === !1) break } else for (; g < h;)if (c.apply(a[g++], d) === !1) break } else if (i) { for (f in a) if (c.call(a[f], f, a[f]) === !1) break } else for (; g < h;)if (c.call(a[g], g, a[g++]) === !1) break; return a }, trim: G ? function (a) { return a == null ? "" : G.call(a) } : function (a) { return a == null ? "" : (a + "").replace(k, "").replace(l, "") }, makeArray: function (a, b) { var c = b || []; if (a != null) { var d = e.type(a); a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a) } return c }, inArray: function (a, b, c) { var d; if (b) { if (H) return H.call(b, a, c); d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0; for (; c < d; c++)if (c in b && b[c] === a) return c } return -1 }, merge: function (a, c) { var d = a.length, e = 0; if (typeof c.length == "number") for (var f = c.length; e < f; e++)a[d++] = c[e]; else while (c[e] !== b) a[d++] = c[e++]; a.length = d; return a }, grep: function (a, b, c) { var d = [], e; c = !!c; for (var f = 0, g = a.length; f < g; f++)e = !!b(a[f], f), c !== e && d.push(a[f]); return d }, map: function (a, c, d) { var f, g, h = [], i = 0, j = a.length, k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a)); if (k) for (; i < j; i++)f = c(a[i], i, d), f != null && (h[h.length] = f); else for (g in a) f = c(a[g], g, d), f != null && (h[h.length] = f); return h.concat.apply([], h) }, guid: 1, proxy: function (a, c) { if (typeof c == "string") { var d = a[c]; c = a, a = d } if (!e.isFunction(a)) return b; var f = F.call(arguments, 2), g = function () { return a.apply(c, f.concat(F.call(arguments))) }; g.guid = a.guid = a.guid || g.guid || e.guid++; return g }, access: function (a, c, d, f, g, h, i) { var j, k = d == null, l = 0, m = a.length; if (d && typeof d == "object") { for (l in d) e.access(a, c, l, d[l], 1, h, f); g = 1 } else if (f !== b) { j = i === b && e.isFunction(f), k && (j ? (j = c, c = function (a, b, c) { return j.call(e(a), c) }) : (c.call(a, f), c = null)); if (c) for (; l < m; l++)c(a[l], d, j ? f.call(a[l], l, c(a[l], d)) : f, i); g = 1 } return g ? a : k ? c.call(a) : m ? c(a[0], d) : h }, now: function () { return (new Date).getTime() }, uaMatch: function (a) { a = a.toLowerCase(); var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || []; return { browser: b[1] || "", version: b[2] || "0" } }, sub: function () { function a(b, c) { return new a.fn.init(b, c) } e.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function (d, f) { f && f instanceof e && !(f instanceof a) && (f = a(f)); return e.fn.init.call(this, d, f, b) }, a.fn.init.prototype = a.fn; var b = a(c); return a }, browser: {} }), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (a, b) { I["[object " + b + "]"] = b.toLowerCase() }), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test(" ") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function () { c.removeEventListener("DOMContentLoaded", B, !1), e.ready() } : c.attachEvent && (B = function () { c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready()) }); return e }(), g = {}; f.Callbacks = function (a) { a = a ? g[a] || h(a) : {}; var c = [], d = [], e, i, j, k, l, m, n = function (b) { var d, e, g, h, i; for (d = 0, e = b.length; d < e; d++)g = b[d], h = f.type(g), h === "array" ? n(g) : h === "function" && (!a.unique || !p.has(g)) && c.push(g) }, o = function (b, f) { f = f || [], e = !a.memory || [b, f], i = !0, j = !0, m = k || 0, k = 0, l = c.length; for (; c && m < l; m++)if (c[m].apply(b, f) === !1 && a.stopOnFalse) { e = !0; break } j = !1, c && (a.once ? e === !0 ? p.disable() : c = [] : d && d.length && (e = d.shift(), p.fireWith(e[0], e[1]))) }, p = { add: function () { if (c) { var a = c.length; n(arguments), j ? l = c.length : e && e !== !0 && (k = a, o(e[0], e[1])) } return this }, remove: function () { if (c) { var b = arguments, d = 0, e = b.length; for (; d < e; d++)for (var f = 0; f < c.length; f++)if (b[d] === c[f]) { j && f <= l && (l--, f <= m && m--), c.splice(f--, 1); if (a.unique) break } } return this }, has: function (a) { if (c) { var b = 0, d = c.length; for (; b < d; b++)if (a === c[b]) return !0 } return !1 }, empty: function () { c = []; return this }, disable: function () { c = d = e = b; return this }, disabled: function () { return !c }, lock: function () { d = b, (!e || e === !0) && p.disable(); return this }, locked: function () { return !d }, fireWith: function (b, c) { d && (j ? a.once || d.push([b, c]) : (!a.once || !e) && o(b, c)); return this }, fire: function () { p.fireWith(this, arguments); return this }, fired: function () { return !!i } }; return p }; var i = [].slice; f.extend({ Deferred: function (a) { var b = f.Callbacks("once memory"), c = f.Callbacks("once memory"), d = f.Callbacks("memory"), e = "pending", g = { resolve: b, reject: c, notify: d }, h = { done: b.add, fail: c.add, progress: d.add, state: function () { return e }, isResolved: b.fired, isRejected: c.fired, then: function (a, b, c) { i.done(a).fail(b).progress(c); return this }, always: function () { i.done.apply(i, arguments).fail.apply(i, arguments); return this }, pipe: function (a, b, c) { return f.Deferred(function (d) { f.each({ done: [a, "resolve"], fail: [b, "reject"], progress: [c, "notify"] }, function (a, b) { var c = b[0], e = b[1], g; f.isFunction(c) ? i[a](function () { g = c.apply(this, arguments), g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d : this, [g]) }) : i[a](d[e]) }) }).promise() }, promise: function (a) { if (a == null) a = h; else for (var b in h) a[b] = h[b]; return a } }, i = h.promise({}), j; for (j in g) i[j] = g[j].fire, i[j + "With"] = g[j].fireWith; i.done(function () { e = "resolved" }, c.disable, d.lock).fail(function () { e = "rejected" }, b.disable, d.lock), a && a.call(i, i); return i }, when: function (a) { function m(a) { return function (b) { e[a] = arguments.length > 1 ? i.call(arguments, 0) : b, j.notifyWith(k, e) } } function l(a) { return function (c) { b[a] = arguments.length > 1 ? i.call(arguments, 0) : c, --g || j.resolveWith(j, b) } } var b = i.call(arguments, 0), c = 0, d = b.length, e = Array(d), g = d, h = d, j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(), k = j.promise(); if (d > 1) { for (; c < d; c++)b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g; g || j.resolveWith(j, b) } else j !== a && j.resolveWith(j, d ? [a] : []); return k } }), f.support = function () { var b, d, e, g, h, i, j, k, l, m, n, o, p = c.createElement("div"), q = c.documentElement; p.setAttribute("className", "t"), p.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = p.getElementsByTagName("*"), e = p.getElementsByTagName("a")[0]; if (!d || !d.length || !e) return {}; g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = p.getElementsByTagName("input")[0], b = { leadingWhitespace: p.firstChild.nodeType === 3, tbody: !p.getElementsByTagName("tbody").length, htmlSerialize: !!p.getElementsByTagName("link").length, style: /top/.test(e.getAttribute("style")), hrefNormalized: e.getAttribute("href") === "/a", opacity: /^0.55/.test(e.style.opacity), cssFloat: !!e.style.cssFloat, checkOn: i.value === "on", optSelected: h.selected, getSetAttribute: p.className !== "t", enctype: !!c.createElement("form").enctype, html5Clone: c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", submitBubbles: !0, changeBubbles: !0, focusinBubbles: !1, deleteExpando: !0, noCloneEvent: !0, inlineBlockNeedsLayout: !1, shrinkWrapBlocks: !1, reliableMarginRight: !0, pixelMargin: !0 }, f.boxModel = b.boxModel = c.compatMode === "CSS1Compat", i.checked = !0, b.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, b.optDisabled = !h.disabled; try { delete p.test } catch (r) { b.deleteExpando = !1 } !p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", function () { b.noCloneEvent = !1 }), p.cloneNode(!0).fireEvent("onclick")), i = c.createElement("input"), i.value = "t", i.setAttribute("type", "radio"), b.radioValue = i.value === "t", i.setAttribute("checked", "checked"), i.setAttribute("name", "t"), p.appendChild(i), j = c.createDocumentFragment(), j.appendChild(p.lastChild), b.checkClone = j.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = i.checked, j.removeChild(i), j.appendChild(p); if (p.attachEvent) for (n in { submit: 1, change: 1, focusin: 1 }) m = "on" + n, o = m in p, o || (p.setAttribute(m, "return;"), o = typeof p[m] == "function"), b[n + "Bubbles"] = o; j.removeChild(p), j = g = h = p = i = null, f(function () { var d, e, g, h, i, j, l, m, n, q, r, s, t, u = c.getElementsByTagName("body")[0]; !u || (m = 1, t = "padding:0;margin:0;border:", r = "position:absolute;top:0;left:0;width:1px;height:1px;", s = t + "0;visibility:hidden;", n = "style='" + r + t + "5px solid #000;", q = "<div " + n + "display:block;'><div style='" + t + "0;display:block;overflow:hidden;'></div></div>" + "<table " + n + "' cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", d = c.createElement("div"), d.style.cssText = s + "width:0;height:0;position:static;top:0;margin-top:" + m + "px", u.insertBefore(d, u.firstChild), p = c.createElement("div"), d.appendChild(p), p.innerHTML = "<table><tr><td style='" + t + "0;display:none'></td><td>t</td></tr></table>", k = p.getElementsByTagName("td"), o = k[0].offsetHeight === 0, k[0].style.display = "", k[1].style.display = "none", b.reliableHiddenOffsets = o && k[0].offsetHeight === 0, a.getComputedStyle && (p.innerHTML = "", l = c.createElement("div"), l.style.width = "0", l.style.marginRight = "0", p.style.width = "2px", p.appendChild(l), b.reliableMarginRight = (parseInt((a.getComputedStyle(l, null) || { marginRight: 0 }).marginRight, 10) || 0) === 0), typeof p.style.zoom != "undefined" && (p.innerHTML = "", p.style.width = p.style.padding = "1px", p.style.border = 0, p.style.overflow = "hidden", p.style.display = "inline", p.style.zoom = 1, b.inlineBlockNeedsLayout = p.offsetWidth === 3, p.style.display = "block", p.style.overflow = "visible", p.innerHTML = "<div style='width:5px;'></div>", b.shrinkWrapBlocks = p.offsetWidth !== 3), p.style.cssText = r + s, p.innerHTML = q, e = p.firstChild, g = e.firstChild, i = e.nextSibling.firstChild.firstChild, j = { doesNotAddBorder: g.offsetTop !== 5, doesAddBorderForTableAndCells: i.offsetTop === 5 }, g.style.position = "fixed", g.style.top = "20px", j.fixedPosition = g.offsetTop === 20 || g.offsetTop === 15, g.style.position = g.style.top = "", e.style.overflow = "hidden", e.style.position = "relative", j.subtractsBorderForOverflowNotVisible = g.offsetTop === -5, j.doesNotIncludeMarginInBodyOffset = u.offsetTop !== m, a.getComputedStyle && (p.style.marginTop = "1%", b.pixelMargin = (a.getComputedStyle(p, null) || { marginTop: 0 }).marginTop !== "1%"), typeof d.style.zoom != "undefined" && (d.style.zoom = 1), u.removeChild(d), l = p = d = null, f.extend(b, j)) }); return b }(); var j = /^(?:\{.*\}|\[.*\])$/, k = /([A-Z])/g; f.extend({ cache: {}, uuid: 0, expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""), noData: { embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet: !0 }, hasData: function (a) { a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando]; return !!a && !m(a) }, data: function (a, c, d, e) { if (!!f.acceptData(a)) { var g, h, i, j = f.expando, k = typeof c == "string", l = a.nodeType, m = l ? f.cache : a, n = l ? a[j] : a[j] && j, o = c === "events"; if ((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) return; n || (l ? a[j] = n = ++f.uuid : n = j), m[n] || (m[n] = {}, l || (m[n].toJSON = f.noop)); if (typeof c == "object" || typeof c == "function") e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c); g = h = m[n], e || (h.data || (h.data = {}), h = h.data), d !== b && (h[f.camelCase(c)] = d); if (o && !h[c]) return g.events; k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h; return i } }, removeData: function (a, b, c) { if (!!f.acceptData(a)) { var d, e, g, h = f.expando, i = a.nodeType, j = i ? f.cache : a, k = i ? a[h] : h; if (!j[k]) return; if (b) { d = c ? j[k] : j[k].data; if (d) { f.isArray(b) || (b in d ? b = [b] : (b = f.camelCase(b), b in d ? b = [b] : b = b.split(" "))); for (e = 0, g = b.length; e < g; e++)delete d[b[e]]; if (!(c ? m : f.isEmptyObject)(d)) return } } if (!c) { delete j[k].data; if (!m(j[k])) return } f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null, i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null) } }, _data: function (a, b, c) { return f.data(a, b, c, !0) }, acceptData: function (a) { if (a.nodeName) { var b = f.noData[a.nodeName.toLowerCase()]; if (b) return b !== !0 && a.getAttribute("classid") === b } return !0 } }), f.fn.extend({ data: function (a, c) { var d, e, g, h, i, j = this[0], k = 0, m = null; if (a === b) { if (this.length) { m = f.data(j); if (j.nodeType === 1 && !f._data(j, "parsedAttrs")) { g = j.attributes; for (i = g.length; k < i; k++)h = g[k].name, h.indexOf("data-") === 0 && (h = f.camelCase(h.substring(5)), l(j, h, m[h])); f._data(j, "parsedAttrs", !0) } } return m } if (typeof a == "object") return this.each(function () { f.data(this, a) }); d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!"; return f.access(this, function (c) { if (c === b) { m = this.triggerHandler("getData" + e, [d[0]]), m === b && j && (m = f.data(j, a), m = l(j, a, m)); return m === b && d[1] ? this.data(d[0]) : m } d[1] = c, this.each(function () { var b = f(this); b.triggerHandler("setData" + e, d), f.data(this, a, c), b.triggerHandler("changeData" + e, d) }) }, null, c, arguments.length > 1, null, !1) }, removeData: function (a) { return this.each(function () { f.removeData(this, a) }) } }), f.extend({ _mark: function (a, b) { a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1)) }, _unmark: function (a, b, c) { a !== !0 && (c = b, b = a, a = !1); if (b) { c = c || "fx"; var d = c + "mark", e = a ? 0 : (f._data(b, d) || 1) - 1; e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark")) } }, queue: function (a, b, c) { var d; if (a) { b = (b || "fx") + "queue", d = f._data(a, b), c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c)); return d || [] } }, dequeue: function (a, b) { b = b || "fx"; var c = f.queue(a, b), d = c.shift(), e = {}; d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a, function () { f.dequeue(a, b) }, e)), c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue")) } }), f.fn.extend({ queue: function (a, c) { var d = 2; typeof a != "string" && (c = a, a = "fx", d--); if (arguments.length < d) return f.queue(this[0], a); return c === b ? this : this.each(function () { var b = f.queue(this, a, c); a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a) }) }, dequeue: function (a) { return this.each(function () { f.dequeue(this, a) }) }, delay: function (a, b) { a = f.fx ? f.fx.speeds[a] || a : a, b = b || "fx"; return this.queue(b, function (b, c) { var d = setTimeout(b, a); c.stop = function () { clearTimeout(d) } }) }, clearQueue: function (a) { return this.queue(a || "fx", []) }, promise: function (a, c) { function m() { --h || d.resolveWith(e, [e]) } typeof a != "string" && (c = a, a = b), a = a || "fx"; var d = f.Deferred(), e = this, g = e.length, h = 1, i = a + "defer", j = a + "queue", k = a + "mark", l; while (g--) if (l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) h++, l.add(m); m(); return d.promise(c) } }); var o = /[\n\t\r]/g, p = /\s+/, q = /\r/g, r = /^(?:button|input)$/i, s = /^(?:button|input|object|select|textarea)$/i, t = /^a(?:rea)?$/i, u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, v = f.support.getSetAttribute, w, x, y; f.fn.extend({ attr: function (a, b) { return f.access(this, f.attr, a, b, arguments.length > 1) }, removeAttr: function (a) { return this.each(function () { f.removeAttr(this, a) }) }, prop: function (a, b) { return f.access(this, f.prop, a, b, arguments.length > 1) }, removeProp: function (a) { a = f.propFix[a] || a; return this.each(function () { try { this[a] = b, delete this[a] } catch (c) { } }) }, addClass: function (a) { var b, c, d, e, g, h, i; if (f.isFunction(a)) return this.each(function (b) { f(this).addClass(a.call(this, b, this.className)) }); if (a && typeof a == "string") { b = a.split(p); for (c = 0, d = this.length; c < d; c++) { e = this[c]; if (e.nodeType === 1) if (!e.className && b.length === 1) e.className = a; else { g = " " + e.className + " "; for (h = 0, i = b.length; h < i; h++)~g.indexOf(" " + b[h] + " ") || (g += b[h] + " "); e.className = f.trim(g) } } } return this }, removeClass: function (a) { var c, d, e, g, h, i, j; if (f.isFunction(a)) return this.each(function (b) { f(this).removeClass(a.call(this, b, this.className)) }); if (a && typeof a == "string" || a === b) { c = (a || "").split(p); for (d = 0, e = this.length; d < e; d++) { g = this[d]; if (g.nodeType === 1 && g.className) if (a) { h = (" " + g.className + " ").replace(o, " "); for (i = 0, j = c.length; i < j; i++)h = h.replace(" " + c[i] + " ", " "); g.className = f.trim(h) } else g.className = "" } } return this }, toggleClass: function (a, b) { var c = typeof a, d = typeof b == "boolean"; if (f.isFunction(a)) return this.each(function (c) { f(this).toggleClass(a.call(this, c, this.className, b), b) }); return this.each(function () { if (c === "string") { var e, g = 0, h = f(this), i = b, j = a.split(p); while (e = j[g++]) i = d ? i : !h.hasClass(e), h[i ? "addClass" : "removeClass"](e) } else if (c === "undefined" || c === "boolean") this.className && f._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || "" }) }, hasClass: function (a) { var b = " " + a + " ", c = 0, d = this.length; for (; c < d; c++)if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) return !0; return !1 }, val: function (a) { var c, d, e, g = this[0]; { if (!!arguments.length) { e = f.isFunction(a); return this.each(function (d) { var g = f(this), h; if (this.nodeType === 1) { e ? h = a.call(this, d, g.val()) : h = a, h == null ? h = "" : typeof h == "number" ? h += "" : f.isArray(h) && (h = f.map(h, function (a) { return a == null ? "" : a + "" })), c = f.valHooks[this.type] || f.valHooks[this.nodeName.toLowerCase()]; if (!c || !("set" in c) || c.set(this, h, "value") === b) this.value = h } }) } if (g) { c = f.valHooks[g.type] || f.valHooks[g.nodeName.toLowerCase()]; if (c && "get" in c && (d = c.get(g, "value")) !== b) return d; d = g.value; return typeof d == "string" ? d.replace(q, "") : d == null ? "" : d } } } }), f.extend({ valHooks: { option: { get: function (a) { var b = a.attributes.value; return !b || b.specified ? a.value : a.text } }, select: { get: function (a) { var b, c, d, e, g = a.selectedIndex, h = [], i = a.options, j = a.type === "select-one"; if (g < 0) return null; c = j ? g : 0, d = j ? g + 1 : i.length; for (; c < d; c++) { e = i[c]; if (e.selected && (f.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) { b = f(e).val(); if (j) return b; h.push(b) } } if (j && !h.length && i.length) return f(i[g]).val(); return h }, set: function (a, b) { var c = f.makeArray(b); f(a).find("option").each(function () { this.selected = f.inArray(f(this).val(), c) >= 0 }), c.length || (a.selectedIndex = -1); return c } } }, attrFn: { val: !0, css: !0, html: !0, text: !0, data: !0, width: !0, height: !0, offset: !0 }, attr: function (a, c, d, e) { var g, h, i, j = a.nodeType; if (!!a && j !== 3 && j !== 8 && j !== 2) { if (e && c in f.attrFn) return f(a)[c](d); if (typeof a.getAttribute == "undefined") return f.prop(a, c, d); i = j !== 1 || !f.isXMLDoc(a), i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x : w)); if (d !== b) { if (d === null) { f.removeAttr(a, c); return } if (h && "set" in h && i && (g = h.set(a, d, c)) !== b) return g; a.setAttribute(c, "" + d); return d } if (h && "get" in h && i && (g = h.get(a, c)) !== null) return g; g = a.getAttribute(c); return g === null ? b : g } }, removeAttr: function (a, b) { var c, d, e, g, h, i = 0; if (b && a.nodeType === 1) { d = b.toLowerCase().split(p), g = d.length; for (; i < g; i++)e = d[i], e && (c = f.propFix[e] || e, h = u.test(e), h || f.attr(a, e, ""), a.removeAttribute(v ? e : c), h && c in a && (a[c] = !1)) } }, attrHooks: { type: { set: function (a, b) { if (r.test(a.nodeName) && a.parentNode) f.error("type property can't be changed"); else if (!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) { var c = a.value; a.setAttribute("type", b), c && (a.value = c); return b } } }, value: { get: function (a, b) { if (w && f.nodeName(a, "button")) return w.get(a, b); return b in a ? a.value : null }, set: function (a, b, c) { if (w && f.nodeName(a, "button")) return w.set(a, b, c); a.value = b } } }, propFix: { tabindex: "tabIndex", readonly: "readOnly", "for": "htmlFor", "class": "className", maxlength: "maxLength", cellspacing: "cellSpacing", cellpadding: "cellPadding", rowspan: "rowSpan", colspan: "colSpan", usemap: "useMap", frameborder: "frameBorder", contenteditable: "contentEditable" }, prop: function (a, c, d) { var e, g, h, i = a.nodeType; if (!!a && i !== 3 && i !== 8 && i !== 2) { h = i !== 1 || !f.isXMLDoc(a), h && (c = f.propFix[c] || c, g = f.propHooks[c]); return d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e : a[c] = d : g && "get" in g && (e = g.get(a, c)) !== null ? e : a[c] } }, propHooks: { tabIndex: { get: function (a) { var c = a.getAttributeNode("tabindex"); return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b } } } }), f.attrHooks.tabindex = f.propHooks.tabIndex, x = { get: function (a, c) { var d, e = f.prop(a, c); return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b }, set: function (a, b, c) { var d; b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())); return c } }, v || (y = { name: !0, id: !0, coords: !0 }, w = f.valHooks.button = { get: function (a, c) { var d; d = a.getAttributeNode(c); return d && (y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b }, set: function (a, b, d) { var e = a.getAttributeNode(d); e || (e = c.createAttribute(d), a.setAttributeNode(e)); return e.nodeValue = b + "" } }, f.attrHooks.tabindex.set = w.set, f.each(["width", "height"], function (a, b) { f.attrHooks[b] = f.extend(f.attrHooks[b], { set: function (a, c) { if (c === "") { a.setAttribute(b, "auto"); return c } } }) }), f.attrHooks.contenteditable = { get: w.get, set: function (a, b, c) { b === "" && (b = "false"), w.set(a, b, c) } }), f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function (a, c) { f.attrHooks[c] = f.extend(f.attrHooks[c], { get: function (a) { var d = a.getAttribute(c, 2); return d === null ? b : d } }) }), f.support.style || (f.attrHooks.style = { get: function (a) { return a.style.cssText.toLowerCase() || b }, set: function (a, b) { return a.style.cssText = "" + b } }), f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, { get: function (a) { var b = a.parentNode; b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex); return null } })), f.support.enctype || (f.propFix.enctype = "encoding"), f.support.checkOn || f.each(["radio", "checkbox"], function () { f.valHooks[this] = { get: function (a) { return a.getAttribute("value") === null ? "on" : a.value } } }), f.each(["radio", "checkbox"], function () { f.valHooks[this] = f.extend(f.valHooks[this], { set: function (a, b) { if (f.isArray(b)) return a.checked = f.inArray(f(a).val(), b) >= 0 } }) }); var z = /^(?:textarea|input|select)$/i, A = /^([^\.]*)?(?:\.(.+))?$/, B = /(?:^|\s)hover(\.\S+)?\b/, C = /^key/, D = /^(?:mouse|contextmenu)|click/, E = /^(?:focusinfocus|focusoutblur)$/, F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, G = function (
            a) { var b = F.exec(a); b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)")); return b }, H = function (a, b) { var c = a.attributes || {}; return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value)) }, I = function (a) { return f.event.special.hover ? a : a.replace(B, "mouseenter$1 mouseleave$1") }; f.event = { add: function (a, c, d, e, g) { var h, i, j, k, l, m, n, o, p, q, r, s; if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) { d.handler && (p = d, d = p.handler, g = p.selector), d.guid || (d.guid = f.guid++), j = h.events, j || (h.events = j = {}), i = h.handle, i || (h.handle = i = function (a) { return typeof f != "undefined" && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b }, i.elem = a), c = f.trim(I(c)).split(" "); for (k = 0; k < c.length; k++) { l = A.exec(c[k]) || [], m = l[1], n = (l[2] || "").split(".").sort(), s = f.event.special[m] || {}, m = (g ? s.delegateType : s.bindType) || m, s = f.event.special[m] || {}, o = f.extend({ type: m, origType: l[1], data: e, handler: d, guid: d.guid, selector: g, quick: g && G(g), namespace: n.join(".") }, p), r = j[m]; if (!r) { r = j[m] = [], r.delegateCount = 0; if (!s.setup || s.setup.call(a, e, n, i) === !1) a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i) } s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), f.event.global[m] = !0 } a = null } }, global: {}, remove: function (a, b, c, d, e) { var g = f.hasData(a) && f._data(a), h, i, j, k, l, m, n, o, p, q, r, s; if (!!g && !!(o = g.events)) { b = f.trim(I(b || "")).split(" "); for (h = 0; h < b.length; h++) { i = A.exec(b[h]) || [], j = k = i[1], l = i[2]; if (!j) { for (j in o) f.event.remove(a, j + b[h], c, d, !0); continue } p = f.event.special[j] || {}, j = (d ? p.delegateType : p.bindType) || j, r = o[j] || [], m = r.length, l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null; for (n = 0; n < r.length; n++)s = r[n], (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s)); r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j]) } f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, ["events", "handle"], !0)) } }, customEvent: { getData: !0, setData: !0, changeData: !0 }, trigger: function (c, d, e, g) { if (!e || e.nodeType !== 3 && e.nodeType !== 8) { var h = c.type || c, i = [], j, k, l, m, n, o, p, q, r, s; if (E.test(h + f.event.triggered)) return; h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort()); if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return; c = typeof c == "object" ? c[f.expando] ? c : new f.Event(h, c) : new f.Event(h), c.type = h, c.isTrigger = !0, c.exclusive = k, c.namespace = i.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, o = h.indexOf(":") < 0 ? "on" + h : ""; if (!e) { j = f.cache; for (l in j) j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0); return } c.result = b, c.target || (c.target = e), d = d != null ? f.makeArray(d) : [], d.unshift(c), p = f.event.special[h] || {}; if (p.trigger && p.trigger.apply(e, d) === !1) return; r = [[e, p.bindType || h]]; if (!g && !p.noBubble && !f.isWindow(e)) { s = p.delegateType || h, m = E.test(s + h) ? e : e.parentNode, n = null; for (; m; m = m.parentNode)r.push([m, s]), n = m; n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s]) } for (l = 0; l < r.length && !c.isPropagationStopped(); l++)m = r[l][0], c.type = r[l][1], q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"), q && q.apply(m, d), q = o && m[o], q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault(); c.type = h, !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n)); return c.result } }, dispatch: function (c) { c = f.event.fix(c || a.event); var d = (f._data(this, "events") || {})[c.type] || [], e = d.delegateCount, g = [].slice.call(arguments, 0), h = !c.exclusive && !c.namespace, i = f.event.special[c.type] || {}, j = [], k, l, m, n, o, p, q, r, s, t, u; g[0] = c, c.delegateTarget = this; if (!i.preDispatch || i.preDispatch.call(this, c) !== !1) { if (e && (!c.button || c.type !== "click")) { n = f(this), n.context = this.ownerDocument || this; for (m = c.target; m != this; m = m.parentNode || this)if (m.disabled !== !0) { p = {}, r = [], n[0] = m; for (k = 0; k < e; k++)s = d[k], t = s.selector, p[t] === b && (p[t] = s.quick ? H(m, s.quick) : n.is(t)), p[t] && r.push(s); r.length && j.push({ elem: m, matches: r }) } } d.length > e && j.push({ elem: this, matches: d.slice(e) }); for (k = 0; k < j.length && !c.isPropagationStopped(); k++) { q = j[k], c.currentTarget = q.elem; for (l = 0; l < q.matches.length && !c.isImmediatePropagationStopped(); l++) { s = q.matches[l]; if (h || !c.namespace && !s.namespace || c.namespace_re && c.namespace_re.test(s.namespace)) c.data = s.data, c.handleObj = s, o = ((f.event.special[s.origType] || {}).handle || s.handler).apply(q.elem, g), o !== b && (c.result = o, o === !1 && (c.preventDefault(), c.stopPropagation())) } } i.postDispatch && i.postDispatch.call(this, c); return c.result } }, props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: { props: "char charCode key keyCode".split(" "), filter: function (a, b) { a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode); return a } }, mouseHooks: { props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (a, d) { var e, f, g, h = d.button, i = d.fromElement; a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0); return a } }, fix: function (a) { if (a[f.expando]) return a; var d, e, g = a, h = f.event.fixHooks[a.type] || {}, i = h.props ? this.props.concat(h.props) : this.props; a = f.Event(g); for (d = i.length; d;)e = i[--d], a[e] = g[e]; a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey); return h.filter ? h.filter(a, g) : a }, special: { ready: { setup: f.bindReady }, load: { noBubble: !0 }, focus: { delegateType: "focusin" }, blur: { delegateType: "focusout" }, beforeunload: { setup: function (a, b, c) { f.isWindow(this) && (this.onbeforeunload = c) }, teardown: function (a, b) { this.onbeforeunload === b && (this.onbeforeunload = null) } } }, simulate: function (a, b, c, d) { var e = f.extend(new f.Event, c, { type: a, isSimulated: !0, originalEvent: {} }); d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault() } }, f.event.handle = f.event.dispatch, f.removeEvent = c.removeEventListener ? function (a, b, c) { a.removeEventListener && a.removeEventListener(b, c, !1) } : function (a, b, c) { a.detachEvent && a.detachEvent("on" + b, c) }, f.Event = function (a, b) { if (!(this instanceof f.Event)) return new f.Event(a, b); a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K : J) : this.type = a, b && f.extend(this, b), this.timeStamp = a && a.timeStamp || f.now(), this[f.expando] = !0 }, f.Event.prototype = { preventDefault: function () { this.isDefaultPrevented = K; var a = this.originalEvent; !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1) }, stopPropagation: function () { this.isPropagationStopped = K; var a = this.originalEvent; !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0) }, stopImmediatePropagation: function () { this.isImmediatePropagationStopped = K, this.stopPropagation() }, isDefaultPrevented: J, isPropagationStopped: J, isImmediatePropagationStopped: J }, f.each({ mouseenter: "mouseover", mouseleave: "mouseout" }, function (a, b) { f.event.special[a] = { delegateType: b, bindType: b, handle: function (a) { var c = this, d = a.relatedTarget, e = a.handleObj, g = e.selector, h; if (!d || d !== c && !f.contains(c, d)) a.type = e.origType, h = e.handler.apply(this, arguments), a.type = b; return h } } }), f.support.submitBubbles || (f.event.special.submit = { setup: function () { if (f.nodeName(this, "form")) return !1; f.event.add(this, "click._submit keypress._submit", function (a) { var c = a.target, d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b; d && !d._submit_attached && (f.event.add(d, "submit._submit", function (a) { a._submit_bubble = !0 }), d._submit_attached = !0) }) }, postDispatch: function (a) { a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0)) }, teardown: function () { if (f.nodeName(this, "form")) return !1; f.event.remove(this, "._submit") } }), f.support.changeBubbles || (f.event.special.change = { setup: function () { if (z.test(this.nodeName)) { if (this.type === "checkbox" || this.type === "radio") f.event.add(this, "propertychange._change", function (a) { a.originalEvent.propertyName === "checked" && (this._just_changed = !0) }), f.event.add(this, "click._change", function (a) { this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0)) }); return !1 } f.event.add(this, "beforeactivate._change", function (a) { var b = a.target; z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change", function (a) { this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0) }), b._change_attached = !0) }) }, handle: function (a) { var b = a.target; if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments) }, teardown: function () { f.event.remove(this, "._change"); return z.test(this.nodeName) } }), f.support.focusinBubbles || f.each({ focus: "focusin", blur: "focusout" }, function (a, b) { var d = 0, e = function (a) { f.event.simulate(b, a.target, f.event.fix(a), !0) }; f.event.special[b] = { setup: function () { d++ === 0 && c.addEventListener(a, e, !0) }, teardown: function () { --d === 0 && c.removeEventListener(a, e, !0) } } }), f.fn.extend({ on: function (a, c, d, e, g) { var h, i; if (typeof a == "object") { typeof c != "string" && (d = d || c, c = b); for (i in a) this.on(i, c, d, a[i], g); return this } d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b)); if (e === !1) e = J; else if (!e) return this; g === 1 && (h = e, e = function (a) { f().off(a); return h.apply(this, arguments) }, e.guid = h.guid || (h.guid = f.guid++)); return this.each(function () { f.event.add(this, a, e, d, c) }) }, one: function (a, b, c, d) { return this.on(a, b, c, d, 1) }, off: function (a, c, d) { if (a && a.preventDefault && a.handleObj) { var e = a.handleObj; f(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler); return this } if (typeof a == "object") { for (var g in a) this.off(g, c, a[g]); return this } if (c === !1 || typeof c == "function") d = c, c = b; d === !1 && (d = J); return this.each(function () { f.event.remove(this, a, d, c) }) }, bind: function (a, b, c) { return this.on(a, null, b, c) }, unbind: function (a, b) { return this.off(a, null, b) }, live: function (a, b, c) { f(this.context).on(a, this.selector, b, c); return this }, die: function (a, b) { f(this.context).off(a, this.selector || "**", b); return this }, delegate: function (a, b, c, d) { return this.on(b, a, c, d) }, undelegate: function (a, b, c) { return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c) }, trigger: function (a, b) { return this.each(function () { f.event.trigger(a, b, this) }) }, triggerHandler: function (a, b) { if (this[0]) return f.event.trigger(a, b, this[0], !0) }, toggle: function (a) { var b = arguments, c = a.guid || f.guid++, d = 0, e = function (c) { var e = (f._data(this, "lastToggle" + a.guid) || 0) % d; f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(); return b[e].apply(this, arguments) || !1 }; e.guid = c; while (d < b.length) b[d++].guid = c; return this.click(e) }, hover: function (a, b) { return this.mouseenter(a).mouseleave(b || a) } }), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) { f.fn[b] = function (a, c) { c == null && (c = a, a = null); return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b) }, f.attrFn && (f.attrFn[b] = !0), C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks), D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks) }), function () { function x(a, b, c, e, f, g) { for (var h = 0, i = e.length; h < i; h++) { var j = e[h]; if (j) { var k = !1; j = j[a]; while (j) { if (j[d] === c) { k = e[j.sizset]; break } if (j.nodeType === 1) { g || (j[d] = c, j.sizset = h); if (typeof b != "string") { if (j === b) { k = !0; break } } else if (m.filter(b, [j]).length > 0) { k = j; break } } j = j[a] } e[h] = k } } } function w(a, b, c, e, f, g) { for (var h = 0, i = e.length; h < i; h++) { var j = e[h]; if (j) { var k = !1; j = j[a]; while (j) { if (j[d] === c) { k = e[j.sizset]; break } j.nodeType === 1 && !g && (j[d] = c, j.sizset = h); if (j.nodeName.toLowerCase() === b) { k = j; break } j = j[a] } e[h] = k } } } var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, d = "sizcache" + (Math.random() + "").replace(".", ""), e = 0, g = Object.prototype.toString, h = !1, i = !0, j = /\\/g, k = /\r\n/g, l = /\W/;[0, 0].sort(function () { i = !1; return 0 }); var m = function (b, d, e, f) { e = e || [], d = d || c; var h = d; if (d.nodeType !== 1 && d.nodeType !== 9) return []; if (!b || typeof b != "string") return e; var i, j, k, l, n, q, r, t, u = !0, v = m.isXML(d), w = [], x = b; do { a.exec(""), i = a.exec(x); if (i) { x = i[3], w.push(i[1]); if (i[2]) { l = i[3]; break } } } while (i); if (w.length > 1 && p.exec(b)) if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f); else { j = o.relative[w[0]] ? [d] : m(w.shift(), d); while (w.length) b = w.shift(), o.relative[b] && (b += w.shift()), j = y(b, j, f) } else { !f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]); if (d) { n = f ? { expr: w.pop(), set: s(f) } : m.find(w.pop(), w.length === 1 && (w[0] === "~" || w[0] === "+") && d.parentNode ? d.parentNode : d, v), j = n.expr ? m.filter(n.expr, n.set) : n.set, w.length > 0 ? k = s(j) : u = !1; while (w.length) q = w.pop(), r = q, o.relative[q] ? r = w.pop() : q = "", r == null && (r = d), o.relative[q](k, r, v) } else k = w = [] } k || (k = j), k || m.error(q || b); if (g.call(k) === "[object Array]") if (!u) e.push.apply(e, k); else if (d && d.nodeType === 1) for (t = 0; k[t] != null; t++)k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t]); else for (t = 0; k[t] != null; t++)k[t] && k[t].nodeType === 1 && e.push(j[t]); else s(k, e); l && (m(l, h, e, f), m.uniqueSort(e)); return e }; m.uniqueSort = function (a) { if (u) { h = i, a.sort(u); if (h) for (var b = 1; b < a.length; b++)a[b] === a[b - 1] && a.splice(b--, 1) } return a }, m.matches = function (a, b) { return m(a, null, null, b) }, m.matchesSelector = function (a, b) { return m(b, null, null, [a]).length > 0 }, m.find = function (a, b, c) { var d, e, f, g, h, i; if (!a) return []; for (e = 0, f = o.order.length; e < f; e++) { h = o.order[e]; if (g = o.leftMatch[h].exec(a)) { i = g[1], g.splice(1, 1); if (i.substr(i.length - 1) !== "\\") { g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c); if (d != null) { a = a.replace(o.match[h], ""); break } } } } d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []); return { set: d, expr: a } }, m.filter = function (a, c, d, e) { var f, g, h, i, j, k, l, n, p, q = a, r = [], s = c, t = c && c[0] && m.isXML(c[0]); while (a && c.length) { for (h in o.filter) if ((f = o.leftMatch[h].exec(a)) != null && f[2]) { k = o.filter[h], l = f[1], g = !1, f.splice(1, 1); if (l.substr(l.length - 1) === "\\") continue; s === r && (r = []); if (o.preFilter[h]) { f = o.preFilter[h](f, s, d, r, e, t); if (!f) g = i = !0; else if (f === !0) continue } if (f) for (n = 0; (j = s[n]) != null; n++)j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0)); if (i !== b) { d || (s = r), a = a.replace(o.match[h], ""); if (!g) return []; break } } if (a === q) if (g == null) m.error(a); else break; q = a } return s }, m.error = function (a) { throw new Error("Syntax error, unrecognized expression: " + a) }; var n = m.getText = function (a) { var b, c, d = a.nodeType, e = ""; if (d) { if (d === 1 || d === 9 || d === 11) { if (typeof a.textContent == "string") return a.textContent; if (typeof a.innerText == "string") return a.innerText.replace(k, ""); for (a = a.firstChild; a; a = a.nextSibling)e += n(a) } else if (d === 3 || d === 4) return a.nodeValue } else for (b = 0; c = a[b]; b++)c.nodeType !== 8 && (e += n(c)); return e }, o = m.selectors = { order: ["ID", "NAME", "TAG"], match: { ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/, NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/, ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/, TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/, CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/, POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/, PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/ }, leftMatch: {}, attrMap: { "class": "className", "for": "htmlFor" }, attrHandle: { href: function (a) { return a.getAttribute("href") }, type: function (a) { return a.getAttribute("type") } }, relative: { "+": function (a, b) { var c = typeof b == "string", d = c && !l.test(b), e = c && !d; d && (b = b.toLowerCase()); for (var f = 0, g = a.length, h; f < g; f++)if (h = a[f]) { while ((h = h.previousSibling) && h.nodeType !== 1); a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b } e && m.filter(b, a, !0) }, ">": function (a, b) { var c, d = typeof b == "string", e = 0, f = a.length; if (d && !l.test(b)) { b = b.toLowerCase(); for (; e < f; e++) { c = a[e]; if (c) { var g = c.parentNode; a[e] = g.nodeName.toLowerCase() === b ? g : !1 } } } else { for (; e < f; e++)c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b); d && m.filter(b, a, !0) } }, "": function (a, b, c) { var d, f = e++, g = x; typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("parentNode", b, f, a, d, c) }, "~": function (a, b, c) { var d, f = e++, g = x; typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("previousSibling", b, f, a, d, c) } }, find: { ID: function (a, b, c) { if (typeof b.getElementById != "undefined" && !c) { var d = b.getElementById(a[1]); return d && d.parentNode ? [d] : [] } }, NAME: function (a, b) { if (typeof b.getElementsByName != "undefined") { var c = [], d = b.getElementsByName(a[1]); for (var e = 0, f = d.length; e < f; e++)d[e].getAttribute("name") === a[1] && c.push(d[e]); return c.length === 0 ? null : c } }, TAG: function (a, b) { if (typeof b.getElementsByTagName != "undefined") return b.getElementsByTagName(a[1]) } }, preFilter: { CLASS: function (a, b, c, d, e, f) { a = " " + a[1].replace(j, "") + " "; if (f) return a; for (var g = 0, h; (h = b[g]) != null; g++)h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1)); return !1 }, ID: function (a) { return a[1].replace(j, "") }, TAG: function (a, b) { return a[1].replace(j, "").toLowerCase() }, CHILD: function (a) { if (a[1] === "nth") { a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, ""); var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]); a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0 } else a[2] && m.error(a[0]); a[0] = e++; return a }, ATTR: function (a, b, c, d, e, f) { var g = a[1] = a[1].replace(j, ""); !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " "); return a }, PSEUDO: function (b, c, d, e, f) { if (b[1] === "not") if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3])) b[3] = m(b[3], null, null, c); else { var g = m.filter(b[3], c, d, !0 ^ f); d || e.push.apply(e, g); return !1 } else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) return !0; return b }, POS: function (a) { a.unshift(!0); return a } }, filters: { enabled: function (a) { return a.disabled === !1 && a.type !== "hidden" }, disabled: function (a) { return a.disabled === !0 }, checked: function (a) { return a.checked === !0 }, selected: function (a) { a.parentNode && a.parentNode.selectedIndex; return a.selected === !0 }, parent: function (a) { return !!a.firstChild }, empty: function (a) { return !a.firstChild }, has: function (a, b, c) { return !!m(c[3], a).length }, header: function (a) { return /h\d/i.test(a.nodeName) }, text: function (a) { var b = a.getAttribute("type"), c = a.type; return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null) }, radio: function (a) { return a.nodeName.toLowerCase() === "input" && "radio" === a.type }, checkbox: function (a) { return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type }, file: function (a) { return a.nodeName.toLowerCase() === "input" && "file" === a.type }, password: function (a) { return a.nodeName.toLowerCase() === "input" && "password" === a.type }, submit: function (a) { var b = a.nodeName.toLowerCase(); return (b === "input" || b === "button") && "submit" === a.type }, image: function (a) { return a.nodeName.toLowerCase() === "input" && "image" === a.type }, reset: function (a) { var b = a.nodeName.toLowerCase(); return (b === "input" || b === "button") && "reset" === a.type }, button: function (a) { var b = a.nodeName.toLowerCase(); return b === "input" && "button" === a.type || b === "button" }, input: function (a) { return /input|select|textarea|button/i.test(a.nodeName) }, focus: function (a) { return a === a.ownerDocument.activeElement } }, setFilters: { first: function (a, b) { return b === 0 }, last: function (a, b, c, d) { return b === d.length - 1 }, even: function (a, b) { return b % 2 === 0 }, odd: function (a, b) { return b % 2 === 1 }, lt: function (a, b, c) { return b < c[3] - 0 }, gt: function (a, b, c) { return b > c[3] - 0 }, nth: function (a, b, c) { return c[3] - 0 === b }, eq: function (a, b, c) { return c[3] - 0 === b } }, filter: { PSEUDO: function (a, b, c, d) { var e = b[1], f = o.filters[e]; if (f) return f(a, c, b, d); if (e === "contains") return (a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0; if (e === "not") { var g = b[3]; for (var h = 0, i = g.length; h < i; h++)if (g[h] === a) return !1; return !0 } m.error(e) }, CHILD: function (a, b) { var c, e, f, g, h, i, j, k = b[1], l = a; switch (k) { case "only": case "first": while (l = l.previousSibling) if (l.nodeType === 1) return !1; if (k === "first") return !0; l = a; case "last": while (l = l.nextSibling) if (l.nodeType === 1) return !1; return !0; case "nth": c = b[2], e = b[3]; if (c === 1 && e === 0) return !0; f = b[0], g = a.parentNode; if (g && (g[d] !== f || !a.nodeIndex)) { i = 0; for (l = g.firstChild; l; l = l.nextSibling)l.nodeType === 1 && (l.nodeIndex = ++i); g[d] = f } j = a.nodeIndex - e; return c === 0 ? j === 0 : j % c === 0 && j / c >= 0 } }, ID: function (a, b) { return a.nodeType === 1 && a.getAttribute("id") === b }, TAG: function (a, b) { return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b }, CLASS: function (a, b) { return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1 }, ATTR: function (a, b) { var c = b[1], d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c), e = d + "", f = b[2], g = b[4]; return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1 }, POS: function (a, b, c, d) { var e = b[2], f = o.setFilters[e]; if (f) return f(a, c, b, d) } } }, p = o.match.POS, q = function (a, b) { return "\\" + (b - 0 + 1) }; for (var r in o.match) o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q)); o.match.globalPOS = p; var s = function (a, b) { a = Array.prototype.slice.call(a, 0); if (b) { b.push.apply(b, a); return b } return a }; try { Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType } catch (t) { s = function (a, b) { var c = 0, d = b || []; if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a); else if (typeof a.length == "number") for (var e = a.length; c < e; c++)d.push(a[c]); else for (; a[c]; c++)d.push(a[c]); return d } } var u, v; c.documentElement.compareDocumentPosition ? u = function (a, b) { if (a === b) { h = !0; return 0 } if (!a.compareDocumentPosition || !b.compareDocumentPosition) return a.compareDocumentPosition ? -1 : 1; return a.compareDocumentPosition(b) & 4 ? -1 : 1 } : (u = function (a, b) { if (a === b) { h = !0; return 0 } if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex; var c, d, e = [], f = [], g = a.parentNode, i = b.parentNode, j = g; if (g === i) return v(a, b); if (!g) return -1; if (!i) return 1; while (j) e.unshift(j), j = j.parentNode; j = i; while (j) f.unshift(j), j = j.parentNode; c = e.length, d = f.length; for (var k = 0; k < c && k < d; k++)if (e[k] !== f[k]) return v(e[k], f[k]); return k === c ? v(a, f[k], -1) : v(e[k], b, 1) }, v = function (a, b, c) { if (a === b) return c; var d = a.nextSibling; while (d) { if (d === b) return -1; d = d.nextSibling } return 1 }), function () { var a = c.createElement("div"), d = "script" + (new Date).getTime(), e = c.documentElement; a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (o.find.ID = function (a, c, d) { if (typeof c.getElementById != "undefined" && !d) { var e = c.getElementById(a[1]); return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : [] } }, o.filter.ID = function (a, b) { var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id"); return a.nodeType === 1 && c && c.nodeValue === b }), e.removeChild(a), e = a = null }(), function () { var a = c.createElement("div"); a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function (a, b) { var c = b.getElementsByTagName(a[1]); if (a[1] === "*") { var d = []; for (var e = 0; c[e]; e++)c[e].nodeType === 1 && d.push(c[e]); c = d } return c }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function (a) { return a.getAttribute("href", 2) }), a = null }(), c.querySelectorAll && function () { var a = m, b = c.createElement("div"), d = "__sizzle__"; b.innerHTML = "<p class='TEST'></p>"; if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) { m = function (b, e, f, g) { e = e || c; if (!g && !m.isXML(e)) { var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b); if (h && (e.nodeType === 1 || e.nodeType === 9)) { if (h[1]) return s(e.getElementsByTagName(b), f); if (h[2] && o.find.CLASS && e.getElementsByClassName) return s(e.getElementsByClassName(h[2]), f) } if (e.nodeType === 9) { if (b === "body" && e.body) return s([e.body], f); if (h && h[3]) { var i = e.getElementById(h[3]); if (!i || !i.parentNode) return s([], f); if (i.id === h[3]) return s([i], f) } try { return s(e.querySelectorAll(b), f) } catch (j) { } } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") { var k = e, l = e.getAttribute("id"), n = l || d, p = e.parentNode, q = /^\s*[+~]/.test(b); l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n), q && p && (e = e.parentNode); try { if (!q || p) return s(e.querySelectorAll("[id='" + n + "'] " + b), f) } catch (r) { } finally { l || k.removeAttribute("id") } } } return a(b, e, f, g) }; for (var e in a) m[e] = a[e]; b = null } }(), function () { var a = c.documentElement, b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector; if (b) { var d = !b.call(c.createElement("div"), "div"), e = !1; try { b.call(c.documentElement, "[test!='']:sizzle") } catch (f) { e = !0 } m.matchesSelector = function (a, c) { c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']"); if (!m.isXML(a)) try { if (e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) { var f = b.call(a, c); if (f || !d || a.document && a.document.nodeType !== 11) return f } } catch (g) { } return m(c, null, null, [a]).length > 0 } } }(), function () { var a = c.createElement("div"); a.innerHTML = "<div class='test e'></div><div class='test'></div>"; if (!!a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) { a.lastChild.className = "e"; if (a.getElementsByClassName("e").length === 1) return; o.order.splice(1, 0, "CLASS"), o.find.CLASS = function (a, b, c) { if (typeof b.getElementsByClassName != "undefined" && !c) return b.getElementsByClassName(a[1]) }, a = null } }(), c.documentElement.contains ? m.contains = function (a, b) { return a !== b && (a.contains ? a.contains(b) : !0) } : c.documentElement.compareDocumentPosition ? m.contains = function (a, b) { return !!(a.compareDocumentPosition(b) & 16) } : m.contains = function () { return !1 }, m.isXML = function (a) { var b = (a ? a.ownerDocument || a : 0).documentElement; return b ? b.nodeName !== "HTML" : !1 }; var y = function (a, b, c) { var d, e = [], f = "", g = b.nodeType ? [b] : b; while (d = o.match.PSEUDO.exec(a)) f += d[0], a = a.replace(o.match.PSEUDO, ""); a = o.relative[a] ? a + "*" : a; for (var h = 0, i = g.length; h < i; h++)m(a, g[h], e, c); return m.filter(f, e) }; m.attr = f.attr, m.selectors.attrMap = {}, f.find = m, f.expr = m.selectors, f.expr[":"] = f.expr.filters, f.unique = m.uniqueSort, f.text = m.getText, f.isXMLDoc = m.isXML, f.contains = m.contains }(); var L = /Until$/, M = /^(?:parents|prevUntil|prevAll)/, N = /,/, O = /^.[^:#\[\.,]*$/, P = Array.prototype.slice, Q = f.expr.match.globalPOS, R = { children: !0, contents: !0, next: !0, prev: !0 }; f.fn.extend({ find: function (a) { var b = this, c, d; if (typeof a != "string") return f(a).filter(function () { for (c = 0, d = b.length; c < d; c++)if (f.contains(b[c], this)) return !0 }); var e = this.pushStack("", "find", a), g, h, i; for (c = 0, d = this.length; c < d; c++) { g = e.length, f.find(a, this[c], e); if (c > 0) for (h = g; h < e.length; h++)for (i = 0; i < g; i++)if (e[i] === e[h]) { e.splice(h--, 1); break } } return e }, has: function (a) { var b = f(a); return this.filter(function () { for (var a = 0, c = b.length; a < c; a++)if (f.contains(this, b[a])) return !0 }) }, not: function (a) { return this.pushStack(T(this, a, !1), "not", a) }, filter: function (a) { return this.pushStack(T(this, a, !0), "filter", a) }, is: function (a) { return !!a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0) }, closest: function (a, b) { var c = [], d, e, g = this[0]; if (f.isArray(a)) { var h = 1; while (g && g.ownerDocument && g !== b) { for (d = 0; d < a.length; d++)f(g).is(a[d]) && c.push({ selector: a[d], elem: g, level: h }); g = g.parentNode, h++ } return c } var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0; for (d = 0, e = this.length; d < e; d++) { g = this[d]; while (g) { if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) { c.push(g); break } g = g.parentNode; if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break } } c = c.length > 1 ? f.unique(c) : c; return this.pushStack(c, "closest", a) }, index: function (a) { if (!a) return this[0] && this[0].parentNode ? this.prevAll().length : -1; if (typeof a == "string") return f.inArray(this[0], f(a)); return f.inArray(a.jquery ? a[0] : a, this) }, add: function (a, b) { var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a), d = f.merge(this.get(), c); return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d)) }, andSelf: function () { return this.add(this.prevObject) } }), f.each({ parent: function (a) { var b = a.parentNode; return b && b.nodeType !== 11 ? b : null }, parents: function (a) { return f.dir(a, "parentNode") }, parentsUntil: function (a, b, c) { return f.dir(a, "parentNode", c) }, next: function (a) { return f.nth(a, 2, "nextSibling") }, prev: function (a) { return f.nth(a, 2, "previousSibling") }, nextAll: function (a) { return f.dir(a, "nextSibling") }, prevAll: function (a) { return f.dir(a, "previousSibling") }, nextUntil: function (a, b, c) { return f.dir(a, "nextSibling", c) }, prevUntil: function (a, b, c) { return f.dir(a, "previousSibling", c) }, siblings: function (a) { return f.sibling((a.parentNode || {}).firstChild, a) }, children: function (a) { return f.sibling(a.firstChild) }, contents: function (a) { return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes) } }, function (a, b) { f.fn[a] = function (c, d) { var e = f.map(this, b, c); L.test(a) || (d = c), d && typeof d == "string" && (e = f.filter(d, e)), e = this.length > 1 && !R[a] ? f.unique(e) : e, (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse()); return this.pushStack(e, a, P.call(arguments).join(",")) } }), f.extend({ filter: function (a, b, c) { c && (a = ":not(" + a + ")"); return b.length === 1 ? f.find.matchesSelector(b[0], a) ? [b[0]] : [] : f.find.matches(a, b) }, dir: function (a, c, d) { var e = [], g = a[c]; while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) g.nodeType === 1 && e.push(g), g = g[c]; return e }, nth: function (a, b, c, d) { b = b || 1; var e = 0; for (; a; a = a[c])if (a.nodeType === 1 && ++e === b) break; return a }, sibling: function (a, b) { var c = []; for (; a; a = a.nextSibling)a.nodeType === 1 && a !== b && c.push(a); return c } }); var V = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", W = / jQuery\d+="(?:\d+|null)"/g, X = /^\s+/, Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, Z = /<([\w:]+)/, $ = /<tbody/i, _ = /<|&#?\w+;/, ba = /<(?:script|style)/i, bb = /<(?:script|object|embed|option|style)/i, bc = new RegExp("<(?:" + V + ")[\\s/>]", "i"), bd = /checked\s*(?:[^=]|=\s*.checked.)/i, be = /\/(java|ecma)script/i, bf = /^\s*<!(?:\[CDATA\[|\-\-)/, bg = { option: [1, "<select multiple='multiple'>", "</select>"], legend: [1, "<fieldset>", "</fieldset>"], thead: [1, "<table>", "</table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], area: [1, "<map>", "</map>"], _default: [0, "", ""] }, bh = U(c); bg.optgroup = bg.option, bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead, bg.th = bg.td, f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]), f.fn.extend({
                text: function (a) { return f.access(this, function (a) { return a === b ? f.text(this) : this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a)) }, null, a, arguments.length) }, wrapAll: function (a) { if (f.isFunction(a)) return this.each(function (b) { f(this).wrapAll(a.call(this, b)) }); if (this[0]) { var b = f(a, this[0].ownerDocument).eq(0).clone(!0); this[0].parentNode && b.insertBefore(this[0]), b.map(function () { var a = this; while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild; return a }).append(this) } return this }, wrapInner: function (a) { if (f.isFunction(a)) return this.each(function (b) { f(this).wrapInner(a.call(this, b)) }); return this.each(function () { var b = f(this), c = b.contents(); c.length ? c.wrapAll(a) : b.append(a) }) }, wrap: function (a) { var b = f.isFunction(a); return this.each(function (c) { f(this).wrapAll(b ? a.call(this, c) : a) }) }, unwrap: function () { return this.parent().each(function () { f.nodeName(this, "body") || f(this).replaceWith(this.childNodes) }).end() }, append: function () { return this.domManip(arguments, !0, function (a) { this.nodeType === 1 && this.appendChild(a) }) }, prepend: function () { return this.domManip(arguments, !0, function (a) { this.nodeType === 1 && this.insertBefore(a, this.firstChild) }) }, before: function () {
                    if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function (a) { this.parentNode.insertBefore(a, this) }); if (arguments.length) {
                        var a = f
                            .clean(arguments); a.push.apply(a, this.toArray()); return this.pushStack(a, "before", arguments)
                    }
                }, after: function () { if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function (a) { this.parentNode.insertBefore(a, this.nextSibling) }); if (arguments.length) { var a = this.pushStack(this, "after", arguments); a.push.apply(a, f.clean(arguments)); return a } }, remove: function (a, b) { for (var c = 0, d; (d = this[c]) != null; c++)if (!a || f.filter(a, [d]).length) !b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])), d.parentNode && d.parentNode.removeChild(d); return this }, empty: function () { for (var a = 0, b; (b = this[a]) != null; a++) { b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*")); while (b.firstChild) b.removeChild(b.firstChild) } return this }, clone: function (a, b) { a = a == null ? !1 : a, b = b == null ? a : b; return this.map(function () { return f.clone(this, a, b) }) }, html: function (a) { return f.access(this, function (a) { var c = this[0] || {}, d = 0, e = this.length; if (a === b) return c.nodeType === 1 ? c.innerHTML.replace(W, "") : null; if (typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]) { a = a.replace(Y, "<$1></$2>"); try { for (; d < e; d++)c = this[d] || {}, c.nodeType === 1 && (f.cleanData(c.getElementsByTagName("*")), c.innerHTML = a); c = 0 } catch (g) { } } c && this.empty().append(a) }, null, a, arguments.length) }, replaceWith: function (a) { if (this[0] && this[0].parentNode) { if (f.isFunction(a)) return this.each(function (b) { var c = f(this), d = c.html(); c.replaceWith(a.call(this, b, d)) }); typeof a != "string" && (a = f(a).detach()); return this.each(function () { var b = this.nextSibling, c = this.parentNode; f(this).remove(), b ? f(b).before(a) : f(c).append(a) }) } return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this }, detach: function (a) { return this.remove(a, !0) }, domManip: function (a, c, d) { var e, g, h, i, j = a[0], k = []; if (!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) return this.each(function () { f(this).domManip(a, c, d, !0) }); if (f.isFunction(j)) return this.each(function (e) { var g = f(this); a[0] = j.call(this, e, c ? g.html() : b), g.domManip(a, c, d) }); if (this[0]) { i = j && j.parentNode, f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = { fragment: i } : e = f.buildFragment(a, this, k), h = e.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild; if (g) { c = c && f.nodeName(g, "tr"); for (var l = 0, m = this.length, n = m - 1; l < m; l++)d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h) } k.length && f.each(k, function (a, b) { b.src ? f.ajax({ type: "GET", global: !1, url: b.src, async: !1, dataType: "script" }) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b) }) } return this }
            }), f.buildFragment = function (a, b, d) { var e, g, h, i, j = a[0]; b && b[0] && (i = b[0].ownerDocument || b[0]), i.createDocumentFragment || (i = c), a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)), e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)), g && (f.fragments[j] = h ? e : 1); return { fragment: e, cacheable: g } }, f.fragments = {}, f.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (a, b) { f.fn[a] = function (c) { var d = [], e = f(c), g = this.length === 1 && this[0].parentNode; if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) { e[b](this[0]); return this } for (var h = 0, i = e.length; h < i; h++) { var j = (h > 0 ? this.clone(!0) : this).get(); f(e[h])[b](j), d = d.concat(j) } return this.pushStack(d, a, e.selector) } }), f.extend({ clone: function (a, b, c) { var d, e, g, h = f.support.html5Clone || f.isXMLDoc(a) || !bc.test("<" + a.nodeName + ">") ? a.cloneNode(!0) : bo(a); if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) { bk(a, h), d = bl(a), e = bl(h); for (g = 0; d[g]; ++g)e[g] && bk(d[g], e[g]) } if (b) { bj(a, h); if (c) { d = bl(a), e = bl(h); for (g = 0; d[g]; ++g)bj(d[g], e[g]) } } d = e = null; return h }, clean: function (a, b, d, e) { var g, h, i, j = []; b = b || c, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c); for (var k = 0, l; (l = a[k]) != null; k++) { typeof l == "number" && (l += ""); if (!l) continue; if (typeof l == "string") if (!_.test(l)) l = b.createTextNode(l); else { l = l.replace(Y, "<$1></$2>"); var m = (Z.exec(l) || ["", ""])[1].toLowerCase(), n = bg[m] || bg._default, o = n[0], p = b.createElement("div"), q = bh.childNodes, r; b === c ? bh.appendChild(p) : U(b).appendChild(p), p.innerHTML = n[1] + l + n[2]; while (o--) p = p.lastChild; if (!f.support.tbody) { var s = $.test(l), t = m === "table" && !s ? p.firstChild && p.firstChild.childNodes : n[1] === "<table>" && !s ? p.childNodes : []; for (i = t.length - 1; i >= 0; --i)f.nodeName(t[i], "tbody") && !t[i].childNodes.length && t[i].parentNode.removeChild(t[i]) } !f.support.leadingWhitespace && X.test(l) && p.insertBefore(b.createTextNode(X.exec(l)[0]), p.firstChild), l = p.childNodes, p && (p.parentNode.removeChild(p), q.length > 0 && (r = q[q.length - 1], r && r.parentNode && r.parentNode.removeChild(r))) } var u; if (!f.support.appendChecked) if (l[0] && typeof (u = l.length) == "number") for (i = 0; i < u; i++)bn(l[i]); else bn(l); l.nodeType ? j.push(l) : j = f.merge(j, l) } if (d) { g = function (a) { return !a.type || be.test(a.type) }; for (k = 0; j[k]; k++) { h = j[k]; if (e && f.nodeName(h, "script") && (!h.type || be.test(h.type))) e.push(h.parentNode ? h.parentNode.removeChild(h) : h); else { if (h.nodeType === 1) { var v = f.grep(h.getElementsByTagName("script"), g); j.splice.apply(j, [k + 1, 0].concat(v)) } d.appendChild(h) } } } return j }, cleanData: function (a) { var b, c, d = f.cache, e = f.event.special, g = f.support.deleteExpando; for (var h = 0, i; (i = a[h]) != null; h++) { if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue; c = i[f.expando]; if (c) { b = d[c]; if (b && b.events) { for (var j in b.events) e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle); b.handle && (b.handle.elem = null) } g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c] } } } }); var bp = /alpha\([^)]*\)/i, bq = /opacity=([^)]*)/, br = /([A-Z]|^ms)/g, bs = /^[\-+]?(?:\d*\.)?\d+$/i, bt = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i, bu = /^([\-+])=([\-+.\de]+)/, bv = /^margin/, bw = { position: "absolute", visibility: "hidden", display: "block" }, bx = ["Top", "Right", "Bottom", "Left"], by, bz, bA; f.fn.css = function (a, c) { return f.access(this, function (a, c, d) { return d !== b ? f.style(a, c, d) : f.css(a, c) }, a, c, arguments.length > 1) }, f.extend({ cssHooks: { opacity: { get: function (a, b) { if (b) { var c = by(a, "opacity"); return c === "" ? "1" : c } return a.style.opacity } } }, cssNumber: { fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: { "float": f.support.cssFloat ? "cssFloat" : "styleFloat" }, style: function (a, c, d, e) { if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) { var g, h, i = f.camelCase(c), j = a.style, k = f.cssHooks[i]; c = f.cssProps[i] || i; if (d === b) { if (k && "get" in k && (g = k.get(a, !1, e)) !== b) return g; return j[c] } h = typeof d, h === "string" && (g = bu.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number"); if (d == null || h === "number" && isNaN(d)) return; h === "number" && !f.cssNumber[i] && (d += "px"); if (!k || !("set" in k) || (d = k.set(a, d)) !== b) try { j[c] = d } catch (l) { } } }, css: function (a, c, d) { var e, g; c = f.camelCase(c), g = f.cssHooks[c], c = f.cssProps[c] || c, c === "cssFloat" && (c = "float"); if (g && "get" in g && (e = g.get(a, !0, d)) !== b) return e; if (by) return by(a, c) }, swap: function (a, b, c) { var d = {}, e, f; for (f in b) d[f] = a.style[f], a.style[f] = b[f]; e = c.call(a); for (f in b) a.style[f] = d[f]; return e } }), f.curCSS = f.css, c.defaultView && c.defaultView.getComputedStyle && (bz = function (a, b) { var c, d, e, g, h = a.style; b = b.replace(br, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b))), !f.support.pixelMargin && e && bv.test(b) && bt.test(c) && (g = h.width, h.width = c, c = e.width, h.width = g); return c }), c.documentElement.currentStyle && (bA = function (a, b) { var c, d, e, f = a.currentStyle && a.currentStyle[b], g = a.style; f == null && g && (e = g[b]) && (f = e), bt.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d)); return f === "" ? "auto" : f }), by = bz || bA, f.each(["height", "width"], function (a, b) { f.cssHooks[b] = { get: function (a, c, d) { if (c) return a.offsetWidth !== 0 ? bB(a, b, d) : f.swap(a, bw, function () { return bB(a, b, d) }) }, set: function (a, b) { return bs.test(b) ? b + "px" : b } } }), f.support.opacity || (f.cssHooks.opacity = { get: function (a, b) { return bq.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : "" }, set: function (a, b) { var c = a.style, d = a.currentStyle, e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "", g = d && d.filter || c.filter || ""; c.zoom = 1; if (b >= 1 && f.trim(g.replace(bp, "")) === "") { c.removeAttribute("filter"); if (d && !d.filter) return } c.filter = bp.test(g) ? g.replace(bp, e) : g + " " + e } }), f(function () { f.support.reliableMarginRight || (f.cssHooks.marginRight = { get: function (a, b) { return f.swap(a, { display: "inline-block" }, function () { return b ? by(a, "margin-right") : a.style.marginRight }) } }) }), f.expr && f.expr.filters && (f.expr.filters.hidden = function (a) { var b = a.offsetWidth, c = a.offsetHeight; return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none" }, f.expr.filters.visible = function (a) { return !f.expr.filters.hidden(a) }), f.each({ margin: "", padding: "", border: "Width" }, function (a, b) { f.cssHooks[a + b] = { expand: function (c) { var d, e = typeof c == "string" ? c.split(" ") : [c], f = {}; for (d = 0; d < 4; d++)f[a + bx[d] + b] = e[d] || e[d - 2] || e[0]; return f } } }); var bC = /%20/g, bD = /\[\]$/, bE = /\r?\n/g, bF = /#.*$/, bG = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, bH = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, bI = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, bJ = /^(?:GET|HEAD)$/, bK = /^\/\//, bL = /\?/, bM = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, bN = /^(?:select|textarea)/i, bO = /\s+/, bP = /([?&])_=[^&]*/, bQ = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, bR = f.fn.load, bS = {}, bT = {}, bU, bV, bW = ["*/"] + ["*"]; try { bU = e.href } catch (bX) { bU = c.createElement("a"), bU.href = "", bU = bU.href } bV = bQ.exec(bU.toLowerCase()) || [], f.fn.extend({ load: function (a, c, d) { if (typeof a != "string" && bR) return bR.apply(this, arguments); if (!this.length) return this; var e = a.indexOf(" "); if (e >= 0) { var g = a.slice(e, a.length); a = a.slice(0, e) } var h = "GET"; c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST")); var i = this; f.ajax({ url: a, type: h, dataType: "html", data: c, complete: function (a, b, c) { c = a.responseText, a.isResolved() && (a.done(function (a) { c = a }), i.html(g ? f("<div>").append(c.replace(bM, "")).find(g) : c)), d && i.each(d, [c, b, a]) } }); return this }, serialize: function () { return f.param(this.serializeArray()) }, serializeArray: function () { return this.map(function () { return this.elements ? f.makeArray(this.elements) : this }).filter(function () { return this.name && !this.disabled && (this.checked || bN.test(this.nodeName) || bH.test(this.type)) }).map(function (a, b) { var c = f(this).val(); return c == null ? null : f.isArray(c) ? f.map(c, function (a, c) { return { name: b.name, value: a.replace(bE, "\r\n") } }) : { name: b.name, value: c.replace(bE, "\r\n") } }).get() } }), f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (a, b) { f.fn[b] = function (a) { return this.on(b, a) } }), f.each(["get", "post"], function (a, c) { f[c] = function (a, d, e, g) { f.isFunction(d) && (g = g || e, e = d, d = b); return f.ajax({ type: c, url: a, data: d, success: e, dataType: g }) } }), f.extend({ getScript: function (a, c) { return f.get(a, b, c, "script") }, getJSON: function (a, b, c) { return f.get(a, b, c, "json") }, ajaxSetup: function (a, b) { b ? b$(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings), b$(a, b); return a }, ajaxSettings: { url: bU, isLocal: bI.test(bV[1]), global: !0, type: "GET", contentType: "application/x-www-form-urlencoded; charset=UTF-8", processData: !0, async: !0, accepts: { xml: "application/xml, text/xml", html: "text/html", text: "text/plain", json: "application/json, text/javascript", "*": bW }, contents: { xml: /xml/, html: /html/, json: /json/ }, responseFields: { xml: "responseXML", text: "responseText" }, converters: { "* text": a.String, "text html": !0, "text json": f.parseJSON, "text xml": f.parseXML }, flatOptions: { context: !0, url: !0 } }, ajaxPrefilter: bY(bS), ajaxTransport: bY(bT), ajax: function (a, c) { function w(a, c, l, m) { if (s !== 2) { s = 2, q && clearTimeout(q), p = b, n = m || "", v.readyState = a > 0 ? 4 : 0; var o, r, u, w = c, x = l ? ca(d, v, l) : b, y, z; if (a >= 200 && a < 300 || a === 304) { if (d.ifModified) { if (y = v.getResponseHeader("Last-Modified")) f.lastModified[k] = y; if (z = v.getResponseHeader("Etag")) f.etag[k] = z } if (a === 304) w = "notmodified", o = !0; else try { r = cb(d, x), w = "success", o = !0 } catch (A) { w = "parsererror", u = A } } else { u = w; if (!w || a) w = "error", a < 0 && (a = 0) } v.status = a, v.statusText = "" + (c || w), o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]), v.statusCode(j), j = b, t && g.trigger("ajax" + (o ? "Success" : "Error"), [v, d, o ? r : u]), i.fireWith(e, [v, w]), t && (g.trigger("ajaxComplete", [v, d]), --f.active || f.event.trigger("ajaxStop")) } } typeof a == "object" && (c = a, a = b), c = c || {}; var d = f.ajaxSetup({}, c), e = d.context || d, g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event, h = f.Deferred(), i = f.Callbacks("once memory"), j = d.statusCode || {}, k, l = {}, m = {}, n, o, p, q, r, s = 0, t, u, v = { readyState: 0, setRequestHeader: function (a, b) { if (!s) { var c = a.toLowerCase(); a = m[c] = m[c] || a, l[a] = b } return this }, getAllResponseHeaders: function () { return s === 2 ? n : null }, getResponseHeader: function (a) { var c; if (s === 2) { if (!o) { o = {}; while (c = bG.exec(n)) o[c[1].toLowerCase()] = c[2] } c = o[a.toLowerCase()] } return c === b ? null : c }, overrideMimeType: function (a) { s || (d.mimeType = a); return this }, abort: function (a) { a = a || "abort", p && p.abort(a), w(0, a); return this } }; h.promise(v), v.success = v.done, v.error = v.fail, v.complete = i.add, v.statusCode = function (a) { if (a) { var b; if (s < 2) for (b in a) j[b] = [j[b], a[b]]; else b = a[v.status], v.then(b, b) } return this }, d.url = ((a || d.url) + "").replace(bF, "").replace(bK, bV[1] + "//"), d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bO), d.crossDomain == null && (r = bQ.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bV[1] && r[2] == bV[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bV[3] || (bV[1] === "http:" ? 80 : 443)))), d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)), bZ(bS, d, c, v); if (s === 2) return !1; t = d.global, d.type = d.type.toUpperCase(), d.hasContent = !bJ.test(d.type), t && f.active++ === 0 && f.event.trigger("ajaxStart"); if (!d.hasContent) { d.data && (d.url += (bL.test(d.url) ? "&" : "?") + d.data, delete d.data), k = d.url; if (d.cache === !1) { var x = f.now(), y = d.url.replace(bP, "$1_=" + x); d.url = y + (y === d.url ? (bL.test(d.url) ? "&" : "?") + "_=" + x : "") } } (d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType), d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])), v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bW + "; q=0.01" : "") : d.accepts["*"]); for (u in d.headers) v.setRequestHeader(u, d.headers[u]); if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) { v.abort(); return !1 } for (u in { success: 1, error: 1, complete: 1 }) v[u](d[u]); p = bZ(bT, d, c, v); if (!p) w(-1, "No Transport"); else { v.readyState = 1, t && g.trigger("ajaxSend", [v, d]), d.async && d.timeout > 0 && (q = setTimeout(function () { v.abort("timeout") }, d.timeout)); try { s = 1, p.send(l, w) } catch (z) { if (s < 2) w(-1, z); else throw z } } return v }, param: function (a, c) { var d = [], e = function (a, b) { b = f.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b) }; c === b && (c = f.ajaxSettings.traditional); if (f.isArray(a) || a.jquery && !f.isPlainObject(a)) f.each(a, function () { e(this.name, this.value) }); else for (var g in a) b_(g, a[g], c, e); return d.join("&").replace(bC, "+") } }), f.extend({ active: 0, lastModified: {}, etag: {} }); var cc = f.now(), cd = /(\=)\?(&|$)|\?\?/i; f.ajaxSetup({ jsonp: "callback", jsonpCallback: function () { return f.expando + "_" + cc++ } }), f.ajaxPrefilter("json jsonp", function (b, c, d) { var e = typeof b.data == "string" && /^application\/x\-www\-form\-urlencoded/.test(b.contentType); if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (cd.test(b.url) || e && cd.test(b.data))) { var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, i = a[h], j = b.url, k = b.data, l = "$1" + h + "$2"; b.jsonp !== !1 && (j = j.replace(cd, l), b.url === j && (e && (k = k.replace(cd, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function (a) { g = [a] }, d.always(function () { a[h] = i, g && f.isFunction(i) && a[h](g[0]) }), b.converters["script json"] = function () { g || f.error(h + " was not called"); return g[0] }, b.dataTypes[0] = "json"; return "script" } }), f.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /javascript|ecmascript/ }, converters: { "text script": function (a) { f.globalEval(a); return a } } }), f.ajaxPrefilter("script", function (a) { a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1) }), f.ajaxTransport("script", function (a) { if (a.crossDomain) { var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement; return { send: function (f, g) { d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function (a, c) { if (c || !d.readyState || /loaded|complete/.test(d.readyState)) d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success") }, e.insertBefore(d, e.firstChild) }, abort: function () { d && d.onload(0, 1) } } } }); var ce = a.ActiveXObject ? function () { for (var a in cg) cg[a](0, 1) } : !1, cf = 0, cg; f.ajaxSettings.xhr = a.ActiveXObject ? function () { return !this.isLocal && ch() || ci() } : ch, function (a) { f.extend(f.support, { ajax: !!a, cors: !!a && "withCredentials" in a }) }(f.ajaxSettings.xhr()), f.support.ajax && f.ajaxTransport(function (c) { if (!c.crossDomain || f.support.cors) { var d; return { send: function (e, g) { var h = c.xhr(), i, j; c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async); if (c.xhrFields) for (j in c.xhrFields) h[j] = c.xhrFields[j]; c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest"); try { for (j in e) h.setRequestHeader(j, e[j]) } catch (k) { } h.send(c.hasContent && c.data || null), d = function (a, e) { var j, k, l, m, n; try { if (d && (e || h.readyState === 4)) { d = b, i && (h.onreadystatechange = f.noop, ce && delete cg[i]); if (e) h.readyState !== 4 && h.abort(); else { j = h.status, l = h.getAllResponseHeaders(), m = {}, n = h.responseXML, n && n.documentElement && (m.xml = n); try { m.text = h.responseText } catch (a) { } try { k = h.statusText } catch (o) { k = "" } !j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204) } } } catch (p) { e || g(-1, p) } m && g(j, k, m, l) }, !c.async || h.readyState === 4 ? d() : (i = ++cf, ce && (cg || (cg = {}, f(a).unload(ce)), cg[i] = d), h.onreadystatechange = d) }, abort: function () { d && d(0, 1) } } } }); var cj = {}, ck, cl, cm = /^(?:toggle|show|hide)$/, cn = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, co, cp = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]], cq; f.fn.extend({ show: function (a, b, c) { var d, e; if (a || a === 0) return this.animate(ct("show", 3), a, b, c); for (var g = 0, h = this.length; g < h; g++)d = this[g], d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), (e === "" && f.css(d, "display") === "none" || !f.contains(d.ownerDocument.documentElement, d)) && f._data(d, "olddisplay", cu(d.nodeName))); for (g = 0; g < h; g++) { d = this[g]; if (d.style) { e = d.style.display; if (e === "" || e === "none") d.style.display = f._data(d, "olddisplay") || "" } } return this }, hide: function (a, b, c) { if (a || a === 0) return this.animate(ct("hide", 3), a, b, c); var d, e, g = 0, h = this.length; for (; g < h; g++)d = this[g], d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e)); for (g = 0; g < h; g++)this[g].style && (this[g].style.display = "none"); return this }, _toggle: f.fn.toggle, toggle: function (a, b, c) { var d = typeof a == "boolean"; f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function () { var b = d ? a : f(this).is(":hidden"); f(this)[b ? "show" : "hide"]() }) : this.animate(ct("toggle", 3), a, b, c); return this }, fadeTo: function (a, b, c, d) { return this.filter(":hidden").css("opacity", 0).show().end().animate({ opacity: b }, a, c, d) }, animate: function (a, b, c, d) { function g() { e.queue === !1 && f._mark(this); var b = f.extend({}, e), c = this.nodeType === 1, d = c && f(this).is(":hidden"), g, h, i, j, k, l, m, n, o, p, q; b.animatedProperties = {}; for (i in a) { g = f.camelCase(i), i !== g && (a[g] = a[i], delete a[i]); if ((k = f.cssHooks[g]) && "expand" in k) { l = k.expand(a[g]), delete a[g]; for (i in l) i in a || (a[i] = l[i]) } } for (g in a) { h = a[g], f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing"; if (h === "hide" && d || h === "show" && !d) return b.complete.call(this); c && (g === "height" || g === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cu(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1)) } b.overflow != null && (this.style.overflow = "hidden"); for (i in a) j = new f.fx(this, b, i), h = a[i], cm.test(h) ? (q = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show" : "hide" : 0), q ? (f._data(this, "toggle" + i, q === "show" ? "hide" : "show"), j[q]()) : j[h]()) : (m = cn.exec(h), n = j.cur(), m ? (o = parseFloat(m[2]), p = m[3] || (f.cssNumber[i] ? "" : "px"), p !== "px" && (f.style(this, i, (o || 1) + p), n = (o || 1) / j.cur() * n, f.style(this, i, n + p)), m[1] && (o = (m[1] === "-=" ? -1 : 1) * o + n), j.custom(n, o, p)) : j.custom(n, h, "")); return !0 } var e = f.speed(b, c, d); if (f.isEmptyObject(a)) return this.each(e.complete, [!1]); a = f.extend({}, a); return e.queue === !1 ? this.each(g) : this.queue(e.queue, g) }, stop: function (a, c, d) { typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []); return this.each(function () { function h(a, b, c) { var e = b[c]; f.removeData(a, c, !0), e.stop(d) } var b, c = !1, e = f.timers, g = f._data(this); d || f._unmark(!0, this); if (a == null) for (b in g) g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b); else g[b = a + ".run"] && g[b].stop && h(this, g, b); for (b = e.length; b--;)e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1)); (!d || !c) && f.dequeue(this, a) }) } }), f.each({ slideDown: ct("show", 1), slideUp: ct("hide", 1), slideToggle: ct("toggle", 1), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (a, b) { f.fn[a] = function (a, c, d) { return this.animate(b, a, c, d) } }), f.extend({ speed: function (a, b, c) { var d = a && typeof a == "object" ? f.extend({}, a) : { complete: c || !c && b || f.isFunction(a) && a, duration: a, easing: c && b || b && !f.isFunction(b) && b }; d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default; if (d.queue == null || d.queue === !0) d.queue = "fx"; d.old = d.complete, d.complete = function (a) { f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this) }; return d }, easing: { linear: function (a) { return a }, swing: function (a) { return -Math.cos(a * Math.PI) / 2 + .5 } }, timers: [], fx: function (a, b, c) { this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {} } }), f.fx.prototype = { update: function () { this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this) }, cur: function () { if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop]; var a, b = f.css(this.elem, this.prop); return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a }, custom: function (a, c, d) { function h(a) { return e.step(a) } var e = this, g = f.fx; this.startTime = cq || cr(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px"), h.queue = this.options.queue, h.elem = this.elem, h.saveState = function () { f._data(e.elem, "fxshow" + e.prop) === b && (e.options.hide ? f._data(e.elem, "fxshow" + e.prop, e.start) : e.options.show && f._data(e.elem, "fxshow" + e.prop, e.end)) }, h() && f.timers.push(h) && !co && (co = setInterval(g.tick, g.interval)) }, show: function () { var a = f._data(this.elem, "fxshow" + this.prop); this.options.orig[this.prop] = a || f.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), f(this.elem).show() }, hide: function () { this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0) }, step: function (a) { var b, c, d, e = cq || cr(), g = !0, h = this.elem, i = this.options; if (a || e >= i.duration + this.startTime) { this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0; for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (g = !1); if (g) { i.overflow != null && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"], function (a, b) { h.style["overflow" + b] = i.overflow[a] }), i.hide && f(h).hide(); if (i.hide || i.show) for (b in i.animatedProperties) f.style(h, b, i.orig[b]), f.removeData(h, "fxshow" + b, !0), f.removeData(h, "toggle" + b, !0); d = i.complete, d && (i.complete = !1, d.call(h)) } return !1 } i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update(); return !0 } }, f.extend(f.fx, { tick: function () { var a, b = f.timers, c = 0; for (; c < b.length; c++)a = b[c], !a() && b[c] === a && b.splice(c--, 1); b.length || f.fx.stop() }, interval: 13, stop: function () { clearInterval(co), co = null }, speeds: { slow: 600, fast: 200, _default: 400 }, step: { opacity: function (a) { f.style(a.elem, "opacity", a.now) }, _default: function (a) { a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now } } }), f.each(cp.concat.apply([], cp), function (a, b) { b.indexOf("margin") && (f.fx.step[b] = function (a) { f.style(a.elem, b, Math.max(0, a.now) + a.unit) }) }), f.expr && f.expr.filters && (f.expr.filters.animated = function (a) { return f.grep(f.timers, function (b) { return a === b.elem }).length }); var cv, cw = /^t(?:able|d|h)$/i, cx = /^(?:body|html)$/i; "getBoundingClientRect" in c.documentElement ? cv = function (a, b, c, d) { try { d = a.getBoundingClientRect() } catch (e) { } if (!d || !f.contains(c, a)) return d ? { top: d.top, left: d.left } : { top: 0, left: 0 }; var g = b.body, h = cy(b), i = c.clientTop || g.clientTop || 0, j = c.clientLeft || g.clientLeft || 0, k = h.pageYOffset || f.support.boxModel && c.scrollTop || g.scrollTop, l = h.pageXOffset || f.support.boxModel && c.scrollLeft || g.scrollLeft, m = d.top + k - i, n = d.left + l - j; return { top: m, left: n } } : cv = function (a, b, c) { var d, e = a.offsetParent, g = a, h = b.body, i = b.defaultView, j = i ? i.getComputedStyle(a, null) : a.currentStyle, k = a.offsetTop, l = a.offsetLeft; while ((a = a.parentNode) && a !== h && a !== c) { if (f.support.fixedPosition && j.position === "fixed") break; d = i ? i.getComputedStyle(a, null) : a.currentStyle, k -= a.scrollTop, l -= a.scrollLeft, a === e && (k += a.offsetTop, l += a.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(a.nodeName)) && (k += parseFloat(d.borderTopWidth) || 0, l += parseFloat(d.borderLeftWidth) || 0), g = e, e = a.offsetParent), f.support.subtractsBorderForOverflowNotVisible && d.overflow !== "visible" && (k += parseFloat(d.borderTopWidth) || 0, l += parseFloat(d.borderLeftWidth) || 0), j = d } if (j.position === "relative" || j.position === "static") k += h.offsetTop, l += h.offsetLeft; f.support.fixedPosition && j.position === "fixed" && (k += Math.max(c.scrollTop, h.scrollTop), l += Math.max(c.scrollLeft, h.scrollLeft)); return { top: k, left: l } }, f.fn.offset = function (a) { if (arguments.length) return a === b ? this : this.each(function (b) { f.offset.setOffset(this, a, b) }); var c = this[0], d = c && c.ownerDocument; if (!d) return null; if (c === d.body) return f.offset.bodyOffset(c); return cv(c, d, d.documentElement) }, f.offset = { bodyOffset: function (a) { var b = a.offsetTop, c = a.offsetLeft; f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0); return { top: b, left: c } }, setOffset: function (a, b, c) { var d = f.css(a, "position"); d === "static" && (a.style.position = "relative"); var e = f(a), g = e.offset(), h = f.css(a, "top"), i = f.css(a, "left"), j = (d === "absolute" || d === "fixed") && f.inArray("auto", [h, i]) > -1, k = {}, l = {}, m, n; j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0), f.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : e.css(k) } }, f.fn.extend({ position: function () { if (!this[0]) return null; var a = this[0], b = this.offsetParent(), c = this.offset(), d = cx.test(b[0].nodeName) ? { top: 0, left: 0 } : b.offset(); c.top -= parseFloat(f.css(a, "marginTop")) || 0, c.left -= parseFloat(f.css(a, "marginLeft")) || 0, d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0; return { top: c.top - d.top, left: c.left - d.left } }, offsetParent: function () { return this.map(function () { var a = this.offsetParent || c.body; while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static") a = a.offsetParent; return a }) } }), f.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (a, c) { var d = /Y/.test(c); f.fn[a] = function (e) { return f.access(this, function (a, e, g) { var h = cy(a); if (g === b) return h ? c in h ? h[c] : f.support.boxModel && h.document.documentElement[e] || h.document.body[e] : a[e]; h ? h.scrollTo(d ? f(h).scrollLeft() : g, d ? g : f(h).scrollTop()) : a[e] = g }, a, e, arguments.length, null) } }), f.each({ Height: "height", Width: "width" }, function (a, c) { var d = "client" + a, e = "scroll" + a, g = "offset" + a; f.fn["inner" + a] = function () { var a = this[0]; return a ? a.style ? parseFloat(f.css(a, c, "padding")) : this[c]() : null }, f.fn["outer" + a] = function (a) { var b = this[0]; return b ? b.style ? parseFloat(f.css(b, c, a ? "margin" : "border")) : this[c]() : null }, f.fn[c] = function (a) { return f.access(this, function (a, c, h) { var i, j, k, l; if (f.isWindow(a)) { i = a.document, j = i.documentElement[d]; return f.support.boxModel && j || i.body && i.body[d] || j } if (a.nodeType === 9) { i = a.documentElement; if (i[d] >= i[e]) return i[d]; return Math.max(a.body[e], i[e], a.body[g], i[g]) } if (h === b) { k = f.css(a, c), l = parseFloat(k); return f.isNumeric(l) ? l : k } f(a).css(c, h) }, c, a, arguments.length, null) } }), a.jQuery = a.$ = f, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function () { return f })
    })(window);

    Function.__typeName = "Function"; Function.__class = true; Function.createCallback = function (b, a) { return function () { var e = arguments.length; if (e > 0) { var d = []; for (var c = 0; c < e; c++)d[c] = arguments[c]; d[e] = a; return b.apply(this, d) } return b.call(this, a) } }; Function.createDelegate = function (a, b) { return function () { return b.apply(a, arguments) } }; Function.emptyFunction = Function.emptyMethod = function () { }; Function.validateParameters = function (c, b, a) { return Function._validateParams(c, b, a) }; Function._validateParams = function (g, e, c) { var a, d = e.length; c = c || typeof c === "undefined"; a = Function._validateParameterCount(g, e, c); if (a) { a.popStackFrame(); return a } for (var b = 0, i = g.length; b < i; b++) { var f = e[Math.min(b, d - 1)], h = f.name; if (f.parameterArray) h += "[" + (b - d + 1) + "]"; else if (!c && b >= d) break; a = Function._validateParameter(g[b], f, h); if (a) { a.popStackFrame(); return a } } return null }; Function._validateParameterCount = function (j, d, i) { var a, c, b = d.length, e = j.length; if (e < b) { var f = b; for (a = 0; a < b; a++) { var g = d[a]; if (g.optional || g.parameterArray) f-- } if (e < f) c = true } else if (i && e > b) { c = true; for (a = 0; a < b; a++)if (d[a].parameterArray) { c = false; break } } if (c) { var h = Error.parameterCount(); h.popStackFrame(); return h } return null }; Function._validateParameter = function (c, a, h) { var b, g = a.type, l = !!a.integer, k = !!a.domElement, m = !!a.mayBeNull; b = Function._validateParameterType(c, g, l, k, m, h); if (b) { b.popStackFrame(); return b } var e = a.elementType, f = !!a.elementMayBeNull; if (g === Array && typeof c !== "undefined" && c !== null && (e || !f)) { var j = !!a.elementInteger, i = !!a.elementDomElement; for (var d = 0; d < c.length; d++) { var n = c[d]; b = Function._validateParameterType(n, e, j, i, f, h + "[" + d + "]"); if (b) { b.popStackFrame(); return b } } } return null }; Function._validateParameterType = function (b, c, k, j, h, d) { var a, g; if (typeof b === "undefined") if (h) return null; else { a = Error.argumentUndefined(d); a.popStackFrame(); return a } if (b === null) if (h) return null; else { a = Error.argumentNull(d); a.popStackFrame(); return a } if (c && c.__enum) { if (typeof b !== "number") { a = Error.argumentType(d, Object.getType(b), c); a.popStackFrame(); return a } if (b % 1 === 0) { var e = c.prototype; if (!c.__flags || b === 0) { for (g in e) if (e[g] === b) return null } else { var i = b; for (g in e) { var f = e[g]; if (f === 0) continue; if ((f & b) === f) i -= f; if (i === 0) return null } } } a = Error.argumentOutOfRange(d, b, String.format(Sys.Res.enumInvalidValue, b, c.getName())); a.popStackFrame(); return a } if (j && (!Sys._isDomElement(b) || b.nodeType === 3)) { a = Error.argument(d, Sys.Res.argumentDomElement); a.popStackFrame(); return a } if (c && !Sys._isInstanceOfType(c, b)) { a = Error.argumentType(d, Object.getType(b), c); a.popStackFrame(); return a } if (c === Number && k) if (b % 1 !== 0) { a = Error.argumentOutOfRange(d, b, Sys.Res.argumentInteger); a.popStackFrame(); return a } return null }; Error.__typeName = "Error"; Error.__class = true; Error.create = function (d, b) { var a = new Error(d); a.message = d; if (b) for (var c in b) a[c] = b[c]; a.popStackFrame(); return a }; Error.argument = function (a, c) { var b = "Sys.ArgumentException: " + (c ? c : Sys.Res.argument); if (a) b += "\n" + String.format(Sys.Res.paramName, a); var d = Error.create(b, { name: "Sys.ArgumentException", paramName: a }); d.popStackFrame(); return d }; Error.argumentNull = function (a, c) { var b = "Sys.ArgumentNullException: " + (c ? c : Sys.Res.argumentNull); if (a) b += "\n" + String.format(Sys.Res.paramName, a); var d = Error.create(b, { name: "Sys.ArgumentNullException", paramName: a }); d.popStackFrame(); return d }; Error.argumentOutOfRange = function (c, a, d) { var b = "Sys.ArgumentOutOfRangeException: " + (d ? d : Sys.Res.argumentOutOfRange); if (c) b += "\n" + String.format(Sys.Res.paramName, c); if (typeof a !== "undefined" && a !== null) b += "\n" + String.format(Sys.Res.actualValue, a); var e = Error.create(b, { name: "Sys.ArgumentOutOfRangeException", paramName: c, actualValue: a }); e.popStackFrame(); return e }; Error.argumentType = function (d, c, b, e) { var a = "Sys.ArgumentTypeException: "; if (e) a += e; else if (c && b) a += String.format(Sys.Res.argumentTypeWithTypes, c.getName(), b.getName()); else a += Sys.Res.argumentType; if (d) a += "\n" + String.format(Sys.Res.paramName, d); var f = Error.create(a, { name: "Sys.ArgumentTypeException", paramName: d, actualType: c, expectedType: b }); f.popStackFrame(); return f }; Error.argumentUndefined = function (a, c) { var b = "Sys.ArgumentUndefinedException: " + (c ? c : Sys.Res.argumentUndefined); if (a) b += "\n" + String.format(Sys.Res.paramName, a); var d = Error.create(b, { name: "Sys.ArgumentUndefinedException", paramName: a }); d.popStackFrame(); return d }; Error.format = function (a) { var c = "Sys.FormatException: " + (a ? a : Sys.Res.format), b = Error.create(c, { name: "Sys.FormatException" }); b.popStackFrame(); return b }; Error.invalidOperation = function (a) { var c = "Sys.InvalidOperationException: " + (a ? a : Sys.Res.invalidOperation), b = Error.create(c, { name: "Sys.InvalidOperationException" }); b.popStackFrame(); return b }; Error.notImplemented = function (a) { var c = "Sys.NotImplementedException: " + (a ? a : Sys.Res.notImplemented), b = Error.create(c, { name: "Sys.NotImplementedException" }); b.popStackFrame(); return b }; Error.parameterCount = function (a) { var c = "Sys.ParameterCountException: " + (a ? a : Sys.Res.parameterCount), b = Error.create(c, { name: "Sys.ParameterCountException" }); b.popStackFrame(); return b }; Error.prototype.popStackFrame = function () { if (typeof this.stack === "undefined" || this.stack === null || typeof this.fileName === "undefined" || this.fileName === null || typeof this.lineNumber === "undefined" || this.lineNumber === null) return; var a = this.stack.split("\n"), c = a[0], e = this.fileName + ":" + this.lineNumber; while (typeof c !== "undefined" && c !== null && c.indexOf(e) === -1) { a.shift(); c = a[0] } var d = a[1]; if (typeof d === "undefined" || d === null) return; var b = d.match(/@(.*):(\d+)$/); if (typeof b === "undefined" || b === null) return; this.fileName = b[1]; this.lineNumber = parseInt(b[2]); a.shift(); this.stack = a.join("\n") }; Object.__typeName = "Object"; Object.__class = true; Object.getType = function (b) { var a = b.constructor; if (!a || typeof a !== "function" || !a.__typeName || a.__typeName === "Object") return Object; return a }; Object.getTypeName = function (a) { return Object.getType(a).getName() }; String.__typeName = "String"; String.__class = true; String.prototype.endsWith = function (a) { return this.substr(this.length - a.length) === a }; String.prototype.startsWith = function (a) { return this.substr(0, a.length) === a }; String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, "") }; String.prototype.trimEnd = function () { return this.replace(/\s+$/, "") }; String.prototype.trimStart = function () { return this.replace(/^\s+/, "") }; String.format = function () { return String._toFormattedString(false, arguments) }; String._toFormattedString = function (l, j) { var c = "", e = j[0]; for (var a = 0; true;) { var f = e.indexOf("{", a), d = e.indexOf("}", a); if (f < 0 && d < 0) { c += e.slice(a); break } if (d > 0 && (d < f || f < 0)) { c += e.slice(a, d + 1); a = d + 2; continue } c += e.slice(a, f); a = f + 1; if (e.charAt(a) === "{") { c += "{"; a++; continue } if (d < 0) break; var h = e.substring(a, d), g = h.indexOf(":"), k = parseInt(g < 0 ? h : h.substring(0, g), 10) + 1, i = g < 0 ? "" : h.substring(g + 1), b = j[k]; if (typeof b === "undefined" || b === null) b = ""; if (b.toFormattedString) c += b.toFormattedString(i); else if (l && b.localeFormat) c += b.localeFormat(i); else if (b.format) c += b.format(i); else c += b.toString(); a = d + 1 } return c }; Boolean.__typeName = "Boolean"; Boolean.__class = true; Boolean.parse = function (b) { var a = b.trim().toLowerCase(); if (a === "false") return false; if (a === "true") return true }; Date.__typeName = "Date"; Date.__class = true; Number.__typeName = "Number"; Number.__class = true; RegExp.__typeName = "RegExp"; RegExp.__class = true; if (!window) this.window = this; window.Type = Function; Type.prototype.callBaseMethod = function (a, d, b) { var c = Sys._getBaseMethod(this, a, d); if (!b) return c.apply(a); else return c.apply(a, b) }; Type.prototype.getBaseMethod = function (a, b) { return Sys._getBaseMethod(this, a, b) }; Type.prototype.getBaseType = function () { return typeof this.__baseType === "undefined" ? null : this.__baseType }; Type.prototype.getInterfaces = function () { var a = [], b = this; while (b) { var c = b.__interfaces; if (c) for (var d = 0, f = c.length; d < f; d++) { var e = c[d]; if (!Array.contains(a, e)) a[a.length] = e } b = b.__baseType } return a }; Type.prototype.getName = function () { return typeof this.__typeName === "undefined" ? "" : this.__typeName }; Type.prototype.implementsInterface = function (d) { this.resolveInheritance(); var c = d.getName(), a = this.__interfaceCache; if (a) { var e = a[c]; if (typeof e !== "undefined") return e } else a = this.__interfaceCache = {}; var b = this; while (b) { var f = b.__interfaces; if (f) if (Array.indexOf(f, d) !== -1) return a[c] = true; b = b.__baseType } return a[c] = false }; Type.prototype.inheritsFrom = function (b) { this.resolveInheritance(); var a = this.__baseType; while (a) { if (a === b) return true; a = a.__baseType } return false }; Type.prototype.initializeBase = function (a, b) { this.resolveInheritance(); if (this.__baseType) if (!b) this.__baseType.apply(a); else this.__baseType.apply(a, b); return a }; Type.prototype.isImplementedBy = function (a) { if (typeof a === "undefined" || a === null) return false; var b = Object.getType(a); return !!(b.implementsInterface && b.implementsInterface(this)) }; Type.prototype.isInstanceOfType = function (a) { return Sys._isInstanceOfType(this, a) }; Type.prototype.registerClass = function (c, b, d) { this.prototype.constructor = this; this.__typeName = c; this.__class = true; if (b) { this.__baseType = b; this.__basePrototypePending = true } Sys.__upperCaseTypes[c.toUpperCase()] = this; if (d) { this.__interfaces = []; for (var a = 2, f = arguments.length; a < f; a++) { var e = arguments[a]; this.__interfaces.push(e) } } return this }; Type.prototype.registerInterface = function (a) { Sys.__upperCaseTypes[a.toUpperCase()] = this; this.prototype.constructor = this; this.__typeName = a; this.__interface = true; return this }; Type.prototype.resolveInheritance = function () { if (this.__basePrototypePending) { var b = this.__baseType; b.resolveInheritance(); for (var a in b.prototype) { var c = b.prototype[a]; if (!this.prototype[a]) this.prototype[a] = c } delete this.__basePrototypePending } }; Type.getRootNamespaces = function () { return Array.clone(Sys.__rootNamespaces) }; Type.isClass = function (a) { if (typeof a === "undefined" || a === null) return false; return !!a.__class }; Type.isInterface = function (a) { if (typeof a === "undefined" || a === null) return false; return !!a.__interface }; Type.isNamespace = function (a) { if (typeof a === "undefined" || a === null) return false; return !!a.__namespace }; Type.parse = function (typeName, ns) { var fn; if (ns) { fn = Sys.__upperCaseTypes[ns.getName().toUpperCase() + "." + typeName.toUpperCase()]; return fn || null } if (!typeName) return null; if (!Type.__htClasses) Type.__htClasses = {}; fn = Type.__htClasses[typeName]; if (!fn) { fn = eval(typeName); Type.__htClasses[typeName] = fn } return fn }; Type.registerNamespace = function (e) { var d = window, c = e.split("."); for (var b = 0; b < c.length; b++) { var f = c[b], a = d[f]; if (!a) a = d[f] = {}; if (!a.__namespace) { if (b === 0 && e !== "Sys") Sys.__rootNamespaces[Sys.__rootNamespaces.length] = a; a.__namespace = true; a.__typeName = c.slice(0, b + 1).join("."); a.getName = function () { return this.__typeName } } d = a } }; Type._checkDependency = function (c, a) { var d = Type._registerScript._scripts, b = d ? !!d[c] : false; if (typeof a !== "undefined" && !b) throw Error.invalidOperation(String.format(Sys.Res.requiredScriptReferenceNotIncluded, a, c)); return b }; Type._registerScript = function (a, c) { var b = Type._registerScript._scripts; if (!b) Type._registerScript._scripts = b = {}; if (b[a]) throw Error.invalidOperation(String.format(Sys.Res.scriptAlreadyLoaded, a)); b[a] = true; if (c) for (var d = 0, f = c.length; d < f; d++) { var e = c[d]; if (!Type._checkDependency(e)) throw Error.invalidOperation(String.format(Sys.Res.scriptDependencyNotFound, a, e)) } }; Type.registerNamespace("Sys"); Sys.__upperCaseTypes = {}; Sys.__rootNamespaces = [Sys]; Sys._isInstanceOfType = function (c, b) { if (typeof b === "undefined" || b === null) return false; if (b instanceof c) return true; var a = Object.getType(b); return !!(a === c) || a.inheritsFrom && a.inheritsFrom(c) || a.implementsInterface && a.implementsInterface(c) }; Sys._getBaseMethod = function (d, e, c) { var b = d.getBaseType(); if (b) { var a = b.prototype[c]; return a instanceof Function ? a : null } return null }; Sys._isDomElement = function (a) { var c = false; if (typeof a.nodeType !== "number") { var b = a.ownerDocument || a.document || a; if (b != a) { var d = b.defaultView || b.parentWindow; c = d != a } else c = typeof b.body === "undefined" } return !c }; Array.__typeName = "Array"; Array.__class = true; Array.add = Array.enqueue = function (a, b) { a[a.length] = b }; Array.addRange = function (a, b) { a.push.apply(a, b) }; Array.clear = function (a) { a.length = 0 }; Array.clone = function (a) { if (a.length === 1) return [a[0]]; else return Array.apply(null, a) }; Array.contains = function (a, b) { return Sys._indexOf(a, b) >= 0 }; Array.dequeue = function (a) { return a.shift() }; Array.forEach = function (b, e, d) { for (var a = 0, f = b.length; a < f; a++) { var c = b[a]; if (typeof c !== "undefined") e.call(d, c, a, b) } }; Array.indexOf = function (a, c, b) { return Sys._indexOf(a, c, b) }; Array.insert = function (a, b, c) { a.splice(b, 0, c) }; Array.parse = function (value) { if (!value) return []; return eval(value) }; Array.remove = function (b, c) { var a = Sys._indexOf(b, c); if (a >= 0) b.splice(a, 1); return a >= 0 }; Array.removeAt = function (a, b) { a.splice(b, 1) }; Sys._indexOf = function (d, e, a) { if (typeof e === "undefined") return -1; var c = d.length; if (c !== 0) { a = a - 0; if (isNaN(a)) a = 0; else { if (isFinite(a)) a = a - a % 1; if (a < 0) a = Math.max(0, c + a) } for (var b = a; b < c; b++)if (typeof d[b] !== "undefined" && d[b] === e) return b } return -1 }; Type._registerScript._scripts = { "MicrosoftAjaxCore.js": true, "MicrosoftAjaxGlobalization.js": true, "MicrosoftAjaxSerialization.js": true, "MicrosoftAjaxComponentModel.js": true, "MicrosoftAjaxHistory.js": true, "MicrosoftAjaxNetwork.js": true, "MicrosoftAjaxWebServices.js": true }; Sys.IDisposable = function () { }; Sys.IDisposable.prototype = {}; Sys.IDisposable.registerInterface("Sys.IDisposable"); Sys.StringBuilder = function (a) { this._parts = typeof a !== "undefined" && a !== null && a !== "" ? [a.toString()] : []; this._value = {}; this._len = 0 }; Sys.StringBuilder.prototype = { append: function (a) { this._parts[this._parts.length] = a }, appendLine: function (a) { this._parts[this._parts.length] = typeof a === "undefined" || a === null || a === "" ? "\r\n" : a + "\r\n" }, clear: function () { this._parts = []; this._value = {}; this._len = 0 }, isEmpty: function () { if (this._parts.length === 0) return true; return this.toString() === "" }, toString: function (a) { a = a || ""; var b = this._parts; if (this._len !== b.length) { this._value = {}; this._len = b.length } var d = this._value; if (typeof d[a] === "undefined") { if (a !== "") for (var c = 0; c < b.length;)if (typeof b[c] === "undefined" || b[c] === "" || b[c] === null) b.splice(c, 1); else c++; d[a] = this._parts.join(a) } return d[a] } }; Sys.StringBuilder.registerClass("Sys.StringBuilder"); Sys.Browser = {}; Sys.Browser.InternetExplorer = {}; Sys.Browser.Firefox = {}; Sys.Browser.Safari = {}; Sys.Browser.Opera = {}; Sys.Browser.agent = null; Sys.Browser.hasDebuggerStatement = false; Sys.Browser.name = navigator.appName; Sys.Browser.version = parseFloat(navigator.appVersion); Sys.Browser.documentMode = 0; if (navigator.userAgent.indexOf(" MSIE ") > -1) { Sys.Browser.agent = Sys.Browser.InternetExplorer; Sys.Browser.version = parseFloat(navigator.userAgent.match(/MSIE (\d+\.\d+)/)[1]); if (Sys.Browser.version >= 8) if (document.documentMode >= 7) Sys.Browser.documentMode = document.documentMode; Sys.Browser.hasDebuggerStatement = true } else if (navigator.userAgent.indexOf(" Firefox/") > -1) { Sys.Browser.agent = Sys.Browser.Firefox; Sys.Browser.version = parseFloat(navigator.userAgent.match(/Firefox\/(\d+\.\d+)/)[1]); Sys.Browser.name = "Firefox"; Sys.Browser.hasDebuggerStatement = true } else if (navigator.userAgent.indexOf(" AppleWebKit/") > -1) { Sys.Browser.agent = Sys.Browser.Safari; Sys.Browser.version = parseFloat(navigator.userAgent.match(/AppleWebKit\/(\d+(\.\d+)?)/)[1]); Sys.Browser.name = "Safari" } else if (navigator.userAgent.indexOf("Opera/") > -1) Sys.Browser.agent = Sys.Browser.Opera; Sys.EventArgs = function () { }; Sys.EventArgs.registerClass("Sys.EventArgs"); Sys.EventArgs.Empty = new Sys.EventArgs; Sys.CancelEventArgs = function () { Sys.CancelEventArgs.initializeBase(this); this._cancel = false }; Sys.CancelEventArgs.prototype = { get_cancel: function () { return this._cancel }, set_cancel: function (a) { this._cancel = a } }; Sys.CancelEventArgs.registerClass("Sys.CancelEventArgs", Sys.EventArgs); Type.registerNamespace("Sys.UI"); Sys._Debug = function () { }; Sys._Debug.prototype = { _appendConsole: function (a) { if (typeof Debug !== "undefined" && Debug.writeln) Debug.writeln(a); if (window.console && window.console.log) window.console.log(a); if (window.opera) window.opera.postError(a); if (window.debugService) window.debugService.trace(a) }, _appendTrace: function (b) { var a = document.getElementById("TraceConsole"); if (a && a.tagName.toUpperCase() === "TEXTAREA") a.value += b + "\n" }, assert: function (c, a, b) { if (!c) { a = b && this.assert.caller ? String.format(Sys.Res.assertFailedCaller, a, this.assert.caller) : String.format(Sys.Res.assertFailed, a); if (confirm(String.format(Sys.Res.breakIntoDebugger, a))) this.fail(a) } }, clearTrace: function () { var a = document.getElementById("TraceConsole"); if (a && a.tagName.toUpperCase() === "TEXTAREA") a.value = "" }, fail: function (message) { this._appendConsole(message); if (Sys.Browser.hasDebuggerStatement) eval("debugger") }, trace: function (a) { this._appendConsole(a); this._appendTrace(a) }, traceDump: function (a, b) { var c = this._traceDump(a, b, true) }, _traceDump: function (a, c, f, b, d) { c = c ? c : "traceDump"; b = b ? b : ""; if (a === null) { this.trace(b + c + ": null"); return } switch (typeof a) { case "undefined": this.trace(b + c + ": Undefined"); break; case "number": case "string": case "boolean": this.trace(b + c + ": " + a); break; default: if (Date.isInstanceOfType(a) || RegExp.isInstanceOfType(a)) { this.trace(b + c + ": " + a.toString()); break } if (!d) d = []; else if (Array.contains(d, a)) { this.trace(b + c + ": ..."); return } Array.add(d, a); if (a == window || a === document || window.HTMLElement && a instanceof HTMLElement || typeof a.nodeName === "string") { var k = a.tagName ? a.tagName : "DomElement"; if (a.id) k += " - " + a.id; this.trace(b + c + " {" + k + "}") } else { var i = Object.getTypeName(a); this.trace(b + c + (typeof i === "string" ? " {" + i + "}" : "")); if (b === "" || f) { b += "    "; var e, j, l, g, h; if (Array.isInstanceOfType(a)) { j = a.length; for (e = 0; e < j; e++)this._traceDump(a[e], "[" + e + "]", f, b, d) } else for (g in a) { h = a[g]; if (!Function.isInstanceOfType(h)) this._traceDump(h, g, f, b, d) } } } Array.remove(d, a) } } }; Sys._Debug.registerClass("Sys._Debug"); Sys.Debug = new Sys._Debug; Sys.Debug.isDebug = false; function Sys$Enum$parse(c, e) { var a, b, i; if (e) { a = this.__lowerCaseValues; if (!a) { this.__lowerCaseValues = a = {}; var g = this.prototype; for (var f in g) a[f.toLowerCase()] = g[f] } } else a = this.prototype; if (!this.__flags) { i = e ? c.toLowerCase() : c; b = a[i.trim()]; if (typeof b !== "number") throw Error.argument("value", String.format(Sys.Res.enumInvalidValue, c, this.__typeName)); return b } else { var h = (e ? c.toLowerCase() : c).split(","), j = 0; for (var d = h.length - 1; d >= 0; d--) { var k = h[d].trim(); b = a[k]; if (typeof b !== "number") throw Error.argument("value", String.format(Sys.Res.enumInvalidValue, c.split(",")[d].trim(), this.__typeName)); j |= b } return j } } function Sys$Enum$toString(c) { if (typeof c === "undefined" || c === null) return this.__string; var d = this.prototype, a; if (!this.__flags || c === 0) { for (a in d) if (d[a] === c) return a } else { var b = this.__sortedValues; if (!b) { b = []; for (a in d) b[b.length] = { key: a, value: d[a] }; b.sort(function (a, b) { return a.value - b.value }); this.__sortedValues = b } var e = [], g = c; for (a = b.length - 1; a >= 0; a--) { var h = b[a], f = h.value; if (f === 0) continue; if ((f & c) === f) { e[e.length] = h.key; g -= f; if (g === 0) break } } if (e.length && g === 0) return e.reverse().join(", ") } return "" } Type.prototype.registerEnum = function (b, c) { Sys.__upperCaseTypes[b.toUpperCase()] = this; for (var a in this.prototype) this[a] = this.prototype[a]; this.__typeName = b; this.parse = Sys$Enum$parse; this.__string = this.toString(); this.toString = Sys$Enum$toString; this.__flags = c; this.__enum = true }; Type.isEnum = function (a) { if (typeof a === "undefined" || a === null) return false; return !!a.__enum }; Type.isFlags = function (a) { if (typeof a === "undefined" || a === null) return false; return !!a.__flags }; Sys.CollectionChange = function (e, a, c, b, d) { this.action = e; if (a) if (!(a instanceof Array)) a = [a]; this.newItems = a || null; if (typeof c !== "number") c = -1; this.newStartingIndex = c; if (b) if (!(b instanceof Array)) b = [b]; this.oldItems = b || null; if (typeof d !== "number") d = -1; this.oldStartingIndex = d }; Sys.CollectionChange.registerClass("Sys.CollectionChange"); Sys.NotifyCollectionChangedAction = function () { throw Error.notImplemented() }; Sys.NotifyCollectionChangedAction.prototype = { add: 0, remove: 1, reset: 2 }; Sys.NotifyCollectionChangedAction.registerEnum("Sys.NotifyCollectionChangedAction"); Sys.NotifyCollectionChangedEventArgs = function (a) { this._changes = a; Sys.NotifyCollectionChangedEventArgs.initializeBase(this) }; Sys.NotifyCollectionChangedEventArgs.prototype = { get_changes: function () { return this._changes || [] } }; Sys.NotifyCollectionChangedEventArgs.registerClass("Sys.NotifyCollectionChangedEventArgs", Sys.EventArgs); Sys.Observer = function () { }; Sys.Observer.registerClass("Sys.Observer"); Sys.Observer.makeObservable = function (a) { var c = a instanceof Array, b = Sys.Observer; if (a.setValue === b._observeMethods.setValue) return a; b._addMethods(a, b._observeMethods); if (c) b._addMethods(a, b._arrayMethods); return a }; Sys.Observer._addMethods = function (c, b) { for (var a in b) c[a] = b[a] }; Sys.Observer._addEventHandler = function (c, a, b) { Sys.Observer._getContext(c, true).events._addHandler(a, b) }; Sys.Observer.addEventHandler = function (c, a, b) { Sys.Observer._addEventHandler(c, a, b) }; Sys.Observer._removeEventHandler = function (c, a, b) { Sys.Observer._getContext(c, true).events._removeHandler(a, b) }; Sys.Observer.removeEventHandler = function (c, a, b) { Sys.Observer._removeEventHandler(c, a, b) }; Sys.Observer.raiseEvent = function (b, e, d) { var c = Sys.Observer._getContext(b); if (!c) return; var a = c.events.getHandler(e); if (a) a(b, d) }; Sys.Observer.addPropertyChanged = function (b, a) { Sys.Observer._addEventHandler(b, "propertyChanged", a) }; Sys.Observer.removePropertyChanged = function (b, a) { Sys.Observer._removeEventHandler(b, "propertyChanged", a) }; Sys.Observer.beginUpdate = function (a) { Sys.Observer._getContext(a, true).updating = true }; Sys.Observer.endUpdate = function (b) { var a = Sys.Observer._getContext(b); if (!a || !a.updating) return; a.updating = false; var d = a.dirty; a.dirty = false; if (d) { if (b instanceof Array) { var c = a.changes; a.changes = null; Sys.Observer.raiseCollectionChanged(b, c) } Sys.Observer.raisePropertyChanged(b, "") } }; Sys.Observer.isUpdating = function (b) { var a = Sys.Observer._getContext(b); return a ? a.updating : false }; Sys.Observer._setValue = function (a, j, g) { var b, f, k = a, d = j.split("."); for (var i = 0, m = d.length - 1; i < m; i++) { var l = d[i]; b = a["get_" + l]; if (typeof b === "function") a = b.call(a); else a = a[l]; var n = typeof a; if (a === null || n === "undefined") throw Error.invalidOperation(String.format(Sys.Res.nullReferenceInPath, j)) } var e, c = d[m]; b = a["get_" + c]; f = a["set_" + c]; if (typeof b === "function") e = b.call(a); else e = a[c]; if (typeof f === "function") f.call(a, g); else a[c] = g; if (e !== g) { var h = Sys.Observer._getContext(k); if (h && h.updating) { h.dirty = true; return } Sys.Observer.raisePropertyChanged(k, d[0]) } }; Sys.Observer.setValue = function (b, a, c) { Sys.Observer._setValue(b, a, c) }; Sys.Observer.raisePropertyChanged = function (b, a) { Sys.Observer.raiseEvent(b, "propertyChanged", new Sys.PropertyChangedEventArgs(a)) }; Sys.Observer.addCollectionChanged = function (b, a) { Sys.Observer._addEventHandler(b, "collectionChanged", a) }; Sys.Observer.removeCollectionChanged = function (b, a) { Sys.Observer._removeEventHandler(b, "collectionChanged", a) }; Sys.Observer._collectionChange = function (d, c) { var a = Sys.Observer._getContext(d); if (a && a.updating) { a.dirty = true; var b = a.changes; if (!b) a.changes = b = [c]; else b.push(c) } else { Sys.Observer.raiseCollectionChanged(d, [c]); Sys.Observer.raisePropertyChanged(d, "length") } }; Sys.Observer.add = function (a, b) { var c = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [b], a.length); Array.add(a, b); Sys.Observer._collectionChange(a, c) }; Sys.Observer.addRange = function (a, b) { var c = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, b, a.length); Array.addRange(a, b); Sys.Observer._collectionChange(a, c) }; Sys.Observer.clear = function (a) { var b = Array.clone(a); Array.clear(a); Sys.Observer._collectionChange(a, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.reset, null, -1, b, 0)) }; Sys.Observer.insert = function (a, b, c) { Array.insert(a, b, c); Sys.Observer._collectionChange(a, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [c], b)) }; Sys.Observer.remove = function (a, b) { var c = Array.indexOf(a, b); if (c !== -1) { Array.remove(a, b); Sys.Observer._collectionChange(a, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [b], c)); return true } return false }; Sys.Observer.removeAt = function (b, a) { if (a > -1 && a < b.length) { var c = b[a]; Array.removeAt(b, a); Sys.Observer._collectionChange(b, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [c], a)) } }; Sys.Observer.raiseCollectionChanged = function (b, a) { Sys.Observer.raiseEvent(b, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(a)) }; Sys.Observer._observeMethods = { add_propertyChanged: function (a) { Sys.Observer._addEventHandler(this, "propertyChanged", a) }, remove_propertyChanged: function (a) { Sys.Observer._removeEventHandler(this, "propertyChanged", a) }, addEventHandler: function (a, b) { Sys.Observer._addEventHandler(this, a, b) }, removeEventHandler: function (a, b) { Sys.Observer._removeEventHandler(this, a, b) }, get_isUpdating: function () { return Sys.Observer.isUpdating(this) }, beginUpdate: function () { Sys.Observer.beginUpdate(this) }, endUpdate: function () { Sys.Observer.endUpdate(this) }, setValue: function (b, a) { Sys.Observer._setValue(this, b, a) }, raiseEvent: function (b, a) { Sys.Observer.raiseEvent(this, b, a) }, raisePropertyChanged: function (a) { Sys.Observer.raiseEvent(this, "propertyChanged", new Sys.PropertyChangedEventArgs(a)) } }; Sys.Observer._arrayMethods = { add_collectionChanged: function (a) { Sys.Observer._addEventHandler(this, "collectionChanged", a) }, remove_collectionChanged: function (a) { Sys.Observer._removeEventHandler(this, "collectionChanged", a) }, add: function (a) { Sys.Observer.add(this, a) }, addRange: function (a) { Sys.Observer.addRange(this, a) }, clear: function () { Sys.Observer.clear(this) }, insert: function (a, b) { Sys.Observer.insert(this, a, b) }, remove: function (a) { return Sys.Observer.remove(this, a) }, removeAt: function (a) { Sys.Observer.removeAt(this, a) }, raiseCollectionChanged: function (a) { Sys.Observer.raiseEvent(this, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(a)) } }; Sys.Observer._getContext = function (b, c) { var a = b._observerContext; if (a) return a(); if (c) return (b._observerContext = Sys.Observer._createContext())(); return null }; Sys.Observer._createContext = function () { var a = { events: new Sys.EventHandlerList }; return function () { return a } }; Date._appendPreOrPostMatch = function (e, b) { var d = 0, a = false; for (var c = 0, g = e.length; c < g; c++) { var f = e.charAt(c); switch (f) { case "'": if (a) b.append("'"); else d++; a = false; break; case "\\": if (a) b.append("\\"); a = !a; break; default: b.append(f); a = false } } return d }; Date._expandFormat = function (a, b) { if (!b) b = "F"; var c = b.length; if (c === 1) switch (b) { case "d": return a.ShortDatePattern; case "D": return a.LongDatePattern; case "t": return a.ShortTimePattern; case "T": return a.LongTimePattern; case "f": return a.LongDatePattern + " " + a.ShortTimePattern; case "F": return a.FullDateTimePattern; case "M": case "m": return a.MonthDayPattern; case "s": return a.SortableDateTimePattern; case "Y": case "y": return a.YearMonthPattern; default: throw Error.format(Sys.Res.formatInvalidString) } else if (c === 2 && b.charAt(0) === "%") b = b.charAt(1); return b }; Date._expandYear = function (c, a) { var d = new Date, e = Date._getEra(d); if (a < 100) { var b = Date._getEraYear(d, c, e); a += b - b % 100; if (a > c.Calendar.TwoDigitYearMax) a -= 100 } return a }; Date._getEra = function (e, c) { if (!c) return 0; var b, d = e.getTime(); for (var a = 0, f = c.length; a < f; a += 4) { b = c[a + 2]; if (b === null || d >= b) return a } return 0 }; Date._getEraYear = function (d, b, e, c) { var a = d.getFullYear(); if (!c && b.eras) a -= b.eras[e + 3]; return a }; Date._getParseRegExp = function (b, e) { if (!b._parseRegExp) b._parseRegExp = {}; else if (b._parseRegExp[e]) return b._parseRegExp[e]; var c = Date._expandFormat(b, e); c = c.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"); var a = new Sys.StringBuilder("^"), j = [], f = 0, i = 0, h = Date._getTokenRegExp(), d; while ((d = h.exec(c)) !== null) { var l = c.slice(f, d.index); f = h.lastIndex; i += Date._appendPreOrPostMatch(l, a); if (i % 2 === 1) { a.append(d[0]); continue } switch (d[0]) { case "dddd": case "ddd": case "MMMM": case "MMM": case "gg": case "g": a.append("(\\D+)"); break; case "tt": case "t": a.append("(\\D*)"); break; case "yyyy": a.append("(\\d{4})"); break; case "fff": a.append("(\\d{3})"); break; case "ff": a.append("(\\d{2})"); break; case "f": a.append("(\\d)"); break; case "dd": case "d": case "MM": case "M": case "yy": case "y": case "HH": case "H": case "hh": case "h": case "mm": case "m": case "ss": case "s": a.append("(\\d\\d?)"); break; case "zzz": a.append("([+-]?\\d\\d?:\\d{2})"); break; case "zz": case "z": a.append("([+-]?\\d\\d?)"); break; case "/": a.append("(\\" + b.DateSeparator + ")") }Array.add(j, d[0]) } Date._appendPreOrPostMatch(c.slice(f), a); a.append("$"); var k = a.toString().replace(/\s+/g, "\\s+"), g = { "regExp": k, "groups": j }; b._parseRegExp[e] = g; return g }; Date._getTokenRegExp = function () { return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g }; Date.parseLocale = function (a) { return Date._parse(a, Sys.CultureInfo.CurrentCulture, arguments) }; Date.parseInvariant = function (a) { return Date._parse(a, Sys.CultureInfo.InvariantCulture, arguments) }; Date._parse = function (h, d, i) { var a, c, b, f, e, g = false; for (a = 1, c = i.length; a < c; a++) { f = i[a]; if (f) { g = true; b = Date._parseExact(h, f, d); if (b) return b } } if (!g) { e = d._getDateTimeFormats(); for (a = 0, c = e.length; a < c; a++) { b = Date._parseExact(h, e[a], d); if (b) return b } } return null }; Date._parseExact = function (w, D, k) { w = w.trim(); var g = k.dateTimeFormat, A = Date._getParseRegExp(g, D), C = (new RegExp(A.regExp)).exec(w); if (C === null) return null; var B = A.groups, x = null, e = null, c = null, j = null, i = null, d = 0, h, p = 0, q = 0, f = 0, l = null, v = false; for (var s = 0, E = B.length; s < E; s++) { var a = C[s + 1]; if (a) switch (B[s]) { case "dd": case "d": j = parseInt(a, 10); if (j < 1 || j > 31) return null; break; case "MMMM": c = k._getMonthIndex(a); if (c < 0 || c > 11) return null; break; case "MMM": c = k._getAbbrMonthIndex(a); if (c < 0 || c > 11) return null; break; case "M": case "MM": c = parseInt(a, 10) - 1; if (c < 0 || c > 11) return null; break; case "y": case "yy": e = Date._expandYear(g, parseInt(a, 10)); if (e < 0 || e > 9999) return null; break; case "yyyy": e = parseInt(a, 10); if (e < 0 || e > 9999) return null; break; case "h": case "hh": d = parseInt(a, 10); if (d === 12) d = 0; if (d < 0 || d > 11) return null; break; case "H": case "HH": d = parseInt(a, 10); if (d < 0 || d > 23) return null; break; case "m": case "mm": p = parseInt(a, 10); if (p < 0 || p > 59) return null; break; case "s": case "ss": q = parseInt(a, 10); if (q < 0 || q > 59) return null; break; case "tt": case "t": var z = a.toUpperCase(); v = z === g.PMDesignator.toUpperCase(); if (!v && z !== g.AMDesignator.toUpperCase()) return null; break; case "f": f = parseInt(a, 10) * 100; if (f < 0 || f > 999) return null; break; case "ff": f = parseInt(a, 10) * 10; if (f < 0 || f > 999) return null; break; case "fff": f = parseInt(a, 10); if (f < 0 || f > 999) return null; break; case "dddd": i = k._getDayIndex(a); if (i < 0 || i > 6) return null; break; case "ddd": i = k._getAbbrDayIndex(a); if (i < 0 || i > 6) return null; break; case "zzz": var u = a.split(/:/); if (u.length !== 2) return null; h = parseInt(u[0], 10); if (h < -12 || h > 13) return null; var m = parseInt(u[1], 10); if (m < 0 || m > 59) return null; l = h * 60 + (a.startsWith("-") ? -m : m); break; case "z": case "zz": h = parseInt(a, 10); if (h < -12 || h > 13) return null; l = h * 60; break; case "g": case "gg": var o = a; if (!o || !g.eras) return null; o = o.toLowerCase().trim(); for (var r = 0, F = g.eras.length; r < F; r += 4)if (o === g.eras[r + 1].toLowerCase()) { x = r; break } if (x === null) return null } } var b = new Date, t, n = g.Calendar.convert; if (n) t = n.fromGregorian(b)[0]; else t = b.getFullYear(); if (e === null) e = t; else if (g.eras) e += g.eras[(x || 0) + 3]; if (c === null) c = 0; if (j === null) j = 1; if (n) { b = n.toGregorian(e, c, j); if (b === null) return null } else { b.setFullYear(e, c, j); if (b.getDate() !== j) return null; if (i !== null && b.getDay() !== i) return null } if (v && d < 12) d += 12; b.setHours(d, p, q, f); if (l !== null) { var y = b.getMinutes() - (l + b.getTimezoneOffset()); b.setHours(b.getHours() + parseInt(y / 60, 10), y % 60) } return b }; Date.prototype.format = function (a) { return this._toFormattedString(a, Sys.CultureInfo.InvariantCulture) }; Date.prototype.localeFormat = function (a) { return this._toFormattedString(a, Sys.CultureInfo.CurrentCulture) }; Date.prototype._toFormattedString = function (e, j) { var b = j.dateTimeFormat, n = b.Calendar.convert; if (!e || !e.length || e === "i") if (j && j.name.length) if (n) return this._toFormattedString(b.FullDateTimePattern, j); else { var r = new Date(this.getTime()), x = Date._getEra(this, b.eras); r.setFullYear(Date._getEraYear(this, b, x)); return r.toLocaleString() } else return this.toString(); var l = b.eras, k = e === "s"; e = Date._expandFormat(b, e); var a = new Sys.StringBuilder, c; function d(a) { if (a < 10) return "0" + a; return a.toString() } function m(a) { if (a < 10) return "00" + a; if (a < 100) return "0" + a; return a.toString() } function v(a) { if (a < 10) return "000" + a; else if (a < 100) return "00" + a; else if (a < 1000) return "0" + a; return a.toString() } var h, p, t = /([^d]|^)(d|dd)([^d]|$)/g; function s() { if (h || p) return h; h = t.test(e); p = true; return h } var q = 0, o = Date._getTokenRegExp(), f; if (!k && n) f = n.fromGregorian(this); for (; true;) { var w = o.lastIndex, i = o.exec(e), u = e.slice(w, i ? i.index : e.length); q += Date._appendPreOrPostMatch(u, a); if (!i) break; if (q % 2 === 1) { a.append(i[0]); continue } function g(a, b) { if (f) return f[b]; switch (b) { case 0: return a.getFullYear(); case 1: return a.getMonth(); case 2: return a.getDate() } } switch (i[0]) { case "dddd": a.append(b.DayNames[this.getDay()]); break; case "ddd": a.append(b.AbbreviatedDayNames[this.getDay()]); break; case "dd": h = true; a.append(d(g(this, 2))); break; case "d": h = true; a.append(g(this, 2)); break; case "MMMM": a.append(b.MonthGenitiveNames && s() ? b.MonthGenitiveNames[g(this, 1)] : b.MonthNames[g(this, 1)]); break; case "MMM": a.append(b.AbbreviatedMonthGenitiveNames && s() ? b.AbbreviatedMonthGenitiveNames[g(this, 1)] : b.AbbreviatedMonthNames[g(this, 1)]); break; case "MM": a.append(d(g(this, 1) + 1)); break; case "M": a.append(g(this, 1) + 1); break; case "yyyy": a.append(v(f ? f[0] : Date._getEraYear(this, b, Date._getEra(this, l), k))); break; case "yy": a.append(d((f ? f[0] : Date._getEraYear(this, b, Date._getEra(this, l), k)) % 100)); break; case "y": a.append((f ? f[0] : Date._getEraYear(this, b, Date._getEra(this, l), k)) % 100); break; case "hh": c = this.getHours() % 12; if (c === 0) c = 12; a.append(d(c)); break; case "h": c = this.getHours() % 12; if (c === 0) c = 12; a.append(c); break; case "HH": a.append(d(this.getHours())); break; case "H": a.append(this.getHours()); break; case "mm": a.append(d(this.getMinutes())); break; case "m": a.append(this.getMinutes()); break; case "ss": a.append(d(this.getSeconds())); break; case "s": a.append(this.getSeconds()); break; case "tt": a.append(this.getHours() < 12 ? b.AMDesignator : b.PMDesignator); break; case "t": a.append((this.getHours() < 12 ? b.AMDesignator : b.PMDesignator).charAt(0)); break; case "f": a.append(m(this.getMilliseconds()).charAt(0)); break; case "ff": a.append(m(this.getMilliseconds()).substr(0, 2)); break; case "fff": a.append(m(this.getMilliseconds())); break; case "z": c = this.getTimezoneOffset() / 60; a.append((c <= 0 ? "+" : "-") + Math.floor(Math.abs(c))); break; case "zz": c = this.getTimezoneOffset() / 60; a.append((c <= 0 ? "+" : "-") + d(Math.floor(Math.abs(c)))); break; case "zzz": c = this.getTimezoneOffset() / 60; a.append((c <= 0 ? "+" : "-") + d(Math.floor(Math.abs(c))) + ":" + d(Math.abs(this.getTimezoneOffset() % 60))); break; case "g": case "gg": if (b.eras) a.append(b.eras[Date._getEra(this, l) + 1]); break; case "/": a.append(b.DateSeparator) } } return a.toString() }; String.localeFormat = function () { return String._toFormattedString(true, arguments) }; Number.parseLocale = function (a) { return Number._parse(a, Sys.CultureInfo.CurrentCulture) }; Number.parseInvariant = function (a) { return Number._parse(a, Sys.CultureInfo.InvariantCulture) }; Number._parse = function (b, o) { b = b.trim(); if (b.match(/^[+-]?infinity$/i)) return parseFloat(b); if (b.match(/^0x[a-f0-9]+$/i)) return parseInt(b); var a = o.numberFormat, g = Number._parseNumberNegativePattern(b, a, a.NumberNegativePattern), h = g[0], e = g[1]; if (h === "" && a.NumberNegativePattern !== 1) { g = Number._parseNumberNegativePattern(b, a, 1); h = g[0]; e = g[1] } if (h === "") h = "+"; var j, d, f = e.indexOf("e"); if (f < 0) f = e.indexOf("E"); if (f < 0) { d = e; j = null } else { d = e.substr(0, f); j = e.substr(f + 1) } var c, k, m = d.indexOf(a.NumberDecimalSeparator); if (m < 0) { c = d; k = null } else { c = d.substr(0, m); k = d.substr(m + a.NumberDecimalSeparator.length) } c = c.split(a.NumberGroupSeparator).join(""); var n = a.NumberGroupSeparator.replace(/\u00A0/g, " "); if (a.NumberGroupSeparator !== n) c = c.split(n).join(""); var l = h + c; if (k !== null) l += "." + k; if (j !== null) { var i = Number._parseNumberNegativePattern(j, a, 1); if (i[0] === "") i[0] = "+"; l += "e" + i[0] + i[1] } if (l.match(/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/)) return parseFloat(l); return Number.NaN }; Number._parseNumberNegativePattern = function (a, d, e) { var b = d.NegativeSign, c = d.PositiveSign; switch (e) { case 4: b = " " + b; c = " " + c; case 3: if (a.endsWith(b)) return ["-", a.substr(0, a.length - b.length)]; else if (a.endsWith(c)) return ["+", a.substr(0, a.length - c.length)]; break; case 2: b += " "; c += " "; case 1: if (a.startsWith(b)) return ["-", a.substr(b.length)]; else if (a.startsWith(c)) return ["+", a.substr(c.length)]; break; case 0: if (a.startsWith("(") && a.endsWith(")")) return ["-", a.substr(1, a.length - 2)] }return ["", a] }; Number.prototype.format = function (a) { return this._toFormattedString(a, Sys.CultureInfo.InvariantCulture) }; Number.prototype.localeFormat = function (a) { return this._toFormattedString(a, Sys.CultureInfo.CurrentCulture) }; Number.prototype._toFormattedString = function (e, j) { if (!e || e.length === 0 || e === "i") if (j && j.name.length > 0) return this.toLocaleString(); else return this.toString(); var o = ["n %", "n%", "%n"], n = ["-n %", "-n%", "-%n"], p = ["(n)", "-n", "- n", "n-", "n -"], m = ["$n", "n$", "$ n", "n $"], l = ["($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"]; function g(a, c, d) { for (var b = a.length; b < c; b++)a = d ? "0" + a : a + "0"; return a } function i(j, i, l, n, p) { var h = l[0], k = 1, o = Math.pow(10, i), m = Math.round(j * o) / o; if (!isFinite(m)) m = j; j = m; var b = j.toString(), a = "", c, e = b.split(/e/i); b = e[0]; c = e.length > 1 ? parseInt(e[1]) : 0; e = b.split("."); b = e[0]; a = e.length > 1 ? e[1] : ""; var q; if (c > 0) { a = g(a, c, false); b += a.slice(0, c); a = a.substr(c) } else if (c < 0) { c = -c; b = g(b, c + 1, true); a = b.slice(-c, b.length) + a; b = b.slice(0, -c) } if (i > 0) { if (a.length > i) a = a.slice(0, i); else a = g(a, i, false); a = p + a } else a = ""; var d = b.length - 1, f = ""; while (d >= 0) { if (h === 0 || h > d) if (f.length > 0) return b.slice(0, d + 1) + n + f + a; else return b.slice(0, d + 1) + a; if (f.length > 0) f = b.slice(d - h + 1, d + 1) + n + f; else f = b.slice(d - h + 1, d + 1); d -= h; if (k < l.length) { h = l[k]; k++ } } return b.slice(0, d + 1) + n + f + a } var a = j.numberFormat, d = Math.abs(this); if (!e) e = "D"; var b = -1; if (e.length > 1) b = parseInt(e.slice(1), 10); var c; switch (e.charAt(0)) { case "d": case "D": c = "n"; if (b !== -1) d = g("" + d, b, true); if (this < 0) d = -d; break; case "c": case "C": if (this < 0) c = l[a.CurrencyNegativePattern]; else c = m[a.CurrencyPositivePattern]; if (b === -1) b = a.CurrencyDecimalDigits; d = i(Math.abs(this), b, a.CurrencyGroupSizes, a.CurrencyGroupSeparator, a.CurrencyDecimalSeparator); break; case "n": case "N": if (this < 0) c = p[a.NumberNegativePattern]; else c = "n"; if (b === -1) b = a.NumberDecimalDigits; d = i(Math.abs(this), b, a.NumberGroupSizes, a.NumberGroupSeparator, a.NumberDecimalSeparator); break; case "p": case "P": if (this < 0) c = n[a.PercentNegativePattern]; else c = o[a.PercentPositivePattern]; if (b === -1) b = a.PercentDecimalDigits; d = i(Math.abs(this) * 100, b, a.PercentGroupSizes, a.PercentGroupSeparator, a.PercentDecimalSeparator); break; default: throw Error.format(Sys.Res.formatBadFormatSpecifier) }var k = /n|\$|-|%/g, f = ""; for (; true;) { var q = k.lastIndex, h = k.exec(c); f += c.slice(q, h ? h.index : c.length); if (!h) break; switch (h[0]) { case "n": f += d; break; case "$": f += a.CurrencySymbol; break; case "-": if (/[1-9]/.test(d)) f += a.NegativeSign; break; case "%": f += a.PercentSymbol } } return f }; Sys.CultureInfo = function (c, b, a) { this.name = c; this.numberFormat = b; this.dateTimeFormat = a }; Sys.CultureInfo.prototype = { _getDateTimeFormats: function () { if (!this._dateTimeFormats) { var a = this.dateTimeFormat; this._dateTimeFormats = [a.MonthDayPattern, a.YearMonthPattern, a.ShortDatePattern, a.ShortTimePattern, a.LongDatePattern, a.LongTimePattern, a.FullDateTimePattern, a.RFC1123Pattern, a.SortableDateTimePattern, a.UniversalSortableDateTimePattern] } return this._dateTimeFormats }, _getIndex: function (c, d, e) { var b = this._toUpper(c), a = Array.indexOf(d, b); if (a === -1) a = Array.indexOf(e, b); return a }, _getMonthIndex: function (a) { if (!this._upperMonths) { this._upperMonths = this._toUpperArray(this.dateTimeFormat.MonthNames); this._upperMonthsGenitive = this._toUpperArray(this.dateTimeFormat.MonthGenitiveNames) } return this._getIndex(a, this._upperMonths, this._upperMonthsGenitive) }, _getAbbrMonthIndex: function (a) { if (!this._upperAbbrMonths) { this._upperAbbrMonths = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthNames); this._upperAbbrMonthsGenitive = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthGenitiveNames) } return this._getIndex(a, this._upperAbbrMonths, this._upperAbbrMonthsGenitive) }, _getDayIndex: function (a) { if (!this._upperDays) this._upperDays = this._toUpperArray(this.dateTimeFormat.DayNames); return Array.indexOf(this._upperDays, this._toUpper(a)) }, _getAbbrDayIndex: function (a) { if (!this._upperAbbrDays) this._upperAbbrDays = this._toUpperArray(this.dateTimeFormat.AbbreviatedDayNames); return Array.indexOf(this._upperAbbrDays, this._toUpper(a)) }, _toUpperArray: function (c) { var b = []; for (var a = 0, d = c.length; a < d; a++)b[a] = this._toUpper(c[a]); return b }, _toUpper: function (a) { return a.split("\u00a0").join(" ").toUpperCase() } }; Sys.CultureInfo.registerClass("Sys.CultureInfo"); Sys.CultureInfo._parse = function (a) { var b = a.dateTimeFormat; if (b && !b.eras) b.eras = a.eras; return new Sys.CultureInfo(a.name, a.numberFormat, b) }; Sys.CultureInfo.InvariantCulture = Sys.CultureInfo._parse({ "name": "", "numberFormat": { "CurrencyDecimalDigits": 2, "CurrencyDecimalSeparator": ".", "IsReadOnly": true, "CurrencyGroupSizes": [3], "NumberGroupSizes": [3], "PercentGroupSizes": [3], "CurrencyGroupSeparator": ",", "CurrencySymbol": "\u00a4", "NaNSymbol": "NaN", "CurrencyNegativePattern": 0, "NumberNegativePattern": 1, "PercentPositivePattern": 0, "PercentNegativePattern": 0, "NegativeInfinitySymbol": "-Infinity", "NegativeSign": "-", "NumberDecimalDigits": 2, "NumberDecimalSeparator": ".", "NumberGroupSeparator": ",", "CurrencyPositivePattern": 0, "PositiveInfinitySymbol": "Infinity", "PositiveSign": "+", "PercentDecimalDigits": 2, "PercentDecimalSeparator": ".", "PercentGroupSeparator": ",", "PercentSymbol": "%", "PerMilleSymbol": "\u2030", "NativeDigits": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], "DigitSubstitution": 1 }, "dateTimeFormat": { "AMDesignator": "AM", "Calendar": { "MinSupportedDateTime": "@-62135568000000@", "MaxSupportedDateTime": "@253402300799999@", "AlgorithmType": 1, "CalendarType": 1, "Eras": [1], "TwoDigitYearMax": 2029, "IsReadOnly": true }, "DateSeparator": "/", "FirstDayOfWeek": 0, "CalendarWeekRule": 0, "FullDateTimePattern": "dddd, dd MMMM yyyy HH:mm:ss", "LongDatePattern": "dddd, dd MMMM yyyy", "LongTimePattern": "HH:mm:ss", "MonthDayPattern": "MMMM dd", "PMDesignator": "PM", "RFC1123Pattern": "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'", "ShortDatePattern": "MM/dd/yyyy", "ShortTimePattern": "HH:mm", "SortableDateTimePattern": "yyyy'-'MM'-'dd'T'HH':'mm':'ss", "TimeSeparator": ":", "UniversalSortableDateTimePattern": "yyyy'-'MM'-'dd HH':'mm':'ss'Z'", "YearMonthPattern": "yyyy MMMM", "AbbreviatedDayNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "ShortestDayNames": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], "DayNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "AbbreviatedMonthNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], "MonthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], "IsReadOnly": true, "NativeCalendarName": "Gregorian Calendar", "AbbreviatedMonthGenitiveNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], "MonthGenitiveNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""] }, "eras": [1, "A.D.", null, 0] }); if (typeof __cultureInfo === "object") { Sys.CultureInfo.CurrentCulture = Sys.CultureInfo._parse(__cultureInfo); delete __cultureInfo } else Sys.CultureInfo.CurrentCulture = Sys.CultureInfo._parse({ "name": "en-US", "numberFormat": { "CurrencyDecimalDigits": 2, "CurrencyDecimalSeparator": ".", "IsReadOnly": false, "CurrencyGroupSizes": [3], "NumberGroupSizes": [3], "PercentGroupSizes": [3], "CurrencyGroupSeparator": ",", "CurrencySymbol": "$", "NaNSymbol": "NaN", "CurrencyNegativePattern": 0, "NumberNegativePattern": 1, "PercentPositivePattern": 0, "PercentNegativePattern": 0, "NegativeInfinitySymbol": "-Infinity", "NegativeSign": "-", "NumberDecimalDigits": 2, "NumberDecimalSeparator": ".", "NumberGroupSeparator": ",", "CurrencyPositivePattern": 0, "PositiveInfinitySymbol": "Infinity", "PositiveSign": "+", "PercentDecimalDigits": 2, "PercentDecimalSeparator": ".", "PercentGroupSeparator": ",", "PercentSymbol": "%", "PerMilleSymbol": "\u2030", "NativeDigits": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], "DigitSubstitution": 1 }, "dateTimeFormat": { "AMDesignator": "AM", "Calendar": { "MinSupportedDateTime": "@-62135568000000@", "MaxSupportedDateTime": "@253402300799999@", "AlgorithmType": 1, "CalendarType": 1, "Eras": [1], "TwoDigitYearMax": 2029, "IsReadOnly": false }, "DateSeparator": "/", "FirstDayOfWeek": 0, "CalendarWeekRule": 0, "FullDateTimePattern": "dddd, MMMM dd, yyyy h:mm:ss tt", "LongDatePattern": "dddd, MMMM dd, yyyy", "LongTimePattern": "h:mm:ss tt", "MonthDayPattern": "MMMM dd", "PMDesignator": "PM", "RFC1123Pattern": "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'", "ShortDatePattern": "M/d/yyyy", "ShortTimePattern": "h:mm tt", "SortableDateTimePattern": "yyyy'-'MM'-'dd'T'HH':'mm':'ss", "TimeSeparator": ":", "UniversalSortableDateTimePattern": "yyyy'-'MM'-'dd HH':'mm':'ss'Z'", "YearMonthPattern": "MMMM, yyyy", "AbbreviatedDayNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "ShortestDayNames": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], "DayNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "AbbreviatedMonthNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], "MonthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], "IsReadOnly": false, "NativeCalendarName": "Gregorian Calendar", "AbbreviatedMonthGenitiveNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], "MonthGenitiveNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""] }, "eras": [1, "A.D.", null, 0] }); Type.registerNamespace("Sys.Serialization"); Sys.Serialization.JavaScriptSerializer = function () { }; Sys.Serialization.JavaScriptSerializer.registerClass("Sys.Serialization.JavaScriptSerializer"); Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs = []; Sys.Serialization.JavaScriptSerializer._charsToEscape = []; Sys.Serialization.JavaScriptSerializer._dateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', "g"); Sys.Serialization.JavaScriptSerializer._escapeChars = {}; Sys.Serialization.JavaScriptSerializer._escapeRegEx = new RegExp('["\\\\\\x00-\\x1F]', "i"); Sys.Serialization.JavaScriptSerializer._escapeRegExGlobal = new RegExp('["\\\\\\x00-\\x1F]', "g"); Sys.Serialization.JavaScriptSerializer._jsonRegEx = new RegExp("[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]", "g"); Sys.Serialization.JavaScriptSerializer._jsonStringRegEx = new RegExp('"(\\\\.|[^"\\\\])*"', "g"); Sys.Serialization.JavaScriptSerializer._serverTypeFieldName = "__type"; Sys.Serialization.JavaScriptSerializer._init = function () { var c = ["\\u0000", "\\u0001", "\\u0002", "\\u0003", "\\u0004", "\\u0005", "\\u0006", "\\u0007", "\\b", "\\t", "\\n", "\\u000b", "\\f", "\\r", "\\u000e", "\\u000f", "\\u0010", "\\u0011", "\\u0012", "\\u0013", "\\u0014", "\\u0015", "\\u0016", "\\u0017", "\\u0018", "\\u0019", "\\u001a", "\\u001b", "\\u001c", "\\u001d", "\\u001e", "\\u001f"]; Sys.Serialization.JavaScriptSerializer._charsToEscape[0] = "\\"; Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs["\\"] = new RegExp("\\\\", "g"); Sys.Serialization.JavaScriptSerializer._escapeChars["\\"] = "\\\\"; Sys.Serialization.JavaScriptSerializer._charsToEscape[1] = '"'; Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs['"'] = new RegExp('"', "g"); Sys.Serialization.JavaScriptSerializer._escapeChars['"'] = '\\"'; for (var a = 0; a < 32; a++) { var b = String.fromCharCode(a); Sys.Serialization.JavaScriptSerializer._charsToEscape[a + 2] = b; Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs[b] = new RegExp(b, "g"); Sys.Serialization.JavaScriptSerializer._escapeChars[b] = c[a] } }; Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder = function (b, a) { a.append(b.toString()) }; Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder = function (a, b) { if (isFinite(a)) b.append(String(a)); else throw Error.invalidOperation(Sys.Res.cannotSerializeNonFiniteNumbers) }; Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder = function (a, c) { c.append('"'); if (Sys.Serialization.JavaScriptSerializer._escapeRegEx.test(a)) { if (Sys.Serialization.JavaScriptSerializer._charsToEscape.length === 0) Sys.Serialization.JavaScriptSerializer._init(); if (a.length < 128) a = a.replace(Sys.Serialization.JavaScriptSerializer._escapeRegExGlobal, function (a) { return Sys.Serialization.JavaScriptSerializer._escapeChars[a] }); else for (var d = 0; d < 34; d++) { var b = Sys.Serialization.JavaScriptSerializer._charsToEscape[d]; if (a.indexOf(b) !== -1) if (Sys.Browser.agent === Sys.Browser.Opera || Sys.Browser.agent === Sys.Browser.FireFox) a = a.split(b).join(Sys.Serialization.JavaScriptSerializer._escapeChars[b]); else a = a.replace(Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs[b], Sys.Serialization.JavaScriptSerializer._escapeChars[b]) } } c.append(a); c.append('"') }; Sys.Serialization.JavaScriptSerializer._serializeWithBuilder = function (b, a, i, g) { var c; switch (typeof b) { case "object": if (b) if (Number.isInstanceOfType(b)) Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder(b, a); else if (Boolean.isInstanceOfType(b)) Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder(b, a); else if (String.isInstanceOfType(b)) Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder(b, a); else if (Array.isInstanceOfType(b)) { a.append("["); for (c = 0; c < b.length; ++c) { if (c > 0) a.append(","); Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(b[c], a, false, g) } a.append("]") } else { if (Date.isInstanceOfType(b)) { a.append('"\\/Date('); a.append(b.getTime()); a.append(')\\/"'); break } var d = [], f = 0; for (var e in b) { if (e.startsWith("$")) continue; if (e === Sys.Serialization.JavaScriptSerializer._serverTypeFieldName && f !== 0) { d[f++] = d[0]; d[0] = e } else d[f++] = e } if (i) d.sort(); a.append("{"); var j = false; for (c = 0; c < f; c++) { var h = b[d[c]]; if (typeof h !== "undefined" && typeof h !== "function") { if (j) a.append(","); else j = true; Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(d[c], a, i, g); a.append(":"); Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(h, a, i, g) } } a.append("}") } else a.append("null"); break; case "number": Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder(b, a); break; case "string": Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder(b, a); break; case "boolean": Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder(b, a); break; default: a.append("null") } }; Sys.Serialization.JavaScriptSerializer.serialize = function (b) { var a = new Sys.StringBuilder; Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(b, a, false); return a.toString() }; Sys.Serialization.JavaScriptSerializer.deserialize = function (data, secure) { if (data.length === 0) throw Error.argument("data", Sys.Res.cannotDeserializeEmptyString); try { var exp = data.replace(Sys.Serialization.JavaScriptSerializer._dateRegEx, "$1new Date($2)"); if (secure && Sys.Serialization.JavaScriptSerializer._jsonRegEx.test(exp.replace(Sys.Serialization.JavaScriptSerializer._jsonStringRegEx, ""))) throw null; return eval("(" + exp + ")") } catch (a) { throw Error.argument("data", Sys.Res.cannotDeserializeInvalidJson) } }; Type.registerNamespace("Sys.UI"); Sys.EventHandlerList = function () { this._list = {} }; Sys.EventHandlerList.prototype = { _addHandler: function (b, a) { Array.add(this._getEvent(b, true), a) }, addHandler: function (b, a) { this._addHandler(b, a) }, _removeHandler: function (c, b) { var a = this._getEvent(c); if (!a) return; Array.remove(a, b) }, removeHandler: function (b, a) { this._removeHandler(b, a) }, getHandler: function (b) { var a = this._getEvent(b); if (!a || a.length === 0) return null; a = Array.clone(a); return function (c, d) { for (var b = 0, e = a.length; b < e; b++)a[b](c, d) } }, _getEvent: function (a, b) { if (!this._list[a]) { if (!b) return null; this._list[a] = [] } return this._list[a] } }; Sys.EventHandlerList.registerClass("Sys.EventHandlerList"); Sys.CommandEventArgs = function (c, a, b) { Sys.CommandEventArgs.initializeBase(this); this._commandName = c; this._commandArgument = a; this._commandSource = b }; Sys.CommandEventArgs.prototype = { _commandName: null, _commandArgument: null, _commandSource: null, get_commandName: function () { return this._commandName }, get_commandArgument: function () { return this._commandArgument }, get_commandSource: function () { return this._commandSource } }; Sys.CommandEventArgs.registerClass("Sys.CommandEventArgs", Sys.CancelEventArgs); Sys.INotifyPropertyChange = function () { }; Sys.INotifyPropertyChange.prototype = {}; Sys.INotifyPropertyChange.registerInterface("Sys.INotifyPropertyChange"); Sys.PropertyChangedEventArgs = function (a) { Sys.PropertyChangedEventArgs.initializeBase(this); this._propertyName = a }; Sys.PropertyChangedEventArgs.prototype = { get_propertyName: function () { return this._propertyName } }; Sys.PropertyChangedEventArgs.registerClass("Sys.PropertyChangedEventArgs", Sys.EventArgs); Sys.INotifyDisposing = function () { }; Sys.INotifyDisposing.prototype = {}; Sys.INotifyDisposing.registerInterface("Sys.INotifyDisposing"); Sys.Component = function () { if (Sys.Application) Sys.Application.registerDisposableObject(this) }; Sys.Component.prototype = { _id: null, _initialized: false, _updating: false, get_events: function () { if (!this._events) this._events = new Sys.EventHandlerList; return this._events }, get_id: function () { return this._id }, set_id: function (a) { this._id = a }, get_isInitialized: function () { return this._initialized }, get_isUpdating: function () { return this._updating }, add_disposing: function (a) { this.get_events().addHandler("disposing", a) }, remove_disposing: function (a) { this.get_events().removeHandler("disposing", a) }, add_propertyChanged: function (a) { this.get_events().addHandler("propertyChanged", a) }, remove_propertyChanged: function (a) { this.get_events().removeHandler("propertyChanged", a) }, beginUpdate: function () { this._updating = true }, dispose: function () { if (this._events) { var a = this._events.getHandler("disposing"); if (a) a(this, Sys.EventArgs.Empty) } delete this._events; Sys.Application.unregisterDisposableObject(this); Sys.Application.removeComponent(this) }, endUpdate: function () { this._updating = false; if (!this._initialized) this.initialize(); this.updated() }, initialize: function () { this._initialized = true }, raisePropertyChanged: function (b) { if (!this._events) return; var a = this._events.getHandler("propertyChanged"); if (a) a(this, new Sys.PropertyChangedEventArgs(b)) }, updated: function () { } }; Sys.Component.registerClass("Sys.Component", null, Sys.IDisposable, Sys.INotifyPropertyChange, Sys.INotifyDisposing); function Sys$Component$_setProperties(a, i) { var d, j = Object.getType(a), e = j === Object || j === Sys.UI.DomElement, h = Sys.Component.isInstanceOfType(a) && !a.get_isUpdating(); if (h) a.beginUpdate(); for (var c in i) { var b = i[c], f = e ? null : a["get_" + c]; if (e || typeof f !== "function") { var k = a[c]; if (!b || typeof b !== "object" || e && !k) a[c] = b; else Sys$Component$_setProperties(k, b) } else { var l = a["set_" + c]; if (typeof l === "function") l.apply(a, [b]); else if (b instanceof Array) { d = f.apply(a); for (var g = 0, m = d.length, n = b.length; g < n; g++, m++)d[m] = b[g] } else if (typeof b === "object" && Object.getType(b) === Object) { d = f.apply(a); Sys$Component$_setProperties(d, b) } } } if (h) a.endUpdate() } function Sys$Component$_setReferences(c, b) { for (var a in b) { var e = c["set_" + a], d = $find(b[a]); e.apply(c, [d]) } } var $create = Sys.Component.create = function (h, f, d, c, g) { var a = g ? new h(g) : new h, b = Sys.Application, i = b.get_isCreatingComponents(); a.beginUpdate(); if (f) Sys$Component$_setProperties(a, f); if (d) for (var e in d) a["add_" + e](d[e]); if (a.get_id()) b.addComponent(a); if (i) { b._createdComponents[b._createdComponents.length] = a; if (c) b._addComponentToSecondPass(a, c); else a.endUpdate() } else { if (c) Sys$Component$_setReferences(a, c); a.endUpdate() } return a }; Sys.UI.MouseButton = function () { throw Error.notImplemented() }; Sys.UI.MouseButton.prototype = { leftButton: 0, middleButton: 1, rightButton: 2 }; Sys.UI.MouseButton.registerEnum("Sys.UI.MouseButton"); Sys.UI.Key = function () { throw Error.notImplemented() }; Sys.UI.Key.prototype = { backspace: 8, tab: 9, enter: 13, esc: 27, space: 32, pageUp: 33, pageDown: 34, end: 35, home: 36, left: 37, up: 38, right: 39, down: 40, del: 127 }; Sys.UI.Key.registerEnum("Sys.UI.Key"); Sys.UI.Point = function (a, b) { this.x = a; this.y = b }; Sys.UI.Point.registerClass("Sys.UI.Point"); Sys.UI.Bounds = function (c, d, b, a) { this.x = c; this.y = d; this.height = a; this.width = b }; Sys.UI.Bounds.registerClass("Sys.UI.Bounds"); Sys.UI.DomEvent = function (e) { var a = e, b = this.type = a.type.toLowerCase(); this.rawEvent = a; this.altKey = a.altKey; if (typeof a.button !== "undefined") this.button = typeof a.which !== "undefined" ? a.button : a.button === 4 ? Sys.UI.MouseButton.middleButton : a.button === 2 ? Sys.UI.MouseButton.rightButton : Sys.UI.MouseButton.leftButton; if (b === "keypress") this.charCode = a.charCode || a.keyCode; else if (a.keyCode && a.keyCode === 46) this.keyCode = 127; else this.keyCode = a.keyCode; this.clientX = a.clientX; this.clientY = a.clientY; this.ctrlKey = a.ctrlKey; this.target = a.target ? a.target : a.srcElement; if (!b.startsWith("key")) if (typeof a.offsetX !== "undefined" && typeof a.offsetY !== "undefined") { this.offsetX = a.offsetX; this.offsetY = a.offsetY } else if (this.target && this.target.nodeType !== 3 && typeof a.clientX === "number") { var c = Sys.UI.DomElement.getLocation(this.target), d = Sys.UI.DomElement._getWindow(this.target); this.offsetX = (d.pageXOffset || 0) + a.clientX - c.x; this.offsetY = (d.pageYOffset || 0) + a.clientY - c.y } this.screenX = a.screenX; this.screenY = a.screenY; this.shiftKey = a.shiftKey }; Sys.UI.DomEvent.prototype = { preventDefault: function () { if (this.rawEvent.preventDefault) this.rawEvent.preventDefault(); else if (window.event) this.rawEvent.returnValue = false }, stopPropagation: function () { if (this.rawEvent.stopPropagation) this.rawEvent.stopPropagation(); else if (window.event) this.rawEvent.cancelBubble = true } }; Sys.UI.DomEvent.registerClass("Sys.UI.DomEvent"); var $addHandler = Sys.UI.DomEvent.addHandler = function (a, d, e, g) { if (!a._events) a._events = {}; var c = a._events[d]; if (!c) a._events[d] = c = []; var b; if (a.addEventListener) { b = function (b) { return e.call(a, new Sys.UI.DomEvent(b)) }; a.addEventListener(d, b, false) } else if (a.attachEvent) { b = function () { var b = {}; try { b = Sys.UI.DomElement._getWindow(a).event } catch (c) { } return e.call(a, new Sys.UI.DomEvent(b)) }; a.attachEvent("on" + d, b) } c[c.length] = { handler: e, browserHandler: b, autoRemove: g }; if (g) { var f = a.dispose; if (f !== Sys.UI.DomEvent._disposeHandlers) { a.dispose = Sys.UI.DomEvent._disposeHandlers; if (typeof f !== "undefined") a._chainDispose = f } } }, $addHandlers = Sys.UI.DomEvent.addHandlers = function (f, d, c, e) { for (var b in d) { var a = d[b]; if (c) a = Function.createDelegate(c, a); $addHandler(f, b, a, e || false) } }, $clearHandlers = Sys.UI.DomEvent.clearHandlers = function (a) { Sys.UI.DomEvent._clearHandlers(a, false) }; Sys.UI.DomEvent._clearHandlers = function (a, g) { if (a._events) { var e = a._events; for (var b in e) { var d = e[b]; for (var c = d.length - 1; c >= 0; c--) { var f = d[c]; if (!g || f.autoRemove) $removeHandler(a, b, f.handler) } } a._events = null } }; Sys.UI.DomEvent._disposeHandlers = function () { Sys.UI.DomEvent._clearHandlers(this, true); var b = this._chainDispose, a = typeof b; if (a !== "undefined") { this.dispose = b; this._chainDispose = null; if (a === "function") this.dispose() } }; var $removeHandler = Sys.UI.DomEvent.removeHandler = function (b, a, c) { Sys.UI.DomEvent._removeHandler(b, a, c) }; Sys.UI.DomEvent._removeHandler = function (a, e, f) { var d = null, c = a._events[e]; for (var b = 0, g = c.length; b < g; b++)if (c[b].handler === f) { d = c[b].browserHandler; break } if (a.removeEventListener) a.removeEventListener(e, d, false); else if (a.detachEvent) a.detachEvent("on" + e, d); c.splice(b, 1) }; Sys.UI.DomElement = function () { }; Sys.UI.DomElement.registerClass("Sys.UI.DomElement"); Sys.UI.DomElement.addCssClass = function (a, b) { if (!Sys.UI.DomElement.containsCssClass(a, b)) if (a.className === "") a.className = b; else a.className += " " + b }; Sys.UI.DomElement.containsCssClass = function (b, a) { return Array.contains(b.className.split(" "), a) }; Sys.UI.DomElement.getBounds = function (a) { var b = Sys.UI.DomElement.getLocation(a); return new Sys.UI.Bounds(b.x, b.y, a.offsetWidth || 0, a.offsetHeight || 0) }; var $get = Sys.UI.DomElement.getElementById = function (f, e) { if (!e) return document.getElementById(f); if (e.getElementById) return e.getElementById(f); var c = [], d = e.childNodes; for (var b = 0; b < d.length; b++) { var a = d[b]; if (a.nodeType == 1) c[c.length] = a } while (c.length) { a = c.shift(); if (a.id == f) return a; d = a.childNodes; for (b = 0; b < d.length; b++) { a = d[b]; if (a.nodeType == 1) c[c.length] = a } } return null }; if (document.documentElement.getBoundingClientRect) Sys.UI.DomElement.getLocation = function (b) { if (b.self || b.nodeType === 9 || b === document.documentElement || b.parentNode === b.ownerDocument.documentElement) return new Sys.UI.Point(0, 0); var f = b.getBoundingClientRect(); if (!f) return new Sys.UI.Point(0, 0); var k, e = b.ownerDocument.documentElement, c = Math.round(f.left) + e.scrollLeft, d = Math.round(f.top) + e.scrollTop; if (Sys.Browser.agent === Sys.Browser.InternetExplorer) { try { var g = b.ownerDocument.parentWindow.frameElement || null; if (g) { var h = g.frameBorder === "0" || g.frameBorder === "no" ? 2 : 0; c += h; d += h } } catch (l) { } if (Sys.Browser.version === 7 && !document.documentMode) { var i = document.body, j = i.getBoundingClientRect(), a = (j.right - j.left) / i.clientWidth; a = Math.round(a * 100); a = (a - a % 5) / 100; if (!isNaN(a) && a !== 1) { c = Math.round(c / a); d = Math.round(d / a) } } if ((document.documentMode || 0) < 8) { c -= e.clientLeft; d -= e.clientTop } } return new Sys.UI.Point(c, d) }; else if (Sys.Browser.agent === Sys.Browser.Safari) Sys.UI.DomElement.getLocation = function (c) { if (c.window && c.window === c || c.nodeType === 9) return new Sys.UI.Point(0, 0); var d = 0, e = 0, a, j = null, g = null, b; for (a = c; a; j = a, (g = b, a = a.offsetParent)) { b = Sys.UI.DomElement._getCurrentStyle(a); var f = a.tagName ? a.tagName.toUpperCase() : null; if ((a.offsetLeft || a.offsetTop) && (f !== "BODY" || (!g || g.position !== "absolute"))) { d += a.offsetLeft; e += a.offsetTop } if (j && Sys.Browser.version >= 3) { d += parseInt(b.borderLeftWidth); e += parseInt(b.borderTopWidth) } } b = Sys.UI.DomElement._getCurrentStyle(c); var h = b ? b.position : null; if (!h || h !== "absolute") for (a = c.parentNode; a; a = a.parentNode) { f = a.tagName ? a.tagName.toUpperCase() : null; if (f !== "BODY" && f !== "HTML" && (a.scrollLeft || a.scrollTop)) { d -= a.scrollLeft || 0; e -= a.scrollTop || 0 } b = Sys.UI.DomElement._getCurrentStyle(a); var i = b ? b.position : null; if (i && i === "absolute") break } return new Sys.UI.Point(d, e) }; else Sys.UI.DomElement.getLocation = function (d) { if (d.window && d.window === d || d.nodeType === 9) return new Sys.UI.Point(0, 0); var e = 0, f = 0, a, i = null, g = null, b = null; for (a = d; a; i = a, (g = b, a = a.offsetParent)) { var c = a.tagName ? a.tagName.toUpperCase() : null; b = Sys.UI.DomElement._getCurrentStyle(a); if ((a.offsetLeft || a.offsetTop) && !(c === "BODY" && (!g || g.position !== "absolute"))) { e += a.offsetLeft; f += a.offsetTop } if (i !== null && b) { if (c !== "TABLE" && c !== "TD" && c !== "HTML") { e += parseInt(b.borderLeftWidth) || 0; f += parseInt(b.borderTopWidth) || 0 } if (c === "TABLE" && (b.position === "relative" || b.position === "absolute")) { e += parseInt(b.marginLeft) || 0; f += parseInt(b.marginTop) || 0 } } } b = Sys.UI.DomElement._getCurrentStyle(d); var h = b ? b.position : null; if (!h || h !== "absolute") for (a = d.parentNode; a; a = a.parentNode) { c = a.tagName ? a.tagName.toUpperCase() : null; if (c !== "BODY" && c !== "HTML" && (a.scrollLeft || a.scrollTop)) { e -= a.scrollLeft || 0; f -= a.scrollTop || 0; b = Sys.UI.DomElement._getCurrentStyle(a); if (b) { e += parseInt(b.borderLeftWidth) || 0; f += parseInt(b.borderTopWidth) || 0 } } } return new Sys.UI.Point(e, f) }; Sys.UI.DomElement.isDomElement = function (a) { return Sys._isDomElement(a) }; Sys.UI.DomElement.removeCssClass = function (d, c) { var a = " " + d.className + " ", b = a.indexOf(" " + c + " "); if (b >= 0) d.className = (a.substr(0, b) + " " + a.substring(b + c.length + 1, a.length)).trim() }; Sys.UI.DomElement.resolveElement = function (b, c) { var a = b; if (!a) return null; if (typeof a === "string") a = Sys.UI.DomElement.getElementById(a, c); return a }; Sys.UI.DomElement.raiseBubbleEvent = function (c, d) { var b = c; while (b) { var a = b.control; if (a && a.onBubbleEvent && a.raiseBubbleEvent) { Sys.UI.DomElement._raiseBubbleEventFromControl(a, c, d); return } b = b.parentNode } }; Sys.UI.DomElement._raiseBubbleEventFromControl = function (a, b, c) { if (!a.onBubbleEvent(b, c)) a._raiseBubbleEvent(b, c) }; Sys.UI.DomElement.setLocation = function (b, c, d) { var a = b.style; a.position = "absolute"; a.left = c + "px"; a.top = d + "px" }; Sys.UI.DomElement.toggleCssClass = function (b, a) { if (Sys.UI.DomElement.containsCssClass(b, a)) Sys.UI.DomElement.removeCssClass(b, a); else Sys.UI.DomElement.addCssClass(b, a) }; Sys.UI.DomElement.getVisibilityMode = function (a) { return a._visibilityMode === Sys.UI.VisibilityMode.hide ? Sys.UI.VisibilityMode.hide : Sys.UI.VisibilityMode.collapse }; Sys.UI.DomElement.setVisibilityMode = function (a, b) { Sys.UI.DomElement._ensureOldDisplayMode(a); if (a._visibilityMode !== b) { a._visibilityMode = b; if (Sys.UI.DomElement.getVisible(a) === false) if (a._visibilityMode === Sys.UI.VisibilityMode.hide) a.style.display = a._oldDisplayMode; else a.style.display = "none"; a._visibilityMode = b } }; Sys.UI.DomElement.getVisible = function (b) { var a = b.currentStyle || Sys.UI.DomElement._getCurrentStyle(b); if (!a) return true; return a.visibility !== "hidden" && a.display !== "none" }; Sys.UI.DomElement.setVisible = function (a, b) { if (b !== Sys.UI.DomElement.getVisible(a)) { Sys.UI.DomElement._ensureOldDisplayMode(a); a.style.visibility = b ? "visible" : "hidden"; if (b || a._visibilityMode === Sys.UI.VisibilityMode.hide) a.style.display = a._oldDisplayMode; else a.style.display = "none" } }; Sys.UI.DomElement._ensureOldDisplayMode = function (a) { if (!a._oldDisplayMode) { var b = a.currentStyle || Sys.UI.DomElement._getCurrentStyle(a); a._oldDisplayMode = b ? b.display : null; if (!a._oldDisplayMode || a._oldDisplayMode === "none") switch (a.tagName.toUpperCase()) { case "DIV": case "P": case "ADDRESS": case "BLOCKQUOTE": case "BODY": case "COL": case "COLGROUP": case "DD": case "DL": case "DT": case "FIELDSET": case "FORM": case "H1": case "H2": case "H3": case "H4": case "H5": case "H6": case "HR": case "IFRAME": case "LEGEND": case "OL": case "PRE": case "TABLE": case "TD": case "TH": case "TR": case "UL": a._oldDisplayMode = "block"; break; case "LI": a._oldDisplayMode = "list-item"; break; default: a._oldDisplayMode = "inline" } } }; Sys.UI.DomElement._getWindow = function (a) { var b = a.ownerDocument || a.document || a; return b.defaultView || b.parentWindow }; Sys.UI.DomElement._getCurrentStyle = function (a) { if (a.nodeType === 3) return null; var c = Sys.UI.DomElement._getWindow(a); if (a.documentElement) a = a.documentElement; var b = c && a !== c && c.getComputedStyle ? c.getComputedStyle(a, null) : a.currentStyle || a.style; if (!b && Sys.Browser.agent === Sys.Browser.Safari && a.style) { var g = a.style.display, f = a.style.position; a.style.position = "absolute"; a.style.display = "block"; var e = c.getComputedStyle(a, null); a.style.display = g; a.style.position = f; b = {}; for (var d in e) b[d] = e[d]; b.display = "none" } return b }; Sys.IContainer = function () { }; Sys.IContainer.prototype = {}; Sys.IContainer.registerInterface("Sys.IContainer"); Sys.ApplicationLoadEventArgs = function (b, a) { Sys.ApplicationLoadEventArgs.initializeBase(this); this._components = b; this._isPartialLoad = a }; Sys.ApplicationLoadEventArgs.prototype = { get_components: function () { return this._components }, get_isPartialLoad: function () { return this._isPartialLoad } }; Sys.ApplicationLoadEventArgs.registerClass("Sys.ApplicationLoadEventArgs", Sys.EventArgs); Sys._Application = function () { Sys._Application.initializeBase(this); this._disposableObjects = []; this._components = {}; this._createdComponents = []; this._secondPassComponents = []; this._unloadHandlerDelegate = Function.createDelegate(this, this._unloadHandler); Sys.UI.DomEvent.addHandler(window, "unload", this._unloadHandlerDelegate); this._domReady() }; Sys._Application.prototype = { _creatingComponents: false, _disposing: false, _deleteCount: 0, get_isCreatingComponents: function () { return this._creatingComponents }, get_isDisposing: function () { return this._disposing }, add_init: function (a) { if (this._initialized) a(this, Sys.EventArgs.Empty); else this.get_events().addHandler("init", a) }, remove_init: function (a) { this.get_events().removeHandler("init", a) }, add_load: function (a) { this.get_events().addHandler("load", a) }, remove_load: function (a) { this.get_events().removeHandler("load", a) }, add_unload: function (a) { this.get_events().addHandler("unload", a) }, remove_unload: function (a) { this.get_events().removeHandler("unload", a) }, addComponent: function (a) { this._components[a.get_id()] = a }, beginCreateComponents: function () { this._creatingComponents = true }, dispose: function () { if (!this._disposing) { this._disposing = true; if (this._timerCookie) { window.clearTimeout(this._timerCookie); delete this._timerCookie } if (this._endRequestHandler) { Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(this._endRequestHandler); delete this._endRequestHandler } if (this._beginRequestHandler) { Sys.WebForms.PageRequestManager.getInstance().remove_beginRequest(this._beginRequestHandler); delete this._beginRequestHandler } if (window.pageUnload) window.pageUnload(this, Sys.EventArgs.Empty); var c = this.get_events().getHandler("unload"); if (c) c(this, Sys.EventArgs.Empty); var b = Array.clone(this._disposableObjects); for (var a = 0, f = b.length; a < f; a++) { var d = b[a]; if (typeof d !== "undefined") d.dispose() } Array.clear(this._disposableObjects); Sys.UI.DomEvent.removeHandler(window, "unload", this._unloadHandlerDelegate); if (Sys._ScriptLoader) { var e = Sys._ScriptLoader.getInstance(); if (e) e.dispose() } Sys._Application.callBaseMethod(this, "dispose") } }, disposeElement: function (c, j) { if (c.nodeType === 1) { var b, h = c.getElementsByTagName("*"), g = h.length, i = new Array(g); for (b = 0; b < g; b++)i[b] = h[b]; for (b = g - 1; b >= 0; b--) { var d = i[b], f = d.dispose; if (f && typeof f === "function") d.dispose(); else { var e = d.control; if (e && typeof e.dispose === "function") e.dispose() } var a = d._behaviors; if (a) this._disposeComponents(a); a = d._components; if (a) { this._disposeComponents(a); d._components = null } } if (!j) { var f = c.dispose; if (f && typeof f === "function") c.dispose(); else { var e = c.control; if (e && typeof e.dispose === "function") e.dispose() } var a = c._behaviors; if (a) this._disposeComponents(a); a = c._components; if (a) { this._disposeComponents(a); c._components = null } } } }, endCreateComponents: function () { var b = this._secondPassComponents; for (var a = 0, d = b.length; a < d; a++) { var c = b[a].component; Sys$Component$_setReferences(c, b[a].references); c.endUpdate() } this._secondPassComponents = []; this._creatingComponents = false }, findComponent: function (b, a) { return a ? Sys.IContainer.isInstanceOfType(a) ? a.findComponent(b) : a[b] || null : Sys.Application._components[b] || null }, getComponents: function () { var a = [], b = this._components; for (var c in b) a[a.length] = b[c]; return a }, initialize: function () { if (!this.get_isInitialized() && !this._disposing) { Sys._Application.callBaseMethod(this, "initialize"); this._raiseInit(); if (this.get_stateString) { if (Sys.WebForms && Sys.WebForms.PageRequestManager) { this._beginRequestHandler = Function.createDelegate(this, this._onPageRequestManagerBeginRequest); Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(this._beginRequestHandler); this._endRequestHandler = Function.createDelegate(this, this._onPageRequestManagerEndRequest); Sys.WebForms.PageRequestManager.getInstance().add_endRequest(this._endRequestHandler) } var a = this.get_stateString(); if (a !== this._currentEntry) this._navigate(a); else this._ensureHistory() } this.raiseLoad() } }, notifyScriptLoaded: function () { }, registerDisposableObject: function (b) { if (!this._disposing) { var a = this._disposableObjects, c = a.length; a[c] = b; b.__msdisposeindex = c } }, raiseLoad: function () { var b = this.get_events().getHandler("load"), a = new Sys.ApplicationLoadEventArgs(Array.clone(this._createdComponents), !!this._loaded); this._loaded = true; if (b) b(this, a); if (window.pageLoad) window.pageLoad(this, a); this._createdComponents = [] }, removeComponent: function (b) { var a = b.get_id(); if (a) delete this._components[a] }, unregisterDisposableObject: function (a) { if (!this._disposing) { var e = a.__msdisposeindex; if (typeof e === "number") { var b = this._disposableObjects; delete b[e]; delete a.__msdisposeindex; if (++this._deleteCount > 1000) { var c = []; for (var d = 0, f = b.length; d < f; d++) { a = b[d]; if (typeof a !== "undefined") { a.__msdisposeindex = c.length; c.push(a) } } this._disposableObjects = c; this._deleteCount = 0 } } } }, _addComponentToSecondPass: function (b, a) { this._secondPassComponents[this._secondPassComponents.length] = { component: b, references: a } }, _disposeComponents: function (a) { if (a) for (var b = a.length - 1; b >= 0; b--) { var c = a[b]; if (typeof c.dispose === "function") c.dispose() } }, _domReady: function () { var a, g, f = this; function b() { f.initialize() } var c = function () { Sys.UI.DomEvent.removeHandler(window, "load", c); b() }; Sys.UI.DomEvent.addHandler(window, "load", c); if (document.addEventListener) try { document.addEventListener("DOMContentLoaded", a = function () { document.removeEventListener("DOMContentLoaded", a, false); b() }, false) } catch (h) { } else if (document.attachEvent) if (window == window.top && document.documentElement.doScroll) { var e, d = document.createElement("div"); a = function () { try { d.doScroll("left") } catch (c) { e = window.setTimeout(a, 0); return } d = null; b() }; a() } else document.attachEvent("onreadystatechange", a = function () { if (document.readyState === "complete") { document.detachEvent("onreadystatechange", a); b() } }) }, _raiseInit: function () { var a = this.get_events().getHandler("init"); if (a) { this.beginCreateComponents(); a(this, Sys.EventArgs.Empty); this.endCreateComponents() } }, _unloadHandler: function () { this.dispose() } }; Sys._Application.registerClass("Sys._Application", Sys.Component, Sys.IContainer); Sys.Application = new Sys._Application; var $find = Sys.Application.findComponent; Sys.UI.Behavior = function (b) { Sys.UI.Behavior.initializeBase(this); this._element = b; var a = b._behaviors; if (!a) b._behaviors = [this]; else a[a.length] = this }; Sys.UI.Behavior.prototype = { _name: null, get_element: function () { return this._element }, get_id: function () { var a = Sys.UI.Behavior.callBaseMethod(this, "get_id"); if (a) return a; if (!this._element || !this._element.id) return ""; return this._element.id + "$" + this.get_name() }, get_name: function () { if (this._name) return this._name; var a = Object.getTypeName(this), b = a.lastIndexOf("."); if (b !== -1) a = a.substr(b + 1); if (!this.get_isInitialized()) this._name = a; return a }, set_name: function (a) { this._name = a }, initialize: function () { Sys.UI.Behavior.callBaseMethod(this, "initialize"); var a = this.get_name(); if (a) this._element[a] = this }, dispose: function () { Sys.UI.Behavior.callBaseMethod(this, "dispose"); var a = this._element; if (a) { var c = this.get_name(); if (c) a[c] = null; var b = a._behaviors; Array.remove(b, this); if (b.length === 0) a._behaviors = null; delete this._element } } }; Sys.UI.Behavior.registerClass("Sys.UI.Behavior", Sys.Component); Sys.UI.Behavior.getBehaviorByName = function (b, c) { var a = b[c]; return a && Sys.UI.Behavior.isInstanceOfType(a) ? a : null }; Sys.UI.Behavior.getBehaviors = function (a) { if (!a._behaviors) return []; return Array.clone(a._behaviors) }; Sys.UI.Behavior.getBehaviorsByType = function (d, e) { var a = d._behaviors, c = []; if (a) for (var b = 0, f = a.length; b < f; b++)if (e.isInstanceOfType(a[b])) c[c.length] = a[b]; return c }; Sys.UI.VisibilityMode = function () { throw Error.notImplemented() }; Sys.UI.VisibilityMode.prototype = { hide: 0, collapse: 1 }; Sys.UI.VisibilityMode.registerEnum("Sys.UI.VisibilityMode"); Sys.UI.Control = function (a) { Sys.UI.Control.initializeBase(this); this._element = a; a.control = this; var b = this.get_role(); if (b) a.setAttribute("role", b) }; Sys.UI.Control.prototype = { _parent: null, _visibilityMode: Sys.UI.VisibilityMode.hide, get_element: function () { return this._element }, get_id: function () { if (!this._element) return ""; return this._element.id }, set_id: function () { throw Error.invalidOperation(Sys.Res.cantSetId) }, get_parent: function () { if (this._parent) return this._parent; if (!this._element) return null; var a = this._element.parentNode; while (a) { if (a.control) return a.control; a = a.parentNode } return null }, set_parent: function (a) { this._parent = a }, get_role: function () { return null }, get_visibilityMode: function () { return Sys.UI.DomElement.getVisibilityMode(this._element) }, set_visibilityMode: function (a) { Sys.UI.DomElement.setVisibilityMode(this._element, a) }, get_visible: function () { return Sys.UI.DomElement.getVisible(this._element) }, set_visible: function (a) { Sys.UI.DomElement.setVisible(this._element, a) }, addCssClass: function (a) { Sys.UI.DomElement.addCssClass(this._element, a) }, dispose: function () { Sys.UI.Control.callBaseMethod(this, "dispose"); if (this._element) { this._element.control = null; delete this._element } if (this._parent) delete this._parent }, onBubbleEvent: function () { return false }, raiseBubbleEvent: function (a, b) { this._raiseBubbleEvent(a, b) }, _raiseBubbleEvent: function (b, c) { var a = this.get_parent(); while (a) { if (a.onBubbleEvent(b, c)) return; a = a.get_parent() } }, removeCssClass: function (a) { Sys.UI.DomElement.removeCssClass(this._element, a) }, toggleCssClass: function (a) { Sys.UI.DomElement.toggleCssClass(this._element, a) } }; Sys.UI.Control.registerClass("Sys.UI.Control", Sys.Component); Sys.HistoryEventArgs = function (a) { Sys.HistoryEventArgs.initializeBase(this); this._state = a }; Sys.HistoryEventArgs.prototype = { get_state: function () { return this._state } }; Sys.HistoryEventArgs.registerClass("Sys.HistoryEventArgs", Sys.EventArgs); Sys.Application._appLoadHandler = null; Sys.Application._beginRequestHandler = null; Sys.Application._clientId = null; Sys.Application._currentEntry = ""; Sys.Application._endRequestHandler = null; Sys.Application._history = null; Sys.Application._enableHistory = false; Sys.Application._historyFrame = null; Sys.Application._historyInitialized = false; Sys.Application._historyPointIsNew = false; Sys.Application._ignoreTimer = false; Sys.Application._initialState = null; Sys.Application._state = {}; Sys.Application._timerCookie = 0; Sys.Application._timerHandler = null; Sys.Application._uniqueId = null; Sys._Application.prototype.get_stateString = function () { var a = null; if (Sys.Browser.agent === Sys.Browser.Firefox) { var c = window.location.href, b = c.indexOf("#"); if (b !== -1) a = c.substring(b + 1); else a = ""; return a } else a = window.location.hash; if (a.length > 0 && a.charAt(0) === "#") a = a.substring(1); return a }; Sys._Application.prototype.get_enableHistory = function () { return this._enableHistory }; Sys._Application.prototype.set_enableHistory = function (a) { this._enableHistory = a }; Sys._Application.prototype.add_navigate = function (a) { this.get_events().addHandler("navigate", a) }; Sys._Application.prototype.remove_navigate = function (a) { this.get_events().removeHandler("navigate", a) }; Sys._Application.prototype.addHistoryPoint = function (c, f) { this._ensureHistory(); var b = this._state; for (var a in c) { var d = c[a]; if (d === null) { if (typeof b[a] !== "undefined") delete b[a] } else b[a] = d } var e = this._serializeState(b); this._historyPointIsNew = true; this._setState(e, f); this._raiseNavigate() }; Sys._Application.prototype.setServerId = function (a, b) { this._clientId = a; this._uniqueId = b }; Sys._Application.prototype.setServerState = function (a) { this._ensureHistory(); this._state.__s = a; this._updateHiddenField(a) }; Sys._Application.prototype._deserializeState = function (a) { var e = {}; a = a || ""; var b = a.indexOf("&&"); if (b !== -1 && b + 2 < a.length) { e.__s = a.substr(b + 2); a = a.substr(0, b) } var g = a.split("&"); for (var f = 0, j = g.length; f < j; f++) { var d = g[f], c = d.indexOf("="); if (c !== -1 && c + 1 < d.length) { var i = d.substr(0, c), h = d.substr(c + 1); e[i] = decodeURIComponent(h) } } return e }; Sys._Application.prototype._enableHistoryInScriptManager = function () { this._enableHistory = true }; Sys._Application.prototype._ensureHistory = function () { if (!this._historyInitialized && this._enableHistory) { if (Sys.Browser.agent === Sys.Browser.InternetExplorer && Sys.Browser.documentMode < 8) { this._historyFrame = document.getElementById("__historyFrame"); this._ignoreIFrame = true } this._timerHandler = Function.createDelegate(this, this._onIdle); this._timerCookie = window.setTimeout(this._timerHandler, 100); try { this._initialState = this._deserializeState(this.get_stateString()) } catch (a) { } this._historyInitialized = true } }; Sys._Application.prototype._navigate = function (c) { this._ensureHistory(); var b = this._deserializeState(c); if (this._uniqueId) { var d = this._state.__s || "", a = b.__s || ""; if (a !== d) { this._updateHiddenField(a); __doPostBack(this._uniqueId, a); this._state = b; return } } this._setState(c); this._state = b; this._raiseNavigate() }; Sys._Application.prototype._onIdle = function () { delete this._timerCookie; var a = this.get_stateString(); if (a !== this._currentEntry) { if (!this._ignoreTimer) { this._historyPointIsNew = false; this._navigate(a) } } else this._ignoreTimer = false; this._timerCookie = window.setTimeout(this._timerHandler, 100) }; Sys._Application.prototype._onIFrameLoad = function (a) { this._ensureHistory(); if (!this._ignoreIFrame) { this._historyPointIsNew = false; this._navigate(a) } this._ignoreIFrame = false }; Sys._Application.prototype._onPageRequestManagerBeginRequest = function () { this._ignoreTimer = true; this._originalTitle = document.title }; Sys._Application.prototype._onPageRequestManagerEndRequest = function (g, f) { var d = f.get_dataItems()[this._clientId], c = this._originalTitle; this._originalTitle = null; var b = document.getElementById("__EVENTTARGET"); if (b && b.value === this._uniqueId) b.value = ""; if (typeof d !== "undefined") { this.setServerState(d); this._historyPointIsNew = true } else this._ignoreTimer = false; var a = this._serializeState(this._state); if (a !== this._currentEntry) { this._ignoreTimer = true; if (typeof c === "string") { if (Sys.Browser.agent !== Sys.Browser.InternetExplorer || Sys.Browser.version > 7) { var e = document.title; document.title = c; this._setState(a); document.title = e } else this._setState(a); this._raiseNavigate() } else { this._setState(a); this._raiseNavigate() } } }; Sys._Application.prototype._raiseNavigate = function () { var d = this._historyPointIsNew, c = this.get_events().getHandler("navigate"), b = {}; for (var a in this._state) if (a !== "__s") b[a] = this._state[a]; var e = new Sys.HistoryEventArgs(b); if (c) c(this, e); if (!d) { var f; try { if (Sys.Browser.agent === Sys.Browser.Firefox && window.location.hash && (!window.frameElement || window.top.location.hash)) Sys.Browser.version < 3.5 ? window.history.go(0) : (location.hash = this.get_stateString()) } catch (g) { } } }; Sys._Application.prototype._serializeState = function (d) { var b = []; for (var a in d) { var e = d[a]; if (a === "__s") var c = e; else b[b.length] = a + "=" + encodeURIComponent(e) } return b.join("&") + (c ? "&&" + c : "") }; Sys._Application.prototype._setState = function (a, b) { if (this._enableHistory) { a = a || ""; if (a !== this._currentEntry) { if (window.theForm) { var d = window.theForm.action, e = d.indexOf("#"); window.theForm.action = (e !== -1 ? d.substring(0, e) : d) + "#" + a } if (this._historyFrame && this._historyPointIsNew) { this._ignoreIFrame = true; var c = this._historyFrame.contentWindow.document; c.open("javascript:'<html></html>'"); c.write("<html><head><title>" + (b || document.title) + "</title><scri" + 'pt type="text/javascript">parent.Sys.Application._onIFrameLoad(' + Sys.Serialization.JavaScriptSerializer.serialize(a) + ");</scri" + "pt></head><body></body></html>"); c.close() } this._ignoreTimer = false; this._currentEntry = a; if (this._historyFrame || this._historyPointIsNew) { var f = this.get_stateString(); if (a !== f) { window.location.hash = a; this._currentEntry = this.get_stateString(); if (typeof b !== "undefined" && b !== null) document.title = b } } this._historyPointIsNew = false } } }; Sys._Application.prototype._updateHiddenField = function (b) { if (this._clientId) { var a = document.getElementById(this._clientId); if (a) a.value = b } }; if (!window.XMLHttpRequest) window.XMLHttpRequest = function () { var b = ["Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP"]; for (var a = 0, c = b.length; a < c; a++)try { return new ActiveXObject(b[a]) } catch (d) { } return null }; Type.registerNamespace("Sys.Net"); Sys.Net.WebRequestExecutor = function () { this._webRequest = null; this._resultObject = null }; Sys.Net.WebRequestExecutor.prototype = { get_webRequest: function () { return this._webRequest }, _set_webRequest: function (a) { this._webRequest = a }, get_started: function () { throw Error.notImplemented() }, get_responseAvailable: function () { throw Error.notImplemented() }, get_timedOut: function () { throw Error.notImplemented() }, get_aborted: function () { throw Error.notImplemented() }, get_responseData: function () { throw Error.notImplemented() }, get_statusCode: function () { throw Error.notImplemented() }, get_statusText: function () { throw Error.notImplemented() }, get_xml: function () { throw Error.notImplemented() }, get_object: function () { if (!this._resultObject) this._resultObject = Sys.Serialization.JavaScriptSerializer.deserialize(this.get_responseData()); return this._resultObject }, executeRequest: function () { throw Error.notImplemented() }, abort: function () { throw Error.notImplemented() }, getResponseHeader: function () { throw Error.notImplemented() }, getAllResponseHeaders: function () { throw Error.notImplemented() } }; Sys.Net.WebRequestExecutor.registerClass("Sys.Net.WebRequestExecutor"); Sys.Net.XMLDOM = function (d) { if (!window.DOMParser) { var c = ["Msxml2.DOMDocument.3.0", "Msxml2.DOMDocument"]; for (var b = 0, f = c.length; b < f; b++)try { var a = new ActiveXObject(c[b]); a.async = false; a.loadXML(d); a.setProperty("SelectionLanguage", "XPath"); return a } catch (g) { } } else try { var e = new window.DOMParser; return e.parseFromString(d, "text/xml") } catch (g) { } return null }; Sys.Net.XMLHttpExecutor = function () { Sys.Net.XMLHttpExecutor.initializeBase(this); var a = this; this._xmlHttpRequest = null; this._webRequest = null; this._responseAvailable = false; this._timedOut = false; this._timer = null; this._aborted = false; this._started = false; this._onReadyStateChange = function () { if (a._xmlHttpRequest.readyState === 4) { try { if (typeof a._xmlHttpRequest.status === "undefined") return } catch (b) { return } a._clearTimer(); a._responseAvailable = true; try { a._webRequest.completed(Sys.EventArgs.Empty) } finally { if (a._xmlHttpRequest != null) { a._xmlHttpRequest.onreadystatechange = Function.emptyMethod; a._xmlHttpRequest = null } } } }; this._clearTimer = function () { if (a._timer != null) { window.clearTimeout(a._timer); a._timer = null } }; this._onTimeout = function () { if (!a._responseAvailable) { a._clearTimer(); a._timedOut = true; a._xmlHttpRequest.onreadystatechange = Function.emptyMethod; a._xmlHttpRequest.abort(); a._webRequest.completed(Sys.EventArgs.Empty); a._xmlHttpRequest = null } } }; Sys.Net.XMLHttpExecutor.prototype = { get_timedOut: function () { return this._timedOut }, get_started: function () { return this._started }, get_responseAvailable: function () { return this._responseAvailable }, get_aborted: function () { return this._aborted }, executeRequest: function () { this._webRequest = this.get_webRequest(); var c = this._webRequest.get_body(), a = this._webRequest.get_headers(); this._xmlHttpRequest = new XMLHttpRequest; this._xmlHttpRequest.onreadystatechange = this._onReadyStateChange; var e = this._webRequest.get_httpVerb(); this._xmlHttpRequest.open(e, this._webRequest.getResolvedUrl(), true); this._xmlHttpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest"); if (a) for (var b in a) { var f = a[b]; if (typeof f !== "function") this._xmlHttpRequest.setRequestHeader(b, f) } if (e.toLowerCase() === "post") { if (a === null || !a["Content-Type"]) this._xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8"); if (!c) c = "" } var d = this._webRequest.get_timeout(); if (d > 0) this._timer = window.setTimeout(Function.createDelegate(this, this._onTimeout), d); this._xmlHttpRequest.send(c); this._started = true }, getResponseHeader: function (b) { var a; try { a = this._xmlHttpRequest.getResponseHeader(b) } catch (c) { } if (!a) a = ""; return a }, getAllResponseHeaders: function () { return this._xmlHttpRequest.getAllResponseHeaders() }, get_responseData: function () { return this._xmlHttpRequest.responseText }, get_statusCode: function () { var a = 0; try { a = this._xmlHttpRequest.status } catch (b) { } return a }, get_statusText: function () { return this._xmlHttpRequest.statusText }, get_xml: function () { var a = this._xmlHttpRequest.responseXML; if (!a || !a.documentElement) { a = Sys.Net.XMLDOM(this._xmlHttpRequest.responseText); if (!a || !a.documentElement) return null } else if (navigator.userAgent.indexOf("MSIE") !== -1) a.setProperty("SelectionLanguage", "XPath"); if (a.documentElement.namespaceURI === "https://web.archive.org/web/20130628214316/http://www.mozilla.org/newlayout/xml/parsererror.xml" && a.documentElement.tagName === "parsererror") return null; if (a.documentElement.firstChild && a.documentElement.firstChild.tagName === "parsererror") return null; return a }, abort: function () { if (this._aborted || this._responseAvailable || this._timedOut) return; this._aborted = true; this._clearTimer(); if (this._xmlHttpRequest && !this._responseAvailable) { this._xmlHttpRequest.onreadystatechange = Function.emptyMethod; this._xmlHttpRequest.abort(); this._xmlHttpRequest = null; this._webRequest.completed(Sys.EventArgs.Empty) } } }; Sys.Net.XMLHttpExecutor.registerClass("Sys.Net.XMLHttpExecutor", Sys.Net.WebRequestExecutor); Sys.Net._WebRequestManager = function () { this._defaultTimeout = 0; this._defaultExecutorType = "Sys.Net.XMLHttpExecutor" }; Sys.Net._WebRequestManager.prototype = { add_invokingRequest: function (a) { this._get_eventHandlerList().addHandler("invokingRequest", a) }, remove_invokingRequest: function (a) { this._get_eventHandlerList().removeHandler("invokingRequest", a) }, add_completedRequest: function (a) { this._get_eventHandlerList().addHandler("completedRequest", a) }, remove_completedRequest: function (a) { this._get_eventHandlerList().removeHandler("completedRequest", a) }, _get_eventHandlerList: function () { if (!this._events) this._events = new Sys.EventHandlerList; return this._events }, get_defaultTimeout: function () { return this._defaultTimeout }, set_defaultTimeout: function (a) { this._defaultTimeout = a }, get_defaultExecutorType: function () { return this._defaultExecutorType }, set_defaultExecutorType: function (a) { this._defaultExecutorType = a }, executeRequest: function (webRequest) { var executor = webRequest.get_executor(); if (!executor) { var failed = false; try { var executorType = eval(this._defaultExecutorType); executor = new executorType } catch (a) { failed = true } webRequest.set_executor(executor) } if (executor.get_aborted()) return; var evArgs = new Sys.Net.NetworkRequestEventArgs(webRequest), handler = this._get_eventHandlerList().getHandler("invokingRequest"); if (handler) handler(this, evArgs); if (!evArgs.get_cancel()) executor.executeRequest() } }; Sys.Net._WebRequestManager.registerClass("Sys.Net._WebRequestManager"); Sys.Net.WebRequestManager = new Sys.Net._WebRequestManager; Sys.Net.NetworkRequestEventArgs = function (a) { Sys.Net.NetworkRequestEventArgs.initializeBase(this); this._webRequest = a }; Sys.Net.NetworkRequestEventArgs.prototype = { get_webRequest: function () { return this._webRequest } }; Sys.Net.NetworkRequestEventArgs.registerClass("Sys.Net.NetworkRequestEventArgs", Sys.CancelEventArgs); Sys.Net.WebRequest = function () { this._url = ""; this._headers = {}; this._body = null; this._userContext = null; this._httpVerb = null; this._executor = null; this._invokeCalled = false; this._timeout = 0 }; Sys.Net.WebRequest.prototype = { add_completed: function (a) { this._get_eventHandlerList().addHandler("completed", a) }, remove_completed: function (a) { this._get_eventHandlerList().removeHandler("completed", a) }, completed: function (b) { var a = Sys.Net.WebRequestManager._get_eventHandlerList().getHandler("completedRequest"); if (a) a(this._executor, b); a = this._get_eventHandlerList().getHandler("completed"); if (a) a(this._executor, b) }, _get_eventHandlerList: function () { if (!this._events) this._events = new Sys.EventHandlerList; return this._events }, get_url: function () { return this._url }, set_url: function (a) { this._url = a }, get_headers: function () { return this._headers }, get_httpVerb: function () { if (this._httpVerb === null) { if (this._body === null) return "GET"; return "POST" } return this._httpVerb }, set_httpVerb: function (a) { this._httpVerb = a }, get_body: function () { return this._body }, set_body: function (a) { this._body = a }, get_userContext: function () { return this._userContext }, set_userContext: function (a) { this._userContext = a }, get_executor: function () { return this._executor }, set_executor: function (a) { this._executor = a; this._executor._set_webRequest(this) }, get_timeout: function () { if (this._timeout === 0) return Sys.Net.WebRequestManager.get_defaultTimeout(); return this._timeout }, set_timeout: function (a) { this._timeout = a }, getResolvedUrl: function () { return Sys.Net.WebRequest._resolveUrl(this._url) }, invoke: function () { Sys.Net.WebRequestManager.executeRequest(this); this._invokeCalled = true } }; Sys.Net.WebRequest._resolveUrl = function (b, a) { if (b && b.indexOf("://") !== -1) return b; if (!a || a.length === 0) { var d = document.getElementsByTagName("base")[0]; if (d && d.href && d.href.length > 0) a = d.href; else a = document.URL } var c = a.indexOf("?"); if (c !== -1) a = a.substr(0, c); c = a.indexOf("#"); if (c !== -1) a = a.substr(0, c); a = a.substr(0, a.lastIndexOf("/") + 1); if (!b || b.length === 0) return a; if (b.charAt(0) === "/") { var e = a.indexOf("://"), g = a.indexOf("/", e + 3); return a.substr(0, g) + b } else { var f = a.lastIndexOf("/"); return a.substr(0, f + 1) + b } }; Sys.Net.WebRequest._createQueryString = function (c, b, f) { b = b || encodeURIComponent; var h = 0, e, g, d, a = new Sys.StringBuilder; if (c) for (d in c) { e = c[d]; if (typeof e === "function") continue; g = Sys.Serialization.JavaScriptSerializer.serialize(e); if (h++) a.append("&"); a.append(d); a.append("="); a.append(b(g)) } if (f) { if (h) a.append("&"); a.append(f) } return a.toString() }; Sys.Net.WebRequest._createUrl = function (a, b, c) { if (!b && !c) return a; var d = Sys.Net.WebRequest._createQueryString(b, null, c); return d.length ? a + (a && a.indexOf("?") >= 0 ? "&" : "?") + d : a }; Sys.Net.WebRequest.registerClass("Sys.Net.WebRequest"); Sys._ScriptLoaderTask = function (b, a) { this._scriptElement = b; this._completedCallback = a }; Sys._ScriptLoaderTask.prototype = { get_scriptElement: function () { return this._scriptElement }, dispose: function () { if (this._disposed) return; this._disposed = true; this._removeScriptElementHandlers(); Sys._ScriptLoaderTask._clearScript(this._scriptElement); this._scriptElement = null }, execute: function () { this._addScriptElementHandlers(); document.getElementsByTagName("head")[0].appendChild(this._scriptElement) }, _addScriptElementHandlers: function () { this._scriptLoadDelegate = Function.createDelegate(this, this._scriptLoadHandler); if (Sys.Browser.agent !== Sys.Browser.InternetExplorer) { this._scriptElement.readyState = "loaded"; $addHandler(this._scriptElement, "load", this._scriptLoadDelegate) } else $addHandler(this._scriptElement, "readystatechange", this._scriptLoadDelegate); if (this._scriptElement.addEventListener) { this._scriptErrorDelegate = Function.createDelegate(this, this._scriptErrorHandler); this._scriptElement.addEventListener("error", this._scriptErrorDelegate, false) } }, _removeScriptElementHandlers: function () { if (this._scriptLoadDelegate) { var a = this.get_scriptElement(); if (Sys.Browser.agent !== Sys.Browser.InternetExplorer) $removeHandler(a, "load", this._scriptLoadDelegate); else $removeHandler(a, "readystatechange", this._scriptLoadDelegate); if (this._scriptErrorDelegate) { this._scriptElement.removeEventListener("error", this._scriptErrorDelegate, false); this._scriptErrorDelegate = null } this._scriptLoadDelegate = null } }, _scriptErrorHandler: function () { if (this._disposed) return; this._completedCallback(this.get_scriptElement(), false) }, _scriptLoadHandler: function () { if (this._disposed) return; var a = this.get_scriptElement(); if (a.readyState !== "loaded" && a.readyState !== "complete") return; this._completedCallback(a, true) } }; Sys._ScriptLoaderTask.registerClass("Sys._ScriptLoaderTask", null, Sys.IDisposable); Sys._ScriptLoaderTask._clearScript = function (a) { if (!Sys.Debug.isDebug) a.parentNode.removeChild(a) }; Type.registerNamespace("Sys.Net"); Sys.Net.WebServiceProxy = function () { }; Sys.Net.WebServiceProxy.prototype = { get_timeout: function () { return this._timeout || 0 }, set_timeout: function (a) { if (a < 0) throw Error.argumentOutOfRange("value", a, Sys.Res.invalidTimeout); this._timeout = a }, get_defaultUserContext: function () { return typeof this._userContext === "undefined" ? null : this._userContext }, set_defaultUserContext: function (a) { this._userContext = a }, get_defaultSucceededCallback: function () { return this._succeeded || null }, set_defaultSucceededCallback: function (a) { this._succeeded = a }, get_defaultFailedCallback: function () { return this._failed || null }, set_defaultFailedCallback: function (a) { this._failed = a }, get_enableJsonp: function () { return !!this._jsonp }, set_enableJsonp: function (a) { this._jsonp = a }, get_path: function () { return this._path || null }, set_path: function (a) { this._path = a }, get_jsonpCallbackParameter: function () { return this._callbackParameter || "callback" }, set_jsonpCallbackParameter: function (a) { this._callbackParameter = a }, _invoke: function (d, e, g, f, c, b, a) { c = c || this.get_defaultSucceededCallback(); b = b || this.get_defaultFailedCallback(); if (a === null || typeof a === "undefined") a = this.get_defaultUserContext(); return Sys.Net.WebServiceProxy.invoke(d, e, g, f, c, b, a, this.get_timeout(), this.get_enableJsonp(), this.get_jsonpCallbackParameter()) } }; Sys.Net.WebServiceProxy.registerClass("Sys.Net.WebServiceProxy"); Sys.Net.WebServiceProxy.invoke = function (q, a, m, l, j, b, g, e, w, p) { var i = w !== false ? Sys.Net.WebServiceProxy._xdomain.exec(q) : null, c, n = i && i.length === 3 && (i[1] !== location.protocol || i[2] !== location.host); m = n || m; if (n) { p = p || "callback"; c = "_jsonp" + Sys._jsonp++ } if (!l) l = {}; var r = l; if (!m || !r) r = {}; var s, h, f = null, k, o = null, u = Sys.Net.WebRequest._createUrl(a ? q + "/" + encodeURIComponent(a) : q, r, n ? p + "=Sys." + c : null); if (n) { s = document.createElement("script"); s.src = u; k = new Sys._ScriptLoaderTask(s, function (d, b) { if (!b || c) t({ Message: String.format(Sys.Res.webServiceFailedNoMsg, a) }, -1) }); function v() { if (f === null) return; f = null; h = new Sys.Net.WebServiceError(true, String.format(Sys.Res.webServiceTimedOut, a)); k.dispose(); delete Sys[c]; if (b) b(h, g, a) } function t(d, e) { if (f !== null) { window.clearTimeout(f); f = null } k.dispose(); delete Sys[c]; c = null; if (typeof e !== "undefined" && e !== 200) { if (b) { h = new Sys.Net.WebServiceError(false, d.Message || String.format(Sys.Res.webServiceFailedNoMsg, a), d.StackTrace || null, d.ExceptionType || null, d); h._statusCode = e; b(h, g, a) } } else if (j) j(d, g, a) } Sys[c] = t; e = e || Sys.Net.WebRequestManager.get_defaultTimeout(); if (e > 0) f = window.setTimeout(v, e); k.execute(); return null } var d = new Sys.Net.WebRequest; d.set_url(u); d.get_headers()["Content-Type"] = "application/json; charset=utf-8"; if (!m) { o = Sys.Serialization.JavaScriptSerializer.serialize(l); if (o === "{}") o = "" } d.set_body(o); d.add_completed(x); if (e && e > 0) d.set_timeout(e); d.invoke(); function x(d) { if (d.get_responseAvailable()) { var f = d.get_statusCode(), c = null; try { var e = d.getResponseHeader("Content-Type"); if (e.startsWith("application/json")) c = d.get_object(); else if (e.startsWith("text/xml")) c = d.get_xml(); else c = d.get_responseData() } catch (m) { } var k = d.getResponseHeader("jsonerror"), h = k === "true"; if (h) { if (c) c = new Sys.Net.WebServiceError(false, c.Message, c.StackTrace, c.ExceptionType, c) } else if (e.startsWith("application/json")) c = !c || typeof c.d === "undefined" ? c : c.d; if (f < 200 || f >= 300 || h) { if (b) { if (!c || !h) c = new Sys.Net.WebServiceError(false, String.format(Sys.Res.webServiceFailedNoMsg, a)); c._statusCode = f; b(c, g, a) } } else if (j) j(c, g, a) } else { var i; if (d.get_timedOut()) i = String.format(Sys.Res.webServiceTimedOut, a); else i = String.format(Sys.Res.webServiceFailedNoMsg, a); if (b) b(new Sys.Net.WebServiceError(d.get_timedOut(), i, "", ""), g, a) } } return d }; Sys.Net.WebServiceProxy._generateTypedConstructor = function (a) { return function (b) { if (b) for (var c in b) this[c] = b[c]; this.__type = a } }; Sys._jsonp = 0; Sys.Net.WebServiceProxy._xdomain = /^\s*([a-zA-Z0-9\+\-\.]+\:)\/\/([^?#\/]+)/; Sys.Net.WebServiceError = function (d, e, c, a, b) { this._timedOut = d; this._message = e; this._stackTrace = c; this._exceptionType = a; this._errorObject = b; this._statusCode = -1 }; Sys.Net.WebServiceError.prototype = { get_timedOut: function () { return this._timedOut }, get_statusCode: function () { return this._statusCode }, get_message: function () { return this._message }, get_stackTrace: function () { return this._stackTrace || "" }, get_exceptionType: function () { return this._exceptionType || "" }, get_errorObject: function () { return this._errorObject || null } }; Sys.Net.WebServiceError.registerClass("Sys.Net.WebServiceError");
    Type.registerNamespace('Sys'); Sys.Res = { 'argumentInteger': 'Value must be an integer.', 'invokeCalledTwice': 'Cannot call invoke more than once.', 'webServiceFailed': 'The server method \'{0}\' failed with the following error: {1}', 'argumentType': 'Object cannot be converted to the required type.', 'argumentNull': 'Value cannot be null.', 'scriptAlreadyLoaded': 'The script \'{0}\' has been referenced multiple times. If referencing Microsoft AJAX scripts explicitly, set the MicrosoftAjaxMode property of the ScriptManager to Explicit.', 'scriptDependencyNotFound': 'The script \'{0}\' failed to load because it is dependent on script \'{1}\'.', 'formatBadFormatSpecifier': 'Format specifier was invalid.', 'requiredScriptReferenceNotIncluded': '\'{0}\' requires that you have included a script reference to \'{1}\'.', 'webServiceFailedNoMsg': 'The server method \'{0}\' failed.', 'argumentDomElement': 'Value must be a DOM element.', 'invalidExecutorType': 'Could not create a valid Sys.Net.WebRequestExecutor from: {0}.', 'cannotCallBeforeResponse': 'Cannot call {0} when responseAvailable is false.', 'actualValue': 'Actual value was {0}.', 'enumInvalidValue': '\'{0}\' is not a valid value for enum {1}.', 'scriptLoadFailed': 'The script \'{0}\' could not be loaded.', 'parameterCount': 'Parameter count mismatch.', 'cannotDeserializeEmptyString': 'Cannot deserialize empty string.', 'formatInvalidString': 'Input string was not in a correct format.', 'invalidTimeout': 'Value must be greater than or equal to zero.', 'cannotAbortBeforeStart': 'Cannot abort when executor has not started.', 'argument': 'Value does not fall within the expected range.', 'cannotDeserializeInvalidJson': 'Cannot deserialize. The data does not correspond to valid JSON.', 'invalidHttpVerb': 'httpVerb cannot be set to an empty or null string.', 'nullWebRequest': 'Cannot call executeRequest with a null webRequest.', 'eventHandlerInvalid': 'Handler was not added through the Sys.UI.DomEvent.addHandler method.', 'cannotSerializeNonFiniteNumbers': 'Cannot serialize non finite numbers.', 'argumentUndefined': 'Value cannot be undefined.', 'webServiceInvalidReturnType': 'The server method \'{0}\' returned an invalid type. Expected type: {1}', 'servicePathNotSet': 'The path to the web service has not been set.', 'argumentTypeWithTypes': 'Object of type \'{0}\' cannot be converted to type \'{1}\'.', 'cannotCallOnceStarted': 'Cannot call {0} once started.', 'badBaseUrl1': 'Base URL does not contain ://.', 'badBaseUrl2': 'Base URL does not contain another /.', 'badBaseUrl3': 'Cannot find last / in base URL.', 'setExecutorAfterActive': 'Cannot set executor after it has become active.', 'paramName': 'Parameter name: {0}', 'nullReferenceInPath': 'Null reference while evaluating data path: \'{0}\'.', 'cannotCallOutsideHandler': 'Cannot call {0} outside of a completed event handler.', 'cannotSerializeObjectWithCycle': 'Cannot serialize object with cyclic reference within child properties.', 'format': 'One of the identified items was in an invalid format.', 'assertFailedCaller': 'Assertion Failed: {0}\r\nat {1}', 'argumentOutOfRange': 'Specified argument was out of the range of valid values.', 'webServiceTimedOut': 'The server method \'{0}\' timed out.', 'notImplemented': 'The method or operation is not implemented.', 'assertFailed': 'Assertion Failed: {0}', 'invalidOperation': 'Operation is not valid due to the current state of the object.', 'breakIntoDebugger': '{0}\r\n\r\nBreak into debugger?' };

    ;// roblox.js
    (function (n, t) { function p(n, i) { var r = i.split("."); for (i = r.shift(); r.length > 0; n = n[i], i = r.shift())if (n[i] === t) return t; return n[i] } function k(n, i, r) { var u = i.split("."); for (i = u.shift(); u.length > 0; n = n[i], i = u.shift())n[i] === t && (n[i] = {}); n[i] = r } function nt(n, t) { var i = f.createElement("link"); i.href = n, i.rel = "stylesheet", i.type = "text/css", u.parentNode.insertBefore(i, u), t() } function g(n, t) { var i = f.createElement("script"); i.type = "text/javascript", i.src = n, i.onload = i.onreadystatechange = function () { i.readyState && i.readyState != "loaded" && i.readyState != "complete" || (t(), i.onload = i.onreadystatechange = null) }, u.parentNode.insertBefore(i, u) } function d(n) { return n.split(".").pop().split("?").shift() } function o(n) { if (n.indexOf(".js") < 0) return n; if (n.indexOf(r.modulePath) >= 0) return n.split(r.modulePath + "/").pop().split(".").shift().replace("/", "."); for (var t in r.paths) if (r.paths[t] == n) return t; return n } function v(n) { return n.indexOf(".js") >= 0 || n.indexOf(".css") >= 0 ? n : r.paths[n] || r.baseUrl + r.modulePath + "/" + n.replace(".", "/") + ".js" } function s(n) { for (var r, u = [], i = 0; i < n.length; i++)r = p(Roblox, o(n[i])), r !== t && u.push(r); return u } function e(n) { var t = i[n]; if (t.loaded && t.depsLoaded) while (t.listeners.length > 0) t.listeners.shift()() } function a(n, u) { var f, s, h; if (!b(n) || r.externalResources.toString().indexOf(n) >= 0) return u(); f = o(n), i[f] === t ? (i[f] = { loaded: !1, depsLoaded: !0, listeners: [] }, i[f].listeners.push(u), s = v(f), h = d(s) == "css" ? nt : g, h(s, function () { i[f].loaded = !0, e(f) })) : (i[f].listeners.push(u), e(f)) } function h(n, t) { var r = n.shift(), i = n.length == 0 ? t : function () { h(n, t) }; a(r, i) } function l(n, t) { c(n) || (n = [n]); var i = function () { t.apply(null, s(n)) }; h(n.slice(0), i) } function y(n, t, r) { w(t) ? (r = t, t = []) : c(t) || (t = [t]), i[n] = i[n] || { loaded: !0, listeners: [] }, i[n].depsLoaded = !1, i[n].listeners.unshift(function () { k(Roblox, n, r.apply(null, s(t))) }), l(t, function () { i[n].depsLoaded = !0, e(n) }) } var f = n.document, u = f.getElementsByTagName("script")[0], b = function (n) { return typeof n == "string" }, c = function (n) { return Object.prototype.toString.call(n) == "[object Array]" }, w = function (n) { return Object.prototype.toString.call(n) == "[object Function]" }, i = {}, r = { baseUrl: "", modulePath: "/js/modules", paths: {}, externalResources: [] }; typeof Roblox == "undefined" && (Roblox = {}, Roblox.config = r, Roblox.require = l, Roblox.define = y) })(window);

    ;// GoogleAnalytics/GoogleAnalyticsEvents.js
    var GoogleAnalyticsEvents = new function () { this.FireEvent = function (n) { if (typeof _gaq != typeof undefined) { var i = ["_trackEvent"], t = ["b._trackEvent"]; _gaq.push(i.concat(n)), _gaq.push(t.concat(n)) } } };

    ;// PlaceLauncher.js
    var RBX = {}, RobloxLaunchStates = { StartingServer: "StartingServer", StartingClient: "StartingClient", Upgrading: "Upgrading", None: "None" }, RobloxLaunch = { launchGamePage: "/install/download.aspx", timer: null, clientMetricType: null, launcher: null, googleAnalyticsCallback: function () { RobloxLaunch._GoogleAnalyticsCallback && RobloxLaunch._GoogleAnalyticsCallback() }, state: RobloxLaunchStates.None }, RobloxPlaceLauncherService = { LogJoinClick: function () { $.get("/Game/Placelauncher.ashx", { request: "LogJoinClick" }) }, RequestGame: function (n, t, i, r, u, f) { i = i !== null && i !== undefined ? i : "", $.getJSON("/Game/PlaceLauncher.ashx", { request: "RequestGame", placeId: n, isPartyLeader: t, gender: i }, function (n) { n.Error ? u(n.Error, f) : r(n, f) }) }, RequestPlayWithParty: function (n, t, i, r, u, f) { $.getJSON("/Game/PlaceLauncher.ashx", { request: "RequestPlayWithParty", placeId: n, partyGuid: t, gameId: i }, function (n) { n.Error ? u(n.Error, f) : r(n, f) }) }, RequestGroupBuildGame: function (n, t, i, r) { $.getJSON("/Game/PlaceLauncher.ashx", { request: "RequestGroupBuildGame", placeId: n }, function (n) { n.Error ? i(n.Error, r) : t(n, r) }) }, RequestFollowUser: function (n, t, i, r) { $.getJSON("/Game/PlaceLauncher.ashx", { request: "RequestFollowUser", userId: n }, function (n) { n.Error ? i(n.Error, r) : t(n, r) }) }, RequestGameJob: function (n, t, i, r, u, f) { $.getJSON("/Game/PlaceLauncher.ashx", { request: "RequestGameJob", placeId: n, gameId: t, gameJobId: i }, function (n) { n.Error ? u(n.Error, f) : r(n, f) }) }, CheckGameJobStatus: function (n, t, i, r) { $.getJSON("/Game/PlaceLauncher.ashx", { request: "CheckGameJobStatus", jobId: n }, function (n) { n.Error ? i(n.Error, r) : t(n, r) }) } }; RobloxLaunch.RequestPlayWithParty = function (n, t, i, r) { RobloxPlaceLauncherService.LogJoinClick(), RobloxLaunch.timer = new Date, RobloxLaunch.state = RobloxLaunchStates.None, RobloxLaunch.clientMetricType = "WebPlay", checkRobloxInstall() && (RobloxLaunch.launcher === null && (RobloxLaunch.launcher = new RBX.PlaceLauncher(n)), RobloxLaunch.launcher.RequestPlayWithParty(t, i, r)) }, RobloxLaunch.RequestGame = function (n, t, i) { RobloxPlaceLauncherService.LogJoinClick(), RobloxLaunch.timer = new Date, RobloxLaunch.state = RobloxLaunchStates.None, RobloxLaunch.clientMetricType = "WebPlay", checkRobloxInstall() && (RobloxLaunch.launcher === null && (RobloxLaunch.launcher = new RBX.PlaceLauncher(n)), RobloxLaunch.launcher.RequestGame(t, i)) }, RobloxLaunch.RequestGroupBuildGame = function (n, t) { RobloxPlaceLauncherService.LogJoinClick(), RobloxLaunch.timer = new Date, RobloxLaunch.state = RobloxLaunchStates.None, RobloxLaunch.clientMetricType = "WebPlay", checkRobloxInstall() && (RobloxLaunch.launcher === null && (RobloxLaunch.launcher = new RBX.PlaceLauncher(n)), RobloxLaunch.launcher.RequestGroupBuildGame(t)) }, RobloxLaunch.RequestGameJob = function (n, t, i, r) { RobloxPlaceLauncherService.LogJoinClick(), RobloxLaunch.timer = new Date, RobloxLaunch.state = RobloxLaunchStates.None, RobloxLaunch.clientMetricType = "WebJoin", checkRobloxInstall() && (RobloxLaunch.launcher === null && (RobloxLaunch.launcher = new RBX.PlaceLauncher(n)), RobloxLaunch.launcher.RequestGameJob(t, i, r)) }, RobloxLaunch.RequestFollowUser = function (n, t) { RobloxPlaceLauncherService.LogJoinClick(), RobloxLaunch.timer = new Date, RobloxLaunch.state = RobloxLaunchStates.None, RobloxLaunch.clientMetricType = "WebFollow", checkRobloxInstall() && (RobloxLaunch.launcher === null && (RobloxLaunch.launcher = new RBX.PlaceLauncher(n)), RobloxLaunch.launcher.RequestFollowUser(t)) }, RobloxLaunch.StartGame = function (n, t, i, r, u) { var f = function (r) { RobloxLaunch.StartGameWork(n, t, i, r, u) }; r == "FETCH" ? $.get("/Game/GetAuthTicket", f) : f(r) }, RobloxLaunch.StartGameWork = function (n, t, i, r, u) { var o, f, e, s; i = i.replace("http://", "https://"), n.indexOf("http") >= 0 && (n = typeof RobloxLaunch.SeleniumTestMode == "undefined" ? n + "&testmode=false" : n + "&testmode=true"), typeof urchinTracker != "undefined" && urchinTracker("Visit/Try/" + t), RobloxLaunch.state = RobloxLaunchStates.StartingClient, RobloxLaunch.googleAnalyticsCallback !== null && RobloxLaunch.googleAnalyticsCallback(), o = null; try { if (typeof window.external != "undefined" && window.external.IsRoblox2App && (n.indexOf("visit") != -1 || u)) window.external.StartGame(r, i, n); else if (o = "RobloxProxy/", f = Roblox.Client.CreateLauncher(!0), f) { o = "RobloxProxy/StartGame/"; try { try { window.ActiveXObject ? f.AuthenticationTicket = r : f.Put_AuthenticationTicket(r), u && f.SetEditMode() } catch (a) { } try { if (Roblox.Client._silentModeEnabled) f.SetSilentModeEnabled(!0), Roblox.VideoPreRoll.videoInitialized && Roblox.VideoPreRoll.isPlaying() && Roblox.Client.SetStartInHiddenMode(!0), f.StartGame(i, n), RobloxLaunch.CheckGameStarted(f); else throw "silent mode is disabled, fall back"; } catch (a) { if (f.StartGame(i, n), Roblox.Client._bringAppToFrontEnabled) try { f.BringAppToFront() } catch (h) { } Roblox.Client.ReleaseLauncher(f, !0, !1), $.modal.close() } } catch (a) { Roblox.Client.ReleaseLauncher(f, !0, !1); throw a; } } else { try { parent.playFromUrl(n); return } catch (l) { } if (Roblox.Client.isRobloxBrowser()) try { window.external.StartGame(r, i, n) } catch (l) { throw "window.external fallback failed, Roblox must not be installed or IE cannot access ActiveX"; } else throw "launcher is null or undefined and external is missing"; RobloxLaunch.state = RobloxLaunchStates.None, $.modal.close() } } catch (a) { if (e = a.message, e === "User cancelled" && typeof urchinTracker != "undefined") return urchinTracker("Visit/UserCancelled/" + t), !1; try { s = new ActiveXObject("Microsoft.XMLHTTP") } catch (c) { e = "FailedXMLHTTP/" + e } return Roblox.Client.isRobloxBrowser() ? typeof urchinTracker != "undefined" && urchinTracker("Visit/Fail/" + o + encodeURIComponent(e)) : (typeof urchinTracker != "undefined" && urchinTracker("Visit/Redirect/" + o + encodeURIComponent(e)), window.location = RobloxLaunch.launchGamePage), !1 } return typeof urchinTracker != "undefined" && urchinTracker("Visit/Success/" + t), !0 }, RobloxLaunch.StartApp = function (n, t) { var i = function (i) { RobloxLaunch.StartAppWork(n, t, i) }; $.get("/Game/GetAuthTicket", i) }, RobloxLaunch.StartAppWork = function (n, t, i) { var f, r, u; RobloxLaunch.state = RobloxLaunchStates.StartingClient, f = null; try { if (typeof window.external != "undefined" && window.external.IsRoblox2App) window.external.StartGame(i, t, n); else if (f = "RobloxProxy/", r = Roblox.Client.CreateLauncher(!0), r) { f = "RobloxProxy/StartGame/"; try { try { window.ActiveXObject ? r.AuthenticationTicket = i : r.Put_AuthenticationTicket(i) } catch (h) { } try { if (Roblox.Client._silentModeEnabled) r.SetSilentModeEnabled(!0), Roblox.VideoPreRoll.videoInitialized && Roblox.VideoPreRoll.isPlaying() && Roblox.Client.SetStartInHiddenMode(!0), r.StartGame(t, n), RobloxLaunch.CheckGameStarted(r); else throw "silent mode is disabled, fall back"; } catch (h) { if (r.StartGame(t, n), Roblox.Client._bringAppToFrontEnabled) try { r.BringAppToFront() } catch (e) { } Roblox.Client.ReleaseLauncher(r, !0, !1), $.modal.close() } } catch (h) { Roblox.Client.ReleaseLauncher(r, !0, !1); throw h; } } else { try { parent.playFromUrl(n); return } catch (s) { } if (Roblox.Client.isRobloxBrowser()) try { window.external.StartGame(i, t, n) } catch (s) { throw "window.external fallback failed, Roblox must not be installed or IE cannot access ActiveX"; } else throw "launcher is null or undefined and external is missing"; RobloxLaunch.state = RobloxLaunchStates.None, $.modal.close() } } catch (h) { if (u = h.message, u === "User cancelled") return !1; try { new ActiveXObject("Microsoft.XMLHTTP") } catch (o) { u = "FailedXMLHTTP/" + u } return Roblox.Client.isRobloxBrowser() || (window.location = RobloxLaunch.launchGamePage), !1 } return !0 }, RobloxLaunch.CheckGameStarted = function (n) { function r() { var e = !1; try { if (i || (i = window.ActiveXObject ? n.IsGameStarted : n.Get_GameStarted()), i && !Roblox.VideoPreRoll.isPlaying()) { if (MadStatus.stop("Connecting to Players..."), RobloxLaunch.state = RobloxLaunchStates.None, $.modal.close(), t._cancelled = !0, Roblox.Client._hiddenModeEnabled && Roblox.Client.UnhideApp(), Roblox.Client._bringAppToFrontEnabled) try { n.BringAppToFront() } catch (f) { } Roblox.Client.ReleaseLauncher(n, !0, !1) } else t._cancelled || setTimeout(r, 1e3) } catch (u) { t._cancelled || setTimeout(r, 1e3) } } var t = RobloxLaunch.launcher, i; t === null && (t = new RBX.PlaceLauncher("PlaceLauncherStatusPanel"), t._showDialog(), t._updateStatus(0)), i = !1, r() }, RobloxLaunch.CheckRobloxInstall = function (n) { if (Roblox.Client.IsRobloxInstalled()) return Roblox.Client.Update(), !0; window.location = n }, RBX.PlaceLauncher = function (n) { this._cancelled = !1, this._popupID = n, this._popup = $("#" + n) }, RBX.PlaceLauncher.prototype = { _showDialog: function () { this._cancelled = !1, _popupOptions = { escClose: !0, opacity: 80, overlayCss: { backgroundColor: "#000" } }, this._popupID == "PlaceLauncherStatusPanel" && (Roblox.VideoPreRoll && Roblox.VideoPreRoll.showVideoPreRoll && !Roblox.VideoPreRoll.isExcluded() ? (this._popup = $("#videoPrerollPanel"), _popupOptions.onShow = function (n) { Roblox.VideoPreRoll.correctIEModalPosition(n), Roblox.VideoPreRoll.start() }, _popupOptions.onClose = function () { Roblox.VideoPreRoll.close() }, _popupOptions.closeHTML = '<a href="#" class="ImageButton closeBtnCircle_35h ABCloseCircle VprCloseButton"></a>') : (this._popup = $("#" + this._popupID), _popupOptions.onClose = function () { Roblox.VideoPreRoll.logVideoPreRoll(), $.modal.close() })), this._popup.modal(_popupOptions); var n = this; $(".CancelPlaceLauncherButton").click(function () { n.CancelLaunch() }), $(".CancelPlaceLauncherButton").show() }, _reportDuration: function (n, t) { $.ajax({ type: "GET", async: !0, cache: !1, timeout: 5e4, url: "/Game/JoinRate.ashx?c=" + RobloxLaunch.clientMetricType + "&r=" + t + "&d=" + n, success: function () { } }) }, _onGameStatus: function (n) { var r, i, t; if (this._cancelled) { r = +new Date - RobloxLaunch.timer.getTime(), this._reportDuration(r, "Cancel"); return } if (this._updateStatus(n.status), n.status === 2) RobloxLaunch.StartGame(n.joinScriptUrl, "Join", n.authenticationUrl, n.authenticationTicket), i = +new Date - RobloxLaunch.timer.getTime(), this._reportDuration(i, "Success"); else if (n.status < 2 || n.status === 6) { var f = function (n, t) { t._onGameStatus(n) }, e = function (n, t) { t._onGameError(n) }, o = this, u = function () { RobloxPlaceLauncherService.CheckGameJobStatus(n.jobId, f, e, o) }; window.setTimeout(u, 2e3) } else n.status === 4 && (t = +new Date - RobloxLaunch.timer.getTime(), this._reportDuration(t, "Failure")) }, _updateStatus: function (n) { MadStatus.running || (MadStatus.init($(this._popup).find(".MadStatusField"), $(this._popup).find(".MadStatusBackBuffer"), 2e3, 800), MadStatus.start()); switch (n) { case 0: break; case 1: MadStatus.manualUpdate("A server is loading the game...", !0); break; case 2: MadStatus.manualUpdate("The server is ready. Joining the game...", !0); break; case 3: MadStatus.manualUpdate("Joining games is temporarily disabled while we upgrade. Please try again soon.", !1); break; case 4: MadStatus.manualUpdate("An error occurred. Please try again later.", !1); break; case 5: MadStatus.manualUpdate("The game you requested has ended.", !1); break; case 6: MadStatus.manualUpdate("The game you requested is currently full. Waiting for an opening...", !0, !1); break; case 7: MadStatus.manualUpdate("Roblox is updating. Please wait...", !0); break; case 8: MadStatus.manualUpdate("Requesting a server", !0); break; default: MadStatus.stop("Connecting to Players...") }$(this._popup).find(".MadStatusStarting").css("display", "none"), $(this._popup).find(".MadStatusSpinner").css("visibility", n === 3 || n === 4 || n === 5 ? "hidden" : "visible") }, _onGameError: function () { this._updateStatus(4) }, _startUpdatePolling: function (n) { var t, i; try { if (RobloxLaunch.state = RobloxLaunchStates.Upgrading, t = Roblox.Client.CreateLauncher(!0), i = window.ActiveXObject ? t.IsUpToDate : t.Get_IsUpToDate(), i || i === undefined) { try { t.PreStartGame() } catch (e) { } Roblox.Client.ReleaseLauncher(t, !0, !1), RobloxLaunch.state = RobloxLaunchStates.StartingServer, n(); return } var f = function (t, i, r) { r._onUpdateStatus(t, i, n) }, u = function (n, t) { t._onUpdateError(n) }, r = this; this.CheckUpdateStatus(f, u, t, n, r) } catch (e) { Roblox.Client.ReleaseLauncher(t, !0, !1), n() } }, _onUpdateStatus: function (n, t, i) { if (!this._cancelled) if (this._updateStatus(n), n === 8) Roblox.Client.ReleaseLauncher(t, !0, !0), Roblox.Client.Refresh(), RobloxLaunch.state = RobloxLaunchStates.StartingServer, i(); else if (n === 7) { var f = function (n, t, r) { r._onUpdateStatus(n, t, i) }, e = function (n, t) { t._onUpdateError(n) }, r = this, u = function () { r.CheckUpdateStatus(f, e, t, i, r) }; window.setTimeout(u, 2e3) } else alert("Unknown status from CheckUpdateStatus") }, _onUpdateError: function () { this._updateStatus(2) }, CheckUpdateStatus: function (n, t, i, r, u) { try { if (i.PreStartGame(), window.ActiveXObject) var f = i.IsUpToDate; else f = i.Get_IsUpToDate(); f || f === undefined ? n(8, i, u) : n(7, i, u) } catch (e) { n(8, i, u) } }, RequestGame: function (n, t) { var r; this._showDialog(); var f = function (n, t) { t._onGameStatus(n) }, u = function (n, t) { t._onGameError(n) }, e = this, i = !1; return typeof Party != "undefined" && typeof Party.AmILeader == "function" && (i = Party.AmILeader()), r = function () { RobloxPlaceLauncherService.RequestGame(n, i, t, f, u, e) }, this._startUpdatePolling(r), !1 }, RequestPlayWithParty: function (n, t, i) { this._showDialog(); var f = function (n, t) { t._onGameStatus(n) }, e = function (n, t) { t._onGameError(n) }, r = this, u = function () { RobloxPlaceLauncherService.RequestPlayWithParty(n, t, i, f, e, r) }; return this._startUpdatePolling(u), !1 }, RequestGroupBuildGame: function (n) { this._showDialog(); var r = function (n, t) { t._onGameStatus(n, !0) }, u = function (n, t) { t._onGameError(n) }, t = this, i = function () { RobloxPlaceLauncherService.RequestGroupBuildGame(n, r, u, t) }; return this._startUpdatePolling(i), !1 }, RequestFollowUser: function (n) { this._showDialog(); var r = function (n, t) { t._onGameStatus(n) }, u = function (n, t) { t._onError(n) }, t = this, i = function () { RobloxPlaceLauncherService.RequestFollowUser(n, r, u, t) }; return this._startUpdatePolling(i), !1 }, RequestGameJob: function (n, t, i) { this._showDialog(); var f = function (n, t) { t._onGameStatus(n) }, e = function (n, t) { t._onGameError(n) }, r = this, u = function () { RobloxPlaceLauncherService.RequestGameJob(n, t, i, f, e, r) }; return this._startUpdatePolling(u), !1 }, CancelLaunch: function () { return this._cancelled = !0, $.modal.close(), !1 }, dispose: function () { RBX.PlaceLauncher.callBaseMethod(this, "dispose") } };

    ;// ClientInstaller.js
    function tryToDownload() { oIFrm = document.getElementById("downloadInstallerIFrame"), oIFrm.src = "/install/setup.ashx" } function logStatistics(n) { $.get("/install/VisitButtonHandler.ashx?reqtype=" + n, function () { }) } Type.registerNamespace("Roblox.Client"), Roblox.Client._installHost = null, Roblox.Client._installSuccess = null, Roblox.Client._CLSID = null, Roblox.Client._continuation = null, Roblox.Client._skip = null, Roblox.Client._isIDE = null, Roblox.Client._isRobloxBrowser = null, Roblox.Client._isPlaceLaunch = !1, Roblox.Client._silentModeEnabled = !1, Roblox.Client._bringAppToFrontEnabled = !1, Roblox.Client._numLocks = 0, Roblox.Client._logTiming = !1, Roblox.Client._logStartTime = null, Roblox.Client._logEndTime = null, Roblox.Client._hiddenModeEnabled = !1, Roblox.Client._runInstallABTest = function () { }, Roblox.Client.ReleaseLauncher = function (n, t, i) { if (t && Roblox.Client._numLocks--, (i || Roblox.Client._numLocks <= 0) && (n != null && (document.getElementById("pluginObjDiv").innerHTML = "", n = null), Roblox.Client._numLocks = 0), Roblox.Client._logTiming) { Roblox.Client._logEndTime = new Date; var r = Roblox.Client._logEndTime.getTime() - Roblox.Client._logStartTime.getTime(); console && console.log && console.log("Roblox.Client: " + r + "ms from Create to Release.") } }, Roblox.Client.GetInstallHost = function (n) { if (window.ActiveXObject) return n.InstallHost; var t = n.Get_InstallHost(); return t.match(/roblox.com$/) ? t : t.substring(0, t.length - 1) }, Roblox.Client.CreateLauncher = function (n) { var i, u, t, r; Roblox.Client._logTiming && (Roblox.Client._logStartTime = new Date), n && Roblox.Client._numLocks++, (Roblox.Client._installHost == null || Roblox.Client._CLSID == null) && typeof initClientProps == "function" && initClientProps(), i = document.getElementById("robloxpluginobj"), u = $("#pluginObjDiv"), i || (Roblox.Client._hiddenModeEnabled = !1, window.ActiveXObject ? (t = '<object classid="clsid:' + Roblox.Client._CLSID + '"', t += ' id="robloxpluginobj" type="application/x-vnd-roblox-launcher"', t += ' codebase="' + Roblox.Client._installHost + '">Failed to INIT Plugin</object>', $(u).append(t)) : (t = '<object id="robloxpluginobj" type="application/x-vnd-roblox-launcher">', t += "<p>" + Roblox.Client.Resources.youNeedTheLatest, t += '<a href="' + Roblox.Client._installHost + '">' + Roblox.Client.Resources.here + "</a>.</p></object>", $(u).append(t)), i = document.getElementById("robloxpluginobj")); try { if (i || (typeof console.log == "undefined" ? alert(Roblox.Client.Resources.plugInInstallationFailed) : console.log("Plugin installation failed!")), i.Hello(), r = Roblox.Client.GetInstallHost(i), !r || r != Roblox.Client._installHost) throw "wrong InstallHost: (plugins):  " + r + "  (servers):  " + Roblox.Client._installHost; return i } catch (f) { return Roblox.Client.ReleaseLauncher(i, n, !1), null } }, Roblox.Client.isIDE = function () { if (Roblox.Client._isIDE == null && (Roblox.Client._isIDE = !1, Roblox.Client._isRobloxBrowser = !1, window.external)) try { window.external.IsRobloxAppIDE !== undefined && (Roblox.Client._isIDE = window.external.IsRobloxAppIDE, Roblox.Client._isRobloxBrowser = !0) } catch (n) { } return Roblox.Client._isIDE }, Roblox.Client.isRobloxBrowser = function () { return Roblox.Client.isIDE(), Roblox.Client._isRobloxBrowser }, Roblox.Client.robloxBrowserInstallHost = function () { if (window.external) try { return window.external.InstallHost } catch (n) { } return "" }, Roblox.Client.IsRobloxProxyInstalled = function () { var t = Roblox.Client.CreateLauncher(!1), n = !1; return (t != null && (n = !0), Roblox.Client.ReleaseLauncher(t, !1, !1), n || Roblox.Client.isRobloxBrowser()) ? !0 : !1 }, Roblox.Client.IsRobloxInstalled = function () { try { var t = Roblox.Client.CreateLauncher(!1), n = Roblox.Client.GetInstallHost(t); return Roblox.Client.ReleaseLauncher(t, !1, !1), n == Roblox.Client._installHost } catch (i) { return Roblox.Client.isRobloxBrowser() ? (n = Roblox.Client.robloxBrowserInstallHost(), n == Roblox.Client._installHost) : !1 } }, Roblox.Client.SetStartInHiddenMode = function (n) { try { var t = Roblox.Client.CreateLauncher(!1); if (t !== null) return t.SetStartInHiddenMode(n), Roblox.Client._hiddenModeEnabled = n, !0 } catch (i) { } return !1 }, Roblox.Client.UnhideApp = function () { try { if (Roblox.Client._hiddenModeEnabled) { var n = Roblox.Client.CreateLauncher(!1); n.UnhideApp() } } catch (t) { } }, Roblox.Client.Update = function () { try { var n = Roblox.Client.CreateLauncher(!1); n.Update(), Roblox.Client.ReleaseLauncher(n, !1, !1) } catch (t) { alert(Roblox.Client.Resources.errorUpdating + ": " + t) } }, Roblox.Client.WaitForRoblox = function (n) { if (Roblox.Client._skip) return window.location = Roblox.Client._skip, !1; if (Roblox.Client._continuation = n, Roblox.Client._cancelled = !1, !Roblox.Client.IsRobloxProxyInstalled() && Roblox.Client.ImplementsProxy) { Roblox.InstallationInstructions.show(), Roblox.Client._runInstallABTest(); var t = "Windows"; return navigator.appVersion.indexOf("Mac") != -1 && (t = "Mac"), typeof _gaq != typeof undefined && (_gaq.push(["_trackEvent", "Install Begin", t]), _gaq.push(["b._trackEvent", "Install Begin", t])), RobloxEventManager.triggerEvent("rbx_evt_install_begin", { os: t }), window.chrome && (window.location.hash = "#chromeInstall", $.cookie("chromeInstall", n.toString().replace(/play_placeId/, play_placeId.toString()))), window.setTimeout(function () { Roblox.Client._ontimer() }, 1e3), tryToDownload(), !0 } return Roblox.Client._continuation(), !1 }, Roblox.Client.ResumeTimer = function (n) { Roblox.Client._continuation = n, Roblox.Client._cancelled = !1, window.setTimeout(function () { Roblox.Client._ontimer() }, 0) }, Roblox.Client.Refresh = function () { try { navigator.plugins.refresh(!1) } catch (n) { } }, Roblox.Client._onCancel = function () { return Roblox.InstallationInstructions.hide(), Roblox.Client._cancelled = !0, !1 }, Roblox.Client._ontimer = function () { Roblox.Client._cancelled || (Roblox.Client.Refresh(), Roblox.Client.IsRobloxProxyInstalled() ? (Roblox.InstallationInstructions.hide(), window.setTimeout(function () { window.chrome && window.location.hash == "#chromeInstall" && (window.location.hash = "", $.cookie("chromeInstall", null)) }, 5e3), Roblox.Client._continuation(), Roblox.Client._installSuccess && Roblox.Client._installSuccess()) : window.setTimeout(function () { Roblox.Client._ontimer() }, 1e3)) };

    ;// jquery.simplemodal-1.3.5.js
    (function (n) { var i = n.browser.msie && parseInt(n.browser.version) == 6 && typeof window.XMLHttpRequest != "object", r = !1, t = []; n.modal = function (t, i) { return n.modal.impl.init(t, i) }, n.modal.close = function () { n.modal.impl.close() }, n.fn.modal = function (t) { return n.modal.impl.init(this, t) }, n.modal.defaults = { appendTo: "body", focus: !0, opacity: 50, overlayId: "simplemodal-overlay", overlayCss: {}, containerId: "simplemodal-container", containerCss: {}, dataId: "simplemodal-data", dataCss: {}, minHeight: null, minWidth: null, maxHeight: null, maxWidth: null, autoResize: !1, autoPosition: !0, zIndex: 1e4, close: !0, closeHTML: '<a class="modalCloseImg" title="Close"></a>', closeClass: "simplemodal-close", escClose: !0, overlayClose: !1, position: null, persist: !1, modal: !0, onOpen: null, onShow: null, onClose: null }, n.modal.impl = { o: null, d: {}, init: function (t, i) { var r = this; if (r.d.data) return !1; if (r.o = n.extend({}, n.modal.defaults, i), r.zIndex = r.o.zIndex, r.occb = !1, typeof t == "object") t = t instanceof jQuery ? t : n(t), r.d.placeholder = !1, t.parent().parent().size() > 0 && (t.before(n("<span></span>").attr("id", "simplemodal-placeholder").css({ display: "none" })), r.d.placeholder = !0, r.display = t.css("display"), r.o.persist || (r.d.orig = t.clone(!0))); else if (typeof t == "string" || typeof t == "number") t = n("<div></div>").html(t); else return alert("SimpleModal Error: Unsupported data type: " + typeof t), r; return r.create(t), t = null, r.open(), n.isFunction(r.o.onShow) && r.o.onShow.apply(r, [r.d]), r }, create: function (r) { var u = this; t = u.getDimensions(), u.o.modal && i && (u.d.iframe = n('<iframe src="javascript:false;"></iframe>').css(n.extend(u.o.iframeCss, { display: "none", opacity: 0, position: "fixed", height: t[0], width: t[1], zIndex: u.o.zIndex, top: 0, left: 0 })).appendTo(u.o.appendTo)), u.d.overlay = n("<div></div>").attr("id", u.o.overlayId).addClass("simplemodal-overlay").css(n.extend(u.o.overlayCss, { display: "none", opacity: u.o.opacity / 100, height: u.o.modal ? t[0] : 0, width: u.o.modal ? t[1] : 0, position: "fixed", left: 0, top: 0, zIndex: u.o.zIndex + 1 })).appendTo(u.o.appendTo), u.d.container = n("<div></div>").attr("id", u.o.containerId).addClass("simplemodal-container").css(n.extend(u.o.containerCss, { display: "none", position: "fixed", zIndex: u.o.zIndex + 2 })).append(u.o.close && u.o.closeHTML ? n(u.o.closeHTML).addClass(u.o.closeClass) : "").appendTo(u.o.appendTo), u.d.wrap = n("<div></div>").attr("tabIndex", -1).addClass("simplemodal-wrap").css({ height: "100%", outline: 0, width: "100%", overflow: "visible" }).appendTo(u.d.container), u.d.data = r.attr("id", r.attr("id") || u.o.dataId).addClass("simplemodal-data").css(n.extend(u.o.dataCss, { display: "none" })).appendTo("body"), r = null, u.setContainerDimensions(), u.d.data.appendTo(u.d.wrap), i && u.fixIE() }, bindEvents: function () { var r = this; n("." + r.o.closeClass).bind("click.simplemodal", function (n) { n.preventDefault(), r.close() }), r.o.modal && r.o.close && r.o.overlayClose && r.d.overlay.bind("click.simplemodal", function (n) { n.preventDefault(), r.close() }), n(document).bind("keydown.simplemodal", function (n) { r.o.modal && r.o.focus && n.keyCode == 9 ? r.watchTab(n) : r.o.close && r.o.escClose && n.keyCode == 27 && (n.preventDefault(), r.close()) }), n(window).bind("resize.simplemodal", function () { t = r.getDimensions(), r.setContainerDimensions(!0), i ? r.fixIE() : r.o.modal && (r.d.iframe && r.d.iframe.css({ height: t[0], width: t[1] }), r.d.overlay.css({ height: t[0], width: t[1] })) }) }, unbindEvents: function () { n("." + this.o.closeClass).unbind("click.simplemodal"), n(document).unbind("keydown.simplemodal"), n(window).unbind("resize.simplemodal"), this.d.overlay.unbind("click.simplemodal") }, fixIE: function () { var i = this, t = i.o.position; n.each([i.d.iframe || null, i.o.modal ? i.d.overlay : null, i.d.container], function (n, i) { var l, c, o, e; if (i) { var s = "document.body.clientHeight", h = "document.body.clientWidth", b = "document.body.scrollHeight", a = "document.body.scrollLeft", v = "document.body.scrollTop", p = "document.body.scrollWidth", y = "document.documentElement.clientHeight", w = "document.documentElement.clientWidth", u = "document.documentElement.scrollLeft", f = "document.documentElement.scrollTop", r = i[0].style; r.position = "absolute", n < 2 ? (r.removeExpression("height"), r.removeExpression("width"), r.setExpression("height", "" + b + " > " + s + " ? " + b + " : " + s + ' + "px"'), r.setExpression("width", "" + p + " > " + h + " ? " + p + " : " + h + ' + "px"')) : (t && t.constructor == Array ? (o = t[0] ? typeof t[0] == "number" ? t[0].toString() : t[0].replace(/px/, "") : i.css("top").replace(/px/, ""), l = o.indexOf("%") == -1 ? o + " + (t = " + f + " ? " + f + " : " + v + ') + "px"' : parseInt(o.replace(/%/, "")) + " * ((" + y + " || " + s + ") / 100) + (t = " + f + " ? " + f + " : " + v + ') + "px"', t[1] && (e = typeof t[1] == "number" ? t[1].toString() : t[1].replace(/px/, ""), c = e.indexOf("%") == -1 ? e + " + (t = " + u + " ? " + u + " : " + a + ') + "px"' : parseInt(e.replace(/%/, "")) + " * ((" + w + " || " + h + ") / 100) + (t = " + u + " ? " + u + " : " + a + ') + "px"')) : (l = "(" + y + " || " + s + ") / 2 - (this.offsetHeight / 2) + (t = " + f + " ? " + f + " : " + v + ') + "px"', c = "(" + w + " || " + h + ") / 2 - (this.offsetWidth / 2) + (t = " + u + " ? " + u + " : " + a + ') + "px"'), r.removeExpression("top"), r.removeExpression("left"), r.setExpression("top", l), r.setExpression("left", c)) } }) }, focus: function (t) { var r = this, u = t || "first", i = n(":input:enabled:visible:" + u, r.d.wrap); i.length > 0 ? i.focus() : r.d.wrap.focus() }, getDimensions: function () { var t = n(window), i = n.browser.opera && n.browser.version > "9.5" && n.fn.jquery <= "1.2.6" ? document.documentElement.clientHeight : n.browser.opera && n.browser.version < "9.5" && n.fn.jquery > "1.2.6" ? window.innerHeight : t.height(); return [i, t.width()] }, getVal: function (n) { return n == "auto" ? 0 : n.indexOf("%") > 0 ? n : parseInt(n.replace(/px/, "")) }, setContainerDimensions: function (i) { var r = this; if (!i || i && r.o.autoResize) { var f = n.browser.opera ? r.d.container.height() : r.getVal(r.d.container.css("height")), u = n.browser.opera ? r.d.container.width() : r.getVal(r.d.container.css("width")), s = r.d.data.outerHeight(!0), h = r.d.data.outerWidth(!0), e = r.o.maxHeight && r.o.maxHeight < t[0] ? r.o.maxHeight : t[0], o = r.o.maxWidth && r.o.maxWidth < t[1] ? r.o.maxWidth : t[1]; f = f ? f > e ? e : f : s ? s > e ? e : s < r.o.minHeight ? r.o.minHeight : s : r.o.minHeight, u = u ? u > o ? o : u : h ? h > o ? o : h < r.o.minWidth ? r.o.minWidth : h : r.o.minWidth, r.d.container.css({ height: f, width: u }) } r.o.autoPosition && r.setPosition() }, setPosition: function () { var n = this, r, i, f = t[0] / 2 - n.d.container.outerHeight(!0) / 2, u = t[1] / 2 - n.d.container.outerWidth(!0) / 2; n.o.position && Object.prototype.toString.call(n.o.position) === "[object Array]" ? (r = n.o.position[0] || f, i = n.o.position[1] || u) : (r = f, i = u), n.d.container.css({ left: i, top: r }) }, watchTab: function (t) { var i = this, r; n(t.target).parents(".simplemodal-container").length > 0 ? (i.inputs = n(":input:enabled:visible:first, :input:enabled:visible:last", i.d.data[0]), (!t.shiftKey && t.target == i.inputs[i.inputs.length - 1] || t.shiftKey && t.target == i.inputs[0] || i.inputs.length == 0) && (t.preventDefault(), r = t.shiftKey ? "last" : "first", setTimeout(function () { i.focus(r) }, 10))) : (t.preventDefault(), setTimeout(function () { i.focus() }, 10)) }, open: function () { var t = this; t.d.iframe && t.d.iframe.show(), n.isFunction(t.o.onOpen) ? t.o.onOpen.apply(t, [t.d]) : (t.d.overlay.show(), t.d.container.show(), t.d.data.show()), t.focus(), t.bindEvents() }, close: function () { var t = this, i; if (!t.d.data) return !1; t.unbindEvents(), n.isFunction(t.o.onClose) && !t.occb ? (t.occb = !0, t.o.onClose.apply(t, [t.d])) : (t.d.placeholder ? (i = n("#simplemodal-placeholder"), t.o.persist ? i.replaceWith(t.d.data.removeClass("simplemodal-data").css("display", t.display)) : (t.d.data.hide().remove(), i.replaceWith(t.d.orig))) : t.d.data.hide().remove(), t.d.container.hide().remove(), t.d.overlay.hide().remove(), t.d.iframe && t.d.iframe.hide().remove(), t.d = {}) } } })(jQuery);

    ;// GenericModal.js
    typeof Roblox.GenericModal == "undefined" && (Roblox.GenericModal = function () { function i(t, i, u, f, e) { n = f; var o = $("div.GenericModal").filter(":first"); o.find("div.Title").text(t), i === null ? o.addClass("noImage") : (o.find("img.GenericModalImage").attr("src", i), o.removeClass("noImage")), o.find("div.Message").html(u), e && (o.removeClass("smallModal"), o.addClass("largeModal")), o.modal(r) } function t() { $.modal.close(), typeof n == "function" && n() } var r = { overlayClose: !0, escClose: !0, opacity: 80, overlayCss: { backgroundColor: "#000" } }, n; return $(function () { $(document).on("click", ".GenericModal .roblox-ok", function () { t() }) }), { open: i } }());

    ;// GenericConfirmation.js
    typeof Roblox == "undefined" && (Roblox = {}), typeof Roblox.GenericConfirmation == "undefined" && (Roblox.GenericConfirmation = function () { function s(n) { var c = { titleText: "", bodyContent: "", footerText: "", acceptText: Roblox.GenericConfirmation.Resources.yes, declineText: Roblox.GenericConfirmation.Resources.No, acceptColor: u, declineColor: r, xToCancel: !1, onAccept: function () { return !1 }, onDecline: function () { return !1 }, onCancel: function () { return !1 }, imageUrl: null, allowHtmlContentInBody: !1, allowHtmlContentInFooter: !1, dismissable: !0, fieldValidationRequired: !1, onOpenCallback: function () { } }, o, e, h, s; n = $.extend({}, c, n), i.overlayClose = n.dismissable, i.escClose = n.dismissable, o = $("[roblox-confirm-btn]"), o.html(n.acceptText + "<span class='btn-text'>" + n.acceptText + "</span>"), o.attr("class", "btn-large " + n.acceptColor), o.unbind(), o.bind("click", function () { return n.fieldValidationRequired ? f(n.onAccept) : t(n.onAccept), !1 }), e = $("[roblox-decline-btn]"), e.html(n.declineText + "<span class='btn-text'>" + n.declineText + "</span>"), e.attr("class", "btn-large " + n.declineColor), e.unbind(), e.bind("click", function () { return t(n.onDecline), !1 }), $('[data-modal-handle="confirmation"] div.Title').text(n.titleText), h = $("[data-modal-handle='confirmation']"), n.imageUrl == null ? h.addClass("noImage") : (h.find("img.GenericModalImage").attr("src", n.imageUrl), h.removeClass("noImage")), n.allowHtmlContentInBody ? $("[data-modal-handle='confirmation'] div.Message").html(n.bodyContent) : $("[data-modal-handle='confirmation'] div.Message").text(n.bodyContent), $.trim(n.footerText) == "" ? $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').hide() : $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').show(), n.allowHtmlContentInFooter ? $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').html(n.footerText) : $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').text(n.footerText), $("[data-modal-handle='confirmation']").modal(i), s = $("a.genericmodal-close"), s.unbind(), s.bind("click", function () { return t(n.onCancel), !1 }), n.xToCancel || s.hide(), n.onOpenCallback() } function n(n) { typeof n != "undefined" ? $.modal.close(n) : $.modal.close() } function t(t) { n(), typeof t == "function" && t() } function f(t) { if (typeof t == "function") { var i = t(); if (i !== "undefined" && i == !1) return !1 } n() } var o = "btn-primary", u = "btn-neutral", r = "btn-negative", e = "btn-none", i = { overlayClose: !0, escClose: !0, opacity: 80, overlayCss: { backgroundColor: "#000" } }; return { open: s, close: n, green: o, blue: u, gray: r, none: e } }());

    ;// jquery.ba-postmessage.min.js
    /*
     * jQuery postMessage - v0.5 - 9/11/2009
     * http://benalman.com/projects/jquery-postmessage-plugin/
     * 
     * Copyright (c) 2009 "Cowboy" Ben Alman
     * Dual licensed under the MIT and GPL licenses.
     * http://benalman.com/about/license/
     */
    (function ($) { var g, d, j = 1, a, b = this, f = !1, h = "postMessage", e = "addEventListener", c, i = b[h] && !$.browser.opera; $[h] = function (k, l, m) { if (!l) { return } k = typeof k === "string" ? k : $.param(k); m = m || parent; if (i) { m[h](k, l.replace(/([^:]+:\/\/[^\/]+).*/, "$1")) } else { if (l) { m.location = l.replace(/#.*$/, "") + "#" + (+new Date) + (j++) + "&" + k } } }; $.receiveMessage = c = function (l, m, k) { if (i) { if (l) { a && c(); a = function (n) { if ((typeof m === "string" && n.origin !== m) || ($.isFunction(m) && m(n.origin) === f)) { return f } l(n) } } if (b[e]) { b[l ? e : "removeEventListener"]("message", a, f) } else { b[l ? "attachEvent" : "detachEvent"]("onmessage", a) } } else { g && clearInterval(g); g = null; if (l) { k = typeof m === "number" ? m : typeof k === "number" ? k : 100; g = setInterval(function () { var o = document.location.hash, n = /^#?\d+&/; if (o !== d && n.test(o)) { d = o; l({ data: o.replace(n, "") }) } }, k) } } } })(jQuery);

    ;// parentFrameLogin.js
    $(function () { var n = !1, t, i; $("#header-login").click(function (i) { return n = !n, t(n), $("#iFrameLogin").toggle(), $("#header-login").toggleClass("active"), i.stopPropagation(), !1 }), $("#headerLogin").click(function (i) { return n = !n, t(n), $("#iFrameLogin").toggle(), $("#headerLogin").toggleClass("active"), i.stopPropagation(), !1 }), $(document).click(function () { n && ($("#header-login").removeClass("active"), $("#headerLogin").removeClass("active"), $("#iFrameLogin").hide(), n = !1) }), t = function (n) { $(".IframeAdHide").each(function () { $(this).height() == 90 && $(this).width() == 728 && (n ? $(this).css("visibility", "hidden") : $(this).css("visibility", "visible")) }) }, i = function (n) { var t, i; n.indexOf("resize") != -1 && (t = n.split(","), $("#iFrameLogin").css({ height: t[1] })), n.indexOf("fbRegister") != -1 && (t = n.split("^"), i = "&fbname=" + encodeURIComponent(t[1]) + "&fbem=" + encodeURIComponent(t[2]) + "&fbdt=" + encodeURIComponent(t[3]), window.location.href = "../Login/Default.aspx?iFrameFacebookSync=true" + i) }, $.receiveMessage(function (n) { i(n.data) }), $("#header-login-wrapper").data("display-opened") == "True" && ($("#header-login").addClass("active"), $("#iFrameLogin").css("display", "block")) });

    ;// IDE/Welcome.js
    $(function () { function n() { Roblox.GenericConfirmation.open({ titleText: Roblox.IDEWelcome.Resources.emailVerifiedTitle, bodyContent: Roblox.IDEWelcome.Resources.emailVerifiedMessage, onAccept: function () { window.location.href = "/My/Account.aspx?confirmemail=1" }, acceptColor: Roblox.GenericConfirmation.blue, acceptText: Roblox.IDEWelcome.Resources.verify, declineText: Roblox.IDEWelcome.Resources.cancel, allowHtmlContentInBody: !0 }) } function i(n) { var r = "/ide/placelist", i, t; return n && (i = $("div.place").length, t = "?startRow=" + i, r += t), r } function t(n, t) { $.ajax({ url: t, cache: !1, dataType: "html", success: function (t) { n.remove(); var i = $("#AssetList"); i.append($(t)), $(t).animate({ opacity: 1 }, "fast"), $(".place").unbind("click"), $(".place").click(function () { $(this).hasClass("place-selected") ? ($(this).removeClass("place-selected"), $("div#ButtonRow").hide()) : ($(".place.place-selected").removeClass("place-selected"), $(this).addClass("place-selected"), $("div#ButtonRow").show()) }), $(".place a").removeAttr("href") } }) } $(window).resize(function () { var n = $(".main div.welcome-content-area:visible"); $(window).height() < n.height() ? $(".navbar").height(n.height()) : $(".navbar").height($(window).height() - 124), n.height($(window).height() - 170) }), $(".navbar").height($(window).height() - 124), $("ul.filelist li a").each(function () { this.innerHTML = fitStringToWidthSafe($(this).text(), $(".navlist li p").width()) }), $("#PublishedProjects").length > 0 ? $("#MyProjects").addClass("navselected") : $(".navlist li").first().addClass("navselected"), $("ul.filelist li a").click(function () { Roblox.Client.isIDE() ? window.external.OpenRecentFile($(this).attr("js-data-file")) : Roblox.GenericModal.open(Roblox.IDEWelcome.Resources.openProject, "/images/Icons/img-alert.png", Roblox.IDEWelcome.Resources.openProjectText + " <a target='_blank' href='https://web.archive.org/web/20150918194635/http://wiki.roblox.com/index.php/Studio'>" + Roblox.IDEWelcome.Resources.robloxStudio + "</a>.") }), $("#header-signup").click(function () { window.open("/Login/NewAge.aspx") }), $("#HeaderHome").click(function () { window.location = "/Home/Default.aspx" }), $("#MyProjects").click(function () { $("#TemplatesView").hide(), $("#MyProjectsView").show(), $(".navlist li.navselected").removeClass("navselected"), $(this).addClass("navselected") }), $("#NewProject").click(function () { $("#TemplatesView").show(), $("#MyProjectsView").hide(), $(".navlist li.navselected").removeClass("navselected"), $(this).addClass("navselected") }), $(".place").click(function () { $(this).hasClass("place-selected") ? ($(this).removeClass("place-selected"), $("div#ButtonRow").hide()) : ($(".place.place-selected").removeClass("place-selected"), $(this).addClass("place-selected"), $("div#ButtonRow").show()) }), $(".place a").removeAttr("href"), $("ul.navlist li").last().addClass("lastnav"), $("#EditButton").click(function () { var i, t; $(this).hasClass("btn-disabled-primary") || ($("#BuildButton, #EditButton").addClass("btn-disabled-primary"), $("#CollapseButton").addClass("btn-disabled-negative"), i = $(".place.place-selected"), Roblox.Client.isIDE() ? $("#verifiedEmail").data("email-verified-required") == "True" ? n() : (t = i.attr("data-placeid"), window.play_placeId = t, window.editGameInStudio(t)) : Roblox.GenericModal.open(Roblox.IDEWelcome.Resources.editPlace, "/images/Icons/img-alert.png", Roblox.IDEWelcome.Resources.toEdit + i.find("p").text() + Roblox.IDEWelcome.Resources.openPage + "<a target='_blank' href='https://web.archive.org/web/20150918194635/http://wiki.roblox.com/index.php/Studio'>" + Roblox.IDEWelcome.Resources.robloxStudio + "</a>."), $("#BuildButton").removeClass("btn-disabled-primary"), $("#EditButton").removeClass("btn-disabled-primary"), $("#CollapseButton").removeClass("btn-disabled-negative"), $("#CollapseButton").trigger("click")) }), $("#BuildButton").click(function () { var t, r, i; $(this).hasClass("btn-disabled-primary") || ($("#BuildButton, #EditButton").addClass("btn-disabled-primary"), $("#CollapseButton").addClass("btn-disabled-negative"), t = $(".place.place-selected"), Roblox.Client.isIDE() ? $("#verifiedEmail").data("email-verified-required") == "True" ? n() : (r = t.attr("data-active") == "True", r ? (i = t.attr("data-placeid"), window.play_placeId = i, buildGameInStudio(i)) : Roblox.GenericModal.open(Roblox.IDEWelcome.Resources.placeInactive, "/images/Icons/img-alert.png", Roblox.IDEWelcome.Resources.toBuild + t.find("p").text() + Roblox.IDEWelcome.Resources.activate)) : Roblox.GenericModal.open(Roblox.IDEWelcome.Resources.buildPlace, "/images/Icons/img-alert.png", Roblox.IDEWelcome.Resources.toBuild + t.find("p").text() + Roblox.IDEWelcome.Resources.openPage + "<a target='_blank' href='https://web.archive.org/web/20150918194635/http://wiki.roblox.com/index.php/Studio'>" + Roblox.IDEWelcome.Resources.robloxStudio + "</a>."), $("#BuildButton").removeClass("btn-disabled-primary"), $("#EditButton").removeClass("btn-disabled-primary"), $("#CollapseButton").removeClass("btn-disabled-negative"), $("#CollapseButton").trigger("click")) }), $("#CollapseButton").click(function () { $(this).hasClass("btn-disabled-negative") || ($(".place.place-selected").removeClass("place-selected"), $("div#ButtonRow").hide()) }), $("#StudioRecentFiles").length == 0 && $("ul.navlist").css("border-bottom", "none"); $("#AssetList").on("click", "#load-more-assets", function () { var r = $(this).parent(), n = i(!0); t(r, n) }) });

    ;// IDE/BuildTemplates.js
    function getSelectedTemplateType() { return $('div.templates[js-data-templatetype="' + $("ul.templatetypes li.selectedType").attr("js-data-templatetype") + '"]') } $(function () { var t = $("ul.templatetypes li"), n; t.click(function () { var n = getSelectedTemplateType(); n.hide(), $("ul.templatetypes li.selectedType").removeClass("selectedType"), $(this).addClass("selectedType"), n = getSelectedTemplateType(), n.show() }), n = t.first(), n.addClass("selectedType"), getSelectedTemplateType().show(), Roblox.require("Widgets.PlaceImage", function () { Roblox.Widgets.PlaceImage.populate() }), $(".template").click(function () { Roblox.Client.isIDE() ? window.editTemplateInStudio($(this).attr("placeid")) : Roblox.GenericModal.open("New Project", "/img/img-alert.png", "To build using this template, use <a target='_blank' href='https://archblox.com/download'>ARCHBLOX Studio</a>.") }), $(".template a").removeAttr("href") });

    ;// StringTruncator.js
    function InitStringTruncator() { isInitialized || (fitStringSpan = document.createElement("span"), fitStringSpan.style.display = "inline", fitStringSpan.style.visibility = "hidden", fitStringSpan.style.padding = "0px", document.body.appendChild(fitStringSpan), isInitialized = !0) } function fitStringToWidth(n, t, i) { function s(n) { return n.replace("<", "&lt;").replace(">", "&gt;") } var f, r, u, e, o; if (isInitialized || InitStringTruncator(), i && (fitStringSpan.className = i), f = s(n), fitStringSpan.innerHTML = f, fitStringSpan.offsetWidth > t) { for (r = 0, e = n.length; o = e - r >> 1;)u = r + o, fitStringSpan.innerHTML = s(n.substring(0, u)) + "&hellip;", fitStringSpan.offsetWidth > t ? e = u : r = u; f = n.substring(0, r) + "&hellip;" } return f } function fitStringToWidthSafe(n, t, i) { var r = fitStringToWidth(n, t, i), u; return r.indexOf("&hellip;") != -1 && (u = r.lastIndexOf(" "), u != -1 && u + 10 <= r.length && (r = r.substring(0, u + 2) + "&hellip;")), r } function fitStringToWidthSafeText(n, t, i) { return fitStringToWidthSafe(n, t, i).replace("&hellip;", "...") } var isInitialized = !1, fitStringSpan = null;


}

