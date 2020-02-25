import React from 'react';
import './App.css';
import {Base} from "./_components";

class App extends Base {

  state = {
    xPos: 0,
    yPos: 0,
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
    const {innerWidth, innerHeight} = window;
    const {clientX, clientY} = params;

    if (!this.canMove) return new Promise(resolve => resolve());
    this.canMove = false;

    let halfInnerWidth = ~~(innerWidth / 2);
    let halfInnerHeight = ~~(innerHeight / 2);
    let baseVelocity = 4;
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

      await this.setStateAsync({xPos: this.container.scrollLeft, yPos: this.container.scrollTop});
      await this.sleep(timeout);
    }

    this.canMove = true;

  }


  componentDidMount() {
    this.container.addEventListener('mouseup', this.mouseUp);
  }


  componentWillUnmount() {
    this.container.removeEventListener('mouseup', this.mouseUp);
  }


  render() {
    const {
      xPos,
      yPos,
    } = this.state;

    return (<div ref={node => this.container = node} className={`container`}>
      <div className={`coords`}>
        {xPos}, {yPos}
      </div>
      <div ref={node => this.player = node} className={`player`}/>
      <div className={`map`}/>
    </div>);
  }

}

export {App};
