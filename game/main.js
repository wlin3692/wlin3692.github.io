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
        /* ===== 新增 ===== */
        mode: 'dig',        // dig | flag | unflag
        isMobile: false     // 是否为手机
    },
    mounted() {
        this.isMobile = window.matchMedia('(max-width: 1200px)').matches;
        this.startGame();
    },
    methods: {
        suitMobile() {
            const m = window.matchMedia('(max-width: 1200px)');
            if (m.matches) {
                if (this.selectedLevel === 'level1') return 'board-simple';
                if (this.selectedLevel === 'level2') return 'board-medium';
                return 'board-hard';
            }
            return 'board';
        },

        handleSelection() {
            switch (this.selectedLevel) {
                case 'level1':
                    this.rows = 9;  this.cols = 9;  this.mines = 10; break;
                case 'level2':
                    this.rows = 16; this.cols = 16; this.mines = 40; break;
                case 'level3':
                    this.rows = 16; this.cols = 30; this.mines = 99; break;
            }
            this.startGame();
        },

        startGame() {
            clearInterval(this.timecount);
            this.board = this.generateBoard();
            this.safeRemain = this.rows * this.cols - this.mines;
            this.noMine   = this.safeRemain;
            this.marked   = this.mines;
            this.markedStr= this.getStr(this.marked);
            this.gameOn   = true;
            this.wrongIndex=[-1,-1];
            this.time=0; this.timeStr='000';
        },

        generateBoard() {
            const board = [];
            for (let i = 0; i < this.rows; i++) {
                const row = [];
                for (let j = 0; j < this.cols; j++) row.push({
                    isMine: false, revealed: false, marked: false, adjacentMines: 0
                });
                board.push(row);
            }
            return board;
        },

        placeMines(board, click_row, click_col) {
            let n = this.mines;
            while (n) {
                const r = Math.floor(Math.random() * this.rows);
                const c = Math.floor(Math.random() * this.cols);
                if (!board[r][c].isMine && !(r === click_row && c === click_col)) {
                    board[r][c].isMine = true; n--;
                }
            }
            this.calculateAdjacentMines(board);
        },

        calculateAdjacentMines(board) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    if (board[i][j].isMine) continue;
                    let cnt = 0;
                    for (let dx = -1; dx <= 1; dx++)
                        for (let dy = -1; dy <= 1; dy++) {
                            const x = i + dx, y = j + dy;
                            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && board[x][y].isMine) cnt++;
                        }
                    board[i][j].adjacentMines = cnt;
                }
            }
        },

        /* ===== 统一点击入口 ===== */
        handleCellClick(row, col) {
            if (!this.gameOn) return;
            if (this.isMobile) {
                if (this.mode === 'dig')      this.revealCell(row, col);
                else if (this.mode === 'flag')   this.setFlag(row, col, true);
                else if (this.mode === 'unflag') this.setFlag(row, col, false);
            } else {
                this.revealCell(row, col);
            }
        },

        /* ===== 真正的挖掘逻辑 ===== */
        revealCell(row, col) {
            if (!this.gameOn) return;
            if (this.safeRemain === this.noMine) {
                this.placeMines(this.board, row, col);
                const _this = this;
                this.timecount = setInterval(() => {
                    _this.time++; _this.timeStr = _this.getStr(_this.time);
                }, 1000);
            }
            const cell = this.board[row][col];
            if (cell.revealed || cell.marked) return;
            cell.revealed = true;
            if (cell.isMine) {
                this.wrongIndex = [row, col]; this.showDetail();
                clearInterval(this.timecount); alert('Game Over!'); this.gameOn = false; return;
            }
            if (cell.adjacentMines === 0) this.revealAdjacentCells(row, col);
            this.safeRemain--;
            if (this.safeRemain === 0) {
                this.showDetail(); clearInterval(this.timecount); alert('You Won!'); this.gameOn = false;
            }
        },

        /* ===== 插旗/拔旗 ===== */
        setFlag(row, col, flag) {
            const cell = this.board[row][col];
            if (cell.revealed) return;
            if (flag && !cell.marked) {        // 插旗
                cell.marked = true; this.marked--; 
            } else if (!flag && cell.marked) { // 拔旗
                cell.marked = false; this.marked++;
            }
            this.markedStr = this.getStr(this.marked);
        },

        /* ===== 电脑右键保持兼容 ===== */
        markupCell(row, col) {
            event.preventDefault();
            if (!this.gameOn || this.isMobile) return;
            const cell = this.board[row][col];
            if (cell.revealed) return;
            if (!cell.marked) { cell.marked = true; this.marked--; }
            else { cell.marked = false; this.marked++; }
            this.markedStr = this.getStr(this.marked);
        },

        revealAdjacentCells(row, col) {
            for (let dx = -1; dx <= 1; dx++)
                for (let dy = -1; dy <= 1; dy++) {
                    const x = row + dx, y = col + dy;
                    if (x < 0 || x >= this.rows || y < 0 || y >= this.cols) continue;
                    const c = this.board[x][y];
                    if (!c.revealed && !c.isMine) {
                        c.revealed = true; this.safeRemain--;
                        if (c.adjacentMines === 0) this.revealAdjacentCells(x, y);
                    }
                }
        },

        showDetail() {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++) {
                    const c = this.board[i][j];
                    if (c.isMine || (c.marked && !c.isMine)) c.revealed = true;
                }
        },

        getStr(num) {
            const s = String(num);
            return s.length === 1 ? '00' + s : s.length === 2 ? '0' + s : s;
        }
    }
});