
    (function({C,directs,wx}, remotes) {
      const $3 = props => {
  fre.useEffect(() => {
    const params = window.getUrl(window.location.href);
    onLoad && onLoad(params);
    return onUnload && onUnload(params);
  }, []);
  const {
    data: {
      leftcount,
      name,
      item,
      list
    },
    onLoad,
    onUnload,
    addtodo,
    clickIco,
    clear
  } = usePage(fre.useState({})[1], props);
  return fre.h(fre.Fragment, null, fre.h(remotes.View, {
    class: "container",
    style: 'padding-top:' + leftcount,
    "data-w-866668": true
  }, fre.h(remotes.View, {
    class: "title",
    "data-w-866668": true
  }, fre.h(remotes.Text, null, "todos")), fre.h(remotes.View, {
    class: "list",
    "data-w-866668": true
  }, fre.h(remotes.View, {
    class: "list-items",
    "data-w-866668": true
  }, fre.h(remotes.Input, {
    onKeyDown: e => addtodo(e),
    placeholder: "What needs to be done?",
    value: name,
    id: "test"
  })), fre.h(fre.Fragment, null, directs.$for(list, item => fre.h(remotes.Block, null, fre.h(remotes.UseItem, {
    item: item,
    myevent: e => clickIco(e),
    clear: e => clear(e)
  })), null)), directs.$ensure("$3$template$footer"))));
};

remotes['UseItem'] = props => {
  fre.useEffect(() => {
    const params = window.getUrl(window.location.href);
    onLoad && onLoad(params);
    return onUnload && onUnload(params);
  }, []);
  const {
    properties: {
      item
    },
    methods: {
      clickIco,
      edittodo,
      clear
    },
    onLoad,
    onUnload
  } = useComponent(fre.useState({})[1], props, 'use-item');
  return fre.h(fre.Fragment, null, fre.h(remotes.View, null, fre.h(remotes.View, {
    class: "list-items",
    "data-w-5e732a": true
  }, fre.h(remotes.Icon, {
    type: item.completed ? 'success' : 'circle',
    onClick: e => clickIco(e),
    "data-id": item.id
  }), fre.h(remotes.Input, {
    class: `aaa ${item.completed ? 'completed' : ''}`,
    onKeyDown: e => edittodo(e),
    "data-id": item.id,
    value: item.name,
    "data-w-5e732a": true
  }), fre.h(remotes.Icon, {
    type: "clear",
    onClick: e => clear(e)
  }))));
};

remotes['$3$template$footer'] = props => {
  const {
    data: {
      leftcount,
      list
    },
    onLoad,
    onUnload,
    clearCompleted
  } = usePage(null, props);
  return fre.h(fre.Fragment, null, directs.$ensure(null), fre.h(remotes.View, {
    class: "footer",
    "data-w-866668": true
  }, fre.h(remotes.Text, null, leftcount, " items left"), directs.$if(() => list.length - leftcount > 0, () => fre.h(remotes.View, {
    class: "clear",
    onClick: e => clearCompleted(e),
    "data-w-866668": true
  }, "clear completed"), null)));
};


    window['berial-wswpeb'] = {
      async bootstrap({host}){
        const div = document.createElement('div');
        div.id = "root";
        host.appendChild(div)
      },
      async mount({host}){
        window.remotes.host = host;
        fre.render(fre.h('div',{},fre.h($3)),host.getElementById("root"));
      },
      async unmount({host}){
        host.getElementById("root").innerHTML = ""
      }
    }
    
    })(window,window.remotes);
    