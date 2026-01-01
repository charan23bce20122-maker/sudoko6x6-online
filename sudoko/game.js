/**
 * LinkedIn-Style Sudoku 6x6 Engine
 * Features: 2x3 Sub-grid validation, Green/Red Blinking, Level Generation
 */

const gameLogic = () => {
    return {
        grid: [],         // Current user board
        solution: [],     // Hidden solved board
        selectedIndex: null,
        level: 1,
        
        // Initialize the game
        init() {
            this.generateNewLevel();
        },

        // 1. GENERATE A VALID 6x6 SUDOKU
        generateNewLevel() {
            // Start with a blank 6x6
            let board = Array(36).fill(0);
            this.solve(board); // Fill board using backtracking
            this.solution = [...board];
            
            // Remove numbers to create the puzzle (difficulty based on level)
            const cellsToKeep = Math.max(12, 20 - this.level); 
            this.grid = board.map((val) => ({
                value: Math.random() > (cellsToKeep/36) ? 0 : val,
                fixed: false,
                isBlinkingGreen: false,
                isBlinkingRed: false
            }));

            // Mark initial numbers as fixed
            this.grid.forEach(cell => { if(cell.value !== 0) cell.fixed = true; });
        },

        // 2. INPUT & VALIDATION
        handleInput(num) {
            if (this.selectedIndex === null || this.grid[this.selectedIndex].fixed) return;

            const idx = this.selectedIndex;
            this.grid[idx].value = num;

            // Check if this move is correct against the solution
            if (num === this.solution[idx]) {
                this.checkAchievements(idx);
            } else {
                this.triggerRedBlink(idx);
            }
        },

        // 3. BLINKING LOGIC (Green for success, Red for failure)
        checkAchievements(idx) {
            const row = Math.floor(idx / 6);
            const col = idx % 6;
            const boxR = Math.floor(row / 2);
            const boxC = Math.floor(col / 3);
            const boxId = boxR * 2 + boxC;

            // Check if Row is complete and correct
            if (this.isRowComplete(row)) this.blinkGreen('row', row);
            
            // Check if Column is complete and correct
            if (this.isColComplete(col)) this.blinkGreen('col', col);

            // Check if 2x3 Box is complete and correct
            if (this.isBoxComplete(boxId)) this.blinkGreen('box', boxId);
        },

        triggerRedBlink(idx) {
            // Blink the specific cell red
            this.grid[idx].isBlinkingRed = true;
            setTimeout(() => {
                this.grid[idx].isBlinkingRed = false;
                this.grid[idx].value = 0; // Clear wrong answer
            }, 500);
        },

        blinkGreen(type, id) {
            this.grid.forEach((cell, i) => {
                let match = false;
                if (type === 'row' && Math.floor(i / 6) === id) match = true;
                if (type === 'col' && (i % 6) === id) match = true;
                if (type === 'box') {
                    const bR = Math.floor(Math.floor(i / 6) / 2);
                    const bC = Math.floor((i % 6) / 3);
                    if ((bR * 2 + bC) === id) match = true;
                }
                
                if (match) {
                    cell.isBlinkingGreen = true;
                    setTimeout(() => cell.isBlinkingGreen = false, 800);
                }
            });
        },

        // 4. HELPER SUDOKU MATH
        isRowComplete(r) {
            for (let c = 0; c < 6; c++) {
                if (this.grid[r * 6 + c].value !== this.solution[r * 6 + c]) return false;
            }
            return true;
        },

        isColComplete(c) {
            for (let r = 0; r < 6; r++) {
                if (this.grid[r * 6 + c].value !== this.solution[r * 6 + c]) return false;
            }
            return true;
        },

        isBoxComplete(boxId) {
            const startRow = Math.floor(boxId / 2) * 2;
            const startCol = (boxId % 2) * 3;
            for (let r = startRow; r < startRow + 2; r++) {
                for (let c = startCol; c < startCol + 3; c++) {
                    if (this.grid[r * 6 + c].value !== this.solution[r * 6 + c]) return false;
                }
            }
            return true;
        },

        // 5. SOLVER (Backtracking)
        solve(board) {
            for (let i = 0; i < 36; i++) {
                if (board[i] === 0) {
                    let nums = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
                    for (let n of nums) {
                        if (this.isValid(board, i, n)) {
                            board[i] = n;
                            if (this.solve(board)) return true;
                            board[i] = 0;
                        }
                    }
                    return false;
                }
            }
            return true;
        },

        isValid(board, idx, num) {
            const r = Math.floor(idx / 6);
            const c = idx % 6;
            // Row & Col check
            for (let i = 0; i < 6; i++) {
                if (board[r * 6 + i] === num || board[i * 6 + c] === num) return false;
            }
            // 2x3 Box check
            const startRow = Math.floor(r / 2) * 2;
            const startCol = Math.floor(c / 3) * 3;
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[(startRow + i) * 6 + (startCol + j)] === num) return false;
                }
            }
            return true;
        }
    }
}


