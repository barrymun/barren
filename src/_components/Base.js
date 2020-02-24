import React from 'react';

class Base extends React.Component {

  constructor(props) {
    super(props);
    this.setStateAsync = this.setStateAsync.bind(this);
    this.sleep = this.sleep.bind(this);
  }


  /**
   *
   * @param state
   * @returns {Promise<>}
   */
  setStateAsync(state) {
    return new Promise(resolve => this.setState(state, resolve));
  }


  /**
   *
   * @param ms: the time in ms
   * @returns {Promise<>}
   */
  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

}

export {
  Base,
}