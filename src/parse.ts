
type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONObject
    | JSONValue[];

interface JSONObject {
    [x: string]: JSONValue;
}

type ParseContext = Record<string, JSONValue | undefined>

const isObject = (data: any): data is JSONObject => data !== null && typeof data === 'object'

const parse = (data: JSONValue, context: ParseContext): JSONValue => {
  if(Array.isArray(data)) {
    return data.map(v => parse(data, context))
  } else if(isObject(data)) {
    return parseObject(data, context)
  } else {
    return data
  }
}

const parseObject = (data: JSONObject, context: ParseContext): JSONObject => {
  const {$extend, ...rest} = data
  const extendedJson = typeof $extend === 'string'? context[$extend]: undefined
  if(!isObject(extendedJson)) {
    throw new Error(`wrong with extend: ${$extend}`)
  }

  


  return {...extendedJson, ...rest}
}
