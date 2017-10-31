// TEST
import { instance as api } from './utils/api'
import constants from './constants'

import arraysOperation from 'array-operations'

import ApplicationSettingsPanel from './components/application-settings-panel'

import applicationSettings from './raw/application-settings'
import applicationSettings2 from './raw/application-settings.2'

const subscriptions = api.getSubscriptions(localStorage.getItem('token.value'))

subscriptions
  .then(response => {
    if (response.ok) {
      console.log('success')
    }
    return response.json()
  })
  .then(response => {
    if (response.error) {
      switch (response.error.code) {
        case constants.ERROR_CODES.INVALID_TOKEN:
          console.log('token is invalid')
          break
        case constants.ERROR_CODES.EXPIRED_TOKEN:
          console.log('token has expired')
          break
      }
    }
    else {
      // console.log(response)
    }
  })
// END TEST
// adlib.login()

import { Component } from 'react'

export default class App extends Component {
  render() {
    return (
      <div>
        <ApplicationSettingsPanel baseSettings={applicationSettings.properties} applicationSettings={ applicationSettings2.properties } />
      </div>
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

