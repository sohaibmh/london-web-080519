import React, { Component } from 'react'
import './App.css'
import Nav from './components/Nav'
import hogs from './porkers_data'
import {
  Container,
  Dropdown,
  Checkbox,
  Button,
  Segment,
  Label
} from 'semantic-ui-react'
import HogsContainer from './components/HogsContainer'

const SORT_OPTIONS = {
  default: 'default',
  weight: 'weight',
  name: 'name'
}

const weightKey =
  'weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water'

class App extends Component {
  state = {
    hogs: hogs,
    showGreasedOnly: false,
    sortBy: SORT_OPTIONS.default,
    hiddenHogNames: []
  }

  toggleGreased = hog => {
    this.setState({
      hogs: hogs.map(h => {
        if (h.name !== hog.name) return h
        h.greased = !h.greased
        return h
      })
    })
  }

  hideHog = hog =>
    this.setState({ hiddenHogNames: [...this.state.hiddenHogNames, hog.name] })

  toggleGreaseFilter = () =>
    this.setState({ showGreasedOnly: !this.state.showGreasedOnly })

  sortHogs = sortOption => (a, b) => {
    if (sortOption === SORT_OPTIONS.default) {
      return 0
    } else if (sortOption === SORT_OPTIONS.weight) {
      return a[weightKey] - b[weightKey]
    } else if (sortOption === SORT_OPTIONS.name) {
      return a.name.localeCompare(b.name)
    }
  }

  filterAndSortHogs = (hogs, filter, sortOption, hiddenHogNames) =>
    hogs
      .filter(h => !hiddenHogNames.includes(h.name))
      .filter(h => (filter ? h.greased : true))
      .sort(this.sortHogs(sortOption))

  updateSortOption = value => {
    this.setState({
      sortBy: value
    })
  }

  render() {
    return (
      <Container>
        <Nav />
        <Segment.Group horizontal>
          <Segment>
            <Button.Group>
              {Object.values(SORT_OPTIONS)
                .map(key => (
                  <Button
                    primary={this.state.sortBy === key}
                    key={key}
                    value={key}
                    onClick={() => this.updateSortOption(key)}
                  >
                    {key}
                  </Button>
                ))
                .map((button, i) =>
                  i === 2 ? (
                    button
                  ) : (
                    <>
                      {button}
                      <Button.Or />
                    </>
                  )
                )}
            </Button.Group>
          </Segment>
          <Segment>
            <Checkbox
              label="Show greased only"
              onChange={this.toggleGreaseFilter}
              checked={this.state.showGreasedOnly}
            />
          </Segment>
          <Segment>
            {this.state.hiddenHogNames.length > 0 && (
              <Button
                content={`Restore ${this.state.hiddenHogNames.length} hidden hogs`}
                onClick={() => this.setState({ hiddenHogNames: [] })}
              />
            )}
            <Button negative>Bad thing</Button>
            <Button positive>Good thing</Button>
            <Button>Just a thing</Button>
          </Segment>
        </Segment.Group>
        <HogsContainer
          hideHog={this.hideHog}
          hogs={this.filterAndSortHogs(
            this.state.hogs,
            this.state.showGreasedOnly,
            this.state.sortBy,
            this.state.hiddenHogNames
          )}
          toggleGreased={this.toggleGreased}
        />
      </Container>
    )
  }
}

export default App
