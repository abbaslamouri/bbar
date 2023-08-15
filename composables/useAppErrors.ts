export const useAppErrors = () => {
  interface IFormError {
    fieldName: string
    fieldErrorMsg: string
  }

  const appFormErrors = useState('appFormErrors', (): Array<IFormError> => {
    return [] as Array<IFormError>
  })

  const appApiErrorMsgs = useState<string[]>('appErrorMsgs', () => [])

  const parseAppZodErrors = (issues: any) => {
    for (const err of issues) {
      appFormErrors.value.push({ fieldName: err.path[0] as string, fieldErrorMsg: err.message })
    }
  }

  const parseAppApiErrors = () => {
    let paersedAppApiErrorMessage = ''
    for (const msg of appApiErrorMsgs.value) {
      paersedAppApiErrorMessage += `${msg}\n`
    }
    return paersedAppApiErrorMessage
  }

  return {
    appFormErrors,
    appApiErrorMsgs,
    parseAppZodErrors,
    parseAppApiErrors,
  }
}
