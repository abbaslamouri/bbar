// import { logError } from '~/server/factory';
import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { FilterXSS } from 'xss'

import { logError } from '../../../../../server/factory'
import { createCsrfToken, verifyCsrfToken } from '#csrf'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  // let secret = getCookie(event, config.csrf.cookieName)
  // // Create secret if it does not exist
  // if (!secret) {
  //   secret = randomUUID()
  //   setCookie(event, config.csrf.cookieName, secret, config.csrf.cookieOpts)
  // }
  // // Encrypt secret
  // Object.defineProperty(event.node.res, '_csrfToken', {
  //   value: createCsrfToken(secret),
  //   enumerable: true,
  // })
  // const headerCsrfToken = getHeader(event, 'csrfToken') ?? ''
  // // console.log('HHHHHHH', headerCsrfToken)
  // const body = event.node.req.method !== 'GET' ? await readBody(event) : null
  // // console.log('BBBBBBBB', body)
  // if (body) {
  //   // console.log('BODY')
  //   if (!body.csrfToken || !verifyCsrfToken(secret, body.csrfToken)) {
  //     const data = {
  //       name: 'CustomCsrfError',
  //       code: 0,
  //       messages: ['bad request'],
  //       errorCode: 'BodyCsrfError',
  //       dateCreated: new Date(Date.now()),
  //     }
  //     throw createError({
  //       statusCode: 403,
  //       name: 'CSRFError',
  //       statusMessage: 'Bad request',
  //       data,
  //     })
  //   }
  //   if (headerCsrfToken && !verifyCsrfToken(secret, headerCsrfToken))
  //     throw createError({
  //       statusCode: 403,
  //       name: 'CSRFError',
  //       statusMessage: 'Bad request',
  //       data: { name: 'CustomCsrfError', code: 0, messages: ['bad request'], errorCode: 'HeaderCsrfError' },
  //     })
  // }
  // Sanitise request body
  // const xxsValidator = new FilterXSS(config.csrf.xss)
  // if (body && JSON.stringify(body) !== xxsValidator.process(JSON.stringify(body))) {
  //   // console.log('??????????')
  //   throw createError({
  //     statusCode: 403,
  //     name: 'XssError',
  //     statusMessage: 'Bad request',
  //     data: { name: 'CustomXssError', code: 0, messages: ['bad requestsssss'], errorCode: 'XssError' },
  //   })
  // }
})
