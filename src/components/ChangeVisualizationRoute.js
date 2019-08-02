import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Icon, Button } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import { sample } from 'lodash'

const CONTENT = {
  id: '17',
  type: 'dashboard',
  filters: {}
}

export default class ChangeVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboard: {},
      viz_configs: []
    }
  }

  randomize = () => {
    const {all_themes} = this.state
    var shuffle = all_themes.sort(() => Math.random() - 0.5);
    this.setState({all_themes: shuffle})
  }

  componentWillMount() {
    api31Call('GET',`/dashboards/${CONTENT.id}`)
    .then(r=>{
      var vizes = r.dashboard_elements.map(ele => {
        if (ele.query) {
          return ele.query.vis_config
        } else if (ele.look) {
          return ele.look.query.vis_config
        }
      })
      this.setState({
        dashboard: r,
        viz_configs: vizes
      })

    })
  }
  componentDidMount() {}

  rotateVis = () => {
    var options = JSON.parse(JSON.stringify(this.props.options))
    
    const elements = Object.keys(options);
    const copy_options = JSON.parse(JSON.stringify(options))
    var new_options = {}
    for (var i=0; i< elements.length; i++) {
      new_options[elements[i]] = {vis_config: {}}
      if (i==elements.length-1) {
        new_options[elements[i]].vis_config.type = copy_options[elements[0]].vis_config.type
      } else {
        new_options[elements[i]].vis_config.type = copy_options[elements[i+1]].vis_config.type
      }
    }
    options = new_options
    this.props.updateApp({options: options})
  } 

  
  
  render() {
    const {props} = this

    return (
      <>
        <Icon name='refresh' size='huge' onClick={this.rotateVis}/>

        <LookerFrame  content={CONTENT} {...props}></LookerFrame>
      </>
    )
  }
}