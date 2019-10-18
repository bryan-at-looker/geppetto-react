import React, {Component} from 'react';
import { Icon, Button, Grid, Segment, Header } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import './SelectLayoutRoute.css'
import {filter, isEqual, find, uniq} from 'lodash'

const COOL_FILTER = 'KPIs'

const CONTENT = {
  id: '23',
  type: 'dashboard',
  filters: {}
}

export default class HiddenLayouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_titles: [],
      dashboard_filters: {}
    }
  }

  componentWillMount() {}
  componentDidMount() {}

  onReset = ( event, data ) => { 
    this.props.updateApp({options: this.state.original_options}); 
  }

  componentDidUpdate(pProps,pState) {
    const pOptions = pProps.options
    const options = this.props.options
    if (!pOptions && options) {
      this.setState({
        original_options: options
      })
    }

    const {dashboard_filters} = this.props
    const state_dashboard_filters = this.state.dashboard_filters
    if (!isEqual(pProps.dashboard_filters,this.props.dashboard_filters) ) {
      if ( dashboard_filters && state_dashboard_filters && !isEqual(state_dashboard_filters, dashboard_filters) ) {
        if ( dashboard_filters[COOL_FILTER] != state_dashboard_filters[COOL_FILTER] ) { 
          this.setState({dashboard_filters: dashboard_filters})
          this.updateLayout(dashboard_filters[COOL_FILTER])
        }
      }
    }
  }

  updateLayout = (titles_string) => {
    if (!this.props || !this.props.options) { return;  }
    const titles_array = titles_string.split(',')

    
    var options = JSON.parse(JSON.stringify(this.props.options))
    var {elements, layouts} = options
    const {selected_titles} = this.state
    var hidden_layout = filter(layouts, {active: true})[0]
    const replace_layout = filter(layouts, {active: false})[0]

    var new_components = []

    hidden_layout.dashboard_layout_components.forEach((component,i) => {
      if (titles_array.indexOf(elements[component.dashboard_element_id].title) > -1) {
        new_components.push(find(replace_layout.dashboard_layout_components, {'dashboard_element_id': component.dashboard_element_id }));
      } else {
        new_components.push(Object.assign(component,{ row: 0, column: 0, height: 0, width: 0}))
      }
    })

    hidden_layout.dashboard_layout_components = new_components

    this.props.updateApp({
      options: Object.assign({elements: elements},{ layouts: [hidden_layout].concat([replace_layout]) })
    })
  }
  
  
  render() {
    const {options} = this.props
    const {selected_titles} = this.state
    const disabled = !( options && options.layouts )
    var titles = []
    if (options && options.layouts && options.elements ) {
      titles = uniq(Object.keys(options.elements).map(el => { return options.elements[el].title}))
    }

    var layout_buttons = titles.map(title => {
      return (
        <Button
          fluid
          key={title}
          active={selected_titles.indexOf(title) >-1}
          disabled={disabled}
          onClick={this.buttonClick}
          id={title}
         >{title}
        </Button>
      )
    })

    return (
      <>
        <LookerFrame content={CONTENT} options={options} updateApp={this.props.updateApp}></LookerFrame>     
      </>
    )
  }
}