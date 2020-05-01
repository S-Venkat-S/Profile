import React, { Component } from 'react';
import styles from "./Sudoku.module.css"
import Uarray from "../Utils/Uarray";

class Sudoku extends Component {

  constructor(props){
    super(props);
    this.state = {
      gridSize: 9,
      data : [],
      ques : {},
      error: {}
    }

    //This is for references for respective grid, column and row
    this.references = {
      "rows" : [],
      "columns" : [],
      "grids" : [],
      "cell_index" : {},
    }

    this.difficulties = {
      0 : "easy",
      1 : "medium",
      2 : "hard",
      3 : "random"
    }

    this.difficulty = 0

    // For handling the input via keypad inputs
    this.lastFocus = undefined
    this.handleGridInput = this.handleGridInput.bind(this);
    this.handleKeypadInput = this.handleKeypadInput.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.solve = this.solve.bind(this);
    this.start = this.start.bind(this);
    this.setDifficulty = this.setDifficulty.bind(this)
    this.startNewGame = this.startNewGame.bind(this)
    this.setupReference(this.state.gridSize)
    // this.setState({...this.state})
  }

  componentDidMount() {
    this.start(9, 0)
  }

  // Updates the difficulty of the game
  setDifficulty(inp) {
    this.difficulty = inp.target.value
  }

  // Starts the new game
  startNewGame() {
    this.start(9, this.difficulty)
    this.setupReference(this.state.gridSize)
  }

  // Setting up the references for easy access of values.
  // This is much helpful for designing by css.
  setupReference(gridSize) {
    let allRows = []
    let allColumns = []
    let allGrids = []
    // Using an temporary for searching already placed rows inside allrows
    // indeOf for array inside an array doesn't work because of instance
    let allRowsStr = []
    let allColumnsStr = []
    let allGridsStr = []
    for (let i=0; i<gridSize*gridSize; i++) {
      let row = Uarray.sortAsc(this.getRowIndexes(i, gridSize))
      let column = Uarray.sortAsc(this.getColumnIndexes(i, gridSize))
      let grid = Uarray.sortAsc(this.getSubgridIndexes(i, gridSize))
      if (allRowsStr.indexOf(row.join(",")) === -1) {
          allRowsStr.push(row.join(","))
          allRows.push(row)
      }
      if (allColumnsStr.indexOf(column.join(",")) === -1) {
          allColumnsStr.push(column.join(","))
          allColumns.push(column)
      }
      if (allGridsStr.indexOf(grid.join(",")) === -1) {
          allGridsStr.push(grid.join(","))
          allGrids.push(grid)
      }
      this.references.cell_index[i] = {}
      this.references.cell_index[i]["row"] = allRowsStr.indexOf(row.join(","))
      this.references.cell_index[i]["column"] = allColumnsStr.indexOf(column.join(","))
      this.references.cell_index[i]["grid"] = allGridsStr.indexOf(grid.join(","))
    }
    this.references.rows = allRows
    this.references.columns = allColumns
    this.references.grids = allGrids
  }

  // Getting the questioner from the below api
  // Full credits to the api developer
  // https://sugoku2.herokuapp.com/board?difficulty=easy
  start(size, difficulty) {
    fetch("https://sugoku2.herokuapp.com/board?difficulty="+this.difficulties[difficulty]).then(function (resp) {
      resp.json().then(function (res) {
        let board = []
        // res.board = [[0,0,0,0,0,0,4,0,0],[0,0,0,0,0,0,0,8,0],[0,5,0,0,7,0,0,0,0],[0,1,0,3,0,0,8,9,7],[3,0,5,0,0,0,0,2,0],[0,9,0,7,2,0,3,1,0],[0,3,0,0,0,0,0,0,0],[6,0,0,0,0,1,0,4,0],[0,4,0,5,8,0,1,6,3]]
        res.board.forEach(function (i) {
          board = board.concat(i)
        })
        this.setState(this.setupPuzzle(board))
      }.bind(this))
    }.bind(this))
  }

  // Parsing the data from the api response
  setupPuzzle(apiResp) {
    let tempState = {...this.state}
    tempState.data = []
    tempState.ques = []
    apiResp.forEach((item, index) => {
      // Json data, to reduce indexing
      if (item) {
        tempState.data[index] = item
        tempState.ques[index] = true
      }
    });
    return tempState;
  }

  // For handling the input by directly pressing the respective numbers
  handleGridInput(inp, eve) {
    const id = inp.target.dataset.id
    const value = this.validateNum(inp.target.value[inp.target.value.length-1])
    console.log(value)
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

  // Method to update values in the data from the user input
  updateValue(id, value) {
    const tempState = {...this.state}
    let npValues = this.getNotPossibleValues(tempState.data, id, tempState.gridSize)
    tempState.error[id] = false
    tempState.data[id] = value
    if (npValues.indexOf(parseInt(value)) !== -1) {
      tempState.error[id] = true
    }
    this.setState(tempState)
  }

  // Have to validate the input for grid cell.
  validateNum(inp) {
    let intInp = parseInt(inp)
    if (!isNaN(intInp) && intInp > 0 && intInp < (this.state.gridSize+1)) {
      return parseInt(inp)
    }
    return ""
  }

  solve() {
    let data = this.state.data
    let ques = this.state.ques
    let gridSize = this.state.gridSize
    let index = 0
    // Erasing the already filled up cells and starting to solve from scratch
    data = this.resetData(data, ques)
    // Will decide in which direction the loop will proceed
    let prevDir = 1
    let st = Date.now()
    while (index < (gridSize*gridSize)) {
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
        // Skipping the loop if length of the notPossibleValues == gridSize
        if (notPossibleValues.length === gridSize) {
          cachedValue = gridSize+1
        }
        for (let i=cachedValue; i<gridSize+1; i++) {
          if (notPossibleValues.indexOf(i) === -1) {
            data[index] = i
            index = index + 1
            prevDir = 1
            break
          }
        }
        // All the numbers can't be placed and the loop is going backward
        if (prevDir === -1) {
          data[index] = 0
          index = index - 1
          prevDir = -1
        }
      }
    }
    console.log(Date.now() - st)
    let final= {...this.state}
    final.data = data
    this.setState(final.data)
  }

