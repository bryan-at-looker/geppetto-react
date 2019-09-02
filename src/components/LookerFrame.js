import React, {Component} from 'react';
import {map, isEmpty, isEqual, find} from 'lodash'

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

  init = () => {

  }

  messageDashboard = (dashboard) => {
    var {messages} = this.props
    if (!isEqual(messages.dashboard, dashboard)) {
      messages.dashboard = dashboard
      this.props.updateApp({messages: messages})
    }
  }

  messagePage = (page) => {
    var {messages} = this.props
    if (!isEqual(messages.page, page)) {
      messages.page = page
      this.props.updateApp({messages: messages})
    }
  }

  messageHeight = (height) => {
    var {messages} = this.props
    if (!isEqual(messages.height, height)) {
      messages.height = height
      this.props.updateApp({messages: messages})
    }
  }

  messageLook = (look) => {
    var {messages} = this.props
    if (!isEqual(messages.look, look)) {
      messages.look = look
      this.props.updateApp({messages: messages})
    }
  }

  messageTile = (tile) => {
    var {messages} = this.props
    var tiles = (messages.tiles) ? messages.tiles.map(tl => {return tl}) : []
    var found = find(tiles, function(o) { return tile.id == o.id } )

    if (!found) {
      tiles.push(tile)
      messages.tiles = tiles
      this.props.updateApp({messages: messages})
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
                this.props.updateApp({options: data.dashboard.options})
              }
              if (data.dashboard) { this.messageDashboard(data.dashboard) }
              if (data.page) { this.messagePage(data.page) }
              if (data.height) { this.messageHeight(data.height) }
              if (data.look) { this.messageLook(data.look) }
              if (data.tile) { this.messageTile(data.tile) }
            }
          }
        }
      }
    });
  }
  componentDidMount() {}

  componentDidUpdate(prevProps,pstate) {
    const {props} = this;
    if ( prevProps && prevProps.options 
      &&  props &&  props.options && props.options != {}) {

      const poptions = prevProps.options
      const {options} = props

      // console.log({options: options, poptions: poptions})
      if (options && !isEmpty(options) && poptions && !isEmpty(poptions)) {
        if (!isEqual(poptions, options)) {
          console.log({options: options, poptions: poptions})
          const my_request = objectDeepDiff(options, poptions)
          console.log(my_request)
          const my_iframe = document.getElementById(FRAME_ID);
          my_request.type = 'dashboard:options:set'
  
          console.log(my_request)
          my_iframe.contentWindow.postMessage(JSON.stringify(my_request), INSTANCE);
        }
      }
    }
  }

  updateRunDashboard() {

  }
  
  render() {
    const {height} = this.props.messages
    const {id, type, filters} = this.props.content
    const {model, explore} = this.props
    
    return (
      <>
        <iframe
          id={FRAME_ID}
          src={urlBuilder(id,type,filters)}
          onLoad={this.init}
          style={{height: (height)? String(height)+'px' : ''}}
        >
        </iframe>
      </>
    )
  }
}

const urlBuilder = (id, type, filters) => {
  const origin = window.location.origin
  var qq = ''
  if (!isEmpty(filters)) {
    qq = '&'+map(filters,function(v,k){
      return encodeURIComponent(k) + '=' + encodeURIComponent(v);
    }).join('&');
  }
  return `/embed/${type}s-next/${id}?embed_domain=${origin}&theme=${DEFAULT_THEME}&${qq}`
}

const objectDeepDiff = (data, oldData) => {
  var record = {};
  Object.keys(data).forEach((key) => {
    // If is an object, and the object isn't equal
    if ((typeof data[key] === "object" && !isEqual(data[key], oldData[key]))) {
      record[key] = objectDeepDiff(data[key], oldData[key]);
    }
    // Checks that isn't an object and isn't equal
    if (!(typeof data[key] === "object" && isEqual(data[key], oldData[key]))) {
      record[key] = data[key];
    }
  });
  return record;
}