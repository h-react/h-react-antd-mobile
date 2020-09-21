import './Avatar.less';
import React, {Component} from 'react';

class Avatar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let src = this.props.src;
    if (!src) {
      if (this.props.sex === 2) { // 2女
        src = require('./assets/female.png').default;
      } else {
        src = require('./assets/male.png').default;
      }
    }
    return (
      <img
        className="h-react-avatar"
        alt="avatar"
        src={src}/>
    );
  }
}

export default Avatar;
