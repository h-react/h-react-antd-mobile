import './TitleAdapt.less';
import React, {Component} from 'react';

class TitleAdapt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      txt: '',
    };

    const type = typeof this.props.children;
    if (type === 'object') {
      this.state.txt = this.props.children.props.children;
    } else if (type === 'string') {
      this.state.txt = this.props.children;
    }
  }

  titleClass = () => {
    const limit = Math.floor(window.screen.availWidth * 0.8 / 18);
    let cls = '';
    if (this.state.txt.length > limit * 2.0) {
      cls = ' tiny-tiny'
    } else if (this.state.txt.length > limit * 1.6) {
      cls = ' tiny';
    } else if (this.state.txt.length > limit * 1.4) {
      cls = ' min';
    } else if (this.state.txt.length > limit * 1.2) {
      cls = ' small';
    } else if (this.state.txt.length > limit) {
      cls = ' little';
    }
    return cls;
  }

  render() {
    return (
      <div
        className={`components-title-adapt ${this.titleClass()} ${this.props.className || ''}`}
        style={{textAlign: this.props.textAlign || 'center', ...this.props.style}}
      >
        {this.props.children || ''}
      </div>
    );
  }
}

export default TitleAdapt;
