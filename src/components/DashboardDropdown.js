import React, {Component} from 'react';
import { Dropdown } from 'semantic-ui-react';
import {find, isEqual} from 'lodash';
import './DashboardDropdown.css';

export class DashboardDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {}
    }
  }

  handleChange = (event,data) => {
    const found = find(data.options, function(o) {
      return o.value == data.value
    })

    const content_new = {
      id: found.value,
      type: 'dashboard',
      filters: {}
    }
    if (!isEqual(this.props.content,content_new)) {
      this.props.updateApp(
        { 
          content: content_new,
          messages: {}
        }
      )
    }
  }

  componentWillMount() {
    this.setState({content: this.props.content})
  }

  componentDidMount() {  }
  
  render() {
    const {dashboards, content} = this.props
    const db_dropdown = (dashboards) ? dashboards.map(db => {
      return {
        key: db.id,
        text: db.name,
        value: db.id,
        selected: (db.id == content.id)
      }
    }) : []
    return (
      <>
        <Dropdown 
          placeholder="LookML Dashboards"
          search 
          selection 
          options={db_dropdown} 
          onChange={this.handleChange}
        />
      </>
    )
  }
}