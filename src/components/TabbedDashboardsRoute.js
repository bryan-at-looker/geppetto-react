import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Tab, Segment } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import './TabbedDashboardsRoute.css'

const DEFAULT_DASHBOARDS = ['thelook::business_pulse','thelook::web_analytics','thelook::brand_analytics']

export class TabbedDashboards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_dashboard:{},
      active_index: 0,
      dashboards: [],
    }
  }

  componentWillMount() {
    var dbs = []
    DEFAULT_DASHBOARDS.map(db => {
      api31Call('GET',`/dashboards/${db}`)
      .then(r => {
        dbs.push(r);
        this.setState({
          dashboards: dbs, 
          selected_dashboard: dbs[0]
        })
      })
    })
  }
  componentDidMount() {}

  tabChange = (event, data) => {
    this.setState({
      selected_dashboard: this.state.dashboards[data.activeIndex],
      active_index: data.activeIndex
    })
  }
  
  render() {

    const {selected_dashboard, active_index} = this.state
    const selected_elements = (selected_dashboard && selected_dashboard.dashboard_elements) ? selected_dashboard.dashboard_elements : [];
    const {props} = this
    
    const panes = (this.state.dashboards||[]).map(db => {
      return { 
        menuItem: db.title, 
        render: () => <LookerFrame selected_dashboard={this.state.selected_dashboard} {...props}></LookerFrame> ,
        activeIndex: active_index
      }
    })
    console.log(selected_elements)
    return (
      <>
       <Segment id="segclass" placeholder>
        <Tab onTabChange={this.tabChange}
        menu={{ secondary: true, pointing: true }} panes={panes} ></Tab>
       </Segment>
        
        
        
      </>
    )
  }
}
