class api {
  constructor() {
    this.endpoint = 'https://management.azure.com/subscriptions'
    this.apiVersion = '2017-08-01'
  }

  getSubscriptions(token) {
    const request = new Request(`${this.endpoint}/?api-version=${this.apiVersion}` , {
      method: 'GET',
      headers: this.getAuthenticationHeader(token),
    })
    return fetch(request)
  }

  getResourceGroups(token, subscriptionId) {
    const request = new Request(`${this.endpoint}/${subscriptionId}/resourceGroups/?api-version=${this.apiVersion}` , {
      method: 'GET',
      headers: this.getAuthenticationHeader(token),
    })
    return fetch(request)
  }

  getAuthenticationHeader(token) {
    return new Headers({
      'Authorization': `Bearer ${token}`,
    })
  }
}

export const instance = new api()
