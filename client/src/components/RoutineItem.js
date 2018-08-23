import React from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import withFragment from "../utils/withFragment";
import List from "./List";
import styled from "react-emotion";
import { Title } from "./typography";

const FillLink = styled(Link)`
  color: transparent;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const RoutineItem = ({ routine }) => {
  const { id, name } = routine;
  return (
    <List.Item>
      <Title>{name}</Title>
      <FillLink to={`/routines/${id}`} />
    </List.Item>
  );
};

export { RoutineItem };
export default withFragment(RoutineItem, {
  routine: gql`
    fragment RoutineItem_routine on Routine {
      id
      name
    }
  `
});
