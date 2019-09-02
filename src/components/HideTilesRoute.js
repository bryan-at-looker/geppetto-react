import React, {Component} from 'react';
import { Icon, Dropdown } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import {sample, filter} from 'lodash'

const CONTENT = {
  id: '19',
  type: 'dashboard',
  filters: {}
}


export default class HideTiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      multiple: true,
      search: true,
      searchQuery: null
    }
  }

  handleChange = (e, { value }) => {
    var {original_options} = this.state;
    var options = JSON.parse(JSON.stringify(original_options))
         
    var new_layout = options.layouts

    new_layout.forEach(layout => {
      layout.dashboard_layout_components = filter(layout.dashboard_layout_components, 
        (o) => { return value.indexOf( String(o.dashboard_element_id) ) == -1 
      })
    })

    this.setState({removed: value})
    this.props.updateApp({options: options})
    
  } 

  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery })

  selectRandom = () => { 
    var {original_options} = this.state;
    var options = JSON.parse(JSON.stringify(original_options))

    var value = [ sample(this.state.el_ids) ]
         
    var new_layout = options.layouts

    new_layout.forEach(layout => {
      layout.dashboard_layout_components = filter(layout.dashboard_layout_components, 
        (o) => { return value.indexOf( String(o.dashboard_element_id) ) == -1 
      })
    })

    this.setState({removed: value })  
    this.props.updateApp({options: options})
    
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

  componentDidUpdate(pProps,pState) {
    const pOptions = pProps.options
    const options = this.props.options
    if (!pOptions && options) {
      this.setState({
        original_options: options,
        el_ids: Object.keys(options.elements),
        removed: []
      })
    }
  }

  onReset = ( event, data ) => { 
    this.setState({removed: []})
    this.props.updateApp({options: this.state.original_options}); 
  }
  
  render() {
    const {el_ids, original_options, removed} = this.state
    const { multiple, isFetching, search } = this.state
    const {options} = this.props
    const elements = (original_options && original_options.elements) ? original_options.elements : {};

    var list = [];
    var value = [];
    if (elements && el_ids && removed) {
      list = el_ids.map(el => {
        return {
          key: el,
          text: elements[el].title || el,
          value: el
        }
      })
      value = el_ids.forEach(el => {
        if (removed.indexOf(el) == -1) { return el }
      })
    }

    return (
      <>
        <Icon name='random' size='huge' onClick={this.selectRandom}/>
        <Icon name='refresh' size='huge' onClick={this.onReset}/>
        <Dropdown
            selection
            multiple={multiple}
            search={search}
            options={list}
            value={removed || []}
            placeholder='Hide These Tiles'
            onChange={this.handleChange}
            onSearchChange={this.handleSearchChange}
            disabled={isFetching}
            loading={isFetching}
          />
        <LookerFrame content={CONTENT} options={options} updateApp={this.props.updateApp}></LookerFrame>
      </>
    )
  }
}