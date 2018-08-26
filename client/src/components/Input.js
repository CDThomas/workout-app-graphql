import React, { Component } from "react";
import { css } from "react-emotion";

// const { string, func, bool, number, oneOfType } = PropTypes

// Must be a controlled input. Might change this
// const propTypes = {
//   onChange: func.isRequired,
//   value: oneOfType([string, number]).isRequired,
//   type: string,
//   name: string,
//   placeholder: string,
//   autoFocus: bool
// };

const inputClass = css`
  flex: 1;
  border: none;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  &::-webkit-input-placeholder {
    font-weight: 300;
    font-size: 14px;
  }
  &:focus {
    outline: none;
  }
`;

const defaultProps = {
  type: "text",
  autoFocus: false
};

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    const { type, name, placeholder, onChange, value, autoFocus } = this.props;

    return (
      <input
        className={inputClass}
        onChange={onChange}
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    );
  }
}
// Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
