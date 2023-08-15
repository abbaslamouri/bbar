import { ICartItem } from '~/server/utils/schemas/cart'
import { IProduct } from '~/server/utils/schemas/product'
import { IUserAddress } from '~/server/utils/schemas/user'

export const useCartStore = () => {
  const config = useRuntimeConfig()

  // const searchText = useState('serachText', () => '')

  const cart = useState('cart', () => ({
    items: [] as Array<ICartItem>,
    removedItems: [] as Array<ICartItem>,
    customer: {
      name: '',
      email: '',
      createAccount: false,
      password: '',
      billingAddress: {} as IUserAddress,
      shippingAddress: {} as IUserAddress,
      phone: '',
    },
    total: 0,
    discount: {
      code: '',
      amount: 0,
    },
    status: 'cart',
    deliveryInstructions: '',
  }))

  const showCartModal = useState('showCartModal', () => false)

  const saveCart = async () => {
    const { data, error } = await useFetch('ecommerce/cart/index', {
      baseURL: config.public.apiUrl,
      method: 'POST',
      body: cart.value,
    })
    if (error.value) console.log(error.value.data)
    // console.log('CART', data.value)
    if (error.value) {
      console.log(error.value)
      return false
    }
    // showCartModal.value = true
    return true
  }

  const addItem = async (cartItem: ICartItem) => {
    const index = cart.value.items.findIndex((p: ICartItem) => p._id == cartItem._id)
    if (index === -1) cart.value.items.push({ ...cartItem })
    else cart.value.items[index].quantity = (cart.value.items[index].quantity as number) + cartItem.quantity
    cart.value.total = cartTotal()
    return await saveCart()
  }

  const removeItem = async (cartItem: ICartItem) => {
    // if (!cart.value.items || !cart.value.items.length) return false
    const i = cart.value.items.findIndex((p: ICartItem) => p._id == cartItem._id)
    console.log(i)
    if (i !== -1) {
      cart.value.items.splice(i, 1)
      const j = cart.value.removedItems.findIndex((p: ICartItem) => p._id == cartItem._id)
      if (j === -1) cart.value.removedItems.push({ ...cartItem })
      else cart.value.removedItems[j].quantity = (cart.value.removedItems[j].quantity as number) + cartItem.quantity
    }
    cart.value.total = cartTotal()
    return await saveCart()
  }

  ////////////////////////

  const updateCart = async (cartItem: ICartItem, action: string) => {
    if (!cart.value.items.length) {
      cart.value.items.push({ ...cartItem })
    } else {
      const index = cart.value.items.findIndex((p: ICartItem) => p._id == cartItem._id)
      if (index !== -1) {
        if (action === 'inc') {
          cart.value.items[index].quantity = (cart.value.items[index].quantity as number) + cartItem.quantity
        }
        if (action === 'dec') {
          if ((cart.value.items[index].quantity as number) > 1) {
            cart.value.items[index].quantity = (cart.value.items[index].quantity as number) - cartItem.quantity
          } else {
            cart.value.items.splice(index, 1)
          }
        }
      } else {
        if (action === 'inc') {
          cart.value.items.push({ ...cartItem })
        }
      }
    }
    const index = cart.value.removedItems.findIndex((p: ICartItem) => p._id == cartItem._id)
    if (index !== -1) cart.value.removedItems.splice(index, 1)
    cart.value.total = cartTotal()
    return await saveCart()
  }

  const updateEcommerceCartItems = async (cartItem: ICartItem) => {
    if (!cart.value.items || !cart.value.items.length) return false
    const index = cart.value.items.findIndex((p: ICartItem) => p._id == cartItem._id)
    if (index !== -1) cart.value.items[index] = cartItem
    // cart.value.total = cartTotal()
    return await saveCart()
  }

  const undoRemoveItem = async (cartItem: ICartItem) => {
    cart.value.items.push(cartItem)
    const index = cart.value.removedItems.findIndex((p: ICartItem) => p._id === cartItem._id)
    if (index !== -1) cart.value.removedItems.splice(index, 1)
    return await saveCart()
  }

  const removeItemPermanently = async (cartItem: ICartItem) => {
    const index = cart.value.removedItems.findIndex((p: ICartItem) => p._id === cartItem._id)
    if (index !== -1) cart.value.removedItems.splice(index, 1)
    return await saveCart()
  }

  // const loadCart = () => {
  //   const cookies = useCookie('cartId')
  //   // console.log('XXXXXXX', cookies.value)
  // }

  const populateItem = (item: IProduct) => {
    return {
      // _id: item._id,
      // acsPartNumber: item.acsPartNumber,
      // price: item.price,
      // media: item.media,
      // tbq: item.tbq,
    }
  }

  const addRemoveItem = async (product: IProduct, action: string) => {
    // const product = {
    //   ...populateItem(item),
    // }
    // if (!cart.value.items.length) {
    //   cart.value.items.push({ ...product, quantity: 1 })
    // } else {
    //   const index = cart.value.items.findIndex((p: IProduct) => p._id == product._id)
    //   if (index !== -1) {
    //     if (action === 'inc') {
    //       cart.value.items[index].quantity = (cart.value.items[index].quantity as number) + 1
    //     }
    //     if (action === 'dec') {
    //       if ((cart.value.items[index].quantity as number) > 1) {
    //         cart.value.items[index].quantity = (cart.value.items[index].quantity as number) - 1
    //       } else {
    //         cart.value.items.splice(index, 1)
    //       }
    //     }
    //   } else {
    //     if (action === 'inc') {
    //       cart.value.items.push({ ...product, quantity: 1 })
    //     }
    //   }
    // }
    // cart.value.total = cartTotal()
    // return await saveCart()
  }

  // const updateCart = (item: IProduct, action: string) => {
  //   const cartItem = {
  //     ...populateItem(item),
  //   }
  //   if (!cart.value.items.length) {
  //     cart.value.items.push({ ...cartItem, quantity: 1 })
  //   } else {
  //     const index = cart.value.items.findIndex((it: ICartItem) => it._id == item._id)
  //     if (index !== -1) {
  //       if (action === 'inc') {
  //         cart.value.items[index].quantity = (cart.value.items[index].quantity as number) + 1
  //       }
  //       if (action === 'dec') {
  //         if ((cart.value.items[index].quantity as number) > 1) {
  //           cart.value.items[index].quantity = (cart.value.items[index].quantity as number) - 1
  //         } else {
  //           cart.value.items.splice(index, 1)
  //         }
  //       }
  //     } else {
  //       if (action === 'inc') {
  //         cart.value.items.push({ ...cartItem, quantity: 1 })
  //       }
  //     }
  //   }
  //   cart.value.total = cartTotal()

  // }

  const addToCart = async (cartItem: ICartItem, quantity: number = 1) => {
    console.log('CCCCCart')
    if (isNaN(quantity) || quantity === null) return

    // const cartItem = {
    //   ...populateItem(item),
    //   quantity: +quantity,
    // }
    if (!cart.value.items || !cart.value.items.length) {
      cart.value.items.push({ ...cartItem, quantity: 1 })
    } else {
      const index = cart.value.items.findIndex((it: ICartItem) => it._id == cartItem._id)
      if (index !== -1) {
        if (quantity) cart.value.items[index].quantity += quantity
        else cart.value.items.splice(index, 1)
      } else {
        cart.value.items.push({ ...cartItem, quantity: 1 })
      }
    }
    cart.value.total = cartTotal()
  }

  const numberOfItems = () => {
    return cart.value.items && cart.value.items.length
      ? cart.value.items.reduce((accumulator: number, item: ICartItem) => accumulator + item.quantity, 0)
      : 0
  }

  const cartTotal = () => {
    return cart.value.items && cart.value.items.length
      ? cart.value.items.reduce((accumulator: number, item: ICartItem) => accumulator + item.price * item.quantity, 0)
      : 0
  }

  // const cartTotal = () => {
  //   if (cart.value.items && cart.value.items.length)
  //     return cart.value.items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0)
  // }

  const fetchPublishableKey = async () => {
    // errorMsg.value = ''
    // message.value = ''
    try {
      // const { data, pending, error } = await useFetch(`${config.API_URL}/orders/publishableKey`)
      // if (error.value) throw error.value
      // if (data.value && data.value.status === 'fail') {
      //   if (process.client) errorMsg.value = data.value.message
      //   return false
      // }
      // return data.value.publishableKey
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        // errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return false
    }
  }

  const fetchClientSecret = async (orderId: string) => {
    // errorMsg.value = ''
    // message.value = ''
    try {
      // const { data, pending, error } = await useFetch(`${config.API_URL}/orders/secret`, {
      //   method: 'POST',
      //   body: { orderId },
      // })
      // if (error.value) throw error.value
      // if (data.value && data.value.status === 'fail') {
      //   if (process.client) errorMsg.value = data.value.message
      //   return false
      // }
      // console.log('PI', data.value)
      // return data.value.clientSecret
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        // errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return false
    }
  }

  return {
    // searchText,
    cart,

    addItem,
    showCartModal,
    updateCart,
    undoRemoveItem,
    removeItemPermanently,
    addRemoveItem,
    addToCart,
    // updateCart,
    removeItem,
    numberOfItems,
    updateEcommerceCartItems,
    // updateItemQuantity,
    // storeCartCustomer,
    // updateShippinAddress,
    // updateCustomerEmail,
    cartTotal,
    fetchPublishableKey,
    fetchClientSecret,
    saveCart,
    // updateLocalStorage,

    // loadCart,
  }
}

// export default useCartStore
