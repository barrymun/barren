import React from 'react';
import './App.css';
import {Base} from "./_components";

class App extends Base {

  container = null;
  player = null;

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.player = React.createRef();
    this.mouseUp = this.mouseUp.bind(this);
    this.move = this.move.bind(this);
  }

  mouseUp(e) {
    e.preventDefault();

    const {clientX, clientY} = e;

    this.move({clientX, clientY})
  }

  async move(params) {
    const {innerWidth, innerHeight} = window;
    const {clientX, clientY} = params;
    // const {container, player} = this;

    let halfInnerWidth = ~~(innerWidth / 2);
    let halfInnerHeight = ~~(innerHeight / 2);

    // console.log({halfInnerWidth, halfInnerHeight, clientX, clientY})

    let i = 0;
    let limit = 20;
    let timeout = 20;

    while (i < limit) {
      if (clientX >= halfInnerWidth) {
        this.container.scrollLeft += ~~((clientX - halfInnerWidth) / limit);
      } else if (clientX < halfInnerWidth) {
        this.container.scrollLeft -= ~~((halfInnerWidth - clientX) / limit);
      }

      if (clientY >= halfInnerHeight) {
        this.container.scrollTop += ~~((clientY - halfInnerHeight) / limit);
      } else if (clientY < halfInnerHeight) {
        this.container.scrollTop -= ~~((halfInnerHeight - clientY) / limit);
      }

      i += 1;
      await this.sleep(timeout);
    }
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
