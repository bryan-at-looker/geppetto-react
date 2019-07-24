import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Icon, Dropdown } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import {sample, filter} from 'lodash'

const CONTENT = {
  id: '17',
  type: 'dashboard',
  filters: {}
}

export class HideTitles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      multiple: true,
      search: true,
      searchQuery: null
    }
  }

  messageDashboard = (dashboard) => {
    var {messages} = this.props
    if (!isEqual(messages.dashboard, dashboard)) {
      messages.dashboard = dashboard
      this.props.updateApp({messages: messages})
    }
  }

  handleChange = (e, { value }) => {
    var messages = JSON.parse(JSON.stringify(this.props.messages))
    var {options} = messages.dashboard
    const kys = Object.keys(options)
    for (var i=0; i<kys.length; i++) {
      if (value.indexOf(kys[i]) > -1) {
        options[kys[i]].title_hidden = true;
      } else {
        options[kys[i]].title_hidden = false;
      }
    }
    this.props.updateApp({messages: messages})
  } 

  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery })

  selectRandom = () => {
    var messages = JSON.parse(JSON.stringify(this.props.messages));
    var {options} = messages.dashboard
    var value = [sample(Object.keys(options))]
    const kys = Object.keys(options)
    for (var i=0; i<kys.length; i++) {
      if (value.indexOf(kys[i]) > -1) {
        options[kys[i]].title_hidden = true;
      } else {
        options[kys[i]].title_hidden = false;
      }
    }
    this.props.updateApp({messages: messages})
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
    const tiles = (props.messages && props.messages.dashboard && props.messages.dashboard.options) ? props.messages.dashboard.options : []
    const {hidden_tiles} = this.state
    const { multiple, isFetching, search } = this.state

    const tileArray = Object.keys(tiles).map(tile => {
      return Object.assign({ id: tile}, tiles[tile])
    })

    const options = tileArray.map(tile => {
      return { key: tile.id, text: tile.title, value: tile.id}
    })

    const value = filter(tileArray, o => { 
        return o.title_hidden 
      }).map(tile => {
        return tile.id
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
            placeholder='Hide These Titles'
            onChange={this.handleChange}
            onSearchChange={this.handleSearchChange}
            disabled={isFetching}
            loading={isFetching}
          />
        <LookerFrame content={CONTENT} {...props}></LookerFrame>
      </>
    )
  }
}