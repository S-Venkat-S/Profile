import React, { Component } from 'react';
// import styles from "./Snake.module.css"

class Snake extends Component {

  constructor(props) {
    super(props);
    this.touchend = this.touchend.bind(this)
    this.touchstart = this.touchstart.bind(this)
    this.touchmove = this.touchmove.bind(this)
    this.keypress = this.keypress.bind(this)
    let state = this.init()
    this.state = state
    this.tStart = []
    this.tMove = []
    // Size of the single cell
    this.cellSize = 30
    // Configuring the keyboard keys for their corresponding directions
    this.keyCode = {
      38 : "U", //Key Up
      40 : "D", //Key Down
      37 : "L", //Key Left
      39 : "R", //Key Right
      87 : "U", //W
      83 : "D", //S
      65 : "L", //A
      68 : "R", //D
    }
  }

  init() {
    let state = {}
    state.height = window.screen.availHeight
    state.width = window.screen.availWidth
    return state;
  }

  componentDidMount() {
    window.addEventListener('touchend', this.touchend);
    window.addEventListener('touchstart', this.touchstart);
    window.addEventListener('touchmove', this.touchmove);
    window.addEventListener('keyup', this.keypress);
  }

  keypress(evnt) {
    console.log(this.keyCode[evnt.keyCode])
  }

  // Calculating the draging direction.
  touchend() {
    console.log(this.getScrollDirection())
  }

  getScrollDirection() {
    let xDiff = this.tStart[0] - this.tMove[0]
    let yDiff = this.tStart[1] - this.tMove[1]
    // Converting both the difference in to positive number
    // and calculating which is higher. We can't always drag in a straight line
    // This is necessary to calculate or guess the user slided direction

    // Horizontal difference is more than the vertical difference
    // Then the we try to move left or right
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Sliding in the left direction
      if (xDiff > 0) {
        return "L";
      }
      // Sliding in the right direction
      else if (xDiff < 0) {
        return "R";
      }
    }
    else {
      // Sliding in the Up direction
      if (yDiff > 0) {
        return "U";
      }
      // Sliding in the Down direction
      if (yDiff < 0) {
        return "D";
      }
    }
  }

  touchstart(evnt) {
    this.tStart = [evnt.targetTouches[0].pageX, evnt.targetTouches[0].pageY]
  }

  touchmove(evnt) {
    // console.log(evnt)
    this.tMove = [evnt.targetTouches[0].pageX, evnt.targetTouches[0].pageY]
  }

  render() {
    return (
      <canvas width={this.state.width} height={this.state.height}></canvas>
    )
  }
}

export default Snake;
