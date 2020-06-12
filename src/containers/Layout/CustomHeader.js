import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './Header.scss';
import '../App/App.scss';

class CustomHeader extends Component {
  render() {
    let title = this.props.title;
    return (
      <div className="header-custom">
        <div className="custom-title">{title}</div>
      </div>
    )
  }
}

export default withRouter(CustomHeader)
