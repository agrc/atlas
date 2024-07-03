import PropTypes from 'prop-types';
// import './Sidebar.css';

export default function Sidebar({ children }) {
  return (
    <div className="md:w-80 h-80 md:h-full">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-2" id="main-content">
          {children}
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};
