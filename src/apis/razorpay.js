import { api } from "./config"

export const RazorpayAPI = {
    order: async function (payload, cancel = false) {
      const response = await api.request({
          url: `/razorpay/orders`,
          method: "POST",
          data: payload,
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
      })

      return response.data
    },

    payment: async function (payload) {
      const response = await api.request({
        url: `/razorpay/payments`,
        method: "POST",
        data: payload,
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
      })

      return response.data
    }
}