  resetData(data, ques) {
    for (let i=0; i<data.length; i++) {
      if (!this.isQues(i, ques)) {
        data[i] = 0
      }
    }
    return data
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
    let rowData = Uarray.getValuesByIndexes(data, this.getRowIndexes(index, gridSize))
    let columnData = Uarray.getValuesByIndexes(data, this.getColumnIndexes(index, gridSize))
    let subgridData = Uarray.getValuesByIndexes(data, this.getSubgridIndexes(index, gridSize))
    let allData = rowData.concat(columnData.concat(subgridData))
    allData = allData.filter(function (i){if (i){return true}return false})
    return Uarray.removeDuplicates(allData);
  }

  // Will return the indexes of the corresponding row for the given index
  getRowIndexes(index, gridSize) {
    const rowData = []
    // Generating after Data
    for (let i=index+1; i < index+gridSize; i++) {
      if (i % gridSize === 0) {
        break
      }
      rowData.push(i)
    }
    // Generating current and before Data
    for (let i=index; i > index-gridSize; i--) {
      rowData.push(i)
      if (i % gridSize === 0) {
        break
      }
    }
    return rowData
  }

  // Will return the indexes of the corresponding column for the given index
  getColumnIndexes(index, gridSize) {
    const columnData = [index]
    // Generating after Data
    for (let i=index+gridSize; i < gridSize*gridSize; i+=gridSize) {
      columnData.push(i)
    }
    // Generating before Data
    for (let i=index-gridSize; i > -1; i-=gridSize) {
      columnData.push(i)
    }
    return columnData
  }

  // Will return the indexes of the corresponding row for the given index
  // A subgrid is 3x3 grid in a 9x9 sudoku
  getSubgridIndexes(index, gridSize) {
    const subGridSize = Math.sqrt(gridSize)
    let subGridIndexes = []
    // Spliting the entire sudoku grid into subgrid columns
    let subGridIndex = 0
    // Splitting the entire column in sub grid Size
    // e.g. 9x9; 27, 54, 81
    // Find where the index is placed in between the above numbers
    // After this we can get row for each index
    for (let i=0; i<gridSize*gridSize; i+=gridSize*subGridSize) {
      if (index < i+gridSize*subGridSize && index >= i ) {
        subGridIndex = i  / (gridSize*subGridSize)
        break
      }
    }
    // Getting the full gridSize corresponding column (not subgridsize)
    // Sorting the column array splicing it based on the subGridIndex
    let columnIndexes = Uarray.sortAsc(this.getColumnIndexes(index, gridSize)).splice(subGridIndex*subGridSize, subGridSize)
    columnIndexes.forEach((item) => {
      subGridIndexes = subGridIndexes.concat(this.getRowIndexes(item, subGridSize))
    });
    subGridIndexes = subGridIndexes.concat(this.getRowIndexes(index, subGridSize))
    return Uarray.removeDuplicates(subGridIndexes)
  }

  // Remove duplicates

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
          data-error={state.error[curIndex]}
          data-row={this.references.cell_index[curIndex]["row"]}
          data-column={this.references.cell_index[curIndex]["column"]}
          data-grid={this.references.cell_index[curIndex]["grid"]}
          disabled={isQues}
          key={curIndex}
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
    let list = [1,2,3,4,5,6,7,8,9,0]
    for ( let i=0; i<list.length; i++) {
      keyPad.push(<input
        type="button"
        value={list[i]}
        className={styles.keypad + ' ' + styles.grid}
        onClick={this.handleKeypadInput}/>)
    }
    return keyPad
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.settingcontainer}>
          <div className={styles.diffcontainer}>
            <label> Difficulty : </label>
            <select type="number" onChange={this.setDifficulty}>
              <option value="0">Easy</option>
              <option value="1">Medium</option>
              <option value="2">Hard</option>
              <option value="3">Random</option>
            </select>
          </div>
          <input className={styles.solve + ' ' + styles.newgame} type="button" value="New Game" onClick={this.startNewGame} />
          <hr></hr>
        </div>
        <div>
          <div className={styles.gridcontainer}>
            {this.getGrid(this.state)}
          </div>
        </div>
        <div className={styles.keypadcontainer}>
          <div>
            <hr></hr>
            {this.getKeyPad()}
          </div>
          <br></br>
          <input className={styles.solve} type="button" value="SOLVE" onClick={this.solve} />
        </div>
      </div>
    )
  }
}
export default Sudoku
