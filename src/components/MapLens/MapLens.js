import React from 'react';
import './MapLens.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'reactstrap';

export default function MapLens({ sideBarOpen, toggleSidebar, children }) {
  return (
    <div
      id="centerContainer"
      className={'map-lens map-lens--with-border' + (sideBarOpen ? ' map-lens--side-bar-open' : '')}
    >
      <Button size="sm" color="info" className="map-lens__sidebar btn btn-default btn-xs" onClick={toggleSidebar}>
        {sideBarOpen ? (
          <FontAwesomeIcon icon={faChevronLeft} size="xs" />
        ) : (
          <FontAwesomeIcon icon={faChevronLeft} size="xs" flip="horizontal" />
        )}
      </Button>
      {children}
    </div>
  );
}
