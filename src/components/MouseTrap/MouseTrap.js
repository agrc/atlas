import React, { PureComponent } from 'react';
import './MouseTrap.css';

export default class MouseTrap extends PureComponent {
  decimals = 3;
  render() {
    console.log('MouseTrap:render');
    return (
      <div className="mouse-trap">
        {this.props.point.x.toFixed(3)}, {this.props.point.y.toFixed(3)}
      </div>
    )
  }
}
