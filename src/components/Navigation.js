import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import { find } from 'lodash';

export class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        ["Home", "/"],
        ["Change Titles","/changetitles"],
        ['Hide / Show Tiles', "/hidetiles"],
        ["Update Text","/updatetext"],
        ["Select Viz",'/selectviz'],
        ["Select Layouts",'/selectlayout'],
        ["Hidden Layouts",'/hiddenlayouts'],
        ["Compare Measures",'/comparemeasures'],
        ["tester","/tester"]
      ]
    }
  }

  handleItemClick = (e, data ) => { 
    this.setState({ activeItem: data.to })
    this.props.updateApp({options: undefined, dashboard_filters: undefined})
  } 

  menuItem = (items) => {
    var item_map = items.map(item => {
      return (
        <Menu.Item 
          as={Link}
          to={item[1]}
          name={item[0]} 
          key = {item[1]} 
          active={this.state.activeItem === item[1]} 
          onClick={this.handleItemClick} 
        />
      )
    })
    return item_map
  }

  componentWillMount() {
    const path_split = window.location.pathname.split('/')
    const last = path_split[path_split.length - 1]
    const active = find(this.state.items, function(o) {
      return o[1] == '/'+last
    })
    if (active) {
      this.setState({activeItem: active[1]})
    } else if (last == '/' || last == '' || last == window.lookerMetadata.app.id) {
      this.setState({activeItem: '/'})
    }
  }

  render() {
    const { activeItem, items } = this.state


    return (
      <Segment inverted>
        <Menu 
          inverted pointing secondary
          >
              {this.menuItem(items)}
        </Menu>
      </Segment>
    )
  }

}