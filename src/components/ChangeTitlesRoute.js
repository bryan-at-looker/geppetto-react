import React, {Component} from 'react';
import { Icon, Input } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';

const CONTENT = {
  id: '19',
  type: 'dashboard',
  filters: {}
}

export default class ChangeTitles extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSearchChange = (e, { searchQuery }) => this.setState({ searchQuery })
  componentWillMount() {}
  componentDidMount() {}

  changeText = (event, data) => {
    var options = JSON.parse(JSON.stringify(this.state.options));
    var elements = options.elements
    elements[data.id].title = data.value
    this.setState({options: options})
    this.props.updateApp({options: options});
  }

  onReset = ( event, data ) => { 
    this.setState({options: this.state.original_options})
    this.props.updateApp({options: this.state.original_options}); 
  }

  componentDidUpdate(pProps,pState) {
    const pOptions = pProps.options
    const options = this.props.options
    if (!pOptions && options) {
      this.setState({
        original_options: options,
        options: options
      })
    }
  }
  
  render() {
    const elements = (this.state && this.state.options && this.state.options.elements) ? this.state.options.elements : undefined

    var inputboxes = <div></div>

    const el_ids = (elements) ? Object.keys(elements) : [];
    
    if (elements && el_ids.length > 0 ) {    
      inputboxes =  el_ids.map(el => {
        return   <Input
        key = {el}
        id = {el}
        onChange = {this.changeText}
        value = { ( elements[el] &&  elements[el].title ) ? elements[el].title : '' }
      />
      })
    }

    return (
      <>
      <Icon name='refresh' size='huge' onClick={this.onReset}/>
      { (elements && el_ids.length>0 ) && inputboxes } 
        <LookerFrame content={CONTENT} options={this.props.options} updateApp={this.props.updateApp}></LookerFrame>
      </>
    )
  }
}