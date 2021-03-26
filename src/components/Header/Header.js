import React from 'react';
import './Header.css';
import logo from './agrc_logo.jpg';
import config from '../../config';

export default function Header({ title, version }) {
  return (
    <div className="app__header">
      <h1 className="header__heading">
        <span>{title}</span>
        <a className="heading__version" href="https://github.com/agrc/atlas/blob/main/CHANGELOG.md" target="_blank" rel="noreferrer">
          {version}
        </a>
      </h1>
      {window.innerWidth >= config.MIN_DESKTOP_WIDTH && <img src={logo} className="heading__img" alt="agrc logo" />}
    </div>
  );
}
