import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const cookie = require('cookie')

export const parse = cookie.parse
export const serialize = cookie.serialize
export const parseCookie = cookie.parseCookie
export const stringifyCookie = cookie.stringifyCookie
export const stringifySetCookie = cookie.stringifySetCookie
export const parseSetCookie = cookie.parseSetCookie
