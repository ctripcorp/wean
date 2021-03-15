// https://drafts.csswg.org/css-animations-1/#typedef-single-animation

// time: s | ms
const timeReg = /^[-\d\.]+(s|ms)$/
function isTime(p) {
  return timeReg.test(p)
}

// single-animation-iteration-count: infinite | <number>
const numberReg = /^[-\d\.]+$/
function isIterationCount(p) {
  return p === 'infinite' || numberReg.test(p)
}

// single-animation-play-state: running | paused
function isPlayState(p) {
  return p === 'running' || p === 'paused'
}

// time-function: ease | ease-in | ease-out | ease-in-out | linear |  step-start | step-end | cubic-bezier() | steps()
function isTimeFunction(p) {
  if (Array.isArray(p)) return true
  switch (p) {
    case 'ease':
    case 'ease-in':
    case 'ease-out':
    case 'ease-in-out':
    case 'linear':
    case 'step-start':
    case 'step-end':
    case 'cubic-bezier':
    case 'steps':
      return true
    default:
      return false
  }
}

// single-animation-direction: normal | reverse | alternate | alternate-reverse
function isDirection(p) {
  switch (p) {
    case 'normal':
    case 'reverse':
    case 'alternate':
    case 'alternate-reverse':
      return true
    default:
      return false
  }
}

// single-animation-fill-mode: none | forwards | backwards | both
function isFillMode(p) {
  switch (p) {
    case 'none':
    case 'forwards':
    case 'backwards':
    case 'both':
      return true
    default:
      return false
  }
}

// https://developer.mozilla.org/zh-CN/docs/Web/CSS/custom-ident#%E8%AF%AD%E6%B3%95
const symbols = /[,'"\(\)!]/
function isLegalName(p) {
  if (symbols.test(p)) return false
  switch (p) {
    case 'unset':
    case 'initial':
    case 'inherit':
    case 'none':
      return false
    default:
      return true
  }
}

// none | keyframes-name: <custom-ident> | <string>
function isAnimationName(p) {
  if (
    !(
      isTime(p) ||
      isPlayState(p) ||
      isIterationCount(p) ||
      isFillMode(p) ||
      isDirection(p) ||
      isTimeFunction(p)
    )
  ) {
    return isLegalName(p)
  }
  return false
}

function tokenizer(input) {
  let buf = ''
  const tokens = []
  const push = () => {
    buf && tokens.push(buf)
    buf = ''
  }

  for (const char of input) {
    if (char === ',' || char === ')' || char === '') {
      push()
      buf += char
      push()
    } else if (char === '(') {
      push()
      if (tokens[tokens.length - 1] === ' ') {
        console.error(`[Wepack warn]: Invalid property value: "${input}"`)
        return false
      }
      buf += char
      push()
    } else if (char === ' ') {
      push()
      if (tokens[tokens.length - 1] !== ' ') {
        tokens.push(' ')
      }
    } else {
      buf += char
    }
  }
  push()
  return tokens
}

function parser(tokens) {
  let mode = 1 // 1 | 2 | 3
  let scope = []
  let stash = false
  const parent = []
  scope[0] = parent

  const up = () => {
    scope[0].push(scope)
    scope = scope[0]
  }

  const down = () => {
    const ns = []
    ns[0] = scope
    scope = ns
  }

  const parallel = () => {
    scope[0].push(scope)
    scope = []
    scope[0] = parent
  }

  const toThreeMode = (t) => {
    mode = 3
    down()
    scope.push(t)
  }

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (mode === 1) {
      if (t === ',') {
        mode = 2
        stash = false
        scope.push(t)
      } else if (t === '(') {
        toThreeMode(t)
      } else if (t === ' ') {
        stash = true
      } else {
        stash && parallel()
        stash = false
        scope.push(t)
      }
    } else if (mode === 2) {
      if (t === '(') {
        toThreeMode(t)
      } else if (t === ' ') {
        if (tokens[i - 1] !== ',') {
          mode = 1
          stash = true
        }
      } else {
        scope.push(t)
      }
    } else if (mode === 3) {
      if (t === ')') {
        mode = 2
        scope.push(t)
        up()
      } else {
        scope.push(t)
      }
    }
  }
  parallel()
  return parent
}

// https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation#%E8%AF%AD%E6%B3%95
function stringify(tree, scope) {
  let output = ''
  const splice = (p) => isAnimationName(p) ? `${scope}${p}` : p

  const child = (ps) => {
    let buf = ''
    for (let i = 1; i < ps.length; i++) {
      buf += ps[i]
    }
    return buf
  }

  tree.forEach((ps) => {
    if (ps.length === 2) {
      output += (
        Array.isArray(ps[1])
          ? child(ps[1])
          : splice(ps[1])
      ) + ' '
    } else {
      for (let i = 1; i < ps.length; i++) {
        const next = ps[i + 1]
        const nextIsArray = Array.isArray(next)
        let cur = Array.isArray(ps[i])
          ? child(ps[i])
          : nextIsArray
            ? ps[i]
            : splice(ps[i])

        if (next === ',' || next === '') {
          // Nothing to do
        } else if (nextIsArray) {
          const fillUp = ps[i + 2] === ',' ? '' : ' '
          cur += `${child(next)}${fillUp}`
          i++
        } else {
          cur += ' '
        }
        output += cur
      }
    }
  })
  return output.trim()
}

module.exports = function(input, scope) {
  const tokens = tokenizer(input)
  if (tokens === false) {
   return input
  }
  const tree = parser(tokens)
  return stringify(tree, scope)
}