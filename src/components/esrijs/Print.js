import React, { Component } from 'react';
import Print from '@arcgis/core/widgets/Print';

export default class Printer extends Component {
  render() {
    return (
      <div
        ref={(printDiv) => {
          this.printDiv = printDiv;
        }}
      ></div>
    );
  }

  async componentDidMount() {
    if (this.printer) {
      return;
    }

    this.printer = new Print({
      container: this.printDiv,
      view: this.props.view,
      printServiceUrl: process.env.REACT_APP_PRINT_PROXY,
      templates: [
        {
          label: 'Portrait (PDF)',
          format: 'PDF',
          layout: 'Letter ANSI A Portrait',
          options: {
            legendLayers: [],
          },
        },
        {
          label: 'Landscape (PDF)',
          format: 'PDF',
          layout: 'Letter ANSI A Landscape',
          options: {
            legendLayers: [],
          },
        },
      ],
    });
  }
}
