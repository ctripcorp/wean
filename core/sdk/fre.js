(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.fre = {}));
  }(this, (function (exports) { 'use strict';
  
    const updateElement = (dom, oldProps, newProps) => {
        for (let name in Object.assign(Object.assign({}, oldProps), newProps)) {
            let oldValue = oldProps[name];
            let newValue = newProps[name];
            if (oldValue === newValue || name === 'children') ;
            else if (name === 'style') {
                if(isStr(newValue)){
                    dom[name] = newValue
                }else{
                    for (const k in Object.assign(Object.assign({}, oldValue), newValue)) {
                    if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
                        dom[name][k] = (newValue === null || newValue === void 0 ? '' : newValue[k]) || '';
                    }
                }
                }
                
            }
            else if (name[0] === 'o' && name[1] === 'n') {
                name = name.slice(2).toLowerCase();
                if (oldValue)
                    dom.removeEventListener(name, oldValue);
                dom.addEventListener(name, newValue);
            }
            else if (name in dom && !(dom instanceof SVGElement)) {
                dom[name] = newValue || '';
            }
            else if (newValue == null || newValue === false) {
                dom.removeAttribute(name);
            }
            else {
                dom.setAttribute(name, newValue);
            }
        }
    };
    const createElement = (fiber) => {
        const dom = fiber.type === 'text'
            ? document.createTextNode('')
            : fiber.tag & 16
                ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
                : document.createElement(fiber.type);
        updateElement(dom, {}, fiber.props);
        return dom;
    };
  
    let cursor = 0;
    const resetCursor = () => {
        cursor = 0;
    };
    const useState = (initState) => {
        return useReducer(null, initState);
    };
    const useReducer = (reducer, initState) => {
        const [hook, current] = getHook(cursor++);
        return [
            hook.length > 0 ? hook[0] : initState,
            (value) => {
                hook[0] = reducer ? reducer(hook[0], value) : value;
                dispatchUpdate(current);
            },
        ];
    };
    const useEffect = (cb, deps) => {
        return effectImpl(cb, deps, 'effect');
    };
    const useLayout = (cb, deps) => {
        return effectImpl(cb, deps, 'layout');
    };
    const effectImpl = (cb, deps, key) => {
        const [hook, current] = getHook(cursor++);
        if (isChanged(hook[1], deps)) {
            hook[0] = cb;
            hook[1] = deps;
            current.hooks[key].push(hook);
        }
    };
    const useMemo = (cb, deps) => {
        const hook = getHook(cursor++)[0];
        if (isChanged(hook[1], deps)) {
            hook[1] = deps;
            return (hook[0] = cb());
        }
        return hook[0];
    };
    const useCallback = (cb, deps) => {
        return useMemo(() => cb, deps);
    };
    const useRef = (current) => {
        return useMemo(() => ({ current }), []);
    };
    const getHook = (cursor) => {
        const current = getCurrentFiber();
        const hooks = current.hooks || (current.hooks = { list: [], effect: [], layout: [] });
        if (cursor >= hooks.list.length) {
            hooks.list.push([]);
        }
        return [hooks.list[cursor], current];
    };
    const isChanged = (a, b) => {
        return !a || a.length !== b.length || b.some((arg, index) => arg !== a[index]);
    };
  
    const queue = [];
    const threshold = 1000 / 60;
    const unit = [];
    let deadline = 0;
    const schedule = (cb) => unit.push(cb) === 1 && postMessage();
    const scheduleWork = (callback, time) => {
        const job = {
            callback,
            time,
        };
        queue.push(job);
        schedule(flushWork);
    };
    const postMessage = (() => {
        const cb = () => unit.splice(0, unit.length).forEach((c) => c());
        if (typeof MessageChannel !== 'undefined') {
            const { port1, port2 } = new MessageChannel();
            port1.onmessage = cb;
            return () => port2.postMessage(null);
        }
        return () => setTimeout(cb);
    })();
    const flushWork = () => {
        deadline = getTime() + threshold;
        let job = sortAndPeek(queue);
        while (job && !shouldYield()) {
            const callback = job.callback;
            job.callback = null;
            const next = callback();
            if (next) {
                job.callback = next;
            }
            else {
                queue.shift();
            }
            job = sortAndPeek(queue);
        }
        job && schedule(flushWork);
    };
    const shouldYield = () => {
        var _a, _b;
        return ((_b = (_a = navigator) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.isInputPending()) || getTime() >= deadline;
    };
    const getTime = () => performance.now();
    const sortAndPeek = (queue) => queue.sort((a, b) => a.time - b.time)[0];
  
    let currentFiber;
    let finish = null;
    let deletes = [];
    const render = (vnode, node, done) => {
        const rootFiber = {
            node,
            props: { children: vnode },
            done,
        };
        dispatchUpdate(rootFiber);
    };
    const dispatchUpdate = (fiber) => {
        if (fiber && !(fiber.tag & 32)) {
            fiber.tag = 2 | 32;
            fiber.sibling = null;
            scheduleWork(reconcileWork.bind(null, fiber), fiber.time);
        }
    };
    const reconcileWork = (WIP) => {
        while (WIP && !shouldYield())
            WIP = reconcile(WIP);
        if (WIP)
            return reconcileWork.bind(null, WIP);
        if (finish)
            commitWork(finish);
        return null;
    };
    const reconcile = (WIP) => {
        isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP);
        if (WIP.child)
            return WIP.child;
        while (WIP) {
            if (!finish && WIP.tag & 32) {
                finish = WIP;
                WIP.tag &= ~32;
                return null;
            }
            if (WIP.sibling)
                return WIP.sibling;
            WIP = WIP.parent;
        }
    };
    const updateHook = (WIP) => {
        if (WIP.lastProps === WIP.props)
            return;
        currentFiber = WIP;
        resetCursor();
        let start = getTime();
        let children = WIP.type(WIP.props);
        WIP.time = getTime() - start;
        if (isStr(children)) {
            children = createText(children);
        }
        reconcileChildren(WIP, children);
    };
    const getParentNode = (WIP) => {
        while ((WIP = WIP.parent)) {
            if (!isFn(WIP.type))
                return WIP.node;
        }
    };
    const updateHost = (WIP) => {
        WIP.parentNode = getParentNode(WIP);
        if (!WIP.node) {
            if (WIP.type === "svg")
                WIP.tag |= 16;
            WIP.node = createElement(WIP);
        }
        reconcileChildren(WIP, WIP.props.children);
    };
    const reconcileChildren = (WIP, children) => {
        var _a;
        let aCh = WIP.kids || [], bCh = (WIP.kids = arrayfy(children)), aHead = 0, bHead = 0, aTail = aCh.length - 1, bTail = bCh.length - 1, map = null, ch = Array(bCh.length), next = ((_a = WIP.sibling) === null || _a === void 0 ? void 0 : _a.node) ? WIP.sibling : null;
        while (aHead <= aTail && bHead <= bTail) {
            let c = null;
            if (aCh[aHead] == null) {
                aHead++;
            }
            else if (aCh[aTail] == null) {
                aTail--;
            }
            else if (same(aCh[aHead], bCh[bHead])) {
                c = bCh[bHead];
                clone(c, aCh[aHead]);
                c.tag = 2;
                ch[bHead] = c;
                aHead++;
                bHead++;
            }
            else if (same(aCh[aTail], bCh[bTail])) {
                c = bCh[bTail];
                clone(c, aCh[aTail]);
                c.tag = 2;
                ch[bTail] = c;
                aTail--;
                bTail--;
            }
            else {
                if (!map) {
                    map = new Map();
                    for (let i = aHead; i <= aTail; i++) {
                        let k = getKey(aCh[i]);
                        k && map.set(k, i);
                    }
                }
                const key = getKey(bCh[bHead]);
                if (map.has(key)) {
                    const oldKid = aCh[map.get(key)];
                    c = bCh[bHead];
                    clone(c, oldKid);
                    c.tag = 4;
                    c.after = aCh[aHead];
                    ch[bHead] = c;
                    aCh[map.get(key)] = null;
                }
                else {
                    c = bCh[bHead];
                    c.tag = 4;
                    c.node = null;
                    c.after = aCh[aHead];
                }
                bHead++;
            }
        }
        const after = bTail <= bCh.length - 1 ? ch[bTail + 1] : next;
        while (bHead <= bTail) {
            let c = bCh[bHead];
            c.tag = 4;
            c.after = after;
            c.node = null;
            bHead++;
        }
        while (aHead <= aTail) {
            let oldFiber = aCh[aHead];
            if (oldFiber) {
                oldFiber.tag = 8;
                deletes.push(oldFiber);
            }
            aHead++;
        }
        for (var i = 0, prev = null; i < bCh.length; i++) {
            const child = bCh[i];
            child.parent = WIP;
            if (i > 0) {
                prev.sibling = child;
            }
            else {
                if (WIP.tag & 16)
                    child.tag |= 16;
                WIP.child = child;
            }
            prev = child;
        }
    };
    function clone(a, b) {
        a.lastProps = b.props;
        a.node = b.node;
        a.kids = b.kids;
        a.hooks = b.hooks;
        a.ref = b.ref;
    }
    const getKey = (vdom) => (vdom == null ? vdom : vdom.key);
    const getType = (vdom) => (isFn(vdom.type) ? vdom.type.name : vdom.type);
    const commitWork = (fiber) => {
        var _a;
        fiber.parent ? commit(fiber) : commit(fiber.child);
        deletes.forEach(commit);
        (_a = fiber.done) === null || _a === void 0 ? void 0 : _a.call(fiber);
        deletes = [];
        finish = null;
    };
    function invokeHooks({ hooks, tag }) {
        if (hooks) {
            if (tag & 8) {
                hooks.list.forEach(cleanup);
            }
            else {
                side(hooks.layout);
                schedule(() => side(hooks.effect));
            }
        }
    }
    function getKid(fiber) {
        let kid = fiber;
        while (isFn(kid.type))
            kid = kid.child;
        kid.after = fiber.after;
        kid.tag |= fiber.tag;
        let s = kid.sibling;
        while (s) {
            s.after = fiber.after;
            s.tag |= fiber.tag;
            s = s.sibling;
        }
        return kid;
    }
    const commit = (fiber) => {
        var _a;
        if (!fiber)
            return;
        let { type, tag, parentNode, node, ref } = fiber;
        if (isFn(type)) {
            invokeHooks(fiber);
            let kid = getKid(fiber);
            fiber.node = kid.node;
            if (fiber.tag & 8) {
                kid.tag = 8;
                commit(kid);
                let s = kid.sibling;
                while (s) {
                    s.tag = 8;
                    commit(s);
                    s = s.slibing;
                }
            }
            else {
                commit(fiber.child);
                commit(fiber.sibling);
            }
            fiber.tag = 0;
            return;
        }
        if (tag & 8) {
            kidsRefer(fiber.kids);
            parentNode.removeChild(fiber.node);
            refer(ref, null);
            fiber.tag = 0;
            return;
        }
        if (tag & 2) {
            updateElement(node, fiber.lastProps || {}, fiber.props);
        }
        if (tag & 4) {
            parentNode.insertBefore(fiber.node, (_a = fiber.after) === null || _a === void 0 ? void 0 : _a.node);
        }
        fiber.tag = 0;
        refer(ref, node);
        commit(fiber.child);
        commit(fiber.sibling);
    };
    const same = (a, b) => {
        return getKey(a) === getKey(b) && getType(a) === getType(b);
    };
    const arrayfy = (arr) => (!arr ? [] : isArr(arr) ? arr : [arr]);
    const refer = (ref, dom) => {
        if (ref)
            isFn(ref) ? ref(dom) : (ref.current = dom);
    };
    const kidsRefer = (kids) => {
        kids.forEach((kid) => {
            kid.kids && kidsRefer(kid.kids);
            refer(kid.ref, null);
        });
    };
    const side = (effects) => {
        effects.forEach(cleanup);
        effects.forEach(effect);
        effects.length = 0;
    };
    const getCurrentFiber = () => currentFiber || null;
    const effect = (e) => (e[2] = e[0]());
    const cleanup = (e) => e[2] && e[2]();
    const isFn = (x) => typeof x === "function";
    const isStr = (s) => typeof s === "number" || typeof s === "string";
    const some = (v) => v != null && v !== false && v !== true;
  
    const h = function (type, attrs) {
        const props = attrs || {};
        const key = props.key || null;
        const ref = props.ref || null;
        let children = [];
        let simple = '';
        const len = arguments.length;
        for (let i = 2; i < len; i++) {
            let child = arguments[i];
            const end = i === len - 1;
            const vnode = some(child) ? child : '';
            const str = isStr(vnode);
            if (str)
                simple += String(vnode);
            if (simple && (!str || end)) {
                children.push(createText(simple));
                simple = '';
            }
            if (!str)
                children.push(vnode);
            while (children.some((v) => isArr(v))) {
                children = [].concat(...children);
            }
        }
        if (children.length) {
            props.children = children.length === 1 ? children[0] : children;
        }
        delete props.key;
        return { type, props, key, ref };
    };
    function createText(vnode) {
        return { type: 'text', props: { nodeValue: vnode } };
    }
    function Fragment(props) {
        return props.children;
    }
    const isArr = Array.isArray;
  
    const options = {};
  
    exports.Fragment = Fragment;
    exports.h = h;
    exports.options = options;
    exports.render = render;
    exports.shouldYield = shouldYield;
    exports.useCallback = useCallback;
    exports.useEffect = useEffect;
    exports.useLayout = useLayout;
    exports.useLayoutEffect = useLayout;
    exports.useMemo = useMemo;
    exports.useReducer = useReducer;
    exports.useRef = useRef;
    exports.useState = useState;
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  })));