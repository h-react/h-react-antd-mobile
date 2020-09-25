import React, {Component} from 'react';
import FormCascader from './FormCascader';
import data from "./assets/region.json";

class FormRegion extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormCascader
        options={data}
        name={this.props.name}
        label={this.props.label}
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}

export default FormRegion;
