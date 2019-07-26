import React, {Component} from 'react';

export class HomeRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentWillMount() {}
  componentDidMount() {}
  
  render() {
    return (
      <>
        <div style={{"height":"100px"}}></div>
       <img style={{"display":"block", "margin":"auto"}} src="https://bryan-at-looker.s3.amazonaws.com/geppetto/Pinocchio-600x459.png"/>
       <h1>Its still a little buggy</h1>
      </>
    )
  }
}