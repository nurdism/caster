import Vue from 'vue'
import swal from 'sweetalert'

// Bind swal to Vue.
if (!Vue.$swal) {
  Vue.$swal = swal
  Object.defineProperty(Vue.prototype, '$swal', {
    get () {
      return swal
    }
  })
}

export default ({ store }, inject) => {
  inject('swal', swal)
}
