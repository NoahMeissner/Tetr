
/*
    TetrisAnimation Class: This class handles the logic for animating Tetris pieces on a canvas.
    It creates randomly shaped Tetris pieces that fall from the top of the canvas and reset once they leave the bottom.
*/


class TetrisAnimation {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.calculateSizes();
        this.resetPiece();
    }

    calculateSizes() {
        this.blockSize = Math.max(15, Math.floor(this.canvasWidth / 20));
        this.columns = Math.floor(this.canvasWidth / this.blockSize);
    }

    resetPiece() {
        this.x = Math.floor(Math.random() * this.columns) * this.blockSize;
        this.y = -4 * this.blockSize;
        this.speed = this.blockSize / 10;
        this.shape = this.getRandomShape();
        this.moveCounter = 0;
        this.moveDelay = Math.floor(Math.random() * 3) + 4;
    }

    getRandomShape() {
        const shapes = [
            [[1, 1], [1, 1]], // Square
            [[1, 1, 1, 1]], // Line
            [[1, 1, 1], [0, 1, 0]], // T
            [[1, 1, 0], [0, 1, 1]], // Z
            [[0, 1, 1], [1, 1, 0]], // S
            [[1, 1, 1], [1, 0, 0]], // L
            [[1, 1, 1], [0, 0, 1]]  // J
        ];
        return shapes[Math.floor(Math.random() * shapes.length)];
    }

    update() {
        this.moveCounter++;
        if (this.moveCounter >= this.moveDelay) {
            this.y += this.speed;
            this.moveCounter = 0;
        }

        if (this.y > this.canvasHeight) {
            this.resetPiece();
        }
    }

    draw(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;

        this.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell) {
                    const x = this.x + j * this.blockSize;
                    const y = this.y + i * this.blockSize;
                    ctx.strokeRect(x, y, this.blockSize, this.blockSize);
                }
            });
        });
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.calculateSizes();
        this.resetPiece();
    }
}

export default TetrisAnimation;