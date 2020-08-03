import React, { Component } from 'react';
// import styles from "./about.module.css"

class Works extends Component {

  constructor() {
    super()
    this.data = [
      ["Knightstour"],
      ["Slide"],
    ]
  }

  renderCard(data) {
    return (
      <p>{data}</p>
    )
  }

  renderCards(data) {
    return (
      <div>
        {data.map(function (i, j ) {
          return (this.renderCard(i))
        }.bind(this))}
      </div>
    )
  }
  render() {
    return (
      <div>
        {this.renderCards(this.data)}
      </div>
    )
  }
}
export default Works;
