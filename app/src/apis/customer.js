import { api } from "./config"

export const CustomerAPI = {
    get: async function (credentials, cancel = false) {
      const response = await api.request({
          url: `/customer/get`,
          method: "POST",
          data: credentials,
      })

      // returning the product returned by the API
      return response.data
    },
    create: async function (customer) {
      await api.request({
        url: `/customer/add`,
        method: "POST",
        data: customer,
        // signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
      })
    },
    // card: async function () {
    //   await api.request({
    //     url: `/customer/add`,
    //     method: "GET",
    //     data: customer,
    //     // signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    //   })
    // },
}
