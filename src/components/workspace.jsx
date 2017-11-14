import { Component } from 'react'
import WebApp from './webapp'

export default class Workspace extends Component {
  constructor(props) {
    super(props)

    this.state = {
      baseApplication: null,
      applications: [],
    }
  }

  render() {
    <WebApp base />
    { this.renderApplications() }

    return <div>workspace</div>
  }

  renderApplications() {
    this.state.applications.map((application, index) => {
      return <WebApp key={ index } />
    })
  }
}
