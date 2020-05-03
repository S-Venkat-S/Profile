import React, { Component } from 'react';
import styles from "./Knightstour.module.css"

class Knightstour extends Component {

  constructor(props) {
    super(props);
    this.startTour = this.startTour.bind(this)
    // Mapping for refernce numbers with indexes
    // {"A8" : 1}
    this.mapping = {}
    this.boardWidth = 90
    this.boardheight = 90
    this.cellwidth = this.boardWidth / 9
    this.cellheight = this.boardheight / 9
    this.boardSize = 7
    this.possibleMovesCache = {}
    this.state = {
      boardSize: this.boardSize,
      solution: []
    }
  }

  // returns the reference of the cell based on the cells index
  getReference(index, boardSize) {
    // The charcode for letter "A" is 65. So starting from there.
    let modulo = index % boardSize
    let divider = parseInt(index / boardSize)
    return String.fromCharCode(65+modulo) + (boardSize - divider)
  }

  // returns x and y of the grid based on the reference (A8 -> {x:0, y:0})
  getVectorFromReference(reference, boardSize) {
    let arr = reference.split("")
    let alpha = arr[0]
    let numeral = arr[1]
    let y = boardSize - parseInt(numeral);
    let x = alpha.charCodeAt(0) - 65;
    return {x, y}
  }

  startTour(inp) {
    // console.log(inp.target.dataset.reference)
    let start = [inp.target.dataset.reference]
    let alreadyPlacedData = {}
    alreadyPlacedData[start] = true
    let st = Date.now()
    let solution = this.solveRec(start, alreadyPlacedData)
    // let solution = this.solve(start, alreadyPlacedData)
    console.log(Date.now() - st)
    let tempState = this.state
    tempState.solution = solution
    this.setState({...tempState})
    // console.log(this.getPossibleMoves("C2", this.boardSize))
  }

  // Solving the problem using the backtraking and recursion
  // This is taking around 8 sec for 7x7 grid while the start is A7
  // After implementing cache kind of thing getPossibleMoves
  // It is now taking 6 sec approx.
  solveRec(solution, alreadyPlacedData) {
    let lastPos = solution[solution.length - 1]
    let allPossibleMoves = this.getPossibleMoves(lastPos, this.boardSize)
    for (let i=0;i<allPossibleMoves.length;i++) {
      let move = allPossibleMoves[i]
      if (!alreadyPlacedData[move]) {
        solution.push(move)
        alreadyPlacedData[move] = true
        solution = this.solveRec(solution, alreadyPlacedData)
        if (solution.length === this.boardSize * this.boardSize) {
          return solution;
        }
        let removedMove = solution.pop()
        alreadyPlacedData[removedMove] = false
      }
    }
    return solution
  }

  // Solving the problem using the backtraking and while loop
  // This is taking around 13 sec for 7x7 grid while the start is A7
  solve(solution, alreadyPlacedData) {
    let removedMove = null
    while (solution.length < this.boardSize * this.boardSize) {
      let lastPos = solution[solution.length - 1]
      let allPossibleMoves = this.getPossibleMoves(lastPos, this.boardSize)
      let isPlaced = false
      let st = 0
      if (allPossibleMoves.indexOf(removedMove) !== -1) {
        st = allPossibleMoves.indexOf(removedMove) + 1;
      }
      for (let i=st;i<allPossibleMoves.length;i++) {
        let move = allPossibleMoves[i]
        if (!alreadyPlacedData[move]) {
          solution.push(move)
          alreadyPlacedData[move] = true
          isPlaced = true
          removedMove = null
          break;
        }
      }
      if (!isPlaced) {
        removedMove = solution.pop()
        alreadyPlacedData[removedMove] = false
      }
    }
    return solution
    // alert(solution.length)
  }

