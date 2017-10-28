// TEST
import { instance as api } from './utils/api'
import constants from './constants'

const subscriptions = api.getSubscriptions(localStorage.getItem('token.value'))

subscriptions
  .then(response => {
    if (response.ok) {
      console.log('success')
    }
    return response.json()
  })
  .then(response => {
    switch (response.error.code) {
      case constants.ERROR_CODES.INVALID_TOKEN:
        console.log('token is invalid')
        break
      case constants.ERROR_CODES.EXPIRED_TOKEN:
        console.log('token has expired')
        break
    }
  })

// // END TEST

import { Component } from 'react'

export default class App extends Component {
  render() {
    return (
      <div>asds</div>
    )
  }
}

import adlib from 'adlib'

const currentHash = window.location.hash

if (adlib.isCallback(currentHash)) {
  adlib.handleCallback(currentHash)
}

if (adlib.notSigned()) {
  adlib.login()
}

if (adlib.tokenHasExpired()) {
  adlib.renewToken()
}

