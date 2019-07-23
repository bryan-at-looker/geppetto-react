import React, {Component} from 'react';
import { Dropdown } from 'semantic-ui-react';
import {find, isEqual} from 'lodash';
import {api31Call} from '../helpers'

export class FilterDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {}
    }
  }

  handleChange = (event,data) => {
    
  }

  componentDidMount() {    

  }

  componentDidMount() {  }
  
  render() {
    return (
      <>
    <Dropdown
      clearable
      multiple
      search
      selection
      options={[]}
      onChange={this.handleChange}
    />
      </>
    )
  }
}