  // Return all the possible moves a knight can make from the cell reference position.
  getPossibleMoves(cellReference, boardSize) {
    if (this.possibleMovesCache[cellReference]) {
      return this.possibleMovesCache[cellReference];
    }
    // The below two list represent the possible moves the knight can make
    // The index 0 in both array represents that, it can move 2 position towards right
    // and 1 bottom, if A8 is input the 0 index output will be C7
    // Similarly all the possible 8 moves are list as an array
    // All the posssible moves are computed and the inappropriate moves will be deleted.
    // Eg: A8 will give [ "C9", "B10", "?9", "B6", "?7", "@6", "C7", "@10" ]
    // out of the above only ["C7", "B6"] are valid
    let xMove = [2, 1, -2, 1, -2, -1, 2, -1]
    let yMove = [1, 2, 1, -2, -1, -2, -1, 2]
    let alpha = cellReference.charCodeAt(0)
    let numeral = parseInt(cellReference[1])
    let allMoves = []
    for (let i=0; i<8; i++) {
      let cAlpha = alpha + xMove[i]
      let cNumeral = numeral + yMove[i]
      if (cAlpha >= 65 && cAlpha < 65+boardSize && cNumeral > 0 && cNumeral <= boardSize) {
        allMoves.push(String.fromCharCode(cAlpha) + cNumeral)
      }
    }
    this.possibleMovesCache[cellReference] = allMoves
    return allMoves;
  }

  renderBoard(boardSize) {
    let board = []
    let bias = 0
    // i denotes the y axis of the grid
    for (let i=0; i<boardSize; i++) {
      // j denotes the x axis of the grid
      // Starting x axis from 1 because of writing cell index
      for (let j=1; j<boardSize+1; j++) {
        // Index for the entire loop. From 0 to (boardSize*boardSize-1)
        // Since we are starting j from 1, we are subtratiing -1 for j to start the index from 1
        // Otherwise the index will start from 1 instead of 0
        let index = (i*boardSize)+j-1;
        let reference = this.getReference(index, boardSize)
        board.push(
          <rect
            x={j*this.cellwidth}
            y={i*this.cellheight}
            height={this.cellheight}
            width={this.cellwidth}
            data-color={(index+bias)%2}
            className={styles.cell}
            data-reference={reference}
            data-index={index}
            onClick={this.startTour}
            />
        )
        this.mapping[reference] = index
      }
      if (boardSize%2 === 0) {
        bias = bias + 1;
      }
    }
    return board;
  }

  renderIndexes(boardSize) {
    let leftNumbers = []
    let bottomAlphas = []
    // Always the left column of cell size will be left open for number indexes
    // We travel down to Y axis and write numbers for reference
    // Since we travel down only in y axis x always be zero
    let xOffset = this.cellwidth / 2.5
    let yOffset = this.cellheight / 1.5
    // The charcode for letter "A" is 65. So starting from there.
    let charIndex = 65
    for (let i=0; i<boardSize;i++) {
      leftNumbers.push(
        <text
          x={0+xOffset}
          y={(i*this.cellheight) + yOffset}
          height={this.cellheight}
          width={this.cellwidth}
          className={styles.indexes}
        >{boardSize-i}</text>
      )
      // We travel from left to right in X axis and write Alphabets for reference
      // Since we travel left only in X axis, y is bottom of the board and it always be size of board
      // Adding 1 default for x axis because the first column is used for numberal indexes
      bottomAlphas.push(
        <text
          x={((i+1)*this.cellwidth)+xOffset}
          y={(boardSize*this.cellheight) + yOffset}
          height={this.cellheight}
          width={this.cellwidth}
          className={styles.indexes}
        >{String.fromCharCode(charIndex+i)}</text>
      )
    }
    return leftNumbers.concat(bottomAlphas);
  }

  renderPath(boardSize, solutionArr) {
    let path = "M"
    for (let i=0; i<solutionArr.length; i++) {
      let cell = solutionArr[i]
      let vector = this.getVectorFromReference(cell, boardSize)
      let xOffset = (this.cellwidth / 2)
      let yOffset = (this.cellheight / 2)
      let lx = (vector.x + 1) * this.cellwidth + xOffset
      let ly = vector.y * this.cellheight + yOffset
      // console.log(lx, ly)/
      path = path + lx + " " + ly + " L"
    }
    return path;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.board}>
          <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
            <g>
              {this.renderIndexes(this.state.boardSize)}
            </g>
            <g>
              {this.renderBoard(this.state.boardSize)}
            </g>
            <g>
              <path
                d={this.renderPath(this.state.boardSize, this.state.solution)}
                fill="None"
                stroke="black"
                />
            </g>
          </svg>
        </div>
      </div>
    )
  }

}

export default Knightstour;
