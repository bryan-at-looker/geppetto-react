import React, {Component} from 'react';
import AceEditor from 'react-ace';
import { LookerFrame } from './LookerFrame';
import beautify from 'json-beautify';
import {Button, ButtonGroup, Loader, Dimmer, Segment} from 'semantic-ui-react'

import 'brace/mode/json';
import 'brace/theme/github';

import './Tester.css'

const CONTENT = {
  type: 'dashboard',
  id: '18'
}

export default class Tester extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {}
  componentDidMount() {}
  componentDidUpdate(pProps,pState) {
    const pOptions = pProps.options
    const options = this.props.options
    if (!pOptions && options) {
      const options_beautify = beautify(JSON.parse(JSON.stringify(options)), null, 2, 100)
      this.setState({options: options_beautify, original_options: options_beautify})
    }
  }

  onChange = (new_value) => { this.setState({options: new_value}); }
  onSubmit = ( event, data ) => { this.props.updateApp({options: JSON.parse(this.state.options)}); }
  onReset = ( event, data ) => { 
    this.setState({options: this.state.original_options}); 
    this.props.updateApp({options: JSON.parse(this.state.original_options)}); 
  }
  
  render() {
    const { updateApp } = this.props;
    const { options } = this.state;

    
    return (
      <>
       <div className='ace-left'>
        <ButtonGroup fluid>
        <Button 
          onClick={this.onSubmit}
          >Submit Changes</Button>
        <Button 
          onClick={this.onReset}
          >Reset Changes</Button>
        </ButtonGroup>      
        { options && <AceEditor
          mode="json"
          width="100%"
          height='inherit'
          theme="github"
          onChange={this.onChange}
          value={options}
          name="ace_tester"
          showPrintMargin={false}
        /> }
        </div>
        <div id='looker-segment' className='looker-right'>
          <LookerFrame 
            options={this.props.options}
            content={CONTENT}
            updateApp={updateApp}
          ></LookerFrame>
        </div>
      </>
    )
  }
}