import React, { Component } from 'react';
import styles from "./index.module.css"
import Hire from "./hire.js"
import Works from "./works.js"
import About from "./about.js"
import Skills from "./skills.js"

class Portfolio extends Component {

  constructor() {
    super()
    this.changeSubTab = this.changeSubTab.bind(this)
    this.pages = {
      0 : <About />,
      1 : <Skills />,
      2 : <Works />,
      3 : <Hire />,
    }
    this.state = {selected : 0}
  }

  changeSubTab(id) {
    this.setState({"selected": id})
  }

  renderNav() {
    return (
      <nav className={styles.nav}>
        <ul>
          <li onClick={()=>this.changeSubTab(0)} data-selected={this.state.selected === 0 ? true : false}>About Me</li>
          <li onClick={()=>this.changeSubTab(1)} data-selected={this.state.selected === 1 ? true : false}>Skills</li>
          <li onClick={()=>this.changeSubTab(2)} data-selected={this.state.selected === 2 ? true : false}>Works</li>
          <li onClick={()=>this.changeSubTab(3)} data-selected={this.state.selected === 3 ? true : false}>Hire Me</li>
        </ul>
      </nav>
    )
  }

  render() {
    return (
      <div className={styles.container} >
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto');
      </style>
        {this.renderNav()}
      <div>
        {this.pages[this.state.selected]}
      </div>
      </div>
    )
  }
}
export default Portfolio;
