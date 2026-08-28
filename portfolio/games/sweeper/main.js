(() => {
  'use strict'

  const levels = {
    level1: { rows: 9, cols: 9, mines: 10, className: 'board-simple' },
    level2: { rows: 16, cols: 16, mines: 40, className: 'board-medium' },
    level3: { rows: 16, cols: 30, mines: 99, className: 'board-hard' }
  }
  const state = {
    board: [],
    rows: 9,
    cols: 9,
    mines: 10,
    safeRemain: 0,
    marked: 10,
    selectedLevel: 'level1',
    currentAction: 'dig',
    gameOn: true,
    started: false,
    time: 0,
    timer: null,
    wrongIndex: [-1, -1]
  }
  const elements = {
    board: document.querySelector('#board'),
    faceButton: document.querySelector('#faceButton'),
    faceImage: document.querySelector('#faceImage'),
    gameStatus: document.querySelector('#gameStatus'),
    levelSelect: document.querySelector('#levelSelect'),
    mineCount: document.querySelector('#mineCount'),
    rulesModal: document.querySelector('#rulesModal'),
    startGame: document.querySelector('#startGame'),
    timeCount: document.querySelector('#timeCount')
  }

  function digitString(value) {
    const normalized = Math.max(-99, Math.min(999, value))
    return normalized < 0 ? `-${String(Math.abs(normalized)).padStart(2, '0')}` : String(normalized).padStart(3, '0')
  }

  function renderDigits(container, value) {
    container.replaceChildren(...[...digitString(value)].map((digit) => {
      const image = new Image()
      image.className = 'number'
      image.src = `assets/digit${digit}.png`
      image.alt = digit
      return image
    }))
  }

  function createBoard() {
    return Array.from({ length: state.rows }, () =>
      Array.from({ length: state.cols }, () => ({
        isMine: false,
        revealed: false,
        marked: false,
        adjacentMines: 0
      }))
    )
  }

  function cellImage(cell, row, col) {
    if (!cell.revealed && cell.marked) return ['assets/flag.png', '已插旗']
    if (!cell.revealed) return null
    if (row === state.wrongIndex[0] && col === state.wrongIndex[1]) return ['assets/mine-death.png', '踩中地雷']
    if (cell.isMine) return ['assets/mine-ceil.png', '地雷']
    if (cell.marked) return ['assets/misflagged.png', '错误标记']
    if (cell.adjacentMines) return [`assets/open${cell.adjacentMines}.png`, `周围有 ${cell.adjacentMines} 个地雷`]
    return null
  }

  function renderBoard() {
    const fragment = document.createDocumentFragment()
    state.board.forEach((row, rowIndex) => {
      const rowElement = document.createElement('div')
      rowElement.className = 'row'
      rowElement.setAttribute('role', 'row')
      row.forEach((cell, colIndex) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = cell.revealed ? 'cell' : 'cell-cover'
        button.dataset.row = rowIndex
        button.dataset.col = colIndex
        button.setAttribute('role', 'gridcell')
        button.setAttribute('aria-label', cell.marked ? '已插旗的格子' : cell.revealed ? '已揭开的格子' : '未揭开的格子')
        const imageData = cellImage(cell, rowIndex, colIndex)
        if (imageData) {
          const image = new Image()
          image.className = 'icon'
          image.src = imageData[0]
          image.alt = imageData[1]
          button.appendChild(image)
        }
        rowElement.appendChild(button)
      })
      fragment.appendChild(rowElement)
    })
    elements.board.replaceChildren(fragment)
  }

  function render() {
    renderDigits(elements.mineCount, state.marked)
    renderDigits(elements.timeCount, state.time)
    renderBoard()
    document.querySelectorAll('[data-action]').forEach((button) => {
      button.classList.toggle('active', button.dataset.action === state.currentAction)
    })
  }

  function calculateAdjacentMines() {
    state.board.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
      if (cell.isMine) return
      let count = 0
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          const neighbor = state.board[rowIndex + rowOffset]?.[colIndex + colOffset]
          if (neighbor?.isMine) count++
        }
      }
      cell.adjacentMines = count
    }))
  }

  function placeMines(safeRow, safeCol) {
    let remaining = state.mines
    while (remaining) {
      const row = Math.floor(Math.random() * state.rows)
      const col = Math.floor(Math.random() * state.cols)
      if (!state.board[row][col].isMine && (row !== safeRow || col !== safeCol)) {
        state.board[row][col].isMine = true
        remaining--
      }
    }
    calculateAdjacentMines()
  }

  function startTimer() {
    clearInterval(state.timer)
    state.timer = setInterval(() => {
      state.time = Math.min(999, state.time + 1)
      renderDigits(elements.timeCount, state.time)
    }, 1000)
  }

  function revealArea(startRow, startCol) {
    const queue = [[startRow, startCol]]
    while (queue.length) {
      const [row, col] = queue.shift()
      const cell = state.board[row]?.[col]
      if (!cell || cell.revealed || cell.marked || cell.isMine) continue
      cell.revealed = true
      state.safeRemain--
      if (cell.adjacentMines) continue
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (rowOffset || colOffset) queue.push([row + rowOffset, col + colOffset])
        }
      }
    }
  }

  function revealAllMines() {
    state.board.flat().forEach((cell) => {
      if (cell.isMine || (cell.marked && !cell.isMine)) cell.revealed = true
    })
  }

  function finish(won) {
    state.gameOn = false
    clearInterval(state.timer)
    revealAllMines()
    elements.faceImage.src = won ? 'assets/win.png' : 'assets/dead.png'
    elements.faceImage.alt = won ? '胜利' : '失败'
    elements.gameStatus.textContent = won ? `挑战成功，用时 ${state.time} 秒` : '踩到地雷，点击笑脸重新开始'
  }

  function revealCell(row, col) {
    const cell = state.board[row][col]
    if (!state.gameOn || cell.revealed || cell.marked) return
    if (!state.started) {
      state.started = true
      placeMines(row, col)
      startTimer()
      elements.gameStatus.textContent = '游戏进行中'
    }
    if (cell.isMine) {
      state.wrongIndex = [row, col]
      finish(false)
    } else {
      revealArea(row, col)
      if (state.safeRemain === 0) finish(true)
    }
    render()
  }

  function updateMark(row, col, shouldMark) {
    const cell = state.board[row][col]
    if (!state.gameOn || cell.revealed || cell.marked === shouldMark) return
    cell.marked = shouldMark
    state.marked += shouldMark ? -1 : 1
    render()
  }

  function startGame() {
    clearInterval(state.timer)
    const level = levels[state.selectedLevel]
    Object.assign(state, {
      rows: level.rows,
      cols: level.cols,
      mines: level.mines,
      safeRemain: level.rows * level.cols - level.mines,
      marked: level.mines,
      gameOn: true,
      started: false,
      time: 0,
      wrongIndex: [-1, -1]
    })
    state.board = createBoard()
    elements.board.className = `cell-grid ${level.className}`
    elements.faceImage.src = 'assets/smile.png'
    elements.faceImage.alt = '游戏进行中'
    elements.gameStatus.textContent = '选择格子开始游戏，首次点击不会踩雷'
    document.documentElement.style.setProperty('--cols', state.cols)
    render()
  }

  elements.board.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-row]')
    if (!cell) return
    const row = Number(cell.dataset.row)
    const col = Number(cell.dataset.col)
    if (state.currentAction === 'dig') revealCell(row, col)
    if (state.currentAction === 'flag') updateMark(row, col, true)
    if (state.currentAction === 'unflag') updateMark(row, col, false)
  })
  elements.board.addEventListener('contextmenu', (event) => {
    const cell = event.target.closest('[data-row]')
    if (!cell) return
    event.preventDefault()
    const row = Number(cell.dataset.row)
    const col = Number(cell.dataset.col)
    updateMark(row, col, !state.board[row][col].marked)
  })
  document.querySelector('.action-buttons').addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action
    if (!action) return
    state.currentAction = action
    render()
  })
  elements.levelSelect.addEventListener('change', () => {
    state.selectedLevel = elements.levelSelect.value
    startGame()
  })
  elements.startGame.addEventListener('click', startGame)
  elements.faceButton.addEventListener('click', startGame)
  document.querySelector('#openRules').addEventListener('click', () => {
    elements.rulesModal.style.display = 'flex'
    document.querySelector('#closeRules').focus()
  })

  startGame()
})()
