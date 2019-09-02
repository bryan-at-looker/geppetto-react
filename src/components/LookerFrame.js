import React, {Component} from 'react';
import {isEqual} from 'lodash'

import './LookerFrame.css'

const DEFAULT_THEME='arielle_test'
const FRAME_ID='looker'
const INSTANCE='https://johnkuitheme.dev.looker.com'

export class LookerFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {
    window.addEventListener("message", (event) => {
      if(document.getElementById("looker") && document.getElementById("looker").contentWindow) {
        if (event.source === document.getElementById("looker").contentWindow) {
          if (event.origin === window.location.origin) {
            const data = JSON.parse(event.data)
            if (data) {
              console.log({type: data.type, data: data})
              if (data.type == 'dashboard:run:complete') {
                console.log(data.dashboard.options)
                this.props.updateApp({options: data.dashboard.options, dashboard_filters: data.dashboard.dashboard_filters})
              } else if ( data.type == 'dashboard:filters:changed') {
                this.props.updateApp({ dashboard_filters: data.dashboard.dashboard_filters })
              }
            }
          }
        }
      }
    });
  }
  componentDidMount() {}

  checkOptionChanges = (pOptions,options) => {
    if (!isEqual(options, pOptions)) {
      var iframe = document.getElementById(FRAME_ID);
      var my_request = {
        type: 'dashboard:options:set'
      }
      // Check is layouts have changed
      if (!isEqual(options.layouts,pOptions.layouts) ) { my_request['layouts'] = options.layouts  }
      if (!isEqual(options.elements,pOptions.elements) ) { 
        var new_elements = {}
        // Check Each Element for changes
        Object.keys(options.elements).forEach(el => {
          if (!isEqual(options.elements[el],pOptions.elements[el])) { new_elements[el] = options.elements[el]}
        })
        my_request['elements'] = new_elements
      }
      console.log(my_request);
      iframe.contentWindow.postMessage(JSON.stringify(my_request), INSTANCE);
    }
  }

  componentDidUpdate(pProps,pstate) {
    const {options} = (this.props) ? this.props : null;

    if (options && pProps && pProps.options) {
      this.checkOptionChanges(pProps.options,options);
    }
  }

  updateRunDashboard() {

  }
  
  render() {
    const {content} = this.props
    var url = ( content && content.type && content.id ) ? 
      `${INSTANCE}/embed/${content.type}s-next/${content.id}?embed_domain=${window.location.origin}&theme=${DEFAULT_THEME}` : 
      `${INSTANCE}/embed/dashboards-next/18?embed_domain=${window.location.origin}&theme=${DEFAULT_THEME}`
   
    return (
      <>
        <iframe
          id={FRAME_ID}
          src={url}
          onLoad={this.init}
        >
        </iframe>
      </>
    )
  }
}