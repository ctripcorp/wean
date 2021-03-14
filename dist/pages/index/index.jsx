
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
    "data-w-93b885adfe0da089cdf634904fd59f71": true
  }, fre.h(remotes.View, {
    class: "title",
    "data-w-93b885adfe0da089cdf634904fd59f71": true
  }, fre.h(remotes.Text, {
    "data-w-93b885adfe0da089cdf634904fd59f71": true
  }, "todos")), fre.h(remotes.View, {
    class: "list",
    "data-w-93b885adfe0da089cdf634904fd59f71": true
  }, fre.h(remotes.View, {
    class: "list-items",
    "data-w-93b885adfe0da089cdf634904fd59f71": true
  }, fre.h(remotes.Input, {
    onKeyDown: e => addtodo(e),
    placeholder: "What needs to be done?",
    value: name,
    id: "test",
    "data-w-93b885adfe0da089cdf634904fd59f71": true
  })), fre.h(fre.Fragment, null, directs.$for(list, item => fre.h(remotes.Block, {
    "data-w-93b885adfe0da089cdf634904fd59f71": true
  }, fre.h(remotes.UseItem, {
    item: item,
    myevent: e => clickIco(e),
    clear: e => clear(e),
    "data-w-93b885adfe0da089cdf634904fd59f71": true
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
  return fre.h(fre.Fragment, null, fre.h(remotes.View, {
    "data-w-8666683506aacd900bbd5a74ac4edf68": true
  }, fre.h(remotes.View, {
    class: "list-items",
    "data-w-8666683506aacd900bbd5a74ac4edf68": true
  }, fre.h(remotes.Icon, {
    type: item.completed ? 'success' : 'circle',
    onClick: e => clickIco(e),
    "data-id": item.id,
    "data-w-8666683506aacd900bbd5a74ac4edf68": true
  }), fre.h(remotes.Input, {
    class: `aaa ${item.completed ? 'completed' : ''}`,
    onKeyDown: e => edittodo(e),
    "data-id": item.id,
    value: item.name,
    "data-w-8666683506aacd900bbd5a74ac4edf68": true
  }), fre.h(remotes.Icon, {
    type: "clear",
    onClick: e => clear(e),
    "data-w-8666683506aacd900bbd5a74ac4edf68": true
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
    class: "list-items footer",
    "data-w-8666683506aacd900bbd5a74ac4edf68": true
  }, fre.h(remotes.Text, {
    "data-w-8666683506aacd900bbd5a74ac4edf68": true
  }, leftcount, " items left"), directs.$if(() => list.length - leftcount > 0, () => fre.h(remotes.View, {
    class: "clear",
    onClick: e => clearCompleted(e),
    "data-w-8666683506aacd900bbd5a74ac4edf68": true
  }, "clear completed"), null)));
};


    window['berial-zytpmr'] = {
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
    