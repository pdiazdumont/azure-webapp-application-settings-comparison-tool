class api {
  constructor() {
    this.endpoint = 'https://management.azure.com/subscriptions/'
    this.apiVersion = '2017-08-01'
  }

  getSubscriptions(token) {
    const headers = new Headers({
      'Authorization': `Bearer ${token}`,
    })
    const request = new Request(`${this.endpoint}?api-version=${this.apiVersion}` , {
      method: 'GET',
      headers,
    })
    return fetch(request)
  }
}

export const instance = new api()
