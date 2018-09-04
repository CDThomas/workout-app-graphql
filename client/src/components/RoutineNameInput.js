import React, { Component } from "react";
import styled from "react-emotion";

const Input = styled("input")`
  background: none;
  border: none;
  border-bottom: 1px solid #5f5f5f;
  font-size: 24px;
  color: #5f5f5f;
  padding: 0 0 2px 0;
  margin-right: 15px;
  &:focus {
    outline: none;
  }
`;

// TODO: Try moving this up a level and using props === state to determine if
//       changes have persisted.
class RoutineNameInput extends Component {
  state = {
    name: this.props.name
  };

  handleChangeRoutineName = evt => {
    const { onChange } = this.props;
    const newName = evt.target.value;

    onChange && onChange(newName);
    this.setState({ name: newName });
  };

  render() {
    const { name } = this.state;

    return (
      <Input type="text" onChange={this.handleChangeRoutineName} value={name} />
    );
  }
}

export default RoutineNameInput;
