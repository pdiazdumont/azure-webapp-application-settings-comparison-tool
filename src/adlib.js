import guid from 'uuid/v4'
import jwt from 'jwt-decode'
import queryString from 'query-string'
import moment from 'moment'

class AdLib {
  constructor() {
    this.config = {
      // clientId: '650eed1e-1acb-4c2d-8907-2406d6bd4d53',
      clientId: '79f8abb7-5356-44d9-8db5-13c656bf2290',
      // tenant: 'pauldiazcignium.onmicrosoft.com',
      tenant: 'Cignium.onmicrosoft.com',
      resource: 'https://management.azure.com/',
    }
  }
  
  login() {
    const expectedState = guid()
    this.setItemToSessionStorage('expectedState', expectedState)
    this.config.state = expectedState
    window.location.href = this.buildLoginUrl()
  }

  isCallback(query) {
    const parsedQuery = queryString.parse(query)
    return parsedQuery.access_token !== undefined && parsedQuery.state !== undefined
  }

  handleCallback(query) {
    const parsedQuery = queryString.parse(query)

    const expectedState = this.getItemFromSessionStorage('expectedState')

    if (parsedQuery.state !== expectedState || parsedQuery.access_token === undefined || parsedQuery.expires_in === undefined) {
      return
    }

    this.removeItemFromSessionStorage('expectedState')

    this.setItemToLocalStorage('token.value', parsedQuery.access_token)
    this.setItemToLocalStorage('token.expiresOn', moment().add(parsedQuery.expires_in, 's').format())

    const tokenInfo = jwt(parsedQuery.access_token)
    console.log(tokenInfo)
    this.setItemToLocalStorage('token.user.name', tokenInfo.name)
    this.setItemToLocalStorage('token.user.email', tokenInfo.upn)

    window.location.href = window.location.origin
  }

  renewToken() {
    this.removeItemFromLocalStorage('token.value')
    this.removeItemFromLocalStorage('token.expiresOn')
    console.error('should renew token')

    return

    // const iframe = document.createElement('iframe')
    // iframe.style.visibility = 'hidden'
    // iframe.style.position = 'absolute'
    // iframe.style.width = iframe.style.height = iframe.borderWidth = '0px'
    // iframe.src = 'about:blank'
    // document.getElementsByTagName('body')[0].appendChild(iframe)

    // const expectedState = guid()
    // this.setItemToSessionStorage('expectedState.iframe', expectedState)

    // const url = `https://login.microsoftonline.com/${this.config.tenant}/oauth2/authorize?` +
    // `&client_id=${this.config.clientId}` +
    // `&response_type=token` +
    // `&redirect_uri=${encodeURIComponent(window.location.origin)}` +
    // `&response_mode=fragment` +
    // `&resource=${encodeURIComponent(this.config.resource)}` +
    // `&scope=user_impersonation` +
    // `&state=${expectedState}` +
    // `&prompt=none`
  }

  notSigned() {
    const token = this.getItemFromLocalStorage('token.value')
    return token === null
  }

  tokenHasExpired() {
    const expiresOn = this.getItemFromLocalStorage('token.expiresOn')
    return moment().diff(moment(expiresOn)) > 0
  }

  buildLoginUrl() {
    return `https://login.microsoftonline.com/${this.config.tenant}/oauth2/authorize?` +
    `&client_id=${this.config.clientId}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(window.location.origin)}` +
    `&response_mode=fragment` +
    `&resource=${encodeURIComponent(this.config.resource)}` +
    `&scope=user_impersonation` +
    `&state=${this.config.state}`
  }

  getItemFromSessionStorage(key) {
    return sessionStorage.getItem(key)
  }

  setItemToSessionStorage(key, value) {
    sessionStorage.setItem(key, value)
  }

  removeItemFromSessionStorage(key) {
    sessionStorage.removeItem(key)
  }

  getItemFromLocalStorage(key) {
    return localStorage.getItem(key)
  }

  setItemToLocalStorage(key, value) {
    localStorage.setItem(key, value)
  }

  removeItemFromLocalStorage(key) {
    localStorage.removeItem(key)
  }
}

module.exports = new AdLib()
