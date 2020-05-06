import React, { Component } from 'react';
import styles from "./Slide.module.css"

class Slide extends Component {

  constructor(props) {
    super(props);
    this.slide = this.slide.bind(this)
    this.renderGrids = this.renderGrids.bind(this)
    let state = this.init()
    this.state = state
  }

  // Trying to use init method for resetting the game
  init() {
    let state = {
      inp: [7, 2, 5, 1, 3, 8, 4, 6, 0]
    }
    this.gridSize = 100
    this.input = state.inp.concat([]);
    this.width = 3
    this.height = 3
    return state;
  }

  // Sliding the clicked button to empty space if possible
  slide(inp) {
    let inpId = parseInt(inp.target.id)
    let indexInp = this.state.inp.indexOf(inpId)
    let indexEmp = this.state.inp.indexOf(0)

    let gridInpX = indexInp % this.width
    let gridInpY = parseInt(indexInp / this.height)

    let gridEmpX = indexEmp % this.width
    let gridEmpY = parseInt(indexEmp / this.height)

    // Not possible move, The input grid is far away from empty grid
    let cellDiff = gridEmpX - gridInpX + gridEmpY - gridInpY
    console.log(cellDiff)
    if (cellDiff !== 1 && cellDiff !== -1) {
      return
    }
    console.log("pos")
    let prevX = parseInt(inp.target.style["left"])
    let prevY = parseInt(inp.target.style["top"])
    if (!prevX) {
      prevX = 0
    }
    if (!prevY) {
      prevY = 0
    }
    console.log(prevY, prevX, inp.target.style["left"])
    inp.target.style["left"] = prevX + ((gridEmpX - gridInpX) * 100)+"px";
    inp.target.style["top"] = prevY + ((gridEmpY - gridInpY) * 100)+"px";
    let tempState = {...this.state}
    tempState.inp[indexInp] = 0
    tempState.inp[indexEmp] = inpId
    this.setState(tempState)
    console.log(tempState.inp)
    console.log(gridInpX - gridEmpX)
    console.log(indexInp, gridInpX, gridInpY)
    console.log(indexEmp, gridEmpX, gridEmpY)
  }

  renderGrids(width, height, state) {
    let buttons = []
    for (let x=0; x<width; x++) {
      for (let y=0; y<height; y++) {
        let index = (x*width)+y
        buttons.push(<button id={this.input[index]} className={styles.button} onClick={this.slide}>{this.input[index]}</button>)
      }
      buttons.push(<br></br>)
    }
    buttons.pop()
    buttons.pop()
    return buttons
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.buttonContainer}>
          {this.renderGrids(this.width, this.height, this.state)}
        </div>
        <div className={styles.infoContainer}></div>
      </div>
    )
  }

}

export default Slide;
