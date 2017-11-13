import queryString from 'query-string'

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

  getSitesForSubscription(token, subscriptionId) {
    const filter = {
      '$filter': 'resourceType eq \'Microsoft.Web/sites\'',
    }
    const request = new Request(`${this.endpoint}
    /${subscriptionId},
    /resources?
    ${queryString.stringify(filter)}`)
    return fetch(request)
  }

  getSites(token, subscriptionId, resourceGroupName) {
    const request = new Request(`${this.endpoint}
    /${subscriptionId}
    /resourceGroups/${resourceGroupName}
    /providers/Microsoft.Web/sites/
    ?api-version=${this.apiVersion}` , {
      method: 'GET',
      headers: this.getAuthenticationHeader(token),
    })
    return fetch(request)
  }

  getApplicationSettings(token, subscriptionId, resourceGroupName, siteName) {
    const request = new Request(`${this.endpoint}
    /${subscriptionId}
    /resourceGroups/${resourceGroupName}
    /providers/Microsoft.Web/sites/${siteName}
    /config/appsettings/list/
    ?api-version=${this.apiVersion}` , {
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
