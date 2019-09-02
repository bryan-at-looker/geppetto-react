import React, {Component} from 'react';
import { Form, TextArea, Input } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';
import {sample, filter} from 'lodash'

import './UpdateTextRoute.css'

const CONTENT = {
  id: '18',
  type: 'dashboard',
  filters: {}
}

export default class UpdateText extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {}
  componentDidMount() {}

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

  onChange = ( event, data ) => {
    const el_id = data.id.split('::')[0]
    const key = data.id.split('::')[1]
    var options = JSON.parse(JSON.stringify(this.state.options));
    var elements = options.elements;

    elements[el_id]['vis_config'][key] = data.value;

    this.setState({options: options})
    this.props.updateApp({options: options})
    
  }
  
  render() {

    const {options} = this.state
    const elements = (options && options.elements) ? options.elements : undefined

    const el_ids = (elements) ? Object.keys(elements) : [];

    var text_tile_els = [];
    var text_inputs = <></>

    if (el_ids.length > 0) {

      el_ids.forEach(el => {
        if (elements[el] && elements[el].vis_config && elements[el].vis_config.type && elements[el].vis_config.type == 'text') {
          text_tile_els.push(el);
        }
      })
      if ( text_tile_els.length > 0 ) {
        text_inputs = text_tile_els.map(el => {

          return (
            <TextFieldForm key={el} el={el} elements={elements} onChange={this.onChange}></TextFieldForm>
          )
        })
      }
    }

    return (
      <>
        <div className = 'form-left'>
          { (text_tile_els.length > 0 ) && text_inputs }
        </div>
        <div className = 'looker-right'>
          <LookerFrame content={CONTENT} options={this.props.options} updateApp={this.props.updateApp}></LookerFrame>
        </div>
      </>
    )
  }
}
function TextFieldForm (props) {
  const el = props.el
  const elements = props.elements
  return (
    <>
    <br/>
    <div >
      <h3 >Element: {el}</h3>
      <Form >
        <Form.Group key={el} widths='equal'>
          <Form.Field
            id={el+'::'+'title_text'}
            control={Input}
            label='Title'
            value={elements[el].vis_config.title_text}
            onChange={props.onChange}
          />
          <Form.Field
            id={el+'::'+'subtitle_text'}
            control={Input}
            label='Subtitle'
            value={elements[el].vis_config.subtitle_text}
            onChange={props.onChange}
          />
        </Form.Group>
        <Form.Field
          id={el+'::'+'body_text_as_html'}
          control={TextArea}
          label='Body'
          value={elements[el].vis_config.body_text_as_html}
          onChange={props.onChange}
        />
      </Form>
    </div>
    </>
  )
}