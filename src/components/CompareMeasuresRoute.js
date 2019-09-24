import React, {Component} from 'react';
import { Icon, Dropdown } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import {filter, findLast, isEqual} from 'lodash'

const COOL_FILTER = 'Cool Filter'

const CONTENT = {
  id: '21',
  type: 'dashboard',
  filters: {}
}

const HIDDEN_FIELDS = [
  { label: 'Item Count', field: "order_items.count", table_calc: "count", positive_bad: false},
  { label: 'Average Sale Price', field: "order_items.average_sale_price", table_calc: "average_sale_price", positive_bad: false},
  { label: 'Average Gross Margin', field: "order_items.average_gross_margin", table_calc: "average_gross_margin", positive_bad: false},
  { label: 'Average Days to Process', field: "order_items.average_days_to_process", table_calc: "average_days_to_process", positive_bad: true},
  { label: 'Return Rate', field: "order_items.return_rate", table_calc: "return_rate", positive_bad: true},
  { label: 'Returned Count', field: "order_items.returned_count", table_calc: "returned_count", positive_bad: true},
  { label: 'Total Gross Margin', field: "order_items.total_gross_margin", table_calc: "total_gross_margin", positive_bad: false},
  { label: 'Total Sale Price', field: "order_items.total_sale_price", table_calc: "total_sale_price", positive_bad: false},
]


export default class CompareMeasures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state_dashboard_filters: {}
    }
  }

  componentWillMount() {}
  componentDidMount() {}

  componentDidUpdate(pProps,pState) {
    const pOptions = pProps.options
    const options = this.props.options
    const {dashboard_filters} = this.props


    if (!pOptions && options) {
      this.setState({
        original_options: options,
        el_ids: Object.keys(options.elements),
        show_field: null,
        dashboard_filters: dashboard_filters
      })
    } 

    const state_dashboard_filters = this.state.dashboard_filters
    if (!isEqual(pProps.dashboard_filters,this.props.dashboard_filters) ) {
      if ( dashboard_filters && state_dashboard_filters && !isEqual(state_dashboard_filters, dashboard_filters) ) {
        if ( dashboard_filters[COOL_FILTER] != state_dashboard_filters[COOL_FILTER] ) { 
          this.setState({dashboard_filters: dashboard_filters})
          this.onCoolChange(); 
        }
      }
    }
  }

  onCoolChange = () => {
    const {el_ids, original_options} = this.state;
    const {dashboard_filters} = this.props;
    
    var labels = dashboard_filters[COOL_FILTER].split(',');
    var single_value_labels = labels.slice(0,2);

    const remain_hidden = filter(HIDDEN_FIELDS,  (o) => {return labels.indexOf(o.label) == -1});
        
    var options = JSON.parse(JSON.stringify(original_options));
    var elements = options.elements;

    var single_value_counter = -1
    el_ids.forEach((el)=> {
      var vis_config = elements[el]['vis_config']
      var temp_hidden = [];
       
      if (vis_config.type == 'single_value') {
        single_value_counter+=1;
        elements[el].title = ''
        vis_config['comparison_reverse_colors'] = (findLast(HIDDEN_FIELDS,  (o) => {return single_value_labels[single_value_counter] == o.label })['positive_bad']) ? true : false

        vis_config.title = single_value_labels[single_value_counter];
        temp_hidden = filter(HIDDEN_FIELDS,  (o) => {return single_value_labels[single_value_counter] != o.label }).map( x => { return x.field });
        temp_hidden = temp_hidden.concat(filter(HIDDEN_FIELDS,  (o) => {return single_value_labels[single_value_counter] != o.label }).map( x => { return x.table_calc }));

      } else {
        remain_hidden.forEach(hide => {
          temp_hidden.push(hide.field);
        })
      }
      vis_config['hidden_fields'] = temp_hidden;
    })
    
    this.props.updateApp({options: options})
    
  }


  
  render() {
    
    var {dashboard_filters} = this.props

    if (dashboard_filters && dashboard_filters["Cool Filter"] ) {
      var cool_filter = dashboard_filters["Cool Filter"].split(',');
      // var cool_filter_keys = cool_filter.map(field => {
      //   return findLast(HIDDEN_FIELDS, (o) => { return o.label == field})
      // })
    }

    return (
      <>
        <LookerFrame content={CONTENT} options={this.props.options} updateApp={this.props.updateApp}></LookerFrame>
      </>
    )
  }
}