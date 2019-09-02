import React, {Component} from 'react';
import { Icon, Button } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import './SelectVisualizationRoute.css'

const VIS_TYPES = [
  'looker_bar',
  'looker_column',
  'looker_line',
  'looker_area',
  'looker_scatter',
  'looker_pie',
  'table',
  'looker_grid',
]

const CONTENT = {
  id: '19',
  type: 'dashboard',
  filters: {}
}

export default class SelectVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {}
  componentDidMount() {}

  changeViz = (event, data) => {
    
    var options = JSON.parse(JSON.stringify(this.state.original_options));
    var elements = options.elements;


    Object.keys(elements).forEach(el => {
      if (elements && elements[el] && elements[el].vis_config && elements[el].vis_config.type) {
        elements[el].vis_config.type = data.id
      }

      this.props.updateApp({options: options})
    });
  }

  onReset = ( event, data ) => { 
    this.props.updateApp({options: this.state.original_options}); 
  }

  rotateVis = () => {
    var options = JSON.parse(JSON.stringify(this.props.options));
    var elements = options.elements;
    var copy_options = JSON.parse(JSON.stringify(elements));

    const el_ids = Object.keys(elements);

    el_ids.forEach((el,i) => {
      if (i==el_ids.length-1) {
        elements[el].vis_config.type = copy_options[el_ids[0]].vis_config.type
      } else {
        elements[el].vis_config.type = copy_options[el_ids[i+1]].vis_config.type
      }
    })
    this.props.updateApp({options: options})
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
    const disabled = (!options)
    const vis_buttons = VIS_TYPES.map(vis=>{
      return (
      <Button
      key={vis}
      id={vis}
      disabled={disabled}
      onClick={this.changeViz}
      >{vis}
      </Button>)
    })

    return (
      <>
        <div className="center">
          <Icon disabled={disabled} name='random' size='large' onClick={this.rotateVis}/>
          {vis_buttons}
          <Icon disabled={disabled} name="refresh" size='large' onClick={this.onReset}></Icon>
        </div>
        <LookerFrame content={CONTENT} options={options} updateApp={this.props.updateApp}></LookerFrame>
      </>
    )
  }
}