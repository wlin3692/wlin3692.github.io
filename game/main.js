new Vue({
  el: '#app',
  data: {
    gameOn: true,
    board: [],
    rows: 9,
    cols: 9,
    mines: 10,
    noMine: 0,
    safeRemain: 0,
    marked: 0,
    markedStr: '000',
    wrongIndex: [-1, -1],
    selectedLevel: 'level1',
    time: 0,
    timeStr: '000',
    timecount: null,
    currentAction: 'dig'          // 新增：当前工具
  },
  mounted () {
    this.startGame()
  },
  methods: {
    /* ==============  以下 4 个新增方法  ============== */
    handleCellClick (r, c) {
      if (!this.gameOn) return
      switch (this.currentAction) {
        case 'dig':    this.revealCell(r, c); break
        case 'flag':   this.markCell(r, c);   break
        case 'unflag': this.unmarkCell(r, c); break
      }
    },
    markCell (r, c) {
      const cell = this.board[r][c]
      if (cell.revealed || cell.marked) return
      cell.marked = true
      this.marked--
      this.markedStr = this.getStr(this.marked)
    },
    unmarkCell (r, c) {
      const cell = this.board[r][c]
      if (cell.revealed || !cell.marked) return
      cell.marked = false
      this.marked++
      this.markedStr = this.getStr(this.marked)
    },

    /* ==============  以下原有方法 0 改动  ============== */
    suitMobile () {
      const mql = window.matchMedia('(max-width:1200px)')
      if (!mql.matches) return 'board'
      return this.selectedLevel === 'level1' ? 'board-simple'
           : this.selectedLevel === 'level2' ? 'board-medium'
           : 'board-hard'
    },
    handleSelection () {
      switch (this.selectedLevel) {
        case 'level1': this.rows = 9;  this.cols = 9;  this.mines = 10; break
        case 'level2': this.rows = 16; this.cols = 16; this.mines = 40; break
        case 'level3': this.rows = 16; this.cols = 30; this.mines = 99; break
      }
      this.startGame()
    },
    startGame () {
      clearInterval(this.timecount)
      this.board = this.generateBoard()
      this.safeRemain = this.rows * this.cols - this.mines
      this.noMine = this.safeRemain
      this.marked = this.mines
      this.markedStr = this.getStr(this.marked)
      this.gameOn = true
      this.wrongIndex = [-1, -1]
      this.time = 0
      this.timeStr = '000'
    },
    generateBoard () {
      const board = []
      for (let i = 0; i < this.rows; i++) {
        const row = []
        for (let j = 0; j < this.cols; j++) {
          row.push({ isMine: false, revealed: false, marked: false, adjacentMines: 0 })
        }
        board.push(row)
      }
      return board
    },
    placeMines (board, clickRow, clickCol) {
      let n = this.mines
      while (n > 0) {
        const r = Math.floor(Math.random() * this.rows)
        const c = Math.floor(Math.random() * this.cols)
        if (!board[r][c].isMine && !(r === clickRow && c === clickCol)) {
          board[r][c].isMine = true
          n--
        }
      }
      this.calculateAdjacentMines(board)
    },
    calculateAdjacentMines (board) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          if (board[i][j].isMine) continue
          let count = 0
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const ni = i + dx, nj = j + dy
              if (ni >= 0 && ni < this.rows && nj >= 0 && nj < this.cols && board[ni][nj].isMine) count++
            }
          }
          board[i][j].adjacentMines = count
        }
      }
    },
    revealCell (r, c) {
      if (!this.gameOn) return
      if (this.safeRemain === this.noMine) {
        this.placeMines(this.board, r, c)
        const _this = this
        this.timecount = setInterval(() => {
          _this.time += 1
          _this.timeStr = _this.getStr(_this.time)
        }, 1000)
      }
      const cell = this.board[r][c]
      if (!cell.revealed && !cell.marked) {
        cell.revealed = true
        if (cell.isMine) {
          this.wrongIndex = [r, c]
          this.showDetail()
          clearInterval(this.timecount)
          alert('Game Over！不好意思，游戏结束，踩到地雷了哦，再接再厉吧！')
          this.gameOn = false
        } else if (cell.adjacentMines === 0) {
          this.revealAdjacentCells(r, c)
        }
        this.safeRemain -= 1
        if (this.safeRemain === 0) {
          this.showDetail()
          clearInterval(this.timecount)
          alert('You Won！哇塞哇塞，恭喜你拆掉了所有地雷，相当厉害呢，试试更难的模式吧！')
          this.gameOn = false
        }
      }
    },
    markupCell (r, c) {                // 原右键方法保留
      event.preventDefault()
      if (!this.gameOn) return
      const cell = this.board[r][c]
      if (!cell.revealed) {
        if (!cell.marked) {
          this.marked -= 1
        } else {
          this.marked += 1
        }
        this.markedStr = this.getStr(this.marked)
        cell.marked = !cell.marked
      }
    },
    revealAdjacentCells (r, c) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nr = r + dx, nc = c + dy
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            const cell = this.board[nr][nc]
            if (!cell.revealed && !cell.isMine) {
              cell.revealed = true
              this.safeRemain -= 1
              if (cell.adjacentMines === 0) this.revealAdjacentCells(nr, nc)
            }
          }
        }
      }
    },
    showDetail () {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          const cell = this.board[i][j]
          if (cell.isMine || (cell.marked && !cell.isMine)) cell.revealed = true
        }
      }
    },
    getStr (num) {
      const s = String(num)
      return s.length === 1 ? '00' + s : s.length === 2 ? '0' + s : s
    }
  }
})