import { Component } from 'react';
import './MouseTrap.css';

export default class MouseTrap extends Component {
  decimals = 3;

  render() {
    const point = {
      x: this.props.point.x.toFixed(this.decimals),
      y: this.props.point.y.toFixed(this.decimals)
    };

    return this.props.children(point);
  }
}
