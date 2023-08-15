import { storage, fetchUserSession, decryptToken } from '#auth'
import { FilterXSS } from 'xss'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const userSession = await fetchUserSession(event)
  if (userSession && !(userSession instanceof Error)) {
    const user = (userSession as Storage)?.user
    Object.defineProperty(event.node.res, '_userSession', {
      value: {
        userName: user?.name,
        authenticated: true,
        sessionId: (userSession as Storage)?.sessionId,
      },
      enumerable: true,
    })

    if (!event.node.req.url?.includes('api/v')) return

    const sessionIdHeader = getHeader(event, 'sessionId')

    if (sessionIdHeader === (userSession as Storage)?.sessionId) event.context.user = user
    if (event.node.req.method === 'POST' || event.node.req.method === 'PUT') {
      const body = await readBody(event)
      console.log('BBBBBBB', body)
      if (body?.sessionId !== (userSession as Storage)?.sessionId) {
        event.context.user = null
      } else {
        // Sanitise request body
        const xxsValidator = new FilterXSS(config.csrf.xss)
        if (JSON.stringify(body) !== xxsValidator.process(JSON.stringify(body))) {
          throw createError({
            statusCode: 403,
            name: 'XssError',
            statusMessage: 'Bad request',
            data: { name: 'CustomXssError', code: 0, messages: ['bad request'], errorCode: 'XssError' },
          })
        }
      }
    }
    // event.context.sessionToken = body?.sessionToken && decryptToken(event, body.sessionToken) ? 'verified' : null
  }

  // console.log('UserSession', userSession)

  // const config = useRuntimeConfig()

  // const session = await getSession(event, {
  //   name: config.auth.session.name,
  //   password: config.auth.session.password,
  //   maxAge: config.auth.session.maxAge,
  // })

  // console.log('Session', session.id)

  // if (session.id) {
  //   const userSession = (await storage.hasItem(session.id as string))
  //     ? await storage.getItem(session.id as string)
  //     : null

  //   console.log('UserSession', userSession)

  // Retreive session token from bofy if request is other than get
  // const body = event.node.req.method !== 'GET' ? await readBody(event) : null
  // event.context.sessionToken = body?.sessionToken && decryptToken(event, body.sessionToken) ? 'verified' : null

  // console.log('BBBBBB', body)
  // console.log('CCCCCCCC', event.context.sessionToken)
})
