import React, { Component } from 'react';
import NavBar from '../navbar/navbar.jsx';
import TetrisAnimation from "../../../View/Utility/TetrisAnimation.js";
import './square_frame.css';

class SquareFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 0,
            tetrisBlocks: [],
        };
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.updateSize();
        window.addEventListener('resize', this.updateSize);
        if (this.props.showTetrisAnimation) {
            this.initTetrisBlocks();
            this.animationId = requestAnimationFrame(this.updateTetrisBlocks);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSize);
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    updateSize = () => {
        const minSize = Math.min(window.innerWidth, window.innerHeight);
        this.setState({ size: minSize * 0.8 }, () => {
            if (this.props.showTetrisAnimation) {
                this.initTetrisBlocks();
            }
        });
    }

    initTetrisBlocks = () => {
        const { size } = this.state;
        const tetrisBlocks = Array(8).fill().map(() => new TetrisAnimation(size));
        this.setState({ tetrisBlocks });
    }

    updateTetrisBlocks = () => {
        if (!this.props.showTetrisAnimation) return;

        const { tetrisBlocks, size } = this.state;
        const ctx = this.canvasRef.current.getContext('2d');

        ctx.clearRect(0, 0, size, size);

        tetrisBlocks.forEach(block => {
            block.update(size);
            block.draw(ctx);
        });

        this.animationId = requestAnimationFrame(this.updateTetrisBlocks);
    }

    render() {
        const { size } = this.state;
        const { children, hideNavBar = false, showTetrisAnimation = false } = this.props;

        return (
            <div className="frame-container gameboy-screen">
                {!hideNavBar && <NavBar navBarWidth={`${size}px`} />}
                <div className="square-frame" style={{ width: `${size}px`, height: `${size}px` }}>
                    {showTetrisAnimation && (
                        <canvas
                            ref={this.canvasRef}
                            width={size}
                            height={size}
                            className="tetris-canvas"
                        />
                    )}
                    <div className="content-container">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

export default SquareFrame;