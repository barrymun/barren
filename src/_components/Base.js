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
   * @param seconds: the time in seconds
   * @returns {Promise<>}
   */
  sleep(seconds) {
    return new Promise(r => setTimeout(r, seconds * 1000));
  }

}

export {
  Base,
}