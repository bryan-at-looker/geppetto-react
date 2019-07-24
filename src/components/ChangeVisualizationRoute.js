import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Icon } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';

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
  
  render() {
    const {props} = this
    const {dashboard, viz_configs} = this.state
    // console.log(viz_configs)
    return (
      <>
        <Icon name='random' size='huge' onClick={this.randomize}/>
        <LookerFrame  content={CONTENT} {...props}></LookerFrame>
      </>
    )
  }
}