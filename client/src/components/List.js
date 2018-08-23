import React from "react";
import styled from "react-emotion";

const List = props => <ul {...props} />;

const Item = styled("li")`
  border-bottom: 1px solid #e8e8e8;
  padding: 25px;
  position: relative;
  &:hover {
    background-color: #f9f9f9;
  }
`;

List.Item = Item;

export default List;
