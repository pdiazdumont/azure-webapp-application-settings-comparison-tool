// TEST
import { instance as api } from './utils/api'
import constants from './constants'

// const subscriptions = api.getSubscriptions(localStorage.getItem('token.value'))

// subscriptions
//   .then(response => {
//     if (response.ok) {
//       console.log('success')
//     }
//     return response.json()
//   })
//   .then(response => {
//     if (response.error) {
//       switch (response.error.code) {
//         case constants.ERROR_CODES.INVALID_TOKEN:
//           console.log('token is invalid')
//           break
//         case constants.ERROR_CODES.EXPIRED_TOKEN:
//           console.log('token has expired')
//           break
//       }
//     }
//     else {
//       // console.log(response)
//     }
//   })
// // END TEST
// adlib.login()

import { Component } from 'react'
// import applicationSettings from './raw/application-settings'
// import applicationSettings2 from './raw/application-settings.2'
// import ApplicationSettingsPanel from './components/application-settings-panel'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      subscriptions: [],
      resourceGroups: [],
      selectedSubscription: null,
      status: 0,
    }

    this.handleSubscriptionSelection = this.handleSubscriptionSelection.bind(this)
  }

  componentDidMount() {
    const token = localStorage.getItem('token.value')
    api.getSubscriptions(token)
      .then(response => {
        return response.json()
      })
      .then(response => {
        this.setState({
          subscriptions: response.value.map((value, index) => {
            return {
              id: value.subscriptionId,
              name: value.displayName,
            }
          }),
        })
      })
  }

  render() {
    return (
      <div>
        { this.renderSetup() }
      </div>
      // <div>
      // <ApplicationSettingsPanel baseSettings={applicationSettings.properties} applicationSettings={ applicationSettings2.properties } />
      // </div>
    )
  }

  renderSetup() {
    switch (this.state.status) {
      case constants.STATUS.SETUP_SUBSCRIPTION:
        return (
          <div>
            Select a subscription: 
            <select onChange={ this.handleSubscriptionSelection }>
              <option value='0' key='0'>-</option>
              { this.renderSubscriptionSelection() }
            </select>
          </div>
        )
      case constants.STATUS.SETUP_RESOURCE_GROUPS:
        return (
          <div>
            Current resource groups:
            <ul>
              { this.renderResourceGroupSelection() }
            </ul>
          </div>
        )
    }
  }

  renderSubscriptionSelection() {
    return this.state.subscriptions.map((item, index) => {
      return <option value={ item.id } key={ item.id }>{ item.name }</option>
    })
  }

  handleSubscriptionSelection(event) {
    const subscription = event.target.value
    const token = localStorage.getItem('token.value')
    api.getResourceGroups(token, subscription)
      .then(response => {
        return response.json()
      })
      .then(response => {
        this.setState({
          selectedSubscription: subscription,
          resourceGroups: response.value.map((value, index) => {
            return {
              id: value.id,
              name: value.name,
            }
          }),
          status: 1,
        })
      })
  }

  renderResourceGroupSelection() {
    return this.state.resourceGroups.map((item, index) => {
      return <li key={ item.id }>{ item.name }</li>
    })
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

