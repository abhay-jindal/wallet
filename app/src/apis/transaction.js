import { api } from "./config"

export const TransactionAPI = {
    transfer: async function (payload) {
      const response = await api.request({
          url: `/transfers`,
          method: "POST",
          data: payload,
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
      })

      return response.data
    },

    history: async function () {
      const response = await api.request({
          url: `/transfers/history`,
          method: "GET",
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
      })
      return response.data
    },

    exportHistory: async function () {
      const response = await api.request({
          url: `/export/transfers/history`,
          method: "GET",
          // withCredentials: true,
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`}
      })
      return response.data
    }
}
