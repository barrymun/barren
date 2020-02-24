import React from 'react';
import './App.css';
import {Base} from "./_components";

class App extends Base {

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

  async mouseUp(e) {
    e.preventDefault();

    const {clientX, clientY} = e;

    await this.move({clientX, clientY})
  }

  async move(params) {
    const {innerWidth, innerHeight} = window;
    const {clientX, clientY} = params;
    // const {container, player} = this;

    if (!this.canMove) return new Promise(resolve => resolve());
    this.canMove = false;

    let halfInnerWidth = ~~(innerWidth / 2);
    let halfInnerHeight = ~~(innerHeight / 2);

    // console.log({halfInnerWidth, halfInnerHeight, clientX, clientY})

    // let i = 0;
    // let limit = 20;
    let velocity = 4;
    let timeout = 20;
    // let timeout = 100;

    let _d1 = clientX - halfInnerWidth;
    let _d2 = halfInnerWidth - clientX;
    let _d3 = clientY - halfInnerHeight;
    let _d4 = halfInnerHeight - clientY;

    // console.log({_d1, _d2, _d3, _d4})

    while (true) {

      if (clientX >= halfInnerWidth) {
        this.container.scrollLeft += (_d1 > velocity) ? velocity : _d1;
        _d1 -= (_d1 > velocity) ? velocity : _d1;
      } else if (clientX < halfInnerWidth) {
        this.container.scrollLeft -= (_d2 > velocity) ? velocity : _d2;
        _d2 -= (_d2 > velocity) ? velocity : _d2;
      }

      if (clientY >= halfInnerHeight) {
        this.container.scrollTop += (_d3 > velocity) ? velocity : _d3;
        _d3 -= (_d3 > velocity) ? velocity : _d3;
      } else if (clientY < halfInnerHeight) {
        this.container.scrollTop -= (_d4 > velocity) ? velocity : _d4;
        _d4 -= (_d4 > velocity) ? velocity : _d4;
      }

      // console.log({_d1, _d2, _d3, _d4})

      if (((_d1 || _d2) === 0) && ((_d3 || _d4) === 0)) {
        break
      }

      if (((_d1 === 0) || (_d2 === 0)) && ((_d3 === 0) || (_d4 === 0))) break;

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
    return (<div ref={node => this.container = node} className={`container`}>
      <div ref={node => this.player = node} className={`player`}/>
      <div className={`map`}/>
    </div>);
  }
}

export {App};
