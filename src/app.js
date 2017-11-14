import { instance as api } from './utils/api'
import cache from './utils/cache'

import Workspace from './components/workspace'

import { Component } from 'react'

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      initialized: false,
      token: localStorage.getItem('token.value'),
      subscriptions: [],
      resourceGroups: [],
      sites: [],
    }    
  }

  componentDidMount() {
    this.initialize()
  }

  render() {
    if (this.state.initialized) {
      return <Workspace />
    }
    else {
      return <div>initializing application</div>
    }
  }

  async initialize() {
    await this.loadSubscriptions()
    await this.loadResourceGroups()
    await this.loadSites()
    this.setState({
      initialized: true,
    })
  }

  async loadSubscriptions() {
    const subscriptions = cache.getSubscriptions()
    if (subscriptions) {
      this.setState({
        subscriptions,
      })
    }
    else {
      return api.getSubscriptions(this.state.token)
        .then(response => {
          if (response.ok && response.status === 200) {
            return response.json()
          }
          return Promise.reject(new Error(`The request has failed. Code: ${response.status}, message: "${response.statusText}"`))
        })
        .then(response => {
          const subscriptions = response.value.map((subscription, index) => {
            return {
              id: subscription.subscriptionId,
              name: subscription.displayName,
              state: subscription.state,
            }
          })
          this.setState({
            subscriptions,
          })
          cache.setSubscriptions(subscriptions)
        })
        .catch(error => console.error(`An error has occurred: ${error}`))
    }
  }

  async loadResourceGroups() {
    const resourceGroups = cache.getResourceGroups()
    if (resourceGroups) {
      this.setState({
        resourceGroups,
      })
    }
    else {
      const resourceGroupInformation = []
      const promises = this.state.subscriptions.map((subscription, index) => {
        return api.getResourceGroups(this.state.token, subscription.id)
          .then(response => {
            if (response.ok && response.status === 200) {
              return response.json()
            }
            return Promise.reject(new Error(`The request has failed. Code: ${response.status}, message: "${response.statusText}"`))
          })
          .then(response => {
            const resourceGroups = []
            response.value.map((resourceGroup, index) => {
              resourceGroups.push(resourceGroup.name)
            })
            return Promise.resolve(resourceGroups)
          })
          .then(response => {
            return {
              subscription: subscription.name,
              resourceGroups: response,
            }
          })
      })
  
      return Promise
        .all(promises)
        .then(response => {
          const resourceGroups = {}
          response.map((resourceGroup, index) => {
            resourceGroups[resourceGroup.subscription] = resourceGroup.resourceGroups
          })
          cache.setResourceGroups(resourceGroups)
          this.setState({
            resourceGroups,
          })
        })
    }
  }

  async loadSites() {
    const sites = cache.getSites()
    if (sites) {
      this.setState({
        sites,
      })
    }
    else {
      const promises = this.state.subscriptions.map((subscription, index) => {
        return api.getSitesForSubscription(this.state.token, subscription.id)
          .then(response => {
            if (response.ok && response.status == 200) {
              return response.json()
            }
            return Promise.reject(new Error(`The request has failed. Code: ${response.status}, message: "${response.statusText}"`))
          })
          .then(response => {
            const sites = response.value.map((site, index) => {
              const regex = new RegExp(
                `/subscriptions` +
                `/${subscription.id}` +
                `/resourceGroups` +
                `/([a-zA-Z0-9_-]+)` +
                `/providers` +
                `/Microsoft.Web` +
                `/sites` +
                `/([a-zA-Z0-9_-]+)`, 'i')
              const results = site.id.match(regex)
              return {
                id: results[2],
                name: site.name,
                resourceGroup: results[1],
              }
            })
            return Promise.resolve(sites)
          })
      })
  
      return Promise
        .all(promises)
        .then(response => {
          const sites = []
          response.map((value, index) => {
            value.map((site, index) => {
              sites.push(site)
            })
          })
          cache.setSites(sites)
          this.setState({
            sites,
          })
        })
    }
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
