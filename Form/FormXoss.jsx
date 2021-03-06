import React, {Component} from 'react';
import axios from "axios";
import {ImagePicker} from "antd-mobile";
import Xoss from "../Xoss";
import {LocalStorage} from "../index";

class FormXoss extends Component {
  constructor(props) {
    super(props);
  }

  formatHash = (data) => {

    data.forEach((hash, idx) => {
      if (hash.indexOf('/xoss_download') !== -1) {
        let h = hash.split('/')[2];
        h = h.split('|')[0];
        data[idx] = h;
      }
    });
    console.log("data", data);
    return data;
  }

  onChange = (files) => {
    const newFiles = [];
    let formData = new FormData();
    formData.append('scope', 'XOSS_UPLOAD');
    formData.append('client_id', LocalStorage.get('cid'));
    let curi = 0;
    let cur = {};
    files.forEach((obj, idx) => {
      if (obj.url.indexOf('base64') !== -1) {
        formData.append('file[]', obj.file);
        cur[curi] = idx;
        newFiles[idx] = null;
        curi++;
      } else {
        newFiles[idx] = obj.url;
      }
    });
    if (curi > 0) {
      axios.post('/xoss', formData).then((response) => {
        if (typeof response.data === 'object') {
          if (response.data.error === 0) {
            response.data.data.forEach((val, idx) => {
              newFiles[cur[idx]] = val.data.xoss_key;
            });
            this.props.onChange(this.formatHash(newFiles), this.props.name, this.props.label);
          }
        }
      });
    } else {
      this.props.onChange(this.formatHash(newFiles), this.props.name, this.props.label);
    }
  }

  files = () => {
    const fs = [];
    const values = this.props.value || [];
    if (values) {
      values.forEach((hash) => {
        fs.push({
          url: Xoss.url(hash),
          id: hash,
        });
      });
    }
    return fs;
  }

  render() {
    return (
      <ImagePicker
        files={this.files()}
        selectable={this.files().length < (this.props.max || 1)}
        accept="image/gif,image/jpeg,image/jpg,image/png"
        onChange={this.onChange}
        onImageClick={(index, fs) => console.log(index, fs)}
      />
    );
  }
}

export default FormXoss;
