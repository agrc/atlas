import React, { Component } from 'react';
import { loadModules } from 'esri-loader';


export default class Printer extends Component {
  render() {
    return (<div ref={printDiv => {
      this.printDiv = printDiv;
    }}></div>);
  }

  async componentDidMount() {
    const [Print] = await loadModules(['esri/widgets/Print']);

    if (this.printer) {
      return;
    }

    this.printer = new Print({
      container: this.printDiv,
      view: this.props.view,
      printServiceUrl: process.env.REACT_APP_PRINT_PROXY,
      templates: [{
        label: 'Portrait (PDF)',
        format: 'PDF',
        layout: 'Letter ANSI A Portrait',
        options: {
          legendLayers: []
        }
      }, {
        label: 'Landscape (PDF)',
        format: 'PDF',
        layout: 'Letter ANSI A Landscape',
        options: {
          legendLayers: []
        }
      }]
    })
  }
}
