export const useCsrfStore = () => {
  const csrfToken = useState('csrfToken', () => '')

  const csrfFetch = async (
    resource: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body: object = {},
    headers: object = {},
    params: object = {},
    lazy: boolean = false
  ) => {
    const config = useRuntimeConfig()

    let response

    if (method === 'GET') {
      response = await useFetch(resource, {
        baseURL: config.public.apiUrl,
        method: method,
        params,
        lazy,
        // headers: { ...useRequestHeaders(['cookie']), csrfToken: 'csrfToken.value ' },
      })
    } else {
      response = await useFetch(resource, {
        baseURL: config.public.apiUrl,
        method,
        headers: { ...useRequestHeaders(['cookie']), ...headers, csrfToken: csrfToken.value },
        params,
        body: { ...body, csrfToken: csrfToken.value },
      })
    }
    if (
      response.error.value?.data?.data?.name === 'CustomCsrfError' ||
      response.error.value?.data?.data?.name === 'CustomXssError' ||
      response.error.value?.data?.statusCode === 500
    ) {
      console.log(response.error.value?.data)
      throw createError(response.error.value)
    }
    return { data: response.data, error: response.error }
  }

  return {
    csrfToken,
    csrfFetch,
  }
}
