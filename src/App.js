import React from 'react';
import './App.css';
import {Base} from "./_components";

const {
  innerWidth,
  innerHeight,
} = window;
const halfInnerWidth = innerWidth / 2;
const halfInnerHeight = innerHeight / 2;

class App extends Base {

  state = {
    xPos: halfInnerWidth,
    yPos: halfInnerHeight,
    enemies: [
      {health: 100, position: {left: 10, top: 10}},
      {health: 100, position: {left: 10, top: 40}},
      {health: 100, position: {left: 10, top: 70}},
      {health: 100, position: {left: 10, top: 100}},
      {health: 100, position: {left: 10, top: 130}},
      {health: 100, position: {left: 10, top: 160}},
      {health: 100, position: {left: 10, top: 190}},
      {health: 100, position: {left: 10, top: 220}},
      {health: 100, position: {left: 10, top: 250}},
      {health: 100, position: {left: 10, top: 280}},
    ],
  };
  container = null;
  player = null;
  canMove = true;

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.player = React.createRef();
    this.mouseUp = this.mouseUp.bind(this);
    this.move = this.move.bind(this);
    this.chase = this.chase.bind(this);
  }


  async componentDidMount() {
    this.container.addEventListener('mouseup', this.mouseUp);
    window.setInterval(this.chase, 100);
  }


  componentWillUnmount() {
    this.container.removeEventListener('mouseup', this.mouseUp);
  }


  /**
   *
   * @param e
   * @returns {Promise<void>}
   */
  async mouseUp(e) {
    e.preventDefault();
    const {clientX, clientY} = e;
    await this.move({clientX, clientY})
  }


  /**
   *
   * @param params
   * @returns {Promise<>}
   */
  async move(params) {
    const {clientX, clientY} = params;

    if (!this.canMove) return new Promise(resolve => resolve());
    this.canMove = false;

    let baseVelocity = 4;
    let maxVelocity = 10;  // TODO: determine optimal value
    let xVelocity, yVelocity;
    let timeout = 30;

    // x-axis (_d1 & _d2 will be the same, but one will be negative)
    let _d1 = clientX - halfInnerWidth;
    let _d2 = halfInnerWidth - clientX;

    // y-axis (_d3 & _d4 will be the same, ...)
    let _d3 = clientY - halfInnerHeight;
    let _d4 = halfInnerHeight - clientY;

    let _absd1 = Math.abs(_d1);
    let _absd3 = Math.abs(_d3);

    if (_absd1 >= _absd3) {
      xVelocity = _absd1 / (_absd3 / baseVelocity);
      yVelocity = baseVelocity;
    } else {
      xVelocity = baseVelocity;
      yVelocity = _absd3 / (_absd1 / baseVelocity);
    }

    if (xVelocity > maxVelocity) xVelocity = maxVelocity;
    if (yVelocity > maxVelocity) yVelocity = maxVelocity;

    while (true) {

      if (clientX >= halfInnerWidth) {
        this.container.scrollLeft += (_d1 > xVelocity) ? xVelocity : _d1;
        _d1 -= (_d1 > xVelocity) ? xVelocity : _d1;
      } else if (clientX < halfInnerWidth) {
        this.container.scrollLeft -= (_d2 > xVelocity) ? xVelocity : _d2;
        _d2 -= (_d2 > xVelocity) ? xVelocity : _d2;
      }

      if (clientY >= halfInnerHeight) {
        this.container.scrollTop += (_d3 > yVelocity) ? yVelocity : _d3;
        _d3 -= (_d3 > yVelocity) ? yVelocity : _d3;
      } else if (clientY < halfInnerHeight) {
        this.container.scrollTop -= (_d4 > yVelocity) ? yVelocity : _d4;
        _d4 -= (_d4 > yVelocity) ? yVelocity : _d4;
      }

      if (((_d1 === 0) || (_d2 === 0)) && ((_d3 === 0) || (_d4 === 0))) break;

      await this.setStateAsync({
        xPos: this.container.scrollLeft + halfInnerWidth,
        yPos: this.container.scrollTop + halfInnerHeight,
      });
      await this.sleep(timeout);
    }

    this.canMove = true;

  }


  /**
   *
   * @returns {Promise<void>}
   */
  async chase() {
    const {
      xPos,
      yPos,
      enemies,
    } = this.state;

    let r = enemies.map(o => {
      let l = o.position.left;
      let t = o.position.top;

      if (xPos > l) {
        l += 5
      } else if (xPos === l) {
        // TODO:
      } else {
        l -= 5;
      }

      if (yPos > t) {
        t += 5;
      } else if (yPos === t) {
        // TODO:
      } else {
        t -= 5;
      }

      return {
        ...o,
        position: {
          ...o.position,
          left: l,
          top: t,
        }
      };
    });

    await this.setStateAsync({enemies: r})
  }


  render() {
    const {
      xPos,
      yPos,
      enemies,
    } = this.state;

    return (<div ref={node => this.container = node} className={`container`}>
      <div className={`coords`}>
        {xPos}, {yPos}
      </div>
      <div ref={node => this.player = node} className={`player`}/>
      <div className={`map`}>
        {enemies.map((o, index) => (<div
          key={index}
          className={`enemy`}
          style={{...o.position}}/>))}
      </div>
    </div>);
  }

}

export {App};
