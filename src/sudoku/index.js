import React, { Component } from 'react';
import styles from "./Sudoku.module.css"

class Sudoku extends Component {

  constructor(props){
    super(props);
    this.state = {
      gridSize: 9,
      data : [],
      ques : {}
    }
    // For handling the input via keypad inputs
    this.lastFocus = undefined
    this.handleGridInput = this.handleGridInput.bind(this);
    this.handleKeypadInput = this.handleKeypadInput.bind(this);
    // this.randomizeInput = this.randomizeInput.bind(this);
    this.resetFrom = this.resetFrom.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.solve = this.solve.bind(this);
    this.start = this.start.bind(this);
    this.start(9, 0)
  }

  // This is sample input for sudoku generator
  // Have to get the input from the below opensource api
  // http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=1

  start(size, difficulty) {
    let sampleInput = [{"x":0,"y":3,"value":1},{"x":1,"y":0,"value":1},{"x":1,"y":7,"value":2},{"x":1,"y":8,"value":8},{"x":2,"y":1,"value":6},{"x":2,"y":3,"value":8},{"x":2,"y":6,"value":1},{"x":3,"y":2,"value":3},{"x":3,"y":5,"value":1},{"x":3,"y":6,"value":7},{"x":4,"y":4,"value":8},{"x":4,"y":5,"value":3},{"x":5,"y":2,"value":6},{"x":5,"y":6,"value":3},{"x":6,"y":2,"value":9},{"x":7,"y":0,"value":5},{"x":7,"y":1,"value":3},{"x":7,"y":8,"value":2},{"x":8,"y":3,"value":7},{"x":8,"y":7,"value":1}]
    this.setupPuzzle(sampleInput)
  }

  setupPuzzle(apiResp) {
    const tempState = {
      gridSize: 9,
      data : [],
      ques : {}
    }
    apiResp.forEach((item, i) => {
      const index = (item.x * this.state.gridSize) + item.y
      const value = item.value
      tempState.data[index] = value

      // Json data, to reduce indexing
      tempState.ques[index] = true
    });
    this.setState(tempState)
    setTimeout(function () {
      this.setState(tempState)
    }.bind(this), 1000)
  }

  // For handling the input by directly pressing the respective numbers
  handleGridInput(inp, eve) {
    const id = inp.target.dataset.id
    const value = this.validateNum(inp.target.value)
    console.log(inp, eve)
    this.updateValue(id, value)
  }

  // Setting the focus cell id.
  setFocus(inp) {
    this.lastFocus = inp.target.dataset.id
    return
  }

  // For handling the keypad press input
  handleKeypadInput(inp) {
    const value = this.validateNum(inp.target.value)
    if (this.lastFocus) {
        this.updateValue(this.lastFocus, value)
    }
    this.lastFocus = null
  }

  // Only method to update values in the data
  updateValue(id, value) {
    const tempState = {...this.state}
    tempState.data[id] = value
    this.setState(tempState)
  }

  // Have to validate the input for grid cell.
  validateNum(inp) {
    let intInp = parseInt(inp)
    // TODO: limit the max value based on the grid size
    if (!isNaN(intInp) && intInp > 0 && intInp < 10) {
      return parseInt(inp)
    }
    return ""
  }

  solve() {
    let data = this.state.data
    let ques = this.state.ques
    let gridSize = this.state.gridSize
    let index = 0
    // Will decide in which direction the loop will proceed
    let prevDir = 1
    // console.log(this.getNotPossibleValues(data, 6, gridSize))
    // return
    // TODO: Have to add better check
    let st = Date.now()
    // let a = ""
    while (this.isFilled(data) && index < 81) {
      // TODO: Reformat the if section, better method.
      // a += index+","
      if (this.isQues(index, ques)) {
        index = index + prevDir
        continue
      }
      else {
        // Getting the old data to proceed from there, if not the the already placed data will loop infinetly
        let cachedValue = data[index]
        if (!cachedValue) {
          cachedValue = 1
        }
        // Default setting as -1, if the value placed it will become +1 and the loop moves forward
        prevDir = -1
        let notPossibleValues = this.getNotPossibleValues(data, index, gridSize)
        for (let i=cachedValue; i<gridSize+1; i++) {
          if (notPossibleValues.indexOf(i) === -1) {
            data[index] = i
            index = index + 1
            prevDir = 1
            break
          }
        }
        // All the numbers cant be placed and the loop is going backward
        if (prevDir === -1) {
          data[index] = 0
          index = index - 1
          prevDir = -1
        }
      }
    }
    console.log(Date.now() - st)
    // console.log(a)
    let final= {...this.state}
    final.data = data
    this.setState(final.data)
  }

  resetFrom(data, from) {
    for (let i=from; i<data.length; i++) {
      if (!this.isQues(i, this.state.ques)) {
        data[i] = 0
      }
    }
  }

  // Checks whether the cell(index) is prefilled or not
  // ques is the json the state.ques
  isQues(index, ques) {
    if (ques[index] === true) {
      return true
    }
    return false
  }

