import React, {Component} from 'react';
import {LookerFrame} from './LookerFrame'

export class ExploreRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: "thelook",
      explore: "order_items"
    }
  }

  componentWillMount() {}
  componentDidMount() {}
  
  render() {
    const {props, state} = this;
    return (
      <>
        <div>
          <LookerFrame type='explore' {...props} {...state}></LookerFrame>
        </div>
      </>
    )
  }
}