import React, { PureComponent } from 'react';
import './MapLens.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'reactstrap';

export default class MapLens extends PureComponent {
  render() {
    return (
      <div id="centerContainer" className={'map-lens map-lens--with-border' + (this.props.sideBarOpen ? ' map-lens--side-bar-open' : '')}>
        <Button size="sm" color="info" className="map-lens__sidebar btn btn-default btn-xs" onClick={this.props.toggleSidebar}>
          {this.props.sideBarOpen ? <FontAwesomeIcon icon={faChevronLeft} size='xs' /> : <FontAwesomeIcon icon={faChevronLeft} size='xs' flip='horizontal' /> }
        </Button>
        {this.props.children}
      </div>
    );
  }
}
