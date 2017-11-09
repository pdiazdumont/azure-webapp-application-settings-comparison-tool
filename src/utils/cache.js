const cache = {
  getSubscriptions() {
    const user = localStorage.getItem('token.user.email')
    const subscriptions = localStorage.getItem(`${user}.subscriptions`)
    if (subscriptions) {
      return JSON.parse(subscriptions)
    }
    return false
  },

  setSubscriptions(subscriptions) {
    const user = localStorage.getItem('token.user.email')
    localStorage.setItem(`${user}.subscriptions`, JSON.stringify(subscriptions))
  },

  getResourceGroups() {
    const user = localStorage.getItem('token.user.email')
    const resourceGroups = localStorage.getItem(`${user}.resourceGroups`)
    if (resourceGroups) {
      return JSON.parse(resourceGroups)
    }
    return false
  },

  setResourceGroups(resourceGroups) {
    const user = localStorage.getItem('token.user.email')
    localStorage.setItem(`${user}.resourceGroups`, JSON.stringify(resourceGroups))
  },
}

export default cache
