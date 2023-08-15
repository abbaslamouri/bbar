import { fetchAll } from '~/server/utils/controllers'
import * as fs from 'fs'

export default defineEventHandler(async (event) => {
  try {
    return fs.readdirSync('content')
  } catch (error) {
    return errorHandler(event, error)
  }
})
