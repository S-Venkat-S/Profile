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
    this.canvas = React.createRef()
    this.ctx = null
    this.snakeLastDirection = "L"
    this.snake = []
    this.colors = {
      border : "rgb(214, 216, 225)",
      cell1 : "rgb(30, 40, 54)",
      cell2 : "rgb(38, 52, 69)",
      snake : "rgb(45, 139, 211)",
      food : "rgb(228, 63, 50)"
    }
    this.fps = 10
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
    this.height = window.screen.availHeight
    this.width = window.screen.availWidth
    return state;
  }

  componentDidMount() {
    window.addEventListener('touchend', this.touchend);
    window.addEventListener('touchstart', this.touchstart);
    window.addEventListener('touchmove', this.touchmove);
    window.addEventListener('keyup', this.keypress);
    console.log(this.canvas)
    this.ctx = this.canvas.current.getContext("2d")
    // Temporary fix for hiding the scroll in the body tag
    document.querySelector("body").style.overflow = "hidden"
    this.drawBorder()
    this.drawBackground()
    this.snake = this.initSnakePosition()
    this.drawSnake()
    this.update()
    console.log(this.ctx);
  }

  // Initializing the snake position in conter of vertical and horizontal with a size of 3
  initSnakePosition() {
    let totalWidth = parseInt(this.width / this.cellSize)
    let totalHeight = parseInt(this.height / this.cellSize)
    let middleWidth = parseInt(totalWidth/2)
    let middleHeight = parseInt(totalHeight/2)
    return [[middleWidth-1, middleHeight], [middleWidth, middleHeight], [middleWidth+1, middleHeight]]
  }

  drawSnake() {
    for (let cell=0; cell<this.snake.length; cell++) {
      let pos = this.snake[cell]
      let x = pos[0]
      let y = pos[1]
      this.drawPixel(this.offsetX+(x*this.cellSize), this.offsetY+(y*this.cellSize), this.cellSize, this.cellSize, this.colors.snake)
    }
  }

  update() {
    setInterval(this.gameloop.bind(this), 1000/this.fps)
  }

  gameloop() {
    this.move()
    this.drawSnake()
  }

  // Moving the snake based on the this.snakeLastDirection.
  move() {
    let snakeHead = this.snake[this.snake.length-1]
    let snakeFutureHead = [snakeHead[0]+1, snakeHead[1]]
    // Reversing the snake to remove its tail
    this.snake.reverse()
    let removedCell = this.snake.pop()
    this.redrawBackground(removedCell)
    // Reversing the snake back to its normal position
    this.snake.reverse()
    // Adding the future head of the snake to the list
    this.snake.push(snakeFutureHead)
  }

  // Redrawing the background
  redrawBackground(cell) {
    let colors = [this.colors.cell1, this.colors.cell2]
    let x = cell[0]
    let y = cell[1]
    // Recalculating the color index
    let colorIndex = (x*this.cellWidth+y)
    if (this.cellWidth%2 === 0) {
      colorIndex = colorIndex+x
    }
    colorIndex = colorIndex % 2
    this.drawPixel(this.offsetX+x*this.cellSize, this.offsetY+y*this.cellSize, this.cellSize, this.cellSize, colors[colorIndex])
  }

  // Drawing the outside border. Excess area of cellSize*x and cellSize*y
  drawBorder() {
    let overflowX = this.width % this.cellSize
    let overflowY = this.height % this.cellSize
    // Decimal values in the offset or x, y, w, h of the rect makes the rect border transparent in color
    // To fix the above issue it is converted to natural number
    this.offsetX = parseInt(overflowX/2)
    this.offsetY = parseInt(overflowY/2)
    this.ctx.fillStyle = this.colors.border;
    // Painting the top overflow area
    this.ctx.fillRect(0, 0, this.width, overflowY/2);
    // Painting the bottom overflow area
    this.ctx.fillRect(0, this.height-overflowY/2, this.width, overflowY/2);
    // Painting the left overflow area
    this.ctx.fillRect(0, 0, overflowX/2, this.height);
    // Painting the right overflow area
    this.ctx.fillRect(this.width-overflowX/2, 0, overflowX/2, this.height);
    // this.ctx.fillRect(0, 0, 415, 200);
  }

  // Drawing the entire background of the board.
  drawBackground() {
    let totalWidth = parseInt(this.width / this.cellSize)
    let totalHeight = parseInt(this.height / this.cellSize)
    this.cellWidth = totalWidth
    this.cellHeight = totalHeight
    let colors = [this.colors.cell1, this.colors.cell2]
    // return
    for (let w=0; w<totalWidth; w++) {
      for (let h=0; h<totalHeight; h++) {
        this.drawPixel(this.offsetX+(w*this.cellSize), this.offsetY+h*this.cellSize, this.cellSize, this.cellSize, colors[(w*totalWidth+h)%2])
      }
      // For designing the checkered board effect
      if (totalWidth%2 === 0) {
        let temp = colors[1]
        colors[1] = colors[0]
        colors[0] = temp
      }
    }
  }

  // Helper method for drawing the cell
  drawPixel(x, y, w, h, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, w, h);
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
      <canvas ref={this.canvas} width={this.width} height={this.height}></canvas>
    )
  }
}

export default Snake;
