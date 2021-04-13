const STATES = {
  COMMENT: Symbol(),
  TAG_START: Symbol(),
  TAG_ATTRIBUTES: Symbol(),
  TAG_END: Symbol(),
  TEXT: Symbol(),
  NEXT: Symbol()
}

const stateHandlerMap = [
  [STATES.TEXT, lexText],
  [STATES.COMMENT, lexComment],
  [STATES.TAG_START, lexTagStart],
  [STATES.TAG_ATTRIBUTES, lexTagAttributes],
  [STATES.TAG_END, lexTagEnd],
  [STATES.NEXT, lexNext]
].reduce((map, [key, value]) => {
  map.set(key, value)
  return map
}, new Map())

const tagOrCommentStartRE = /<\/?(?:[A-Za-z]+\w*)|<!--/

module.exports = function lex(input) {
  input = input.replace(/[\r\n]/g, '')

  let context = {
      input,
      current: 0 ,
      curTagToken: null,
      tokens: [],
      emitToken (type, value) {
          context.tokens.push(typeof type === 'object' ? type: {type, value})
          context.curTag = null
      }
  }

  stateMachine(context, STATES.NEXT)

  return context.tokens
}

function stateMachine(context, state) {
  while(context.current < context.input.length) {
      state = stateHandlerMap.get(state)(context)
  }
}

function lexNext(context) {
  let { current, input } = context
  if (input.charAt(current) !== '<') {
      return STATES.TEXT
  } else if (input.substr(current, 4) === '<!--') {
      return STATES.COMMENT
  }
  return STATES.TAG_START
}

function lexText(context){
  let { input, current, emitToken } = context
  let len = input.length
  let endOfText = input.substring(current).search(tagOrCommentStartRE)
  if (endOfText === -1) { // 纯文字
      emitToken('text', input.slice(conrrent))
      current = len
  } else if (endOfText !== 0) {
      endOfText += current
      let value = input.slice(current, endOfText).trim()
      if (value.length > 0) {
          emitToken('text', value)
      }
      current = endOfText
  }
  context.current = current
  return STATES.NEXT
}

function lexComment(context){
  let { input, current, emitToken } = context
  let len = input.length
  current += 4
  let endOfComment = input.indexOf('-->', current)
  if (endOfComment === -1) {
      emitToken('comment', input.slice(current))
      current = len
  } else {
      emitToken('comment', input.slice(current, endOfComment))
      current = endOfComment + 3
  }
  context.current = current
  return STATES.NEXT
}

function lexTagStart(context){
  let { input, current } = context
  let isCloseStart = input.charAt(current + 1) === '/'
  current = current + (isCloseStart ? 2 : 1)

  let tagName = ''
  while (current < input.length) {
      let char = input.charAt(current)
      if (char === '/' || char === '>' || char === ' ') {
          break
      } else {
          tagName += char
      }
      current++
  }
  context.curTagToken = {
      type: 'tag',
      value: tagName,
      closeStart: isCloseStart
  }
  context.current = current
  return STATES.TAG_ATTRIBUTES
}

function lexTagAttributes(context) {
  let { input, current, curTagToken } = context
  let len = input.length
  let char = input.charAt(current)
  let nextChar = input.charAt(current + 1)

  function next() {
      current++
      char = input.charAt(current)
      nextChar = input.charAt(current + 1)
  }

  let attributes = {}

  while (current < len) {
      if (char === '>' || (char === '/' && nextChar === '>')) {
          break
      }
      if (char === ' ') {
          next()
          continue
      }
      let name = ''
      let noValue = false
      while (current < len && char !== '=') {
          if (char === ' ' || char === '>' || (char === '/' && nextChar === '>')) {
              noValue = true
              break
          } else {
              name += char
          }
          next()
      }

      let value = ''
      if (noValue) {
          attributes[name] = value
          continue
      }
      next()
      let quoteType = ' '
      if (char === "'" || char === "\"") {
          quoteType = char
          next()
      }
      while (current < len && char !== quoteType) {
          value += char
          next()
      }
      next()
      attributes[name] = value
  }
  curTagToken.attributes = attributes
  context.current = current
  return STATES.TAG_END
}

function lexTagEnd(context) {
  let { input, current, curTagToken, emitToken } = context
  let isCloseEnd = input.charAt(current) === '/'
  current += (isCloseEnd ? 2 : 1)

  if (isCloseEnd) {
      curTagToken.closeEnd = isCloseEnd
  }

  emitToken(curTagToken)
  context.current = current
  return STATES.NEXT
}
