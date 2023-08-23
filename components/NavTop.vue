<script setup lang="ts">
const viewportWidth = useViewportWidth()
const config = useRuntimeConfig()
const { showCartModal, numberOfItems, cartTotal } = useCartStore()
const { authUser, authenticated } = useAuthStore()

// import { useToast } from 'vue-toastification'

const cartModalRef = ref()

const iconsOnlyBreakpoint = 1000

const signout = async () => {
  const { data } = await useFetch(`auth/signout`, {
    baseURL: config.public.apiUrl,
    method: 'POST',
    headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
    body: { sessionId: authUser.value.sessionId },
  })
  authUser.value = {
    userName: (data.value as typeof authUser.value).userName,
    authenticated: (data.value as typeof authUser.value).authenticated,
    sessionId: (data.value as typeof authUser.value).sessionId,
  }
  // useToast().success('You are logged out')
}

const cartModalClosed = (event: any) => {
  // console.log('Cart Modal Closed', event)
}

const cartModalCancelled = (event: any) => {
  // console.log('Cart Modal Cancelled', event)
  showCartModal.value = false
}

onMounted(() => {
  window.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).classList.contains('cart-dialog') && showCartModal.value == true) {
      showCartModal.value = false
    }
  })
})

watch(
  () => showCartModal.value,
  (newVal, oldValue) => {
    if (newVal) cartModalRef.value.showModal()
    else cartModalRef.value.close()
    // console.log(cartModalRef.value.getAttribute('open'))
    // setTimeout(() => {
    //   if (newVal) cartModalRef.value.showModal()
    // }, 5000)
    // console.log(newVal)
    // console.log(oldValue)

    // else cartModalRef.value.close()
  }
)
</script>

<template>
  <nav :class="{ 'icons-only': +viewportWidth < iconsOnlyBreakpoint }" aria-label="secondary-nav">
    <ul class="" role="list">
      <li>
        <button class="btn" aria-labelledby="button-label-search-products" @click="$emit('showSearchModal')">
          <!-- {{ authUser }} -->
          <Icon class="icon" name="mdi:magnify" aria-hidden="true" focusable="false" />
          <span class="label" aria-hidden="true">Search Products</span>
          <span id="button-label-search-products" hidden>Search Products</span>
        </button>
      </li>
      <li class="dropdown">
        <button
          class="dropdown__trigger | btn"
          aria-labelledby="button-label-search-products"
          aria-controls="auth-dropdown"
          ref="dropdownTriggerRef"
        >
          <Icon class="icon" name="mdi:account-outline" aria-hidden="true" focusable="false" />
          <div v-if="authenticated">
            <span class="label" aria-hidden="true">Welcome {{ authUser.userName }}</span>
            <span hidden>Welcome {{ authUser.userName }}</span>
          </div>
          <div v-else>
            <span class="label" aria-hidden="true">Sign in / Create account</span>
            <span hidden>Sign in / Create account</span>
          </div>
        </button>
        <ul class="dropdown__menu" id="auth-dropdown" role="list" ref="dropdownMenuRef">
          <li class="">
            <NuxtLink class="btn" :to="{ name: 'admin' }" v-if="authenticated">dashboard</NuxtLink>
            <NuxtLink class="btn" :to="{ name: 'auth-signin' }" v-else>Signin</NuxtLink>
          </li>
          <li class="">
            <button class="btn" ref="signoutBtnRef" @click="signout" v-if="authenticated">Signout</button>
            <NuxtLink class="btn btn-outlined" :to="{ name: 'auth-signup' }" v-else>Create account</NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <button class="btn" @click="showCartModal = true">
          <Icon class="icon" name="mdi:cart-outline" aria-hidden="true" focusable="false" />
          <span class="label" aria-hidden="true"
            >Your Bag (${{ (cartTotal() / 100).toFixed(2) }})-({{ numberOfItems() }})</span
          >
          <span id="button-label-search-products" hidden>Your bag</span>
        </button>
      </li>
    </ul>

    <!-- <transition name="cart-modal"> -->
    <div class="cart-modal">
      <dialog class="cart-dialog" ref="cartModalRef" @close="cartModalClosed" @cancel="cartModalCancelled">
        <EcommerceCart />
      </dialog>
    </div>
    <!-- </transition> -->
  </nav>
</template>

<style lang="scss" scoped>
// @import '@/assets/scss/_variables.scss';

.cart-modal {
  dialog {
    &:modal {
      padding: 0;
      margin-inline-end: 0;
      margin-block: 0;
      min-height: 100vh;
      border: none;

      &::backdrop {
        background-color: rgba(0 0 0 / 0.8);
      }
    }
  }
}

nav {
  ul {
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    gap: var(--size-xs);

    li {
      &.dropdown {
        position: relative;

        .dropdown__trigger {
          cursor: pointer;

          &:after {
            content: '';
            border: 0.35rem solid transparent;
            border-top-color: currentColor;
            opacity: 0.7;
            margin-left: 0.25em;
            transform: translateY(0.15em);
          }
        }

        ul.dropdown__menu {
          grid-auto-flow: row;
          justify-content: stretch;

          gap: 0;
          position: absolute;
          transform-origin: top center;
          margin-block-start: -1px;
          transform: rotateX(-90deg);
          opacity: 0.3;
          visibility: hidden;
          min-width: 12rem;
          width: 100%;
          transition: all 300ms ease-out;

          .btn {
            width: 100%;
            justify-content: flex-start;
            font-size: var(--font-size--2);

            &:last-child {
              margin-block-start: -1px;
            }
          }
        }

        &:hover {
          ul.dropdown__menu {
            opacity: 1;
            visibility: visible;
            transform: rotateX(0);
            background-color: var(--on-bg);
          }
        }
      }
    }
  }

  .btn {
    color: var(--bg-highlight);
    border: 1px solid var(--bg-highlight);
    font-weight: normal;
    // padding: var(--size-xs) var(--size-l);

    svg {
      fill: currentColor;
    }

    &:hover {
      color: var(--on-bg);
      background-color: var(--bg-highlight);
    }

    &:focus {
      outline: 3px solid var(--bg);
      outline-offset: 0.3ch;
    }
  }

  &.icons-only {
    .label {
      display: none;
    }

    .icon {
      width: var(--size-m);
      height: var(--size-m);
    }
  }
}

.cart-modal-enter-active,
.cart-modal-leave-active {
  transition: all 500ms ease-in-out;
}

.cart-modal-enter-from,
.cart-modal-leave-to {
  // opacity: 0;
  transform: translateX(50rem);
}

.cart-modal-enter-to,
.cart-modal-leave-from {
  // opacity: 1;
  transform: translateX(0);
}
</style>
