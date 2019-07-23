import React, {Component} from 'react';
import {DashboardDropdown} from './DashboardDropdown'
import {LookerFrame} from './LookerFrame'
import { api31Call } from '../helpers';
import { isEqual } from 'lodash'
import { FilterDropdown } from './FilterDropdown';

export class DashboardRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboard_filters: []
    }
  }

  getContentMetaData = (type,id) => {
    api31Call('GET',`/${type}s/${id}`)
    .then(response => {
      this.setState({ 
        metadata: response, 
        dashboard_filters: (response.dashboard_filters) ? response.dashboard_filters : []
      })
    })
  }

  componentDidMount() {
    const {type, id} = this.props.content
    this.getContentMetaData(type,id);
  }

  componentDidUpdate(prev_props, prev_state) {
    const content_new = this.props.content
    const content_prev = prev_props.content
    const {type, id} = content_new
    if (!isEqual(content_new,content_prev)) {
      this.getContentMetaData(type,id);
    } else if (!isEqual(prev_state.dashboard_filters,this.state.dashboard_filters)) {
      const {dashboard_filters} = this.state
      if (dashboard_filters.length > 0) {
        var filter_queries = dashboard_filters.map(filt => {
          if (filt.type == 'field_filter' && filt.dimension) {
            return {
              explore: filt.explore,
              model: filt.model,
              title: filt.title,
              field: filt.dimension
            }
          }
        }).filter(o => {return o !== undefined })
        
        
        var filter_results = filter_queries.map(fltr => {
          api31Call('GET','/queries/models/'+fltr.model+'/views/'+fltr.explore+'/run/json','limit=-1&fields='+fltr.field)
          .then(r => {
            return r
          })
        })
        Promise.all(filter_results)
        .then(all => {
          // console.log(all)
        })
        
        // this.setState({content: this.props.content})
      }

    }
  }
  
  render() {
    const {props} = this;
    const {metadata} = this.state;
    const {type, id} = props.content
    
    
    
    return (
      <>
        <div>
          <DashboardDropdown {...props}></DashboardDropdown>
        </div>
        <div>
          <LookerFrame embed_type='dashboard' {...props}></LookerFrame>
        </div>

      </>
    )
  }
}