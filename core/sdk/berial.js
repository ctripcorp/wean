(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.berial = {}));
}(this, (function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const mixins = new Set();
    const plugins = new Set();
    function use(plugin, ...args) {
        if (!plugins.has(plugin)) {
            plugins.add(plugin);
            plugin(...args);
        }
    }
    function mixin(mix) {
        if (!mixins.has(mix)) {
            mixins.add(mix);
        }
    }
    function mapMixin() {
        const out = {
            load: [],
            bootstrap: [],
            mount: [],
            unmount: []
        };
        mixins.forEach((item) => {
            item.load && out.load.push(item.load);
            item.bootstrap && out.bootstrap.push(item.bootstrap);
            item.mount && out.mount.push(item.mount);
            item.unmount && out.unmount.push(item.unmount);
        });
        return out;
    }

    function request(url, option) {
        return fetch(url, Object.assign({ mode: 'cors' }, option)).then((res) => res.text());
    }

    function runScript(code, options = {}, host) {
        try {
            const handler = {
                get(obj, prop) {
                    return Reflect.has(obj, prop) ? obj[prop] : null;
                },
                set(obj, prop, value) {
                    Reflect.set(obj, prop, value);
                    return true;
                },
                has(obj, prop) {
                    return obj && Reflect.has(obj, prop);
                }
            };
            const captureHandler = {
                get(obj, prop) {
                    return Reflect.get(obj, prop);
                },
                set() {
                    return true;
                },
                has() {
                    return true;
                }
            };
            const allowList = Object.assign({
                IS_BERIAL_SANDBOX: true, __proto__: null, console,
                host:111,
                String,
                Number,
                Array,
                Symbol,
                Math,
                Object,
                Promise,
                RegExp,
                JSON,
                fre,
                usePage,
                App,
                Component,
                $for,
                getApp,
                getPage,
                remotes,
                useComponent,
                wx,
                getUrl,
                Page,
                Date,
                Function,
                parseInt,
                document,
                navigator,
                location,
                performance,
                MessageChannel,
                SVGElement,
                HTMLElement,
                HTMLIFrameElement,
                history,
                Map,
                Set,
                WeakMap,
                WeakSet,
                Error,
                localStorage,
                decodeURI,
                encodeURI,
                decodeURIComponent,
                encodeURIComponent, fetch: fetch.bind(window), setTimeout: setTimeout.bind(window), clearTimeout: clearTimeout.bind(window), setInterval: setInterval.bind(window), clearInterval: clearInterval.bind(window), requestAnimationFrame: requestAnimationFrame.bind(window), cancelAnimationFrame: cancelAnimationFrame.bind(window), addEventListener: addEventListener.bind(window), removeEventListener: removeEventListener.bind(window), eval: function (code) {
                    return runScript('return ' + code, {});
                }, alert: function () {
                    alert('Sandboxed alert:' + arguments[0]);
                }, innerHeight,
                innerWidth,
                outerHeight,
                outerWidth,
                pageXOffset,
                pageYOffset,
                screen,
                screenLeft,
                screenTop,
                screenX,
                screenY,
                scrollBy,
                scrollTo,
                scrollX,
                scrollY,
            }, (options.allowList || {}));
            if (!Object.isFrozen(String.prototype)) {
                for (const k in allowList) {
                    const fn = allowList[k];
                    if (typeof fn === 'object' && fn.prototype) {
                        Object.freeze(fn.prototype);
                    }
                    if (typeof fn === 'function') {
                        Object.freeze(fn);
                    }
                }
            }
            const proxy = new Proxy(allowList, handler);
            const capture = new Proxy({
                __proto__: null,
                proxy,
                globalThis: new Proxy(allowList, handler),
                window: new Proxy(allowList, handler),
                self: new Proxy(allowList, handler),
            }, captureHandler);
            return Function('proxy', 'capture', `with(capture) {     
            with(proxy) {  
              return (function(){                                               
                "use strict";
                ${code};
                return window
              })();
            }
        }`)(proxy, capture);
        }
        catch (e) {
            throw e;
        }
    }

    const ALL_SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|')text\/ng-template\3).)*?>.*?<\/\1>/is;
    const SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
    const SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
    const LINK_TAG_REGEX = /<(link)\s+.*?>/gi;
    const LINK_IGNORE_REGEX = /.*ignore\s*.*/;
    const LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch)\1/;
    const LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
    const STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
    const STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
    const STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
    const STYLE_IGNORE_REGEX = /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*)>/i;
    const HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
    const SCRIPT_IGNORE_REGEX = /<script(\s+|\s+.+\s+)ignore(\s*|\s+.*)>/i;
    function getInlineCode(match) {
        const start = match.indexOf('>') + 1;
        const end = match.lastIndexOf('<');
        return match.substring(start, end);
    }
    function hasProtocol(url) {
        return (url.startsWith('//') ||
            url.startsWith('http://') ||
            url.startsWith('https://'));
    }
    function getEntirePath(path, baseURI) {
        return new URL(path, baseURI).toString();
    }
    const genLinkReplaceSymbol = (linkHref) => `<!-- link ${linkHref} replaced by import-html-entry -->`;
    const genScriptReplaceSymbol = (scriptSrc) => `<!-- script ${scriptSrc} replaced by import-html-entry -->`;
    const inlineScriptReplaceSymbol = `<!-- inline scripts replaced by import-html-entry -->`;
    const genIgnoreAssetReplaceSymbol = (url) => `<!-- ignore asset ${url || 'file'} replaced by import-html-entry -->`;
    function parse(tpl, baseURI) {
        let scripts = [];
        const styles = [];
        let entry = null;
        const template = tpl
            .replace(HTML_COMMENT_REGEX, '')
            .replace(LINK_TAG_REGEX, (match) => {
                const styleType = !!match.match(STYLE_TYPE_REGEX);
                if (styleType) {
                    const styleHref = match.match(STYLE_HREF_REGEX);
                    const styleIgnore = match.match(LINK_IGNORE_REGEX);
                    if (styleHref) {
                        const href = styleHref && styleHref[2];
                        let newHref = href;
                        if (href && !hasProtocol(href)) {
                            newHref = getEntirePath(href, baseURI);
                        }
                        if (styleIgnore) {
                            return genIgnoreAssetReplaceSymbol(newHref);
                        }
                        styles.push(newHref);
                        return genLinkReplaceSymbol(newHref);
                    }
                }
                const preloadOrPrefetchType = !!match.match(LINK_PRELOAD_OR_PREFETCH_REGEX);
                if (preloadOrPrefetchType) {
                    const linkHref = match.match(LINK_HREF_REGEX);
                    if (linkHref) {
                        const href = linkHref[2];
                        if (href && !hasProtocol(href)) {
                            const newHref = getEntirePath(href, baseURI);
                            return match.replace(href, newHref);
                        }
                    }
                }
                return match;
            })
            .replace(STYLE_TAG_REGEX, (match) => {
                if (STYLE_IGNORE_REGEX.test(match)) {
                    return genIgnoreAssetReplaceSymbol('style file');
                }
                return match;
            })
            .replace(ALL_SCRIPT_REGEX, (match) => {
                const scriptIgnore = match.match(SCRIPT_IGNORE_REGEX);
                if (SCRIPT_TAG_REGEX.test(match) && match.match(SCRIPT_SRC_REGEX)) {
                    const matchedScriptEntry = match.match(SCRIPT_ENTRY_REGEX);
                    const matchedScriptSrcMatch = match.match(SCRIPT_SRC_REGEX);
                    let matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];
                    if (entry && matchedScriptEntry) {
                        throw new SyntaxError('You should not set multiply entry script!');
                    }
                    else {
                        if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
                            matchedScriptSrc = getEntirePath(matchedScriptSrc, baseURI);
                        }
                        entry = entry || (matchedScriptEntry && matchedScriptSrc);
                    }
                    if (scriptIgnore) {
                        return genIgnoreAssetReplaceSymbol(matchedScriptSrc || 'js file');
                    }
                    if (matchedScriptSrc) {
                        scripts.push(matchedScriptSrc);
                        return genScriptReplaceSymbol(matchedScriptSrc);
                    }
                    return match;
                }
                else {
                    if (scriptIgnore) {
                        return genIgnoreAssetReplaceSymbol('js file');
                    }
                    const code = getInlineCode(match);
                    const isPureCommentBlock = code
                        .split(/[\r\n]+/)
                        .every((line) => !line.trim() || line.trim().startsWith('//'));
                    if (!isPureCommentBlock) {
                        scripts.push(match);
                    }
                    return inlineScriptReplaceSymbol;
                }
            });
        scripts = scripts.filter((s) => !!s);
        return {
            template,
            scripts,
            styles,
            entry: entry || scripts[scripts.length - 1]
        };
    }
    function importHtml(app) {
        return __awaiter(this, void 0, void 0, function* () {
            let template = '', scripts, styles;
            if (app.scripts) {
                scripts = app.scripts || [];
                styles = app.styles || [];
            }
            else {
                const tpl = yield request(app.url);
                let res = parse(tpl, '');
                scripts = res.scripts;
                styles = res.styles;
                template = res.template;
            }
            scripts = yield Promise.all(scripts.map((s) => hasProtocol(s)
                ? request(s)
                : s.endsWith('.js') || s.endsWith('.jsx')
                    ? request(window.origin + s)
                    : s));
            styles = styles.map((s) => hasProtocol(s)||s.endsWith('.css') ? `<link rel="stylesheet" type="text/css" href="${s}" ></link>` : `<style>${s}<style>`);
            template = template;
            let lifecycles = {
                bootstrap:()=>{},
                mount:()=>{},
                umount:()=>{}
            };
            scripts.forEach((script) => __awaiter(this, void 0, void 0, function* () {
                lifecycles = runScript(script, {}, app.host)[app.name] || lifecycles;
            }));
            const dom = document.createDocumentFragment();
            const body = document.createElement('template');
            let out = '';
            styles.forEach((s) => (out += s));
            out += template;
            body.innerHTML = out;
            dom.appendChild(body.content.cloneNode(true));
            return { dom, lifecycles };
        });
    }

    var Status;
    (function (Status) {
        Status["NOT_LOADED"] = "NOT_LOADED";
        Status["LOADING"] = "LOADING";
        Status["NOT_BOOTSTRAPPED"] = "NOT_BOOTSTRAPPED";
        Status["BOOTSTRAPPING"] = "BOOTSTRAPPING";
        Status["NOT_MOUNTED"] = "NOT_MOUNTED";
        Status["MOUNTING"] = "MOUNTING";
        Status["MOUNTED"] = "MOUNTED";
        Status["UPDATING"] = "UPDATING";
        Status["UPDATED"] = "UPDATED";
        Status["UNMOUNTING"] = "UNMOUNTING";
    })(Status || (Status = {}));
    let apps = [];
    function register(appArray) {
        appArray.forEach((app) => (app.status = Status.NOT_LOADED));
        apps = appArray;
        hack();
        reroute();
    }
    function reroute() {
        const { loads, mounts, unmounts } = getAppChanges();
        perform();
        function perform() {
            return __awaiter(this, void 0, void 0, function* () {
                unmounts.map(runUnmount);
                loads.map((app) => __awaiter(this, void 0, void 0, function* () {
                    app = yield runLoad(app);
                    app = yield runBootstrap(app);
                    return runMount(app);
                }));
                mounts.map((app) => __awaiter(this, void 0, void 0, function* () {
                    app = yield runBootstrap(app);
                    return runMount(app);
                }));
            });
        }
    }
    function getAppChanges() {
        const unmounts = [];
        const loads = [];
        const mounts = [];
        apps.forEach((app) => {
            const isActive = typeof app.path === 'function' ? app.path(window.location): window.location.pathname === app.path;
            switch (app.status) {
                case Status.NOT_LOADED:
                case Status.LOADING:
                    isActive && loads.push(app);
                    break;
                case Status.NOT_BOOTSTRAPPED:
                case Status.BOOTSTRAPPING:
                case Status.NOT_MOUNTED:
                    isActive && mounts.push(app);
                    break;
                case Status.MOUNTED:
                    !isActive && unmounts.push(app);
                    break;
            }
        });
        return { unmounts, loads, mounts };
    }
    function compose(fns) {
        fns = Array.isArray(fns) ? fns : [fns];
        return (app) => fns.reduce((p, fn) => p.then(() => fn(app)), Promise.resolve());
    }
    function runLoad(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.loaded)
                return app.loaded;
            app.loaded = Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
                var _a;
                app.status = Status.LOADING;
                let mixinLife = mapMixin();
                app.host = yield loadShadowDOM(app);
                const { dom, lifecycles } = yield importHtml(app);
                (_a = app.host) === null || _a === void 0 ? void 0 : _a.appendChild(dom);
                app.status = Status.NOT_BOOTSTRAPPED;
                app.bootstrap = compose(mixinLife.bootstrap.concat(lifecycles.bootstrap));
                app.mount = compose(mixinLife.mount.concat(lifecycles.mount));
                app.unmount = compose(mixinLife.unmount.concat(lifecycles.unmount));
                delete app.loaded;
                return app;
            }));
            return app.loaded;
        });
    }
    function loadShadowDOM(app) {
        return new Promise((resolve, reject) => {
            class Berial extends HTMLElement {
                static get tag() {
                    return app.name;
                }
                constructor() {
                    super();
                    resolve(this.attachShadow({ mode: 'open' }));
                }
            }
            const hasDef = window.customElements.get(app.name);
            if (!hasDef) {
                customElements.define(app.name, Berial);
            }
        });
    }
    function runUnmount(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.status != Status.MOUNTED) {
                return app;
            }
            app.status = Status.UNMOUNTING;
            yield app.unmount(app);
            app.status = Status.NOT_MOUNTED;
            return app;
        });
    }
    function runBootstrap(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.status !== Status.NOT_BOOTSTRAPPED) {
                return app;
            }
            app.status = Status.BOOTSTRAPPING;
            yield app.bootstrap(app);
            app.status = Status.NOT_MOUNTED;
            return app;
        });
    }
    function runMount(app) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.status !== Status.NOT_MOUNTED) {
                return app;
            }
            app.status = Status.MOUNTING;
            yield app.mount(app);
            app.status = Status.MOUNTED;
            return app;
        });
    }
    function hack() {
        window.addEventListener = hackEventListener(window.addEventListener);
        window.removeEventListener = hackEventListener(window.removeEventListener);
        window.history.pushState = hackHistory(window.history.pushState);
        window.history.replaceState = hackHistory(window.history.replaceState);
        window.addEventListener('hashchange', reroute);
        window.addEventListener('popstate', reroute);
    }
    const captured = {
        hashchange: [],
        popstate: []
    };
    function hackEventListener(func) {
        return function (name, fn) {
            if (name === 'hashchange' || name === 'popstate') {
                if (!captured[name].some((l) => l == fn)) {
                    captured[name].push(fn);
                    return;
                }
                else {
                    captured[name] = captured[name].filter((l) => l !== fn);
                    return;
                }
            }
            return func.apply(this, arguments);
        };
    }
    function hackHistory(fn) {
        return function () {
            const before = window.location.href;
            fn.apply(window.history, arguments);
            const after = window.location.href;
            if (before !== after) {
                new PopStateEvent('popstate');
                reroute();
            }
        };
    }

    exports.importHtml = importHtml;
    exports.mixin = mixin;
    exports.register = register;
    exports.runScript = runScript;
    exports.use = use;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=berial.js.map
