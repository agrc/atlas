import PropTypes from 'prop-types';
import './Sidebar.css';

export default function Sidebar({ children }) {
  return (
    <div id="sideBar" className="side-bar side-bar--with-border side-bar--open">
      <div className="side-bar__padder">{children}</div>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};
