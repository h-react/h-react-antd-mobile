import React, {Component} from 'react';
import {Modal} from 'antd-mobile';
import {I18n} from "../index";


export default class Confirm extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return React.cloneElement(this.props.children, {
      onClick: () => {
        Modal.alert(
          null,
          I18n('Are you sure you want to perform this operation?'),
          [
            {text: I18n('no'), onPress: () => null},
            {text: I18n('yes'), onPress: this.props.onConfirm},
          ]);
      },
    });
  }
}
