import React, {Component} from 'react';
import { Icon, Button } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import './SelectLayoutRoute.css'
import {filter, orderBy, findLast} from 'lodash'

const LAYOUT_FUNCS = [
  {
    name: '3 Top 2 Rest',
    func: '3t2r'
  },
  {
    name: '3 Top 1 Long 2 Rest',
    func: '3t1l2r'
  },
  {
    name: 'Single Value Left',
    func: 'svl'
  },
  {
    name: 'Single Value Right',
    func: 'svr'
  }
]

const CONTENT = {
  id: 'thelook::business_pulse',
  type: 'dashboard',
  filters: {}
}

export default class SelectLayout extends Component {
  constructor(props) {
    super(props);
    this.state = { }
  }

  componentWillMount() {}
  componentDidMount() {}

  onReset = ( event, data ) => { 
    this.props.updateApp({options: this.state.original_options}); 
  }

  layout_3t2r = () => {
    var options = JSON.parse(JSON.stringify(this.state.original_options));
    var layout = filter(options.layouts, (o) => { return o.active })[0]
    layout['dashboard_layout_components'] = orderBy(layout.dashboard_layout_components, ['row','column'], ['asc', 'asc'])
    var height_counter = 0;
    layout.dashboard_layout_components.forEach((comp, i) => {
      var temp = 
      comp['row'] = height_counter;
      if (i < 3) {
        comp['column'] = 0 + ( i * 8 );
        comp['width'] = 8;
        comp['height'] = 4;
        if ( i == 2 ) {  
          height_counter += 4; 
        }
      } else {
        comp['column'] = 0 + ( (  (i-1) % 2 ) * 12 );
        comp['width'] = 12;
        comp['height'] = 8;
        if ( i % 2 == 0 ) {
          height_counter += 8; 
        }
      }
    })
    console.log(options)
    this.props.updateApp({options: options})    
  }

  layout_3t1l2r = () => {
    var options = JSON.parse(JSON.stringify(this.state.original_options));
    var layout = filter(options.layouts, (o) => { return o.active })[0]
    layout['dashboard_layout_components'] = orderBy(layout.dashboard_layout_components, ['row','column'], ['asc', 'asc'])
    var height_counter = 0;
    layout.dashboard_layout_components.forEach((comp, i) => {
      comp['row'] = height_counter;
      if (i < 3) {
        
        comp['column'] = 0 + ( i * 8 );
        comp['width'] = 8;
        comp['height'] = 6;
        if ( i == 2 ) {  
          height_counter += 8; 
        }
      } else if (i == 3) {
        comp['column'] = 0 ;
        comp['width'] = 24;
        comp['height'] = 5;
        height_counter += 5; 
      } else {
        comp['column'] = 0 + ( ( i % 2 ) * 12 );
        comp['width'] = 12;
        comp['height'] = 8;
        if ( i % 2 == 0 ) {
          height_counter += 8; 
        }
      }
    })
    this.props.updateApp({options: options})        
  }

  layout_svl = () => {
    const single_value_height = 4;
    const single_value_width = 6;
    const rest_height = single_value_height*2;
    const rest_width = 24 - single_value_width;

    var options = JSON.parse(JSON.stringify(this.state.original_options));
    var layout = filter(options.layouts, (o) => { return o.active })[0]
    layout['dashboard_layout_components'] = orderBy(layout.dashboard_layout_components, ['row','column'], ['asc', 'asc'])
    
    var el_ids = JSON.parse(JSON.stringify(layout.dashboard_layout_components.map(comp => { return comp.dashboard_element_id})));
    
    var single_values = filter(el_ids, (o) => { return options.elements[o].vis_config.type == 'single_value' })
    const svl_max_row = single_value_height * single_values.length;

    single_values.forEach( (el, i) => {
      var svl = findLast(layout.dashboard_layout_components, {dashboard_element_id: el})
      svl['row'] = i*single_value_height;
      svl['column'] = 0;
      svl['width'] = single_value_width;
      svl['height'] = single_value_height;
    })

    var rest = filter(el_ids, (o) => { return !(options.elements[o].vis_config.type == 'single_value') })

    var alternate = false;
    rest.forEach( (el, i) => {
      var rst = findLast(layout.dashboard_layout_components, {dashboard_element_id: el})
      if (i*rest_height < svl_max_row) {
        rst['row'] = i*rest_height;
        rst['column'] = single_value_width;
        rst['width'] = rest_width;
        rst['height'] = rest_height;
      } else {
        alternate = !alternate
        rst['row'] = i*rest_height;
        rst['width'] = 12;
        rst['height'] = rest_height;
        if (alternate) {
          rst['column'] = 0;
        } else {
          rst['column'] = 12;
        } 

      }

    })

    this.props.updateApp({options: options})      
  }

  layout_svr = () => {
    const single_value_height = 4;
    const single_value_width = 6;
    const rest_height = single_value_height*2;
    const rest_width = 24 - single_value_width;

    var options = JSON.parse(JSON.stringify(this.state.original_options));
    var layout = filter(options.layouts, (o) => { return o.active })[0]
    layout['dashboard_layout_components'] = orderBy(layout.dashboard_layout_components, ['row','column'], ['asc', 'asc'])
    
    var el_ids = JSON.parse(JSON.stringify(layout.dashboard_layout_components.map(comp => { return comp.dashboard_element_id})));
    
    var single_values = filter(el_ids, (o) => { return options.elements[o].vis_config.type == 'single_value' })
    const svl_max_row = single_value_height * single_values.length;

    single_values.forEach( (el, i) => {
      var svl = findLast(layout.dashboard_layout_components, {dashboard_element_id: el})
      svl['row'] = i*single_value_height;
      svl['column'] = 24-single_value_width;
      svl['width'] = single_value_width;
      svl['height'] = single_value_height;
    })

    var rest = filter(el_ids, (o) => { return !(options.elements[o].vis_config.type == 'single_value') })

    var alternate = false;
    rest.forEach( (el, i) => {
      var rst = findLast(layout.dashboard_layout_components, {dashboard_element_id: el})
      if (i*rest_height < svl_max_row) {
        rst['row'] = i*rest_height;
        rst['column'] = 0;
        rst['width'] = rest_width;
        rst['height'] = rest_height;
      } else {
        alternate = !alternate
        rst['row'] = i*rest_height;
        rst['width'] = 12;
        rst['height'] = rest_height;
        if (alternate) {
          rst['column'] = 0;
        } else {
          rst['column'] = 12;
        } 

      }

    })

    this.props.updateApp({options: options})      
  }

  changeLayout = (event, {id}) => {
    console.log('layout_'+id)
    this['layout_'+id]();
  }

  componentDidUpdate(pProps,pState) {
    const pOptions = pProps.options
    const options = this.props.options
    if (!pOptions && options) {
      this.setState({
        original_options: options
      })
    }
  }
  
  
  render() {
    const {options} = this.props
    const disabled = !( options && options.layouts )

    var layout_buttons = LAYOUT_FUNCS.map(layout => {
      return (
        <Button
          key={layout.func}
          disabled={disabled}
          id={layout.func}
          onClick={this.changeLayout}
         >{layout.name}
        </Button>
      )
    })

    return (
      <>
        <div className="center">
          <Icon disabled={disabled} name='random' size='large' onClick={this.rotateVis}/>
          {layout_buttons}
          <Icon disabled={disabled} name="refresh" size='large' onClick={this.onReset}></Icon>
        </div>
        <LookerFrame content={CONTENT} options={options} updateApp={this.props.updateApp}></LookerFrame>
      </>
    )
  }
}