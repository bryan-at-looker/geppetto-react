import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Icon, Dropdown, Button, Popup, Input } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import {sample, filter} from 'lodash'

const CONTENT = {
  id: '19',
  type: 'dashboard',
  filters: {}
}

export class ChangeTitles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
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

  edit = (tiles,editing) => {

    if (!editing) {
      this.setState({
        editing: !editing,
        tiles: tiles
      })
    } else {
      this.setState({editing: !editing})
    }
  }

  changeText = (event, data) => {
    var {tiles} = this.state
    tiles[data.id].title = data.value
    this.setState({tiles: tiles})

    var messages = JSON.parse(JSON.stringify(this.props.messages));
    messages.dashboard.options[data.id].title = data.value
    this.props.updateApp({messages: messages});
  }
  
  render() {
    const {props} = this
    const tiles = (props.messages && props.messages.dashboard && props.messages.dashboard.options) ? props.messages.dashboard.options : []
    const {hidden_tiles, editing } = this.state
    const { multiple, isFetching, search } = this.state

    const tileArray = Object.keys(tiles).map(tile => {
      return Object.assign({ id: tile}, tiles[tile])
    })

    const keys = Object.keys(tiles)

    const options = tileArray.map(tile => {
      return { key: tile.id, text: tile.title, value: tile.id}
    })

    const all_vises =  Object.keys(tiles).map(tile => {
      return tiles[tile].vis_config.type || 'looker_table'
    })

    var inputboxes = <div></div>
    console.log(tiles)
    if (keys.length > 0 ) {
      
      inputboxes = keys.map(tile => {
        return   <Input
        key = {tile}
        id = {tile}
        onChange = {this.changeText}
        value = {(this.state.tiles &&  this.state.tiles[tile] && this.state.tiles[tile].title) ? this.state.tiles[tile].title : '' }
      />
      })
    }

    return (
      <>
      <Icon name="edit" size='huge' onClick={() => {this.edit(tiles,this.state.editing)}}></Icon>        
      { (editing) && inputboxes} 
        <LookerFrame content={CONTENT} {...props}></LookerFrame>
      </>
    )
  }
}