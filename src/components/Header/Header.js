import React, { PureComponent } from 'react';
import './Header.css';
import logo from './agrc_logo.jpg';

export default class Header extends PureComponent {
  render() {
    return (
      <div className="app__header">
        <h1 className="header__heading">
          <span>{this.props.title}</span>
          <a className="heading__version" href="/changelog.html" target="_blank" rel="noopener">{this.props.version}</a>
        </h1>
        <img src={logo} className="heading__img" alt="agrc logo" />
      </div>
    )
  }
}
