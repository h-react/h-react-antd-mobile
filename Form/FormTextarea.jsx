import React, {Component} from 'react';

class FormTextarea extends Component {
  constructor(props) {
    super(props);
  }

  onChange = (evt) => {
    this.props.onChange(evt.target.value, this.props.name, this.props.label);
  }

  render() {
    return (
      <textarea
        rows={this.props.rows || 3}
        value={this.props.value}
        onChange={this.onChange}
      />
    );
  }
}

export default FormTextarea;
