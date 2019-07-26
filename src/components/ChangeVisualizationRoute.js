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

export class ChangeVisualization extends Component {
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
    var messages = JSON.parse(JSON.stringify(this.props.messages))
    var options = messages.dashboard.options
    if (!this.state.options) {
      this.setState({options: options})
    }
    
    const elements = Object.keys(options);
    const copy_options = JSON.parse(JSON.stringify(options))
    var new_options = {}
    for (var i=0; i< elements.length; i++) {
      new_options[elements[i]] = {vis_config: {}}
      if (i==elements.length-1) {
        new_options[elements[i]].vis_config.type = copy_options[elements[0]].vis_config.type
        // options[elements[i]].title_hidden = false

      } else {
        new_options[elements[i]].vis_config.type = copy_options[elements[i+1]].vis_config.type
        // options[elements[i]].title_hidden = false
      }
    }
    messages.dashboard.options = new_options
    this.props.updateApp({messages: messages})
  } 

  
  
  render() {
    const {props} = this
    const {dashboard, options} = this.state
    // console.log(viz_configs)

    const tiles = (props.messages && props.messages.dashboard && props.messages.dashboard.options) ? props.messages.dashboard.options : []
    const keys = Object.keys(options || tiles)
    // console.log(options)
    // if (options) {
    //   var inputboxes = null
      
    
    //   if (keys.length > 0 ) {
        
    //     inputboxes = keys.map(tile => {
    //       return   <Button
    //       key = {tile}
    //       id = {tile}
    //       onClick = {this.changeToTable}
    //     >{(options &&  options[tile] && options[tile].title) ? options[tile].title : '' }
    //     </Button>
    //     })
    //   }
    // }


    // { (keys && keys.length && inputboxes) && inputboxes}
    return (
      <>
        <Icon name='refresh' size='huge' onClick={this.rotateVis}/>

        <LookerFrame  content={CONTENT} {...props}></LookerFrame>
      </>
    )
  }
}