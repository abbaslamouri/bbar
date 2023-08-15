import { H3Event } from 'h3'
import { logError } from '~/server/factory'

export default async (event: H3Event, err: any) => {
  console.log(`ERR NAME --${err.name}--`)
  console.log(`ERR CODE --${err.errorCode}--`)
  console.log('RESPONSE', `${err.response}--`)
  console.log(err)

  let messages = []
  let statusCode = 500
  let errorCode = ''

  if (err.name === 'TokenExpiredError') {
    messages.push('Your token has expired.')
    statusCode = 400
    errorCode = 'expired_token'
  } else if (err.name === 'JsonWebTokenError') {
    messages.push('Invalid token.')
    statusCode = 400
    errorCode = 'invalidToken'
  }

  // Sendgrid email error
  else if (Array.isArray(err?.response?.body?.errors)) {
    err.name = 'SendgridError'
    statusCode = err.code
    errorCode = 'emailDeliveryError'
    for (const item of err.response.body.errors) {
      messages.push(item.message)
    }
  }

  // Mongo Bson error
  else if (err.name === 'BSONError') {
    // err.name = '--BSONError--'
    statusCode = 400
    errorCode = 'BSONError'

    messages.push(err.message)

    // Mongo error
  } else if (err.name === 'MongoServerError' || err.name === 'MongoBulkWriteError') {
    statusCode = 400
    // Duplicate entries
    if (err.code === 11000) {
      if (err.keyValue) {
        // messages.push(
        //   `${Object.values(err.keyValue)[0]} already exists, please select a different ${Object.keys(err.keyValue)[0]}.`
        // )
        messages.push(`${Object.values(err.keyValue)[0]} already exists.`)
      } else {
        messages.push(err.message)
      }

      errorCode = 'NotUnique'
    }

    // Required entries
    if (err.code == 121) {
      const writeErrors = err.writeErrors
      if (writeErrors && writeErrors.length) {
        for (const writeError of writeErrors) {
          const schemaRulesNotSatisfied = writeError.err.errInfo.details.schemaRulesNotSatisfied
          for (const property of schemaRulesNotSatisfied) {
            if (property.missingProperties) {
              messages.push(`${property.missingProperties.join(',')} are required`)
            } else if (property.propertiesNotSatisfied) {
              const propertiesNotSatisfied = property.propertiesNotSatisfied || []
              for (const prop of propertiesNotSatisfied) {
                const details = prop.details || []
                for (const detail of details) {
                  messages.push(
                    `${prop.propertyName} ${detail.consideredValue} ${detail.reason} ${
                      detail.operatorName
                    } specified as ${JSON.stringify(detail.specifiedAs)}`
                  )
                }
              }
            }
          }
        }
      } else {
        const schemaRulesNotSatisfied = err.errInfo.details.schemaRulesNotSatisfied
        if (schemaRulesNotSatisfied && schemaRulesNotSatisfied.length) {
          for (const i in schemaRulesNotSatisfied) {
            console.log('GGGGG', schemaRulesNotSatisfied[i])
            const propertiesNotSatisfied = schemaRulesNotSatisfied[i].propertiesNotSatisfied
            if (propertiesNotSatisfied) {
              errorCode = 'propertyNotSatisfied'
              for (const j in propertiesNotSatisfied) {
                console.log('LLLL', propertiesNotSatisfied[j])
                const details = propertiesNotSatisfied[j].details
                for (const k in details) {
                  messages.push(
                    `${propertiesNotSatisfied[j].propertyName} specified as ${details[k].operatorName}: ${
                      details[k].specifiedAs[details[k].operatorName]
                    } has a value of ${details[k].consideredValue}.`
                  )
                }
              }
            }
            if (schemaRulesNotSatisfied[i].missingProperties) {
              for (const j in schemaRulesNotSatisfied[i].missingProperties) {
                messages.push(`${schemaRulesNotSatisfied[i].missingProperties[j]} is required`)
              }
            }
          }
        }
      }
    }
  } else {
    messages.push(err.message)
    statusCode = err.statusCode
    errorCode = err.errorCode
  }

  const data = {
    name: err.name,
    errorCode,
    messages,
    code: err.code ? err.code : 0,
    dateCreated: new Date(Date.now()),
  }
  // console.log('DDDDDDDDDDDDDD', data)
  await logError(data)

  return sendError(
    event,
    createError({
      statusCode: statusCode,
      statusMessage: messages.join('|'),
      data: { ...err, ...data },
    })
  )
}
