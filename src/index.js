import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import { api31Call } from './helpers';
import {LookerFrame} from './components/LookerFrame'
import {DashboardRoute} from './components/DashboardRoute'
import {Navigation} from './components/Navigation'
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { HomeRoute } from './HomeRoute';
import { ComingSoon } from './components/ComingSoon';
import { ExploreRoute } from './components/ExploreRoute';
import { RandomTheme } from './components/RandomThemeRoute';
import { HideTitles } from './components/HideTitlesRoute';
import { TabbedDashboards } from './components/TabbedDashboardsRoute';
import { ChangeVisualization } from './components/ChangeVisualizationRoute';
import { ChangeTitles } from './components/ChangeTitlesRoute';
import { HideTiles } from './components/HideTilesRoute';
import { UpdateText } from './components/UpdateTextRoute';




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
    api31Call('GET', '/spaces/lookml/dashboards')
    .then(dashboards =>{
      const dbs = dashboards.map(db =>{
        return {
          id: db.id,
          type: 'dashboard',
          name: db.title
        }
      })
      this.setState({dashboards: dbs });
    })
  }
  
  render() {
    const {content, dashboards, messages} = this.state
    
    return (
      <>
        
        <Router basename={'/applications/'+window.lookerMetadata.app.id}>
          <Navigation updateApp={this.updateApp}></Navigation>
          <Route path='/' exact component={HomeRoute} />            
          <Route path="/dashboards"
          render={() => <DashboardRoute content={content} dashboards={dashboards} messages={messages} updateApp={this.updateApp}/>} />
          <Route path='/looks'  component={ComingSoon} />      
          <Route path='/explores' component={ComingSoon} />      
          <Route path='/randomtheme'
          render={() => <RandomTheme content={content} messages={messages} updateApp={this.updateApp}/>} />
          <Route path='/hidetitles'
          render={() => <HideTitles  messages={messages} updateApp={this.updateApp}/>} />
          <Route path='/hidetiles'
          render={() => <HideTiles  messages={messages} updateApp={this.updateApp}/>} />
          <Route path='/changetitles'
          render={() => <ChangeTitles  messages={messages} updateApp={this.updateApp}/>} />
          <Route path='/updatetext'
          render={() => <UpdateText  messages={messages} updateApp={this.updateApp}/>} />
          <Route path='/tabbeddashboards'
          render={() => <TabbedDashboards content={content} messages={messages} updateApp={this.updateApp}/>} />
          <Route path='/changeviz'
          render={() => <ChangeVisualization messages={messages} updateApp={this.updateApp}/>} />
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