import React, { Component } from 'react';
import Utils from "../Utils/Uarray.js"
import styles from "./Slide.module.css"

class Slide extends Component {

  constructor(props) {
    super(props);
    this.init = this.init.bind(this)
    this.slide = this.slide.bind(this)
    this.changeWidth = this.changeWidth.bind(this)
    this.changeHeight = this.changeHeight.bind(this)
    this.updateSeq = this.updateSeq.bind(this)
    this.renderGrids = this.renderGrids.bind(this)
    this.solve = this.solve.bind(this)
    let state = this.init(false)
    this.state = state
  }

  // Trying to use init method for resetting the game
  init(buttonClick) {
    let state = {
      inp: [7,2,1,8,5,4,3,6,0],
      width: 3,
      height: 3,
      gridSeq: ""
    }
    if (buttonClick) {
      state.width = parseInt(this.state.width)
      state.height = parseInt(this.state.height)
      state.inp = this.validateInp(this.state.gridSeq, state.width, state.height)
    }
    this.gridSize = 100
    // Copy for the UI state
    this.input = state.inp.concat([]);
    this.width = state.width
    this.height = state.height
    this.cache = {}
    this.emptyCell = React.createRef()
    // not a best way to implement :(
    if (buttonClick) {
      this.setState(state)
    }
    return state;
  }

  // Validating the input of the custom input sequence.
  validateInp(inp, width, height) {
    if (!inp) {
      return this.generateSeq(width, height)
    }
    inp = inp.split(", ")
    inp = inp.filter((value, index) => {
      return inp.indexOf(value) === index
    })
    if (inp.length !== width*height) {
      alert("Invalid input sequence")
      return []
    }
    return inp.map((value) => {
      return parseInt(value)
    })
  }

  // Returns the inversion for the current arr
  checkInversions(arr) {
    if (arr.length == 0) {
      return false
    }
    let inversions = 0
    for (let i=0; i<arr.length; i++) {
      let curVal = arr[i]
      let beforeArr = arr.
      for (let j=0; j<)
    }
  }

  // TODO: Have to add real generate method based on
  // https://www.cs.bham.ac.uk/~mdr/teaching/modules04/java2/TilesSolvability.html
  generateSeq(width, height) {
    let mainArr = []
    for (let i=1; i<width*height; i++) {
      mainArr.push(i)
    }
    let seqArr = []
    while (!checkInversions(seqArr)) {
      while (seqArr.length !== (width*height)-1) {
        let randInt = this.getRandInt(mainArr.length)
        seqArr.push(mainArr[randInt])
        // Removing the empty arr
        mainArr = mainArr.splice(randInt, 1)
      }
    }
  }

  //get random number from 0 to end
  getRandInt(max) {
    return parseInt(Math.random()*max)
  }

  // Solving the slide puzzle using BFS recurssion:)
  // It shows solved but how to get the path ?
  solve(inp) {
    let nxtSeq = []
    for (let j=0;j <inp.length; j++) {
      let curSt = inp[j]
      let possibleMoves = this.getPossibleMoves(curSt)
      // TODO: change the below line
      let res = "1,2,3,4,5,6,7,8,0"
      for (let i=0; i<possibleMoves.length; i++) {
        let curMov = possibleMoves[i]
        let nxt = this.swap(curSt, curMov)
        if (this.cache[nxt.join()]) {
          continue
        }
        this.cache[nxt.join()] = true
        nxtSeq.push(nxt)
        this.temp[nxt.join()] = curSt.join()
        if (nxt.join() === res) {
          window.tmp = this.temp
          return this.getPath(this.temp, this.state.inp)
        }
      }
    }
    return this.solve(nxtSeq)
  }

  // Trace the path of the slide
  getPath(pathMap, start) {
    let solvedPath = []
    solvedPath.push("1,2,3,4,5,6,7,8,0")
    while(solvedPath[solvedPath.length-1] !== start.join()) {
      let nxt = solvedPath[solvedPath.length-1]
      solvedPath.push(pathMap[nxt])
    }
    console.log(this.getPathIndex(solvedPath))
    return this.getPathIndex(solvedPath);
  }

  getPathIndex(solvedPath) {
    return solvedPath.map((i) => {
      return i.split(",").indexOf("0")
    })
  }

  // Swaps the value in the index to the zero placed index
  // arr input does not mutate
  swap(arr, index) {
    let newArr = arr.concat([])
    let indexEmp = newArr.indexOf(0)
    newArr[indexEmp] = newArr[index]
    newArr[index] = 0
    return newArr;
  }

  // Return all the possible move (one tile) and return its indexes
  getPossibleMoves(inp) {
    let indexEmp = inp.indexOf(0)
    // Getting all the four side index of the grid
    let topIndex = indexEmp - this.width < 0 ? false : indexEmp - this.width
    let bottomIndex = indexEmp + this.width >= this.width*this.height ? false : indexEmp + this.width
    // Already the zero is in the left most cell, no further left positions available
    let leftIndex = indexEmp % this.width === 0 ? false : indexEmp - 1
    // The next right tile is below, so its not possible
    let rightIndex = (indexEmp + 1) % this.width === 0 ? false : indexEmp + 1
    // Returning only the non false values.
    return [topIndex, bottomIndex, leftIndex, rightIndex].filter((value)=>{return value !== false})
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
    if (cellDiff !== 1 && cellDiff !== -1) {
      return
    }
    let prevX = !parseInt(inp.target.style["left"]) ? 0 : parseInt(inp.target.style["left"])
    let prevY = !parseInt(inp.target.style["top"]) ? 0 : parseInt(inp.target.style["top"])
    inp.target.style["left"] = prevX + ((gridEmpX - gridInpX) * 100)+"px";
    inp.target.style["top"] = prevY + ((gridEmpY - gridInpY) * 100)+"px";
    let tempState = {...this.state}
    tempState.inp[indexInp] = 0
    tempState.inp[indexEmp] = inpId
    this.setState(tempState)
  }

  renderGrids(width, height, state) {
    let buttons = []
    for (let x=0; x<width; x++) {
      for (let y=0; y<height; y++) {
        let index = (x*width)+y
        buttons.push(<button
          id={this.input[index]}
          className={styles.button}
          ref={this.input[index] == 0 ? this.emptyCell : null}
          onClick={this.slide}>{this.input[index]}</button>)
      }
      buttons.push(<br></br>)
    }
    buttons.pop()
    buttons.pop()
    return buttons
  }

  changeWidth(inp) {
    this.setState({width: parseInt(inp.target.value)})
  }

  changeHeight(inp) {
    this.setState({height: parseInt(inp.target.value)})
  }

  updateSeq(inp) {
    this.setState({gridSeq: inp.target.value})
  }

  renderInfo() {
    return (
      <div>
        <label> Width :
          <select onChange={this.changeWidth} value={this.state.width}>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <label> Height :
          <select onChange={this.changeHeight} value={this.state.height}>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>
        <br></br>
        Grid Sequence : <input type="text" onChange={this.updateSeq} value={this.state.gridSeq} placeholder="Comma seperated input" />
        <br></br>
        <input type="button" value="New Game" onClick={() => this.init(true)} />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          {this.renderInfo()}
        </div>
        <div className={styles.buttonContainer}>
          {this.renderGrids(this.width, this.height, this.state)}
        </div>
        <input type="button" value="Solve" onClick = {() => console.log(this.solve([this.state.inp]))} />
      </div>
    )
  }

}

export default Slide;
