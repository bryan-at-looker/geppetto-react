import React, {Component, Suspense} from 'react'
import ReactDOM from 'react-dom';
// import { api31Call } from './helpers';
// import {LookerFrame} from './components/LookerFrame'
// import {DashboardRoute} from './components/DashboardRoute'
import {Navigation} from './components/Navigation'
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

const HomeRoute = React.lazy(() => import('./components/HomeRoute'));
const ComingSoon = React.lazy(() => import('./components/ComingSoon'));
const HideTitles = React.lazy(() => import('./components/HideTitlesRoute'));
const ChangeTitles = React.lazy(() => import('./components/ChangeTitlesRoute'));
const HideTiles = React.lazy(() => import('./components/HideTilesRoute'));
const UpdateText = React.lazy(() => import('./components/UpdateTextRoute'))
const Tester = React.lazy(() => import('./components/tester'))
const SelectVisualization = React.lazy(() => import('./components/SelectVisualizationRoute'))


// import { HomeRoute } from './HomeRoute';
// import { ComingSoon } from './components/ComingSoon';
// import { ExploreRoute } from './components/ExploreRoute';
// import { RandomTheme } from './components/RandomThemeRoute';
// import { HideTitles } from './components/HideTitlesRoute';
// import { TabbedDashboards } from './components/TabbedDashboardsRoute';
// import { ChangeVisualization } from './components/ChangeVisualizationRoute';
// import { ChangeTitles } from './components/ChangeTitlesRoute';
// import { HideTiles } from './components/HideTilesRoute';
// import { UpdateText } from './components/UpdateTextRoute';
// import { SelectVisaulization } from './components/SelectVisualizationRoute';




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
    const {content, dashboards, messages, options} = this.state
    
    // <Route path="/dashboards"
    // render={() => <DashboardRoute content={content} dashboards={dashboards} messages={messages} updateApp={this.updateApp}/>} />
    // <Route path='/looks'  component={ComingSoon} />      
    // <Route path='/explores' component={ComingSoon} />      
    // <Route path='/randomtheme'
    // render={() => <RandomTheme content={content} messages={messages} updateApp={this.updateApp}/>} />
    // <Route path='/hidetitles'
    // render={() => <HideTitles  options={options}  messages={messages} updateApp={this.updateApp}/>} />

    // <Route path='/changetitles'
    // render={() => <ChangeTitles  options={options}  messages={messages} updateApp={this.updateApp}/>} />
    // <Route path='/updatetext'
    // render={() => <UpdateText  options={options}  messages={messages} updateApp={this.updateApp}/>} />
    // <Route path='/tabbeddashboards'
    // render={() => <TabbedDashboards content={content} messages={messages} updateApp={this.updateApp}/>} />

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