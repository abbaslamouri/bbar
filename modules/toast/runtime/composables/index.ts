import { ICartItem } from '~/server/utils/schemas/cart'
import { IProduct } from '~/server/utils/schemas/product'
import { IUserAddress } from '~/server/utils/schemas/user'

export const useToast = () => {
  const timeout = ref([])
  const config = useRuntimeConfig()

  // const searchText = useState('serachText', () => '')

  const toasts = useState<Array<{ index: number; message: string; type: string; duration: number }>>('toasts', () => [])

  const toastsOptions = useState('toastsOptions', () => {
    return { position: 'top-right' }
  })

  const updateToastMessage = async (msg: string, options: { type: string; duration: number }) => {
    // showToastsMessage.value = show
    const j = toasts.value.length
    toasts.value.push({
      index: j,
      message: msg,
      type: options?.type ?? 'default',
      // position: options?.position ?? 'bottom-right',
      duration: options?.duration ?? 5,
    })
    // let timeout

    // clearTimeout(timeout)
    // if (toastsOptions.value.duration != 0) {
    //   // if (msg) {
    //   setTimeout(() => {
    //     toast.value.splice(j, 1)
    //     // showToastMessage.value = false
    //     // toast.value = ''
    //   }, toastsOptions.value.duration * 1000)

    // }
    // }
  }

  return {
    toasts,
    toastsOptions,
    // showToastMessage,
    updateToastMessage,
  }
}

// export default useCartStore
