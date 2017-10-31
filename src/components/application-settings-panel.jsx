import { Component } from 'react'
import arrayOperations from 'array-operations'

export default class ApplicationSettingsPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      settings: this.parseSettings(props.applicationSettings),
      missingSettings: this.getMissingSettings(props),
      additionalSettings: this.getAdditionalSettings(props),
      differentValueSettings: this.getDifferentValueSettings(props),
      sortCriteria: 'azure',
    }

    this.handleSortChange = this.handleSortChange.bind(this)
  }

  parseSettings(rawSettings) {
    const settings = []
    Object.keys(rawSettings).forEach((key, index) => {
      settings.push({
        index,
        key,
        value: rawSettings[key],
      })
    })
    return settings
  }

  getMissingSettings(props) {
    const baseSettings = Object.keys(props.baseSettings)
    const applicationSettings = Object.keys(props.applicationSettings)
    return arrayOperations.difference(baseSettings, applicationSettings)
  }

  getAdditionalSettings(props) {
    const baseSettings = Object.keys(props.baseSettings)
    const applicationSettings = Object.keys(props.applicationSettings)
    return arrayOperations.difference(applicationSettings, baseSettings)
  }

  getDifferentValueSettings(props) {
    const baseSettings = Object.keys(props.baseSettings)
    const applicationSettings = Object.keys(props.applicationSettings)
    const keysForDifferentValues = []
    arrayOperations.intersection(baseSettings, applicationSettings).map(item => {
      if (props.baseSettings[item] !== props.applicationSettings[item]) {
        keysForDifferentValues.push(item)
      }
    })
    return keysForDifferentValues
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            { this.renderRows() }
          </tbody>
        </table>
        <select onChange={ this.handleSortChange }>
          <option value='azure' defaultValue>Sort as Azure</option>
          <option value='az'>Sort alphabetically</option>
          <option value='common'>Sort by common first</option>
        </select>
      </div>
    )
  }

  renderRows() {
    return this.state.settings.map(item => {
      const style = {
        color: 'black',
      }
      if (this.state.additionalSettings.indexOf(item.key) !== -1 || this.state.differentValueSettings.indexOf(item.key) !== -1) {
        style.color = 'red'
      }
      return <tr key={ item.key }>
        <td style={ style }>{ item.key }</td>
        <td>{ item.value }</td>
      </tr>
    })
  }

  handleSortChange(event) {
    switch (event.target.value) {
      case 'az':
        this.setState({
          settings: this.state.settings.sort((first, second) => {
            if (first.key > second.key) return 1
            if (first.key < second.key) return -1
            return 0
          }),
        })
        break
      case 'azure':
        this.setState({
          settings: this.state.settings.sort((first, second) => {
            if (first.index > second.index) return 1
            if (first.index < second.index) return -1
            return 0
          }),
        })
        break
      case 'common':
        break
    }
  }
}
