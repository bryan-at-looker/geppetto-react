import React, {Component} from 'react';
import { api31Call } from '../helpers';
import { Icon } from 'semantic-ui-react'
import { LookerFrame } from './LookerFrame';

export class RandomTheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_themes: []
    }
  }

  randomize = () => {
    const {all_themes} = this.state
    var shuffle = all_themes.sort(() => Math.random() - 0.5);
    this.setState({all_themes: shuffle})
  }

  componentWillMount() {
    api31Call('GET','/themes')
    .then(r=>{
      this.setState({all_themes: r})
    })
  }
  componentDidMount() {}
  
  render() {
    const {props} = this
    const {all_themes} = this.state
    return (
      <>
        <Icon name='random' size='huge' onClick={this.randomize}/>
        <LookerFrame {...props}></LookerFrame>
      </>
    )
  }
}