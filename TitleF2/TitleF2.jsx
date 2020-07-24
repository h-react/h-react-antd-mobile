import './TitleF2.less';
import React, {Component} from 'react';

class TitleF2 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="components-title-f2">
        {this.props.message}
      </div>
    );
  }
}

export default TitleF2;
