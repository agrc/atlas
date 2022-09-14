import PropTypes from 'prop-types';
import config from '../../config';
import './Header.css';
import logo from './ugrc_logo.png';

export default function Header({ title, version }) {
  return (
    <div className="app__header">
      <h1 className="header__heading">
        <span>{title}</span>
        <a
          className="heading__version"
          href={`https://github.com/agrc/atlas/releases/v${version}`}
          target="_blank"
          rel="noreferrer"
        >
          {version}
        </a>
      </h1>
      {window.innerWidth >= config.MIN_DESKTOP_WIDTH && <img src={logo} className="heading__img" alt="agrc logo" />}
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};
