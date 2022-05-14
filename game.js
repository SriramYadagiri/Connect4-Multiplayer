const cols = 7;
const rows = 6;

module.exports = {
    rows: rows,
    cols: cols,
    createBoard: function createBoard() {
        let arr = [];
        for (let i = 0; i < cols; i++) {
            arr[i] = [];
            for (let j = 0; j < rows; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    },
    checkWinner: function checkWinner(board) {
        let draw = true;
    
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (board[x][y] == 0) {
                    draw = false;
                    break;
                }
            }
        }
    
        if (draw) return "draw";
    
        //vertical
        for(var x = 0; x<cols-3; x++) {
            for(var y = 0; y<rows; y++) {
                if(board[x][y]>0) {
                    if(board[x][y] == board[x+1][y] && board[x+1][y] == board[x+2][y] && board[x+2][y] == board[x+3][y]) {
                        let winner = board[x][y];
                        board[x][y] = 3;
                        board[x+1][y] = 3;
                        board[x+2][y] = 3;
                        board[x+3][y] = 3;
                        return winner;
                    }
                }
            }
        }
    
        //horizontal
        for(var x = 0; x<cols; x++) {
            for(var y = 0; y<rows-3; y++) {
                if(board[x][y]>0) {
                    if(board[x][y] == board[x][y+1] && board[x][y+1] == board[x][y+2] && board[x][y+2] == board[x][y+3]) {
                        let winner = board[x][y];
                        board[x][y] = 3;
                        board[x][y+1] = 3;
                        board[x][y+2] = 3;
                        board[x][y+3] = 3;
                        return winner;
                    }
                }
            }
        }
    
        //positive slope
        for(var x = 0; x<cols-3; x++) {
            for(var y = 3; y<rows; y++) {
                if(board[x][y]>0) {
                    if(board[x][y] == board[x+1][y-1] && board[x+1][y-1] == board[x+2][y-2] && board[x+2][y-2] == board[x+3][y-3]) {
                        let winner = board[x][y];
                        board[x][y] = 3;
                        board[x+1][y-1] = 3;
                        board[x+2][y-2] = 3;
                        board[x+3][y-3] = 3;
                        return winner;
                    }
                }
            }
        }
        
        //negative slope
        for(var x = 0; x<cols-3; x++) {
            for(var y = 0; y<rows-3; y++) {
                if(board[x][y]>0) {
                    if(board[x][y] == board[x+1][y+1] && board[x+1][y+1] == board[x+2][y+2] && board[x+2][y+2] == board[x+3][y+3]) {
                        let winner = board[x][y];
                        board[x][y] = 3;
                        board[x+1][y+1] = 3;
                        board[x+2][y+2] = 3;
                        board[x+3][y+3] = 3;
                        return winner;
                    }
                }
            }
        }
    
        return null;
    }
}