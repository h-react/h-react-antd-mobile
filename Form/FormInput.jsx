import React, {Component} from 'react';

class FormInput extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <input
        className="h-react-form-input"
        label={this.props.label}
        name={this.props.name}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

export default FormInput;
