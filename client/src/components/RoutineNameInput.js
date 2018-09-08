import React from "react";
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

const RoutineNameInput = ({ onChange, value }) => {
  return <Input type="text" onChange={onChange} value={value} />;
};

export default RoutineNameInput;
