window.remotes = {
  View: (props) => fre.h("div", props),
  ScrollView: (props) => {
    const target = window.remotes.host
    fre.useEffect(() => {
      setTimeout(() => {
        const node = target.getElementById("wraper")
        new JRoll(node)
      }, 20)
    }, [])
    return fre.h(
      "div",
      {
        id: "wraper",
        style: {
          height: "100vh",
          width: "100vw",
        },
      },
      fre.h("div", props)
    )
  },
  Button: (props) => {
    const { type = "primary", size = "default", disabled } = props
    const target = window.remotes.host
    const styled = goober.styled.bind({ target: target })
    const Button = styled("button")`
      background: ${type === "primary"
        ? "var(--primary-color)"
        : type === "default"
        ? "var(--default-color)"
        : "var(--warn-color)"};
      color: ${type === "default" ? "#2577e3" : "#fff"};
      border: 1px solid;
      border-color: ${type === "primary"
        ? "var(--primary-border-color)"
        : type === "default"
        ? "var(--default-border-color)"
        : "var(--warn-border-color)"};
      width: ${size === "default" ? "184px" : "auto"};
      opacity: ${disabled ? 0.5 : 1};
      text-align: center;
      border-radius: 2px;
      padding: 8px ${size === "mini" ? "24px" : "0"};
      margin: 10px;
      font-size: 16px;
      font-weight: bold;
    `
    return fre.h(Button, props)
  },
  Text: (props) => {
    const userSelect = props["user-select"]
    return fre.h("span", {
      style: {
        display: userSelect ? "inline-block" : "inline",
      },
      ...props,
    })
  },
  Input: (props) => {
    props.type = "text"
    props.style = {
      width: "90%",
      border: " 0px",
      padding: " 5px",
      "box-sizing": " border-box",
      outline: " none",
      "border-radius": "2px",
    }
    return fre.h("input", props)
  },
  Image: (props) => fre.h("img", props),
  Navigator: (props) => {
    props.onclick = (e) => {
      e.preventDefault()
      window.history.pushState(null, null, props.url)
    }
    return fre.h("a", props)
  },
  Textarea: (props) => fre.h("textarea", props),
  Form: (props) => fre.h("form", props),
  Icon: (props) => {
    const target = window.remotes.host
    fre.useEffect(() => {
      if (target.lastChild.nodeName !== "LINK") {
        let link = document.createElement("link")
        link.setAttribute(
          "href",
          "//at.alicdn.com/t/font_2365862_1fzp0ur9aqn.css"
        )
        link.setAttribute("rel", "stylesheet")
        target.appendChild(link)
      }
    }, [])
    props.class = `iconfont icon-${props.type}`
    props.style = {
      color: "var(--default-border-color)",
    }
    return fre.h("i", props)
  },
  Checkbox: (props) => {
    props.type = "checkbox"

    const target = window.remotes.host
    const styled = goober.styled.bind({ target: target })
    const Checkbox = styled("input")`
      outline: none;
      width: 20px;
      height: 20px;
      background-color: var(--defalut-border-color);
      border: 2px solid var(--default-border-color);
      box-shadow: inset 0 0 0 4px var(--default-color);
      border-radius: 5px;
      display: inline-block;
      -webkit-appearance: none;
      -moz-appearance: none;
      transition: all 0.2s ease;
      position: relative;
      &:checked {
        border: 2px solid var(--primary-color);
        background-color: var(--primary-color);
      }
    `
    return fre.h(Checkbox, props)
  },
  Switch: (props) => {
    props.type = "checkbox"

    const target = window.remotes.host
    const styled = goober.styled.bind({ target: target })
    const Switch = styled("input")`
        outline: none;
        width: 60px;
        height: 26px;
        background-color: var(--default-color);
        border-radius: 36px;
        border: none;
        -webkit-appearance: none;
        -moz-appearance:none;
        transition: all .2s ease;
        cursor: pointer;
        position: relative;
        box-shadow: 1px 1px 2px #eaecef inset;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
        &:before{
          content:'';
          position: absolute;
          top: -5px;
          transform: translateX(0);
          width: 36px;
          height: 36px;
          background:#fff;
          border-radius: 50%;
          transition: all .2s ease;
          display: inline-block;
          text-align: center;
          line-height: 36px;
          box-shadow: 2px 0px 2px #d4dae4;
        }
        &:checked{
          background-color: var(--primary-color);
          box-shadow: 1px 1px 2px #1d67dd inset;
        }
        &:checked:before{
          transform: translateX(24px);
        }
        &:focus{
          outline: none;
        }`
    return fre.h(Switch, props)
  },
  Radio: (props) => {
    props.type = "checkbox"

    const target = window.remotes.host
    const styled = goober.styled.bind({ target: target })
    const Radio = styled("input")`
      outline: none;
      width: 20px;
      height: 20px;
      background-color: var(--defalut-border-color);
      border: 2px solid var(--default-border-color);
      box-shadow: inset 0 0 0 4px var(--default-color);
      border-radius: 50%;
      display: inline-block;
      -webkit-appearance: none;
      -moz-appearance: none;
      transition: all 0.2s ease;
      position: relative;
      &:checked {
        border: 2px solid var(--primary-color);
        background-color: var(--primary-color);
      }
    `
    return fre.h(Radio, props)
  },
  Slider: (props, dom = null) => {
    const [range, setRange] = fre.useState(50)
    const r = fre.useRef(null)
    props.type = "range"
    props.onchange = (e) => {
      const width = r.current.clientWidth
      const px = (e.target.value / 100) * width
      const p = (px / width) * 100
      setRange(p)
      props.bindchange && props.bindchange(e)
    }
    props.onMousemove = (e) => {
      props.bindchanging && props.bindchanging(e)
    }
    props.value = range

    delete props.bindchange
    delete props.bindchanging

    const target = window.remotes.host
    const styled = goober.styled.bind({ target: target })
    const Slider = styled("input")`
      outline: none;
      width: 90%;
      background-image: linear-gradient(
        to right,
        var(--primary-border-color) ${range}%,
        var(--default-border-color) 0%
      );
      border-radius: 50%;
      -webkit-appearance: none;
      -moz-appearance: none;
      transition: all 0.2s ease;
      position: relative;
      height: 2px;
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        cursor: default;
        height: 20px;
        width: 20px;
        transform: translateY(0px);
        border-radius: 50%;
        box-shadow: 2px 0px 2px #d4dae4;
        background: #fff;
      }
    `
    return fre.h(Slider, {
      ...props,
      ref: r,
    })
  },
  Loading: (props) => {
    const styled = goober.styled.bind({ target: window.remotes.host })
    const Loading = styled("section")`
      width: 20px;
      height: 20px;
      animation: loading 1s steps(60, end) infinite;
      position: relative;
      display: inline-flex;
      color: var(--primary-border-color);
      &:before {
        content: "";
        display: block;
        width: 10px;
        height: 20px;
        box-sizing: border-box;
        border: 2px solid;
        border-right-width: 0;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        -webkit-mask-image: -webkit-linear-gradient(
          top,
          #000000 8%,
          rgba(0, 0, 0, 0.3) 95%
        );
      }
      &:after {
        content: "";
        display: block;
        width: 10px;
        height: 20px;
        box-sizing: border-box;
        border: 2px solid;
        border-left-width: 0;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        -webkit-mask-image: -webkit-linear-gradient(
          225deg,
          rgba(0, 0, 0, 0) 45%,
          rgba(0, 0, 0, 0.3) 95%
        );
      }
      @keyframes loading {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `
    return fre.h(Loading, props)
  },
  Toast: (props) => {
    const styled = goober.styled
    const Toast = styled("section")`
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 5px 30px;
      border-radius: 2px;
      transition: 2s;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
    `
    props.id = "modal"
    return fre.h(Toast, props, props.title)
  },
  Modal: (props) => {
    const styled = goober.styled
    const Div = styled("div")`
      width: 70%;
      background: #fff;
      color: #333;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 10px;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
    `
    const Content = styled("div")`
      padding: 20px;
      font-weight: lighter;
    `
    const Ul = styled("ul")`
      display: flex;
      border-top: 1px solid var(--default-border-color);
      padding: 0;
      margin: 0;
    `
    const Li = styled("li")`
      flex: 1;
      text-align: center;
      padding: 15px 0;
      list-style: none;
      &:nth-child(1) {
        color: var(--link-color);
      }
      &:nth-child(2) {
        border-left: 1px solid var(--default-border-color);
      }
    `
    const confirm = (e) => {
      props.success && props.success({ confirm: true })
      document.body.removeChild(props.dom)
    }
    const cancel = (e) => {
      props.success && props.success({ cancel: true })
      document.body.removeChild(props.dom)
    }
    return fre.h(
      Div,
      props,
      fre.h(Content, null, props.content),
      fre.h(
        Ul,
        null,
        fre.h(
          Li,
          {
            onclick: cancel,
          },
          props.cancelText
        ),
        fre.h(
          Li,
          {
            onclick: confirm,
          },
          props.confirmText
        )
      )
    )
  },
  Picker: (props) => fre.h("section", props),
  Block(props) {
    return props.children
  },
}
