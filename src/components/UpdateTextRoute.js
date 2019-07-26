import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Icon, Dropdown, Button, TextArea, Popup } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import {sample, filter} from 'lodash'

const CONTENT = {
  id: '18',
  type: 'dashboard',
  filters: {}
}

export class UpdateText extends Component {
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
        options[kys[i]].visible = true;
      } else {
        options[kys[i]].visible = false;
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
        options[kys[i]].visible = true;
      } else {
        options[kys[i]].visible = false;
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

  changeBody = (event, data) => {
    var {value} = data
    this.setState({text: value})
    var messages = JSON.parse(JSON.stringify(this.props.messages));
    messages.dashboard.options[data.id].vis_config.body_text_as_html = value
    this.props.updateApp({messages: messages});
    console.log(messages.dashboard.options)
  }
  
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

    const text_tiles = filter(tileArray, o => { 
        return ( o.vis_config && o.vis_config.type && o.vis_config.type == 'text' )
      }).map((tile) => {
        console.log(tile)
        return (
          <Popup
            on='click'
            key={tile.id}
            onClick={() => {this.setState({text: tile.vis_config.body_text_as_html}) }}
            trigger={<Button>Tile: {tile.id}</Button>}>
          <TextArea id={tile.id} onChange={this.changeBody} value={this.state.text}></TextArea>
          </Popup>
        )
    })

    return (
      <>
        {text_tiles}
        <LookerFrame content={CONTENT} {...props}></LookerFrame>
      </>
    )
  }
}