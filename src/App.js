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
    console.log(this.container.scrollLeft, this.container.scrollTop)
  }

  mouseUp(e) {
    const {innerWidth, innerHeight} = window;
    const {clientX, clientY} = e;

    let halfInnerWidth = ~~(innerWidth / 2);
    let halfInnerHeight = ~~(innerHeight / 2);

    console.log({halfInnerWidth, halfInnerHeight, clientX, clientY})

    if (clientX >= halfInnerWidth) {
      console.log('A')
      this.container.scrollLeft += clientX;
    } else if (clientX < halfInnerWidth) {
      console.log('B')
      this.container.scrollLeft -= clientX;
    }

    if (clientY >= halfInnerHeight) {
      console.log('C')
      this.container.scrollTop += clientY;
    } else if (clientY < halfInnerHeight) {
      console.log('D')
      this.container.scrollTop -= clientY;
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
