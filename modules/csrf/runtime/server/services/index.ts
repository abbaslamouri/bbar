import { createStorage } from 'unstorage'
import mongodbDriver from 'unstorage/drivers/mongodb'
import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { QueryValue } from 'ufo'

const config = useRuntimeConfig()
const secrefBuffer = Buffer.from(config.csrf.encryptSecret)

// export const storage = createStorage({
//   driver: mongodbDriver({
//     connectionString: config.dbUrl,
//     databaseName: 'acs',
//     collectionName: 'sessions',
//   }),
// })

export const createCsrfToken = (secret: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(config.csrf.encryptAlgorithm, secrefBuffer, iv)
  const encrypted = cipher.update(secret, 'utf8', 'base64') + cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

export const verifyCsrfToken = (secret: string, token: QueryValue) => {
  const [iv, encrypted] = (token as string).split(':')
  if (!iv || !encrypted) {
    return false
  }
  let decrypted
  try {
    const decipher = createDecipheriv(config.csrf.encryptAlgorithm, secrefBuffer, Buffer.from(iv, 'base64'))
    decrypted = decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
    return decrypted === secret
  } catch (error) {
    return false
  }
}
