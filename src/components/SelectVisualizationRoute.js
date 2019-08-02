import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Icon, Button } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import './SelectVisualizationRoute.css'

const CONTENT = {
  id: '17',
  type: 'dashboard',
  filters: {}
}

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

export default class SelectVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {}
  componentDidMount() {}

  changeViz = (event, data) => {
    if (!this.state.options) { this.setState({options: this.props.options})}

    var options = JSON.parse(JSON.stringify(this.props.options));
    Object.keys(options).forEach(el => {
      if (options && options[el] && options[el].vis_config) {
        options[el].vis_config.type = data.id
      }
      this.props.updateApp({options: options})
    });
  }

  resetViz = () => {
    if (!this.state.options) { 
      this.setState({options: this.props.options})
    } else {
      this.props.updateApp({options: this.state.options})
    }
    
  }

  rotateVis = () => {
    if (!this.state.options) { this.setState({options: this.props.options})}
    
    var options = JSON.parse(JSON.stringify(this.props.options))
    const copy_options = JSON.parse(JSON.stringify(options))

    const elements = Object.keys(options);

    elements.forEach((el,i) => {
      if (i==elements.length-1) {
        options[el].vis_config.type = copy_options[elements[0]].vis_config.type
      } else {
        options[el].vis_config.type = copy_options[elements[i+1]].vis_config.type
      }
    })
    this.props.updateApp({options: options})
  } 
  
  
  render() {
    const {props} = this
    const vis_buttons = VIS_TYPES.map(vis=>{
      return (
      <Button
      key={vis}
      id={vis}
      onClick={this.changeViz}
      >{vis}
      </Button>)
    })

    return (
      <>
        <div className="center">
          <Icon name='random' size='large' onClick={this.rotateVis}/>
          {vis_buttons}
          <Icon name="refresh" size='large' onClick={this.resetViz}></Icon>
        </div>
        <LookerFrame  content={CONTENT} {...props}></LookerFrame>
      </>
    )
  }
}