import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Icon, Dropdown } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import {sample} from 'lodash'

export class HideTiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      multiple: true,
      search: true,
      searchQuery: null,
      value: []
    }
  }

  handleChange = (e, { value }) => this.setState({ value })
  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery })

  selectRandom = () => {
    const { multiple } = this.state
    const tiles = this.props.messages.tiles || []
    const options = tiles.map(tile => {
      return { key: tile.id, text: tile.title, value: tile.id}
    })
    const value = sample(options).value
    this.setState({ value: multiple ? [value] : value })
  }

  toggleSearch = (e) => this.setState({ search: e.target.checked })

  toggleMultiple = (e) => {
    const { value } = this.state
    const multiple = e.target.checked
    // convert the value to/from an array
    const newValue = multiple ? _.compact([value]) : _.head(value) || ''
    this.setState({ multiple, value: newValue })
  }

  componentWillMount() {

  }
  componentDidMount() {}
  
  render() {
    const {props} = this
    const tiles = props.messages.tiles || []
    const {hidden_tiles} = this.state
    const { multiple, isFetching, search, value } = this.state

    const options = tiles.map(tile => {
      return { key: tile.id, text: tile.title, value: tile.id}
    })

    return (
      <>
        <Icon name='random' size='huge' onClick={this.selectRandom}/>
        <Dropdown
            selection
            multiple={multiple}
            search={search}
            options={options}
            value={value}
            placeholder='Add Users'
            onChange={this.handleChange}
            onSearchChange={this.handleSearchChange}
            disabled={isFetching}
            loading={isFetching}
          />
        <LookerFrame {...props}></LookerFrame>
      </>
    )
  }
}