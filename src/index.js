import React, {Component, Suspense} from 'react'
import ReactDOM from 'react-dom';
import {Navigation} from './components/Navigation'
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

const HomeRoute = React.lazy(() => import('./components/HomeRoute'));
const ChangeTitles = React.lazy(() => import('./components/ChangeTitlesRoute'));
const HideTiles = React.lazy(() => import('./components/HideTilesRoute'));
const UpdateText = React.lazy(() => import('./components/UpdateTextRoute'))
const Tester = React.lazy(() => import('./components/tester'))
const SelectVisualization = React.lazy(() => import('./components/SelectVisualizationRoute'))
const SelectLayout = React.lazy(() => import('./components/SelectLayoutRoute'))


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dashboards: '',
      content: {
        type: 'dashboard',
        id: 'thelook::business_pulse',
        filters: {}
      },
      messages: {}
    };
  }

  updateApp = (object) => { this.setState(object)}
  
  componentWillMount() {
  }
  
  render() {
    const { options } = this.state

    return (
      <>
        
        <Router basename={'/applications/'+window.lookerMetadata.app.id}>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation updateApp={this.updateApp}></Navigation>
            <Route path='/' exact component={HomeRoute} />       
            <Route path='/tester'
              render={() => <Tester options={options} updateApp={this.updateApp}/>} 
            />     
            <Route path='/hidetiles'
              render={() => <HideTiles  options={options} updateApp={this.updateApp}/>} 
            />
            <Route path='/selectviz'
              render={() => <SelectVisualization options={options} updateApp={this.updateApp}/>} 
            />
            <Route path='/changetitles'
              render={() => <ChangeTitles  options={options} updateApp={this.updateApp}/>} 
            />
            <Route path='/updatetext'
              render={() => <UpdateText  options={options} updateApp={this.updateApp}/>} 
            />
            <Route path='/selectlayout'
              render={() => <SelectLayout  options={options} updateApp={this.updateApp}/>} 
            />
          </Suspense>
        </Router>
      </>
      )
    }
  }
  
  window.addEventListener('load', () => {
    ReactDOM.render( <App />, document.getElementById('app-container'));
  }, false); 
  
  function path(route) {
    const app = window.lookerMetadata.app.id
    return `/applications/${app}${route}`
  }