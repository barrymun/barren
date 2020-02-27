import React from 'react';
import './App.css';
import {Base} from "./_components";

let innerWidth,
  innerHeight,
  halfInnerWidth,
  halfInnerHeight;

function setWindowVars() {
  ({
    innerWidth,
    innerHeight,
  } = window);
  halfInnerWidth = innerWidth / 2;
  halfInnerHeight = innerHeight / 2;
}

setWindowVars();


/**
 *
 */
class App extends Base {

  state = {
    xPos: halfInnerWidth,
    yPos: halfInnerHeight,
    moveToken: null,  // used for move calcs - determines if a move should be cancelled to make way for another move() call
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
  map = null;
  player = null;

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.map = React.createRef();
    this.player = React.createRef();
    this.setMapBorder = this.setMapBorder.bind(this);
    this.resize = this.resize.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.move = this.move.bind(this);
    this.chase = this.chase.bind(this);
    this.shoot = this.shoot.bind(this);
  }


  async componentDidMount() {

    /**
     * attaching event listeners
     */
    this.setMapBorder();
    window.addEventListener('resize', this.resize);
    this.container.addEventListener('mousemove', this.mouseMove);
    // window.setInterval(this.chase, 20);

  }


  componentWillUnmount() {

    /**
     * destroying event listeners
     */
    window.removeEventListener('resize', this.resize);
    this.container.removeEventListener('mousemove', this.mouseMove);

  }


  /**
   * visual internal border to show where player can and cannot move
   */
  setMapBorder() {
    this.map.style.borderLeft = `${~~halfInnerWidth}px solid black`;
    this.map.style.borderRight = `${~~halfInnerWidth}px solid black`;
    this.map.style.borderTop = `${~~halfInnerHeight}px solid black`;
    this.map.style.borderBottom = `${~~halfInnerHeight}px solid black`;
  }


  /**
   * catch window sizing events as the app depends on window variables
   *
   * @param e
   */
  resize(e) {
    setWindowVars();
    this.setMapBorder();
  }


  /**
   * handle mousemove events
   *
   * *** cancellation required, see below
   * some nifty examples in here: https://blog.bloomca.me/2017/12/04/how-to-cancel-your-promise.html
   *
   * @param e
   * @returns {Promise<void>}
   */
  async mouseMove(e) {

    e.preventDefault();

    const {clientX, clientY} = e;
    let {moveToken} = this.state;

    // cancel if a previous move has been made
    if (moveToken != null) moveToken.cancel();

    // reset the moveToken
    await this.setStateAsync({moveToken: {}});

    // redeclare the moveToken so this can be cancelled on the subsequent move (if required)
    ({moveToken} = this.state);

    await this.move({clientX, clientY, token: moveToken});
  }


  /**
   * TODO: improve ...
   *
   * @param params
   * @returns {Promise<>}
   */
  async move(params) {

    const {
      clientX,
      clientY,
      token,
    } = params;

    /**
     * (handling cancellations)
     * this allows the player to perform another move, even if the current move is still in effect,
     * as the currently in effect move will be aborted
     *
     * @type {boolean}
     */
    let cancelled = false;
    token.cancel = () => {
      cancelled = true;
    };

    // returning an empty promise to indicate that the calculations are to be concluded (undefined)
    let ex = new Promise(resolve => resolve());

    let baseVelocity = 2;
    let maxVelocity = 3;  // TODO: determine optimal value
    let xVelocity, yVelocity;
    let timeout = 20;

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

      /**
       * check that the current move has not been cancelled
       */
      if (cancelled) return ex;

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

    let d = 1;
    let detectionRange = 3;

    let r = enemies.map(o => {
      let l = o.position.left;
      let t = o.position.top;

      if (xPos > l + detectionRange) {
        l += d;
      } else if ((xPos - detectionRange <= l) && (l <= xPos + detectionRange)) {
        // TODO: collision
      } else if (xPos < l - detectionRange) {
        l -= d;
      }

      if (yPos > t + detectionRange) {
        t += d;
      } else if ((yPos - detectionRange <= t) && (t <= yPos + detectionRange)) {
        // TODO: collision
      } else if (yPos < t - detectionRange) {
        t -= d;
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


  /**
   *
   * @returns {Promise<void>}
   */
  async shoot() {}


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
      <div ref={node => this.map = node} className={`map`}>
        {enemies.map((o, index) => (<div
          key={index}
          className={`enemy`}
          style={{...o.position}}/>))}
      </div>
      <div ref={node => this.player = node} className={`player`}/>
    </div>);
  }

}

export {App};