  // Gets the values of the concurrent row, column and grid
  getNotPossibleValues(data, index, gridSize) {
    let rowData = this.getRow(data, index, gridSize)
    let columnData = this.getColumn(data, index, gridSize)
    let subgridData = this.getSubgrid(data, index, gridSize)
    let allData = rowData.concat(columnData.concat(subgridData))
    // console.log(subgridData)
    return allData.filter(function (i){if (i){return i}})
  }

  // returns the empty (0, undefined) index in the data array.
  // from is optional argument to reduce loop count
  // return -1 if no empty value is found
  getNextEmptyIndex(data, from) {
    if (!from) {
      from = 0
    }
    for (let i=from; i<data.length; i++) {
      if (!data[i]) {
        return i
      }
    }
    return -1
  }

  isFilled(data) {
    return (data.indexOf(0) === -1 || data.indexOf(undefined) === -1)
  }

  // Will return the values in the row based on the index
  getRow(data, index, gridSize) {
    const rowData = []
    // Generating after Data
    for (let i=index+1; i < index+gridSize; i++) {
      if (i % gridSize === 0) {
        break
      }
      rowData.push(data[i])
    }
    // Generating current and before Data
    for (let i=index; i > index-gridSize; i--) {
      rowData.push(data[i])
      if (i % gridSize === 0) {
        break
      }
    }
    return rowData
  }

  // Will return the values in the column based on the index
  getColumn(data, index, gridSize) {
    const columnData = []
    // Generating after Data
    for (let i=index+gridSize; i < gridSize*gridSize; i+=gridSize) {
      columnData.push(data[i])
    }
    // Generating before Data
    for (let i=index-gridSize; i > -1; i-=gridSize) {
      columnData.push(data[i])
    }
    return columnData
  }

  // Will return the values in the Subgrid based on the index
  // A subgrid is 3x3 grid in a 9x9 sudoku
  getSubgrid(data, index, gridSize) {
    const subGridSize = Math.sqrt(gridSize)
    let subGridData = []
    const subGridIndexes = []
    // Spliting the entire sudoku grid into subgrid columns
    let subGridIndex = 0
    // To find in which column the current index is present
    let c = 0
    // Splitting the entire column in sub grid Size
    // e.g. 9x9; 27, 54, 81
    // Find where the index is placed in the above numbers
    // After this we can get row for each index
    for (let i=0; i<gridSize*gridSize; i+=gridSize*subGridSize) {
      if (index < i+gridSize*subGridSize && index >= i ) {
        subGridIndex = c
      }
      c++;
    }
    // console.log(subGridIndex)
    // console.log(this.getRow(data, 24, subGridSize), "ROW")
    for (let i=index+gridSize; i < (subGridIndex+1)*subGridSize*gridSize; i+=gridSize) {
      subGridIndexes.push(i)
      subGridData.push(data[i])
    }
    for (let i=index-gridSize; i > subGridIndex*subGridSize*gridSize; i-=gridSize) {
      subGridIndexes.push(i)
      subGridData.push(data[i])
    }
    subGridIndexes.forEach((item, i) => {
      subGridData = subGridData.concat(this.getRow(data, item, subGridSize))
    });
    return subGridData.concat(this.getRow(data, index, subGridSize))
  }

  getGrid(state) {
    let grid = []
    for (let i=0; i<state.gridSize; i++) {
      for (let j=0; j<state.gridSize; j++) {
        const curIndex = (i*state.gridSize) + j
        let isQues = false
        if (state.ques[curIndex]) {
          isQues = true
        }
        let value = this.state.data[curIndex]
        if (value === undefined) {
          value = ""
        }
        grid.push(<input
          value={value}
          onInput={this.handleGridInput}
          onFocus={this.setFocus}
          data-id={curIndex}
          data-ques={isQues}
          disabled={isQues}
          key={curIndex}
          maxLength={1}
          className={styles.grid}
          // placeholder={curIndex}
          type="text" />)
      }
      grid.push(<br></br>)
    }
    return grid
  }

  getKeyPad() {
    let keyPad = []
    let list = [1,2,3,4,5,6,7,8,9,"*","C","#"]
    for ( let i=0; i<list.length; i++) {
      keyPad.push(<input type="button" value={list[i]} onClick={this.handleKeypadInput}/>)
      if ((i+1) % 3 === 0) {
        keyPad.push(<br></br>)
      }
    }
    return keyPad
  }

  render() {
    return (
      <div>
        <div>
          <label>Size:</label>
            <select type="number">
              <option value="6">6</option>
              <option value="9">9</option>
            </select>
          <label>Difficulty :</label>
            <select type="number">
              <option value="0">Easy</option>
              <option value="1">Medium</option>
              <option value="2">Hard</option>
            </select>
            <input type="button" value="New Game" onClick={this.start} />
        </div>
        <div className={styles.container}>
          <div>
            {this.getGrid(this.state)}
          </div>
          <div>
            {this.getKeyPad()}
          </div>
        </div>
        <div>
          <input type="button" value="Solve" onClick={this.solve} />
        </div>
      </div>
    )
  }
}
export default Sudoku
